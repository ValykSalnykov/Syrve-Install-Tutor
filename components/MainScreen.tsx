
import React, { useState, useEffect } from 'react';
import { MOCK_VERSIONS } from '../constants';
import { VersionItem, Task, InstallType, ScreenProps } from '../types';
import { Modal } from './Modal';

export const MainScreen: React.FC<ScreenProps> = ({ onInteract, autoTriggerStepId, currentStepId }) => {
  const [server, setServer] = useState('5nizza-inc-co.syrve.online');
  const [port, setPort] = useState('443');
  const [installType, setInstallType] = useState<InstallType>('RMS');
  const [showInstalled, setShowInstalled] = useState(true);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Modals
  const [showShortcutModal, setShowShortcutModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  
  const [selectedVersion, setSelectedVersion] = useState<VersionItem | null>(null);
  const [shortcutName, setShortcutName] = useState('Syrve Office extra');
  const [diskProgress, setDiskProgress] = useState(25);

  const [queueRunning, setQueueRunning] = useState(false);

  // Filter versions based on selected Install Type (RMS/Chain)
  const filteredVersions = MOCK_VERSIONS.filter(v => v.type === installType);
  const folderInstalls = filteredVersions.filter(v => v.category === 'Folder');

  // --- Auto Trigger Effect ---
  useEffect(() => {
    if (!autoTriggerStepId) return;

    if (autoTriggerStepId === 'main-full-install') {
       // Auto click full install
       handleFullInstall();
    }
    if (autoTriggerStepId === 'main-warning') {
       // Auto click warning OK
       confirmFullInstall();
    }
    if (autoTriggerStepId === 'main-select-version') {
       // Auto select folder version and click shortcut
       const target = MOCK_VERSIONS.find(v => v.id === 'v_folder_rms_2');
       if (target) {
          handleShortcutClick(target, 'main-version-btn-v_folder_rms_2');
       }
    }
    if (autoTriggerStepId === 'main-shortcut-name') {
        setShortcutName('My Custom Shortcut');
        onInteract('modal-shortcut-name');
    }
    if (autoTriggerStepId === 'main-add-shortcut') {
       // Auto confirm shortcut creation
       handleAddShortcutTask();
    }
    if (autoTriggerStepId === 'main-queue-start') {
       // Auto start queue
       startQueue();
    }
    
  }, [autoTriggerStepId]);

  const handleShortcutClick = (version: VersionItem, id: string) => {
    setSelectedVersion(version);
    setShortcutName(`Syrve Office ${version.version}`);
    setShowShortcutModal(true);
    onInteract(id);
  };

  const handleFullInstall = () => {
      // Trigger warning for tutorial purposes
      setShowWarningModal(true);
      onInteract('btn-full-install');
  };

  const handleOfficeFolderInstall = () => {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 8).toUpperCase(),
        type: 'OfficeFolder',
        server: `${server}:${port}`,
        status: 'Waiting',
        progress: 0,
        description: `OfficeFolder ${installType} - Latest | Очікує запуску`
      };
      setTasks(prev => [...prev, newTask]);
  };

  const confirmFullInstall = () => {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 8).toUpperCase(),
        type: 'Повна',
        server: `${server}:${port}`,
        status: 'Waiting',
        progress: 0,
        description: `Повна ${installType} - 9.1.7017.0 | Очікує запуску`
      };
      setTasks(prev => [...prev, newTask]);
      setShowWarningModal(false);
      onInteract('modal-warning-ok');
  };

  const handleAddShortcutTask = () => {
    // If auto-triggered without selection, fallback
    const ver = selectedVersion || MOCK_VERSIONS.find(v => v.id === 'v_folder_rms_2');
    const name = shortcutName;
    
    if (ver) {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 8).toUpperCase(),
        type: 'Ярлик',
        server: `${server}:${port}`,
        status: 'Waiting',
        progress: 0,
        description: `Для ${ver.version} (${name}) | Очікує запуску`
      };
      setTasks(prev => [...prev, newTask]);
      setShowShortcutModal(false);
      onInteract('modal-shortcut-btn');
    }
  };

  const startQueue = () => {
    if (tasks.length === 0) return;
    onInteract('main-queue-panel');
    setQueueRunning(true);
  };

  // Helper for translation
  const getStatusText = (status: string) => {
      if (status === 'Waiting') return 'очікує';
      if (status === 'Installing') return 'виконується';
      if (status === 'Done') return 'готово';
      return 'скасоване';
  }

  // Simulate queue progress
  useEffect(() => {
    let interval: any;
    if (queueRunning) {
      interval = setInterval(() => {
        setTasks(prev => {
          const newTasks = [...prev];
          const activeIndex = newTasks.findIndex(t => t.status !== 'Done');
          
          if (activeIndex !== -1) {
            const active = newTasks[activeIndex];
            active.status = 'Installing';
            active.progress += 1; // Slower progress
            if (active.progress >= 100) {
              active.progress = 100;
              active.status = 'Done';
              active.description = 'Виконано успішно';
            } else {
                active.description = `Встановлення...`
            }
          } else {
            setQueueRunning(false);
          }
          return newTasks;
        });
      }, 30); // Speed
    }
    return () => clearInterval(interval);
  }, [queueRunning]);

  return (
    <div className="flex flex-col h-full w-full bg-[#f0f0f0] text-sm select-none font-sans overflow-hidden" id="main-window-frame">
      
      {/* --- Header Config --- */}
      <div id="main-header-config" className="px-2 py-2 bg-[#f0f0f0] border-b border-gray-300 shrink-0 text-xs">
        <div className="text-black mb-2">Параметри встановлення</div>
        
        {/* Row 1: Server and Port */}
        <div className="flex items-center mb-2">
            <div className="w-20 text-gray-700">Сервер:</div>
            <input 
              type="text" 
              value={server} 
              onChange={(e) => setServer(e.target.value)}
              className="flex-[2] border border-gray-400 p-0.5 px-2 bg-white focus:border-blue-500 outline-none h-6 text-black shadow-inner" 
            />
            <div className="w-16 text-right text-gray-700 mr-2 ml-2">Порт:</div>
             <input 
              type="text" 
              value={port} 
              onChange={(e) => setPort(e.target.value)}
              className="flex-1 border border-gray-400 p-0.5 px-2 bg-white focus:border-blue-500 outline-none h-6 text-black shadow-inner" 
            />
        </div>

        {/* Row 2: Shortcut Name and Type */}
        <div className="flex items-center">
            <div className="w-20 text-gray-700">Назва ярлика:</div>
            <input 
              type="text" 
              value="Syrve Office" 
              readOnly 
              className="flex-[2] border border-gray-400 p-0.5 px-2 bg-white focus:border-blue-500 outline-none h-6 text-black shadow-inner" 
            />
             <div className="w-16 text-right text-gray-700 mr-2 ml-2">Тип:</div>
             <div className="flex-1 flex items-center gap-3">
                 <label className="flex items-center gap-1 text-gray-700 cursor-pointer">
                    <input 
                        type="radio" 
                        checked={installType === 'RMS'} 
                        onChange={() => setInstallType('RMS')}
                        className="w-3 h-3" 
                    />
                    <span>RMS</span>
                 </label>
                  <label className="flex items-center gap-1 text-gray-700 cursor-pointer">
                    <input 
                        type="radio" 
                        checked={installType === 'Chain'} 
                        onChange={() => setInstallType('Chain')}
                        className="w-3 h-3" 
                    />
                    <span>Chain</span>
                 </label>
                  <label className="flex items-center gap-1 text-gray-700 cursor-not-allowed">
                    <input 
                        type="radio" 
                        disabled
                        className="w-3 h-3" 
                    />
                    <span>Call Center</span>
                 </label>
             </div>
        </div>
      </div>

      {/* --- Action Buttons Row --- */}
      <div id="main-action-buttons" className="bg-[#e5e5e5] px-4 py-2 flex gap-4 border-b border-gray-300 shrink-0">
             <button 
               id="btn-full-install"
               onClick={handleFullInstall}
               className="flex-1 bg-gradient-to-b from-white to-gray-200 border border-gray-400 text-black px-4 py-1.5 text-xs hover:bg-gray-200 shadow-sm rounded-sm active:translate-y-px font-medium"
             >
               Повне встановлення
             </button>

          <button 
             onClick={handleOfficeFolderInstall}
             className="flex-1 bg-gradient-to-b from-white to-gray-200 border border-gray-400 text-black px-4 py-1.5 text-xs hover:bg-gray-200 shadow-sm rounded-sm active:translate-y-px font-medium"
           >
             Встановити OfficeFolder
          </button>
      </div>

      {/* --- Versions Grid (Conditional & Fixed Height) --- */}
      {showInstalled && (
        <div className="bg-[#e5e5e5] px-4 pt-2 pb-0 shrink-0 h-40 border-b border-gray-300 flex flex-col" id="main-versions-grid">
          <div className="flex items-center justify-between mb-1 shrink-0">
              <div className="flex items-center">
                   <span className="text-xs text-gray-600 bg-[#e5e5e5] px-1 font-medium">OfficeFolder / Фолдери</span>
              </div>
              <div className="flex items-center gap-2">
                   <span className="text-xs text-gray-600">Встановлені версії:</span>
                   <button 
                      onClick={() => setShowInstalled(!showInstalled)}
                      className="bg-gradient-to-b from-white to-gray-200 border border-gray-400 text-black px-3 py-0.5 text-xs hover:bg-gray-200 shadow-sm active:shadow-inner rounded-sm"
                   >
                     {showInstalled ? 'Сховати список' : 'Показати список'}
                   </button>
              </div>
          </div>
          
          <div className="border border-gray-400 rounded p-2 bg-[#f9f9f9] flex-1 overflow-y-auto shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {folderInstalls.map(v => (
                  <div 
                      key={v.id} 
                      id={`main-version-btn-${v.id}`}
                      className={`flex border rounded overflow-hidden shadow-sm h-7 items-center transition-all
                          ${v.installed ? 'border-green-500 bg-[#e8f5e9]' : 'border-blue-400 bg-blue-50'}`}
                  >
                      <div className={`flex-1 px-2 text-[11px] flex items-center h-full border-r truncate font-medium
                          ${v.installed ? 'border-green-500 text-green-900' : 'border-blue-400 text-blue-900'}`}
                          title={`${v.category} ${v.type} - ${v.version}`}
                      >
                          Фолдер {v.type} - {v.version}
                      </div>
                      <button 
                          onClick={() => handleShortcutClick(v, `main-version-btn-${v.id}`)}
                          className={`px-2 h-full text-[11px] font-semibold transition-colors border-l-0
                              ${v.installed ? 'hover:bg-green-200 text-green-900' : 'hover:bg-blue-200 text-blue-900 bg-white/40'}`}
                      >
                          Ярлик
                      </button>
                  </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Footer Queue (Takes remaining space) --- */}
      <div className="flex-1 bg-[#f0f0f0] flex flex-col shadow-[0_-2px_5px_rgba(0,0,0,0.05)] z-20 overflow-hidden relative">
          
          {!showInstalled && (
              <div className="absolute top-2 right-4 z-30">
                 <button 
                    onClick={() => setShowInstalled(true)}
                    className="bg-gradient-to-b from-white to-gray-200 border border-gray-400 text-black px-3 py-0.5 text-xs hover:bg-gray-200 shadow-sm rounded-sm"
                 >
                   Показати список версій
                 </button>
              </div>
          )}

          <div className="flex-1 bg-white border m-2 border-gray-400 overflow-y-auto flex flex-col" id="main-queue-panel">
               <div className="text-xs text-gray-500 px-2 py-1 bg-gray-50 border-b font-semibold shrink-0">Черга завдань</div>
               <div className="flex-1 overflow-auto">
                 <table className="w-full text-left border-collapse">
                     <thead className="bg-gray-100 text-xs text-gray-600 sticky top-0 shadow-sm z-10">
                         <tr>
                             <th className="border-b border-r border-gray-300 p-1 w-20 font-medium pl-2">ID</th>
                             <th className="border-b border-r border-gray-300 p-1 w-24 font-medium pl-2">Тип</th>
                             <th className="border-b border-r border-gray-300 p-1 w-48 font-medium pl-2">Сервер</th>
                             <th className="border-b border-r border-gray-300 p-1 w-24 font-medium pl-2">Статус</th>
                             <th className="border-b border-r border-gray-300 p-1 w-24 font-medium pl-2">Прогрес</th>
                             <th className="border-b p-1 font-medium pl-2">Опис</th>
                         </tr>
                     </thead>
                     <tbody className="text-xs font-mono">
                         {tasks.map(task => (
                             <tr key={task.id} className="hover:bg-blue-50 transition-colors border-b border-gray-100">
                                 <td className="p-1 pl-2 border-r text-black">{task.id}</td>
                                 <td className="p-1 pl-2 border-r text-black">{task.type}</td>
                                 <td className="p-1 pl-2 border-r truncate text-gray-600">{task.server}</td>
                                 <td className="p-1 pl-2 border-r text-black font-semibold">
                                     <span className={`px-1 rounded ${task.status === 'Installing' ? 'bg-blue-100 text-blue-700' : task.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                                         {getStatusText(task.status)}
                                     </span>
                                 </td>
                                 <td className="p-1 pl-2 border-r text-black font-semibold">
                                     {Math.round(task.progress)}%
                                 </td>
                                 <td className="p-1 pl-2 text-gray-500">{task.description}</td>
                             </tr>
                         ))}
                         {tasks.length === 0 && (
                             <tr><td colSpan={6} className="p-8 text-center text-gray-400 italic">Черга завдань порожня. Додайте завдання зверху.</td></tr>
                         )}
                     </tbody>
                 </table>
               </div>
          </div>

          <div className="px-2 py-2 flex justify-between items-center bg-[#e5e5e5] text-xs border-t border-gray-300 shrink-0">
              <div className="flex gap-2 items-center">
                  <div className="text-gray-600 mr-2">Черга призупинена (очікує запуску)</div>
                  <button 
                    onClick={startQueue} 
                    className="bg-gradient-to-b from-white to-gray-200 border border-gray-400 text-black px-4 py-1 hover:bg-gray-200 rounded-sm shadow-sm active:translate-y-px"
                  >
                    Запустити
                  </button>
                  <button 
                    id="btn-queue-pause"
                    className="bg-gradient-to-b from-white to-gray-200 border border-gray-400 text-black px-4 py-1 hover:bg-gray-200 rounded-sm shadow-sm active:translate-y-px"
                  >
                    Пауза
                  </button>
                  <button 
                    id="btn-queue-resume"
                    className="bg-gradient-to-b from-white to-gray-200 border border-gray-400 text-black px-4 py-1 hover:bg-gray-200 rounded-sm shadow-sm active:translate-y-px"
                  >
                    Продовжити
                  </button>
                  <button 
                    id="btn-queue-cancel"
                    className="bg-gradient-to-b from-white to-gray-200 border border-gray-400 text-black px-4 py-1 hover:bg-gray-200 rounded-sm shadow-sm active:translate-y-px"
                  >
                    Скасувати обране
                  </button>
              </div>
              <button className="bg-gradient-to-b from-white to-gray-200 border border-gray-400 text-black px-4 py-1 hover:bg-gray-200 rounded-sm shadow-sm active:translate-y-px">
                  Додати ярлик
              </button>
          </div>
      </div>

      {/* --- System Status Bar (Redesigned) --- */}
      <div id="main-status-bar" className="bg-[#f0f0f0] border-t border-gray-400 text-xs shrink-0 flex flex-col">
          {/* Status Message Line */}
          <div className="bg-[#e0e0e0] px-2 py-1 border-b border-white text-black font-normal">
              Готово
          </div>

          {/* Section Header */}
          <div className="px-2 py-1 border-t border-gray-300">
              <div className="text-black mb-1">Стан системи</div>
              <div className="h-px bg-gray-300 w-full mb-1"></div>
          </div>

          {/* Checks Row */}
          <div className="px-2 pb-1 flex justify-between items-center">
              <span className="text-black">Перевірки перед встановленням</span>
              <button className="px-3 py-0.5 bg-gradient-to-b from-white to-gray-100 border border-gray-300 rounded-sm shadow-sm hover:bg-gray-50 active:translate-y-px text-black">
                  Оновити
              </button>
          </div>

          {/* Disk Row */}
          <div className="px-2 pb-2 flex items-center">
              <span className="font-semibold text-black mr-2">Диск C:</span>
              <div className="flex-1 mr-2 relative h-5">
                   <div className="absolute inset-0 bg-[#e5e5e5] border border-gray-400">
                       <div className="h-full bg-[#4caf50] transition-all duration-1000" style={{ width: `${diskProgress}%` }}></div>
                   </div>
              </div>
              <span className="text-green-700 text-[11px] whitespace-nowrap mr-6">Вільно 55.3 ГБ з 237.2 ГБ</span>
              
              <div className="flex flex-col text-[11px] w-48 border-l border-gray-300 pl-4">
                  <span className="text-black mb-0.5">Перезавантаження</span>
                  <span className="text-green-600 font-medium">Перезавантаження не потрібне</span>
              </div>
          </div>

          {/* System Info Row */}
          <div className="px-2 pb-2 flex gap-4">
              <div className="flex-1">
                   <div className="text-black font-semibold mb-0.5">Windows</div>
                   <div className="text-green-700">Windows 10 build 10.0.26200 (SP0, AMD64)</div>
              </div>
              <div className="flex-1 flex justify-between items-start">
                   <div>
                      <div className="text-black font-semibold mb-0.5">.NET Framework</div>
                      <div className="text-green-700">.NET Framework 4.8.1</div>
                   </div>
                   <button className="text-blue-600 hover:underline">Отримати 4.8.1</button>
              </div>
          </div>

          {/* Log Button */}
          <div className="px-0 pb-0 mt-1">
               <button className="w-full bg-gradient-to-b from-white to-gray-100 border-t border-gray-300 py-1 text-black hover:bg-gray-50 active:bg-gray-200">
                   Показати журнал
               </button>
          </div>
      </div>

      {/* --- Modals --- */}
      
      {/* Warning Modal */}
      {showWarningModal && (
          <Modal title="Виявлено встановлені версії" onClose={() => setShowWarningModal(false)}>
              <div className="flex gap-4">
                  <div className="text-5xl select-none">⚠️</div>
                  <div className="text-xs text-gray-800 space-y-2">
                      <p className="font-semibold text-sm">Для Syrve {installType} версії 9.1.7017.0 вже знайдено 2 встановлених копій (повні / OfficeFolder).</p>
                      <ul className="list-disc pl-4 space-y-1">
                          <li>Повна 9.1.7017.0 — C:\Program Files\Syrve\SyrveChain\Office</li>
                          <li>Фолдер 9.1.7017.0 — C:\Syrve\9.1.7\Chain\Office</li>
                      </ul>
                      <p>Завдання 'Повне встановлення' все одно буде додано до черги.</p>
                  </div>
              </div>
              <div className="flex justify-end mt-6">
                  <button 
                    id="modal-warning-ok"
                    onClick={confirmFullInstall}
                    className="w-24 py-1.5 bg-gradient-to-b from-white to-gray-200 border border-gray-400 text-black hover:bg-gray-200 rounded-sm shadow-sm active:translate-y-px"
                  >
                      OK
                  </button>
              </div>
          </Modal>
      )}

      {/* Shortcut Modal */}
      {showShortcutModal && (
        <Modal title="Додатковий ярлик" icon="✒️" onClose={() => setShowShortcutModal(false)}>
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <label className="w-24 text-right text-gray-600">Сервер:</label>
                    <input type="text" value={server} readOnly className="flex-1 border border-blue-500 p-1 bg-white outline-none shadow-sm text-black" />
                </div>
                <div className="flex items-center gap-2">
                    <label className="w-24 text-right text-gray-600">Порт:</label>
                    <input type="text" value={port} readOnly className="w-20 border border-gray-300 p-1 bg-white outline-none shadow-sm text-black" />
                </div>
                <div className="flex items-center gap-2">
                    <label className="w-24 text-right text-gray-600">Назва ярлика:</label>
                    <input 
                        id="modal-shortcut-name"
                        type="text" 
                        value={shortcutName} 
                        onChange={(e) => setShortcutName(e.target.value)}
                        className="flex-1 border border-gray-300 p-1 bg-white outline-none focus:border-blue-500 shadow-sm text-black" 
                    />
                </div>
                <div className="flex justify-center gap-3 pt-4">
                    <button 
                        id="modal-shortcut-btn"
                        onClick={handleAddShortcutTask}
                        className="w-24 py-1.5 bg-gradient-to-b from-white to-gray-200 border border-gray-400 text-black hover:bg-gray-200 rounded-sm shadow-sm active:translate-y-px"
                    >
                        Додати
                    </button>
                    <button 
                        onClick={() => setShowShortcutModal(false)}
                        className="w-24 py-1.5 bg-gradient-to-b from-white to-gray-200 border border-gray-400 text-black hover:bg-gray-200 rounded-sm shadow-sm active:translate-y-px"
                    >
                        Скасувати
                    </button>
                </div>
            </div>
        </Modal>
      )}

    </div>
  );
};
