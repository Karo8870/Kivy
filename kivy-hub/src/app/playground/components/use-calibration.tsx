import { useCallback, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface CalibrationPoint {
  screen: Point;
  camera: Point | null;
}

export default function useCalibration(
  onCalibrated: (matrix: number[][]) => void
) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentPointIndex, setCurrentPointIndex] = useState<number>(-1);
  const [calibrationPoints, setCalibrationPoints] = useState<
    CalibrationPoint[]
  >([
    { screen: { x: 0, y: 0 }, camera: null }, // top-left
    { screen: { x: 1, y: 0 }, camera: null }, // top-right
    { screen: { x: 1, y: 1 }, camera: null }, // bottom-right
    { screen: { x: 0, y: 1 }, camera: null } // bottom-left
  ]);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);

  // Register current point
  const registerPoint = useCallback(
    (cameraX: number, cameraY: number) => {
      if (
        currentPointIndex < 0 ||
        currentPointIndex >= calibrationPoints.length
      )
        return;

      setCalibrationPoints((points) => {
        const newPoints = [...points];
        newPoints[currentPointIndex].camera = { x: cameraX, y: cameraY };
        return newPoints;
      });

      if (currentPointIndex < calibrationPoints.length - 1) {
        setCurrentPointIndex(currentPointIndex + 1);
      } else {
        // All points registered
        setIsCalibrating(false);
        setCurrentPointIndex(-1);
        setIsCalibrated(true);

        // Calculate and return the calibration matrix
        calculateCalibrationMatrix();
      }
    },
    [currentPointIndex, calibrationPoints]
  );

  // Start calibration
  const startCalibration = useCallback(() => {
    setIsCalibrating(true);
    setCurrentPointIndex(0);
    setCalibrationPoints((points) =>
      points.map((p) => ({ ...p, camera: null }))
    );
    setIsCalibrated(false);
  }, []);

  // Calculate homography (calibration matrix)
  const calculateCalibrationMatrix = useCallback(() => {
    // Make sure all points have been registered
    if (calibrationPoints.some((p) => p.camera === null)) return;

    // Using a simple perspective transform matrix for 2D plane
    // This is a simplified approach - for more accuracy, consider using a proper homography calculation library

    // Extract points
    const srcPoints = calibrationPoints.map((p) => p.camera as Point);
    const dstPoints = calibrationPoints.map((p) => p.screen);

    // Create matrix for transformation
    // This is a simple approximation - not a full homography matrix
    const matrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];

    // Estimate scaling and translation factors
    // Calculate average scaling factors
    let scaleX = 0,
      scaleY = 0;
    for (let i = 0; i < srcPoints.length; i++) {
      scaleX +=
        (dstPoints[i].x - dstPoints[0].x) /
        (srcPoints[i].x - srcPoints[0].x || 1);
      scaleY +=
        (dstPoints[i].y - dstPoints[0].y) /
        (srcPoints[i].y - srcPoints[0].y || 1);
    }
    scaleX /= srcPoints.length - 1 || 1;
    scaleY /= srcPoints.length - 1 || 1;

    // Calculate average translation
    let offsetX = 0,
      offsetY = 0;
    for (let i = 0; i < srcPoints.length; i++) {
      offsetX += dstPoints[i].x - srcPoints[i].x * scaleX;
      offsetY += dstPoints[i].y - srcPoints[i].y * scaleY;
    }
    offsetX /= srcPoints.length;
    offsetY /= srcPoints.length;

    // Update matrix
    matrix[0][0] = scaleX;
    matrix[0][2] = offsetX;
    matrix[1][1] = scaleY;
    matrix[1][2] = offsetY;

    console.log('Calibration matrix:', matrix);
    onCalibrated(matrix);

    return matrix;
  }, [calibrationPoints, onCalibrated]);

  return {
    ref,
    videoRef,
    isCalibrating,
    isCalibrated,
    currentPointIndex,
    startCalibration,
    registerPoint
  };
}
