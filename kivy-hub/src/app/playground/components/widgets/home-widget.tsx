import { useEffect, useState } from 'react';
import { useWidget } from '../../contexts/widget-context';
import MainSelectable from './main-selectable';
import MenuItems from './menu-items';
import useTimerMenu from './timer/timer-menu';

// Home menu items
const createHomeMenuItems = (
  onSelectWidget: (widgetId: string, title: string) => void
) => [
  {
    id: 1,
    label: 'Timer',
    icon: <i className='fa text-6xl fa-timer' />,
    onPress() {
      onSelectWidget('timer', 'Timer');
    }
  },
  {
    id: 2,
    label: 'Measure',
    icon: <i className='fa text-6xl fa-ruler' />,
    onPress() {
      onSelectWidget('measure', 'Measure');
    }
  },
  {
    id: 3,
    label: 'Cutting',
    icon: <i className='fa text-6xl fa-knife' />,
    onPress() {
      onSelectWidget('cutting', 'Cutting');
    }
  },
  {
    id: 4,
    label: 'Recipes',
    icon: <i className='fa text-6xl fa-book' />,
    onPress() {
      onSelectWidget('recipes', 'Recipes');
    }
  },
  {
    id: 5,
    label: 'AI',
    icon: <i className='fa text-6xl fa-brain' />,
    onPress() {
      onSelectWidget('ai', 'AI Assistant');
    }
  }
];

export default function HomeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { screenStack, activeWidget, pushScreen, popScreen } = useWidget();
  const timerMenuItems = useTimerMenu();

  // Get current screen from the stack
  const currentScreen = screenStack[screenStack.length - 1];
  const isRootScreen = screenStack.length === 1;

  // Effect to ensure menu is open when not at root level
  useEffect(() => {
    if (!isRootScreen) {
      setIsOpen(true);
    }
  }, [isRootScreen, screenStack]);

  const handleMainPress = () => {
    if (isRootScreen) {
      // At root level, toggle menu visibility
      setIsOpen(!isOpen);
    } else {
      // Not at root, go back to previous screen
      popScreen();
    }
  };

  // @ts-ignore

  const handleSelectWidget = (widgetId, title) => {
    pushScreen({ id: widgetId, title });
    // Always show menu when selecting a widget
    setIsOpen(true);
  };

  // Determine which menu items to show based on active widget
  const getMenuItems = () => {
    switch (activeWidget) {
      case 'timer':
        return timerMenuItems;
      default:
        return createHomeMenuItems(handleSelectWidget);
    }
  };

  // Add a back icon if we're not on the home screen
  const displayIcon = !isRootScreen ? (
    <i className='fa fa-arrow-left text-xl text-white absolute left-8 top-1/2 transform -translate-y-1/2'></i>
  ) : null;

  // Menu is always open when not at root level
  const shouldShowMenu = !isRootScreen || isOpen;

  return (
    <div className='relative w-80 h-80 flex items-center justify-center z-[100]'>
      <MainSelectable
        title={currentScreen.title}
        onPress={handleMainPress}
        icon={displayIcon}
        showBack={!isRootScreen}
      />

      <MenuItems
        isOpen={shouldShowMenu}
        menuItems={getMenuItems()}
        toggleMenu={() => {
          if (isRootScreen) {
            setIsOpen(!isOpen);
          }
        }}
      />
    </div>
  );
}
