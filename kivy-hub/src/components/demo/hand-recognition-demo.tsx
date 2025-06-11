export type LandmarkPoint = {
  x: number;
  y: number;
};

export interface HandLandmarks {
  wrist: LandmarkPoint;
  thumb: {
    cmc: LandmarkPoint;
    mcp: LandmarkPoint;
    ip: LandmarkPoint;
    tip: LandmarkPoint;
  };
  index: {
    mcp: LandmarkPoint;
    pip: LandmarkPoint;
    dip: LandmarkPoint;
    tip: LandmarkPoint;
  };
  middle: {
    mcp: LandmarkPoint;
    pip: LandmarkPoint;
    dip: LandmarkPoint;
    tip: LandmarkPoint;
  };
  ring: {
    mcp: LandmarkPoint;
    pip: LandmarkPoint;
    dip: LandmarkPoint;
    tip: LandmarkPoint;
  };
  pinky: {
    mcp: LandmarkPoint;
    pip: LandmarkPoint;
    dip: LandmarkPoint;
    tip: LandmarkPoint;
  };
}

export function transformPoints({ x, y }: LandmarkPoint): LandmarkPoint {
  return {
    x: 1 - x,
    y
  };
}

export function parseLandmarks(points: LandmarkPoint[]): HandLandmarks {
  if (points.length !== 21) {
    throw new Error(`parseLandmarks expected 21 points, got ${points.length}`);
  }
  return {
    wrist: transformPoints(points[0]),
    thumb: {
      cmc: transformPoints(points[1]),
      mcp: transformPoints(points[2]),
      ip: transformPoints(points[3]),
      tip: transformPoints(points[4])
    },
    index: {
      mcp: transformPoints(points[5]),
      pip: transformPoints(points[6]),
      dip: transformPoints(points[7]),
      tip: transformPoints(points[8])
    },
    middle: {
      mcp: transformPoints(points[9]),
      pip: transformPoints(points[10]),
      dip: transformPoints(points[11]),
      tip: transformPoints(points[12])
    },
    ring: {
      mcp: transformPoints(points[13]),
      pip: transformPoints(points[14]),
      dip: transformPoints(points[15]),
      tip: transformPoints(points[16])
    },
    pinky: {
      mcp: transformPoints(points[17]),
      pip: transformPoints(points[18]),
      dip: transformPoints(points[19]),
      tip: transformPoints(points[20])
    }
  };
}

export function parseLandmarksArray(
  landmarks: LandmarkPoint[][]
): HandLandmarks[] {
  return landmarks.map((landmark) => parseLandmarks(landmark));
}

const CONNECTIONS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4], // thumb
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8], // index
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12], // middle
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16], // ring
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20] // pinky
];

export interface DrawOptions {
  baseRadius?: number;
  tipRadius?: number;
  lineWidth?: number;
  color?: string;
  shadow?: boolean;
}

export function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  points: LandmarkPoint[],
  canvasWidth: number,
  canvasHeight: number,
  opts: DrawOptions = {}
) {
  if (points.length !== 21) {
    console.warn(`Expected 21 points, got ${points.length}`);
    return;
  }

  const {
    baseRadius = 3,
    tipRadius = 5,
    lineWidth = 2,
    color = 'rgba(255, 255, 255, 0.9)',
    shadow = true
  } = opts;

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  if (shadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 3;
  }

  const toX = (x: number) => x * canvasWidth;
  const toY = (y: number) => y * canvasHeight;

  ctx.beginPath();
  for (const [i, j] of CONNECTIONS) {
    const p1 = points[i];
    const p2 = points[j];
    ctx.moveTo(toX(p1.x), toY(p1.y));
    ctx.lineTo(toX(p2.x), toY(p2.y));
  }
  ctx.stroke();

  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    const x = toX(pt.x);
    const y = toY(pt.y);

    const isTip = [4, 8, 12, 16, 20].includes(i);
    const radius = isTip ? tipRadius : baseRadius;
    const color = i === 8 ? '#FF0000' : '#FFFFFFE5';

    ctx.fillStyle = '#00000080';
    ctx.beginPath();
    ctx.arc(x, y, radius + 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  if (shadow) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }
}

import {
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { NormalizedLandmark } from '@mediapipe/hands';

import { Point } from '@/lib/types';

export const SECONDARY_TOUCH_DISTANCE = 60;

export const TERTIARY_TOUCH_DISTANCE = 80;

export function getDistance(A: Point, B: Point) {
  return Math.sqrt(
    (A.x * 1000 - B.x * 1000) ** 2 + (A.y * 1000 - B.y * 1000) ** 2
  );
}

interface HandTrackingContextInterface {
  handTracker: HandLandmarker | null;
  modelStatus: ModelStatus;
  videoRef: RefObject<any>;
  rawLandmarks: NormalizedLandmark[][];
  landmarks: HandLandmarks[];
  handEvents: HandEvent[];

  initializeHandLandMarker(): Promise<void>;

  toggleTracking(): void;
}

const handTrackingContext = createContext<HandTrackingContextInterface | null>(
  null
);

export function useHandTracking() {
  const ctx = useContext(handTrackingContext)!;

  if (!ctx) {
    throw new Error(
      'useHandTracking must be used within a HandTrackingProvider'
    );
  }

  return ctx;
}

enum ModelStatus {
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error'
}

export enum HandEvent {
  PRIMARY_TOUCH,
  SECONDARY_TOUCH,
  TERTIARY_TOUCH
}

export function HandTrackingProvider({ children }: { children: ReactNode }) {
  const [modelStatus, setModelStatus] = useState<ModelStatus>(
    ModelStatus.LOADING
  );
  const [handTracker, setHandTracker] = useState<HandLandmarker | null>(null);

  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [webcamRunning, setWebcamRunning] = useState<boolean>(false);

  const [rawLandmarks, setRawLandmarks] = useState<NormalizedLandmark[][]>([]);
  const [landmarks, setLandmarks] = useState<HandLandmarks[]>([]);

  const [handEvents, setHandEvents] = useState<HandEvent[]>([]);

  const videoRef = useRef(null);

  async function initializeHandLandMarker() {
    setModelStatus(ModelStatus.LOADING);

    try {
      const vision = await FilesetResolver.forVisionTasks('/wasm');

      const landMarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: '/models/hand_landmarker.task',
          delegate: 'GPU'
        },
        numHands: 2,
        runningMode: 'VIDEO'
      });

      setHandTracker(landMarker);
      setModelStatus(ModelStatus.READY);
    } catch (error) {
      console.error('Error initializing HandLandMarker:', error);
      setModelStatus(ModelStatus.ERROR);
    }
  }

  useEffect(() => {
    void initializeHandLandMarker();
  }, []);

  let lastVideoTime = -1;
  let animationFrameID = 0;

  const hoveredElements = useRef<Set<Element>>(new Set<Element>());
  const hoveredElementTypes = useRef<Map<Element, number>>(new Map());

  async function predictHandMarks() {
    if (!handTracker || !videoRef.current || !isTracking) {
      return;
    }

    const video = videoRef.current as HTMLVideoElement;

    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;

      const startTimeMs = performance.now();
      const results = handTracker.detectForVideo(video, startTimeMs);

      if (results.landmarks && results.landmarks.length > 0) {
        setRawLandmarks(results.landmarks);

        const parsedLandmarks = parseLandmarksArray(results.landmarks);

        setLandmarks(parsedLandmarks);

        const events: HandEvent[] = [];

        for (let i = 0; i < parsedLandmarks.length; i++) {
          const landmark = parsedLandmarks[i];

          if (
            getDistance(landmark.index.tip, landmark.thumb.tip) <
            SECONDARY_TOUCH_DISTANCE
          ) {
            events.push(HandEvent.SECONDARY_TOUCH);
          } else if (
            getDistance(landmark.index.tip, landmark.middle.tip) <
            TERTIARY_TOUCH_DISTANCE
          ) {
            events.push(HandEvent.TERTIARY_TOUCH);
          } else {
            events.push(HandEvent.PRIMARY_TOUCH);
          }
        }

        setHandEvents(events);
      }
    }

    if (isTracking) {
      animationFrameID = requestAnimationFrame(predictHandMarks);
    }
  }

  useEffect(() => {
    if (!videoRef.current) return;

    const constraints = {
      video: { width: 640, height: 480 }
    };

    async function enableWebcam() {
      try {
        // @ts-ignore
        videoRef.current!.srcObject =
          await navigator.mediaDevices.getUserMedia(constraints);
        // @ts-ignore
        videoRef.current!.addEventListener('loadeddata', predictHandMarks);
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    }

    if (isTracking && !webcamRunning) {
      void enableWebcam();
      setWebcamRunning(true);
    } else if (!isTracking && webcamRunning) {
      // @ts-ignore
      const tracks = videoRef.current.srcObject?.getTracks();
      tracks?.forEach((track: any) => track.stop());
      // @ts-ignore

      videoRef.current.srcObject = null;
      setWebcamRunning(false);
    }

    return () => {
      // @ts-ignore
      const tracks = videoRef.current?.srcObject?.getTracks();
      tracks?.forEach((track: any) => track.stop());
    };
  }, [isTracking, webcamRunning]);

  function toggleTracking() {
    if (isTracking) {
      cancelAnimationFrame(animationFrameID);
    }
    setIsTracking(!isTracking);
  }

  return (
    <handTrackingContext.Provider
      value={{
        handTracker,
        modelStatus,
        initializeHandLandMarker,
        toggleTracking,
        videoRef,
        rawLandmarks,
        landmarks,
        handEvents
      }}
    >
      {children}
      <video
        ref={videoRef}
        className='hidden'
        width='640'
        height='480'
        autoPlay
        playsInline
      />
    </handTrackingContext.Provider>
  );
}

export function HandTrackingVideo() {
  const { modelStatus, rawLandmarks, toggleTracking, videoRef, handEvents } =
    useHandTracking();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  function draw() {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(videoRef.current, 0, 0, w, h);

    for (const landmark of rawLandmarks) {
      drawLandmarks(ctx, landmark, w, h);
    }

    ctx.restore();
  }

  function renderLoop() {
    draw();
    animationFrameRef.current = requestAnimationFrame(renderLoop);
  }

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [rawLandmarks, handEvents]);

  return (
    <canvas
      className='mt-28 rounded-3xl'
      ref={canvasRef}
      width={640}
      height={480}
    />
  );
}

function Wrapper() {
  const [state, setState] = useState<boolean>(false);

  const { toggleTracking, modelStatus } = useHandTracking();

  return (
    <>
      {state ? (
        <HandTrackingVideo />
      ) : (
        <div
          onClick={() => {
            setState(true);
            toggleTracking();
          }}
          className='mt-28 flex h-80 w-[568px] items-center justify-center rounded-3xl border border-dashed border-[rgba(255,255,255,0.4)]'
        >
          <label className='text-3xl text-white/40'>
            Click to activate hand recognition
          </label>
        </div>
      )}
    </>
  );
}

export function HandRecognitionDemo() {
  return (
    <HandTrackingProvider>
      <Wrapper />
    </HandTrackingProvider>
  );
}
