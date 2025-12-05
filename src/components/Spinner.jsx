import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.$padding || theme.spacing.xl};
  min-height: ${props => props.$minHeight || 'auto'};
`;

const SpinnerRing = styled.div`
  width: ${props => props.$size || '48px'};
  height: ${props => props.$size || '48px'};
  border: ${props => props.$thickness || '4px'} solid ${theme.colors.gray200};
  border-top: ${props => props.$thickness || '4px'} solid ${props => props.$color || theme.colors.primarySolid};
  border-radius: 50%;
  animation: ${spin} ${props => props.$speed || '1s'} linear infinite;

  body.dark-theme & {
    border-color: #3d3d3d;
    border-top-color: ${props => props.$color || '#7c3aed'};
  }
`;

const SpinnerText = styled.p`
  margin-top: ${theme.spacing.md};
  color: ${theme.colors.gray600};
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;

  body.dark-theme & {
    color: #b0b0b0;
  }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
`;

export function Spinner({ 
  size = '48px', 
  thickness = '4px', 
  color, 
  speed = '1s',
  text,
  padding,
  minHeight
}) {
  return (
    <SpinnerContainer $padding={padding} $minHeight={minHeight}>
      <SpinnerWrapper>
        <SpinnerRing 
          $size={size} 
          $thickness={thickness} 
          $color={color}
          $speed={speed}
        />
        {text && <SpinnerText>{text}</SpinnerText>}
      </SpinnerWrapper>
    </SpinnerContainer>
  );
}

export function InlineSpinner({ size = '16px', thickness = '2px', color }) {
  return (
    <SpinnerRing 
      $size={size} 
      $thickness={thickness} 
      $color={color}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  );
}

export default Spinner;
