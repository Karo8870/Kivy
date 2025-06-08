import { useState, useRef, useEffect } from 'react';
import Overlay from '../core/overlay';
import Selectable from '../core/selectable';
import { Point } from '@/lib/types';

interface SlicingOverlayProps {
  open: boolean;
  onClose?: () => void;
}

type ShapeType = 'rectangle' | 'circle' | null;
type SlicingStage = 'select-shape' | 'show-slices';

export default function SlicingOverlay({ open, onClose }: SlicingOverlayProps) {
  const [stage, setStage] = useState<SlicingStage>('select-shape');
  const [shape, setShape] = useState<ShapeType>(null);
  const [slices, setSlices] = useState<number>(4);
  const [points, setPoints] = useState<Point[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  // Reset state when overlay opens
  useEffect(() => {
    if (open) {
      setStage('select-shape');
      setShape(null);
      setSlices(4);
      setPoints([]);
    }
  }, [open]);

  const handleSelectShape = (selectedShape: ShapeType) => {
    setShape(selectedShape);
    setStage('show-slices');
    // Set default slice count based on shape
    if (selectedShape === 'rectangle') {
      setSlices(4);
    } else if (selectedShape === 'circle') {
      setSlices(6);
    }
  };

  const handleScreenClick = (e: React.MouseEvent) => {
    // No longer needed for positioning
    return;
  };

  const renderGuideText = () => {
    switch (stage) {
      case 'select-shape':
        return 'Select a shape for slicing';
      case 'show-slices':
        return 'Here are your slicing guides';
      default:
        return '';
    }
  };

  const renderSlicingGuides = () => {
    if (stage !== 'show-slices') return null;

    // Default dimensions and position for guides
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    if (shape === 'rectangle') {
      const width = 1200;
      const height = 800;
      const x = centerX - width / 2;
      const y = centerY - height / 2;

      // Create horizontal guides
      const horizontalGuides = [];
      for (let i = 1; i < slices; i++) {
        const yPos = y + (height * i) / slices;
        horizontalGuides.push(
          <line
            key={`h-${i}`}
            x1={x}
            y1={yPos}
            x2={x + width}
            y2={yPos}
            stroke="#00FF00"
            strokeWidth={2}
            strokeDasharray="5,5"
          />
        );
      }

      return (
        <>
          {/* Rectangle outline */}
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          {/* Slicing guides */}
          {horizontalGuides}
        </>
      );
    } else if (shape === 'circle') {
      const radius = 420;

      // Create guides for circle
      const guides = [];
      for (let i = 0; i < slices; i++) {
        const angle = (Math.PI * 2 * i) / slices;
        const x2 = centerX + radius * Math.cos(angle);
        const y2 = centerY + radius * Math.sin(angle);
        
        guides.push(
          <line
            key={`slice-${i}`}
            x1={centerX}
            y1={centerY}
            x2={x2}
            y2={y2}
            stroke="#00FF00"
            strokeWidth={2}
          />
        );
      }

      return (
        <>
          {/* Circle outline */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          {/* Slicing guides */}
          {guides}
        </>
      );
    }

    return null;
  };

  const renderStageContent = () => {
    switch (stage) {
      case 'select-shape':
        return (
          <div className="flex flex-col items-center space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <Selectable
                className="bg-white text-black p-8 rounded-lg flex flex-col items-center space-y-4"
                onPress={() => handleSelectShape('rectangle')}
              >
                <div className="w-32 h-20 border-4 border-black"></div>
                <span className="text-xl font-bold">Rectangle</span>
              </Selectable>
              <Selectable
                className="bg-white text-black p-8 rounded-lg flex flex-col items-center space-y-4"
                onPress={() => handleSelectShape('circle')}
              >
                <div className="w-24 h-24 rounded-full border-4 border-black"></div>
                <span className="text-xl font-bold">Circle</span>
              </Selectable>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Overlay
      open={open}
      className="bg-black"
      onClose={onClose}
      onClick={handleScreenClick}
    >
      {/* Guide text */}
      <div className="absolute top-10 left-0 right-0 text-center">
        <h1 className="text-4xl font-bold text-white">{renderGuideText()}</h1>
      </div>

      {/* Stage-specific content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {renderStageContent()}
      </div>

      {/* SVG for drawing slices */}
      <svg ref={svgRef} className="w-full h-full absolute top-0 left-0 pointer-events-none">
        {renderSlicingGuides()}
        
        {/* Show dots for placed points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={8}
            fill="#FF0000"
          />
        ))}
      </svg>
    </Overlay>
  );
} 