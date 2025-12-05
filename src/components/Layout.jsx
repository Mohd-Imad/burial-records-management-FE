import { Outlet, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import ProfileMenu from './ProfileMenu';
import NotificationMenu from './NotificationMenu';
import ScrollToTop from './ScrollToTop';
import { MdDashboard, MdEdit, MdFolder, MdBarChart, MdPeople, MdSettings, MdLocationOn, MdLogout } from 'react-icons/md';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${theme.colors.gray50};
`;

const Sidebar = styled.aside`
  width: 240px;
  background: white;
  color: ${theme.colors.gray900};
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  border-right: 1px solid ${theme.colors.gray200};
  z-index: 100;
  display: flex;
  flex-direction: column;
  
  body.dark-theme & {
    background: #1f1f1f;
    border-right-color: #404040;
  }
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray300};
    border-radius: 3px;
    
    &:hover {
      background: ${theme.colors.gray400};
    }

    body.dark-theme & {
      background: #555;

      &:hover {
        background: #666;
      }
    }
  }

  @media print {
    display: none !important;
  }
`;

const SidebarHeader = styled.div`
  padding: 24px 20px;
  border-bottom: 1px solid ${theme.colors.gray200};

  body.dark-theme & {
    border-bottom-color: #404040;
  }

  h2 {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    color: ${theme.colors.gray900};
    font-family: ${theme.fonts.body};

    body.dark-theme & {
      color: #e5e5e5;
    }
  }
`;

const NavSection = styled.div`
  padding: 16px 12px;
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;

  a {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    color: ${theme.colors.gray700};
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    font-family: ${theme.fonts.body};
    border-radius: 6px;
    transition: all ${theme.transitions.fast};
    position: relative;
    overflow: hidden;

    body.dark-theme & {
      color: #b0b0b0;
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 3px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transform: scaleY(0);
      transition: transform ${theme.transitions.base};
      border-radius: 0 3px 3px 0;
    }

    .nav-icon {
      font-size: 18px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform ${theme.transitions.base};
    }

    .nav-text {
      flex: 1;
    }

    &:hover {
      background: ${theme.colors.gray100};
      color: ${theme.colors.gray900};
      padding-left: 16px;

      body.dark-theme & {
        background: #2d2d2d;
        color: #e5e5e5;
      }

      .nav-icon {
        transform: scale(1.1);
      }
    }

    &.active {
      background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%);
      color: #667eea;
      font-weight: 600;

      body.dark-theme & {
        background: linear-gradient(90deg, rgba(124, 58, 237, 0.2) 0%, transparent 100%);
        color: #a78bfa;
      }

      &::before {
        transform: scaleY(1);
      }
    }
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  color: #dc2626;
  background: none;
  border: none;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  font-family: ${theme.fonts.body};
  border-radius: 6px;
  transition: all ${theme.transitions.fast};
  cursor: pointer;
  width: 100%;
  text-align: left;

  body.dark-theme & {
    color: #f87171;
  }

  .nav-icon {
    font-size: 18px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform ${theme.transitions.base};
  }

  .nav-text {
    flex: 1;
  }

  &:hover {
    background: #fee2e2;
    color: #b91c1c;
    padding-left: 16px;

    body.dark-theme & {
      background: rgba(220, 38, 38, 0.2);
      color: #fca5a5;
    }

    .nav-icon {
      transform: scale(1.1);
    }
  }
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  width: 100%;
  padding: 12px;
  border-top: 1px solid ${theme.colors.gray200};
  background: white;

  body.dark-theme & {
    background: #1f1f1f;
    border-top-color: #404040;
  }
`;

const MainContent = styled.main`
  margin-left: 240px;
  flex: 1;
  min-height: 100vh;
  background: #fafafa;

  body.dark-theme & {
    background: #1a1a1a;
  }
  background: #fafafa;

  @media print {
    margin-left: 0 !important;
    width: 100% !important;
  }
`;

const TopHeader = styled.div`
  background: white;
  padding: 16px 32px;
  border-bottom: 1px solid ${theme.colors.gray200};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 50;

  body.dark-theme & {
    background: #1f1f1f;
    border-bottom-color: #404040;
  }

  @media print {
    display: none !important;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.gray900};
  margin: 0;
  font-family: ${theme.fonts.body};

  body.dark-theme & {
    color: #e5e5e5;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ContentArea = styled.div`
  padding: 32px;

  @media print {
    padding: 0 !important;
  }
`;

function Layout({ user, onLogout }) {
  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarHeader>
          <h2>Burial Permit Manager</h2>
        </SidebarHeader>

        <NavSection>
          <SidebarNav>
            {/* Dashboard - All roles can see */}
            {(user?.role === 'admin' || user?.role === 'viewer') && (
              <NavLink to="/" end>
                <span className="nav-icon"><MdDashboard /></span>
                <span className="nav-text">Dashboard</span>
              </NavLink>
            )}

            {/* New Permit - Admin and Data Entry only */}
            {(user?.role === 'admin' || user?.role === 'data_entry') && (
              <NavLink to="/data-capture">
                <span className="nav-icon"><MdEdit /></span>
                <span className="nav-text">New Permit</span>
              </NavLink>
            )}

            {/* Records - All roles can see */}
            <NavLink to="/records">
              <span className="nav-icon"><MdFolder /></span>
              <span className="nav-text">Records</span>
            </NavLink>

            {/* Reports - Admin and Viewer only */}
            {(user?.role === 'admin' || user?.role === 'viewer') && (
              <NavLink to="/reports">
                <span className="nav-icon"><MdBarChart /></span>
                <span className="nav-text">Reports</span>
              </NavLink>
            )}

            {/* Users - Admin only */}
            {user?.role === 'admin' && (
              <NavLink to="/users">
                <span className="nav-icon"><MdPeople /></span>
                <span className="nav-text">Users</span>
              </NavLink>
            )}
          </SidebarNav>
        </NavSection>

        <SidebarFooter>
          <SidebarNav>
            <NavLink to="/settings">
              <span className="nav-icon"><MdSettings /></span>
              <span className="nav-text">Settings</span>
            </NavLink>
            <LogoutButton onClick={onLogout}>
              <span className="nav-icon"><MdLogout /></span>
              <span className="nav-text">Logout</span>
            </LogoutButton>
          </SidebarNav>
        </SidebarFooter>
      </Sidebar>

      <MainContent>
        <TopHeader>
          <HeaderTitle>Burial Permit Manager</HeaderTitle>
          <UserSection>
            <NotificationMenu />
            <ProfileMenu user={user} onLogout={onLogout} />
          </UserSection>
        </TopHeader>

        <ContentArea>
          <Outlet />
        </ContentArea>
        <ScrollToTop />
      </MainContent>
    </LayoutContainer>
  );
}

export default Layout;
