
import React, { useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { MainScreen } from './components/MainScreen';
import { WebMonitorScreen } from './components/WebMonitorScreen';
import { TutorialOverlay } from './components/TutorialOverlay';
import { TutorialSidebar } from './components/TutorialSidebar';
import { AppScreen } from './types';
import { TUTORIAL_STEPS } from './constants';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('AUTH');
  const [stepIndex, setStepIndex] = useState(0);
  const [autoTriggerStepId, setAutoTriggerStepId] = useState<string | null>(null);

  const currentStep = TUTORIAL_STEPS[stepIndex];

  // Logic when user manually interacts
  const handleInteraction = (elementId: string) => {
    if (currentStep && currentStep.targetId === elementId) {
       // Stop any auto trigger
       setAutoTriggerStepId(null);
       // Move to next step
       setTimeout(() => {
          if (stepIndex < TUTORIAL_STEPS.length - 1) {
            setStepIndex(prev => prev + 1);
          }
       }, 400);
    }
  };

  const handleNextClick = () => {
      // Trigger the action automatically in the child component
      // The child component will then call onInteract, which moves the step forward
      // OR if it's an 'info' step ('none' action), we just move forward
      if (currentStep.actionRequired === 'none') {
          if (stepIndex < TUTORIAL_STEPS.length - 1) {
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
          // Sync screen logic inside effect below, but we set it here too for responsiveness
          updateScreenForIndex(newIndex);
      }
  };

  const handleStepJump = (index: number) => {
    setStepIndex(index);
    updateScreenForIndex(index);
  };

  const updateScreenForIndex = (index: number) => {
      if (index < 5) setCurrentScreen('AUTH');
      else if (index >= 18) setCurrentScreen('WEB_MONITOR');
      else setCurrentScreen('MAIN');
  };

  // Screen Switching Logic based on current step index (Forward progression)
  // Auth steps: 0-4
  // Main steps: 5-17
  // Web Monitor steps: 18+
  if (stepIndex >= 18 && currentScreen !== 'WEB_MONITOR') {
      setCurrentScreen('WEB_MONITOR');
  } else if (stepIndex >= 5 && stepIndex < 18 && currentScreen !== 'MAIN') {
      setCurrentScreen('MAIN');
  } else if (stepIndex < 5 && currentScreen !== 'AUTH') {
      setCurrentScreen('AUTH');
  }

  // Dynamic Window Dimensions
  const getWindowStyle = () => {
      if (currentScreen === 'AUTH') {
          return 'w-[360px] h-[400px]';
      }
      return 'w-[1200px] h-[800px]';
  };

  return (
    <div className="w-full h-screen bg-gray-800 flex overflow-hidden font-sans">
      
      {/* Left Sidebar */}
      <TutorialSidebar 
        currentStepIndex={stepIndex} 
        onStepClick={handleStepJump} 
      />

      {/* Main Workspace */}
      <div className="flex-1 bg-gray-200 flex items-center justify-center p-8 relative overflow-auto">
        
        {/* App Container - Dynamic Size */}
        <div className={`${getWindowStyle()} bg-[#f0f0f0] shadow-2xl rounded-sm overflow-hidden relative border border-gray-500 flex flex-col transition-all duration-300 ease-in-out`}>
          
          {/* Title Bar Simulation (Hidden for Web Monitor usually, but let's keep it consistent context or hide it if simulating full browser) */}
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

        {/* Tutorial Overlay Layer */}
        {currentStep && (
            <TutorialOverlay 
                currentStep={currentStep} 
                stepIndex={stepIndex}
                totalSteps={TUTORIAL_STEPS.length}
                onNext={handleNextClick}
                onPrev={handlePrevClick}
            />
        )}

      </div>

    </div>
  );
};

export default App;
