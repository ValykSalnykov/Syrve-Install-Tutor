import React from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  icon?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, children, onClose, icon }) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-[#f0f0f0] rounded-lg shadow-xl w-[450px] border border-gray-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-white rounded-t-lg border-b border-gray-200">
          <div className="flex items-center gap-2">
            {icon && <span className="text-gray-600">{icon}</span>}
            <span className="text-sm font-semibold text-gray-800">{title}</span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:bg-red-500 hover:text-white px-2 py-0.5 rounded transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 text-sm text-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
};
