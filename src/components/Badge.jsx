import styled from 'styled-components';
import { theme } from '../styles/theme';

const BadgeElement = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.$size === 'small' ? '2px 8px' : '4px 12px'};
  border-radius: ${theme.borderRadius.full};
  font-size: ${props => props.$size === 'small' ? '11px' : '12px'};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  transition: all ${theme.transitions.fast};
  
  background: ${props => {
    if (props.$variant === 'success') return 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
    if (props.$variant === 'danger') return 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
    if (props.$variant === 'warning') return 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
    if (props.$variant === 'info') return 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
    if (props.$variant === 'purple') return 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)';
    return 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
  }};
  
  color: ${props => {
    if (props.$variant === 'success') return theme.colors.success;
    if (props.$variant === 'danger') return theme.colors.danger;
    if (props.$variant === 'warning') return theme.colors.warning;
    if (props.$variant === 'info') return theme.colors.info;
    if (props.$variant === 'purple') return '#7c3aed';
    return theme.colors.gray700;
  }};

  box-shadow: ${props => {
    if (props.$variant === 'success') return '0 2px 8px rgba(16, 185, 129, 0.2)';
    if (props.$variant === 'danger') return '0 2px 8px rgba(239, 68, 68, 0.2)';
    if (props.$variant === 'warning') return '0 2px 8px rgba(245, 158, 11, 0.2)';
    if (props.$variant === 'info') return '0 2px 8px rgba(6, 182, 212, 0.2)';
    if (props.$variant === 'purple') return '0 2px 8px rgba(124, 58, 237, 0.2)';
    return '0 2px 8px rgba(0, 0, 0, 0.05)';
  }};

  ${props => props.$dot && `
    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 6px;
      background: currentColor;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `}

  ${props => props.$clickable && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: ${
        props.$variant === 'success' ? '0 4px 12px rgba(16, 185, 129, 0.3)' :
        props.$variant === 'danger' ? '0 4px 12px rgba(239, 68, 68, 0.3)' :
        props.$variant === 'warning' ? '0 4px 12px rgba(245, 158, 11, 0.3)' :
        props.$variant === 'info' ? '0 4px 12px rgba(6, 182, 212, 0.3)' :
        props.$variant === 'purple' ? '0 4px 12px rgba(124, 58, 237, 0.3)' :
        '0 4px 12px rgba(0, 0, 0, 0.1)'
      };
    }

    &:active {
      transform: translateY(0);
    }
  `}
`;

function Badge({ 
  children, 
  variant = 'default', 
  size = 'normal',
  dot = false,
  onClick,
  className 
}) {
  return (
    <BadgeElement 
      $variant={variant} 
      $size={size}
      $dot={dot}
      $clickable={!!onClick}
      onClick={onClick}
      className={className}
    >
      {children}
    </BadgeElement>
  );
}

export default Badge;
