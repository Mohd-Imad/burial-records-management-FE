import styled from 'styled-components';
import { theme } from './theme';

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${theme.spacing.lg};
`;

export const Card = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: ${theme.spacing.xl};
  border: 1px solid ${theme.colors.gray200};
  transition: all ${theme.transitions.base};

  body.dark-theme & {
    background: #2d2d2d;
    border-color: #404040;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);

    body.dark-theme & {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
  }
`;

export const CardHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.gray200};

  body.dark-theme & {
    border-bottom-color: #404040;
  }
`;

export const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.gray900};
  margin: 0;

  body.dark-theme & {
    color: #e5e5e5;
  }
`;

export const CardContent = styled.div`
  /* Content styling */
`;

export const Button = styled.button`
  background: ${props => {
    if (props.$variant === 'primary') return '#6366f1';
    if (props.$variant === 'danger') return theme.colors.danger;
    if (props.$variant === 'secondary') return 'white';
    if (props.$variant === 'success') return theme.colors.success;
    if (props.$variant === 'warning') return theme.colors.warning;
    return '#6366f1';
  }};
  color: ${props => props.$variant === 'secondary' ? theme.colors.gray700 : 'white'};
  padding: ${props => props.$size === 'small' ? '8px 16px' : '10px 20px'};
  font-size: ${props => props.$size === 'small' ? '13px' : '14px'};
  font-weight: 600;
  font-family: ${theme.fonts.body};
  border-radius: ${theme.borderRadius.md};
  border: ${props => props.$variant === 'secondary' ? `1px solid ${theme.colors.gray300}` : 'none'};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  margin-right: ${props => props.$marginRight || '0'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
  overflow: hidden;

  body.dark-theme & {
    ${props => props.$variant === 'secondary' && `
      background: #2d2d2d;
      border-color: #404040;
      color: #e5e5e5;
    `}
    ${props => props.$variant === 'primary' && `
      background: #7c3aed;
    `}
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover:not(:disabled) {
    background: ${props => {
    if (props.$variant === 'primary') return '#4f46e5';
    if (props.$variant === 'secondary') return theme.colors.gray50;
    return props.$variant === 'danger' ? '#dc2626' : props.$variant === 'success' ? '#059669' : '#d97706';
  }};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    body.dark-theme & {
      ${props => props.$variant === 'secondary' && `
        background: #353535;
      `}
      ${props => props.$variant === 'primary' && `
        background: #6d28d9;
      `}
    }

    &::before {
      width: 300px;
      height: 300px;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: ${theme.colors.gray600};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  position: relative;

  body.dark-theme & {
    color: #b0b0b0;
  }

  &:hover {
    background: ${theme.colors.gray100};
    color: ${theme.colors.gray900};
    transform: scale(1.1);

    body.dark-theme & {
      background: #3d3d3d;
      color: #e5e5e5;
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const Alert = styled.div`
  padding: 12px 16px;
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md};
  background: ${props => props.$type === 'success' ? '#D1FAE5' : '#FEE2E2'};
  color: ${props => props.$type === 'success' ? '#065F46' : '#991B1B'};
  border: 1px solid ${props => props.$type === 'success' ? '#A7F3D0' : '#FECACA'};
  font-size: 14px;
`;

export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: ${theme.colors.gray700};
    font-size: 14px;

    body.dark-theme & {
      color: #b0b0b0;
    }
  }

  input, select, textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid ${theme.colors.gray200};
    border-radius: ${theme.borderRadius.lg};
    font-size: 14px;
    transition: all ${theme.transitions.base};
    font-family: inherit;
    background: ${theme.colors.white};

    body.dark-theme & {
      background: #2d2d2d;
      border-color: #404040;
      color: #e5e5e5;
    }

    &:focus {
      outline: none;
      border-color: ${theme.colors.primarySolid};
      box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
      background: #fafbff;

      body.dark-theme & {
        background: #353535;
        border-color: #7c3aed;
      }
    }

    &:hover:not(:read-only):not(:disabled) {
      border-color: ${theme.colors.gray300};

      body.dark-theme & {
        border-color: #555;
      }
    }

    &::placeholder {
      color: ${theme.colors.gray400};

      body.dark-theme & {
        color: #6d6d6d;
      }
    }

    &:read-only,
    &:disabled {
      background: #f9fafb;
      color: ${theme.colors.gray500};
      cursor: not-allowed;
      border-color: ${theme.colors.gray200};

      body.dark-theme & {
        background: #1f1f1f;
        color: #a0a0a0;
        border-color: #404040;
      }
    }
  }

  select {
    option {
      background: white;
      color: ${theme.colors.gray900};

      body.dark-theme & {
        background: #2d2d2d;
        color: #e5e5e5;
      }
    }
  }

  input[type="date"] {
    position: relative;
    cursor: pointer;
    color: ${theme.colors.gray700};
    font-weight: 500;
    
    &::-webkit-calendar-picker-indicator {
      cursor: pointer;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%236366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>') center/contain no-repeat;
      width: 20px;
      height: 20px;
      padding: 0;
      margin-left: 8px;
      opacity: 0.7;
      transition: opacity ${theme.transitions.fast};
      
      &:hover {
        opacity: 1;
      }
    }
    
    &::-webkit-datetime-edit-fields-wrapper {
      padding: 0;
    }
    
    &::-webkit-datetime-edit-text {
      color: ${theme.colors.gray500};
      padding: 0 4px;
    }
    
    &::-webkit-datetime-edit-month-field,
    &::-webkit-datetime-edit-day-field,
    &::-webkit-datetime-edit-year-field {
      color: ${theme.colors.gray700};
      font-weight: 500;
      padding: 2px 4px;
      border-radius: 4px;
      
      &:focus {
        background: #eef2ff;
        color: #6366f1;
        outline: none;
      }
    }
    
    &::placeholder {
      color: ${theme.colors.gray400};
    }
    
    &:invalid {
      color: ${theme.colors.gray400};
    }
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }

  select {
    cursor: pointer;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

export const StatCard = styled(Card)`
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 150px;
    height: 150px;
    background: ${props => (props.$color || theme.colors.primarySolid) + '08'};
    border-radius: 50%;
    transform: translate(40%, -40%);
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: ${theme.borderRadius.xl};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    background: ${props => {
    const color = props.$color || theme.colors.primarySolid;
    return `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`;
  }};
    color: ${props => props.$color || theme.colors.primarySolid};
    box-shadow: ${theme.shadows.sm};
  }

  h3 {
    font-size: 14px;
    color: ${theme.colors.gray600};
    font-weight: 600;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: 36px;
    font-weight: 800;
    background: linear-gradient(135deg, ${theme.colors.gray900} 0%, ${theme.colors.gray700} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: ${theme.spacing.sm} 0;
    position: relative;
    z-index: 1;
  }

  .trend {
    font-size: 13px;
    color: ${theme.colors.gray500};
    font-weight: 500;
    position: relative;
    z-index: 1;
  }
`;

export const StatusBadge = styled.span`
  padding: 6px 14px;
  border-radius: ${theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    if (props.$status === 'Verified') return 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
    if (props.$status === 'Completed') return 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
    if (props.$status === 'Rejected') return 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
    return 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
  }};
  color: ${props => {
    if (props.$status === 'Verified') return theme.colors.success;
    if (props.$status === 'Completed') return theme.colors.info;
    if (props.$status === 'Rejected') return theme.colors.danger;
    return theme.colors.warning;
  }};
  box-shadow: ${theme.shadows.sm};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: ${theme.colors.gray50};
    border-bottom: 2px solid ${theme.colors.gray200};
    position: sticky;
    top: 0;
    z-index: 10;

    body.dark-theme & {
      background: #2d2d2d;
      border-bottom-color: #404040;
    }
  }

  th {
    padding: 14px 16px;
    text-align: left;
    font-weight: 600;
    font-size: 13px;
    color: ${theme.colors.gray700};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;

    body.dark-theme & {
      color: #b0b0b0;
    }
  }

  td {
    padding: 16px;
    border-bottom: 1px solid ${theme.colors.gray200};
    font-size: 14px;
    color: ${theme.colors.gray900};
    vertical-align: middle;

    body.dark-theme & {
      border-bottom-color: #404040;
      color: #e5e5e5;
    }
  }

  tbody tr {
    transition: all ${theme.transitions.fast};
    cursor: pointer;

    &:hover {
      background: ${theme.colors.gray50};
      transform: scale(1.001);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      body.dark-theme & {
        background: #2d2d2d;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }
    }

    &:active {
      transform: scale(0.999);
    }
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};

  button {
    padding: 8px 12px;
    background: ${theme.colors.white};
    border: 1px solid ${theme.colors.gray300};
    color: ${theme.colors.gray700};
    border-radius: ${theme.borderRadius.md};
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: ${theme.colors.gray50};
      border-color: ${theme.colors.primary};
    }

    &.active {
      background: ${theme.colors.primary};
      color: white;
      border-color: ${theme.colors.primary};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    color: ${theme.colors.gray600};
    font-size: 14px;
  }
`;

export const PageHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing.md};

  h1 {
    font-size: 24px;
    font-weight: 700;
    font-family: ${theme.fonts.heading};
    color: ${theme.colors.gray900};
    margin: 0 0 ${theme.spacing.sm} 0;

    body.dark-theme & {
      color: #e5e5e5;
    }
  }

  p {
    color: ${theme.colors.gray600};
    font-size: 14px;
    margin: 0;
    font-family: ${theme.fonts.body};

    body.dark-theme & {
      color: #a0a0a0;
    }
  }
`;

export const FilterSection = styled(Card)`
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: ${theme.colors.gray900};
    margin: 0 0 ${theme.spacing.md} 0;

    body.dark-theme & {
      color: #e5e5e5;
    }
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
`;
