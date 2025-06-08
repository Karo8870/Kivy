import { ReactNode } from 'react';
import { useTimer } from '../../../contexts/timer-context.tsx';
import { useWidget } from '../../../contexts/widget-context.tsx';

export interface TimerMenuItem {
  id: number;
  label: string;
  icon: ReactNode;
  minutes: number;
  timerLabel: string;
  onPress?(): void;
}

export function createTimerMenuItems(
  onSelectTime: (minutes: number, label: string) => void
): TimerMenuItem[] {
  return [
    {
      id: 1,
      label: '5 min',
      icon: <span className='text-5xl font-bold'>5m</span>,
      minutes: 5,
      timerLabel: 'Break Timer',
      onPress() {
        onSelectTime(5, 'Break Timer');
      }
    },
    {
      id: 2,
      label: '15 min',
      icon: <span className='text-5xl font-bold'>15m</span>,
      minutes: 15,
      timerLabel: 'Session Timer',
      onPress() {
        onSelectTime(15, 'Session Timer');
      }
    },
    {
      id: 3,
      label: '30 min',
      icon: <span className='text-5xl font-bold'>30m</span>,
      minutes: 30,
      timerLabel: 'Ongoing Timer',
      onPress() {
        onSelectTime(30, 'Ongoing Timer');
      }
    },
    {
      id: 4,
      label: 'Custom',
      icon: <i className='fa text-6xl fa-plus' />,
      minutes: 0,
      timerLabel: 'Custom Timer',
      onPress() {
        // Could open a custom time input in the future
        onSelectTime(1, 'Custom Timer'); // Default to 1 minute for now
      }
    }
  ];
}

export default function useTimerMenu() {
  const { resetToHome } = useWidget();
  const { createTimer } = useTimer();

  const handleSelectTime = (minutes: number, label: string) => {
    createTimer(minutes * 60, label);
    resetToHome(); // Go back to home screen after selecting a time
  };

  return createTimerMenuItems(handleSelectTime);
}
