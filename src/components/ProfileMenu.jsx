import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { MdPerson, MdSettings, MdHelp, MdLogout } from 'react-icons/md';

const ProfileContainer = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.$hasImage ? 'transparent' : theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  overflow: hidden;
  padding: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    border-color: ${theme.colors.primaryHover};
    transform: scale(1.05);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  min-width: 220px;
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s;

  body.dark-theme & {
    background: #2d2d2d;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  }
`;

const MenuHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${theme.colors.gray200};

  body.dark-theme & {
    border-bottom-color: #3d3d3d;
  }

  .name {
    font-weight: 600;
    color: ${theme.colors.gray900};
    margin-bottom: 4px;

    body.dark-theme & {
      color: #e5e5e5;
    }
  }

  .email {
    font-size: 13px;
    color: ${theme.colors.gray600};

    body.dark-theme & {
      color: #b0b0b0;
    }
  }

  .role {
    display: inline-block;
    margin-top: 8px;
    padding: 4px 8px;
    background: ${theme.colors.primary}20;
    color: ${theme.colors.primary};
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;

    body.dark-theme & {
      background: #7c3aed40;
      color: #a78bfa;
    }
  }
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  background: none;
  border: none;
  color: ${theme.colors.gray700};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;

  body.dark-theme & {
    color: #e5e5e5;
  }

  &:hover {
    background: ${theme.colors.gray50};
    color: ${theme.colors.gray900};

    body.dark-theme & {
      background: #353535;
      color: #e5e5e5;
    }
  }

  &.danger {
    color: ${theme.colors.danger};

    &:hover {
      background: ${theme.colors.danger}10;

      body.dark-theme & {
        background: #7f1d1d;
      }
    }
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background: ${theme.colors.gray200};
  margin: 4px 0;

  body.dark-theme & {
    background: #3d3d3d;
  }
`;

function ProfileMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (path) => {
    setIsOpen(false);
    if (path) {
      navigate(path);
    }
  };

  return (
    <ProfileContainer ref={menuRef}>
      <ProfileButton onClick={() => setIsOpen(!isOpen)} title={user?.username} $hasImage={!!user?.profileImage}>
        {user?.profileImage ? (
          <img src={user.profileImage} alt={user.username} />
        ) : (
          user?.username?.charAt(0).toUpperCase()
        )}
      </ProfileButton>

      <DropdownMenu $isOpen={isOpen}>
        <MenuHeader>
          <div className="name">{user?.username}</div>
          <div className="email">{user?.email}</div>
          <span className="role">{user?.role}</span>
        </MenuHeader>

        <div style={{ padding: '4px 0' }}>
          <MenuItem onClick={() => handleMenuClick('/profile')}>
            <MdPerson size={18} />
            <span>My Profile</span>
          </MenuItem>
          <MenuItem onClick={() => handleMenuClick('/settings')}>
            <MdSettings size={18} />
            <span>Settings</span>
          </MenuItem>
          <MenuItem onClick={() => handleMenuClick('/help')}>
            <MdHelp size={18} />
            <span>Help & Support</span>
          </MenuItem>

          <MenuDivider />

          <MenuItem className="danger" onClick={() => { setIsOpen(false); onLogout(); }}>
            <MdLogout size={18} />
            <span>Logout</span>
          </MenuItem>
        </div>
      </DropdownMenu>
    </ProfileContainer>
  );
}

export default ProfileMenu;
