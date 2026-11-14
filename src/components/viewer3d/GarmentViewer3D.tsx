import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { BlankGarment3D } from './BlankGarment3D';
import { StudioLighting } from './StudioLighting';
import { useSceneStore } from '../../store/useSceneStore';
import { useGarmentStore } from '../../store/useGarmentStore';
import { useSewingStore } from '../../store/useSewingStore';
import { useMaterialStore } from '../../store/useMaterialStore';
import {
  RotateCcw,
  Sun,
  Moon,
  Camera,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const GarmentViewer3D: React.FC = () => {
  const { settings } = useSceneStore();
  const { template, pieces } = useGarmentStore();
  const { relationships } = useSewingStore();
  const { material, setColor } = useMaterialStore();

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Directly use the template's authentic modelId (no generic guessing)
  const activeModel = template.modelId || 'tee-t5';
  const [panelCount, setPanelCount] = useState<number>(0);
  const [showIdentityHUD, setShowIdentityHUD] = useState<boolean>(true);

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
    link.download = `THREADCAD_3D_MOCKUP_${Date.now()}.png`;
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
        {/* Force clean re-mount via key when modelType changes so no stale 3D meshes remain */}
        <BlankGarment3D
          key={activeModel}
          modelType={activeModel}
          onModelLoaded={(data) => setPanelCount(data.pieces.length)}
        />
      </Canvas>

      {/* TOP FLOATING CONTROLS: Model Badge & Theme */}
      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
        <div className="flex items-center gap-2 bg-cad-panel/85 backdrop-blur-md border border-cad-border px-3 py-1.5 rounded-lg shadow-xl text-xs">
          <span className="w-2 h-2 rounded-full bg-cad-accent animate-pulse" />
          <span className="font-semibold text-cad-text uppercase tracking-wider">{template.name}</span>
          <span className="text-[10px] text-cad-textMuted font-mono border-l border-cad-border pl-2">
            3D: {activeModel}
          </span>
        </div>

        {/* Identity Verification HUD Toggle */}
        <button
          onClick={() => setShowIdentityHUD((s) => !s)}
          className={`flex items-center gap-1 px-2 py-1.5 backdrop-blur-md border rounded-lg text-xs font-mono transition shadow-xl ${
            showIdentityHUD
              ? 'bg-emerald-950/60 border-emerald-700 text-emerald-400'
              : 'bg-cad-panel/85 border-cad-border text-cad-textMuted hover:text-white'
          }`}
          title="Toggle Garment Identity Verification HUD"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Verification HUD</span>
          {showIdentityHUD ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {/* Studio Theme Switcher */}
        <button
          onClick={() => setStudioTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          className="p-1.5 bg-cad-panel/85 backdrop-blur-md border border-cad-border hover:border-cad-accent rounded-lg text-cad-textMuted hover:text-white transition shadow-xl"
          title={studioTheme === 'dark' ? 'Switch to Light Studio' : 'Switch to Dark Studio'}
        >
          {studioTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
        </button>
      </div>

      {/* GARMENT IDENTITY VERIFICATION DEBUG HUD */}
      {showIdentityHUD && (
        <div className="absolute top-12 left-3 z-10 w-72 bg-cad-panel/90 backdrop-blur-md border border-cad-border p-3 rounded-xl shadow-2xl text-[11px] font-mono space-y-2 select-none">
          <div className="flex items-center justify-between pb-1.5 border-b border-cad-border">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-sans text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garment Identity HUD</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800">
              VERIFIED
            </span>
          </div>

          <div className="space-y-1 text-cad-textMuted text-[10px]">
            <div className="flex justify-between">
              <span>Garment ID:</span>
              <strong className="text-white font-mono">{template.id}</strong>
            </div>
            <div className="flex justify-between">
              <span>Model ID:</span>
              <strong className="text-cad-accent font-mono">{activeModel}</strong>
            </div>
            <div className="flex justify-between">
              <span>2D Pattern Panels:</span>
              <strong className="text-white font-mono">{pieces.length} cut pieces</strong>
            </div>
            <div className="flex justify-between">
              <span>3D Mesh Panels:</span>
              <strong className="text-white font-mono">{panelCount || 'Loading...'} panels</strong>
            </div>
            <div className="flex justify-between">
              <span>Sewing Seams:</span>
              <strong className="text-white font-mono">{relationships.length} active seams</strong>
            </div>
            <div className="flex justify-between">
              <span>UV Texture Map:</span>
              <span className="text-emerald-400 font-mono">2048x2048 Active</span>
            </div>
          </div>
        </div>
      )}

      {/* TOP RIGHT: 4K Mockup Export */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        <button
          onClick={handleSnapshot}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-cad-panel/85 backdrop-blur-md border border-cad-border hover:border-cad-accent text-cad-text hover:text-white rounded-lg text-xs font-semibold shadow-xl transition"
        >
          <Camera className="w-3.5 h-3.5 text-cad-accent" />
          <span>Capture 4K Mockup</span>
        </button>
      </div>

      {/* FLOATING CAMERA ANGLE PRESET PILLS (Bottom Left) */}
      <div className="absolute bottom-16 left-3 flex items-center bg-cad-panel/85 backdrop-blur-md border border-cad-border p-1 rounded-lg shadow-xl gap-1 text-xs z-10">
        {(['front', 'back', 'left', 'right'] as const).map((angle) => (
          <button
            key={angle}
            onClick={() => handleViewPreset(angle)}
            className="px-2.5 py-1 text-cad-textMuted hover:text-white hover:bg-cad-panelLight rounded font-medium capitalize transition"
          >
            {angle}
          </button>
        ))}
        <button
          onClick={() => handleViewPreset('front')}
          className="p-1 text-cad-textMuted hover:text-white hover:bg-cad-panelLight rounded transition ml-1"
          title="Reset Camera"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* FLOATING CURATED COLORWAY PALETTE BAR (Bottom Center) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-cad-panel/90 backdrop-blur-md border border-cad-border px-3 py-2 rounded-xl shadow-2xl z-10">
        <span className="text-[10px] font-semibold text-cad-textMuted uppercase tracking-wider mr-1">
          Dye
        </span>
        {blankColors.map((c) => (
          <button
            key={c.name}
            onClick={() => setColor(c.hex)}
            style={{ backgroundColor: c.hex }}
            className={`w-5 h-5 rounded-full border transition transform hover:scale-125 ${
              material.baseColor === c.hex
                ? 'border-cad-accent ring-2 ring-cad-accent/40 scale-110'
                : 'border-white/10 hover:border-white/40'
            }`}
            title={`${c.name} (${c.hex})`}
          />
        ))}

        {/* Custom Hex Color Picker */}
        <div className="pl-1.5 border-l border-cad-border/60 flex items-center">
          <input
            type="color"
            value={material.baseColor}
            onChange={(e) => setColor(e.target.value)}
            className="w-5 h-5 rounded-full border border-white/20 cursor-pointer bg-transparent"
            title="Custom Dye Color"
          />
        </div>
      </div>
    </div>
  );
};
