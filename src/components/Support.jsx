import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../styles/theme';
import { MdEmail, MdPhone, MdLocationOn, MdArrowBack, MdHelp } from 'react-icons/md';

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
  max-width: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  body.dark-theme & {
    background: #2d2d2d;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${theme.colors.gray900};
  margin-bottom: 8px;

  body.dark-theme & {
    color: #e5e5e5;
  }
`;

const Subtitle = styled.p`
  color: ${theme.colors.gray600};
  font-size: 16px;
  line-height: 1.6;

  body.dark-theme & {
    color: #b0b0b0;
  }
`;

const ContactSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: ${theme.colors.gray50};
  border-radius: 12px;
  text-decoration: none;
  color: ${theme.colors.gray900};
  transition: all 0.2s;
  border: 2px solid transparent;

  body.dark-theme & {
    background: #1f1f1f;
    color: #e5e5e5;
  }

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }

  .icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .content {
    flex: 1;

    .label {
      font-size: 13px;
      color: ${theme.colors.gray500};
      margin-bottom: 4px;

      body.dark-theme & {
        color: #a0a0a0;
      }
    }

    .value {
      font-size: 16px;
      font-weight: 600;
    }
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  justify-content: center;

  &:hover {
    text-decoration: underline;
  }
`;

function Support() {
  return (
    <Container>
      <Card>
        <Header>
          <IconWrapper>
            <MdHelp size={40} color="white" />
          </IconWrapper>
          <Title>Help & Support</Title>
          <Subtitle>
            Need assistance? We're here to help. Contact our support team for any questions or issues.
          </Subtitle>
        </Header>

        <ContactSection>
          <ContactItem href="mailto:support@burial-permit.com">
            <div className="icon">
              <MdEmail size={24} />
            </div>
            <div className="content">
              <div className="label">Email Support</div>
              <div className="value">support@burial-permit.com</div>
            </div>
          </ContactItem>

          <ContactItem href="tel:+254700000000">
            <div className="icon">
              <MdPhone size={24} />
            </div>
            <div className="content">
              <div className="label">Phone Support</div>
              <div className="value">+254 700 000 000</div>
            </div>
          </ContactItem>

          <ContactItem as="div" style={{ cursor: 'default' }}>
            <div className="icon">
              <MdLocationOn size={24} />
            </div>
            <div className="content">
              <div className="label">Office Location</div>
              <div className="value">Nairobi, Kenya</div>
            </div>
          </ContactItem>
        </ContactSection>

        <BackLink to="/login">
          <MdArrowBack size={18} />
          Back to Login
        </BackLink>
      </Card>
    </Container>
  );
}

export default Support;
