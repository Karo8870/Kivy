import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Selectable from '../core/selectable';

interface MenuItem {
  id: number;
  label: string;
  icon: ReactNode;
  onPress?(): void;
}

interface MenuItemsProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  toggleMenu: () => void;
}

export default function MenuItems({
  isOpen,
  menuItems,
  toggleMenu
}: MenuItemsProps) {
  const radius = 270;

  return (
    <>
      {menuItems.map((item, index) => {
        const angle = -Math.PI * (0.35 + index / (menuItems.length - 1) / 1.25);
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        return (
          <motion.div
            key={item.id}
            className='absolute w-32 h-32'
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: isOpen ? x : 0,
              y: isOpen ? y : 0,
              opacity: isOpen ? 1 : 0
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Selectable
              onPress={() => {
                if (item.onPress) {
                  item.onPress();
                  toggleMenu();
                }
              }}
              className='w-32 h-32 bg-white rounded-full flex items-center justify-center text-black'
            >
              {item.icon}
            </Selectable>
          </motion.div>
        );
      })}
    </>
  );
}
