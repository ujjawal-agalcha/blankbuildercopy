import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  description?: string;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  description,
}) => {
  return (
    <div className="space-y-1.5 py-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-cad-text font-medium truncate" title={description || label}>
          {label}
        </span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) onChange(val);
            }}
            className="w-14 bg-cad-bg border border-cad-border rounded px-1.5 py-0.5 text-right font-mono text-cad-accent text-xs focus:outline-none focus:border-cad-accent"
          />
          {unit && <span className="text-cad-textDim text-[11px]">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-cad-bg rounded-lg appearance-none cursor-pointer accent-cad-accent focus:outline-none"
      />
    </div>
  );
};

