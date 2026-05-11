import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import type { RootState, AppDispatch } from '../store';
import { hideNotification } from '../features/notificationSlice';
import { type NotificationType } from '../types';

const ToastItem: React.FC<{ id: string; message: string; type: NotificationType }> = ({ id, message, type }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      dispatch(hideNotification(id));
    }, 200); // Matches the exit animation duration
  }, [id, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [handleClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 ${isExiting ? 'animate-toast-out' : 'animate-toast-in'} ${colors[type]}`}>
      {icons[type]}
      <p className="text-sm font-medium text-slate-800">{message}</p>
      <button 
        onClick={handleClose}
        className="ml-auto p-1 hover:bg-black/5 rounded-full transition-colors"
      >
        <X className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  );
};

const Toast: React.FC = () => {
  const { notifications } = useSelector((state: RootState) => state.notification);

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-80 pointer-events-none">
      {notifications.map((n) => (
        <div key={n.id} className="pointer-events-auto">
          <ToastItem id={n.id} message={n.message} type={n.type} />
        </div>
      ))}
    </div>
  );
};

export default Toast;
