import Overlay from '../core/overlay.tsx';
import Selectable from '../core/selectable.tsx';

export default function ({
  items,
  open,
  onSelect
}: {
  items: {
    label: string;
    value: string;
  }[];
  open: boolean;
  onSelect: () => void;
}) {
  return (
    <Overlay
      open={open}
      className='flex flex-col items-center justify-center gap-2 backdrop-brightness-50'
    >
      {items.map((item) => (
        <Selectable
          onPress={onSelect}
          key={item.label}
          className='flex items-center justify-center w-80 h-20 bg-blue-500 rounded-xl'
        >
          <label>{item.value}</label>
        </Selectable>
      ))}
    </Overlay>
  );
}
