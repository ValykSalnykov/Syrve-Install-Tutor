
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
      <div id="main-header-config" className="px-4 py-2 bg-white border-b border-gray-300 shadow-sm shrink-0">
        <div className="text-gray-500 text-xs mb-1">Параметри встановлення</div>
        
        {/* Server/Port Row */}
        <div className="flex gap-4 items-center mb-2">
          <div className="flex-1 flex items-center gap-2">
            <span className="w-12 text-gray-700">Сервер:</span>
            <input 
              type="text" 
              value={server} 
              onChange={(e) => setServer(e.target.value)}
              className="flex-1 border border-gray-300 p-1.5 text-sm bg-white focus:border-blue-500 outline-none shadow-inner text-black" 
            />
          </div>
          <div className="w-48 flex items-center gap-2">
            <span className="text-gray-700">Порт:</span>
            <input 
              type="text" 
              value={port} 
              onChange={(e) => setPort(e.target.value)}
              className="w-full border border-gray-300 p-1.5 text-sm bg-white focus:border-blue-500 outline-none shadow-inner text-black" 
            />
          </div>
        </div>

        {/* Type/Shortcut Row */}
        <div className="flex items-center justify-between">
          <div className="flex gap-6 items-center">
            <span className="text-gray-700">Тип:</span>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="radio" 
                checked={installType === 'RMS'} 
                onChange={() => setInstallType('RMS')}
                className="w-4 h-4 text-blue-600" 
              />
              <span className={installType === 'RMS' ? 'font-semibold text-black' : 'text-gray-700'}>RMS</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="radio" 
                checked={installType === 'Chain'} 
                onChange={() => setInstallType('Chain')}
                className="w-4 h-4 text-blue-600" 
              />
              <span className={installType === 'Chain' ? 'font-semibold text-black' : 'text-gray-700'}>Chain</span>
            </label>
          </div>
          
          <div className="flex-1 flex items-center justify-end gap-2 ml-8">
            <span className="text-gray-700">Назва ярлика:</span>
            <input 
              type="text" 
              value="Syrve Office" 
              readOnly 
              className="w-64 border border-gray-300 p-1.5 text-sm bg-gray-50 text-gray-500 shadow-inner" 
            />
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

      {/* --- System Status Bar --- */}
      <div id="main-status-bar" className="bg-[#f0f0f0] border-t border-gray-400 p-2 text-xs shrink-0">
          <div className="mb-1 text-gray-600 font-semibold">Стан системи</div>
          <div className="flex items-center gap-4 mb-2">
              <span className="w-32 text-gray-700">Перевірки перед встановленням</span>
              <button className="ml-auto bg-gradient-to-b from-white to-gray-200 border border-gray-400 text-black px-3 py-0.5 rounded-sm hover:bg-gray-200 shadow-sm">Оновити</button>
          </div>
          <div className="flex items-center gap-2">
              <span className="w-12 font-semibold text-gray-700">Диск C:</span>
              <div className="flex-1 h-4 bg-gray-200 border border-gray-400 relative rounded-sm overflow-hidden shadow-inner">
                  <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${diskProgress}%` }}></div>
              </div>
              <span className="text-green-700 font-medium w-40 text-right">Вільно 57.8 ГБ з 237.2 ГБ</span>
          </div>
          <div className="mt-1 flex gap-4 text-gray-500">
             <span>Windows 10 build 10.0.26200</span>
             <span>.NET Framework 4.8.1</span>
             <span className="ml-auto text-blue-600 hover:underline cursor-pointer">Отримати 4.8.1</span>
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
