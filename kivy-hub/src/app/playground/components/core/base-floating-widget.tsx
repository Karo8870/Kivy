import {
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  bringWidgetToFront,
  registerWidgetRef,
  removeWidgetFromStack,
  unregisterWidgetRef
} from '../../utils/widget-stack-manager';
import Draggable from './draggable';

export interface BaseFloatingWidgetProps {
  /** Unique type name for the widget (e.g., 'recipe', 'timer') */
  widgetType: string;
  /** Initial x position */
  initialX?: number;
  /** Initial y position */
  initialY?: number;
  /** Width constraint for dragging bounds */
  width?: number;
  /** Height constraint for dragging bounds */
  height?: number;
  /** Whether the widget should show its drag handle */
  showDragHandle?: boolean;
  /** Height of the drag handle as percentage or pixels */
  dragHandleHeight?: string | number;
  /** Additional class names for the drag handle */
  dragHandleClassName?: string;
  /** Children to render inside the widget */
  children: ReactNode;
  /** Additional className for the widget container */
  className?: string;
  /** Optional event handler when widget is clicked */
  onWidgetClick?: () => void;
}

export default function BaseFloatingWidget({
  widgetType,
  initialX = 20,
  initialY = 20,
  width = 400,
  height = 400,
  showDragHandle = false,
  dragHandleHeight = '25%',
  dragHandleClassName = '',
  children,
  className = '',
  onWidgetClick
}: BaseFloatingWidgetProps) {
  // Generate a unique ID for this widget instance
  const widgetId = useRef(
    `${widgetType}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  );

  // Position state and refs
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const currentPositionRef = useRef({ x: initialX, y: initialY });

  // Z-index management
  const [zIndex, setZIndex] = useState(100);

  // Memoize setZIndex to maintain consistent reference for registration
  const updateZIndex = useCallback((value: number) => {
    setZIndex(value);
  }, []);

  // Set initial position and register widget
  useEffect(() => {
    if (containerRef.current) {
      // Set initial position
      containerRef.current.style.left = `${position.x}px`;
      containerRef.current.style.top = `${position.y}px`;

      // Pre-optimize for performance
      containerRef.current.style.willChange = 'transform, left, top';
      containerRef.current.style.transform = 'translate3d(0,0,0)';

      // Register with widget stack manager
      registerWidgetRef(widgetId.current, updateZIndex);
      bringWidgetToFront(widgetId.current);
    }

    // Clean up on unmount
    return () => {
      unregisterWidgetRef(widgetId.current);
      removeWidgetFromStack(widgetId.current);
    };
  }, [updateZIndex]);

  // Function to bring this widget to the front
  const bringToFront = () => {
    bringWidgetToFront(widgetId.current);
  };

  // Handle drag start
  const handleDragStart = (event: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    // Bring to front when starting to drag
    bringToFront();

    // Calculate offset for precise positioning
    const rect = containerRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    isDraggingRef.current = true;
    document.body.style.cursor = 'grabbing';
  };

  // Handle drag movement
  const handleDragMove = (
    deltaX: number,
    deltaY: number,
    event: MouseEvent<HTMLDivElement>
  ) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    // Calculate new position with bounds checking
    const newX = Math.max(
      0,
      Math.min(
        window.innerWidth - width,
        event.clientX - dragOffsetRef.current.x
      )
    );
    const newY = Math.max(
      0,
      Math.min(
        window.innerHeight - height,
        event.clientY - dragOffsetRef.current.y
      )
    );

    // Update position with direct DOM manipulation for performance
    containerRef.current.style.left = `${newX}px`;
    containerRef.current.style.top = `${newY}px`;

    // Store current position
    currentPositionRef.current = { x: newX, y: newY };
  };

  // Handle drag end
  const handleDragEnd = () => {
    isDraggingRef.current = false;
    document.body.style.cursor = '';

    // Update React state after dragging ends
    setPosition(currentPositionRef.current);
  };

  // Handle click on the widget to bring to front
  const handleWidgetMouseDown = () => {
    bringToFront();
    if (onWidgetClick) {
      onWidgetClick();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`fixed ${className}`}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        zIndex: zIndex,
        willChange: 'transform, left, top'
      }}
      onMouseDown={handleWidgetMouseDown}
      data-widget-id={widgetId.current}
      data-widget-type={widgetType}
    >
      <Draggable
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        showDragHandle={showDragHandle}
        dragHandleHeight={dragHandleHeight}
        dragHandleClassName={dragHandleClassName}
        stopPropagation={true}
      >
        {children}
      </Draggable>
    </div>
  );
}
