'use client';

import {
  HTMLAttributes,
  MouseEvent,
  MutableRefObject,
  ReactNode,
  useRef,
  useState
} from 'react';
import { cn } from '../../lib/utils';

export default function ({
  children,
  refObject,
  onPress,
  delay = 500,
  forceSelect = false,
  stopPropagation = false,
  showFeedback = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  refObject?: MutableRefObject<HTMLDivElement>;
  onPress?: (event: MouseEvent) => void | Promise<void>;
  delay?: number;
  forceSelect?: boolean;
  stopPropagation?: boolean;
  showFeedback?: boolean;
}) {
  const [selected, setSelected] = useState<boolean>(false);
  const [selecting, setSelecting] = useState<boolean>(false);

  const selectingRef = useRef<boolean>(false);

  const timeOutRef = useRef<NodeJS.Timeout | undefined>();

  return (
    <div
      {...props}
      ref={refObject}
      className={cn('flex select-none', props.className)}
      style={{
        boxShadow: showFeedback
          ? selected || forceSelect
            ? 'inset 0 0 40px red'
            : selecting
              ? 'inset 0 0 40px blue'
              : 'none'
          : 'none',
        transition: 'all 0.2s ease-in-out',
        ...props.style
      }}
      onMouseDown={(event) => {
        if (stopPropagation) {
          event.stopPropagation();
        }

        if (props.onMouseEnter) {
          props.onMouseEnter(event);
        }

        if (forceSelect) return;

        setSelecting(true);

        selectingRef.current = true;

        timeOutRef.current = setTimeout(() => {
          if (selectingRef.current) {
            setSelected(true);

            setSelecting(false);

            if (onPress) {
              onPress(event);
            }
          }
        }, delay);
      }}
      onMouseUp={(event) => {
        if (stopPropagation) {
          event.stopPropagation();
        }

        if (props.onMouseLeave) {
          props.onMouseLeave(event);
        }

        if (timeOutRef.current) {
          clearTimeout(timeOutRef.current);
        }

        if (forceSelect) return;

        selectingRef.current = false;

        setSelected(false);
        setSelecting(false);
      }}
    >
      {children}
    </div>
  );
}
