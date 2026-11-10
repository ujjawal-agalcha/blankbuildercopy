import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { BlankGarment3D } from './BlankGarment3D';
import { StudioLighting } from './StudioLighting';
import { useSceneStore } from '../../store/useSceneStore';
import { useGarmentStore } from '../../store/useGarmentStore';
import { useMaterialStore } from '../../store/useMaterialStore';
import {
  Camera,
  RotateCcw,
  Sun,
  Moon,
  Layers,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Maximize2,
} from 'lucide-react';

export const GarmentViewer3D: React.FC = () => {
  const { settings, toggleWireframe, toggleSeamLines } = useSceneStore();
  const { template, setTemplate } = useGarmentStore();
  const { material, setColor } = useMaterialStore();

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Model selection: 'tee-t5' (Classic Draped) or 'tee-oversize-1' (Oversized Heavyweight)
  const isOversized = template.id.includes('oversized') || template.id.includes('boxy');
  const [selectedModel, setSelectedModel] = useState<'tee-t5' | 'tee-oversize-1'>(
    isOversized ? 'tee-oversize-1' : 'tee-t5'
  );

  // Studio Theme (Clean Studio Light vs Dark Charcoal Studio)
  const [studioTheme, setStudioTheme] = useState<'light' | 'dark'>('dark');

  // Popular Blank Colors (BlankBuilder palette)
  const blankColors = [
    { name: 'Vintage Washed Black', hex: '#23252b' },
    { name: 'Pitch Black', hex: '#111215' },
    { name: 'Optic White', hex: '#fcfcfd' },
    { name: 'Vintage Ecru / Bone', hex: '#ede6d8' },
    { name: 'Heather Grey', hex: '#7e8590' },
    { name: 'Sage Green', hex: '#748777' },
    { name: 'Military Olive', hex: '#3e4635' },
    { name: 'Slate Navy', hex: '#232c3a' },
    { name: 'Mocha Brown', hex: '#40271c' },
    { name: 'Terracotta Rust', hex: '#94452e' },
  ];

  // Quick Smooth View Transition
  const handleViewPreset = (angle: 'front' | 'back' | 'left' | 'right') => {
    if (!controlsRef.current) return;
    const distance = 115;
    const targetY = -5;

    switch (angle) {
      case 'front':
        controlsRef.current.object.position.set(0, targetY, distance);
        break;
      case 'back':
        controlsRef.current.object.position.set(0, targetY, -distance);
        break;
      case 'left':
        controlsRef.current.object.position.set(-distance, targetY, 0);
        break;
      case 'right':
        controlsRef.current.object.position.set(distance, targetY, 0);
        break;
    }
    controlsRef.current.target.set(0, targetY, 0);
    controlsRef.current.update();
  };

  // High-Resolution 4K Snapshot
  const handleSnapshot = () => {
    const canvas = canvasContainerRef.current?.querySelector('canvas');
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `BLANKBUILDER_MOCKUP_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const bgColor = studioTheme === 'dark' ? '#12141a' : '#f0efe9';

  return (
    <div
      ref={canvasContainerRef}
      style={{ backgroundColor: bgColor }}
      className="relative flex-1 h-full w-full overflow-hidden select-none transition-colors duration-300"
    >
      {/* 3D WebGL Canvas */}
      <Canvas
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, -5, 115], fov: 38 }}
        className="w-full h-full block"
      >
        <PerspectiveCamera makeDefault position={[0, -5, 115]} fov={38} />
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={35}
          maxDistance={220}
          target={[0, -5, 0]}
          maxPolarAngle={Math.PI * 0.85}
          minPolarAngle={Math.PI * 0.15}
        />

        <StudioLighting />
        <BlankGarment3D modelType={selectedModel} />
      </Canvas>

      {/* TOP FLOATING CONTROLS: Model Switcher & Theme */}
      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
        {/* Model Switcher Pills */}
        <div className="flex items-center bg-cad-panel/85 backdrop-blur-md border border-cad-border p-1 rounded-lg shadow-xl text-xs">
          <button
            onClick={() => {
              setSelectedModel('tee-t5');
              setTemplate('tshirt_regular');
            }}
            className={`px-3 py-1 rounded font-medium transition ${
              selectedModel === 'tee-t5'
                ? 'bg-cad-accent text-black font-semibold shadow-sm'
                : 'text-cad-textMuted hover:text-white'
            }`}
          >
            Classic Draped
          </button>
          <button
            onClick={() => {
              setSelectedModel('tee-oversize-1');
              setTemplate('tshirt_oversized');
            }}
            className={`px-3 py-1 rounded font-medium transition ${
              selectedModel === 'tee-oversize-1'
                ? 'bg-cad-accent text-black font-semibold shadow-sm'
                : 'text-cad-textMuted hover:text-white'
            }`}
          >
            Oversized Drop-Shoulder
          </button>
        </div>

        {/* Studio Lighting Theme Toggle */}
        <button
          onClick={() => setStudioTheme(studioTheme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-cad-panel/85 backdrop-blur-md border border-cad-border text-cad-text hover:text-cad-accent transition shadow-xl"
          title={studioTheme === 'dark' ? 'Switch to Light Studio' : 'Switch to Dark Studio'}
        >
          {studioTheme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* TOP RIGHT: High-Res 4K Snapshot Button */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        <button
          onClick={handleSnapshot}
          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center gap-1.5 shadow-xl transition"
          title="Download High-Resolution Product Render"
        >
          <Camera className="w-4 h-4" />
          <span>Capture Mockup</span>
        </button>
      </div>

      {/* FLOATING CAMERA ANGLE CONTROLS (BlankBuilder Style) */}
      <div className="absolute top-1/2 -translate-y-1/2 left-3 flex flex-col gap-1.5 bg-cad-panel/85 backdrop-blur-md border border-cad-border p-1 rounded-lg shadow-xl z-10">
        <button
          onClick={() => handleViewPreset('front')}
          className="px-2.5 py-1.5 rounded text-xs font-mono font-medium text-cad-text hover:text-cad-accent hover:bg-cad-panelLight transition text-center"
          title="Front View (F)"
        >
          Front
        </button>
        <button
          onClick={() => handleViewPreset('back')}
          className="px-2.5 py-1.5 rounded text-xs font-mono font-medium text-cad-text hover:text-cad-accent hover:bg-cad-panelLight transition text-center"
          title="Back View (B)"
        >
          Back
        </button>
        <button
          onClick={() => handleViewPreset('left')}
          className="px-2.5 py-1.5 rounded text-xs font-mono font-medium text-cad-text hover:text-cad-accent hover:bg-cad-panelLight transition text-center"
          title="Left Sleeve (L)"
        >
          Left
        </button>
        <button
          onClick={() => handleViewPreset('right')}
          className="px-2.5 py-1.5 rounded text-xs font-mono font-medium text-cad-text hover:text-cad-accent hover:bg-cad-panelLight transition text-center"
          title="Right Sleeve (R)"
        >
          Right
        </button>
        <div className="h-px bg-cad-border my-0.5" />
        <button
          onClick={() => {
            if (controlsRef.current) {
              controlsRef.current.reset();
              controlsRef.current.object.position.set(0, -5, 115);
              controlsRef.current.target.set(0, -5, 0);
              controlsRef.current.update();
            }
          }}
          className="p-1.5 rounded text-cad-textDim hover:text-white hover:bg-cad-panelLight transition flex items-center justify-center"
          title="Reset Camera Position"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* BOTTOM FLOATING COLOR PALETTE BAR */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-cad-panel/90 backdrop-blur-md border border-cad-border px-3 py-2 rounded-xl shadow-2xl z-10">
        <span className="text-[11px] font-semibold text-cad-textMuted uppercase mr-1">
          Color:
        </span>
        {blankColors.map((c) => {
          const isSelected = material.baseColor.toLowerCase() === c.hex.toLowerCase();
          return (
            <button
              key={c.hex}
              onClick={() => setColor(c.hex)}
              style={{ backgroundColor: c.hex }}
              className={`w-6 h-6 rounded-full border transition transform hover:scale-110 shadow-md ${
                isSelected
                  ? 'border-cad-accent ring-2 ring-cad-accent/50 scale-110'
                  : 'border-cad-border hover:border-cad-borderLight'
              }`}
              title={c.name}
            />
          );
        })}
        {/* Custom Color Input */}
        <div className="flex items-center pl-1.5 border-l border-cad-border ml-1">
          <input
            type="color"
            value={material.baseColor}
            onChange={(e) => setColor(e.target.value)}
            className="w-6 h-6 rounded-full border border-cad-border cursor-pointer bg-transparent"
            title="Custom Dye Color"
          />
        </div>
      </div>
    </div>
  );
};
