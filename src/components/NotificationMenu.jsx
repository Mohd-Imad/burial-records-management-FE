import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import axios from '../utils/axios';
import { MdNotifications } from 'react-icons/md';
import { showPushNotification } from '../utils/pushNotifications';
import { useSettings } from '../contexts/SettingsContext';

const NotificationContainer = styled.div`
  position: relative;
`;

const NotificationButton = styled.button`
  position: relative;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: ${theme.colors.gray600};
  font-size: 20px;
  border-radius: 8px;
  transition: all 0.2s;

  body.dark-theme & {
    color: #b0b0b0;
  }

  &:hover {
    background: ${theme.colors.gray100};
    color: ${theme.colors.gray900};

    body.dark-theme & {
      background: #3d3d3d;
      color: #e5e5e5;
    }
  }

  .badge {
    position: absolute;
    top: 6px;
    right: 6px;
    min-width: 18px;
    height: 18px;
    background: ${theme.colors.danger};
    border-radius: 50%;
    border: 2px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    color: white;
    padding: 0 4px;
    animation: pulse 2s ease-in-out infinite;

    body.dark-theme & {
      border-color: #1f1f1f;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 360px;
  max-width: 90vw;
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
  display: flex;
  justify-content: space-between;
  align-items: center;

  body.dark-theme & {
    border-bottom-color: #3d3d3d;
  }

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: ${theme.colors.gray900};

    body.dark-theme & {
      color: #e5e5e5;
    }
  }

  button {
    background: none;
    border: none;
    color: ${theme.colors.primary};
    font-size: 13px;
    cursor: pointer;
    padding: 4px 8px;

    body.dark-theme & {
      color: #a78bfa;
    }

    &:hover {
      text-decoration: underline;
    }
  }
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${theme.colors.gray100};
  cursor: pointer;
  transition: background 0.2s;
  background: ${props => props.$unread ? theme.colors.primary + '05' : 'white'};

  body.dark-theme & {
    background: ${props => props.$unread ? '#7c3aed20' : '#2d2d2d'};
    border-bottom-color: #3d3d3d;
  }

  &:hover {
    background: ${theme.colors.gray50};

    body.dark-theme & {
      background: #353535;
    }
  }

  &:last-child {
    border-bottom: none;
  }

  .notification-header {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 4px;
  }

  .icon {
    font-size: 20px;
    flex-shrink: 0;
  }

  .content {
    flex: 1;
  }

  .title {
    font-weight: 500;
    color: ${theme.colors.gray900};
    font-size: 14px;
    margin-bottom: 4px;

    body.dark-theme & {
      color: #e5e5e5;
    }
  }

  .message {
    color: ${theme.colors.gray600};
    font-size: 13px;
    line-height: 1.4;

    body.dark-theme & {
      color: #b0b0b0;
    }
  }

  .time {
    color: ${theme.colors.gray500};
    font-size: 12px;
    margin-top: 4px;

    body.dark-theme & {
      color: #a0a0a0;
    }
  }
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${theme.colors.gray500};

  body.dark-theme & {
    color: #a0a0a0;
  }

  .icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .text {
    font-size: 14px;
  }
`;

function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);
  const { settings } = useSettings();
  const previousUnreadCount = useRef(0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Show push notification when new notifications arrive
  useEffect(() => {
    if (settings.pushNotifications && unreadCount > previousUnreadCount.current && previousUnreadCount.current > 0) {
      const newNotification = notifications.find(n => n.unread);
      if (newNotification) {
        showPushNotification(newNotification.title, {
          body: newNotification.message,
          icon: newNotification.icon || '🔔'
        });
      }
    }
    previousUnreadCount.current = unreadCount;
  }, [unreadCount, settings.pushNotifications, notifications]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/notifications');
      setNotifications(response.data.notifications.map(n => ({
        id: n._id,
        icon: n.icon,
        title: n.title,
        message: n.message,
        time: formatTime(n.createdAt),
        unread: !n.read
      })));
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return notifDate.toLocaleDateString();
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/mark-all-read');
      // Clear all notifications from the list after marking as read
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const hasUnread = unreadCount > 0;

  return (
    <NotificationContainer ref={menuRef}>
      <NotificationButton onClick={() => setIsOpen(!isOpen)} title="Notifications">
        <MdNotifications size={22} />
        {hasUnread && <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </NotificationButton>

      <DropdownMenu $isOpen={isOpen}>
        <MenuHeader>
          <h3>Notifications</h3>
          {hasUnread && (
            <button onClick={markAllAsRead}>Mark all as read</button>
          )}
        </MenuHeader>

        <NotificationList>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                $unread={notification.unread}
                onClick={() => setIsOpen(false)}
              >
                <div className="notification-header">
                  <span className="icon">{notification.icon}</span>
                  <div className="content">
                    <div className="title">{notification.title}</div>
                    <div className="message">{notification.message}</div>
                    <div className="time">{notification.time}</div>
                  </div>
                </div>
              </NotificationItem>
            ))
          ) : (
            <EmptyState>
              <div className="icon">🔔</div>
              <div className="text">No notifications</div>
            </EmptyState>
          )}
        </NotificationList>
      </DropdownMenu>
    </NotificationContainer>
  );
}

export default NotificationMenu;
