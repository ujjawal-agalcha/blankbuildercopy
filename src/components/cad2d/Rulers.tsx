import React from 'react';
import { Unit } from '../../types/cad';
import { formatUnit } from '../../geometry/converters';

interface RulersProps {
  width: number;
  height: number;
  viewport: { x: number; y: number; zoom: number };
  cursorCoords: { x: number; y: number };
  unit: Unit;
}

export const Rulers: React.FC<RulersProps> = ({
  width,
  height,
  viewport,
  cursorCoords,
  unit,
}) => {
  const rulerSize = 22; // px

  // Calculate step size in world coordinates (mm) based on zoom
  const targetPixelStep = 60; // aim for tick numbers every ~60px
  const rawMmStep = targetPixelStep / viewport.zoom;
  
  // Snap mm step to sensible numbers: 10, 20, 50, 100, 200, 500, 1000
  const candidateSteps = [10, 20, 50, 100, 200, 500, 1000];
  let stepMm = candidateSteps[0];
  for (const s of candidateSteps) {
    if (s * viewport.zoom >= 40) {
      stepMm = s;
      break;
    }
  }

  // Horizontal Ruler Ticks (X Axis)
  const xStartMm = Math.floor((-viewport.x / viewport.zoom) / stepMm) * stepMm;
  const xEndMm = Math.ceil(((width - viewport.x) / viewport.zoom) / stepMm) * stepMm;
  const xTicks: number[] = [];
  for (let x = xStartMm; x <= xEndMm; x += stepMm) {
    xTicks.push(x);
  }

  // Vertical Ruler Ticks (Y Axis)
  const yStartMm = Math.floor((-viewport.y / viewport.zoom) / stepMm) * stepMm;
  const yEndMm = Math.ceil(((height - viewport.y) / viewport.zoom) / stepMm) * stepMm;
  const yTicks: number[] = [];
  for (let y = yStartMm; y <= yEndMm; y += stepMm) {
    yTicks.push(y);
  }

  // Mouse cursor indicator positions on rulers
  const cursorScreenX = viewport.x + cursorCoords.x * viewport.zoom;
  const cursorScreenY = viewport.y + cursorCoords.y * viewport.zoom;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden">
      {/* Top Left Corner Box */}
      <div
        className="absolute top-0 left-0 bg-cad-panel border-r border-b border-cad-border flex items-center justify-center font-mono text-[9px] text-cad-textDim z-20"
        style={{ width: rulerSize, height: rulerSize }}
      >
        {unit}
      </div>

      {/* TOP HORIZONTAL RULER */}
      <div
        className="absolute top-0 left-0 right-0 bg-cad-panel/95 backdrop-blur-sm border-b border-cad-border overflow-hidden"
        style={{ height: rulerSize, paddingLeft: rulerSize }}
      >
        <svg className="w-full h-full block">
          {xTicks.map((mm) => {
            const screenX = viewport.x + mm * viewport.zoom;
            if (screenX < rulerSize || screenX > width) return null;

            return (
              <g key={`x-${mm}`} transform={`translate(${screenX}, 0)`}>
                <line x1="0" y1={rulerSize - 6} x2="0" y2={rulerSize} stroke="#475569" strokeWidth="1" />
                <text
                  x="2"
                  y={rulerSize - 8}
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="start"
                >
                  {unit === 'mm' ? mm : unit === 'cm' ? (mm / 10).toFixed(0) : (mm / 25.4).toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Mouse Cursor Indicator on Top Ruler */}
          {cursorScreenX >= rulerSize && cursorScreenX <= width && (
            <line
              x1={cursorScreenX}
              y1="0"
              x2={cursorScreenX}
              y2={rulerSize}
              stroke="#10b981"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </div>

      {/* LEFT VERTICAL RULER */}
      <div
        className="absolute top-0 left-0 bottom-0 bg-cad-panel/95 backdrop-blur-sm border-r border-cad-border overflow-hidden"
        style={{ width: rulerSize, paddingTop: rulerSize }}
      >
        <svg className="w-full h-full block">
          {yTicks.map((mm) => {
            const screenY = viewport.y + mm * viewport.zoom;
            if (screenY < rulerSize || screenY > height) return null;

            return (
              <g key={`y-${mm}`} transform={`translate(0, ${screenY})`}>
                <line x1={rulerSize - 6} y1="0" x2={rulerSize} y2="0" stroke="#475569" strokeWidth="1" />
                <text
                  x="2"
                  y="-2"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="start"
                >
                  {unit === 'mm' ? mm : unit === 'cm' ? (mm / 10).toFixed(0) : (mm / 25.4).toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Mouse Cursor Indicator on Left Ruler */}
          {cursorScreenY >= rulerSize && cursorScreenY <= height && (
            <line
              x1="0"
              y1={cursorScreenY}
              x2={rulerSize}
              y2={cursorScreenY}
              stroke="#10b981"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </div>
    </div>
  );
};

