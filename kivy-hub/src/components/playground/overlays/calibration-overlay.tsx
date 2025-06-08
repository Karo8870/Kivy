import Overlay from '../core/overlay';

export function CalibrationOverlay() {
  return (
    <Overlay open={true}>
      <img
        src='/markers/marker-1.png'
        alt='marker'
        className='absolute top-0 left-0'
      />
      <img
        src='/markers/marker-2.png'
        alt='marker'
        className='absolute top-0 right-0'
      />
      <img
        src='/markers/marker-3.png'
        alt='marker'
        className='absolute right-0 bottom-0'
      />
      <img
        src='/markers/marker-4.png'
        alt='marker'
        className='absolute bottom-0 left-0'
      />
    </Overlay>
  );
}
