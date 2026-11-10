import { describe, it, expect } from 'vitest';
import { distanceBetween, evalCubicBezier, cubicArcLength } from '../geometry/bezier';
import { convertToMm, convertFromMm, formatUnit } from '../geometry/converters';
import { calculatePieceArea, calculateEdgeLength } from '../geometry/measurements';
import { generateSeamAllowanceContour } from '../geometry/offset';
import { createTShirtTemplate } from '../garments/templates/tshirt';

describe('CAD Geometry Engine', () => {
  it('calculates Euclidean distance correctly', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 30, y: 40 };
    expect(distanceBetween(p1, p2)).toBe(50);
  });

  it('evaluates cubic bezier curve endpoints and arc length', () => {
    const p0 = { x: 0, y: 0 };
    const p1 = { x: 10, y: 20 };
    const p2 = { x: 30, y: 20 };
    const p3 = { x: 40, y: 0 };

    const start = evalCubicBezier(p0, p1, p2, p3, 0);
    const end = evalCubicBezier(p0, p1, p2, p3, 1);

    expect(start.x).toBeCloseTo(0);
    expect(start.y).toBeCloseTo(0);
    expect(end.x).toBeCloseTo(40);
    expect(end.y).toBeCloseTo(0);

    const arcLen = cubicArcLength(p0, p1, p2, p3);
    expect(arcLen).toBeGreaterThan(40);
  });

  it('accurately converts and formats units', () => {
    expect(convertToMm(10, 'cm')).toBe(100);
    expect(convertFromMm(100, 'cm')).toBe(10);
    expect(formatUnit(254, 'in', 1)).toBe('10.0 in');
    expect(formatUnit(150, 'cm', 1)).toBe('15.0 cm');
  });

  it('generates parametric pattern pieces and calculates area', () => {
    const template = createTShirtTemplate('test_tee', 'Test Tee', 'regular', 'Test', {
      chestWidth: 540,
      bodyLength: 700,
      shoulderWidth: 460,
      sleeveLength: 220,
      sleeveOpening: 180,
      neckWidth: 180,
      neckDepthFront: 80,
      neckDepthBack: 20,
      hemWidth: 540,
      collarHeight: 20,
    });

    const pieces = template.generatePatterns({});
    expect(pieces.length).toBe(5); // Front, Back, Left Sleeve, Right Sleeve, Neck Rib

    const frontBody = pieces.find((p) => p.id === 'piece_front_body')!;
    expect(frontBody).toBeDefined();

    const areaCm2 = calculatePieceArea(frontBody);
    // Front body area of an adult T-shirt is typically 2000-4000 cm²
    expect(areaCm2).toBeGreaterThan(1500);
    expect(areaCm2).toBeLessThan(6000);

    // Seam allowance generation
    const offsetContour = generateSeamAllowanceContour(frontBody);
    expect(offsetContour.length).toBeGreaterThan(0);
  });
});

