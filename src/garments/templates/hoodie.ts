import { ControlPoint, Edge2D, PatternPiece } from '../../types/cad';
import { GarmentTemplate, StandardSize } from '../../types/garment';
import { SewingRelationship } from '../../types/sewing';

export function createHoodieTemplate(
  id: string,
  name: string,
  fit: 'oversized' | 'boxy' | 'regular',
  description: string
): GarmentTemplate {
  const defaultMeasurements = {
    chestWidth: 620,
    bodyLength: 700,
    shoulderWidth: 580,
    sleeveLength: 620,
    sleeveOpening: 100,
    hoodHeight: 380,
    hoodDepth: 280,
    pocketWidth: 340,
    pocketHeight: 220,
    hemRibHeight: 65,
    cuffRibHeight: 65,
  };

  const measurementsList = [
    { id: 'chestWidth', name: 'Chest Width (Half)', description: 'Across front chest', value: defaultMeasurements.chestWidth, min: 450, max: 800, step: 5, category: 'width' as const },
    { id: 'bodyLength', name: 'Body Length', description: 'From shoulder to hem (incl. rib)', value: defaultMeasurements.bodyLength, min: 550, max: 900, step: 5, category: 'length' as const },
    { id: 'shoulderWidth', name: 'Shoulder Width', description: 'Drop shoulder span', value: defaultMeasurements.shoulderWidth, min: 460, max: 720, step: 5, category: 'width' as const },
    { id: 'sleeveLength', name: 'Sleeve Length', description: 'From drop shoulder to cuff', value: defaultMeasurements.sleeveLength, min: 480, max: 720, step: 5, category: 'sleeve' as const },
    { id: 'hoodHeight', name: 'Hood Height', description: 'Crown height from neck seam', value: defaultMeasurements.hoodHeight, min: 320, max: 450, step: 5, category: 'neck' as const },
    { id: 'hoodDepth', name: 'Hood Depth', description: 'Face opening depth', value: defaultMeasurements.hoodDepth, min: 220, max: 350, step: 5, category: 'neck' as const },
    { id: 'pocketWidth', name: 'Pocket Width', description: 'Kangaroo pocket bottom width', value: defaultMeasurements.pocketWidth, min: 260, max: 440, step: 5, category: 'width' as const },
    { id: 'pocketHeight', name: 'Pocket Height', description: 'Kangaroo pocket vertical height', value: defaultMeasurements.pocketHeight, min: 160, max: 300, step: 5, category: 'length' as const },
  ];

  const generatePatterns = (m: Record<string, number>): PatternPiece[] => {
    const halfChest = (m.chestWidth || defaultMeasurements.chestWidth) / 2;
    const bodyLen = (m.bodyLength || defaultMeasurements.bodyLength) - defaultMeasurements.hemRibHeight;
    const halfShoulder = (m.shoulderWidth || defaultMeasurements.shoulderWidth) / 2;
    const sleeveLen = (m.sleeveLength || defaultMeasurements.sleeveLength) - defaultMeasurements.cuffRibHeight;
    const hoodH = m.hoodHeight || defaultMeasurements.hoodHeight;
    const hoodD = m.hoodDepth || defaultMeasurements.hoodDepth;
    const pWidth = (m.pocketWidth || defaultMeasurements.pocketWidth) / 2;
    const pHeight = m.pocketHeight || defaultMeasurements.pocketHeight;

    const shoulderSlope = 45;
    const armholeDepth = halfChest * 0.48;

    // 1. FRONT BODY
    const frontPoints: ControlPoint[] = [
      { id: 'h_f_neck', x: 0, y: 75, type: 'smooth' },
      { id: 'h_f_hsp_l', x: -115, y: 0, type: 'corner' },
      { id: 'h_f_lsp_l', x: -halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'h_f_armpit_l', x: -halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'h_f_hem_l', x: -halfChest * 0.95, y: bodyLen, type: 'corner' },
      { id: 'h_f_hem_c', x: 0, y: bodyLen, type: 'corner' },
      { id: 'h_f_hem_r', x: halfChest * 0.95, y: bodyLen, type: 'corner' },
      { id: 'h_f_armpit_r', x: halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'h_f_lsp_r', x: halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'h_f_hsp_r', x: 115, y: 0, type: 'corner' },
    ];

    const frontEdges: Edge2D[] = [
      { id: 'e_hf_neck_r', fromPointId: 'h_f_hsp_r', toPointId: 'h_f_neck', type: 'cubic-bezier', name: 'Front Neck R' },
      { id: 'e_hf_neck_l', fromPointId: 'h_f_neck', toPointId: 'h_f_hsp_l', type: 'cubic-bezier', name: 'Front Neck L' },
      { id: 'e_hf_shoulder_l', fromPointId: 'h_f_hsp_l', toPointId: 'h_f_lsp_l', type: 'line', name: 'Shoulder L' },
      { id: 'e_hf_armhole_l', fromPointId: 'h_f_lsp_l', toPointId: 'h_f_armpit_l', type: 'cubic-bezier', name: 'Armhole L' },
      { id: 'e_hf_side_l', fromPointId: 'h_f_armpit_l', toPointId: 'h_f_hem_l', type: 'line', name: 'Side Seam L' },
      { id: 'e_hf_hem_l', fromPointId: 'h_f_hem_l', toPointId: 'h_f_hem_c', type: 'line', name: 'Hem L' },
      { id: 'e_hf_hem_r', fromPointId: 'h_f_hem_c', toPointId: 'h_f_hem_r', type: 'line', name: 'Hem R' },
      { id: 'e_hf_side_r', fromPointId: 'h_f_hem_r', toPointId: 'h_f_armpit_r', type: 'line', name: 'Side Seam R' },
      { id: 'e_hf_armhole_r', fromPointId: 'h_f_armpit_r', toPointId: 'h_f_lsp_r', type: 'cubic-bezier', name: 'Armhole R' },
      { id: 'e_hf_shoulder_r', fromPointId: 'h_f_lsp_r', toPointId: 'h_f_hsp_r', type: 'line', name: 'Shoulder R' },
    ];

    const frontPiece: PatternPiece = {
      id: 'hoodie_front',
      name: 'Hoodie Front Body',
      category: 'body',
      points: frontPoints,
      edges: frontEdges,
      position: { x: 400, y: 80 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_FRENCH_TERRY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 150 }, end: { x: 0, y: bodyLen - 100 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [
        { id: 'il_pocket_top', points: [{ x: -pWidth * 0.7, y: bodyLen - pHeight }, { x: pWidth * 0.7, y: bodyLen - pHeight }], type: 'pocket-placement', name: 'Pocket Top Placement' },
      ],
      color: '#475569',
    };

    // 2. KANGAROO POCKET
    const pocketPoints: ControlPoint[] = [
      { id: 'kp_tl', x: -pWidth * 0.65, y: 0, type: 'corner' },
      { id: 'kp_tr', x: pWidth * 0.65, y: 0, type: 'corner' },
      { id: 'kp_slant_r', x: pWidth, y: pHeight * 0.45, type: 'corner' },
      { id: 'kp_br', x: pWidth, y: pHeight, type: 'corner' },
      { id: 'kp_bl', x: -pWidth, y: pHeight, type: 'corner' },
      { id: 'kp_slant_l', x: -pWidth, y: pHeight * 0.45, type: 'corner' },
    ];

    const pocketEdges: Edge2D[] = [
      { id: 'e_kp_top', fromPointId: 'kp_tl', toPointId: 'kp_tr', type: 'line', name: 'Pocket Top' },
      { id: 'e_kp_opening_r', fromPointId: 'kp_tr', toPointId: 'kp_slant_r', type: 'line', name: 'Hand Opening R' },
      { id: 'e_kp_side_r', fromPointId: 'kp_slant_r', toPointId: 'kp_br', type: 'line', name: 'Pocket Side R' },
      { id: 'e_kp_bottom', fromPointId: 'kp_br', toPointId: 'kp_bl', type: 'line', name: 'Pocket Bottom Hem' },
      { id: 'e_kp_side_l', fromPointId: 'kp_bl', toPointId: 'kp_slant_l', type: 'line', name: 'Pocket Side L' },
      { id: 'e_kp_opening_l', fromPointId: 'kp_slant_l', toPointId: 'kp_tl', type: 'line', name: 'Hand Opening L' },
    ];

    const pocketPiece: PatternPiece = {
      id: 'hoodie_pocket',
      name: 'Kangaroo Pocket',
      category: 'pocket',
      points: pocketPoints,
      edges: pocketEdges,
      position: { x: 400, y: 780 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_FRENCH_TERRY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 20 }, end: { x: 0, y: pHeight - 20 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#64748b',
    };

    // 3. HOOD PIECE (Cut 2 or 4 for lined hood)
    const hoodPoints: ControlPoint[] = [
      { id: 'hd_front_top', x: hoodD, y: 0, type: 'corner' },
      { id: 'hd_crown', x: 0, y: 0, type: 'smooth' },
      { id: 'hd_back_curve', x: -20, y: hoodH * 0.5, type: 'smooth' },
      { id: 'hd_back_neck', x: 0, y: hoodH, type: 'corner' },
      { id: 'hd_neck_base', x: hoodD * 0.85, y: hoodH + 20, type: 'corner' },
      { id: 'hd_front_neck', x: hoodD, y: hoodH, type: 'corner' },
    ];

    const hoodEdges: Edge2D[] = [
      { id: 'e_hd_crown', fromPointId: 'hd_front_top', toPointId: 'hd_crown', type: 'line', name: 'Hood Crown' },
      {
        id: 'e_hd_back',
        fromPointId: 'hd_crown',
        toPointId: 'hd_back_neck',
        type: 'cubic-bezier',
        name: 'Hood Center Back Seam',
        controlPoints: [{ x: -30, y: hoodH * 0.3 }, { x: -20, y: hoodH * 0.7 }],
      },
      { id: 'e_hd_neck', fromPointId: 'hd_back_neck', toPointId: 'hd_front_neck', type: 'cubic-bezier', name: 'Hood Neckline Seam' },
      { id: 'e_hd_face', fromPointId: 'hd_front_neck', toPointId: 'hd_front_top', type: 'line', name: 'Hood Face Opening' },
    ];

    const hoodPiece: PatternPiece = {
      id: 'hoodie_hood',
      name: 'Hood (Cut 2 Pairs)',
      category: 'hood',
      points: hoodPoints,
      edges: hoodEdges,
      position: { x: 1050, y: 80 },
      rotation: 0,
      mirror: true,
      cutQuantity: 4,
      fabricCode: 'FAB_FRENCH_TERRY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [{ id: 'n_hd_shoulder', edgeId: 'e_hd_neck', distanceRatio: 0.45, type: 'single', depth: 4 }],
      darts: [],
      grainline: { start: { x: hoodD * 0.5, y: 50 }, end: { x: hoodD * 0.5, y: hoodH - 50 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [
        { id: 'il_drawstring', points: [{ x: hoodD - 25, y: 10 }, { x: hoodD - 25, y: hoodH - 10 }], type: 'fold', name: 'Drawstring Channel (2.5cm)' },
      ],
      color: '#6366f1',
    };

    return [frontPiece, pocketPiece, hoodPiece];
  };

  const defaultSewing: SewingRelationship[] = [
    {
      id: 'sew_hood_center',
      name: 'Hood Center Seam',
      pieceAId: 'hoodie_hood',
      edgeAId: 'e_hd_back',
      pieceBId: 'hoodie_hood',
      edgeBId: 'e_hd_back',
      seamType: 'overlock',
      flipped: true,
      enabled: true,
    },
    {
      id: 'sew_hood_neck',
      name: 'Hood to Neckline',
      pieceAId: 'hoodie_hood',
      edgeAId: 'e_hd_neck',
      pieceBId: 'hoodie_front',
      edgeBId: 'e_hf_neck_l',
      seamType: 'overlock',
      flipped: false,
      enabled: true,
    },
  ];

  return {
    id,
    name,
    category: 'tops',
    subcategory: 'Hoodie',
    fit,
    description,
    thumbnail: '/thumbnails/hoodie.svg',
    baseSize: 'M',
    measurements: measurementsList,
    gradingRules: [
      { size: 'XS' as StandardSize, measurementDeltas: { chestWidth: -50, bodyLength: -30, shoulderWidth: -25 } },
      { size: 'S' as StandardSize, measurementDeltas: { chestWidth: -25, bodyLength: -15, shoulderWidth: -12 } },
      { size: 'M' as StandardSize, measurementDeltas: {} },
      { size: 'L' as StandardSize, measurementDeltas: { chestWidth: 35, bodyLength: 15, shoulderWidth: 15 } },
      { size: 'XL' as StandardSize, measurementDeltas: { chestWidth: 70, bodyLength: 30, shoulderWidth: 30 } },
      { size: 'XXL' as StandardSize, measurementDeltas: { chestWidth: 105, bodyLength: 45, shoulderWidth: 45 } },
    ],
    defaultFabricCode: 'FAB_FRENCH_TERRY',
    generatePatterns,
    defaultSewing,
  };
}

