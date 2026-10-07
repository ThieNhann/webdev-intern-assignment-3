import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; removeToast: (id: string) => void }> = ({ toast, removeToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <div className={`toast ${toast.type}`}>
      <span>{toast.message}</span>
      <button 
        onClick={() => removeToast(toast.id)}
        style={{ marginLeft: 'auto', background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
      >
        ×
      </button>
    </div>
  );
};
