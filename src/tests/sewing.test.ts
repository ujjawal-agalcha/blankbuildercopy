import { describe, it, expect } from 'vitest';
import { GARMENT_TEMPLATES } from '../garments/catalog';
import { calculateEdgeLength } from '../geometry/measurements';

describe('Garment Sewing Relationships & Tolerances', () => {
  it('validates shoulder seam length matching in T-shirt templates', () => {
    const tshirt = GARMENT_TEMPLATES[0];
    const pieces = tshirt.generatePatterns({});
    const front = pieces.find((p) => p.id === 'piece_front_body')!;
    const back = pieces.find((p) => p.id === 'piece_back_body')!;

    const frontShoulderL = front.edges.find((e) => e.id === 'e_f_shoulder_l')!;
    const backShoulderL = back.edges.find((e) => e.id === 'e_b_shoulder_l')!;

    const lenF = calculateEdgeLength(frontShoulderL, front.points);
    const lenB = calculateEdgeLength(backShoulderL, back.points);

    // Shoulder seams must match within 5mm (0.5cm)
    const diff = Math.abs(lenF - lenB);
    expect(diff).toBeLessThan(5);
  });

  it('validates side seam length matching in T-shirt templates', () => {
    const tshirt = GARMENT_TEMPLATES[0];
    const pieces = tshirt.generatePatterns({});
    const front = pieces.find((p) => p.id === 'piece_front_body')!;
    const back = pieces.find((p) => p.id === 'piece_back_body')!;

    const frontSideL = front.edges.find((e) => e.id === 'e_f_side_l')!;
    const backSideL = back.edges.find((e) => e.id === 'e_b_side_l')!;

    const lenF = calculateEdgeLength(frontSideL, front.points);
    const lenB = calculateEdgeLength(backSideL, back.points);

    // Side seams must match within 5mm
    const diff = Math.abs(lenF - lenB);
    expect(diff).toBeLessThan(5);
  });
});

