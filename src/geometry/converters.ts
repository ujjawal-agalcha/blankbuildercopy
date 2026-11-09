import { Unit } from '../types/cad';

// Internal standard storage unit is ALWAYS Millimeters (mm)
export const MM_PER_CM = 10;
export const MM_PER_INCH = 25.4;

export function formatUnit(valueInMm: number, unit: Unit, decimals = 1): string {
  switch (unit) {
    case 'mm':
      return `${valueInMm.toFixed(0)} mm`;
    case 'cm':
      return `${(valueInMm / MM_PER_CM).toFixed(decimals)} cm`;
    case 'in':
      return `${(valueInMm / MM_PER_INCH).toFixed(decimals)} in`;
  }
}

export function convertToMm(value: number, fromUnit: Unit): number {
  switch (fromUnit) {
    case 'mm':
      return value;
    case 'cm':
      return value * MM_PER_CM;
    case 'in':
      return value * MM_PER_INCH;
  }
}

export function convertFromMm(valueInMm: number, toUnit: Unit): number {
  switch (toUnit) {
    case 'mm':
      return valueInMm;
    case 'cm':
      return valueInMm / MM_PER_CM;
    case 'in':
      return valueInMm / MM_PER_INCH;
  }
}

