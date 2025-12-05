import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';

const indeterminate = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: ${props => props.$height || '4px'};
  background: ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  position: relative;

  body.dark-theme & {
    background: #3d3d3d;
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => {
    if (props.$variant === 'success') return theme.colors.success;
    if (props.$variant === 'danger') return theme.colors.danger;
    if (props.$variant === 'warning') return theme.colors.warning;
    return 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
  }};
  border-radius: ${theme.borderRadius.full};
  transition: width 0.3s ease;
  width: ${props => props.$indeterminate ? '25%' : `${props.$progress}%`};
  animation: ${props => props.$indeterminate ? indeterminate : 'none'} 1.5s ease-in-out infinite;
  box-shadow: 0 0 10px ${props => {
    if (props.$variant === 'success') return 'rgba(16, 185, 129, 0.5)';
    if (props.$variant === 'danger') return 'rgba(239, 68, 68, 0.5)';
    if (props.$variant === 'warning') return 'rgba(245, 158, 11, 0.5)';
    return 'rgba(102, 126, 234, 0.5)';
  }};
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
  color: ${theme.colors.gray700};

  body.dark-theme & {
    color: #b0b0b0;
  }

  .progress-text {
    flex: 1;
  }

  .progress-percentage {
    font-weight: 600;
    color: ${theme.colors.gray900};

    body.dark-theme & {
      color: #e5e5e5;
    }
  }
`;

function ProgressBar({ 
  progress = 0, 
  label, 
  showPercentage = true, 
  height,
  variant = 'primary',
  indeterminate = false 
}) {
  return (
    <div>
      {(label || showPercentage) && (
        <ProgressLabel>
          {label && <span className="progress-text">{label}</span>}
          {showPercentage && !indeterminate && (
            <span className="progress-percentage">{Math.round(progress)}%</span>
          )}
        </ProgressLabel>
      )}
      <ProgressContainer $height={height}>
        <ProgressFill 
          $progress={progress} 
          $variant={variant}
          $indeterminate={indeterminate}
        />
      </ProgressContainer>
    </div>
  );
}

export default ProgressBar;
