import {
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState
} from 'react';
import { cn } from '@/lib/utils';

export interface DraggableProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  refObject?: MutableRefObject<HTMLDivElement>;
  onPress?: (event: ReactMouseEvent<HTMLDivElement>) => void | Promise<void>;
  onDragStart?: (event: ReactMouseEvent<HTMLDivElement>) => void;
  onDragMove?: (
    deltaX: number,
    deltaY: number,
    event: ReactMouseEvent<HTMLDivElement>
  ) => void;
  onDragEnd?: (event: ReactMouseEvent<HTMLDivElement>) => void;
  dragHandleHeight?: number | string;
  showDragHandle?: boolean;
  dragHandleClassName?: string;
  delay?: number;
  forceSelect?: boolean;
  stopPropagation?: boolean;
  isDraggable?: boolean;
}

export default function Draggable({
  children,
  refObject,
  onPress,
  onDragStart,
  onDragMove,
  onDragEnd,
  dragHandleHeight = '25%',
  showDragHandle = false,
  dragHandleClassName = '',
  delay = 500,
  forceSelect = false,
  stopPropagation = false,
  isDraggable = true,
  ...props
}: DraggableProps) {
  const [selected, setSelected] = useState<boolean>(false);
  const [selecting, setSelecting] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const draggableRef = useRef<HTMLDivElement>(null);
  const selectingRef = useRef<boolean>(false);
  // @ts-ignore
  const timeOutRef = useRef<NodeJS.Timeout | undefined>();

  // Track mouse movement to distinguish between click and drag
  const initialPositionRef = useRef<{ x: number; y: number } | null>(null);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);

  // Track whether we're in the drag handle area
  const isInDragHandleRef = useRef<boolean>(false);

  // Track whether we can start dragging (after delay)
  const canDragRef = useRef<boolean>(false);

  // Handle mousedown for selecting and drag start
  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    console.log('mouse down');
    if (stopPropagation) {
      event.stopPropagation();
    }

    // Only determine if we're in the drag handle area without blocking events
    if (isDraggable && draggableRef.current) {
      const rect = draggableRef.current.getBoundingClientRect();
      const relativeY = event.clientY - rect.top;
      let inDragHandle = false;

      if (
        typeof dragHandleHeight === 'string' &&
        dragHandleHeight.endsWith('%')
      ) {
        const percentage = parseInt(dragHandleHeight) / 100;
        inDragHandle = relativeY <= rect.height * percentage;
      } else {
        inDragHandle = relativeY <= Number(dragHandleHeight);
      }

      console.log('In drag handle:', inDragHandle);
      isInDragHandleRef.current = inDragHandle;

      // Don't block events - that breaks drag functionality
    }

    if (props.onMouseDown) {
      props.onMouseDown(event);
    }

    if (forceSelect) return;

    // Store initial position for drag tracking and click detection
    initialPositionRef.current = { x: event.clientX, y: event.clientY };
    lastPositionRef.current = { x: event.clientX, y: event.clientY };

    // Always start with selection behavior first
    setSelecting(true);
    selectingRef.current = true;
    canDragRef.current = false;

    // Set timeout for press-and-hold to enable dragging
    timeOutRef.current = setTimeout(() => {
      if (
        selectingRef.current &&
        !isDragging &&
        isInDragHandleRef.current &&
        isDraggable
      ) {
        // Enable dragging after delay
        canDragRef.current = true;
        console.log('Can drag now:', true);
      } else if (selectingRef.current && !isDragging) {
        // Regular press if not in drag handle
        setSelected(true);
        setSelecting(false);

        if (onPress) {
          onPress(event);
        }
      }
    }, delay);
  };

  // Handle mousemove for dragging
  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    // Don't block propagation, as it breaks dragging

    if (isDragging && lastPositionRef.current && onDragMove) {
      // Already dragging, continue movement
      const deltaX = event.clientX - lastPositionRef.current.x;
      const deltaY = event.clientY - lastPositionRef.current.y;

      onDragMove(deltaX, deltaY, event);
      lastPositionRef.current = { x: event.clientX, y: event.clientY };
    } else if (
      initialPositionRef.current &&
      !isDragging &&
      isInDragHandleRef.current &&
      isDraggable
    ) {
      // Check if we should start dragging based on movement
      const moveX = Math.abs(event.clientX - initialPositionRef.current.x);
      const moveY = Math.abs(event.clientY - initialPositionRef.current.y);

      // Only start dragging if canDragRef is true (press-and-hold completed) and there's movement
      if (canDragRef.current && (moveX > 3 || moveY > 3)) {
        console.log('Starting drag');
        // Clear selection timeout
        if (timeOutRef.current) {
          clearTimeout(timeOutRef.current);
          timeOutRef.current = undefined;
        }

        // Start dragging
        setIsDragging(true);
        setSelecting(false);
        selectingRef.current = false;

        if (onDragStart) {
          onDragStart(event);
        }

        // Update last position to current
        lastPositionRef.current = { x: event.clientX, y: event.clientY };
      }
    }
  };

  // Handle mouseup for releasing drag
  const handleMouseUp = (event: ReactMouseEvent<HTMLDivElement>) => {
    // Don't block propagation as it breaks dragging

    if (stopPropagation) {
      event.stopPropagation();
    }

    if (props.onMouseUp) {
      props.onMouseUp(event);
    }

    if (isDragging && onDragEnd) {
      console.log('Ending drag');
      onDragEnd(event);
    }

    // Clear timeout
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
      timeOutRef.current = undefined;
    }

    setIsDragging(false);
    selectingRef.current = false;
    canDragRef.current = false;
    lastPositionRef.current = null;
    initialPositionRef.current = null;
    isInDragHandleRef.current = false;

    if (forceSelect) return;

    setSelected(false);
    setSelecting(false);
  };

  // Modify the useEffect part that handles global mouse events
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (
        initialPositionRef.current &&
        !isDragging &&
        isInDragHandleRef.current &&
        isDraggable
      ) {
        // Check if we should start dragging based on movement
        const moveX = Math.abs(e.clientX - initialPositionRef.current.x);
        const moveY = Math.abs(e.clientY - initialPositionRef.current.y);

        // Only start dragging if canDragRef is true (press-and-hold completed) and there's movement
        if (canDragRef.current && (moveX > 3 || moveY > 3)) {
          console.log('Global: Starting drag');
          // Clear selection timeout
          if (timeOutRef.current) {
            clearTimeout(timeOutRef.current);
            timeOutRef.current = undefined;
          }

          // Start dragging
          setIsDragging(true);
          setSelecting(false);
          selectingRef.current = false;

          if (onDragStart) {
            // Create a synthetic React mouse event
            const syntheticEvent = {
              clientX: e.clientX,
              clientY: e.clientY,
              preventDefault: e.preventDefault.bind(e),
              stopPropagation: e.stopPropagation.bind(e)
            } as unknown as ReactMouseEvent<HTMLDivElement>;

            onDragStart(syntheticEvent);
          }

          // Update last position to current
          lastPositionRef.current = { x: e.clientX, y: e.clientY };
        }
      } else if (isDragging && lastPositionRef.current && onDragMove) {
        // Optimize by skipping unnecessary calculations for very small movements
        const deltaX = e.clientX - lastPositionRef.current.x;
        const deltaY = e.clientY - lastPositionRef.current.y;

        // Once dragging has started, update immediately without animation frame for better responsiveness
        if (onDragMove && isDragging && lastPositionRef.current) {
          // Create a synthetic React mouse event
          const syntheticEvent = {
            clientX: e.clientX,
            clientY: e.clientY,
            preventDefault: e.preventDefault.bind(e),
            stopPropagation: e.stopPropagation.bind(e)
          } as unknown as ReactMouseEvent<HTMLDivElement>;

          onDragMove(deltaX, deltaY, syntheticEvent);
        }

        // Update last position immediately to avoid cumulative lag
        lastPositionRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (isDragging && onDragEnd) {
        // Create a synthetic React mouse event
        const syntheticEvent = {
          clientX: e.clientX,
          clientY: e.clientY,
          preventDefault: e.preventDefault.bind(e),
          stopPropagation: e.stopPropagation.bind(e)
        } as unknown as ReactMouseEvent<HTMLDivElement>;

        onDragEnd(syntheticEvent);
      }

      // Clear timeout
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
        timeOutRef.current = undefined;
      }

      setIsDragging(false);
      selectingRef.current = false;
      canDragRef.current = false;
      lastPositionRef.current = null;
      initialPositionRef.current = null;
      isInDragHandleRef.current = false;

      if (!forceSelect) {
        setSelected(false);
        setSelecting(false);
      }
    };

    // Only add global listeners if in the drag handle area or already dragging
    if (isDragging || isInDragHandleRef.current) {
      console.log('Adding global mouse listeners');
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }

    return undefined;
  }, [
    isDragging,
    isInDragHandleRef.current,
    onDragStart,
    onDragMove,
    onDragEnd,
    forceSelect,
    isDraggable
  ]);

  // Clean up any lingering timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    };
  }, []);

  function handleStopPropagation(event: ReactMouseEvent<HTMLDivElement>) {
    if (draggableRef.current && isDraggable) {
      const rect = draggableRef.current.getBoundingClientRect();
      const relativeY = event.clientY - rect.top;

      if (
        typeof dragHandleHeight === 'string' &&
        dragHandleHeight.endsWith('%')
      ) {
        const percentage = parseInt(dragHandleHeight) / 100;
        if (relativeY <= rect.height * percentage) {
          event.stopPropagation();
        }
      } else if (relativeY <= Number(dragHandleHeight)) {
        event.stopPropagation();
      }
    }
  }

  return (
    <div
      {...props}
      ref={(node) => {
        if (refObject) {
          refObject.current = node as HTMLDivElement;
        }
        draggableRef.current = node;
      }}
      className={cn(
        'relative flex select-none',
        isDragging ? 'opacity-80' : '',
        props.className
      )}
      style={{
        cursor: isDragging
          ? 'grabbing'
          : canDragRef.current && isInDragHandleRef.current
            ? 'grab'
            : 'default',
        ...props.style
      }}
      onMouseDown={(event) => {
        handleMouseDown(event);
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={(event) => {
        // Only block clicks from propagating when in drag handle or when dragging
        if (isDraggable && (isInDragHandleRef.current || isDragging)) {
          event.stopPropagation();
        }
        if (props.onClick) {
          props.onClick(event);
        }
      }}
      // onClick={handleStopPropagation}
    >
      {showDragHandle && isDraggable && (
        <div
          className={cn(
            'bg-opacity-20 absolute top-0 right-0 left-0 bg-gray-500',
            isDragging ? 'bg-opacity-40' : '',
            selecting && isInDragHandleRef.current ? 'bg-opacity-30' : '',
            dragHandleClassName
          )}
          style={{
            height: dragHandleHeight,
            cursor: isDragging ? 'grabbing' : 'default',
            zIndex: 1
          }}
        />
      )}
      {children}
    </div>
  );
}
