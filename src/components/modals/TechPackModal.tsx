import React from 'react';
import {
  X,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  User,
  Scissors,
} from 'lucide-react';
import { useGarmentStore } from '../../store/useGarmentStore';
import { useMaterialStore } from '../../store/useMaterialStore';
import { useDesignStore } from '../../store/useDesignStore';
import { useSewingStore } from '../../store/useSewingStore';
import { formatUnit } from '../../geometry/converters';

interface TechPackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechPackModal: React.FC<TechPackModalProps> = ({ isOpen, onClose }) => {
  const { projectName, template, measurements, activeSize, pieces } = useGarmentStore();
  const { material } = useMaterialStore();
  const { layers } = useDesignStore();
  const { relationships } = useSewingStore();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-cad-panel border border-cad-border w-full max-w-4xl max-h-[92vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 border-b border-cad-border flex items-center justify-between bg-cad-bg/60">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-cad-accent" />
            <h3 className="font-bold text-sm text-cad-text tracking-wide">
              MANUFACTURING TECH PACK & SPECIFICATION SHEET
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded bg-cad-accent hover:bg-cad-accentHover text-black text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button onClick={onClose} className="p-1 rounded text-cad-textDim hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Tech Pack Body */}
        <div className="p-8 space-y-6 overflow-y-auto bg-cad-bg text-cad-text font-sans">
          {/* 1. Header Information Block */}
          <div className="border border-cad-border rounded-lg p-5 bg-cad-panel/50 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-cad-textDim uppercase text-[10px] block">Style Name</span>
              <strong className="text-sm font-bold text-white">{projectName}</strong>
            </div>
            <div>
              <span className="text-cad-textDim uppercase text-[10px] block">Garment Silhouette</span>
              <strong className="text-sm font-semibold text-cad-accent">{template.name}</strong>
            </div>
            <div>
              <span className="text-cad-textDim uppercase text-[10px] block">Base Fit / Size</span>
              <strong className="text-sm font-mono text-white">{template.fit.toUpperCase()} • Size {activeSize}</strong>
            </div>
            <div>
              <span className="text-cad-textDim uppercase text-[10px] block">Date / Version</span>
              <strong className="text-sm font-mono text-cad-textMuted">2026-11-09 • REV 1.0</strong>
            </div>
          </div>

          {/* 2. Bill of Materials (BOM) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cad-accent mb-2 flex items-center gap-1.5">
              <Scissors className="w-4 h-4" />
              <span>1. Bill of Materials (BOM)</span>
            </h4>
            <div className="border border-cad-border rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-cad-panelLight text-cad-textMuted font-mono text-[11px] uppercase">
                  <tr>
                    <th className="p-2.5">Item</th>
                    <th className="p-2.5">Component / Description</th>
                    <th className="p-2.5">Composition / Specs</th>
                    <th className="p-2.5">Weight (GSM)</th>
                    <th className="p-2.5">Colorway</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cad-border/60 font-mono text-[11px]">
                  <tr>
                    <td className="p-2.5 font-bold text-white">Shell Fabric</td>
                    <td className="p-2.5">{material.name}</td>
                    <td className="p-2.5">100% Ring-Spun Combed Cotton</td>
                    <td className="p-2.5 text-cad-accent">{material.physics.weightGSM} GSM</td>
                    <td className="p-2.5 flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded border border-cad-border inline-block" style={{ backgroundColor: material.baseColor }} />
                      <span>{material.baseColor.toUpperCase()}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Collar Rib</td>
                    <td className="p-2.5">1x1 Rib Knit Band</td>
                    <td className="p-2.5">95% Cotton / 5% Elastane</td>
                    <td className="p-2.5">340 GSM</td>
                    <td className="p-2.5 flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded border border-cad-border inline-block" style={{ backgroundColor: material.baseColor }} />
                      <span>Matching Self</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Sewing Thread</td>
                    <td className="p-2.5">Core-Spun Poly Thread</td>
                    <td className="p-2.5">Tex 40 (Oeko-Tex Standard 100)</td>
                    <td className="p-2.5">-</td>
                    <td className="p-2.5">Tonal DTM (Direct-to-Match)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Point of Measure (POM) Spec Chart */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cad-accent mb-2 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4" />
              <span>2. Measurement Specification Table (All values in CM)</span>
            </h4>
            <div className="border border-cad-border rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-cad-panelLight text-cad-textMuted font-mono text-[11px] uppercase">
                  <tr>
                    <th className="p-2.5">Point of Measure (POM)</th>
                    <th className="p-2.5 text-center">Tol (+/-)</th>
                    {sizes.map((s) => (
                      <th
                        key={s}
                        className={`p-2.5 text-center ${s === activeSize ? 'bg-cad-accent/20 text-cad-accent font-bold' : ''}`}
                      >
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cad-border/60 font-mono text-[11px]">
                  {template.measurements.map((spec) => {
                    const baseMm = measurements[spec.id] ?? spec.value;
                    return (
                      <tr key={spec.id} className="hover:bg-cad-panelLight/20">
                        <td className="p-2.5 font-sans font-medium text-cad-text">{spec.name}</td>
                        <td className="p-2.5 text-center text-cad-textDim">0.5 cm</td>
                        {sizes.map((s) => {
                          const rule = template.gradingRules.find((r) => r.size === s);
                          const delta = rule?.measurementDeltas[spec.id] || 0;
                          const valCm = ((baseMm + delta) / 10).toFixed(1);
                          return (
                            <td
                              key={s}
                              className={`p-2.5 text-center ${s === activeSize ? 'bg-cad-accent/10 font-bold text-cad-accent' : ''}`}
                            >
                              {valCm}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Artwork Placement Specifications */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cad-accent mb-2">
              3. Artwork & Embellishment Specifications
            </h4>
            {layers.length === 0 ? (
              <p className="text-xs text-cad-textDim italic">No external graphics attached (Plain blank garment).</p>
            ) : (
              <div className="border border-cad-border rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cad-panelLight text-cad-textMuted font-mono text-[11px] uppercase">
                    <tr>
                      <th className="p-2.5">Layer Name</th>
                      <th className="p-2.5">Zone</th>
                      <th className="p-2.5">Technique</th>
                      <th className="p-2.5">Color / Spec</th>
                      <th className="p-2.5">Offset (X, Y)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cad-border/60 font-mono text-[11px]">
                    {layers.map((l) => (
                      <tr key={l.id}>
                        <td className="p-2.5 font-sans font-bold text-white">{l.name}</td>
                        <td className="p-2.5 uppercase text-cad-accent">{l.zone}</td>
                        <td className="p-2.5 capitalize">{l.technique}</td>
                        <td className="p-2.5">{l.textColor || 'Full Color'}</td>
                        <td className="p-2.5">{l.x}mm, {l.y}mm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 5. Sewing & Assembly Callouts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cad-accent mb-2">
              4. Sewing & Construction Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-cad-border bg-cad-panel/40 space-y-1.5">
                <span className="font-semibold text-white block">Seam Finishes & Stitching:</span>
                <ul className="list-disc list-inside text-cad-textMuted space-y-1 font-sans">
                  <li>Shoulder seams reinforced with internal clear silicone tape to prevent sagging.</li>
                  <li>4-thread high-speed safety overlock on side seams and armholes.</li>
                  <li>12 to 14 stitches per inch (SPI) throughout.</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg border border-cad-border bg-cad-panel/40 space-y-1.5">
                <span className="font-semibold text-white block">Hem & Collar Execution:</span>
                <ul className="list-disc list-inside text-cad-textMuted space-y-1 font-sans">
                  <li>2.5cm bottom hem finished with twin-needle bottom coverstitch.</li>
                  <li>Rib collar bound with self-fabric neckband tape across back neck shoulder to shoulder.</li>
                  <li>Woven brand label centered at interior back neckline.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

