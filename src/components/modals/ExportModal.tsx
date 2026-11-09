import React, { useState } from 'react';
import {
  X,
  Download,
  FileCode,
  FileText,
  Image,
  Box,
  Check,
  Layers,
} from 'lucide-react';
import { useGarmentStore } from '../../store/useGarmentStore';
import { useMaterialStore } from '../../store/useMaterialStore';
import { useDesignStore } from '../../store/useDesignStore';
import { exportPatternsToSvg } from '../../geometry/svgExport';
import { exportPatternsToDxf } from '../../geometry/dxfExport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { pieces, projectName, measurements, template, activeSize } = useGarmentStore();
  const { material } = useMaterialStore();
  const { layers } = useDesignStore();

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerDownload = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(filename);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  // 1. Export SVG Pattern Sheet
  const handleExportSvg = () => {
    const svg = exportPatternsToSvg(pieces, projectName);
    triggerDownload(`${projectName.replace(/\s+/g, '_')}_PATTERNS.svg`, svg, 'image/svg+xml');
  };

  // 2. Export DXF CAD Plotter Format
  const handleExportDxf = () => {
    const dxf = exportPatternsToDxf(pieces, projectName);
    triggerDownload(`${projectName.replace(/\s+/g, '_')}_PATTERNS.dxf`, dxf, 'application/dxf');
  };

  // 3. Export JSON Project
  const handleExportJson = () => {
    const project = {
      version: '1.0.0',
      projectName,
      templateId: template.id,
      activeSize,
      measurements,
      pieces,
      fabric: material,
      artworkLayers: layers,
      exportedAt: new Date().toISOString(),
    };
    triggerDownload(
      `${projectName.replace(/\s+/g, '_')}_PROJECT.json`,
      JSON.stringify(project, null, 2),
      'application/json'
    );
  };

  // 4. Export 3D OBJ Mesh
  const handleExportObj = () => {
    let obj = `# THREADCAD 3D Garment Mesh Export\n# Project: ${projectName}\n`;
    let vertexCount = 1;

    pieces.forEach((piece) => {
      obj += `\no ${piece.name.replace(/\s+/g, '_')}\n`;
      piece.points.forEach((pt) => {
        // Convert to meters
        obj += `v ${(pt.x / 1000).toFixed(4)} ${(-pt.y / 1000).toFixed(4)} 0.0000\n`;
      });

      // Simple fan triangulation for 2D pattern piece polygon
      const n = piece.points.length;
      for (let i = 2; i < n; i++) {
        obj += `f ${vertexCount} ${vertexCount + i - 1} ${vertexCount + i}\n`;
      }
      vertexCount += n;
    });

    triggerDownload(`${projectName.replace(/\s+/g, '_')}_3D.obj`, obj, 'text/plain');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-cad-panel border border-cad-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-cad-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-cad-accent" />
            <h3 className="font-bold text-sm text-cad-text">Export Production Assets</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-cad-textDim hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Options */}
        <div className="p-5 space-y-3">
          {downloadSuccess && (
            <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Successfully exported: <strong>{downloadSuccess}</strong></span>
            </div>
          )}

          {/* Option 1: Scaled SVG */}
          <div
            onClick={handleExportSvg}
            className="p-3.5 rounded-lg border border-cad-border bg-cad-panelLight/40 hover:border-cad-accent hover:bg-cad-accentSoft/20 cursor-pointer transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-cad-text group-hover:text-cad-accent">
                  Full 1:1 Scale SVG Pattern Sheet
                </h4>
                <p className="text-[11px] text-cad-textMuted">
                  Precision vector cutting patterns with seam allowances, grainlines & notches.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-cad-accent">.SVG</span>
          </div>

          {/* Option 2: AutoCAD DXF */}
          <div
            onClick={handleExportDxf}
            className="p-3.5 rounded-lg border border-cad-border bg-cad-panelLight/40 hover:border-cad-accent hover:bg-cad-accentSoft/20 cursor-pointer transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-black transition">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-cad-text group-hover:text-cad-accent">
                  AutoCAD DXF Pattern Data
                </h4>
                <p className="text-[11px] text-cad-textMuted">
                  Standard format for laser cutters, Gerber/Lectra digital cutting plotters.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-blue-400">.DXF</span>
          </div>

          {/* Option 3: 3D OBJ */}
          <div
            onClick={handleExportObj}
            className="p-3.5 rounded-lg border border-cad-border bg-cad-panelLight/40 hover:border-cad-accent hover:bg-cad-accentSoft/20 cursor-pointer transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-black transition">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-cad-text group-hover:text-cad-accent">
                  3D Garment Geometry (Wavefront OBJ)
                </h4>
                <p className="text-[11px] text-cad-textMuted">
                  3D model mesh for Blender, CLO 3D, Maya, Unreal Engine visualization.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-purple-400">.OBJ</span>
          </div>

          {/* Option 4: Full Project JSON */}
          <div
            onClick={handleExportJson}
            className="p-3.5 rounded-lg border border-cad-border bg-cad-panelLight/40 hover:border-cad-accent hover:bg-cad-accentSoft/20 cursor-pointer transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-cad-text group-hover:text-cad-accent">
                  Complete Project File (.JSON)
                </h4>
                <p className="text-[11px] text-cad-textMuted">
                  Stores all measurements, artwork layers, fabric specs, and sewing seams.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-amber-400">.JSON</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-cad-border bg-cad-bg/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-cad-panelLight border border-cad-border text-xs text-cad-text hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

