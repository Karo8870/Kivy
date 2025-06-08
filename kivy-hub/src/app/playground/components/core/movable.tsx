import { ReactNode, useRef, useState } from 'react';
import Selectable from './selectable.tsx';
import { useKivyContext } from '../../lib/contexts/kivy-provider.tsx';

export default function ({ children }: { children: ReactNode }) {
  const { kivyModule } = useKivyContext();

  const [forceSelect, setForceSelect] = useState<boolean>(false);

  const selectableRef = useRef<HTMLDivElement>(null);

  return (
    <Selectable
      delay={2000}
      forceSelect={forceSelect}
      style={{
        position: 'fixed'
      }}
      onPress={() => {
        kivyModule.current.moveTool.mount(selectableRef.current, () => {
          setForceSelect(false);
        });

        setForceSelect(true);
      }}
      refObject={selectableRef}
    >
      {children}
    </Selectable>
  );
}
