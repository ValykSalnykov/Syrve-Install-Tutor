
import React, { useState, useEffect } from 'react';
import { ScreenProps } from '../types';

interface Task {
  name: string;
  status: 'pending' | 'running' | 'done' | 'error';
  isHeader?: boolean;
}

const INITIAL_TASKS: Task[] = [
  { name: 'Установка POS', status: 'pending', isHeader: true },
  { name: 'TeamViewer Host', status: 'pending' },
  { name: 'AnyDesk', status: 'pending' },
  { name: 'Altap Salamander -> запуск от админ', status: 'pending' },
  { name: 'Импорт AltapSalamander.reg', status: 'pending' },
  { name: '7-Zip', status: 'pending' },
  { name: 'Google Chrome', status: 'pending' },
  { name: 'Notepad++', status: 'pending' },
  { name: 'CompactView', status: 'pending' },
  { name: 'Altap Salamander 4.0', status: 'pending' },
  { name: 'Advanced IP Scanner', status: 'pending' },
  { name: 'Оптимизировать IE', status: 'pending' },
  { name: 'Сделать сеть частной', status: 'pending' },
  { name: 'Параметры Пуск/панели задач', status: 'pending' },
  { name: 'Установить цвет рабочего стола', status: 'pending' },
];

export const FineTuningScreen: React.FC<ScreenProps> = ({ onInteract, autoTriggerStepId, currentStepId }) => {
  const [computerName, setComputerName] = useState('ZodchihDELIVERY');
  const [tvName, setTvName] = useState('Terra Mare Зодчих - Te');
  const [server, setServer] = useState('');
  const [port, setPort] = useState('443');
  
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // --- Visibility Logic based on Step ---
  useEffect(() => {
    // Automatically show/hide the info modal based on the current step
    if (currentStepId === 'ft-details') {
      setShowInfoModal(true);
    } else {
      setShowInfoModal(false);
    }
  }, [currentStepId]);

  // --- Auto Trigger Logic ---
  useEffect(() => {
    if (!autoTriggerStepId) return;

    if (autoTriggerStepId === 'ft-inputs') {
       // Simulate user typing inputs
       setTimeout(() => onInteract('ft-mandatory-inputs'), 500);
    }
    if (autoTriggerStepId === 'ft-start') {
       // Set server to show POS installing optionally
       setServer('terra-mare-zodchykh.daocloud.it');
       handleStart();
    }
    if (autoTriggerStepId === 'ft-log') {
       setIsLogOpen(true);
       onInteract('ft-log-spoiler');
    }
    // ft-details is handled by currentStepId check above since it has actionRequired: 'none'

  }, [autoTriggerStepId, onInteract]);


  // Simulate Task Progress
  useEffect(() => {
    if (!isRunning) return;

    let currentIndex = 1; // Start after header
    const interval = setInterval(() => {
        setTasks(prev => {
            const newTasks = [...prev];
            
            // Mark previous as done
            if (currentIndex > 1) {
                newTasks[currentIndex - 1].status = 'done';
            }
            
            // Mark current as running
            if (currentIndex < newTasks.length) {
                newTasks[currentIndex].status = 'running';
                currentIndex++;
            } else {
                setIsRunning(false);
                clearInterval(interval);
            }
            return newTasks;
        });
    }, 400); // Speed of simulation

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    if (!isRunning) {
        setIsRunning(true);
        // Reset tasks
        setTasks(INITIAL_TASKS.map(t => ({...t, status: t.isHeader ? 'running' : 'pending'})));
        onInteract('ft-btn-start');
    }
  };

  const toggleLog = () => {
    setIsLogOpen(!isLogOpen);
    onInteract('ft-log-spoiler');
  };

  return (
    <div className="w-[800px] h-[550px] bg-[#161b22] flex flex-col shadow-2xl rounded overflow-hidden font-sans border border-slate-700 relative">
      
      {/* Title Bar */}
      <div className="h-8 bg-white flex justify-between items-center px-2 select-none">
         <div className="flex items-center gap-2 text-sm text-gray-800">
             <span className="text-gray-500">🍃</span>
             <span>Syrve Windows Setup</span>
         </div>
         <div className="flex">
             <div className="w-10 h-8 flex items-center justify-center hover:bg-gray-200 cursor-pointer text-gray-600">_</div>
             <div className="w-10 h-8 flex items-center justify-center hover:bg-gray-200 cursor-pointer text-gray-600">□</div>
             <div 
               id="ft-close-btn"
               className="w-10 h-8 flex items-center justify-center hover:bg-red-600 hover:text-white cursor-pointer text-gray-600"
               onClick={() => alert("Приложение свернуто в трей")}
            >
               ✕
            </div>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden text-gray-200">
         
         {/* Left Panel */}
         <div className="flex-1 p-6 flex flex-col border-r border-slate-700">
             <h2 className="text-xl font-bold mb-4 text-white">Параметры настройки</h2>
             
             <div id="ft-mandatory-inputs" className="space-y-4 mb-6">
                 <div>
                     <label className="block text-xs text-gray-400 mb-1">Обязательные поля:</label>
                     <div className="flex gap-4 items-center">
                         <div className="flex-1">
                             <div className="text-xs text-gray-400 mb-0.5">Имя компьютера:</div>
                             <input 
                                type="text" 
                                value={computerName}
                                onChange={e => setComputerName(e.target.value)}
                                className="w-full bg-[#0d1117] border border-gray-600 p-1.5 text-sm text-white focus:border-blue-500 outline-none"
                             />
                         </div>
                         <div className="flex-1">
                             <div className="text-xs text-gray-400 mb-0.5">Имя в TV:</div>
                             <input 
                                type="text" 
                                value={tvName}
                                onChange={e => setTvName(e.target.value)}
                                className="w-full bg-[#0d1117] border border-gray-600 p-1.5 text-sm text-white focus:border-blue-500 outline-none"
                             />
                         </div>
                     </div>
                     <div className="text-[10px] text-gray-500 mt-1">Имя компьютера для переименования ПК и TeamViewer</div>
                 </div>
             </div>

             <div id="ft-pos-section" className="mb-6">
                 <div className="text-sm font-semibold mb-2">Установка POS (опционально):</div>
                 <div className="flex gap-2 items-end">
                     <div className="flex-[3]">
                         <div className="text-xs text-gray-400 mb-0.5">Сервер:</div>
                         <input 
                            type="text" 
                            value={server}
                            onChange={e => setServer(e.target.value)}
                            className="w-full bg-[#0d1117] border border-gray-600 p-1.5 text-sm text-white focus:border-blue-500 outline-none"
                            placeholder="my-server.syrve.online"
                         />
                     </div>
                     <div className="flex-1">
                         <div className="text-xs text-gray-400 mb-0.5">Порт:</div>
                         <input 
                            type="text" 
                            value={port}
                            onChange={e => setPort(e.target.value)}
                            className="w-full bg-[#0d1117] border border-gray-600 p-1.5 text-sm text-white focus:border-blue-500 outline-none"
                         />
                     </div>
                 </div>
                 <div className="text-[10px] text-gray-500 mt-1">Если указаны сервер и порт, POS будет установлен автоматически</div>
             </div>

             <button 
                id="ft-btn-start"
                onClick={handleStart}
                className="w-full bg-[#10b981] hover:bg-[#059669] text-black font-bold py-2 rounded transition-colors mb-6 flex items-center justify-center gap-2"
             >
                ⚙ Запустить настройку
             </button>

             <div className="flex-1 flex flex-col min-h-0">
                 <button 
                    id="ft-log-spoiler"
                    onClick={toggleLog}
                    className="w-full border border-gray-600 py-1 text-sm text-gray-300 hover:bg-gray-800 transition-colors mb-2"
                 >
                     {isLogOpen ? 'Скрыть системный лог' : 'Показать системный лог'}
                 </button>
                 
                 {isLogOpen && (
                     <div className="flex-1 bg-[#0d1117] p-2 overflow-y-auto text-[10px] font-mono text-gray-400 border border-gray-700">
                         <div>[14:39:10] Код загрузки: 917</div>
                         <div>[14:39:10] Пробуем загрузить пакет POS: https://www.daolog.net/syrve/917/917_RMS_Front.zip</div>
                         <div>[14:39:10] Начинаю загрузку...</div>
                         <div className="text-red-400">[14:39:10] Не удалось начать загрузку: 404 Client Error</div>
                         <div>[14:39:10] Пробую 7z формат...</div>
                         <div className="text-green-400">[14:39:49] Файл сохранён: C:\syrve_temp\917\front.7z</div>
                         <div>[14:39:56] Распаковка завершена</div>
                         <div>[14:39:56] Запуск Setup.Front.exe в тихом режиме</div>
                     </div>
                 )}
             </div>
         </div>

         {/* Right Panel */}
         <div id="ft-progress-panel" className="w-[300px] bg-[#161b22] p-6 flex flex-col border-l border-slate-700">
             <div className="flex items-center gap-2 mb-2">
                 <span className="text-xl">📋</span>
                 <h2 className="text-xl font-bold text-white">Ход выполнения</h2>
             </div>
             <div className="text-xs text-gray-500 mb-6">системными задачами и установкой POS в реаль...</div>

             <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                 {tasks.map((task, idx) => (
                     <div key={idx} className="flex items-start gap-3">
                         <div className="mt-0.5">
                             {task.isHeader ? (
                                 <span className="text-orange-500 text-sm animate-spin inline-block">↻</span>
                             ) : (
                                 <>
                                     {task.status === 'done' && <span className="text-green-500">✓</span>}
                                     {task.status === 'running' && <span className="text-orange-500 animate-pulse">➜</span>}
                                     {task.status === 'pending' && <span className="text-gray-600">○</span>}
                                     {task.status === 'error' && <span className="text-red-500">✕</span>}
                                 </>
                             )}
                         </div>
                         <div className={`text-sm ${
                             task.isHeader ? 'text-orange-500 font-bold' : 
                             task.status === 'done' ? 'text-green-500' :
                             task.status === 'running' ? 'text-orange-400' :
                             'text-gray-500'
                         }`}>
                             {task.name}
                             {task.isHeader && <span className="text-gray-500 text-xs block font-normal">Запускаем установщик POS • 85%</span>}
                         </div>
                     </div>
                 ))}
             </div>
         </div>
      </div>

      {/* Info Modal for Step 7 */}
      {showInfoModal && (
        <div id="ft-details-modal" className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 p-8 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1e1e2e] border border-slate-600 w-full max-w-2xl max-h-full overflow-y-auto rounded-lg shadow-2xl p-6 text-gray-300 relative">
                <button 
                    onClick={() => setShowInfoModal(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                    ✕
                </button>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-blue-400">ℹ</span> Полный список действий
                </h3>
                <ul className="space-y-2 text-sm list-disc pl-5">
                    <li>Отключает UAC и уведомления Центра безопасности.</li>
                    <li>Переименовывает диск C: в SyrveSystem и компьютер (Rename-Computer).</li>
                    <li>Создаёт каталог <code className="bg-black/30 px-1 rounded">Downloads\Syrve\archive</code>.</li>
                    <li>Настраивает загрузчик (bcdedit) и план питания High Performance.</li>
                    <li>Включает иконку поиска, скрывает Task View, настраивает визуальные эффекты.</li>
                    <li>Отключает группировку на панели задач и задаёт цвет фона рабочего стола.</li>
                    <li>Делает сеть Private, настраивает TabProcGrowth для IE.</li>
                    <li className="text-green-400">Ставит набор утилит: Advanced IP Scanner, Altap Salamander 4.0, CompactView, Notepad++, Google Chrome, 7-Zip.</li>
                    <li>Проверяет/ставит AnyDesk и TeamViewer Host.</li>
                    <li className="text-orange-400">Установка POS: скачивает дистрибутив, устанавливает POS Front, настраивает config.xml.</li>
                    <li>В завершении перезагружает ПК для применения настроек.</li>
                </ul>
                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={() => setShowInfoModal(false)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm transition-colors"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
