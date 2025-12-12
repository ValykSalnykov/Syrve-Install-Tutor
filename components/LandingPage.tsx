import React from 'react';

interface LandingPageProps {
  onSelectModule: (module: 'SYRVE_INSTALLER' | 'FINE_TUNING' | 'DAO_HUB') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectModule }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-5xl w-full">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            DAO <span className="text-blue-500">Instruction</span> Hub
          </h1>
          <p className="text-slate-400 text-lg">
            Оберіть потрібний модуль для перегляду
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Module 1: Syrve Installer (Active) */}
          <div 
            onClick={() => onSelectModule('SYRVE_INSTALLER')}
            className="group relative bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300 cursor-pointer flex flex-col h-80"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-xl" />
            
            <div className="w-14 h-14 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
              <span className="text-2xl">💾</span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
              Syrve Installer
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
              Інтерактивний тренажер по ознайомленння з програмним забезпеченням DAO. Вивчіть процеси встановлення Syrve Isntall, та роботою с цим у веб-хабі DAO.
            </p>
            
            <div className="flex items-center text-blue-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
              Перейти <span>→</span>
            </div>
          </div>

          {/* Module 2: Fine-Tuning Tool (Active) */}
          <div 
            onClick={() => onSelectModule('FINE_TUNING')}
            className="group relative bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300 cursor-pointer flex flex-col h-80"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-600 rounded-t-xl" />
            
            <div className="w-14 h-14 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
              <span className="text-2xl">🎛️</span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
              Fine-Tuning Tool
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
              Налаштування та оптимізація ПК клієнта. Робота з параметрами POS, системними налаштуваннями та діагностикою.
            </p>
            
            <div className="flex items-center text-purple-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
              Перейти <span>→</span>
            </div>
          </div>

          {/* Module 3: DAO Hub (Active) */}
          <div 
            onClick={() => onSelectModule('DAO_HUB')}
            className="group relative bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300 cursor-pointer flex flex-col h-80"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-t-xl" />
            
            <div className="w-14 h-14 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
              <span className="text-2xl">🌐</span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
              DAO Hub
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
              Інструкції по роботі з інструментами DAO. Time Tracker, База знань та Сайт матриці в одному місці.
            </p>
            
            <div className="flex items-center text-emerald-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
              Перейти <span>→</span>
            </div>
          </div>
        </div>
        
        <footer className="mt-16 text-center text-slate-600 text-xs">
          © 2025 DAO Instruction Hub v1.0
        </footer>
      </div>
    </div>
  );
};