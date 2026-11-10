import React, { useState, useRef } from 'react';
import {
  Undo2,
  Redo2,
  Columns,
  Layers,
  Box,
  Download,
  FileSpreadsheet,
  Save,
  FolderOpen,
  Magnet,
  Scissors,
  Check,
} from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { useGarmentStore } from '../../store/useGarmentStore';
import { useDesignStore } from '../../store/useDesignStore';
import { useMaterialStore } from '../../store/useMaterialStore';
import { getTemplateById } from '../../garments/catalog';
import { Unit } from '../../types/cad';

interface TopNavbarProps {
  onOpenExport: () => void;
  onOpenTechPack: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenExport, onOpenTechPack }) => {
  const {
    viewMode,
    setViewMode,
    unit,
    setUnit,
    gridSnap,
    setGridSnap,
  } = useEditorStore();

  const {
    projectName,
    setProjectName,
    undo,
    redo,
    canUndo,
    canRedo,
    template,
    activeSize,
  } = useGarmentStore();

  const openFileRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);
  const [saveToast, setSaveToast] = useState(false);
  const [loadToast, setLoadToast] = useState(false);

  // Save complete project state to localStorage
  const handleSave = () => {
    try {
      const state = {
        version: '1.0.0',
        projectName,
        templateId: template.id,
        activeSize,
        measurements: useGarmentStore.getState().measurements,
        pieces: useGarmentStore.getState().pieces,
        layers: useDesignStore.getState().layers,
        assets: useDesignStore.getState().assets,
        material: useMaterialStore.getState().material,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('threadcad_project', JSON.stringify(state));
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2000);
    } catch (e) {
      console.error('Save failed:', e);
    }
  };

  // Open / Restore project from JSON file or localStorage
  const handleOpenClick = () => {
    openFileRef.current?.click();
  };

  const handleFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.templateId) {
          const t = getTemplateById(data.templateId);
          useGarmentStore.setState({
            projectName: data.projectName || file.name.replace(/\.[^/.]+$/, ''),
            template: t,
            activeSize: data.activeSize || 'M',
            measurements: data.measurements || {},
            pieces: data.pieces || t.generatePatterns(data.measurements || {}),
          });

          if (data.layers) {
            useDesignStore.setState({
              layers: data.layers,
              assets: data.assets || [],
              activeLayerId: data.layers[0]?.id || null,
            });
          }

          if (data.material || data.fabric) {
            useMaterialStore.setState({
              material: data.material || data.fabric,
            });
          }

          setLoadToast(true);
          setTimeout(() => setLoadToast(false), 2000);
        }
      } catch (err) {
        console.error('Failed to parse project JSON:', err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="h-12 border-b border-cad-border bg-cad-panel px-3 flex items-center justify-between select-none z-20">
      {/* LEFT: Branding & Project Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pr-3 border-r border-cad-border">
          <div className="w-7 h-7 rounded bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/40">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs tracking-wider text-white flex items-center gap-1.5">
              THREADCAD <span className="text-[10px] text-cad-accent font-mono font-semibold px-1 rounded bg-cad-accentSoft">3D</span>
            </span>
            <span className="text-[9px] text-cad-textDim tracking-tight uppercase">Fashion CAD & Blank Studio</span>
          </div>
        </div>

        {/* Project Name */}
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <input
              type="text"
              value={tempName}
              autoFocus
              onChange={(e) => setTempName(e.target.value)}
              onBlur={() => {
                setProjectName(tempName.trim() || 'UNTITLED PROJECT');
                setIsEditingName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setProjectName(tempName.trim() || 'UNTITLED PROJECT');
                  setIsEditingName(false);
                }
              }}
              className="bg-cad-bg border border-cad-accent px-2 py-0.5 text-xs text-cad-text rounded focus:outline-none"
            />
          ) : (
            <button
              onClick={() => {
                setTempName(projectName);
                setIsEditingName(true);
              }}
              className="text-xs font-medium text-cad-text hover:text-cad-accent flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-cad-panelLight"
              title="Click to rename project"
            >
              <span>{projectName}</span>
              <span className="text-[10px] text-cad-textDim font-mono">({activeSize})</span>
            </button>
          )}
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 pl-2 border-l border-cad-border">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition ${
              canUndo
                ? 'text-cad-text hover:bg-cad-panelLight hover:text-cad-accent'
                : 'text-cad-textDim/40 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition ${
              canRedo
                ? 'text-cad-text hover:bg-cad-panelLight hover:text-cad-accent'
                : 'text-cad-textDim/40 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CENTER: Viewport Mode Switcher */}
      <div className="flex items-center bg-cad-bg border border-cad-border rounded-md p-0.5 shadow-inner">
        <button
          onClick={() => setViewMode('2d-only')}
          className={`px-3 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition ${
            viewMode === '2d-only'
              ? 'bg-cad-panelLight text-cad-accent shadow-sm border border-cad-border'
              : 'text-cad-textMuted hover:text-cad-text'
          }`}
          title="2D Sewing Pattern Editor Mode"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2D Pattern</span>
        </button>

        <button
          onClick={() => setViewMode('split')}
          className={`px-3 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition ${
            viewMode === 'split'
              ? 'bg-cad-panelLight text-cad-accent shadow-sm border border-cad-border'
              : 'text-cad-textMuted hover:text-cad-text'
          }`}
          title="Split View: 2D Pattern & 3D Garment"
        >
          <Columns className="w-3.5 h-3.5" />
          <span>Split View</span>
        </button>

        <button
          onClick={() => setViewMode('3d-only')}
          className={`px-3 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition ${
            viewMode === '3d-only'
              ? 'bg-cad-panelLight text-cad-accent shadow-sm border border-cad-border'
              : 'text-cad-textMuted hover:text-cad-text'
          }`}
          title="3D Garment Simulation Mode"
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D Studio</span>
        </button>
      </div>

      {/* RIGHT: Units, Snap, Save, Open, Tech Pack, Export */}
      <div className="flex items-center gap-2">
        {/* Grid Snap */}
        <button
          onClick={() => setGridSnap(!gridSnap)}
          className={`p-1.5 rounded border text-xs flex items-center gap-1 transition ${
            gridSnap
              ? 'border-cad-accent bg-cad-accentSoft text-cad-accent font-medium'
              : 'border-cad-border text-cad-textDim hover:text-cad-text'
          }`}
          title="Toggle Grid Snapping"
        >
          <Magnet className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Snap</span>
        </button>

        {/* Unit Selector */}
        <div className="flex items-center bg-cad-bg border border-cad-border rounded p-0.5">
          {(['mm', 'cm', 'in'] as Unit[]).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-2 py-0.5 text-[11px] font-mono rounded uppercase transition ${
                unit === u
                  ? 'bg-cad-panelLight text-cad-accent font-semibold'
                  : 'text-cad-textDim hover:text-cad-text'
              }`}
            >
              {u}
            </button>
          ))}
        </div>

        {/* Open Project (JSON) */}
        <input
          type="file"
          ref={openFileRef}
          onChange={handleFileLoad}
          accept="application/json"
          className="hidden"
        />
        <button
          onClick={handleOpenClick}
          className="p-1.5 rounded border border-cad-border hover:bg-cad-panelLight text-cad-text hover:text-white transition relative"
          title="Open Project (JSON)"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          {loadToast && (
            <span className="absolute -bottom-8 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              Loaded!
            </span>
          )}
        </button>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="p-1.5 rounded border border-cad-border hover:bg-cad-panelLight text-cad-text hover:text-white transition relative"
          title="Save Project to Browser Storage"
        >
          <Save className="w-3.5 h-3.5" />
          {saveToast && (
            <span className="absolute -bottom-8 right-0 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow">
              Saved!
            </span>
          )}
        </button>

        {/* Tech Pack Spec Sheet Button */}
        <button
          onClick={onOpenTechPack}
          className="px-2.5 py-1 rounded border border-cad-border bg-cad-panelLight text-xs text-cad-text hover:text-white hover:border-cad-borderLight flex items-center gap-1.5 transition shadow-sm"
          title="Open Manufacturing Tech Pack & Spec Sheet"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-medium hidden sm:inline">Tech Pack</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="px-3 py-1 rounded bg-cad-accent hover:bg-cad-accentHover text-black text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-emerald-950/50"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
