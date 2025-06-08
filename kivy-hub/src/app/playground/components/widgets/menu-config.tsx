import { ReactNode } from 'react';

export interface MenuItem {
  id: number;
  label: string;
  icon: ReactNode;
  onPress?(): void;
}

export function createMenuItems(
  setMeasureOpen: (open: boolean) => void,
  setTimerOpen: (open: boolean) => void
): MenuItem[] {
  return [
    {
      id: 1,
      label: 'Timer',
      icon: <i className='fa text-6xl fa-timer' />,
      onPress() {
        setMeasureOpen(false);
        setTimerOpen(true);
      }
    },
    {
      id: 2,
      label: 'Measure',
      icon: <i className='fa text-6xl fa-ruler' />,
      onPress() {
        setMeasureOpen(true);
        setTimerOpen(false);
      }
    },
    { id: 3, label: 'Cutting', icon: <i className='fa text-6xl fa-knife' /> },
    {
      id: 4,
      label: 'Recipes',
      icon: <i className='fa text-6xl fa-book' />,
      onPress() {
        setMeasureOpen(false);
        setTimerOpen(false);
      }
    },
    { id: 5, label: 'AI', icon: <i className='fa text-6xl fa-brain' /> }
  ];
} 