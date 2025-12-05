import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Button } from '../styles/CommonStyles';

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing['3xl']} ${theme.spacing.xl};
  text-align: center;
  background: white;
  border-radius: ${theme.borderRadius.lg};
  border: 2px dashed ${theme.colors.gray300};
  min-height: 400px;

  body.dark-theme & {
    background: #2d2d2d;
    border-color: #404040;
  }
`;

const EmptyIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0f0f0 0%, #f8f8f8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
  margin-bottom: ${theme.spacing.xl};
  opacity: 0.8;
  color: #9ca3af;

  body.dark-theme & {
    background: linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%);
    color: #6b7280;
  }

  svg {
    width: 56px;
    height: 56px;
  }
`;

const EmptyTitle = styled.h3`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${theme.colors.gray900};
  margin: 0 0 ${theme.spacing.md} 0;

  body.dark-theme & {
    color: #e5e5e5;
  }
`;

const EmptyDescription = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.gray600};
  margin: 0 0 ${theme.spacing.xl} 0;
  max-width: 400px;
  line-height: 1.6;

  body.dark-theme & {
    color: #b0b0b0;
  }
`;

const EmptyActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`;

function EmptyState({ 
  icon = '📭', 
  title = 'No data found', 
  description = 'There are no items to display at the moment.',
  action,
  actionText,
  secondaryAction,
  secondaryActionText
}) {
  return (
    <EmptyContainer>
      <EmptyIcon>{icon}</EmptyIcon>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyDescription>{description}</EmptyDescription>
      {(action || secondaryAction) && (
        <EmptyActions>
          {action && (
            <Button $variant="primary" onClick={action}>
              {actionText || 'Get Started'}
            </Button>
          )}
          {secondaryAction && (
            <Button $variant="secondary" onClick={secondaryAction}>
              {secondaryActionText || 'Learn More'}
            </Button>
          )}
        </EmptyActions>
      )}
    </EmptyContainer>
  );
}

export default EmptyState;
