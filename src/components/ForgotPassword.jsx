import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { MdEmail, MdArrowBack } from 'react-icons/md';

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

  input {
    padding: 12px 16px;
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

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage({ type: 'success', text: res.data.msg });
      setEmail('');
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.msg || 'Failed to send reset email. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Forgot Password?</Title>
        <Subtitle>
          Enter your email address and we'll send you a link to reset your password.
        </Subtitle>

        {message.text && (
          <Message $type={message.type}>{message.text}</Message>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;
