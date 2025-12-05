import { useState, useCallback } from 'react';

let toastId = 0;

function useToast() {
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

  return {
    toasts,
    showToast: addToast,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
}

export { useToast };
export default useToast;
