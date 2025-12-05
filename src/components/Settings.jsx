import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../styles/CommonStyles';
import { useToast } from '../contexts/ToastContext';
import { useSettings } from '../contexts/SettingsContext';
import { MdArrowBack } from 'react-icons/md';
import { requestNotificationPermission, getNotificationPermission } from '../utils/pushNotifications';

const SettingsContainer = styled.div`
  max-width: 800px;

  h1 {
    body.dark-theme & {
      color: #e5e5e5;
    }
  }
`;

const SettingsCard = styled(Card)`
  margin-bottom: 24px;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid ${theme.colors.gray200};

  &:last-child {
    border-bottom: none;
  }

  body.dark-theme & {
    border-bottom-color: #404040;
  }

  .setting-info {
    flex: 1;

    h4 {
      margin: 0 0 4px 0;
      font-size: 15px;
      font-weight: 500;
      color: ${theme.colors.gray900};

      body.dark-theme & {
        color: #e5e5e5;
      }
    }

    p {
      margin: 0;
      font-size: 13px;
      color: ${theme.colors.gray600};

      body.dark-theme & {
        color: #a0a0a0;
      }
    }
  }
`;

const Toggle = styled.button`
  width: 48px;
  height: 26px;
  border-radius: 13px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  background: ${props => props.$active ? theme.colors.primary : theme.colors.gray300};

  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    top: 3px;
    left: ${props => props.$active ? '25px' : '3px'};
    transition: all 0.3s;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: 6px;
  font-size: 14px;
  color: ${theme.colors.gray900};
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }

  body.dark-theme & {
    background: #2d2d2d;
    color: #e5e5e5;
    border-color: #404040;

    option {
      background: #2d2d2d;
      color: #e5e5e5;
    }
  }
`;

function Settings() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { settings, updateSettings, loading } = useSettings();

  const handleToggle = async (key) => {
    try {
      // Special handling for push notifications
      if (key === 'pushNotifications' && !settings[key]) {
        const permission = await requestNotificationPermission();
        if (!permission) {
          showToast('Push notification permission denied. Please enable it in your browser settings.', 'error');
          return;
        }
      }

      const updatedSettings = {
        ...settings,
        [key]: !settings[key]
      };
      const response = await updateSettings(updatedSettings);
      showToast(response.message || 'Setting updated successfully', 'success');
    } catch (err) {
      showToast('Failed to update setting', 'error');
    }
  };

  const handleSelectChange = async (key, value) => {
    try {
      const updatedSettings = {
        ...settings,
        [key]: value
      };
      const response = await updateSettings(updatedSettings);
      showToast(response.message || 'Setting updated successfully', 'success');
    } catch (err) {
      showToast('Failed to update setting', 'error');
    }
  };

  const handleClearCache = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/users/clear-cache', {}, {
        headers: { 'x-auth-token': token }
      });
      // Clear local storage except token
      const tokenBackup = localStorage.getItem('token');
      localStorage.clear();
      localStorage.setItem('token', tokenBackup);
      showToast('Cache cleared successfully', 'success');
    } catch (err) {
      console.error('Error clearing cache:', err);
      showToast('Failed to clear cache', 'error');
    }
  };

  const handleExportData = async () => {
    const token = localStorage.getItem('token');
    try {
      showToast('Preparing data export...', 'info');
      const res = await axios.get('/api/users/export-data', {
        headers: { 'x-auth-token': token }
      });

      // Create and download JSON file
      const dataStr = JSON.stringify(res.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `burial-permit-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      showToast('Data exported successfully', 'success');
    } catch (err) {
      console.error('Error exporting data:', err);
      showToast('Failed to export data', 'error');
    }
  };

  if (loading) {
    return (
      <SettingsContainer>
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading settings...</div>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Settings</h1>
        <Button $variant="secondary" onClick={() => navigate(-1)}>
          <MdArrowBack size={18} /> Back
        </Button>
      </div>

      <SettingsCard>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingItem>
            <div className="setting-info">
              <h4>Email Notifications</h4>
              <p>Receive email notifications for important updates</p>
            </div>
            <Toggle
              $active={settings.emailNotifications}
              onClick={() => handleToggle('emailNotifications')}
            />
          </SettingItem>

          <SettingItem>
            <div className="setting-info">
              <h4>Push Notifications</h4>
              <p>Receive push notifications in your browser</p>
            </div>
            <Toggle
              $active={settings.pushNotifications}
              onClick={() => handleToggle('pushNotifications')}
            />
          </SettingItem>
        </CardContent>
      </SettingsCard>

      <SettingsCard>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingItem>
            <div className="setting-info">
              <h4>Auto Save</h4>
              <p>Automatically save form data as you type</p>
            </div>
            <Toggle
              $active={settings.autoSave}
              onClick={() => handleToggle('autoSave')}
            />
          </SettingItem>

          <SettingItem>
            <div className="setting-info">
              <h4>Theme</h4>
              <p>Choose your preferred theme</p>
            </div>
            <Select
              value={settings.theme}
              onChange={(e) => handleSelectChange('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </Select>
          </SettingItem>

          <SettingItem>
            <div className="setting-info">
              <h4>Date Format</h4>
              <p>Choose how dates are displayed</p>
            </div>
            <Select
              value={settings.dateFormat}
              onChange={(e) => handleSelectChange('dateFormat', e.target.value)}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </Select>
          </SettingItem>
        </CardContent>
      </SettingsCard>

      <SettingsCard>
        <CardHeader>
          <CardTitle>Data & Storage</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingItem>
            <div className="setting-info">
              <h4>Clear Cache</h4>
              <p>Clear cached data to free up space</p>
            </div>
            <Button onClick={handleClearCache}>Clear Cache</Button>
          </SettingItem>

          <SettingItem>
            <div className="setting-info">
              <h4>Export Data</h4>
              <p>Download all your data as a backup</p>
            </div>
            <Button onClick={handleExportData}>Export</Button>
          </SettingItem>
        </CardContent>
      </SettingsCard>

      <SettingsCard>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingItem>
            <div className="setting-info">
              <h4>Delete Account</h4>
              <p>Permanently delete your account and all data</p>
            </div>
            <Button className="danger" onClick={() => showToast('Contact admin to delete account', 'error')}>
              Delete Account
            </Button>
          </SettingItem>
        </CardContent>
      </SettingsCard>
    </SettingsContainer>
  );
}

export default Settings;
