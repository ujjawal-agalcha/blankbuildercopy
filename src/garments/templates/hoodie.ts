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
    chestWidth: 640,
    bodyLength: 720,
    shoulderWidth: 590,
    sleeveLength: 630,
    sleeveOpening: 105,
    hoodHeight: 380,
    hoodDepth: 280,
    pocketWidth: 360,
    pocketHeight: 230,
    hemRibHeight: 70,
    cuffRibHeight: 65,
  };

  const measurementsList = [
    { id: 'chestWidth', name: 'Chest Width (Half)', description: 'Across front chest from armpit to armpit', value: defaultMeasurements.chestWidth, min: 450, max: 800, step: 5, category: 'width' as const },
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

    const shoulderSlope = 50;
    const armholeDepth = halfChest * 0.46;

    // 1. FRONT BODY
    const frontPoints: ControlPoint[] = [
      { id: 'h_f_neck', x: 0, y: 80, type: 'smooth' },
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
      position: { x: 380, y: 100 },
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

    // 2. BACK BODY
    const backPoints: ControlPoint[] = [
      { id: 'h_b_neck', x: 0, y: 30, type: 'smooth' },
      { id: 'h_b_hsp_l', x: -115, y: 0, type: 'corner' },
      { id: 'h_b_lsp_l', x: -halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'h_b_armpit_l', x: -halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'h_b_hem_l', x: -halfChest * 0.95, y: bodyLen, type: 'corner' },
      { id: 'h_b_hem_c', x: 0, y: bodyLen, type: 'corner' },
      { id: 'h_b_hem_r', x: halfChest * 0.95, y: bodyLen, type: 'corner' },
      { id: 'h_b_armpit_r', x: halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'h_b_lsp_r', x: halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'h_b_hsp_r', x: 115, y: 0, type: 'corner' },
    ];

    const backEdges: Edge2D[] = [
      { id: 'e_hb_neck_r', fromPointId: 'h_b_hsp_r', toPointId: 'h_b_neck', type: 'cubic-bezier', name: 'Back Neck R' },
      { id: 'e_hb_neck_l', fromPointId: 'h_b_neck', toPointId: 'h_b_hsp_l', type: 'cubic-bezier', name: 'Back Neck L' },
      { id: 'e_hb_shoulder_l', fromPointId: 'h_b_hsp_l', toPointId: 'h_b_lsp_l', type: 'line', name: 'Back Shoulder L' },
      { id: 'e_hb_armhole_l', fromPointId: 'h_b_lsp_l', toPointId: 'h_b_armpit_l', type: 'cubic-bezier', name: 'Back Armhole L' },
      { id: 'e_hb_side_l', fromPointId: 'h_b_armpit_l', toPointId: 'h_b_hem_l', type: 'line', name: 'Back Side Seam L' },
      { id: 'e_hb_hem_l', fromPointId: 'h_b_hem_l', toPointId: 'h_b_hem_c', type: 'line', name: 'Back Hem L' },
      { id: 'e_hb_hem_r', fromPointId: 'h_b_hem_c', toPointId: 'h_b_hem_r', type: 'line', name: 'Back Hem R' },
      { id: 'e_hb_side_r', fromPointId: 'h_b_hem_r', toPointId: 'h_b_armpit_r', type: 'line', name: 'Back Side Seam R' },
      { id: 'e_hb_armhole_r', fromPointId: 'h_b_armpit_r', toPointId: 'h_b_lsp_r', type: 'cubic-bezier', name: 'Back Armhole R' },
      { id: 'e_hb_shoulder_r', fromPointId: 'h_b_lsp_r', toPointId: 'h_b_hsp_r', type: 'line', name: 'Back Shoulder R' },
    ];

    const backPiece: PatternPiece = {
      id: 'hoodie_back',
      name: 'Hoodie Back Body',
      category: 'body',
      points: backPoints,
      edges: backEdges,
      position: { x: 1060, y: 100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_FRENCH_TERRY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 150 }, end: { x: 0, y: bodyLen - 100 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#334155',
    };

    // 3. KANGAROO POCKET
    const pocketPoints: ControlPoint[] = [
      { id: 'kp_tl', x: -pWidth * 0.65, y: 0, type: 'corner' },
      { id: 'kp_tr', x: pWidth * 0.65, y: 0, type: 'corner' },
      { id: 'kp_mr', x: pWidth, y: pHeight * 0.45, type: 'corner' },
      { id: 'kp_br', x: pWidth, y: pHeight, type: 'corner' },
      { id: 'kp_bl', x: -pWidth, y: pHeight, type: 'corner' },
      { id: 'kp_ml', x: -pWidth, y: pHeight * 0.45, type: 'corner' },
    ];

    const pocketEdges: Edge2D[] = [
      { id: 'e_kp_top', fromPointId: 'kp_tl', toPointId: 'kp_tr', type: 'line', name: 'Pocket Top' },
      { id: 'e_kp_diag_r', fromPointId: 'kp_tr', toPointId: 'kp_mr', type: 'line', name: 'Pocket Hand Opening R' },
      { id: 'e_kp_side_r', fromPointId: 'kp_mr', toPointId: 'kp_br', type: 'line', name: 'Pocket Side R' },
      { id: 'e_kp_bottom', fromPointId: 'kp_br', toPointId: 'kp_bl', type: 'line', name: 'Pocket Bottom' },
      { id: 'e_kp_side_l', fromPointId: 'kp_bl', toPointId: 'kp_ml', type: 'line', name: 'Pocket Side L' },
      { id: 'e_kp_diag_l', fromPointId: 'kp_ml', toPointId: 'kp_tl', type: 'line', name: 'Pocket Hand Opening L' },
    ];

    const pocketPiece: PatternPiece = {
      id: 'hoodie_pocket',
      name: 'Kangaroo Pocket Pouch',
      category: 'pocket',
      points: pocketPoints,
      edges: pocketEdges,
      position: { x: 380, y: 780 },
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
      color: '#3b82f6',
    };

    // 4. LEFT SLEEVE & 5. RIGHT SLEEVE
    const sleeveBicep = armholeDepth * 1.1;
    const sleeveCuff = defaultMeasurements.sleeveOpening;

    const sleevePoints: ControlPoint[] = [
      { id: 'hsl_top', x: 0, y: 0, type: 'smooth' },
      { id: 'hsl_under_r', x: sleeveBicep, y: 140, type: 'corner' },
      { id: 'hsl_cuff_r', x: sleeveCuff, y: sleeveLen, type: 'corner' },
      { id: 'hsl_cuff_l', x: -sleeveCuff, y: sleeveLen, type: 'corner' },
      { id: 'hsl_under_l', x: -sleeveBicep, y: 140, type: 'corner' },
    ];

    const sleeveEdges: Edge2D[] = [
      { id: 'e_hsl_cap_r', fromPointId: 'hsl_top', toPointId: 'hsl_under_r', type: 'cubic-bezier', name: 'Sleeve Cap R' },
      { id: 'e_hsl_inseam_r', fromPointId: 'hsl_under_r', toPointId: 'hsl_cuff_r', type: 'line', name: 'Inseam R' },
      { id: 'e_hsl_cuff', fromPointId: 'hsl_cuff_r', toPointId: 'hsl_cuff_l', type: 'line', name: 'Cuff Hem' },
      { id: 'e_hsl_inseam_l', fromPointId: 'hsl_cuff_l', toPointId: 'hsl_under_l', type: 'line', name: 'Inseam L' },
      { id: 'e_hsl_cap_l', fromPointId: 'hsl_under_l', toPointId: 'hsl_top', type: 'cubic-bezier', name: 'Sleeve Cap L' },
    ];

    const sleeveLeftPiece: PatternPiece = {
      id: 'hoodie_sleeve_left',
      name: 'Hoodie Left Sleeve',
      category: 'sleeve',
      points: sleevePoints,
      edges: sleeveEdges,
      position: { x: 1720, y: 100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_FRENCH_TERRY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 30 }, end: { x: 0, y: sleeveLen - 30 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#10b981',
    };

    const sleeveRightPiece: PatternPiece = {
      id: 'hoodie_sleeve_right',
      name: 'Hoodie Right Sleeve',
      category: 'sleeve',
      points: sleevePoints,
      edges: sleeveEdges,
      position: { x: 1720, y: 680 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_FRENCH_TERRY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 30 }, end: { x: 0, y: sleeveLen - 30 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#10b981',
    };

    // 6. HOOD LEFT & 7. HOOD RIGHT
    const hoodPoints: ControlPoint[] = [
      { id: 'hd_front_top', x: hoodD, y: 0, type: 'corner' },
      { id: 'hd_crown', x: 0, y: 40, type: 'smooth' },
      { id: 'hd_back_neck', x: 25, y: hoodH, type: 'corner' },
      { id: 'hd_front_neck', x: hoodD, y: hoodH - 20, type: 'corner' },
    ];

    const hoodEdges: Edge2D[] = [
      { id: 'e_hd_crown', fromPointId: 'hd_front_top', toPointId: 'hd_crown', type: 'cubic-bezier', name: 'Hood Crown' },
      { id: 'e_hd_back', fromPointId: 'hd_crown', toPointId: 'hd_back_neck', type: 'cubic-bezier', name: 'Hood Center Back Seam' },
      { id: 'e_hd_neck', fromPointId: 'hd_back_neck', toPointId: 'hd_front_neck', type: 'cubic-bezier', name: 'Hood Neckline Seam' },
      { id: 'e_hd_face', fromPointId: 'hd_front_neck', toPointId: 'hd_front_top', type: 'line', name: 'Hood Face Opening' },
    ];

    const hoodLeftPiece: PatternPiece = {
      id: 'hoodie_hood_left',
      name: 'Hood Left Panel',
      category: 'hood',
      points: hoodPoints,
      edges: hoodEdges,
      position: { x: 1050, y: 760 },
      rotation: 0,
      mirror: false,
      cutQuantity: 2,
      fabricCode: 'FAB_FRENCH_TERRY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: hoodD * 0.5, y: 50 }, end: { x: hoodD * 0.5, y: hoodH - 50 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#6366f1',
    };

    const hoodRightPiece: PatternPiece = {
      id: 'hoodie_hood_right',
      name: 'Hood Right Panel',
      category: 'hood',
      points: hoodPoints,
      edges: hoodEdges,
      position: { x: 1400, y: 760 },
      rotation: 0,
      mirror: true,
      cutQuantity: 2,
      fabricCode: 'FAB_FRENCH_TERRY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: hoodD * 0.5, y: 50 }, end: { x: hoodD * 0.5, y: hoodH - 50 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#6366f1',
    };

    return [
      frontPiece,
      backPiece,
      pocketPiece,
      sleeveLeftPiece,
      sleeveRightPiece,
      hoodLeftPiece,
      hoodRightPiece,
    ];
  };

  const defaultSewing: SewingRelationship[] = [
    {
      id: 'sew_hood_center',
      name: 'Hood Center Seam',
      pieceAId: 'hoodie_hood_left',
      edgeAId: 'e_hd_back',
      pieceBId: 'hoodie_hood_right',
      edgeBId: 'e_hd_back',
      seamType: 'overlock',
      flipped: true,
      enabled: true,
    },
    {
      id: 'sew_hood_neck',
      name: 'Hood to Neckline',
      pieceAId: 'hoodie_hood_left',
      edgeAId: 'e_hd_neck',
      pieceBId: 'hoodie_front',
      edgeBId: 'e_hf_neck_l',
      seamType: 'overlock',
      flipped: false,
      enabled: true,
    },
    {
      id: 'sew_hoodie_shoulder_l',
      name: 'Hoodie Shoulder L',
      pieceAId: 'hoodie_front',
      edgeAId: 'e_hf_shoulder_l',
      pieceBId: 'hoodie_back',
      edgeBId: 'e_hb_shoulder_l',
      seamType: 'plain',
      flipped: false,
      enabled: true,
    },
    {
      id: 'sew_hoodie_shoulder_r',
      name: 'Hoodie Shoulder R',
      pieceAId: 'hoodie_front',
      edgeAId: 'e_hf_shoulder_r',
      pieceBId: 'hoodie_back',
      edgeBId: 'e_hb_shoulder_r',
      seamType: 'plain',
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
