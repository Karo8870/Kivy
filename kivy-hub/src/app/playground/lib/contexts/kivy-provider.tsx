import {
  createContext,
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useRef
} from 'react';
import { KivyModule } from '../core/kivy.module.ts';

interface KivyContextInterface {
  kivyModule: MutableRefObject<KivyModule>;
}

const kivyContext = createContext<KivyContextInterface>(null);

export function useKivyContext() {
  return useContext(kivyContext)!;
}

export function KivyProvider({ children }: { children: ReactNode }) {
  const kivyModule = useRef<KivyModule>(new KivyModule());

  useEffect(() => {
    function mouseMove(e: MouseEvent) {
      kivyModule.current.mouseMove({
        x: e.clientX,
        y: e.clientY
      });
    }

    function mouseDown() {
      kivyModule.current.idleTool.mount();
    }

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mousedown', mouseDown);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mousedown', mouseDown);
    };
  }, []);

  return (
    <kivyContext.Provider
      value={{
        kivyModule
      }}
    >
      {children}
    </kivyContext.Provider>
  );
}
