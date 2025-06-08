import Overlay from '../core/overlay';
import Selectable from '../core/selectable';

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
          className='flex h-20 w-80 items-center justify-center rounded-xl bg-blue-500'
        >
          <label>{item.value}</label>
        </Selectable>
      ))}
    </Overlay>
  );
}
