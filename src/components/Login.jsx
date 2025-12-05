import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { MdDescription } from 'react-icons/md';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;

  body.dark-theme & {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: ${float} 20s ease-in-out infinite;
  }
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 48px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  z-index: 1;

  body.dark-theme & {
    background: #2d2d2d;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 32px;

  .logo-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    animation: ${float} 3s ease-in-out infinite;

    body.dark-theme & {
      background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    }
  }

  h1 {
    font-size: 24px;
    font-weight: 700;
    color: ${theme.colors.gray900};
    margin: 0;

    body.dark-theme & {
      color: #e5e5e5;
    }
  }

  p {
    color: ${theme.colors.gray600};
    font-size: 14px;
    margin: 0;

    body.dark-theme & {
      color: #b0b0b0;
    }
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
    font-weight: 500;
    color: ${theme.colors.gray700};
    font-size: 14px;

    body.dark-theme & {
      color: #e5e5e5;
    }
  }

  input {
    padding: 12px 16px;
    border: 1px solid ${theme.colors.gray300};
    border-radius: 6px;
    font-size: 14px;
    transition: all ${theme.transitions.fast};
    font-family: inherit;
    background: white;

    body.dark-theme & {
      background: #1f1f1f;
      border-color: #3d3d3d;
      color: #e5e5e5;
    }

    &:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);

      body.dark-theme & {
        border-color: #7c3aed;
      }
    }

    &::placeholder {
      color: ${theme.colors.gray400};

      body.dark-theme & {
        color: #6d6d6d;
      }
    }
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all ${theme.transitions.base};
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

  body.dark-theme & {
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid #fecaca;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 13px;

  a {
    color: ${theme.colors.gray600};
    text-decoration: none;
    
    &:hover {
      color: #6366f1;
      text-decoration: underline;
    }
  }
`;

const InfoBox = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  padding: 12px;
  margin-top: 24px;
  font-size: 12px;
  color: #0369a1;

  body.dark-theme & {
    background: #1e3a5f;
    border-color: #2d5a8f;
    color: #7dd3fc;
  }

  strong {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
  }

  p {
    margin: 2px 0;
  }
`;

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login', formData);
      const { token, user } = res.data;

      // Store token first
      localStorage.setItem('token', token);

      // Update axios default header
      axios.defaults.headers.common['x-auth-token'] = token;

      // Dispatch custom event to reload settings
      window.dispatchEvent(new Event('userLoggedIn'));

      // Then call onLogin
      onLogin(user, token);
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <div className="logo-icon"><MdDescription size={48} /></div>
          <h1>Burial Permit Manager</h1>
          <p>Access your permit data securely.</p>
        </Logo>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Username or Email</label>
            <input
              type="email"
              name="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </SubmitButton>
        </Form>

        <FooterLinks>
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/support">Support Contact</Link>
        </FooterLinks>

        <InfoBox>
          <strong>Default Credentials</strong>
          <p>Email: admin@burial-permit.com</p>
          <p>Password: admin123</p>
        </InfoBox>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;
