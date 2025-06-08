'use client';

import { TabNavigation, TabNavigationItem } from '@/components/tab-navigation';
import { KivyButton } from '@/components/buttons/kivy-button';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  return (
    <motion.header
      className={cn(
        'sticky z-50 flex items-center justify-between gap-8 self-center bg-[#414141]/20 p-3 backdrop-blur-[48px]'
      )}
      layout='size'
      animate={{
        top: pathname === '/' ? '36px' : '0px',
        borderRadius: pathname === '/' ? '9999px' : '0px',
        border: pathname === '/' ? '1px solid #414141' : 'none',
        width: '100dvw',
        maxWidth: pathname === '/' ? 'min-content' : '100dvw'
      }}
    >
      <TabNavigation>
        <TabNavigationItem
          key='home'
          url='/'
          className='flex items-center gap-2'
        >
          Home
        </TabNavigationItem>
        <TabNavigationItem
          key='documentation'
          url='/docs/getting-started/overview'
        >
          Documentation
        </TabNavigationItem>
      </TabNavigation>
      <KivyButton href='/playground' className='bg-[#151515]'>
        Playground
      </KivyButton>
    </motion.header>
  );
}
