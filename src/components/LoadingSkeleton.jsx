import styled from 'styled-components';
import { theme } from '../styles/theme';

const SkeletonBase = styled.div`
  background: #e5e7eb;
  border-radius: ${props => props.$radius || '4px'};
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  margin-bottom: ${props => props.$marginBottom || '0'};

  body.dark-theme & {
    background: #3d3d3d;
  }
`;

const SkeletonCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  border: 1px solid ${theme.colors.gray200};

  body.dark-theme & {
    background: #2d2d2d;
    border-color: #404040;
  }
`;

const SkeletonRow = styled.div`
  display: flex;
  gap: ${props => props.$gap || theme.spacing.md};
  margin-bottom: ${props => props.$marginBottom || theme.spacing.md};
  align-items: ${props => props.$align || 'flex-start'};
`;

export const TableSkeleton = ({ rows = 5 }) => (
  <SkeletonCard>
    <SkeletonBase $height="24px" $width="200px" $marginBottom="20px" />
    {[...Array(rows)].map((_, i) => (
      <SkeletonRow key={i} $marginBottom="16px">
        <SkeletonBase $height="16px" $width="30%" />
        <SkeletonBase $height="16px" $width="25%" />
        <SkeletonBase $height="16px" $width="20%" />
        <SkeletonBase $height="16px" $width="15%" />
      </SkeletonRow>
    ))}
  </SkeletonCard>
);

export const StatCardSkeleton = () => (
  <SkeletonCard>
    <SkeletonRow $align="center" $marginBottom="16px">
      <SkeletonBase $height="56px" $width="56px" $radius="16px" />
      <div style={{ flex: 1 }}>
        <SkeletonBase $height="14px" $width="120px" $marginBottom="8px" />
        <SkeletonBase $height="36px" $width="80px" />
      </div>
    </SkeletonRow>
    <SkeletonBase $height="13px" $width="150px" />
  </SkeletonCard>
);

export const FormSkeleton = () => (
  <SkeletonCard>
    <SkeletonBase $height="24px" $width="200px" $marginBottom="24px" />
    <SkeletonBase $height="14px" $width="100px" $marginBottom="8px" />
    <SkeletonBase $height="44px" $width="100%" $marginBottom="20px" />
    <SkeletonBase $height="14px" $width="100px" $marginBottom="8px" />
    <SkeletonBase $height="44px" $width="100%" $marginBottom="20px" />
    <SkeletonRow $gap="12px">
      <SkeletonBase $height="40px" $width="120px" $radius="8px" />
      <SkeletonBase $height="40px" $width="100px" $radius="8px" />
    </SkeletonRow>
  </SkeletonCard>
);

export const DashboardSkeleton = () => (
  <div>
    <SkeletonBase $height="32px" $width="250px" $marginBottom="32px" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
    <TableSkeleton rows={8} />
  </div>
);

export default SkeletonBase;
