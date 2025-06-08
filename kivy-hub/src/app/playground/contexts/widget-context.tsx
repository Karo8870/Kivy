import { createContext, ReactNode, useContext, useState } from 'react';

export type WidgetType =
  | 'home'
  | 'timer'
  | 'measure'
  | 'cutting'
  | 'recipes'
  | 'ai';

interface WidgetScreen {
  id: WidgetType;
  title: string;
}

interface WidgetContextType {
  screenStack: WidgetScreen[];
  activeWidget: WidgetType;
  pushScreen: (screen: WidgetScreen) => void;
  popScreen: () => void;
  resetToHome: () => void;
}

const HOME_SCREEN: WidgetScreen = {
  id: 'home',
  // @ts-ignore
  title: null
};

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export function WidgetProvider({ children }: { children: ReactNode }) {
  const [screenStack, setScreenStack] = useState<WidgetScreen[]>([HOME_SCREEN]);

  const pushScreen = (screen: WidgetScreen) => {
    setScreenStack((stack) => [...stack, screen]);
  };

  const popScreen = () => {
    if (screenStack.length > 1) {
      setScreenStack((stack) => stack.slice(0, -1));
    }
  };

  const resetToHome = () => {
    setScreenStack([HOME_SCREEN]);
  };

  return (
    <WidgetContext.Provider
      value={{
        screenStack,
        activeWidget: screenStack[screenStack.length - 1].id,
        pushScreen,
        popScreen,
        resetToHome
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
}

export function useWidget() {
  const context = useContext(WidgetContext);
  if (context === undefined) {
    throw new Error('useWidget must be used within a WidgetProvider');
  }
  return context;
}
