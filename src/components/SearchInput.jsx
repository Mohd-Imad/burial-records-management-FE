import styled from 'styled-components';
import { theme } from '../styles/theme';
import { MdSearch, MdClose } from 'react-icons/md';

const SearchContainer = styled.div`
  position: relative;
  width: ${props => props.$fullWidth ? '100%' : '320px'};
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.gray400};
  font-size: 20px;
  pointer-events: none;
  transition: color ${theme.transitions.fast};

  body.dark-theme & {
    color: #6d6d6d;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: ${theme.colors.gray200};
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${theme.colors.gray600};
  transition: all ${theme.transitions.fast};
  opacity: ${props => props.$visible ? 1 : 0};
  pointer-events: ${props => props.$visible ? 'auto' : 'none'};

  body.dark-theme & {
    background: #3d3d3d;
    color: #b0b0b0;
  }

  &:hover {
    background: ${theme.colors.gray300};
    transform: translateY(-50%) scale(1.1);

    body.dark-theme & {
      background: #4d4d4d;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 44px 12px 44px;
  border: 2px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.lg};
  font-size: 14px;
  font-family: ${theme.fonts.body};
  background: white;
  color: ${theme.colors.gray900};
  transition: all ${theme.transitions.base};

  body.dark-theme & {
    background: #2d2d2d;
    border-color: #404040;
    color: #e5e5e5;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    background: #fafbff;

    body.dark-theme & {
      border-color: #7c3aed;
      background: #353535;
    }

    & + ${SearchIcon} {
      color: #6366f1;

      body.dark-theme & {
        color: #7c3aed;
      }
    }
  }

  &::placeholder {
    color: ${theme.colors.gray400};

    body.dark-theme & {
      color: #6d6d6d;
    }
  }
`;

function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  onClear,
  fullWidth = false 
}) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <SearchContainer $fullWidth={fullWidth}>
      <SearchIcon>
        <MdSearch />
      </SearchIcon>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <ClearButton 
        type="button"
        onClick={handleClear} 
        $visible={value.length > 0}
        aria-label="Clear search"
      >
        <MdClose size={16} />
      </ClearButton>
    </SearchContainer>
  );
}

export default SearchInput;
