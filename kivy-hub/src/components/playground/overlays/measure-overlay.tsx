import Overlay from '../core/overlay';
import { useEffect, useRef } from 'react';
import { Point } from '@/lib/types';

interface MeasureOverlayProps {
  open: boolean;
  onClose?: () => void;
}

export default function MeasureOverlay({ open, onClose }: MeasureOverlayProps) {
  const lineRef = useRef<SVGLineElement>(null);
  const textRef = useRef<SVGTextElement>(null);

  // @ts-ignore
  const startRef = useRef<Point>();
  // @ts-ignore
  const endRef = useRef<Point>();

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      const line = lineRef.current;
      const text = textRef.current;

      if (startRef.current) {
        let end: Point;

        if (endRef.current) {
          end = endRef.current;
        } else {
          end = {
            x: e.clientX,
            y: e.clientY
          };
        }

        // @ts-ignore

        line.setAttribute('x1', String(startRef.current.x));
        // @ts-ignore

        line.setAttribute('y1', String(startRef.current.y));
        // @ts-ignore

        line.setAttribute('x2', String(end.x));
        // @ts-ignore

        line.setAttribute('y2', String(end.y));
        // @ts-ignore


        text.setAttribute('x', String((startRef.current.x + end.x) / 2));
        // @ts-ignore

        text.setAttribute('y', String((startRef.current.y + end.y) / 2));
        // @ts-ignore

        text.innerHTML = `${Math.round(Math.sqrt((startRef.current.x - end.x) ** 2 + (startRef.current.y - end.y) ** 2))}px`;
      }
    }

    window.addEventListener('mousemove', handleMouseDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseDown);
    };
  }, []);

  return (
    <Overlay
      onClick={(e) => {
        if (!startRef.current) {
          startRef.current = {
            x: e.clientX,
            y: e.clientY
          };

          return;
        }

        if (!endRef.current) {
          endRef.current = {
            x: e.clientX,
            y: e.clientY
          };

          return;
        }

        startRef.current = {
          x: e.clientX,
          y: e.clientY
        };
        // @ts-ignore


        endRef.current = undefined;
      }}
      open={open}
      className='bg-black/90'
      onClose={onClose}
    >
      <svg className='w-full h-full'>
        <line
          ref={lineRef}
          x1={0}
          y1={0}
          x2={0}
          y2={0}
          stroke='#00FF00'
          strokeWidth={2}
        />
        <text ref={textRef} fill='red' fontSize='16' fontWeight='bold' />
      </svg>
    </Overlay>
  );
}
