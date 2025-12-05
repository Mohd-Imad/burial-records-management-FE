import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const FABContainer = styled.div`
  position: fixed;
  bottom: ${props => props.$bottom || '32px'};
  right: ${props => props.$right || '32px'};
  z-index: ${theme.zIndex.fixed};

  @media print {
    display: none !important;
  }
`;

const FABButton = styled.button`
  width: ${props => props.$size === 'small' ? '48px' : '56px'};
  height: ${props => props.$size === 'small' ? '48px' : '56px'};
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.$size === 'small' ? '20px' : '24px'};
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  transition: all ${theme.transitions.base};
  position: relative;
  overflow: hidden;
  animation: ${float} 3s ease-in-out infinite;

  body.dark-theme & {
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    box-shadow: 0 8px 24px rgba(124, 58, 237, 0.5);
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.6s;
  }

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
    animation: none;

    body.dark-theme & {
      box-shadow: 0 12px 32px rgba(124, 58, 237, 0.7);
    }

    &::before {
      transform: translate(-50%, -50%) scale(2);
    }
  }

  &:active {
    transform: translateY(-2px) scale(1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    animation: none;
  }
`;

const FABLabel = styled.span`
  position: absolute;
  right: calc(100% + 12px);
  background: ${theme.colors.gray900};
  color: white;
  padding: 8px 16px;
  border-radius: ${theme.borderRadius.md};
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transform: translateX(${props => props.$visible ? '0' : '10px'});
  transition: all ${theme.transitions.base};
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  body.dark-theme & {
    background: #1f1f1f;
  }

  &::after {
    content: '';
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    border: 6px solid transparent;
    border-left-color: ${theme.colors.gray900};

    body.dark-theme & {
      border-left-color: #1f1f1f;
    }
  }
`;

function FloatingActionButton({
    icon,
    onClick,
    label,
    size = 'normal',
    bottom,
    right,
    disabled = false
}) {
    const [showLabel, setShowLabel] = useState(false);

    return (
        <FABContainer $bottom={bottom} $right={right}>
            <FABButton
                onClick={onClick}
                $size={size}
                disabled={disabled}
                onMouseEnter={() => setShowLabel(true)}
                onMouseLeave={() => setShowLabel(false)}
                aria-label={label}
            >
                {icon}
            </FABButton>
            {label && <FABLabel $visible={showLabel}>{label}</FABLabel>}
        </FABContainer>
    );
}

export default FloatingActionButton;
