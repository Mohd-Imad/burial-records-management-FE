import styled from 'styled-components';
import { theme } from '../styles/theme';
import { MdCheckCircle, MdError, MdInfo } from 'react-icons/md';

const FieldContainer = styled.div`
  margin-bottom: ${props => props.$marginBottom || theme.spacing.lg};
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: ${theme.colors.gray700};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;

  body.dark-theme & {
    color: #b0b0b0;
  }

  .required {
    color: ${theme.colors.danger};
  }

  .optional {
    font-weight: 400;
    color: ${theme.colors.gray500};
    font-size: 12px;

    body.dark-theme & {
      color: #a0a0a0;
    }
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.$hasIcon ? '12px 44px 12px 16px' : '12px 16px'};
  border: 2px solid ${props => {
    if (props.$error) return theme.colors.danger;
    if (props.$success) return theme.colors.success;
    return theme.colors.gray200;
  }};
  border-radius: ${theme.borderRadius.lg};
  font-size: 14px;
  transition: all ${theme.transitions.base};
  font-family: inherit;
  background: ${theme.colors.white};
  color: ${theme.colors.gray900};

  body.dark-theme & {
    background: #2d2d2d;
    border-color: ${props => {
      if (props.$error) return theme.colors.danger;
      if (props.$success) return theme.colors.success;
      return '#404040';
    }};
    color: #e5e5e5;
  }

  &:focus {
    outline: none;
    border-color: ${props => {
      if (props.$error) return theme.colors.danger;
      if (props.$success) return theme.colors.success;
      return theme.colors.primarySolid;
    }};
    box-shadow: 0 0 0 4px ${props => {
      if (props.$error) return 'rgba(239, 68, 68, 0.1)';
      if (props.$success) return 'rgba(16, 185, 129, 0.1)';
      return 'rgba(124, 58, 237, 0.1)';
    }};
    background: #fafbff;

    body.dark-theme & {
      background: #353535;
    }
  }

  &:hover:not(:read-only):not(:disabled):not(:focus) {
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
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => {
    if (props.$error) return theme.colors.danger;
    if (props.$success) return theme.colors.success;
    return theme.colors.gray200;
  }};
  border-radius: ${theme.borderRadius.lg};
  font-size: 14px;
  transition: all ${theme.transitions.base};
  font-family: inherit;
  background: ${theme.colors.white};
  color: ${theme.colors.gray900};
  resize: vertical;
  min-height: ${props => props.$minHeight || '120px'};

  body.dark-theme & {
    background: #2d2d2d;
    border-color: ${props => {
      if (props.$error) return theme.colors.danger;
      if (props.$success) return theme.colors.success;
      return '#404040';
    }};
    color: #e5e5e5;
  }

  &:focus {
    outline: none;
    border-color: ${props => {
      if (props.$error) return theme.colors.danger;
      if (props.$success) return theme.colors.success;
      return theme.colors.primarySolid;
    }};
    box-shadow: 0 0 0 4px ${props => {
      if (props.$error) return 'rgba(239, 68, 68, 0.1)';
      if (props.$success) return 'rgba(16, 185, 129, 0.1)';
      return 'rgba(124, 58, 237, 0.1)';
    }};
    background: #fafbff;

    body.dark-theme & {
      background: #353535;
    }
  }

  &::placeholder {
    color: ${theme.colors.gray400};

    body.dark-theme & {
      color: #6d6d6d;
    }
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => {
    if (props.$error) return theme.colors.danger;
    if (props.$success) return theme.colors.success;
    return theme.colors.gray200;
  }};
  border-radius: ${theme.borderRadius.lg};
  font-size: 14px;
  transition: all ${theme.transitions.base};
  font-family: inherit;
  background: ${theme.colors.white};
  color: ${theme.colors.gray900};
  cursor: pointer;

  body.dark-theme & {
    background: #2d2d2d;
    border-color: ${props => {
      if (props.$error) return theme.colors.danger;
      if (props.$success) return theme.colors.success;
      return '#404040';
    }};
    color: #e5e5e5;

    option {
      background: #2d2d2d;
      color: #e5e5e5;
    }
  }

  &:focus {
    outline: none;
    border-color: ${props => {
      if (props.$error) return theme.colors.danger;
      if (props.$success) return theme.colors.success;
      return theme.colors.primarySolid;
    }};
    box-shadow: 0 0 0 4px ${props => {
      if (props.$error) return 'rgba(239, 68, 68, 0.1)';
      if (props.$success) return 'rgba(16, 185, 129, 0.1)';
      return 'rgba(124, 58, 237, 0.1)';
    }};
    background: #fafbff;

    body.dark-theme & {
      background: #353535;
    }
  }
`;

const ValidationIcon = styled.div`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: ${props => props.$type === 'error' ? theme.colors.danger : theme.colors.success};
  pointer-events: none;
  animation: scaleIn 0.2s ease-out;

  @keyframes scaleIn {
    from {
      transform: translateY(-50%) scale(0);
    }
    to {
      transform: translateY(-50%) scale(1);
    }
  }
`;

const HelpText = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: ${props => {
    if (props.$type === 'error') return theme.colors.danger;
    if (props.$type === 'success') return theme.colors.success;
    return theme.colors.gray600;
  }};
  display: flex;
  align-items: flex-start;
  gap: 6px;

  body.dark-theme & {
    color: ${props => {
      if (props.$type === 'error') return theme.colors.danger;
      if (props.$type === 'success') return theme.colors.success;
      return '#b0b0b0';
    }};
  }

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

function FormField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  optional = false,
  error,
  success,
  helpText,
  disabled = false,
  readOnly = false,
  options = [],
  rows,
  minHeight,
  marginBottom,
  ...props
}) {
  const hasError = !!error;
  const hasSuccess = !!success;
  const showValidationIcon = (hasError || hasSuccess) && type !== 'textarea' && type !== 'select';

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <TextArea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          $error={hasError}
          $success={hasSuccess}
          $minHeight={minHeight}
          rows={rows}
          {...props}
        />
      );
    }

    if (type === 'select') {
      return (
        <Select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          $error={hasError}
          $success={hasSuccess}
          {...props}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    }

    return (
      <InputWrapper>
        <Input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          $error={hasError}
          $success={hasSuccess}
          $hasIcon={showValidationIcon}
          {...props}
        />
        {showValidationIcon && (
          <ValidationIcon $type={hasError ? 'error' : 'success'}>
            {hasError ? <MdError /> : <MdCheckCircle />}
          </ValidationIcon>
        )}
      </InputWrapper>
    );
  };

  return (
    <FieldContainer $marginBottom={marginBottom}>
      {label && (
        <Label>
          {label}
          {required && <span className="required">*</span>}
          {optional && <span className="optional">(optional)</span>}
        </Label>
      )}
      {renderInput()}
      {(error || success || helpText) && (
        <HelpText $type={hasError ? 'error' : hasSuccess ? 'success' : 'info'}>
          {hasError ? <MdError size={16} /> : hasSuccess ? <MdCheckCircle size={16} /> : <MdInfo size={16} />}
          <span>{error || success || helpText}</span>
        </HelpText>
      )}
    </FieldContainer>
  );
}

export default FormField;
