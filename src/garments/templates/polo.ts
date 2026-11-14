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
      position: { x: 1180, y: 900 },
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

    const placketUpperPiece: PatternPiece = {
      id: 'polo_placket_upper',
      name: 'Polo Button Placket Upper',
      category: 'collar',
      points: placketPoints,
      edges: placketEdges,
      position: { x: 1460, y: 900 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_JERSEY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 20 }, end: { x: 0, y: 140 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [
        { id: 'il_plk_btn1', points: [{ x: 0, y: 40 }, { x: 0, y: 40 }], type: 'style', name: 'Button 1' },
        { id: 'il_plk_btn2', points: [{ x: 0, y: 110 }, { x: 0, y: 110 }], type: 'style', name: 'Button 2' },
      ],
      color: '#cbd5e1',
    };

    const placketUnderPiece: PatternPiece = {
      id: 'polo_placket_under',
      name: 'Polo Button Placket Under',
      category: 'collar',
      points: placketPoints,
      edges: placketEdges,
      position: { x: 1540, y: 900 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_JERSEY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 20 }, end: { x: 0, y: 140 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [
        { id: 'il_plk_btnhole1', points: [{ x: 0, y: 35 }, { x: 0, y: 45 }], type: 'style', name: 'Buttonhole 1' },
        { id: 'il_plk_btnhole2', points: [{ x: 0, y: 105 }, { x: 0, y: 115 }], type: 'style', name: 'Buttonhole 2' },
      ],
      color: '#cbd5e1',
    };

    // Sleeve rib bands
    const bandW = 175 * 2;
    const bandH = 30;
    const sleeveBandLeftPiece: PatternPiece = {
      id: 'polo_sleeve_band_left',
      name: 'Left Sleeve Rib Band',
      category: 'trim',
      points: [
        { id: 'psbl_tl', x: -bandW / 2, y: 0, type: 'corner' },
        { id: 'psbl_tr', x: bandW / 2, y: 0, type: 'corner' },
        { id: 'psbl_br', x: bandW / 2, y: bandH, type: 'corner' },
        { id: 'psbl_bl', x: -bandW / 2, y: bandH, type: 'corner' },
      ],
      edges: [
        { id: 'e_psbl_t', fromPointId: 'psbl_tl', toPointId: 'psbl_tr', type: 'line', name: 'Band Attach' },
        { id: 'e_psbl_r', fromPointId: 'psbl_tr', toPointId: 'psbl_br', type: 'line', name: 'Band Join R' },
        { id: 'e_psbl_b', fromPointId: 'psbl_br', toPointId: 'psbl_bl', type: 'line', name: 'Band Edge' },
        { id: 'e_psbl_l', fromPointId: 'psbl_bl', toPointId: 'psbl_tl', type: 'line', name: 'Band Join L' },
      ],
      position: { x: 260, y: 1140 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -bandW / 2 + 30, y: bandH / 2 }, end: { x: bandW / 2 - 30, y: bandH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    const sleeveBandRightPiece: PatternPiece = {
      id: 'polo_sleeve_band_right',
      name: 'Right Sleeve Rib Band',
      category: 'trim',
      points: [
        { id: 'psbr_tl', x: -bandW / 2, y: 0, type: 'corner' },
        { id: 'psbr_tr', x: bandW / 2, y: 0, type: 'corner' },
        { id: 'psbr_br', x: bandW / 2, y: bandH, type: 'corner' },
        { id: 'psbr_bl', x: -bandW / 2, y: bandH, type: 'corner' },
      ],
      edges: [
        { id: 'e_psbr_t', fromPointId: 'psbr_tl', toPointId: 'psbr_tr', type: 'line', name: 'Band Attach' },
        { id: 'e_psbr_r', fromPointId: 'psbr_tr', toPointId: 'psbr_br', type: 'line', name: 'Band Join R' },
        { id: 'e_psbr_b', fromPointId: 'psbr_br', toPointId: 'psbr_bl', type: 'line', name: 'Band Edge' },
        { id: 'e_psbr_l', fromPointId: 'psbr_bl', toPointId: 'psbr_tl', type: 'line', name: 'Band Join L' },
      ],
      position: { x: 740, y: 1140 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -bandW / 2 + 30, y: bandH / 2 }, end: { x: bandW / 2 - 30, y: bandH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    return [
      ...filtered,
      poloCollarPiece,
      placketUpperPiece,
      placketUnderPiece,
      sleeveBandLeftPiece,
      sleeveBandRightPiece,
    ];
  };

  return {
    ...baseTShirt,
    subcategory: 'Polo',
    modelId: 'polo',
    generatePatterns,
  };
}
