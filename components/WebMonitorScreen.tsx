
import React, { useState, useEffect } from 'react';
import { ScreenProps } from '../types';

export const WebMonitorScreen: React.FC<ScreenProps> = ({ onInteract, autoTriggerStepId, currentStepId }) => {
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showPipWindow, setShowPipWindow] = useState(false);

  useEffect(() => {
    // Automatically close the popup if we navigate away from the details steps
    // This handles both auto-trigger and manual "Next" navigation from step 20 to 21
    if (currentStepId && currentStepId !== 'web-details' && currentStepId !== 'web-details-info') {
        setShowDetailsPopup(false);
    }
  }, [currentStepId]);

  useEffect(() => {
    if (!autoTriggerStepId) return;

    if (autoTriggerStepId === 'web-details') {
      setTimeout(() => {
        handleShowDetails();
      }, 500);
    }

    if (autoTriggerStepId === 'web-archive') {
       setShowDetailsPopup(false); // Ensure close before action
       setTimeout(() => {
         // Simulate archive click
         onInteract('btn-archive-success');
       }, 500);
    }

    if (autoTriggerStepId === 'web-pip') {
        setTimeout(() => {
            setShowPipWindow(true);
            onInteract('btn-pip-mode');
        }, 500);
    }
  }, [autoTriggerStepId]);

  const handleShowDetails = () => {
    setShowDetailsPopup(true);
    // Move to next step manually after opening because onInteract triggers next step immediately
    onInteract('btn-details-error');
  };

  return (
    <div id="web-monitor-container" className="w-full h-full bg-gray-100 flex flex-col font-sans select-none relative">
      
      {/* Header */}
      <div className="bg-[#1e1e40] h-12 flex items-center justify-between px-6 shrink-0">
        <div className="text-white font-bold text-lg tracking-wide">Dao hub</div>
        <div className="flex gap-6 text-sm text-white font-medium">
          <div className="flex items-center gap-1 opacity-90 hover:opacity-100 cursor-pointer">
             <span>➡</span> Вийти
          </div>
        </div>
      </div>

      {/* Subheader */}
      <div className="bg-[#eab366] px-6 py-1 flex justify-between items-center text-sm font-semibold text-gray-800 shrink-0">
        <div>Користувач</div>
        <div className="text-xs opacity-70">Роль: Черговий</div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-700">Встановлення BackOffice / Chain</h1>
          <div className="flex gap-2">
             <button className="bg-[#3b82f6] text-white px-4 py-1.5 rounded text-sm shadow-sm hover:bg-blue-600">Поточні (3)</button>
             <button className="bg-gray-200 text-gray-600 px-4 py-1.5 rounded text-sm shadow-sm hover:bg-gray-300">Архів (0)</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
           <h2 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Загальний пул <span className="text-gray-400 font-normal">(3)</span></h2>
           
           <div id="web-pool-list" className="space-y-3">
              
              {/* Card 1: Error (Red) */}
              <div className="bg-[#ffebeb] border border-[#ffb3b3] rounded-md p-4 flex justify-between items-center relative overflow-hidden">
                  <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-[#ff4d4d]"></div>
                  <div>
                      <div className="font-bold text-gray-800">792-659-996.syrve.online</div>
                      <div className="text-[#ff4d4d] text-sm mt-1">Помилка</div>
                  </div>
                  <div className="flex gap-2">
                      <button 
                        id="btn-details-error"
                        onClick={handleShowDetails}
                        className="bg-[#3b82f6] text-white w-8 h-8 flex items-center justify-center rounded shadow-sm hover:bg-blue-600 transition-colors"
                      >
                         ➜
                      </button>
                      <button className="bg-[#ed8936] text-white px-4 py-1 rounded shadow-sm text-sm hover:bg-orange-600 transition-colors">
                         Архів
                      </button>
                  </div>
              </div>

              {/* Card 2: Installing (Blue) */}
              <div className="bg-[#e0f2fe] border border-[#90cdf4] rounded-md p-4 flex justify-between items-center relative overflow-hidden">
                  <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-[#3b82f6]"></div>
                  <div>
                      <div className="font-bold text-gray-800">westhills.daocloud.it</div>
                      <div className="flex items-center gap-2 mt-1">
                          <span className="text-[#3b82f6] text-sm">Встановлення...</span>
                          <span className="bg-[#fbbf24] text-black text-xs px-2 py-0.5 rounded font-mono font-medium shadow-sm">67г 52хв 19с</span>
                      </div>
                  </div>
                  <div className="flex gap-2">
                      <button className="bg-[#3b82f6] text-white w-8 h-8 flex items-center justify-center rounded shadow-sm hover:bg-blue-600 transition-colors">
                         ➜
                      </button>
                      <button className="bg-[#ed8936] text-white px-4 py-1 rounded shadow-sm text-sm hover:bg-orange-600 transition-colors">
                         Архів
                      </button>
                  </div>
              </div>

              {/* Card 3: Success (Green) */}
              <div className="bg-[#dcfce7] border border-[#86efac] rounded-md p-4 flex justify-between items-center relative overflow-hidden">
                  <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-[#22c55e]"></div>
                  <div>
                      <div className="font-bold text-gray-800">westhills.daocloud.it</div>
                      <div className="text-[#22c55e] text-sm mt-1">Успішно</div>
                  </div>
                  <div className="flex gap-2">
                      <button className="bg-[#3b82f6] text-white w-8 h-8 flex items-center justify-center rounded shadow-sm hover:bg-blue-600 transition-colors">
                         ➜
                      </button>
                      <button 
                        id="btn-archive-success"
                        className="bg-[#ed8936] text-white px-4 py-1 rounded shadow-sm text-sm hover:bg-orange-600 transition-colors"
                      >
                         Архів
                      </button>
                  </div>
              </div>

           </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
         <button 
           id="btn-pip-mode"
           onClick={() => setShowPipWindow(!showPipWindow)}
           className="bg-white border border-gray-300 shadow-sm text-gray-600 px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-gray-50 transition-colors"
         >
             📌 PIP Mode
         </button>
      </div>

      {/* Details Simulated Popup Window */}
      {showDetailsPopup && (
        <div className="absolute top-10 left-10 right-10 bottom-20 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <div id="web-details-popup-content" className="w-full max-w-4xl bg-[#202124] rounded-lg shadow-2xl overflow-hidden flex flex-col h-[500px] border border-gray-600 animate-in fade-in zoom-in duration-200">
                {/* Browser Title Bar */}
                <div className="h-9 bg-[#202124] flex items-center px-4 justify-between select-none">
                    <div className="flex items-center gap-3 text-gray-400 text-xs">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="ml-2 font-medium">about:blank - Google Chrome</span>
                    </div>
                    <div className="flex gap-4 text-gray-400">
                        <span>─</span>
                        <span>☐</span>
                        <span className="cursor-pointer hover:text-white" onClick={() => setShowDetailsPopup(false)}>✕</span>
                    </div>
                </div>
                
                {/* Browser URL Bar */}
                <div className="bg-[#35363a] px-3 py-2 flex items-center gap-2 border-b border-gray-700">
                   <div className="text-gray-400">⟳</div>
                   <div className="flex-1 bg-[#202124] rounded-full px-4 py-1 text-sm text-gray-300 font-mono">
                      about:blank
                   </div>
                </div>

                {/* Browser Content */}
                <div className="flex-1 bg-white overflow-auto flex flex-col">
                    <div className="bg-[#2d2d2d] text-white p-3 flex justify-between items-center">
                        <h2 className="font-bold text-lg">Звіти встановлення для сервера: 792-659-996.syrve.online</h2>
                        <button 
                            onClick={() => setShowDetailsPopup(false)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm transition-colors"
                        >
                            Закрити
                        </button>
                    </div>
                    
                    <div className="p-4">
                        <table className="w-full border-collapse border border-gray-300 text-sm">
                            <thead className="bg-gray-100 text-gray-800">
                                <tr>
                                    <th className="border border-gray-300 p-2 text-left font-bold text-gray-700">Версія</th>
                                    <th className="border border-gray-300 p-2 text-left font-bold text-gray-700">Тип встановлення</th>
                                    <th className="border border-gray-300 p-2 text-left font-bold text-gray-700">Статус</th>
                                    <th className="border border-gray-300 p-2 text-left font-bold text-gray-700">Дія</th>
                                    <th className="border border-gray-300 p-2 text-left font-bold text-gray-700">Час</th>
                                    <th className="border border-gray-300 p-2 text-left font-bold text-gray-700">Помилка</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                <tr className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-2 text-black">9.1.7017.0</td>
                                    <td className="border border-gray-300 p-2 text-black">rms</td>
                                    <td className="border border-gray-300 p-2 text-red-600 font-bold">Помилка</td>
                                    <td className="border border-gray-300 p-2 text-black">error</td>
                                    <td className="border border-gray-300 p-2 text-gray-600">02.12.2025, 15:03:46</td>
                                    <td className="border border-gray-300 p-2 text-black">Помилка встановлення (код 1). Деталі:</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-2 text-black">9.1.7017.0</td>
                                    <td className="border border-gray-300 p-2 text-black">rms</td>
                                    <td className="border border-gray-300 p-2 text-green-600 font-bold">Успішно</td>
                                    <td className="border border-gray-300 p-2 text-black">install_started</td>
                                    <td className="border border-gray-300 p-2 text-gray-600">02.12.2025, 14:55:25</td>
                                    <td className="border border-gray-300 p-2 text-black">-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Simulated PIP Window Overlay */}
      {showPipWindow && (
          <div className="fixed bottom-10 right-10 w-[300px] h-[400px] bg-white rounded-lg shadow-2xl border border-gray-400 z-[100] flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300">
             {/* Header */}
             <div className="bg-[#18181b] h-8 flex items-center justify-between px-2 rounded-t-lg shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-gray-200 text-xs">☊</span>
                    <span className="text-gray-200 text-xs font-medium">hub.daolog.net</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-gray-400 text-xs cursor-pointer hover:text-white">⛶</span>
                    <button onClick={() => setShowPipWindow(false)} className="text-gray-400 text-xs hover:text-white">✕</button>
                </div>
             </div>
             
             {/* Compact Content */}
             <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
                <h3 className="text-sm font-bold text-gray-700 mb-2">Загальний пул <span className="font-normal text-gray-500">(3)</span></h3>
                <div className="space-y-2">
                    {/* Compact Item 1: Error */}
                    <div className="bg-[#ffebeb] border border-[#ffb3b3] rounded p-2 text-xs">
                        <div className="font-bold text-gray-800 truncate">792-659-996.syrve.online</div>
                        <div className="text-[#ff4d4d] mt-1">Помилка</div>
                    </div>
                    {/* Compact Item 2: Installing */}
                    <div className="bg-[#e0f2fe] border border-[#90cdf4] rounded p-2 text-xs">
                         <div className="font-bold text-gray-800 truncate">westhills.daocloud.it</div>
                         <div className="flex justify-between items-center mt-1">
                             <span className="text-[#3b82f6]">Встановлення...</span>
                             <span className="bg-[#fbbf24] px-1 rounded text-[10px]">(70г 16хв 10с)</span>
                         </div>
                    </div>
                    {/* Compact Item 3: Success */}
                    <div className="bg-[#dcfce7] border border-[#86efac] rounded p-2 text-xs">
                         <div className="font-bold text-gray-800 truncate">westhills.daocloud.it</div>
                         <div className="text-[#22c55e] mt-1">Успішно</div>
                    </div>
                </div>
             </div>
          </div>
      )}

    </div>
  );
};
