import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../utils/axios';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { MdLock, MdArrowBack, MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 48px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  body.dark-theme & {
    background: #2d2d2d;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.gray900};
  margin-bottom: 8px;

  body.dark-theme & {
    color: #e5e5e5;
  }
`;

const Subtitle = styled.p`
  color: ${theme.colors.gray600};
  margin-bottom: 32px;
  line-height: 1.6;

  body.dark-theme & {
    color: #b0b0b0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.gray700};

    body.dark-theme & {
      color: #e5e5e5;
    }
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    padding: 12px 40px 12px 16px;
    border: 2px solid ${theme.colors.gray300};
    border-radius: 8px;
    font-size: 15px;
    transition: all 0.2s;

    body.dark-theme & {
      background: #1f1f1f;
      border-color: #3d3d3d;
      color: #e5e5e5;
    }

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: ${theme.colors.gray500};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;

  &:hover {
    color: ${theme.colors.gray700};
  }
`;

const Button = styled.button`
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  margin-top: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const Message = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  background: ${props => props.$type === 'success' ? '#d1fae5' : '#fee2e2'};
  color: ${props => props.$type === 'success' ? '#065f46' : '#991b1b'};
  border: 1px solid ${props => props.$type === 'success' ? '#6ee7b7' : '#fca5a5'};

  body.dark-theme & {
    background: ${props => props.$type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
    color: ${props => props.$type === 'success' ? '#6ee7b7' : '#fca5a5'};
  }
`;

const PasswordRequirements = styled.ul`
  font-size: 13px;
  color: ${theme.colors.gray600};
  margin-top: 8px;
  padding-left: 20px;

  li {
    margin-bottom: 4px;
  }

  body.dark-theme & {
    color: #b0b0b0;
  }
`;

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setMessage({ type: 'error', text: 'Invalid or missing reset token' });
    }
  }, [token]);

  const validatePassword = () => {
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return false;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validatePassword()) return;

    setLoading(true);

    try {
      const res = await axios.post('/api/auth/reset-password', {
        token,
        newPassword: password
      });
      setMessage({ type: 'success', text: res.data.msg });
      setPassword('');
      setConfirmPassword('');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.msg || 'Failed to reset password. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Reset Password</Title>
        <Subtitle>
          Enter your new password below.
        </Subtitle>

        {message.text && (
          <Message $type={message.type}>{message.text}</Message>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>New Password</label>
            <InputWrapper>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={!token}
              />
              <ToggleButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </ToggleButton>
            </InputWrapper>
            <PasswordRequirements>
              <li>At least 6 characters long</li>
              <li>Mix of letters and numbers recommended</li>
            </PasswordRequirements>
          </FormGroup>

          <FormGroup>
            <label>Confirm Password</label>
            <InputWrapper>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                disabled={!token}
              />
              <ToggleButton
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </ToggleButton>
            </InputWrapper>
          </FormGroup>

          <Button type="submit" disabled={loading || !token}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Form>

        <BackLink to="/login">
          <MdArrowBack size={18} />
          Back to Login
        </BackLink>
      </Card>
    </Container>
  );
}

export default ResetPassword;
