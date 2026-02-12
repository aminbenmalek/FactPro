
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const variantClasses = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-950/20 text-white',
    warning: 'bg-orange-500 hover:bg-orange-600 shadow-orange-950/20 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 shadow-blue-950/20 text-white'
  };

  const iconClasses = {
    danger: 'text-red-400 bg-red-900/30',
    warning: 'text-orange-400 bg-orange-900/30',
    info: 'text-blue-400 bg-blue-900/30'
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${iconClasses[variant]}`}>
              <i className={`fas ${variant === 'danger' ? 'fa-exclamation-triangle' : variant === 'warning' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">{title}</h3>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">{message}</p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-8">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 border border-slate-800 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 ${variantClasses[variant]}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;