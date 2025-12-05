import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    autoSave: true,
    theme: 'light',
    dateFormat: 'DD/MM/YYYY'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();

    // Listen for login event to reload settings
    const handleLogin = () => {
      loadSettings();
    };

    window.addEventListener('userLoggedIn', handleLogin);
    return () => window.removeEventListener('userLoggedIn', handleLogin);
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  const loadSettings = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('/api/users/settings', {
        headers: { 'x-auth-token': token }
      });
      setSettings(res.data);
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.put('/api/users/settings', newSettings, {
        headers: { 'x-auth-token': token }
      });
      setSettings(newSettings);
      return response.data; // Return the response with message
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  };

  const applyTheme = (themeMode) => {
    if (themeMode === 'dark') {
      document.body.classList.add('dark-theme');
    } else if (themeMode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (settings.theme === 'auto') {
          if (e.matches) {
            document.body.classList.add('dark-theme');
          } else {
            document.body.classList.remove('dark-theme');
          }
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  const formatDate = (date, format = settings.dateFormat) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    switch (format) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD/MM/YYYY':
      default:
        return `${day}/${month}/${year}`;
    }
  };



  const value = {
    settings,
    updateSettings,
    loading,
    formatDate,
    reloadSettings: loadSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
