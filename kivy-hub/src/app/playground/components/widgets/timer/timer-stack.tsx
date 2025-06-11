import { AnimatePresence, motion } from 'framer-motion';
import React, { MouseEvent, useRef, useState } from 'react';
import { Timer, useTimer } from '../../../contexts/timer-context';
import BaseFloatingWidget from '../../core/base-floating-widget';
import Draggable from '../../core/draggable';
import Selectable from '../../core/selectable';

const TIMER_HEIGHT = 200;

interface TimerCardProps {
  timer: Timer;
  isExpanded: boolean;
  index: number;
  totalCount: number;
  isTopmost: boolean;
  onToggleExpand: () => void;
  onDragStart?: (event: MouseEvent<HTMLDivElement>) => void;
  onDragMove?: (
    x: number,
    y: number,
    event: MouseEvent<HTMLDivElement>
  ) => void;
  onDragEnd?: (event: MouseEvent<HTMLDivElement>) => void;
}

function formatTime(time: number) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  if (hours === 0) {
    return `${minutes}m ${seconds}s`;
  } else if (minutes === 0) {
    return `${seconds}s`;
  }
  return `${hours}h ${minutes}m ${seconds}s`;
}

// Individual timer card component
export const TimerCard: React.FC<TimerCardProps> = ({
  timer,
  isExpanded,
  index,
  totalCount,
  isTopmost,
  onToggleExpand,
  onDragStart,
  onDragMove,
  onDragEnd
}) => {
  const { pauseTimer, resumeTimer, stopTimer, removeTimer } = useTimer();
  const hasDraggedRef = useRef(false);

  // Calculate progress percentage
  const progress = timer.countdown / timer.initialTime;

  // Dynamic color based on progress
  const getProgressColor = () => {
    if (progress > 0.5) return '#A6E9A6';
    if (progress > 0.25) return '#E9CAA6';
    return '#E9ACA6';
  };

  // Calculate width of colored section based on progress
  const coloredWidth = `${progress * 100}%`;

  // Calculate offset for stacked appearance when collapsed
  const stackOffset = !isExpanded ? `${index * 24}px` : '0px';
  const zIndex = isExpanded ? 50 - index : 50 - index;

  // Handle forwarding drag events to parent with optimizations
  const handleDragStart = (event: MouseEvent<HTMLDivElement>) => {
    if (onDragStart && isTopmost) {
      // Prevent default to avoid text selection during drag
      event.preventDefault();
      hasDraggedRef.current = true;
      onDragStart(event);
    }
  };

  const handleDragMove = (
    deltaX: number,
    deltaY: number,
    event: MouseEvent<HTMLDivElement>
  ) => {
    if (onDragMove && isTopmost) {
      // Forward immediately to parent handler without any delay
      onDragMove(event.clientX, event.clientY, event);
    }
  };

  const handleDragEnd = (event: MouseEvent<HTMLDivElement>) => {
    if (onDragEnd && isTopmost) {
      onDragEnd(event);
      // Reset after a short delay
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 10);
    }
  };

  // Combine content inside a container element
  const cardContent = (
    <div
      className='flex w-full overflow-hidden rounded-[40px] bg-white'
      style={{ height: TIMER_HEIGHT }}
    >
      <div
        style={{
          backgroundColor: getProgressColor(),
          width: coloredWidth
        }}
        className='h-full'
      />

      <div className='absolute top-4 left-6 flex flex-col gap-2'>
        <div className='flex items-center'>
          <i className='fa fa-clock mr-2 text-black' />
          <div className='truncate text-lg font-bold text-black'>
            {timer.label}
          </div>
        </div>
        <div className='text-3xl font-bold text-black tabular-nums'>
          {formatTime(timer.countdown)} left
        </div>
      </div>

      {/* Black section */}
      <div className='absolute bottom-6 flex w-full flex-col justify-center px-6'>
        <div className='flex items-center justify-center gap-4'>
          <Selectable
            onPress={() =>
              timer.isPaused ? resumeTimer(timer.id) : pauseTimer(timer.id)
            }
            className='flex h-16 w-full items-center justify-center rounded-3xl bg-[#FFCC00]'
            stopPropagation={true}
          >
            {timer.isPaused ? (
              <i className='fa fa-play text-2xl text-black' />
            ) : (
              <i className='fa fa-pause text-2xl text-black' />
            )}
          </Selectable>

          <Selectable
            onPress={() => stopTimer(timer.id)}
            className='flex h-16 w-full items-center justify-center rounded-3xl bg-[#FFCC00]'
            stopPropagation={true}
          >
            <i className='fa fa-redo text-2xl text-black' />
          </Selectable>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: 1,
        filter: `brightness(${isExpanded ? 1 : index <= 2 ? 1 - index * 0.4 : 0})`,
        scale: isExpanded ? 1 : index <= 2 ? 1 - index * 0.075 : 0,
        y: isExpanded ? index * (TIMER_HEIGHT + 16) : parseInt(stackOffset),
        zIndex
      }}
      exit={{ opacity: 0, y: 20 }}
      className='absolute top-0 left-0 w-80 overflow-hidden'
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
    >
      {isTopmost ? (
        <Draggable
          className='relative h-full w-full'
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          isDraggable={true}
          showDragHandle={true}
          dragHandleHeight='25%'
          dragHandleClassName='opacity-0'
        >
          <Selectable
            onPress={onToggleExpand}
            className='w-full'
            stopPropagation={true}
            showFeedback={false}
          >
            {cardContent}
          </Selectable>
        </Draggable>
      ) : (
        <Selectable
          onPress={onToggleExpand}
          className='w-full'
          showFeedback={false}
        >
          {cardContent}
        </Selectable>
      )}
    </motion.div>
  );
};

// Main timer stack component
export default function TimerStack() {
  const { timers } = useTimer();
  const [expandedState, setExpandedState] = useState(false);
  const isDraggingRef = useRef(false);

  // Filter out completed timers
  const activeTimers = timers.filter(
    (timer) => timer.isRunning || timer.isPaused
  );

  // Early return when no active timers
  if (activeTimers.length === 0) {
    return null;
  }

  const toggleExpanded = () => {
    if (!isDraggingRef.current) {
      setExpandedState(!expandedState);
    }
  };

  // Calculate position for top-right placement
  const initialX = typeof window !== 'undefined' ? window.innerWidth - 340 : 20;

  return (
    <BaseFloatingWidget
      widgetType='timer-stack'
      initialX={initialX}
      initialY={0}
      width={320}
      height={activeTimers.length * TIMER_HEIGHT}
      showDragHandle={false}
    >
      <div
        className='relative flex flex-col gap-4'
        style={{
          height: expandedState
            ? `${activeTimers.length * TIMER_HEIGHT}px`
            : `${TIMER_HEIGHT}px`,
          width: '320px'
        }}
      >
        <AnimatePresence>
          {activeTimers.map((timer, index) => (
            <TimerCard
              key={timer.id}
              timer={timer}
              isExpanded={expandedState}
              index={index}
              totalCount={activeTimers.length}
              isTopmost={index === 0}
              onToggleExpand={toggleExpanded}
              onDragStart={() => (isDraggingRef.current = true)}
              onDragEnd={() => {
                isDraggingRef.current = false;
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </BaseFloatingWidget>
  );
}
