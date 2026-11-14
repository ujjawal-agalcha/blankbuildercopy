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

    // 8. HOOD CENTER GUSSET STRIP
    const gussetLen = 520;
    const gussetW = 75;
    const hoodGussetPiece: PatternPiece = {
      id: 'hoodie_hood_gusset',
      name: 'Hood Center Gusset',
      category: 'hood',
      points: [
        { id: 'hd_g_tl', x: -gussetW / 2, y: 0, type: 'corner' },
        { id: 'hd_g_tr', x: gussetW / 2, y: 0, type: 'corner' },
        { id: 'hd_g_br', x: gussetW / 2, y: gussetLen, type: 'corner' },
        { id: 'hd_g_bl', x: -gussetW / 2, y: gussetLen, type: 'corner' },
      ],
      edges: [
        { id: 'e_hdg_top', fromPointId: 'hd_g_tl', toPointId: 'hd_g_tr', type: 'line', name: 'Gusset Front Face' },
        { id: 'e_hdg_r', fromPointId: 'hd_g_tr', toPointId: 'hd_g_br', type: 'line', name: 'Gusset Join R' },
        { id: 'e_hdg_bot', fromPointId: 'hd_g_br', toPointId: 'hd_g_bl', type: 'line', name: 'Gusset Neck Seam' },
        { id: 'e_hdg_l', fromPointId: 'hd_g_bl', toPointId: 'hd_g_tl', type: 'line', name: 'Gusset Join L' },
      ],
      position: { x: 1225, y: 760 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_FRENCH_TERRY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 30 }, end: { x: 0, y: gussetLen - 30 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#818cf8',
    };

    // 9. LEFT SLEEVE RIB CUFF & 10. RIGHT SLEEVE RIB CUFF
    const cuffW = sleeveCuff * 2;
    const cuffH = 70;
    const cuffLeftPiece: PatternPiece = {
      id: 'hoodie_cuff_left',
      name: 'Left Sleeve Rib Cuff',
      category: 'trim',
      points: [
        { id: 'cfl_tl', x: -cuffW / 2, y: 0, type: 'corner' },
        { id: 'cfl_tr', x: cuffW / 2, y: 0, type: 'corner' },
        { id: 'cfl_br', x: cuffW / 2, y: cuffH, type: 'corner' },
        { id: 'cfl_bl', x: -cuffW / 2, y: cuffH, type: 'corner' },
      ],
      edges: [
        { id: 'e_cfl_top', fromPointId: 'cfl_tl', toPointId: 'cfl_tr', type: 'line', name: 'Cuff Attach' },
        { id: 'e_cfl_r', fromPointId: 'cfl_tr', toPointId: 'cfl_br', type: 'line', name: 'Cuff Join' },
        { id: 'e_cfl_bot', fromPointId: 'cfl_br', toPointId: 'cfl_bl', type: 'line', name: 'Cuff Edge' },
        { id: 'e_cfl_l', fromPointId: 'cfl_bl', toPointId: 'cfl_tl', type: 'line', name: 'Cuff Join' },
      ],
      position: { x: 1720, y: 560 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -cuffW / 2 + 20, y: cuffH / 2 }, end: { x: cuffW / 2 - 20, y: cuffH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    const cuffRightPiece: PatternPiece = {
      id: 'hoodie_cuff_right',
      name: 'Right Sleeve Rib Cuff',
      category: 'trim',
      points: [
        { id: 'cfr_tl', x: -cuffW / 2, y: 0, type: 'corner' },
        { id: 'cfr_tr', x: cuffW / 2, y: 0, type: 'corner' },
        { id: 'cfr_br', x: cuffW / 2, y: cuffH, type: 'corner' },
        { id: 'cfr_bl', x: -cuffW / 2, y: cuffH, type: 'corner' },
      ],
      edges: [
        { id: 'e_cfr_top', fromPointId: 'cfr_tl', toPointId: 'cfr_tr', type: 'line', name: 'Cuff Attach' },
        { id: 'e_cfr_r', fromPointId: 'cfr_tr', toPointId: 'cfr_br', type: 'line', name: 'Cuff Join' },
        { id: 'e_cfr_bot', fromPointId: 'cfr_br', toPointId: 'cfr_bl', type: 'line', name: 'Cuff Edge' },
        { id: 'e_cfr_l', fromPointId: 'cfr_bl', toPointId: 'cfr_tl', type: 'line', name: 'Cuff Join' },
      ],
      position: { x: 1720, y: 1140 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -cuffW / 2 + 20, y: cuffH / 2 }, end: { x: cuffW / 2 - 20, y: cuffH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    // 11. BOTTOM WAISTBAND RIB
    const wbW = halfChest * 2 * 0.9;
    const wbH = 75;
    const waistbandPiece: PatternPiece = {
      id: 'hoodie_waistband',
      name: 'Bottom Waistband Rib',
      category: 'trim',
      points: [
        { id: 'hwb_tl', x: -wbW / 2, y: 0, type: 'corner' },
        { id: 'hwb_tr', x: wbW / 2, y: 0, type: 'corner' },
        { id: 'hwb_br', x: wbW / 2, y: wbH, type: 'corner' },
        { id: 'hwb_bl', x: -wbW / 2, y: wbH, type: 'corner' },
      ],
      edges: [
        { id: 'e_hwb_top', fromPointId: 'hwb_tl', toPointId: 'hwb_tr', type: 'line', name: 'Waistband Attach' },
        { id: 'e_hwb_r', fromPointId: 'hwb_tr', toPointId: 'hwb_br', type: 'line', name: 'Waistband Join' },
        { id: 'e_hwb_bot', fromPointId: 'hwb_br', toPointId: 'hwb_bl', type: 'line', name: 'Waistband Edge' },
        { id: 'e_hwb_l', fromPointId: 'hwb_bl', toPointId: 'hwb_tl', type: 'line', name: 'Waistband Join' },
      ],
      position: { x: 720, y: 1180 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -wbW / 2 + 50, y: wbH / 2 }, end: { x: wbW / 2 - 50, y: wbH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    return [
      frontPiece,
      backPiece,
      pocketPiece,
      sleeveLeftPiece,
      sleeveRightPiece,
      cuffLeftPiece,
      cuffRightPiece,
      hoodLeftPiece,
      hoodRightPiece,
      hoodGussetPiece,
      waistbandPiece,
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
    modelId: 'hoodie',
    generatePatterns,
    defaultSewing,
  };
}

/**
 * Generates an authentic Zip-Up Hoodie pattern with split front panels,
 * metal center zipper edge, split kangaroo pockets, 2-piece hood, and ribbed cuffs.
 */
export function createZipUpHoodieTemplate(
  id: string,
  name: string,
  fit: 'oversized' | 'boxy' | 'regular',
  description: string
): GarmentTemplate {
  const base = createHoodieTemplate(id, name, fit, description);

  const generatePatterns = (m: Record<string, number>): PatternPiece[] => {
    const halfChest = (m.chestWidth || 640) / 2;
    const bodyLen = (m.bodyLength || 720) - 70;
    const halfShoulder = (m.shoulderWidth || 590) / 2;
    const sleeveLen = (m.sleeveLength || 630) - 65;
    const hoodH = m.hoodHeight || 380;
    const hoodD = m.hoodDepth || 280;
    const pWidth = (m.pocketWidth || 360) / 2;
    const pHeight = m.pocketHeight || 230;

    const shoulderSlope = 50;
    const armholeDepth = halfChest * 0.46;

    // 1. FRONT LEFT PANEL (Zipper on Right edge at x=0)
    const flPoints: ControlPoint[] = [
      { id: 'zfl_neck', x: 0, y: 80, type: 'corner' },
      { id: 'zfl_hsp', x: -115, y: 0, type: 'corner' },
      { id: 'zfl_lsp', x: -halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'zfl_armpit', x: -halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'zfl_hem_out', x: -halfChest * 0.95, y: bodyLen, type: 'corner' },
      { id: 'zfl_hem_cf', x: 0, y: bodyLen, type: 'corner' },
    ];
    const flEdges: Edge2D[] = [
      { id: 'e_zfl_neck', fromPointId: 'zfl_neck', toPointId: 'zfl_hsp', type: 'cubic-bezier', name: 'Front Neckline L' },
      { id: 'e_zfl_shoulder', fromPointId: 'zfl_hsp', toPointId: 'zfl_lsp', type: 'line', name: 'Shoulder L' },
      { id: 'e_zfl_armhole', fromPointId: 'zfl_lsp', toPointId: 'zfl_armpit', type: 'cubic-bezier', name: 'Armhole L' },
      { id: 'e_zfl_side', fromPointId: 'zfl_armpit', toPointId: 'zfl_hem_out', type: 'line', name: 'Side Seam L' },
      { id: 'e_zfl_hem', fromPointId: 'zfl_hem_out', toPointId: 'zfl_hem_cf', type: 'line', name: 'Hem L' },
      { id: 'e_zfl_zip', fromPointId: 'zfl_hem_cf', toPointId: 'zfl_neck', type: 'line', name: 'Center Zipper Seam L' },
    ];
    const frontLeftPiece: PatternPiece = {
      id: 'hoodie_front_left',
      name: 'Front Left Panel (Zip)',
      category: 'body',
      points: flPoints,
      edges: flEdges,
      position: { x: 260, y: 100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_FRENCH_TERRY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [{ id: 'n_zfl_zip', edgeId: 'e_zfl_zip', distanceRatio: 0.5, type: 'single', depth: 4 }],
      darts: [],
      grainline: { start: { x: -halfChest / 2, y: 150 }, end: { x: -halfChest / 2, y: bodyLen - 100 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [{ id: 'il_zfl_pocket', points: [{ x: 0, y: bodyLen - pHeight }, { x: -pWidth, y: bodyLen - pHeight }], type: 'pocket-placement', name: 'Pocket Top' }],
      color: '#475569',
    };

    // 2. FRONT RIGHT PANEL (Zipper on Left edge at x=0)
    const frPoints: ControlPoint[] = [
      { id: 'zfr_neck', x: 0, y: 80, type: 'corner' },
      { id: 'zfr_hsp', x: 115, y: 0, type: 'corner' },
      { id: 'zfr_lsp', x: halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'zfr_armpit', x: halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'zfr_hem_out', x: halfChest * 0.95, y: bodyLen, type: 'corner' },
      { id: 'zfr_hem_cf', x: 0, y: bodyLen, type: 'corner' },
    ];
    const frEdges: Edge2D[] = [
      { id: 'e_zfr_zip', fromPointId: 'zfr_neck', toPointId: 'zfr_hem_cf', type: 'line', name: 'Center Zipper Seam R' },
      { id: 'e_zfr_hem', fromPointId: 'zfr_hem_cf', toPointId: 'zfr_hem_out', type: 'line', name: 'Hem R' },
      { id: 'e_zfr_side', fromPointId: 'zfr_hem_out', toPointId: 'zfr_armpit', type: 'line', name: 'Side Seam R' },
      { id: 'e_zfr_armhole', fromPointId: 'zfr_armpit', toPointId: 'zfr_lsp', type: 'cubic-bezier', name: 'Armhole R' },
      { id: 'e_zfr_shoulder', fromPointId: 'zfr_lsp', toPointId: 'zfr_hsp', type: 'line', name: 'Shoulder R' },
      { id: 'e_zfr_neck', fromPointId: 'zfr_hsp', toPointId: 'zfr_neck', type: 'cubic-bezier', name: 'Front Neckline R' },
    ];
    const frontRightPiece: PatternPiece = {
      id: 'hoodie_front_right',
      name: 'Front Right Panel (Zip)',
      category: 'body',
      points: frPoints,
      edges: frEdges,
      position: { x: 620, y: 100 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_FRENCH_TERRY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [{ id: 'n_zfr_zip', edgeId: 'e_zfr_zip', distanceRatio: 0.5, type: 'single', depth: 4 }],
      darts: [],
      grainline: { start: { x: halfChest / 2, y: 150 }, end: { x: halfChest / 2, y: bodyLen - 100 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [{ id: 'il_zfr_pocket', points: [{ x: 0, y: bodyLen - pHeight }, { x: pWidth, y: bodyLen - pHeight }], type: 'pocket-placement', name: 'Pocket Top' }],
      color: '#475569',
    };

    // 3. BACK PANEL
    const backPoints: ControlPoint[] = [
      { id: 'zh_b_neck', x: 0, y: 30, type: 'smooth' },
      { id: 'zh_b_hsp_l', x: -115, y: 0, type: 'corner' },
      { id: 'zh_b_lsp_l', x: -halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'zh_b_armpit_l', x: -halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'zh_b_hem_l', x: -halfChest * 0.95, y: bodyLen, type: 'corner' },
      { id: 'zh_b_hem_c', x: 0, y: bodyLen, type: 'corner' },
      { id: 'zh_b_hem_r', x: halfChest * 0.95, y: bodyLen, type: 'corner' },
      { id: 'zh_b_armpit_r', x: halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'zh_b_lsp_r', x: halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'zh_b_hsp_r', x: 115, y: 0, type: 'corner' },
    ];
    const backEdges: Edge2D[] = [
      { id: 'e_zhb_neck_r', fromPointId: 'zh_b_hsp_r', toPointId: 'zh_b_neck', type: 'cubic-bezier', name: 'Back Neck R' },
      { id: 'e_zhb_neck_l', fromPointId: 'zh_b_neck', toPointId: 'zh_b_hsp_l', type: 'cubic-bezier', name: 'Back Neck L' },
      { id: 'e_zhb_shoulder_l', fromPointId: 'zh_b_hsp_l', toPointId: 'zh_b_lsp_l', type: 'line', name: 'Back Shoulder L' },
      { id: 'e_zhb_armhole_l', fromPointId: 'zh_b_lsp_l', toPointId: 'zh_b_armpit_l', type: 'cubic-bezier', name: 'Back Armhole L' },
      { id: 'e_zhb_side_l', fromPointId: 'zh_b_armpit_l', toPointId: 'zh_b_hem_l', type: 'line', name: 'Back Side Seam L' },
      { id: 'e_zhb_hem_l', fromPointId: 'zh_b_hem_l', toPointId: 'zh_b_hem_c', type: 'line', name: 'Back Hem L' },
      { id: 'e_zhb_hem_r', fromPointId: 'zh_b_hem_c', toPointId: 'zh_b_hem_r', type: 'line', name: 'Back Hem R' },
      { id: 'e_zhb_side_r', fromPointId: 'zh_b_hem_r', toPointId: 'zh_b_armpit_r', type: 'line', name: 'Back Side Seam R' },
      { id: 'e_zhb_armhole_r', fromPointId: 'zh_b_armpit_r', toPointId: 'zh_b_lsp_r', type: 'cubic-bezier', name: 'Back Armhole R' },
      { id: 'e_zhb_shoulder_r', fromPointId: 'zh_b_lsp_r', toPointId: 'zh_b_hsp_r', type: 'line', name: 'Back Shoulder R' },
    ];
    const backPiece: PatternPiece = {
      id: 'hoodie_back',
      name: 'Back Body',
      category: 'body',
      points: backPoints,
      edges: backEdges,
      position: { x: 1040, y: 100 },
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

    // 4. SPLIT KANGAROO POCKETS
    const pklPoints: ControlPoint[] = [
      { id: 'pkl_tl', x: -pWidth * 0.7, y: 0, type: 'corner' },
      { id: 'pkl_cf_t', x: 0, y: 0, type: 'corner' },
      { id: 'pkl_cf_b', x: 0, y: pHeight, type: 'corner' },
      { id: 'pkl_bl', x: -pWidth, y: pHeight, type: 'corner' },
      { id: 'pkl_ml', x: -pWidth, y: pHeight * 0.45, type: 'corner' },
    ];
    const pklEdges: Edge2D[] = [
      { id: 'e_pkl_top', fromPointId: 'pkl_tl', toPointId: 'pkl_cf_t', type: 'line', name: 'Pocket Top L' },
      { id: 'e_pkl_zip', fromPointId: 'pkl_cf_t', toPointId: 'pkl_cf_b', type: 'line', name: 'Pocket Zipper Edge L' },
      { id: 'e_pkl_bot', fromPointId: 'pkl_cf_b', toPointId: 'pkl_bl', type: 'line', name: 'Pocket Hem L' },
      { id: 'e_pkl_side', fromPointId: 'pkl_bl', toPointId: 'pkl_ml', type: 'line', name: 'Pocket Side L' },
      { id: 'e_pkl_diag', fromPointId: 'pkl_ml', toPointId: 'pkl_tl', type: 'line', name: 'Pocket Opening L' },
    ];
    const pocketLeftPiece: PatternPiece = {
      id: 'hoodie_pocket_left',
      name: 'Split Kangaroo Pocket L',
      category: 'pocket',
      points: pklPoints,
      edges: pklEdges,
      position: { x: 260, y: 780 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_FRENCH_TERRY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -pWidth / 2, y: 20 }, end: { x: -pWidth / 2, y: pHeight - 20 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#3b82f6',
    };

    const pkrPoints: ControlPoint[] = [
      { id: 'pkr_cf_t', x: 0, y: 0, type: 'corner' },
      { id: 'pkr_tr', x: pWidth * 0.7, y: 0, type: 'corner' },
      { id: 'pkr_mr', x: pWidth, y: pHeight * 0.45, type: 'corner' },
      { id: 'pkr_br', x: pWidth, y: pHeight, type: 'corner' },
      { id: 'pkr_cf_b', x: 0, y: pHeight, type: 'corner' },
    ];
    const pkrEdges: Edge2D[] = [
      { id: 'e_pkr_top', fromPointId: 'pkr_cf_t', toPointId: 'pkr_tr', type: 'line', name: 'Pocket Top R' },
      { id: 'e_pkr_diag', fromPointId: 'pkr_tr', toPointId: 'pkr_mr', type: 'line', name: 'Pocket Opening R' },
      { id: 'e_pkr_side', fromPointId: 'pkr_mr', toPointId: 'pkr_br', type: 'line', name: 'Pocket Side R' },
      { id: 'e_pkr_bot', fromPointId: 'pkr_br', toPointId: 'pkr_cf_b', type: 'line', name: 'Pocket Hem R' },
      { id: 'e_pkr_zip', fromPointId: 'pkr_cf_b', toPointId: 'pkr_cf_t', type: 'line', name: 'Pocket Zipper Edge R' },
    ];
    const pocketRightPiece: PatternPiece = {
      id: 'hoodie_pocket_right',
      name: 'Split Kangaroo Pocket R',
      category: 'pocket',
      points: pkrPoints,
      edges: pkrEdges,
      position: { x: 620, y: 780 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_FRENCH_TERRY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: pWidth / 2, y: 20 }, end: { x: pWidth / 2, y: pHeight - 20 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#3b82f6',
    };

    // 5. LEFT & RIGHT SLEEVES
    const sleeveBicep = armholeDepth * 1.1;
    const sleeveCuff = 110;
    const sleevePoints: ControlPoint[] = [
      { id: 'zhsl_top', x: 0, y: 0, type: 'smooth' },
      { id: 'zhsl_under_r', x: sleeveBicep, y: 140, type: 'corner' },
      { id: 'zhsl_cuff_r', x: sleeveCuff, y: sleeveLen, type: 'corner' },
      { id: 'zhsl_cuff_l', x: -sleeveCuff, y: sleeveLen, type: 'corner' },
      { id: 'zhsl_under_l', x: -sleeveBicep, y: 140, type: 'corner' },
    ];
    const sleeveEdges: Edge2D[] = [
      { id: 'e_zhsl_cap_r', fromPointId: 'zhsl_top', toPointId: 'zhsl_under_r', type: 'cubic-bezier', name: 'Sleeve Cap R' },
      { id: 'e_zhsl_inseam_r', fromPointId: 'zhsl_under_r', toPointId: 'zhsl_cuff_r', type: 'line', name: 'Inseam R' },
      { id: 'e_zhsl_cuff', fromPointId: 'zhsl_cuff_r', toPointId: 'zhsl_cuff_l', type: 'line', name: 'Cuff Hem' },
      { id: 'e_zhsl_inseam_l', fromPointId: 'zhsl_cuff_l', toPointId: 'zhsl_under_l', type: 'line', name: 'Inseam L' },
      { id: 'e_zhsl_cap_l', fromPointId: 'zhsl_under_l', toPointId: 'zhsl_top', type: 'cubic-bezier', name: 'Sleeve Cap L' },
    ];
    const sleeveLeftPiece: PatternPiece = {
      id: 'hoodie_sleeve_left',
      name: 'Left Sleeve',
      category: 'sleeve',
      points: sleevePoints,
      edges: sleeveEdges,
      position: { x: 1650, y: 100 },
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
      name: 'Right Sleeve',
      category: 'sleeve',
      points: sleevePoints,
      edges: sleeveEdges,
      position: { x: 1650, y: 680 },
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

    // 6. HOOD LEFT & RIGHT
    const hoodPoints: ControlPoint[] = [
      { id: 'zhd_front_top', x: hoodD, y: 0, type: 'corner' },
      { id: 'zhd_crown', x: 0, y: 40, type: 'smooth' },
      { id: 'zhd_back_neck', x: 25, y: hoodH, type: 'corner' },
      { id: 'zhd_front_neck', x: hoodD, y: hoodH - 20, type: 'corner' },
    ];
    const hoodEdges: Edge2D[] = [
      { id: 'e_zhd_crown', fromPointId: 'zhd_front_top', toPointId: 'zhd_crown', type: 'cubic-bezier', name: 'Hood Crown' },
      { id: 'e_zhd_back', fromPointId: 'zhd_crown', toPointId: 'zhd_back_neck', type: 'cubic-bezier', name: 'Hood Center Back' },
      { id: 'e_zhd_neck', fromPointId: 'zhd_back_neck', toPointId: 'zhd_front_neck', type: 'cubic-bezier', name: 'Hood Neck Seam' },
      { id: 'e_zhd_face', fromPointId: 'zhd_front_neck', toPointId: 'zhd_front_top', type: 'line', name: 'Hood Face Opening' },
    ];
    const hoodLeftPiece: PatternPiece = {
      id: 'hoodie_hood_left',
      name: 'Hood Left Panel',
      category: 'hood',
      points: hoodPoints,
      edges: hoodEdges,
      position: { x: 1040, y: 760 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
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
      position: { x: 1360, y: 760 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_FRENCH_TERRY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: hoodD * 0.5, y: 50 }, end: { x: hoodD * 0.5, y: hoodH - 50 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#6366f1',
    };

    // 7. SLEEVE RIB CUFFS (L & R)
    const cuffW = sleeveCuff * 2;
    const cuffH = 70;
    const cuffLeftPiece: PatternPiece = {
      id: 'hoodie_cuff_left',
      name: 'Left Sleeve Rib Cuff',
      category: 'trim',
      points: [
        { id: 'zcfl_tl', x: -cuffW / 2, y: 0, type: 'corner' },
        { id: 'zcfl_tr', x: cuffW / 2, y: 0, type: 'corner' },
        { id: 'zcfl_br', x: cuffW / 2, y: cuffH, type: 'corner' },
        { id: 'zcfl_bl', x: -cuffW / 2, y: cuffH, type: 'corner' },
      ],
      edges: [
        { id: 'e_zcfl_top', fromPointId: 'zcfl_tl', toPointId: 'zcfl_tr', type: 'line', name: 'Cuff Top' },
        { id: 'e_zcfl_r', fromPointId: 'zcfl_tr', toPointId: 'zcfl_br', type: 'line', name: 'Cuff Join R' },
        { id: 'e_zcfl_bot', fromPointId: 'zcfl_br', toPointId: 'zcfl_bl', type: 'line', name: 'Cuff Hem' },
        { id: 'e_zcfl_l', fromPointId: 'zcfl_bl', toPointId: 'zcfl_tl', type: 'line', name: 'Cuff Join L' },
      ],
      position: { x: 1650, y: 560 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -cuffW / 2 + 20, y: cuffH / 2 }, end: { x: cuffW / 2 - 20, y: cuffH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    const cuffRightPiece: PatternPiece = {
      id: 'hoodie_cuff_right',
      name: 'Right Sleeve Rib Cuff',
      category: 'trim',
      points: [
        { id: 'zcfr_tl', x: -cuffW / 2, y: 0, type: 'corner' },
        { id: 'zcfr_tr', x: cuffW / 2, y: 0, type: 'corner' },
        { id: 'zcfr_br', x: cuffW / 2, y: cuffH, type: 'corner' },
        { id: 'zcfr_bl', x: -cuffW / 2, y: cuffH, type: 'corner' },
      ],
      edges: [
        { id: 'e_zcfr_top', fromPointId: 'zcfr_tl', toPointId: 'zcfr_tr', type: 'line', name: 'Cuff Top' },
        { id: 'e_zcfr_r', fromPointId: 'zcfr_tr', toPointId: 'zcfr_br', type: 'line', name: 'Cuff Join R' },
        { id: 'e_zcfr_bot', fromPointId: 'zcfr_br', toPointId: 'zcfr_bl', type: 'line', name: 'Cuff Hem' },
        { id: 'e_zcfr_l', fromPointId: 'zcfr_bl', toPointId: 'zcfr_tl', type: 'line', name: 'Cuff Join L' },
      ],
      position: { x: 1650, y: 1140 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -cuffW / 2 + 20, y: cuffH / 2 }, end: { x: cuffW / 2 - 20, y: cuffH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    // 8. BOTTOM WAISTBAND RIB
    const wbW = halfChest * 2 * 0.9;
    const wbH = 75;
    const waistbandPiece: PatternPiece = {
      id: 'hoodie_waistband',
      name: 'Bottom Waistband Rib',
      category: 'trim',
      points: [
        { id: 'zwb_tl', x: -wbW / 2, y: 0, type: 'corner' },
        { id: 'zwb_tr', x: wbW / 2, y: 0, type: 'corner' },
        { id: 'zwb_br', x: wbW / 2, y: wbH, type: 'corner' },
        { id: 'zwb_bl', x: -wbW / 2, y: wbH, type: 'corner' },
      ],
      edges: [
        { id: 'e_zwb_top', fromPointId: 'zwb_tl', toPointId: 'zwb_tr', type: 'line', name: 'Waistband Attach' },
        { id: 'e_zwb_r', fromPointId: 'zwb_tr', toPointId: 'zwb_br', type: 'line', name: 'Waistband Join' },
        { id: 'e_zwb_bot', fromPointId: 'zwb_br', toPointId: 'zwb_bl', type: 'line', name: 'Waistband Edge' },
        { id: 'e_zwb_l', fromPointId: 'zwb_bl', toPointId: 'zwb_tl', type: 'line', name: 'Waistband Join' },
      ],
      position: { x: 700, y: 1180 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -wbW / 2 + 50, y: wbH / 2 }, end: { x: wbW / 2 - 50, y: wbH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    // 9. ZIPPER FACING SHIELD
    const zipLen = bodyLen - 20;
    const zipperFacingPiece: PatternPiece = {
      id: 'hoodie_zipper_facing',
      name: 'Inner Zipper Facing Shield',
      category: 'trim',
      points: [
        { id: 'zf_tl', x: -16, y: 0, type: 'corner' },
        { id: 'zf_tr', x: 16, y: 0, type: 'corner' },
        { id: 'zf_br', x: 16, y: zipLen, type: 'corner' },
        { id: 'zf_bl', x: -16, y: zipLen, type: 'corner' },
      ],
      edges: [
        { id: 'e_zf_top', fromPointId: 'zf_tl', toPointId: 'zf_tr', type: 'line', name: 'Facing Top' },
        { id: 'e_zf_r', fromPointId: 'zf_tr', toPointId: 'zf_br', type: 'line', name: 'Facing Right' },
        { id: 'e_zf_bot', fromPointId: 'zf_br', toPointId: 'zf_bl', type: 'line', name: 'Facing Hem' },
        { id: 'e_zf_l', fromPointId: 'zf_bl', toPointId: 'zf_tl', type: 'line', name: 'Facing Left' },
      ],
      position: { x: 650, y: 100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_FRENCH_TERRY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 20 }, end: { x: 0, y: zipLen - 20 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#cbd5e1',
    };

    return [
      frontLeftPiece,
      frontRightPiece,
      backPiece,
      pocketLeftPiece,
      pocketRightPiece,
      sleeveLeftPiece,
      sleeveRightPiece,
      cuffLeftPiece,
      cuffRightPiece,
      hoodLeftPiece,
      hoodRightPiece,
      waistbandPiece,
      zipperFacingPiece,
    ];
  };

  return {
    ...base,
    subcategory: 'Zip-Up Hoodie',
    modelId: 'hoodie-body',
    generatePatterns,
  };
}

/**
 * Generates an authentic Crewneck Sweatshirt pattern with front body,
 * back body, sleeves, ribbed crew collar, waistband, and wrist cuffs.
 */
export function createSweatshirtTemplate(
  id: string,
  name: string,
  fit: 'oversized' | 'boxy' | 'regular',
  description: string
): GarmentTemplate {
  const base = createHoodieTemplate(id, name, fit, description);

  const generatePatterns = (m: Record<string, number>): PatternPiece[] => {
    const halfChest = (m.chestWidth || 630) / 2;
    const bodyLen = (m.bodyLength || 710) - 65;
    const halfShoulder = (m.shoulderWidth || 570) / 2;
    const sleeveLen = (m.sleeveLength || 620) - 65;
    const armholeDepth = halfChest * 0.45;
    const shoulderSlope = 45;

    // Front Body
    const frontPoints: ControlPoint[] = [
      { id: 'sw_f_neck', x: 0, y: 85, type: 'smooth' },
      { id: 'sw_f_hsp_l', x: -105, y: 0, type: 'corner' },
      { id: 'sw_f_lsp_l', x: -halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'sw_f_armpit_l', x: -halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'sw_f_hem_l', x: -halfChest * 0.94, y: bodyLen, type: 'corner' },
      { id: 'sw_f_hem_c', x: 0, y: bodyLen, type: 'corner' },
      { id: 'sw_f_hem_r', x: halfChest * 0.94, y: bodyLen, type: 'corner' },
      { id: 'sw_f_armpit_r', x: halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'sw_f_lsp_r', x: halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'sw_f_hsp_r', x: 105, y: 0, type: 'corner' },
    ];
    const frontEdges: Edge2D[] = [
      { id: 'e_swf_neck_r', fromPointId: 'sw_f_hsp_r', toPointId: 'sw_f_neck', type: 'cubic-bezier', name: 'Neck R' },
      { id: 'e_swf_neck_l', fromPointId: 'sw_f_neck', toPointId: 'sw_f_hsp_l', type: 'cubic-bezier', name: 'Neck L' },
      { id: 'e_swf_shoulder_l', fromPointId: 'sw_f_hsp_l', toPointId: 'sw_f_lsp_l', type: 'line', name: 'Shoulder L' },
      { id: 'e_swf_armhole_l', fromPointId: 'sw_f_lsp_l', toPointId: 'sw_f_armpit_l', type: 'cubic-bezier', name: 'Armhole L' },
      { id: 'e_swf_side_l', fromPointId: 'sw_f_armpit_l', toPointId: 'sw_f_hem_l', type: 'line', name: 'Side Seam L' },
      { id: 'e_swf_hem_l', fromPointId: 'sw_f_hem_l', toPointId: 'sw_f_hem_c', type: 'line', name: 'Hem L' },
      { id: 'e_swf_hem_r', fromPointId: 'sw_f_hem_c', toPointId: 'sw_f_hem_r', type: 'line', name: 'Hem R' },
      { id: 'e_swf_side_r', fromPointId: 'sw_f_hem_r', toPointId: 'sw_f_armpit_r', type: 'line', name: 'Side Seam R' },
      { id: 'e_swf_armhole_r', fromPointId: 'sw_f_armpit_r', toPointId: 'sw_f_lsp_r', type: 'cubic-bezier', name: 'Armhole R' },
      { id: 'e_swf_shoulder_r', fromPointId: 'sw_f_lsp_r', toPointId: 'sw_f_hsp_r', type: 'line', name: 'Shoulder R' },
    ];
    const frontPiece: PatternPiece = {
      id: 'sweatshirt_front',
      name: 'Sweatshirt Front Body',
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
      internalLines: [{ id: 'il_v_notch', points: [{ x: -25, y: 85 }, { x: 0, y: 125 }, { x: 25, y: 85 }], type: 'style', name: 'V-Insert Stitch' }],
      color: '#475569',
    };

    // Back Body
    const backPoints: ControlPoint[] = [
      { id: 'sw_b_neck', x: 0, y: 25, type: 'smooth' },
      { id: 'sw_b_hsp_l', x: -105, y: 0, type: 'corner' },
      { id: 'sw_b_lsp_l', x: -halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'sw_b_armpit_l', x: -halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'sw_b_hem_l', x: -halfChest * 0.94, y: bodyLen, type: 'corner' },
      { id: 'sw_b_hem_c', x: 0, y: bodyLen, type: 'corner' },
      { id: 'sw_b_hem_r', x: halfChest * 0.94, y: bodyLen, type: 'corner' },
      { id: 'sw_b_armpit_r', x: halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'sw_b_lsp_r', x: halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'sw_b_hsp_r', x: 105, y: 0, type: 'corner' },
    ];
    const backEdges: Edge2D[] = [
      { id: 'e_swb_neck_r', fromPointId: 'sw_b_hsp_r', toPointId: 'sw_b_neck', type: 'cubic-bezier', name: 'Back Neck R' },
      { id: 'e_swb_neck_l', fromPointId: 'sw_b_neck', toPointId: 'sw_b_hsp_l', type: 'cubic-bezier', name: 'Back Neck L' },
      { id: 'e_swb_shoulder_l', fromPointId: 'sw_b_hsp_l', toPointId: 'sw_b_lsp_l', type: 'line', name: 'Shoulder L' },
      { id: 'e_swb_armhole_l', fromPointId: 'sw_b_lsp_l', toPointId: 'sw_b_armpit_l', type: 'cubic-bezier', name: 'Armhole L' },
      { id: 'e_swb_side_l', fromPointId: 'sw_b_armpit_l', toPointId: 'sw_b_hem_l', type: 'line', name: 'Side Seam L' },
      { id: 'e_swb_hem_l', fromPointId: 'sw_b_hem_l', toPointId: 'sw_b_hem_c', type: 'line', name: 'Hem L' },
      { id: 'e_swb_hem_r', fromPointId: 'sw_b_hem_c', toPointId: 'sw_b_hem_r', type: 'line', name: 'Hem R' },
      { id: 'e_swb_side_r', fromPointId: 'sw_b_hem_r', toPointId: 'sw_b_armpit_r', type: 'line', name: 'Side Seam R' },
      { id: 'e_swb_armhole_r', fromPointId: 'sw_b_armpit_r', toPointId: 'sw_b_lsp_r', type: 'cubic-bezier', name: 'Armhole R' },
      { id: 'e_swb_shoulder_r', fromPointId: 'sw_b_lsp_r', toPointId: 'sw_b_hsp_r', type: 'line', name: 'Shoulder R' },
    ];
    const backPiece: PatternPiece = {
      id: 'sweatshirt_back',
      name: 'Sweatshirt Back Body',
      category: 'body',
      points: backPoints,
      edges: backEdges,
      position: { x: 1040, y: 100 },
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

    // Sleeves
    const sleeveBicep = armholeDepth * 1.05;
    const sleeveCuff = 105;
    const slvPoints: ControlPoint[] = [
      { id: 'sws_top', x: 0, y: 0, type: 'smooth' },
      { id: 'sws_under_r', x: sleeveBicep, y: 130, type: 'corner' },
      { id: 'sws_cuff_r', x: sleeveCuff, y: sleeveLen, type: 'corner' },
      { id: 'sws_cuff_l', x: -sleeveCuff, y: sleeveLen, type: 'corner' },
      { id: 'sws_under_l', x: -sleeveBicep, y: 130, type: 'corner' },
    ];
    const slvEdges: Edge2D[] = [
      { id: 'e_sws_cap_r', fromPointId: 'sws_top', toPointId: 'sws_under_r', type: 'cubic-bezier', name: 'Sleeve Cap R' },
      { id: 'e_sws_inseam_r', fromPointId: 'sws_under_r', toPointId: 'sws_cuff_r', type: 'line', name: 'Inseam R' },
      { id: 'e_sws_cuff', fromPointId: 'sws_cuff_r', toPointId: 'sws_cuff_l', type: 'line', name: 'Cuff Hem' },
      { id: 'e_sws_inseam_l', fromPointId: 'sws_cuff_l', toPointId: 'sws_under_l', type: 'line', name: 'Inseam L' },
      { id: 'e_sws_cap_l', fromPointId: 'sws_under_l', toPointId: 'sws_top', type: 'cubic-bezier', name: 'Sleeve Cap L' },
    ];
    const sleeveLeftPiece: PatternPiece = {
      id: 'sweatshirt_sleeve_left',
      name: 'Left Sleeve',
      category: 'sleeve',
      points: slvPoints,
      edges: slvEdges,
      position: { x: 1650, y: 100 },
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
      id: 'sweatshirt_sleeve_right',
      name: 'Right Sleeve',
      category: 'sleeve',
      points: slvPoints,
      edges: slvEdges,
      position: { x: 1650, y: 680 },
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

    // Neck Collar Rib & Waistband Rib
    const collarPiece: PatternPiece = {
      id: 'sweatshirt_collar_rib',
      name: 'Collar Rib Band',
      category: 'collar',
      points: [
        { id: 'sw_cr_tl', x: -220, y: 0, type: 'corner' },
        { id: 'sw_cr_tr', x: 220, y: 0, type: 'corner' },
        { id: 'sw_cr_br', x: 220, y: 55, type: 'corner' },
        { id: 'sw_cr_bl', x: -220, y: 55, type: 'corner' },
      ],
      edges: [
        { id: 'e_sw_cr_top', fromPointId: 'sw_cr_tl', toPointId: 'sw_cr_tr', type: 'line', name: 'Collar Top' },
        { id: 'e_sw_cr_r', fromPointId: 'sw_cr_tr', toPointId: 'sw_cr_br', type: 'line', name: 'Collar R' },
        { id: 'e_sw_cr_bot', fromPointId: 'sw_cr_br', toPointId: 'sw_cr_bl', type: 'line', name: 'Collar Bottom' },
        { id: 'e_sw_cr_l', fromPointId: 'sw_cr_bl', toPointId: 'sw_cr_tl', type: 'line', name: 'Collar L' },
      ],
      position: { x: 380, y: 800 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -200, y: 27 }, end: { x: 200, y: 27 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    const waistbandPiece: PatternPiece = {
      id: 'sweatshirt_waistband_rib',
      name: 'Waistband Rib Band',
      category: 'trim',
      points: [
        { id: 'sw_wb_tl', x: -halfChest * 0.88, y: 0, type: 'corner' },
        { id: 'sw_wb_tr', x: halfChest * 0.88, y: 0, type: 'corner' },
        { id: 'sw_wb_br', x: halfChest * 0.88, y: 70, type: 'corner' },
        { id: 'sw_wb_bl', x: -halfChest * 0.88, y: 70, type: 'corner' },
      ],
      edges: [
        { id: 'e_sw_wb_top', fromPointId: 'sw_wb_tl', toPointId: 'sw_wb_tr', type: 'line', name: 'Waistband Top' },
        { id: 'e_sw_wb_r', fromPointId: 'sw_wb_tr', toPointId: 'sw_wb_br', type: 'line', name: 'Waistband R' },
        { id: 'e_sw_wb_bot', fromPointId: 'sw_wb_br', toPointId: 'sw_wb_bl', type: 'line', name: 'Waistband Bottom' },
        { id: 'e_sw_wb_l', fromPointId: 'sw_wb_bl', toPointId: 'sw_wb_tl', type: 'line', name: 'Waistband L' },
      ],
      position: { x: 1040, y: 800 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -300, y: 35 }, end: { x: 300, y: 35 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    // Left & Right Sleeve Rib Cuffs
    const swCuffW = sleeveCuff * 2;
    const swCuffH = 65;
    const cuffLeftPiece: PatternPiece = {
      id: 'sweatshirt_cuff_left',
      name: 'Left Sleeve Rib Cuff',
      category: 'trim',
      points: [
        { id: 'scfl_tl', x: -swCuffW / 2, y: 0, type: 'corner' },
        { id: 'scfl_tr', x: swCuffW / 2, y: 0, type: 'corner' },
        { id: 'scfl_br', x: swCuffW / 2, y: swCuffH, type: 'corner' },
        { id: 'scfl_bl', x: -swCuffW / 2, y: swCuffH, type: 'corner' },
      ],
      edges: [
        { id: 'e_scfl_top', fromPointId: 'scfl_tl', toPointId: 'scfl_tr', type: 'line', name: 'Cuff Top' },
        { id: 'e_scfl_r', fromPointId: 'scfl_tr', toPointId: 'scfl_br', type: 'line', name: 'Cuff Join R' },
        { id: 'e_scfl_bot', fromPointId: 'scfl_br', toPointId: 'scfl_bl', type: 'line', name: 'Cuff Hem' },
        { id: 'e_scfl_l', fromPointId: 'scfl_bl', toPointId: 'scfl_tl', type: 'line', name: 'Cuff Join L' },
      ],
      position: { x: 1650, y: 560 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -swCuffW / 2 + 20, y: swCuffH / 2 }, end: { x: swCuffW / 2 - 20, y: swCuffH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    const cuffRightPiece: PatternPiece = {
      id: 'sweatshirt_cuff_right',
      name: 'Right Sleeve Rib Cuff',
      category: 'trim',
      points: [
        { id: 'scfr_tl', x: -swCuffW / 2, y: 0, type: 'corner' },
        { id: 'scfr_tr', x: swCuffW / 2, y: 0, type: 'corner' },
        { id: 'scfr_br', x: swCuffW / 2, y: swCuffH, type: 'corner' },
        { id: 'scfr_bl', x: -swCuffW / 2, y: swCuffH, type: 'corner' },
      ],
      edges: [
        { id: 'e_scfr_top', fromPointId: 'scfr_tl', toPointId: 'scfr_tr', type: 'line', name: 'Cuff Top' },
        { id: 'e_scfr_r', fromPointId: 'scfr_tr', toPointId: 'scfr_br', type: 'line', name: 'Cuff Join R' },
        { id: 'e_scfr_bot', fromPointId: 'scfr_br', toPointId: 'scfr_bl', type: 'line', name: 'Cuff Hem' },
        { id: 'e_scfr_l', fromPointId: 'scfr_bl', toPointId: 'scfr_tl', type: 'line', name: 'Cuff Join L' },
      ],
      position: { x: 1650, y: 1140 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -swCuffW / 2 + 20, y: swCuffH / 2 }, end: { x: swCuffW / 2 - 20, y: swCuffH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    // V-Stitch Collar Rib Triangle Insert
    const vInsertPiece: PatternPiece = {
      id: 'sweatshirt_v_insert',
      name: 'V-Stitch Collar Rib Insert',
      category: 'trim',
      points: [
        { id: 'v_tl', x: -35, y: 0, type: 'corner' },
        { id: 'v_tr', x: 35, y: 0, type: 'corner' },
        { id: 'v_bot', x: 0, y: 45, type: 'corner' },
      ],
      edges: [
        { id: 'e_v_top', fromPointId: 'v_tl', toPointId: 'v_tr', type: 'line', name: 'V Top Seam' },
        { id: 'e_v_r', fromPointId: 'v_tr', toPointId: 'v_bot', type: 'line', name: 'V Right' },
        { id: 'e_v_l', fromPointId: 'v_bot', toPointId: 'v_tl', type: 'line', name: 'V Left' },
      ],
      position: { x: 380, y: 720 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 8,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 5 }, end: { x: 0, y: 40 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#f59e0b',
    };

    return [
      frontPiece,
      backPiece,
      sleeveLeftPiece,
      sleeveRightPiece,
      cuffLeftPiece,
      cuffRightPiece,
      collarPiece,
      waistbandPiece,
      vInsertPiece,
    ];
  };

  return {
    ...base,
    subcategory: 'Sweatshirt',
    modelId: 'hoodie-flat',
    generatePatterns,
  };
}

/**
 * Generates an authentic Outerwear Jacket pattern with split front panels,
 * back panel, sleeves, stand/rib collar, waistband rib, and utility pocket.
 */
export function createJacketTemplate(
  id: string,
  name: string,
  fit: 'oversized' | 'boxy' | 'regular' | 'relaxed' | 'slim',
  description: string
): GarmentTemplate {
  const base = createZipUpHoodieTemplate(id, name, fit as any, description);

  const generatePatterns = (m: Record<string, number>): PatternPiece[] => {
    const pieces = base.generatePatterns(m);
    // Remove hood panels and split kangaroo pockets, replacing with jacket collar and utility pocket
    const filtered = pieces.filter(
      (p) =>
        p.id !== 'hoodie_hood_left' &&
        p.id !== 'hoodie_hood_right' &&
        p.id !== 'hoodie_pocket_left' &&
        p.id !== 'hoodie_pocket_right'
    );

    // Baseball Rib Knit Collar
    const collarW = 460;
    const collarH = 55;
    const collarPiece: PatternPiece = {
      id: 'jacket_collar_rib',
      name: 'Ribbed Baseball Collar',
      category: 'collar',
      points: [
        { id: 'jkr_tl', x: -collarW / 2, y: 0, type: 'corner' },
        { id: 'jkr_tr', x: collarW / 2, y: 0, type: 'corner' },
        { id: 'jkr_br', x: collarW / 2 - 20, y: collarH, type: 'corner' },
        { id: 'jkr_bl', x: -collarW / 2 + 20, y: collarH, type: 'corner' },
      ],
      edges: [
        { id: 'e_jkr_top', fromPointId: 'jkr_tl', toPointId: 'jkr_tr', type: 'line', name: 'Collar Outer' },
        { id: 'e_jkr_r', fromPointId: 'jkr_tr', toPointId: 'jkr_br', type: 'line', name: 'Collar End R' },
        { id: 'e_jkr_bot', fromPointId: 'jkr_br', toPointId: 'jkr_bl', type: 'line', name: 'Collar Neck Attach' },
        { id: 'e_jkr_l', fromPointId: 'jkr_bl', toPointId: 'jkr_tl', type: 'line', name: 'Collar End L' },
      ],
      position: { x: 1040, y: 760 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -200, y: 25 }, end: { x: 200, y: 25 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    // Utility Bicep Zipper Pocket
    const uW = 120;
    const uH = 150;
    const utilityPocketPiece: PatternPiece = {
      id: 'jacket_utility_pocket',
      name: 'MA-1 Sleeve Utility Pocket',
      category: 'pocket',
      points: [
        { id: 'jup_tl', x: -uW / 2, y: 0, type: 'corner' },
        { id: 'jup_tr', x: uW / 2, y: 0, type: 'corner' },
        { id: 'jup_br', x: uW / 2, y: uH, type: 'corner' },
        { id: 'jup_bl', x: -uW / 2, y: uH, type: 'corner' },
      ],
      edges: [
        { id: 'e_jup_top', fromPointId: 'jup_tl', toPointId: 'jup_tr', type: 'line', name: 'Pocket Top' },
        { id: 'e_jup_r', fromPointId: 'jup_tr', toPointId: 'jup_br', type: 'line', name: 'Pocket Side R' },
        { id: 'e_jup_bot', fromPointId: 'jup_br', toPointId: 'jup_bl', type: 'line', name: 'Pocket Bottom' },
        { id: 'e_jup_l', fromPointId: 'jup_bl', toPointId: 'jup_tl', type: 'line', name: 'Pocket Side L' },
      ],
      position: { x: 1400, y: 760 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_TWILL',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 20 }, end: { x: 0, y: uH - 20 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [
        { id: 'il_jup_pen1', points: [{ x: -20, y: 30 }, { x: -20, y: 130 }], type: 'style', name: 'Pen Slot 1' },
        { id: 'il_jup_pen2', points: [{ x: 20, y: 30 }, { x: 20, y: 130 }], type: 'style', name: 'Pen Slot 2' },
      ],
      color: '#38bdf8',
    };

    // Welt Pocket Flap Left & Right
    const weltFlapLeftPiece: PatternPiece = {
      id: 'jacket_welt_left',
      name: 'Left Welt Pocket Flap',
      category: 'trim',
      points: [
        { id: 'wfl_tl', x: -80, y: 0, type: 'corner' },
        { id: 'wfl_tr', x: 80, y: 0, type: 'corner' },
        { id: 'wfl_br', x: 80, y: 30, type: 'corner' },
        { id: 'wfl_bl', x: -80, y: 30, type: 'corner' },
      ],
      edges: [
        { id: 'e_wfl_top', fromPointId: 'wfl_tl', toPointId: 'wfl_tr', type: 'line', name: 'Flap Seam' },
        { id: 'e_wfl_r', fromPointId: 'wfl_tr', toPointId: 'wfl_br', type: 'line', name: 'Flap End R' },
        { id: 'e_wfl_bot', fromPointId: 'wfl_br', toPointId: 'wfl_bl', type: 'line', name: 'Flap Bottom' },
        { id: 'e_wfl_l', fromPointId: 'wfl_bl', toPointId: 'wfl_tl', type: 'line', name: 'Flap End L' },
      ],
      position: { x: 260, y: 780 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_TWILL',
      defaultSeamAllowance: 8,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -60, y: 15 }, end: { x: 60, y: 15 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#38bdf8',
    };

    const weltFlapRightPiece: PatternPiece = {
      id: 'jacket_welt_right',
      name: 'Right Welt Pocket Flap',
      category: 'trim',
      points: [
        { id: 'wfr_tl', x: -80, y: 0, type: 'corner' },
        { id: 'wfr_tr', x: 80, y: 0, type: 'corner' },
        { id: 'wfr_br', x: 80, y: 30, type: 'corner' },
        { id: 'wfr_bl', x: -80, y: 30, type: 'corner' },
      ],
      edges: [
        { id: 'e_wfr_top', fromPointId: 'wfr_tl', toPointId: 'wfr_tr', type: 'line', name: 'Flap Seam' },
        { id: 'e_wfr_r', fromPointId: 'wfr_tr', toPointId: 'wfr_br', type: 'line', name: 'Flap End R' },
        { id: 'e_wfr_bot', fromPointId: 'wfr_br', toPointId: 'wfr_bl', type: 'line', name: 'Flap Bottom' },
        { id: 'e_wfr_l', fromPointId: 'wfr_bl', toPointId: 'wfr_tl', type: 'line', name: 'Flap End L' },
      ],
      position: { x: 500, y: 780 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_TWILL',
      defaultSeamAllowance: 8,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -60, y: 15 }, end: { x: 60, y: 15 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#38bdf8',
    };

    return [
      ...filtered,
      collarPiece,
      utilityPocketPiece,
      weltFlapLeftPiece,
      weltFlapRightPiece,
    ];
  };

  return {
    ...base,
    category: 'outerwear',
    subcategory: 'Jacket',
    modelId: 'hoodie-body',
    generatePatterns,
  };
}
