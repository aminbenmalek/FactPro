import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, hideNotification } from "../store";

const NotificationToast: React.FC = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector(
    (state: RootState) => state.notification,
  );

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  const bgClasses = {
    error: "bg-red-600 dark:bg-red-500 shadow-red-900/20",
    success: "bg-emerald-600 dark:bg-emerald-500 shadow-emerald-900/20",
    info: "bg-blue-600 dark:bg-blue-500 shadow-blue-900/20",
  };

  const icons = {
    error: "fa-exclamation-circle",
    success: "fa-check-circle",
    info: "fa-info-circle",
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-right-10 fade-in duration-300">
      <div
        className={`${bgClasses[type]} text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px] max-w-md border border-white/10 backdrop-blur-md`}
      >
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <i className={`fas ${icons[type]} text-xl`}></i>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold leading-tight">{message}</p>
        </div>
        <button
          onClick={() => dispatch(hideNotification())}
          className="w-8 h-8 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
        >
          <i className="fas fa-times opacity-60"></i>
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
