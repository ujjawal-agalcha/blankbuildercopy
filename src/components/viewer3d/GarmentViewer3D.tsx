import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { GarmentMesh3D } from './GarmentMesh3D';
import { AvatarMannequin } from './AvatarMannequin';
import { StudioLighting } from './StudioLighting';
import { useSceneStore } from '../../store/useSceneStore';
import { Camera, RotateCcw, Compass } from 'lucide-react';

export const GarmentViewer3D: React.FC = () => {
  const { settings, setCameraPreset } = useSceneStore();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Set camera to canonical CAD views
  const handleViewPreset = (view: 'front' | 'back' | 'left' | 'right' | 'top') => {
    if (!controlsRef.current) return;
    const distance = 1.8;

    switch (view) {
      case 'front':
        controlsRef.current.object.position.set(0, 0.25, distance);
        break;
      case 'back':
        controlsRef.current.object.position.set(0, 0.25, -distance);
        break;
      case 'left':
        controlsRef.current.object.position.set(-distance, 0.25, 0);
        break;
      case 'right':
        controlsRef.current.object.position.set(distance, 0.25, 0);
        break;
      case 'top':
        controlsRef.current.object.position.set(0, distance + 0.5, 0.01);
        break;
    }
    controlsRef.current.target.set(0, 0.15, 0);
    controlsRef.current.update();
  };

  // High-Resolution Snapshot Capture
  const handleSnapshot = () => {
    const canvas = canvasContainerRef.current?.querySelector('canvas');
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `GARMENT_RENDER_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div
      ref={canvasContainerRef}
      className="relative flex-1 h-full w-full bg-[#12141a] overflow-hidden select-none"
    >
      {/* 3D Canvas */}
      <Canvas
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
        camera={{ position: [0, 0.25, 1.8], fov: 42 }}
        className="w-full h-full block"
      >
        <PerspectiveCamera makeDefault position={[0, 0.25, 1.8]} fov={42} />
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={0.5}
          maxDistance={4.5}
          target={[0, 0.15, 0]}
        />

        <StudioLighting />
        <AvatarMannequin />
        <GarmentMesh3D />
      </Canvas>

      {/* Quick Camera Preset Pills (Top Left) */}
      <div className="absolute top-3 left-3 flex items-center gap-1 bg-cad-panel/80 backdrop-blur-md border border-cad-border p-1 rounded-md shadow-lg z-10">
        {(['front', 'back', 'left', 'right', 'top'] as const).map((view) => (
          <button
            key={view}
            onClick={() => handleViewPreset(view)}
            className="px-2 py-0.5 text-[11px] font-mono capitalize rounded text-cad-textMuted hover:text-white hover:bg-cad-panelLight transition"
          >
            {view}
          </button>
        ))}
      </div>

      {/* Snapshot High-Res Button (Top Right) */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        <button
          onClick={handleSnapshot}
          className="p-2 rounded bg-cad-panel/80 backdrop-blur-md border border-cad-border text-cad-text hover:text-cad-accent hover:border-cad-accent transition shadow-lg flex items-center gap-1.5 text-xs font-medium"
          title="Capture High-Resolution Render PNG"
        >
          <Camera className="w-3.5 h-3.5 text-cad-accent" />
          <span>Snapshot</span>
        </button>
      </div>

      {/* Viewport Overlay Guide Tip */}
      <div className="absolute bottom-3 left-3 text-[10px] text-cad-textDim bg-cad-panel/60 backdrop-blur px-2 py-1 rounded border border-cad-border pointer-events-none">
        Left Click: Orbit • Right Click: Pan • Scroll: Zoom
      </div>
    </div>
  );
};

