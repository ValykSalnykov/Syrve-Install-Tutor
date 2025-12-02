
import React from 'react';
import { TUTORIAL_STEPS } from '../constants';

interface TutorialSidebarProps {
  currentStepIndex: number;
  onStepClick: (index: number) => void;
}

export const TutorialSidebar: React.FC<TutorialSidebarProps> = ({ currentStepIndex, onStepClick }) => {
  return (
    <div className="w-64 bg-slate-800 text-white h-full flex flex-col shadow-xl z-50">
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1 mt-4">
        {TUTORIAL_STEPS.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          
          return (
            <div 
              key={step.id}
              onClick={() => isCompleted ? onStepClick(index) : null}
              className={`
                p-3 rounded-md text-sm transition-all duration-200 flex items-center gap-3
                ${isActive ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]' : ''}
                ${isCompleted ? 'text-slate-300 hover:bg-slate-700 cursor-pointer' : 'text-slate-500'}
              `}
            >
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border
                ${isActive ? 'border-white bg-blue-500' : ''}
                ${isCompleted ? 'border-green-500 bg-green-900 text-green-400' : ''}
                ${!isActive && !isCompleted ? 'border-slate-600 bg-slate-800' : ''}
              `}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <span className="font-medium">{step.title}</span>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-700 text-xs text-center text-slate-500">
        Крок {currentStepIndex + 1} з {TUTORIAL_STEPS.length}
      </div>
    </div>
  );
};
