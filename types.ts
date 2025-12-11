
export type AppScreen = 'AUTH' | 'MAIN' | 'WEB_MONITOR';

export type InstallType = 'RMS' | 'Chain';

export interface VersionItem {
  id: string;
  version: string;
  type: InstallType;
  category: 'Full' | 'Folder' | 'Patch';
  installed?: boolean;
}

export interface Task {
  id: string;
  type: string;
  server: string;
  status: 'Waiting' | 'Installing' | 'Done';
  progress: number;
  description: string;
}

export interface TutorialStep {
  id: string;
  title: string; // Short title for sidebar
  targetId: string; // DOM ID to highlight
  message: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  actionRequired: 'click' | 'input' | 'none';
}

export interface ScreenProps {
  onInteract: (id: string) => void;
  autoTriggerStepId: string | null;
  currentStepId?: string;
  onLogin?: () => void;
}
