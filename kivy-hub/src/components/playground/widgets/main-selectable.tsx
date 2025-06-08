import { ReactNode } from 'react';
import Selectable from '../core/selectable';
import { cn } from '@/lib/utils';

interface MainSelectableProps {
  onPress: () => void;
  title?: string;
  icon?: ReactNode;
  showBack?: boolean;
}

export default function MainSelectable({
  onPress,
  title,
  icon,
  showBack = false
}: MainSelectableProps) {
  return (
    <Selectable
      onPress={onPress}
      className={cn(
        'w-72 h-72 bg-white rounded-full flex flex-col items-center justify-center text-white z-10 text-4xl relative'
      )}
    >
      {icon && <div className='absolute inset-0 flex items-center'>{icon}</div>}
      <img
        src='/mesh-gradient.png'
        alt='Kivy Logo'
        className='absolute min-w-[45rem] min-h-[45rem]'
      />
      {title ? (
        <span className='text-black text-6xl font-bold'>{title}</span>
      ) : (
        <img src='/kivy-logo.png' alt='Kivy Logo' className='size-52' />
      )}
      {showBack && (
        <div className='flex items-center justify-center gap-3 mt-5'>
          <i className='fa fa-arrow-left text-4xl text-black'></i>
          <span className='text-black text-4xl font-bold'>Back</span>
        </div>
      )}
    </Selectable>
  );
}
