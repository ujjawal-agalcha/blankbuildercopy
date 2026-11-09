import React, { useState, useEffect } from 'react';
import { TopNavbar } from './components/layout/TopNavbar';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { RightSidebar } from './components/layout/RightSidebar';
import { StatusBar } from './components/layout/StatusBar';
import { PatternEditor2D } from './components/cad2d/PatternEditor2D';
import { GarmentViewer3D } from './components/viewer3d/GarmentViewer3D';
import { ExportModal } from './components/modals/ExportModal';
import { TechPackModal } from './components/modals/TechPackModal';
import { useEditorStore } from './store/useEditorStore';
import { useGarmentStore } from './store/useGarmentStore';

export const App: React.FC = () => {
  const { viewMode, activeTool, setActiveTool } = useEditorStore();
  const { undo, redo } = useGarmentStore();

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isTechPackOpen, setIsTechPackOpen] = useState(false);

  // Global CAD keyboard shortcuts (Ctrl+Z, Ctrl+Y, V, M, C, W, S, N, Q)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input / textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      // Tool shortcuts
      switch (e.key.toLowerCase()) {
        case 'v':
          setActiveTool('select');
          break;
        case 'm':
          setActiveTool('move');
          break;
        case 'c':
          setActiveTool('bezier');
          break;
        case 'w':
          setActiveTool('sew');
          break;
        case 's':
          setActiveTool('seam-allowance');
          break;
        case 'n':
          setActiveTool('notch');
          break;
        case 'q':
          setActiveTool('measure');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, setActiveTool]);

  return (
    <div className="h-screen w-screen flex flex-col bg-cad-bg overflow-hidden text-cad-text select-none">
      {/* Top Application Navbar */}
      <TopNavbar
        onOpenExport={() => setIsExportOpen(true)}
        onOpenTechPack={() => setIsTechPackOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left CAD Tools & Catalog Panel */}
        <LeftSidebar />

        {/* Center Workspace (2D CAD Pattern Editor / 3D Garment Studio) */}
        <main className="flex-1 flex overflow-hidden relative bg-cad-bg">
          {viewMode === '2d-only' && <PatternEditor2D />}

          {viewMode === '3d-only' && <GarmentViewer3D />}

          {viewMode === 'split' && (
            <div className="w-full h-full flex">
              {/* 2D Patternmaker on Left Half */}
              <div className="w-1/2 h-full border-r border-cad-border relative">
                <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded bg-cad-panel/80 border border-cad-border text-[10px] font-mono text-cad-textMuted tracking-wider uppercase pointer-events-none">
                  2D Pattern CAD
                </div>
                <PatternEditor2D />
              </div>

              {/* 3D Garment Studio on Right Half */}
              <div className="w-1/2 h-full relative">
                <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded bg-cad-panel/80 border border-cad-border text-[10px] font-mono text-cad-accent tracking-wider uppercase pointer-events-none">
                  3D Garment Simulation
                </div>
                <GarmentViewer3D />
              </div>
            </div>
          )}
        </main>

        {/* Right Customization & Materials Panel */}
        <RightSidebar />
      </div>

      {/* Bottom Status Bar */}
      <StatusBar />

      {/* Production Export Modal */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />

      {/* Tech Pack Spec Sheet Modal */}
      <TechPackModal isOpen={isTechPackOpen} onClose={() => setIsTechPackOpen(false)} />
    </div>
  );
};

export default App;

