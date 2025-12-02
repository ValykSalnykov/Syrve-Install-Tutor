
import React, { useEffect, useState } from 'react';
import { TutorialStep } from '../types';

interface TutorialOverlayProps {
  currentStep: TutorialStep;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ currentStep, stepIndex, totalSteps, onNext, onPrev }) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    // Clear previous rect immediately to avoid ghosting
    setTargetRect(null);

    const findElement = () => {
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      }
    };

    // Poll frequently for a short duration to catch animations/transitions
    const intervalId = setInterval(findElement, 20);
    const timeoutId = setTimeout(() => clearInterval(intervalId), 1000);

    // Initial check
    findElement();

    window.addEventListener('resize', findElement);
    return () => {
        window.removeEventListener('resize', findElement);
        clearInterval(intervalId);
        clearTimeout(timeoutId);
    };
  }, [currentStep, stepIndex]); 

  if (!targetRect) return null;

  let top = 0;
  let left = 0;
  const padding = 25; 
  
  if (currentStep.position === 'bottom') {
    top = targetRect.bottom + padding;
    left = targetRect.left;
  } else if (currentStep.position === 'top') {
    top = targetRect.top - 200; 
    left = targetRect.left;
  } else if (currentStep.position === 'right') {
      top = targetRect.top;
      left = targetRect.right + padding;
  } else if (currentStep.position === 'left') {
      top = targetRect.top;
      left = targetRect.left - 340; 
  } else {
      top = targetRect.bottom + padding;
      left = targetRect.left;
  }

  const boxWidth = 320;
  const boxHeight = 200; 
  
  // Viewport checking
  if (left + boxWidth > window.innerWidth) left = window.innerWidth - boxWidth - 20;
  if (left < 10) left = 10;
  if (top + boxHeight > window.innerHeight) top = window.innerHeight - boxHeight - 20;
  if (top < 10) top = 10;

  return (
    <>
      <div 
        className="fixed pointer-events-none z-50 border-4 border-yellow-400 rounded transition-all duration-75 animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.6)]"
        style={{
          top: targetRect.top - 4,
          left: targetRect.left - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
        }}
      />

      <div 
        className="fixed z-50 w-80 bg-slate-800 text-white p-4 rounded-lg shadow-xl transition-all duration-300 ease-out flex flex-col"
        style={{ top, left }}
      >
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-yellow-400 uppercase tracking-wider text-xs">Інструктор</h3>
            <span className="text-xs text-slate-400">{stepIndex + 1} / {totalSteps}</span>
        </div>
        <p className="text-sm leading-relaxed mb-4 flex-1 whitespace-pre-wrap">
          {currentStep.message}
        </p>
        
        <div className="flex justify-between items-center pt-2 border-t border-slate-700">
             <button 
               onClick={onPrev}
               disabled={stepIndex === 0}
               className={`text-xs px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 transition-colors ${stepIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
               ← Назад
             </button>
             <button 
               onClick={onNext}
               className="text-xs font-bold px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1 shadow-md"
             >
               Далі →
             </button>
        </div>
        
        {/* Simple arrow indicator */}
        <div 
            className="absolute w-4 h-4 bg-slate-800 rotate-45"
            style={{
                top: currentStep.position === 'bottom' ? -8 : (currentStep.position === 'top' ? 'auto' : 20),
                bottom: currentStep.position === 'top' ? -8 : 'auto',
                left: (currentStep.position === 'bottom' || currentStep.position === 'top') ? 20 : (currentStep.position === 'right' ? -8 : 'auto'),
                right: currentStep.position === 'left' ? -8 : 'auto',
            }}
        />
      </div>
    </>
  );
};
