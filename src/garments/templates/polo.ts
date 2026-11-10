import { ControlPoint, Edge2D, PatternPiece } from '../../types/cad';
import { GarmentTemplate, StandardSize } from '../../types/garment';
import { SewingRelationship } from '../../types/sewing';
import { createTShirtTemplate } from './tshirt';

export function createPoloTemplate(
  id: string,
  name: string,
  fit: 'regular' | 'oversized' | 'slim',
  description: string
): GarmentTemplate {
  // Use T-shirt body base with polo collar & placket
  const baseTShirt = createTShirtTemplate(id, name, fit, description, {
    chestWidth: 540,
    bodyLength: 730,
    shoulderWidth: 470,
    sleeveLength: 230,
    sleeveOpening: 175,
    neckWidth: 175,
    neckDepthFront: 90,
    neckDepthBack: 20,
    hemWidth: 540,
    collarHeight: 65, // Turn-down collar
  });

  const generatePatterns = (m: Record<string, number>): PatternPiece[] => {
    const pieces = baseTShirt.generatePatterns(m);

    // Replace neck rib with flat-knit Polo collar and placket
    const filtered = pieces.filter((p) => p.id !== 'piece_neck_rib');

    const collarLen = 420;
    const collarH = 75;
    const collarPoints: ControlPoint[] = [
      { id: 'pol_c_tl', x: -collarLen / 2, y: 0, type: 'corner' },
      { id: 'pol_c_tr', x: collarLen / 2, y: 0, type: 'corner' },
      { id: 'pol_c_br', x: (collarLen / 2) + 20, y: collarH, type: 'corner' },
      { id: 'pol_c_bl', x: -(collarLen / 2) - 20, y: collarH, type: 'corner' },
    ];

    const collarEdges: Edge2D[] = [
      { id: 'e_pol_c_top', fromPointId: 'pol_c_tl', toPointId: 'pol_c_tr', type: 'line', name: 'Collar Neck Seam' },
      { id: 'e_pol_c_r', fromPointId: 'pol_c_tr', toPointId: 'pol_c_br', type: 'line', name: 'Collar Point R' },
      { id: 'e_pol_c_bot', fromPointId: 'pol_c_br', toPointId: 'pol_c_bl', type: 'line', name: 'Collar Outer Edge' },
      { id: 'e_pol_c_l', fromPointId: 'pol_c_bl', toPointId: 'pol_c_tl', type: 'line', name: 'Collar Point L' },
    ];

    const poloCollarPiece: PatternPiece = {
      id: 'polo_collar',
      name: 'Polo Knit Collar',
      category: 'collar',
      points: collarPoints,
      edges: collarEdges,
      position: { x: 710, y: 920 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -collarLen / 2 + 30, y: collarH / 2 }, end: { x: collarLen / 2 - 30, y: collarH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    // Placket strip
    const placketPoints: ControlPoint[] = [
      { id: 'plk_tl', x: -18, y: 0, type: 'corner' },
      { id: 'plk_tr', x: 18, y: 0, type: 'corner' },
      { id: 'plk_br', x: 18, y: 160, type: 'corner' },
      { id: 'plk_bl', x: -18, y: 160, type: 'corner' },
    ];
    const placketEdges: Edge2D[] = [
      { id: 'e_plk_top', fromPointId: 'plk_tl', toPointId: 'plk_tr', type: 'line', name: 'Placket Top' },
      { id: 'e_plk_r', fromPointId: 'plk_tr', toPointId: 'plk_br', type: 'line', name: 'Placket Right' },
      { id: 'e_plk_bot', fromPointId: 'plk_br', toPointId: 'plk_bl', type: 'line', name: 'Placket Bottom' },
      { id: 'e_plk_l', fromPointId: 'plk_bl', toPointId: 'plk_tl', type: 'line', name: 'Placket Left' },
    ];

    const placketPiece: PatternPiece = {
      id: 'polo_placket',
      name: 'Button Placket Strip',
      category: 'collar',
      points: placketPoints,
      edges: placketEdges,
      position: { x: 1250, y: 920 },
      rotation: 0,
      mirror: false,
      cutQuantity: 2,
      fabricCode: 'FAB_COTTON_JERSEY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 20 }, end: { x: 0, y: 140 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#cbd5e1',
    };

    return [...filtered, poloCollarPiece, placketPiece];
  };

  return {
    ...baseTShirt,
    subcategory: 'Polo',
    generatePatterns,
  };
}
