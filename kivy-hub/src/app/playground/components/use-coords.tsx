import { useCallback, useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

export default function useCoords(
  onCoordinate: (x: number, y: number) => void
) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
      });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // This function is just a mock since you mentioned useCoords already provides coordinates
  // In your actual implementation, this would get coordinates from the camera
  const handleClick = useCallback(() => {
    // This mock just returns random coordinates in [0,1] range
    // In your real implementation, this would come from actual camera tracking
    const x = Math.random();
    const y = Math.random();

    onCoordinate(x, y);
  }, [onCoordinate]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('click', handleClick);
    return () => {
      element.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  return { ref, videoRef };
}
