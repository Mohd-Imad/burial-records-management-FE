import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

const TooltipContent = styled.div`
  position: absolute;
  bottom: ${props => props.$position === 'top' ? '100%' : 'auto'};
  top: ${props => props.$position === 'bottom' ? '100%' : 'auto'};
  left: ${props => props.$position === 'left' ? 'auto' : props.$position === 'right' ? '100%' : '50%'};
  right: ${props => props.$position === 'left' ? '100%' : 'auto'};
  transform: ${props => {
    const baseTransform = (() => {
      if (props.$position === 'top' || props.$position === 'bottom') return 'translateX(-50%)';
      if (props.$position === 'left') return 'translateY(-50%)';
      if (props.$position === 'right') return 'translateY(-50%)';
      return 'none';
    })();
    const scaleTransform = props.$visible ? 'scale(1)' : 'scale(0.95)';
    return `${baseTransform} ${scaleTransform}`;
  }};
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #f1f5f9;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.6;
  font-weight: 500;
  white-space: ${props => props.$multiline ? 'normal' : 'nowrap'};
  ${props => props.$width ? `width: ${props.$width};` : `max-width: ${props.$multiline ? '280px' : 'none'};`};
  z-index: ${theme.zIndex.tooltip};
  text-align: ${props => props.$multiline ? 'left' : 'center'};
  pointer-events: none;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  margin: ${props => {
    if (props.$position === 'top') return '0 0 10px 0';
    if (props.$position === 'bottom') return '10px 0 0 0';
    if (props.$position === 'left') return '0 10px 0 0';
    if (props.$position === 'right') return '0 0 0 10px';
    return '0';
  }};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);

  body.dark-theme & {
    background: linear-gradient(135deg, #18181b 0%, #09090b 100%);
    color: #e4e4e7;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08);
  }

  &::before {
    content: '';
    position: absolute;
    ${props => {
    if (props.$position === 'top') return 'top: 100%; left: 50%; transform: translateX(-50%);';
    if (props.$position === 'bottom') return 'bottom: 100%; left: 50%; transform: translateX(-50%);';
    if (props.$position === 'left') return 'left: 100%; top: 50%; transform: translateY(-50%);';
    if (props.$position === 'right') return 'right: 100%; top: 50%; transform: translateY(-50%);';
    return '';
  }}
    border: 7px solid transparent;
    ${props => {
    if (props.$position === 'top') return 'border-top-color: #1e293b;';
    if (props.$position === 'bottom') return 'border-bottom-color: #1e293b;';
    if (props.$position === 'left') return 'border-left-color: #1e293b;';
    if (props.$position === 'right') return 'border-right-color: #1e293b;';
    return '';
  }}
  }

  body.dark-theme &::before {
    ${props => {
    if (props.$position === 'top') return 'border-top-color: #18181b;';
    if (props.$position === 'bottom') return 'border-bottom-color: #18181b;';
    if (props.$position === 'left') return 'border-left-color: #18181b;';
    if (props.$position === 'right') return 'border-right-color: #18181b;';
    return '';
  }}
  }
`;

function Tooltip({ children, content, position = 'top', delay = 200, multiline = false, width }) {
  const [visible, setVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showTooltip = () => {
    const id = setTimeout(() => {
      setVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setVisible(false);
  };

  if (!content) {
    return children;
  }

  return (
    <TooltipContainer
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <TooltipContent $visible={visible} $position={position} $multiline={multiline} $width={width}>
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
}

export default Tooltip;
