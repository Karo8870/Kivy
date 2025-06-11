'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';

export interface Timer {
  id: string;
  initialTime: number;
  countdown: number;
  isRunning: boolean;
  isPaused: boolean;
  label?: string;
  backgroundColor?: string;
}

interface TimerContextType {
  timers: Timer[];
  createTimer: (time: number, label?: string) => string;
  pauseTimer: (id: string) => void;
  resumeTimer: (id: string) => void;
  stopTimer: (id: string) => void;
  removeTimer: (id: string) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

// Define colors for different timers
const TIMER_COLORS = [
  '#90EE90', // light green
  '#F5CBA7', // light orange/peach
  '#AED6F1', // light blue
  '#D7BDE2' // light purple
];

export function TimerProvider({ children }: { children: ReactNode }) {
  const [timers, setTimers] = useState<Timer[]>([]);

  // Handle countdown for all active timers
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((currentTimers) =>
        currentTimers.map((timer) => {
          if (timer.isRunning && !timer.isPaused && timer.countdown > 0) {
            return { ...timer, countdown: timer.countdown - 1 };
          } else if (timer.countdown === 0) {
            return { ...timer, isRunning: false, isPaused: false };
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const createTimer = (time: number, label?: string): string => {
    if (time <= 0) return '';

    const id = Date.now().toString();
    const colorIndex = timers.length % TIMER_COLORS.length;

    const newTimer: Timer = {
      id,
      initialTime: time,
      countdown: time,
      isRunning: true,
      isPaused: false,
      label: label || `Timer ${timers.length + 1}`,
      backgroundColor: TIMER_COLORS[colorIndex]
    };

    setTimers((current) => [...current, newTimer]);
    return id;
  };

  const pauseTimer = (id: string) => {
    setTimers((current) =>
      current.map((timer) =>
        timer.id === id ? { ...timer, isPaused: true } : timer
      )
    );
  };

  const resumeTimer = (id: string) => {
    setTimers((current) =>
      current.map((timer) =>
        timer.id === id ? { ...timer, isPaused: false } : timer
      )
    );
  };

  const stopTimer = (id: string) => {
    setTimers((current) =>
      current.map((timer) =>
        timer.id === id
          ? { ...timer, isRunning: false, isPaused: false }
          : timer
      )
    );
  };

  const removeTimer = (id: string) => {
    setTimers((current) => current.filter((timer) => timer.id !== id));
  };

  return (
    <TimerContext.Provider
      value={{
        timers,
        createTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        removeTimer
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
