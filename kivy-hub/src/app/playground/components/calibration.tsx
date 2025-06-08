import React, { useEffect, useRef, useState } from 'react';
import {
  applyHomographyTransform,
  calculateHomographyMatrix
} from '../utils/matrix';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

const TARGET_POINTS = [
  { x: 100, y: 100 },
  { x: window.innerWidth - 100, y: 100 },
  { x: window.innerWidth - 100, y: window.innerHeight - 100 },
  { x: 100, y: window.innerHeight - 100 }
];

function Calibration() {
  const videoRef = useRef(null);
  const [handLandmarker, setHandLandmarker] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const coordsRef = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0
  });

  function getCoords() {
    console.log(coordsRef.current);
    return coordsRef.current;
  }

  const hoveredElements = useRef<Set<Element>>(new Set());

  const ref = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  // MediaPipe hand landmark indices
  // Index finger tip is landmark 8
  // Thumb tip is landmark 4
  const INDEX_FINGER_TIP = 8;
  const THUMB_TIP = 4;

  // Initialize the HandLandmarker
  useEffect(() => {
    const initializeHandLandmarker = async () => {
      setIsModelLoading(true);
      try {
        // For online model:
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        // For local model:
        // const vision = await FilesetResolver.forVisionTasks(
        //   `${process.env.PUBLIC_URL}/models/wasm`
        // );

        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            // For local model:
            // modelAssetPath: handLandmarkerModel,
            delegate: 'GPU'
          },
          numHands: 2,
          runningMode: 'VIDEO'
        });

        setHandLandmarker(landmarker);
      } catch (error) {
        console.error('Error initializing HandLandmarker:', error);
      } finally {
        setIsModelLoading(false);
      }
    };

    initializeHandLandmarker();

    function test() {
      console.log('test');
    }

    // window.addEventListener('mousemove', test);
    //
    // return () => {
    //   window.removeEventListener('mousemove', test);
    // };
  }, []);

  // Set up webcam
  useEffect(() => {
    if (!videoRef.current) return;

    const constraints = {
      video: { width: 640, height: 480 }
    };

    const enableWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', predictWebcam);
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    if (isTracking && !webcamRunning) {
      enableWebcam();
      setWebcamRunning(true);
    } else if (!isTracking && webcamRunning) {
      const tracks = videoRef.current.srcObject?.getTracks();
      tracks?.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setWebcamRunning(false);
    }

    return () => {
      const tracks = videoRef.current?.srcObject?.getTracks();
      tracks?.forEach((track) => track.stop());
    };
  }, [isTracking, webcamRunning]);

  let lastVideoTime = -1;
  let animationFrameId = 0;

  const predictWebcam = async () => {
    if (!handLandmarker || !videoRef.current || !isTracking) {
      return;
    }

    const video = videoRef.current;

    // Check if video has loaded and is playing
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;

      // Process the frame with HandLandmarker
      const startTimeMs = performance.now();
      const results = handLandmarker.detectForVideo(video, startTimeMs);

      // Log finger tips positions
      if (results.landmarks && results.landmarks.length > 0) {
        results.landmarks.forEach((landmarks, handIndex) => {
          const indexFingerTip = landmarks[INDEX_FINGER_TIP];
          const thumbTip = landmarks[THUMB_TIP];

          const distance = calculateDistance(indexFingerTip, thumbTip);

          const x = (1 - indexFingerTip.x) * window.innerWidth;
          const y = indexFingerTip.y * window.innerHeight;

          coordsRef.current = { x, y };

          console.log(coordsRef.current);

          // ref.current.style.left = `${x}px`;
          // ref.current.style.top = `${y}px`;

          const elementsAtPoint = document
            .elementsFromPoint(x, y)
            .filter((el) => el !== ref.current);

          const currentElementsSet = new Set(elementsAtPoint);

          console.log(distance);

          if (distance < 0.1) {
            elementsAtPoint.forEach((element) => {
              // If this element wasn't previously hovered, trigger mouseenter
              element.dispatchEvent(
                new MouseEvent('click', {
                  clientX: x,
                  clientY: y,
                  bubbles: true,
                  cancelable: true
                })
              );
            });
          }

          // Handle mouseenter events for new elements
          elementsAtPoint.forEach((element) => {
            // If this element wasn't previously hovered, trigger mouseenter
            if (!hoveredElements.current.has(element)) {
              element.dispatchEvent(
                new MouseEvent('mousedown', {
                  clientX: x,
                  clientY: y,
                  bubbles: true,
                  cancelable: true
                })
              );
            }
          });

          hoveredElements.current.forEach((element) => {
            // If this element is no longer under the cursor, trigger mouseleave
            if (!currentElementsSet.has(element)) {
              element.dispatchEvent(
                new MouseEvent('mouseup', {
                  clientX: x,
                  clientY: y,
                  bubbles: true,
                  cancelable: true
                })
              );
            }
          });

          // Send mousemove events to all current elements
          // elementsAtPoint.forEach((element) => {
          //   element.dispatchEvent(
          //     new MouseEvent('mousemove', {
          //       clientX: x,
          //       clientY: y,
          //       bubbles: true,
          //       cancelable: true
          //     })
          //   );
          // });

          hoveredElements.current = currentElementsSet;
        });
      }
    }

    // Continue detection loop
    if (isTracking) {
      animationFrameId = requestAnimationFrame(predictWebcam);
    }
  };

  // Calculate distance between two points in 3D space
  const calculateDistance = (point1, point2) => {
    return Math.sqrt(
      Math.pow(point1.x - point2.x, 2) +
        Math.pow(point1.y - point2.y, 2) +
        Math.pow(point1.z - point2.z, 2)
    );
  };

  const toggleTracking = () => {
    if (isTracking) {
      cancelAnimationFrame(animationFrameId);
    }
    setIsTracking(!isTracking);
  };

  //////////

  const [calibrationPoints, setCalibrationPoints] = useState([]);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [matrix, setMatrix] = useState(null);
  const [mappedCoords, setMappedCoords] = useState(null);

  const startCalibration = () => {
    setIsCalibrating(true);
    setCalibrationPoints([]);
    setCurrentPointIndex(0);
    setMatrix(null);
    setMappedCoords(null);
    toggleTracking();
  };

  const handlePointCalibration = async () => {
    if (currentPointIndex >= TARGET_POINTS.length) return;

    const coords = getCoords();
    const newPoints = [...calibrationPoints, coords];
    setCalibrationPoints(newPoints);

    if (currentPointIndex === TARGET_POINTS.length - 1) {
      // Calculate homography matrix when all points are collected
      const M = calculateHomographyMatrix(newPoints, TARGET_POINTS);
      setMatrix(M);
      setIsCalibrating(false);
    } else {
      setCurrentPointIndex((prev) => prev + 1);
    }
  };

  const testMapping = async () => {
    if (!matrix) return;

    try {
      const coords = getCoords();
      const mapped = applyHomographyTransform(coords, matrix);
      setMappedCoords(mapped);
    } catch (error) {
      console.error('Error testing mapping:', error);
    }
  };

  return (
    <div className='calibration-container'>
      {/*<div*/}
      {/*  ref={ref}*/}
      {/*  className='fixed w-20 h-20 min-w-20 min-h-20 max-w-20 max-h-20 bg-red-500'*/}
      {/*></div>*/}
      <video
        ref={videoRef}
        className='w-full max-w-lg'
        width='640'
        height='480'
        autoPlay
        playsInline
        style={{ display: 'none' }}
      />
      <h1>Coordinate Calibration System</h1>

      <div className='calibration-screen'>
        {isCalibrating && currentPointIndex < TARGET_POINTS.length && (
          <div
            className='calibration-point'
            style={{
              left: TARGET_POINTS[currentPointIndex].x,
              top: TARGET_POINTS[currentPointIndex].y
            }}
          />
        )}
      </div>

      <div className='control-panel'>
        {!isCalibrating ? (
          <button onClick={startCalibration}>Start Calibration</button>
        ) : (
          <button onClick={handlePointCalibration}>
            Capture Point {currentPointIndex + 1}
          </button>
        )}

        {matrix && <button onClick={testMapping}>Test Mapping</button>}
      </div>

      {matrix && (
        <div className='matrix-display'>
          <h3>Homography Matrix:</h3>
          <pre>
            {matrix.map(
              (row, i) => row.map((val) => val.toFixed(4)).join('\t') + '\n'
            )}
          </pre>
        </div>
      )}

      {mappedCoords && (
        <div className='matrix-display'>
          <h3>Mapped Coordinates:</h3>
          <pre>
            X: {mappedCoords.x.toFixed(2)}, Y: {mappedCoords.y.toFixed(2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Calibration;
