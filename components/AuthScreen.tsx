
import React, { useState, useEffect } from 'react';
import { ScreenProps } from '../types';

export const AuthScreen: React.FC<ScreenProps> = ({ onLogin, onInteract, autoTriggerStepId, currentStepId }) => {
  const [userId, setUserId] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  // Auto-action effect
  useEffect(() => {
    if (!autoTriggerStepId) {
        return;
    }

    if (autoTriggerStepId === 'auth-1') {
      const val = 'user_admin';
      setUserId(val);
      setTimeout(() => onInteract('auth-input-id'), 100);
    }
    if (autoTriggerStepId === 'auth-2') {
      setTimeout(() => {
          handleGetCode();
      }, 300);
    }
    if (autoTriggerStepId === 'auth-3') {
       setShowNotification(true);
       // Visual step, wait for user 'Next'
    }
    if (autoTriggerStepId === 'auth-4') {
      setShowNotification(false); // Hide notification when moving to input
      const code = 'OW4O6B';
      setConfirmCode(code);
      setTimeout(() => onInteract('auth-input-code'), 100);
    }
    if (autoTriggerStepId === 'auth-5') {
      onInteract('auth-btn-confirm');
      // No need to manually call onLogin here, App.tsx handles screen switch based on index
    }
  }, [autoTriggerStepId, onInteract]);

  // Ensure notification is visible when entering Step 3 regardless of how we got here
  useEffect(() => {
    if (currentStepId === 'auth-3') {
      setShowNotification(true);
    } else if (currentStepId === 'auth-4' || currentStepId === 'auth-5') {
      setShowNotification(false);
    }
  }, [currentStepId]);

  const handleGetCode = () => {
    if (userId.length > 0) {
      setCodeSent(true);
      onInteract('auth-btn-get-code');
      // If manually clicked, we show notification
      if (!autoTriggerStepId) setShowNotification(true);
    }
  };

  const handleConfirm = () => {
    if (confirmCode.length > 0) {
      onInteract('auth-btn-confirm');
    }
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserId(val);
    if(val.length >= 3) {
       onInteract('auth-input-id');
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmCode(val);
    if(val.length >= 3) {
      onInteract('auth-input-code');
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-[#f0f0f0]">
      
      {/* Main Auth Content */}
      <div className="flex-1 flex flex-col p-4 transition-all duration-300">
        <div className="w-full">
          
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">Ідентифікація користувача:</label>
            <input 
              id="auth-input-id"
              type="password"
              value={userId}
              onChange={handleUserIdChange}
              className="w-full border border-gray-400 p-1.5 text-sm focus:border-blue-500 focus:outline-none shadow-inner bg-white text-black"
              placeholder=""
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">Обліковий запис відправки коду:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" name="accountType" defaultChecked className="text-blue-600" />
                Задачний
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" name="accountType" className="text-blue-600" />
                Чатний
              </label>
            </div>
          </div>

          {codeSent && (
            <div className="mb-3 text-green-700 text-sm font-medium text-center animate-pulse">
              Код відправлено. Перевірте повідомлення.
            </div>
          )}

          {!codeSent ? (
            <button 
              id="auth-btn-get-code"
              onClick={handleGetCode}
              disabled={userId.length === 0}
              className={`w-full py-1.5 border rounded-sm shadow-sm text-sm transition-colors active:translate-y-px
                ${userId.length > 0 
                  ? 'bg-gradient-to-b from-white to-gray-200 border-gray-400 hover:bg-gray-200 text-black' 
                  : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'}`}
            >
              Отримати код доступу
            </button>
          ) : (
            <div className="border border-gray-300 p-3 bg-gray-50 rounded shadow-sm">
              <div className="text-sm text-gray-700 mb-1 font-medium">Підтвердження</div>
              <div className="w-full h-px bg-gray-300 mb-3"></div>

              <div className="text-sm text-center text-gray-700 mb-2">Введіть код підтвердження:</div>
              <input 
                id="auth-input-code"
                type="text" 
                value={confirmCode}
                onChange={handleCodeChange}
                className="w-full text-center text-xl tracking-widest border border-blue-500 p-1.5 mb-2 focus:outline-none bg-white text-black"
                placeholder=""
              />
              <div className="text-xs text-blue-700 text-center mb-3 cursor-pointer hover:underline">
                Введіть код підтвердження, отриманий у повідомленні
              </div>
              
              <div className="flex gap-2">
                <button 
                  id="auth-btn-confirm"
                  onClick={handleConfirm}
                  className="flex-1 bg-gradient-to-b from-white to-gray-200 border border-gray-400 py-1.5 text-xs hover:bg-gray-200 shadow-sm active:translate-y-px rounded-sm text-black"
                >
                  Підтвердити
                </button>
                <button className="flex-1 bg-gradient-to-b from-white to-gray-200 border border-gray-400 py-1.5 text-xs hover:bg-gray-200 shadow-sm active:translate-y-px rounded-sm text-black">
                  Ще раз
                </button>
                <button 
                  onClick={() => { setCodeSent(false); setShowNotification(false); }}
                  className="flex-1 bg-gradient-to-b from-white to-gray-200 border border-gray-400 py-1.5 text-xs hover:bg-gray-200 shadow-sm active:translate-y-px rounded-sm text-black"
                >
                  Скасувати
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-auto text-right text-xs text-gray-400 pt-1">v0.0.1</div>
      </div>

      {/* Telegram Notification Popup - Fixed outside main window */}
      {showNotification && (
        <div 
          id="telegram-notification"
          className="fixed bottom-4 right-4 w-72 bg-[#1f1f1f] border border-[#3e3e3e] shadow-2xl rounded-md flex overflow-hidden animate-bounce transition-all z-[9999] cursor-pointer"
          onClick={() => {
              // Copy code to clipboard simulation or auto-fill
              setConfirmCode('OW4O6B');
              onInteract('auth-input-code');
          }}
        >
          <div className="w-10 bg-[#2b5278] flex items-center justify-center">
             <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#2b5278] font-bold text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.15-.16 2.8-2.57 2.85-2.78.01-.03.01-.13-.05-.18-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.4-1.08.39-.35-.01-1.01-.32-1.51-.47-.61-.19-1.1-.29-1.06-.61.02-.16.24-.32.65-.49 2.56-1.11 4.27-1.84 5.13-2.2 2.44-1.02 2.95-1.2 3.28-1.21.07 0 .24.01.35.1.09.08.12.18.13.25 0 .04.01.09.01.12z" />
                </svg>
             </div>
          </div>
          <div className="flex-1 p-2 bg-[#17212b]">
              <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-white text-xs">Telegram</span>
                  <span className="text-[10px] text-gray-400">now</span>
              </div>
              <div className="text-white font-semibold text-xs mb-0.5">verifudao</div>
              <div className="text-gray-300 text-[10px] leading-snug">
                  Ваш код верифікації: OW4O6B
              </div>
          </div>
        </div>
      )}

    </div>
  );
};
