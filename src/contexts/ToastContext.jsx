import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', title = null, duration = 3000) => {
    const id = toastId++;
    const newToast = { id, message, type, title, isClosing: false };

    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev =>
      prev.map(toast =>
        toast.id === id ? { ...toast, isClosing: true } : toast
      )
    );

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  }, []);

  const success = useCallback((message, title = null) => {
    return addToast(message, 'success', title);
  }, [addToast]);

  const error = useCallback((message, title = null) => {
    return addToast(message, 'error', title);
  }, [addToast]);

  const warning = useCallback((message, title = null) => {
    return addToast(message, 'warning', title);
  }, [addToast]);

  const info = useCallback((message, title = null) => {
    return addToast(message, 'info', title);
  }, [addToast]);

  const value = {
    toasts,
    showToast: addToast,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default useToast;
