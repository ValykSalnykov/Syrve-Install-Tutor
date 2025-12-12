
import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { MainScreen } from './components/MainScreen';
import { WebMonitorScreen } from './components/WebMonitorScreen';
import { FineTuningScreen } from './components/FineTuningScreen';
import { DaoHubScreen } from './components/DaoHubScreen';
import { TutorialOverlay } from './components/TutorialOverlay';
import { TutorialSidebar } from './components/TutorialSidebar';
import { LandingPage } from './components/LandingPage';
import { AppScreen } from './types';
import { SYRVE_INSTALLER_STEPS, FINE_TUNING_STEPS, DAO_HUB_STEPS } from './constants';

type ModuleType = 'LANDING' | 'SYRVE_INSTALLER' | 'FINE_TUNING' | 'DAO_HUB';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>('LANDING');

  // --- Syrve Installer State ---
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('AUTH');
  
  // Shared Tutorial State
  const [stepIndex, setStepIndex] = useState(0);
  const [autoTriggerStepId, setAutoTriggerStepId] = useState<string | null>(null);

  // Get current steps based on module
  let steps = SYRVE_INSTALLER_STEPS;
  if (activeModule === 'FINE_TUNING') steps = FINE_TUNING_STEPS;
  if (activeModule === 'DAO_HUB') steps = DAO_HUB_STEPS;

  const currentStep = steps[stepIndex];

  // Reset state when module changes
  useEffect(() => {
    setStepIndex(0);
    setCurrentScreen('AUTH');
    setAutoTriggerStepId(null);
  }, [activeModule]);

  // Logic when user manually interacts
  const handleInteraction = (elementId: string) => {
    if (currentStep && currentStep.targetId === elementId) {
       // Stop any auto trigger
       setAutoTriggerStepId(null);
       // Move to next step
       setTimeout(() => {
          if (stepIndex < steps.length - 1) {
            setStepIndex(prev => prev + 1);
          }
       }, 400);
    }
  };

  const handleNextClick = () => {
      if (!currentStep) return;
      if (currentStep.actionRequired === 'none') {
          if (stepIndex < steps.length - 1) {
            setStepIndex(prev => prev + 1);
          }
      } else {
          // Trigger logic in child
          setAutoTriggerStepId(currentStep.id);
      }
  };

  const handlePrevClick = () => {
      if (stepIndex > 0) {
          const newIndex = stepIndex - 1;
          setStepIndex(newIndex);
          if (activeModule === 'SYRVE_INSTALLER') {
             updateSyrveScreenForIndex(newIndex);
          }
      }
  };

  const handleStepJump = (index: number) => {
    setStepIndex(index);
    if (activeModule === 'SYRVE_INSTALLER') {
        updateSyrveScreenForIndex(index);
    }
  };

  const updateSyrveScreenForIndex = (index: number) => {
      if (index < 5) setCurrentScreen('AUTH');
      else if (index >= 18) setCurrentScreen('WEB_MONITOR');
      else setCurrentScreen('MAIN');
  };

  const handleGoHome = () => {
    setActiveModule('LANDING');
  };

  // Screen Switching Logic based on current step index (Forward progression for Syrve Installer)
  if (activeModule === 'SYRVE_INSTALLER') {
    if (stepIndex >= 18 && currentScreen !== 'WEB_MONITOR') {
        setCurrentScreen('WEB_MONITOR');
    } else if (stepIndex >= 5 && stepIndex < 18 && currentScreen !== 'MAIN') {
        setCurrentScreen('MAIN');
    } else if (stepIndex < 5 && currentScreen !== 'AUTH') {
        setCurrentScreen('AUTH');
    }
  }

  // Dynamic Window Dimensions
  const getWindowStyle = () => {
      if (activeModule === 'FINE_TUNING') return 'w-auto h-auto bg-transparent shadow-none border-none';
      if (activeModule === 'DAO_HUB') return 'w-full h-full bg-white shadow-none border-none'; // Full size for DAO Hub
      if (currentScreen === 'AUTH') {
          return 'w-[360px] h-[400px] bg-[#f0f0f0] shadow-2xl rounded-sm border border-gray-500';
      }
      return 'w-[1200px] h-[800px] bg-[#f0f0f0] shadow-2xl rounded-sm border border-gray-500';
  };

  // --- Render Landing Page ---
  if (activeModule === 'LANDING') {
    return <LandingPage onSelectModule={setActiveModule} />;
  }

  return (
    <div className="w-full h-screen bg-gray-800 flex overflow-hidden font-sans">
      
      {/* Left Sidebar */}
      <TutorialSidebar 
        currentStepIndex={stepIndex} 
        onStepClick={handleStepJump}
        onBackToHome={handleGoHome}
        steps={steps}
      />

      {/* Main Workspace */}
      <div className={`flex-1 bg-gray-200 flex items-center justify-center relative overflow-auto ${activeModule === 'DAO_HUB' ? 'p-0' : 'p-8'}`}>
        
        {activeModule === 'FINE_TUNING' ? (
            <FineTuningScreen 
                onInteract={handleInteraction}
                autoTriggerStepId={autoTriggerStepId}
                currentStepId={currentStep?.id}
            />
        ) : activeModule === 'DAO_HUB' ? (
            <DaoHubScreen 
                onInteract={handleInteraction}
                autoTriggerStepId={autoTriggerStepId}
                currentStepId={currentStep?.id}
            />
        ) : (
            // SYRVE INSTALLER WRAPPER
            <div className={`${getWindowStyle()} overflow-hidden relative flex flex-col transition-all duration-300 ease-in-out`}>
            
                {/* Title Bar Simulation (Syrve Installer only) */}
                {currentScreen !== 'WEB_MONITOR' && (
                <div className="h-8 bg-white border-b border-gray-300 flex items-center justify-between pl-3 select-none shrink-0">
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                    <span className="text-gray-400">⬇</span>
                    <span>Syrve Installer {currentScreen === 'AUTH' ? '– Авторизація' : ''}</span>
                    </div>
                    
                    {/* Window Controls */}
                    <div className="flex h-full">
                    <div className="w-10 h-full flex items-center justify-center hover:bg-gray-200 cursor-pointer text-gray-600 transition-colors">
                        <div className="w-2.5 h-px bg-black"></div>
                    </div>
                    <div className="w-10 h-full flex items-center justify-center hover:bg-gray-200 cursor-pointer text-gray-600 transition-colors">
                        <div className="w-2.5 h-2.5 border border-black"></div>
                    </div>
                    <div className="w-10 h-full flex items-center justify-center hover:bg-red-600 hover:text-white cursor-pointer text-gray-600 text-lg leading-none transition-colors">
                        ×
                    </div>
                    </div>
                </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-hidden relative bg-white">
                {currentScreen === 'AUTH' && (
                    <AuthScreen 
                    onLogin={() => setCurrentScreen('MAIN')} 
                    onInteract={handleInteraction}
                    autoTriggerStepId={autoTriggerStepId}
                    currentStepId={currentStep?.id}
                    />
                )}
                
                {currentScreen === 'MAIN' && (
                    <MainScreen 
                    onInteract={handleInteraction} 
                    autoTriggerStepId={autoTriggerStepId}
                    currentStepId={currentStep?.id}
                    />
                )}

                {currentScreen === 'WEB_MONITOR' && (
                    <WebMonitorScreen
                    onInteract={handleInteraction}
                    autoTriggerStepId={autoTriggerStepId}
                    currentStepId={currentStep?.id}
                    />
                )}
                </div>
            </div>
        )}

        {/* Tutorial Overlay Layer */}
        {currentStep && (
            <TutorialOverlay 
                currentStep={currentStep} 
                stepIndex={stepIndex}
                totalSteps={steps.length}
                onNext={handleNextClick}
                onPrev={handlePrevClick}
            />
        )}

      </div>
    </div>
  );
};

export default App;
