import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils.ts';

interface OverlayProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;
}

export default function Overlay({
  open = false,
  onClose,
  ...props
}: OverlayProps) {
  return (
    <div
      {...props}
      style={{
        display: open ? 'flex' : 'none',
        ...props.style
      }}
      className={cn(
        'fixed top-0 left-0 w-screen h-screen z-50',
        props.className
      )}
    />
  );
}
