
import React, { useState, useEffect } from 'react';
import { ScreenProps } from '../types';

export const DaoHubScreen: React.FC<ScreenProps> = ({ onInteract, autoTriggerStepId, currentStepId }) => {
  const [view, setView] = useState<'LANDING' | 'LOGIN' | 'DASHBOARD'>('LANDING');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Auto trigger handling
  useEffect(() => {
    if (!autoTriggerStepId) return;

    if (autoTriggerStepId === 'dao-login-start') {
       onInteract('dao-login-btn');
       setTimeout(() => setView('LOGIN'), 300);
    }
    if (autoTriggerStepId === 'dao-login-form') {
        // Simulate filling form
        setTimeout(() => {
            setEmail('user@daocloud.it');
            setPassword('password123');
            setTimeout(() => {
                handleLogin();
            }, 500);
        }, 500);
    }
    // Dashboard steps are mostly informational, view needs to be DASHBOARD
  }, [autoTriggerStepId]);

  // Ensure correct view if user manually navigates via sidebar
  useEffect(() => {
      if (currentStepId === 'dao-login-start') setView('LANDING');
      if (currentStepId === 'dao-login-form') setView('LOGIN');
      if (['dao-dashboard', 'dao-syrve', 'dao-tracker', 'dao-kb', 'dao-matrix'].includes(currentStepId || '')) {
          setView('DASHBOARD');
      }
  }, [currentStepId]);

  const handleLogin = () => {
    onInteract('dao-login-card'); // trigger next
    setView('DASHBOARD');
  };

  return (
    <div className="w-full h-full flex flex-col font-sans relative overflow-hidden bg-white">
      
      {/* Header (Common) - Removed Coordinator Mode */}
      <div className={`h-12 flex items-center justify-between px-6 shrink-0 transition-colors duration-300 ${view === 'DASHBOARD' ? 'bg-[#1a1b4b]' : 'bg-[#1e1e40]'}`}>
        <div className="text-white font-bold text-lg tracking-wide">Dao hub</div>
        <div className="flex gap-4">
            {view === 'LANDING' ? (
                <button 
                    id="dao-login-btn"
                    onClick={() => { onInteract('dao-login-btn'); setView('LOGIN'); }}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded text-sm transition-colors border border-white/20"
                >
                    Login
                </button>
            ) : view === 'LOGIN' ? (
                 <button className="bg-white/10 text-white px-4 py-1.5 rounded text-sm border border-white/20 opacity-50 cursor-not-allowed">
                    Login
                </button>
            ) : (
                <div className="flex items-center gap-2 text-white text-sm cursor-pointer hover:text-gray-300">
                    <span>➡</span> Вийти
                </div>
            )}
        </div>
      </div>

      {/* --- View 1: Landing (Empty White) --- */}
      {view === 'LANDING' && (
        <div className="flex-1 bg-white">
            {/* Empty white space as per Screenshot_3 */}
        </div>
      )}

      {/* --- View 2: Login Form --- */}
      {view === 'LOGIN' && (
        <div className="flex-1 bg-[#dbeafe] flex flex-col">
            {/* Orange subheader from Screenshot_4 */}
            <div className="bg-[#eab366] px-6 py-2 flex justify-between items-center text-sm font-semibold text-gray-800">
                <div>Користувач</div>
                <div className="text-xs opacity-70">Роль: Черговий</div>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <div id="dao-login-card" className="flex flex-col items-center w-[400px]">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 font-mono">Вхід</h2>
                    <p className="text-gray-500 mb-8 text-sm font-mono">Увійдіть у свій акаунт</p>
                    
                    <div className="bg-white p-8 rounded-xl shadow-lg w-full border border-gray-200">
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-700 mb-1 font-mono ml-1">Email</label>
                            <input 
                                type="text" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ваш email"
                                className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-black bg-gray-50 font-mono"
                            />
                        </div>
                        <div className="mb-6">
                             <label className="block text-xs font-bold text-gray-700 mb-1 font-mono ml-1">Пароль</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ваш пароль"
                                className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-black bg-gray-50 font-mono"
                            />
                        </div>
                        
                        <button 
                            onClick={handleLogin}
                            className="w-full bg-[#111111] text-white py-3 rounded font-bold hover:bg-black transition-colors"
                        >
                            Увійти
                        </button>
                        
                        <div className="text-center mt-4">
                            <span className="text-xs text-gray-500 hover:underline cursor-pointer">Забули пароль?</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- View 3: Dashboard --- */}
      {view === 'DASHBOARD' && (
        <div className="flex-1 bg-[#1a1b4b] flex flex-col items-center justify-center p-8 relative">
             <div className="max-w-5xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">DAO HUB</h1>
                    <p className="text-[#a5b4fc] text-lg">Ваш центр керування додатками і інструментами</p>
                </div>

                <div id="dao-dashboard-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Card 1: Syrve Install */}
                    <div id="dao-card-syrve" className="bg-[#2e2d5b]/50 border border-slate-600/50 hover:border-[#6366f1] rounded-lg p-8 flex flex-col items-center text-center transition-all cursor-pointer group h-64 justify-center">
                        <div className="text-[#eab308] text-4xl mb-4 group-hover:scale-110 transition-transform">⬇</div>
                        <h3 className="text-white font-bold text-xl mb-2">Syrve Install</h3>
                        <p className="text-slate-400 text-sm">
                            Відслідковування встановлення Syrve Office/Syrve Chain
                        </p>
                    </div>

                    {/* Card 2: Time Tracker */}
                    <div id="dao-card-tracker" className="bg-[#2e2d5b]/50 border border-slate-600/50 hover:border-[#6366f1] rounded-lg p-8 flex flex-col items-center text-center transition-all cursor-pointer group h-64 justify-center">
                        <div className="text-[#eab308] text-4xl mb-4 group-hover:scale-110 transition-transform">🕒</div>
                        <h3 className="text-white font-bold text-xl mb-2">Time Tracker</h3>
                        <p className="text-slate-400 text-sm">
                            Відслідковування і керування часом задач
                        </p>
                    </div>

                    {/* Card 3: Knowledge Base */}
                    <div id="dao-card-kb" className="bg-[#2e2d5b]/50 border border-slate-600/50 hover:border-[#6366f1] rounded-lg p-8 flex flex-col items-center text-center transition-all cursor-pointer group h-64 justify-center">
                        <div className="text-[#eab308] text-4xl mb-4 group-hover:scale-110 transition-transform">📖</div>
                        <h3 className="text-white font-bold text-xl mb-2">База Знань</h3>
                        <p className="text-slate-400 text-sm">
                            Офіційна документація і база знань
                        </p>
                    </div>

                     {/* Card 4: Matrix (New Row, aligned left visually but grid places it) */}
                     <div id="dao-card-matrix" className="bg-[#2e2d5b]/50 border border-slate-600/50 hover:border-[#6366f1] rounded-lg p-8 flex flex-col items-center text-center transition-all cursor-pointer group h-64 justify-center">
                        <div className="text-[#eab308] text-4xl mb-4 group-hover:scale-110 transition-transform">🎓</div>
                        <h3 className="text-white font-bold text-xl mb-2">Сайт Матриці</h3>
                        <p className="text-slate-400 text-sm">
                            Платформа для проходження екзаменів
                        </p>
                    </div>

                </div>
             </div>
        </div>
      )}

    </div>
  );
};
