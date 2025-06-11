import { ReactNode } from 'react';

export function HeroCard({
  children,
  title,
  icon
}: {
  children: ReactNode;
  title: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className='max-w-[600px] grow basis-0 rounded-3xl border-1 border-white/20 bg-black/40 px-[26px] pt-4 pb-10 backdrop-blur-[48px]'>
      <div className='flex items-center gap-4 pb-5'>
        <div className='rounded-full bg-[#FF5BB8]/20 p-2.5'>{icon}</div>
        <h3 className='text-2xl font-medium text-white'>{title}</h3>
      </div>
      <p className='text-base text-white/60'>{children}</p>
    </div>
  );
}
