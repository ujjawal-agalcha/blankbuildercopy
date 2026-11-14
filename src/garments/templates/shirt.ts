import { ControlPoint, Edge2D, PatternPiece } from '../../types/cad';
import { GarmentTemplate, StandardSize, SizeGradingRule } from '../../types/garment';
import { SewingRelationship } from '../../types/sewing';

/**
 * Generates an authentic Button-Up Shirt pattern with:
 * 1. Front Left Panel (with buttonholes)
 * 2. Front Right Panel (with button placket)
 * 3. Back Body Panel (with box pleat allowance)
 * 4. Back Shoulder Yoke
 * 5. Left Sleeve
 * 6. Right Sleeve
 * 7. Left Button Cuff
 * 8. Right Button Cuff
 * 9. Turn-down Collar Leaf
 * 10. Contoured Collar Stand
 * 11. Chest Patch Pocket
 */
export function createShirtTemplate(
  id: string,
  name: string,
  fit: 'regular' | 'relaxed' | 'slim' | 'oversized',
  description: string
): GarmentTemplate {
  const defaultMeasurements = {
    chestWidth: 550,
    bodyLength: 760,
    shoulderWidth: 470,
    sleeveLength: 260, // Short-sleeve / casual button-up
    sleeveOpening: 185,
    neckWidth: 175,
    neckDepthFront: 90,
    neckDepthBack: 25,
    hemWidth: 550,
    collarHeight: 45,
    standHeight: 32,
  };

  const measurementsList = [
    { id: 'chestWidth', name: 'Chest Width (Half)', description: 'Across front chest from armpit to armpit', value: defaultMeasurements.chestWidth, min: 420, max: 720, step: 5, category: 'width' as const },
    { id: 'bodyLength', name: 'Body Length', description: 'From high shoulder point to bottom curved hem', value: defaultMeasurements.bodyLength, min: 620, max: 900, step: 5, category: 'length' as const },
    { id: 'shoulderWidth', name: 'Shoulder Width', description: 'From shoulder seam to shoulder seam', value: defaultMeasurements.shoulderWidth, min: 400, max: 620, step: 5, category: 'width' as const },
    { id: 'sleeveLength', name: 'Sleeve Length', description: 'Shoulder seam to cuff hem', value: defaultMeasurements.sleeveLength, min: 180, max: 680, step: 5, category: 'sleeve' as const },
    { id: 'sleeveOpening', name: 'Sleeve Opening (Half)', description: 'Half circumference of sleeve opening', value: defaultMeasurements.sleeveOpening, min: 140, max: 260, step: 5, category: 'sleeve' as const },
    { id: 'neckWidth', name: 'Neck Width', description: 'Width of neck opening at shoulder seams', value: defaultMeasurements.neckWidth, min: 140, max: 240, step: 2, category: 'neck' as const },
  ];

  const generatePatterns = (m: Record<string, number>): PatternPiece[] => {
    const halfChest = (m.chestWidth || defaultMeasurements.chestWidth) / 2;
    const bodyLen = m.bodyLength || defaultMeasurements.bodyLength;
    const halfShoulder = (m.shoulderWidth || defaultMeasurements.shoulderWidth) / 2;
    const sleeveLen = m.sleeveLength || defaultMeasurements.sleeveLength;
    const halfSleeveOpen = m.sleeveOpening || defaultMeasurements.sleeveOpening;
    const halfNeck = (m.neckWidth || defaultMeasurements.neckWidth) / 2;
    const armholeDepth = Math.max(220, halfChest * 0.48);
    const shoulderSlope = 42;
    const yokeHeight = 90;

    // 1. FRONT LEFT PANEL (with buttonholes)
    const frontLeftPoints: ControlPoint[] = [
      { id: 'sh_fl_neck', x: 0, y: 80, type: 'smooth' },
      { id: 'sh_fl_hsp', x: -halfNeck, y: 0, type: 'corner' },
      { id: 'sh_fl_lsp', x: -halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'sh_fl_armpit', x: -halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'sh_fl_hem_out', x: -halfChest * 0.96, y: bodyLen - 30, type: 'corner' },
      { id: 'sh_fl_hem_cf', x: 0, y: bodyLen, type: 'corner' },
    ];
    const frontLeftEdges: Edge2D[] = [
      { id: 'e_shfl_neck', fromPointId: 'sh_fl_hsp', toPointId: 'sh_fl_neck', type: 'cubic-bezier', name: 'Front Neck L' },
      { id: 'e_shfl_cf', fromPointId: 'sh_fl_neck', toPointId: 'sh_fl_hem_cf', type: 'line', name: 'Center Front Placket L' },
      { id: 'e_shfl_hem', fromPointId: 'sh_fl_hem_cf', toPointId: 'sh_fl_hem_out', type: 'cubic-bezier', name: 'Curved Shirttail Hem L' },
      { id: 'e_shfl_side', fromPointId: 'sh_fl_hem_out', toPointId: 'sh_fl_armpit', type: 'line', name: 'Side Seam L' },
      { id: 'e_shfl_armhole', fromPointId: 'sh_fl_armpit', toPointId: 'sh_fl_lsp', type: 'cubic-bezier', name: 'Armhole L' },
      { id: 'e_shfl_shoulder', fromPointId: 'sh_fl_lsp', toPointId: 'sh_fl_hsp', type: 'line', name: 'Shoulder Seam L' },
    ];
    const frontLeftPiece: PatternPiece = {
      id: 'shirt_front_left',
      name: 'Shirt Front Left Panel',
      category: 'body',
      points: frontLeftPoints,
      edges: frontLeftEdges,
      position: { x: 380, y: 100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_POPLIN',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [{ id: 'n_shfl_arm', edgeId: 'e_shfl_armhole', distanceRatio: 0.5, type: 'single', depth: 4 }],
      darts: [],
      grainline: { start: { x: -halfChest * 0.4, y: 120 }, end: { x: -halfChest * 0.4, y: bodyLen - 100 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [
        { id: 'il_sh_btnhole_1', points: [{ x: 12, y: 120 }, { x: 12, y: 140 }], type: 'style', name: 'Buttonhole 1' },
        { id: 'il_sh_btnhole_2', points: [{ x: 12, y: 220 }, { x: 12, y: 240 }], type: 'style', name: 'Buttonhole 2' },
        { id: 'il_sh_btnhole_3', points: [{ x: 12, y: 320 }, { x: 12, y: 340 }], type: 'style', name: 'Buttonhole 3' },
        { id: 'il_sh_btnhole_4', points: [{ x: 12, y: 420 }, { x: 12, y: 440 }], type: 'style', name: 'Buttonhole 4' },
      ],
      color: '#38bdf8',
    };

    // 2. FRONT RIGHT PANEL (with buttons)
    const frontRightPoints: ControlPoint[] = frontLeftPoints.map((p) => ({
      ...p,
      id: p.id.replace('_fl_', '_fr_'),
      x: -p.x,
    }));
    const frontRightEdges: Edge2D[] = [
      { id: 'e_shfr_neck', fromPointId: 'sh_fr_neck', toPointId: 'sh_fr_hsp', type: 'cubic-bezier', name: 'Front Neck R' },
      { id: 'e_shfr_shoulder', fromPointId: 'sh_fr_hsp', toPointId: 'sh_fr_lsp', type: 'line', name: 'Shoulder Seam R' },
      { id: 'e_shfr_armhole', fromPointId: 'sh_fr_lsp', toPointId: 'sh_fr_armpit', type: 'cubic-bezier', name: 'Armhole R' },
      { id: 'e_shfr_side', fromPointId: 'sh_fr_armpit', toPointId: 'sh_fr_hem_out', type: 'line', name: 'Side Seam R' },
      { id: 'e_shfr_hem', fromPointId: 'sh_fr_hem_out', toPointId: 'sh_fr_hem_cf', type: 'cubic-bezier', name: 'Curved Shirttail Hem R' },
      { id: 'e_shfr_cf', fromPointId: 'sh_fr_hem_cf', toPointId: 'sh_fr_neck', type: 'line', name: 'Center Front Placket R' },
    ];
    const frontRightPiece: PatternPiece = {
      id: 'shirt_front_right',
      name: 'Shirt Front Right Panel',
      category: 'body',
      points: frontRightPoints,
      edges: frontRightEdges,
      position: { x: 740, y: 100 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_POPLIN',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [{ id: 'n_shfr_arm', edgeId: 'e_shfr_armhole', distanceRatio: 0.5, type: 'single', depth: 4 }],
      darts: [],
      grainline: { start: { x: halfChest * 0.4, y: 120 }, end: { x: halfChest * 0.4, y: bodyLen - 100 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [
        { id: 'il_sh_btn_1', points: [{ x: -12, y: 130 }, { x: -12, y: 130 }], type: 'style', name: 'Button 1' },
        { id: 'il_sh_btn_2', points: [{ x: -12, y: 230 }, { x: -12, y: 230 }], type: 'style', name: 'Button 2' },
        { id: 'il_sh_btn_3', points: [{ x: -12, y: 330 }, { x: -12, y: 330 }], type: 'style', name: 'Button 3' },
        { id: 'il_sh_btn_4', points: [{ x: -12, y: 430 }, { x: -12, y: 430 }], type: 'style', name: 'Button 4' },
      ],
      color: '#38bdf8',
    };

    // 3. BACK BODY PANEL (Attaches to Yoke)
    const backBodyLen = bodyLen - yokeHeight;
    const backPoints: ControlPoint[] = [
      { id: 'sh_b_yoke_l', x: -halfShoulder, y: 0, type: 'corner' },
      { id: 'sh_b_yoke_c', x: 0, y: 0, type: 'corner' },
      { id: 'sh_b_yoke_r', x: halfShoulder, y: 0, type: 'corner' },
      { id: 'sh_b_armpit_r', x: halfChest, y: armholeDepth - yokeHeight, type: 'smooth' },
      { id: 'sh_b_hem_r', x: halfChest * 0.96, y: backBodyLen - 30, type: 'corner' },
      { id: 'sh_b_hem_cb', x: 0, y: backBodyLen, type: 'corner' },
      { id: 'sh_b_hem_l', x: -halfChest * 0.96, y: backBodyLen - 30, type: 'corner' },
      { id: 'sh_b_armpit_l', x: -halfChest, y: armholeDepth - yokeHeight, type: 'smooth' },
    ];
    const backEdges: Edge2D[] = [
      { id: 'e_shb_yoke_r', fromPointId: 'sh_b_yoke_c', toPointId: 'sh_b_yoke_r', type: 'line', name: 'Yoke Seam R' },
      { id: 'e_shb_armhole_r', fromPointId: 'sh_b_yoke_r', toPointId: 'sh_b_armpit_r', type: 'cubic-bezier', name: 'Back Armhole R' },
      { id: 'e_shb_side_r', fromPointId: 'sh_b_armpit_r', toPointId: 'sh_b_hem_r', type: 'line', name: 'Back Side Seam R' },
      { id: 'e_shb_hem_r', fromPointId: 'sh_b_hem_r', toPointId: 'sh_b_hem_cb', type: 'cubic-bezier', name: 'Shirttail Hem Back R' },
      { id: 'e_shb_hem_l', fromPointId: 'sh_b_hem_cb', toPointId: 'sh_b_hem_l', type: 'cubic-bezier', name: 'Shirttail Hem Back L' },
      { id: 'e_shb_side_l', fromPointId: 'sh_b_hem_l', toPointId: 'sh_b_armpit_l', type: 'line', name: 'Back Side Seam L' },
      { id: 'e_shb_armhole_l', fromPointId: 'sh_b_armpit_l', toPointId: 'sh_b_yoke_l', type: 'cubic-bezier', name: 'Back Armhole L' },
      { id: 'e_shb_yoke_l', fromPointId: 'sh_b_yoke_l', toPointId: 'sh_b_yoke_c', type: 'line', name: 'Yoke Seam L' },
    ];
    const backPiece: PatternPiece = {
      id: 'shirt_back_body',
      name: 'Shirt Back Body',
      category: 'body',
      points: backPoints,
      edges: backEdges,
      position: { x: 1200, y: 190 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_POPLIN',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [{ id: 'n_shb_cb', edgeId: 'e_shb_yoke_r', distanceRatio: 0.0, type: 'single', depth: 4 }],
      darts: [],
      grainline: { start: { x: 0, y: 80 }, end: { x: 0, y: backBodyLen - 80 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [
        { id: 'il_sh_boxpleat_l', points: [{ x: -20, y: 0 }, { x: -20, y: 60 }], type: 'box-pleat', name: 'Box Pleat L' },
        { id: 'il_sh_boxpleat_r', points: [{ x: 20, y: 0 }, { x: 20, y: 60 }], type: 'box-pleat', name: 'Box Pleat R' },
      ],
      color: '#0284c7',
    };

    // 4. BACK SHOULDER YOKE
    const yokePoints: ControlPoint[] = [
      { id: 'yk_neck', x: 0, y: 22, type: 'smooth' },
      { id: 'yk_hsp_l', x: -halfNeck, y: 0, type: 'corner' },
      { id: 'yk_lsp_l', x: -halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'yk_bot_l', x: -halfShoulder, y: yokeHeight, type: 'corner' },
      { id: 'yk_bot_cb', x: 0, y: yokeHeight, type: 'corner' },
      { id: 'yk_bot_r', x: halfShoulder, y: yokeHeight, type: 'corner' },
      { id: 'yk_lsp_r', x: halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'yk_hsp_r', x: halfNeck, y: 0, type: 'corner' },
    ];
    const yokeEdges: Edge2D[] = [
      { id: 'e_yk_neck_r', fromPointId: 'yk_hsp_r', toPointId: 'yk_neck', type: 'cubic-bezier', name: 'Back Collar Neck R' },
      { id: 'e_yk_neck_l', fromPointId: 'yk_neck', toPointId: 'yk_hsp_l', type: 'cubic-bezier', name: 'Back Collar Neck L' },
      { id: 'e_yk_shoulder_l', fromPointId: 'yk_hsp_l', toPointId: 'yk_lsp_l', type: 'line', name: 'Shoulder L' },
      { id: 'e_yk_arm_l', fromPointId: 'yk_lsp_l', toPointId: 'yk_bot_l', type: 'line', name: 'Armhole Top L' },
      { id: 'e_yk_bot_l', fromPointId: 'yk_bot_l', toPointId: 'yk_bot_cb', type: 'line', name: 'Yoke Attach L' },
      { id: 'e_yk_bot_r', fromPointId: 'yk_bot_cb', toPointId: 'yk_bot_r', type: 'line', name: 'Yoke Attach R' },
      { id: 'e_yk_arm_r', fromPointId: 'yk_bot_r', toPointId: 'yk_lsp_r', type: 'line', name: 'Armhole Top R' },
      { id: 'e_yk_shoulder_r', fromPointId: 'yk_lsp_r', toPointId: 'yk_hsp_r', type: 'line', name: 'Shoulder R' },
    ];
    const yokePiece: PatternPiece = {
      id: 'shirt_back_yoke',
      name: 'Shirt Back Yoke',
      category: 'body',
      points: yokePoints,
      edges: yokeEdges,
      position: { x: 1200, y: 80 },
      rotation: 0,
      mirror: false,
      cutQuantity: 2, // Double yoke construction
      fabricCode: 'FAB_COTTON_POPLIN',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [{ id: 'n_yk_cb', edgeId: 'e_yk_bot_r', distanceRatio: 0.0, type: 'single', depth: 4 }],
      darts: [],
      grainline: { start: { x: -halfShoulder + 40, y: yokeHeight / 2 }, end: { x: halfShoulder - 40, y: yokeHeight / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#0369a1',
    };

    // 5. LEFT SLEEVE & 6. RIGHT SLEEVE
    const sleeveBicep = armholeDepth * 0.95;
    const sleeveCapH = 135;
    const slvPoints: ControlPoint[] = [
      { id: 'shs_top', x: 0, y: 0, type: 'smooth' },
      { id: 'shs_under_r', x: sleeveBicep, y: sleeveCapH, type: 'corner' },
      { id: 'shs_cuff_r', x: halfSleeveOpen, y: sleeveLen, type: 'corner' },
      { id: 'shs_cuff_l', x: -halfSleeveOpen, y: sleeveLen, type: 'corner' },
      { id: 'shs_under_l', x: -sleeveBicep, y: sleeveCapH, type: 'corner' },
    ];
    const slvEdges: Edge2D[] = [
      { id: 'e_shs_cap_r', fromPointId: 'shs_top', toPointId: 'shs_under_r', type: 'cubic-bezier', name: 'Sleeve Cap Front' },
      { id: 'e_shs_inseam_r', fromPointId: 'shs_under_r', toPointId: 'shs_cuff_r', type: 'line', name: 'Inseam Front' },
      { id: 'e_shs_hem', fromPointId: 'shs_cuff_r', toPointId: 'shs_cuff_l', type: 'line', name: 'Sleeve Cuff Edge' },
      { id: 'e_shs_inseam_l', fromPointId: 'shs_cuff_l', toPointId: 'shs_under_l', type: 'line', name: 'Inseam Back' },
      { id: 'e_shs_cap_l', fromPointId: 'shs_under_l', toPointId: 'shs_top', type: 'cubic-bezier', name: 'Sleeve Cap Back' },
    ];
    const sleeveLeftPiece: PatternPiece = {
      id: 'shirt_sleeve_left',
      name: 'Left Sleeve',
      category: 'sleeve',
      points: slvPoints,
      edges: slvEdges,
      position: { x: 1720, y: 100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_POPLIN',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [{ id: 'n_shs_cap', edgeId: 'e_shs_cap_r', distanceRatio: 0.0, type: 'single', depth: 4 }],
      darts: [],
      grainline: { start: { x: 0, y: 30 }, end: { x: 0, y: sleeveLen - 30 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#10b981',
    };
    const sleeveRightPiece: PatternPiece = {
      id: 'shirt_sleeve_right',
      name: 'Right Sleeve',
      category: 'sleeve',
      points: slvPoints,
      edges: slvEdges,
      position: { x: 1720, y: 560 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_POPLIN',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [{ id: 'n_shsr_cap', edgeId: 'e_shs_cap_r', distanceRatio: 0.0, type: 'single', depth: 4 }],
      darts: [],
      grainline: { start: { x: 0, y: 30 }, end: { x: 0, y: sleeveLen - 30 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#10b981',
    };

    // 7. LEFT CUFF & 8. RIGHT CUFF
    const cuffW = halfSleeveOpen * 2;
    const cuffH = 60;
    const cuffLeftPiece: PatternPiece = {
      id: 'shirt_cuff_left',
      name: 'Left Button Cuff',
      category: 'trim',
      points: [
        { id: 'shcl_tl', x: -cuffW / 2, y: 0, type: 'corner' },
        { id: 'shcl_tr', x: cuffW / 2, y: 0, type: 'corner' },
        { id: 'shcl_br', x: cuffW / 2, y: cuffH, type: 'corner' },
        { id: 'shcl_bl', x: -cuffW / 2, y: cuffH, type: 'corner' },
      ],
      edges: [
        { id: 'e_shcl_top', fromPointId: 'shcl_tl', toPointId: 'shcl_tr', type: 'line', name: 'Cuff Attach' },
        { id: 'e_shcl_r', fromPointId: 'shcl_tr', toPointId: 'shcl_br', type: 'line', name: 'Cuff End R' },
        { id: 'e_shcl_bot', fromPointId: 'shcl_br', toPointId: 'shcl_bl', type: 'line', name: 'Cuff Edge' },
        { id: 'e_shcl_l', fromPointId: 'shcl_bl', toPointId: 'shcl_tl', type: 'line', name: 'Cuff End L' },
      ],
      position: { x: 1720, y: 420 },
      rotation: 0,
      mirror: false,
      cutQuantity: 2,
      fabricCode: 'FAB_COTTON_POPLIN',
      defaultSeamAllowance: 8,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -cuffW / 2 + 20, y: cuffH / 2 }, end: { x: cuffW / 2 - 20, y: cuffH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };
    const cuffRightPiece: PatternPiece = {
      id: 'shirt_cuff_right',
      name: 'Right Button Cuff',
      category: 'trim',
      points: [
        { id: 'shcr_tl', x: -cuffW / 2, y: 0, type: 'corner' },
        { id: 'shcr_tr', x: cuffW / 2, y: 0, type: 'corner' },
        { id: 'shcr_br', x: cuffW / 2, y: cuffH, type: 'corner' },
        { id: 'shcr_bl', x: -cuffW / 2, y: cuffH, type: 'corner' },
      ],
      edges: [
        { id: 'e_shcr_top', fromPointId: 'shcr_tl', toPointId: 'shcr_tr', type: 'line', name: 'Cuff Attach' },
        { id: 'e_shcr_r', fromPointId: 'shcr_tr', toPointId: 'shcr_br', type: 'line', name: 'Cuff End R' },
        { id: 'e_shcr_bot', fromPointId: 'shcr_br', toPointId: 'shcr_bl', type: 'line', name: 'Cuff Edge' },
        { id: 'e_shcr_l', fromPointId: 'shcr_bl', toPointId: 'shcr_tl', type: 'line', name: 'Cuff End L' },
      ],
      position: { x: 1720, y: 880 },
      rotation: 0,
      mirror: true,
      cutQuantity: 2,
      fabricCode: 'FAB_COTTON_POPLIN',
      defaultSeamAllowance: 8,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -cuffW / 2 + 20, y: cuffH / 2 }, end: { x: cuffW / 2 - 20, y: cuffH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    // 9. COLLAR LEAF & 10. COLLAR STAND
    const collarLen = halfNeck * 2 * 1.08;
    const collarH = defaultMeasurements.collarHeight;
    const standH = defaultMeasurements.standHeight;

    const collarLeafPiece: PatternPiece = {
      id: 'shirt_collar_leaf',
      name: 'Turn-Down Shirt Collar Leaf',
      category: 'collar',
      points: [
        { id: 'col_tl', x: -collarLen / 2 - 25, y: collarH, type: 'corner' },
        { id: 'col_top', x: 0, y: collarH + 5, type: 'smooth' },
        { id: 'col_tr', x: collarLen / 2 + 25, y: collarH, type: 'corner' },
        { id: 'col_br', x: collarLen / 2, y: 0, type: 'corner' },
        { id: 'col_bl', x: -collarLen / 2, y: 0, type: 'corner' },
      ],
      edges: [
        { id: 'e_col_r', fromPointId: 'col_tr', toPointId: 'col_br', type: 'line', name: 'Collar Point R' },
        { id: 'e_col_bot', fromPointId: 'col_br', toPointId: 'col_bl', type: 'line', name: 'Stand Join Seam' },
        { id: 'e_col_l', fromPointId: 'col_bl', toPointId: 'col_tl', type: 'line', name: 'Collar Point L' },
        { id: 'e_col_top', fromPointId: 'col_tl', toPointId: 'col_tr', type: 'cubic-bezier', name: 'Collar Roll Outer Edge' },
      ],
      position: { x: 560, y: 880 },
      rotation: 0,
      mirror: false,
      cutQuantity: 2,
      fabricCode: 'FAB_COTTON_POPLIN',
      defaultSeamAllowance: 8,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -collarLen / 2 + 30, y: collarH / 2 }, end: { x: collarLen / 2 - 30, y: collarH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#e2e8f0',
    };

    const collarStandPiece: PatternPiece = {
      id: 'shirt_collar_stand',
      name: 'Contoured Collar Stand',
      category: 'collar',
      points: [
        { id: 'st_tl', x: -collarLen / 2 - 15, y: standH, type: 'corner' },
        { id: 'st_tr', x: collarLen / 2 + 15, y: standH, type: 'corner' },
        { id: 'st_br', x: collarLen / 2, y: 0, type: 'corner' },
        { id: 'st_bl', x: -collarLen / 2, y: 0, type: 'corner' },
      ],
      edges: [
        { id: 'e_st_top', fromPointId: 'st_tl', toPointId: 'st_tr', type: 'line', name: 'Collar Leaf Attach' },
        { id: 'e_st_r', fromPointId: 'st_tr', toPointId: 'st_br', type: 'cubic-bezier', name: 'Stand Tab Curve R' },
        { id: 'e_st_bot', fromPointId: 'st_br', toPointId: 'st_bl', type: 'cubic-bezier', name: 'Shirt Neckline Attach' },
        { id: 'e_st_l', fromPointId: 'st_bl', toPointId: 'st_tl', type: 'cubic-bezier', name: 'Stand Tab Curve L' },
      ],
      position: { x: 560, y: 970 },
      rotation: 0,
      mirror: false,
      cutQuantity: 2,
      fabricCode: 'FAB_COTTON_POPLIN',
      defaultSeamAllowance: 8,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -collarLen / 2 + 30, y: standH / 2 }, end: { x: collarLen / 2 - 30, y: standH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#e2e8f0',
    };

    // 11. CHEST PATCH POCKET
    const pW = 125;
    const pH = 145;
    const pocketPiece: PatternPiece = {
      id: 'shirt_chest_pocket',
      name: 'Left Chest Patch Pocket',
      category: 'pocket',
      points: [
        { id: 'sh_p_tl', x: -pW / 2, y: 0, type: 'corner' },
        { id: 'sh_p_tr', x: pW / 2, y: 0, type: 'corner' },
        { id: 'sh_p_mr', x: pW / 2, y: pH - 25, type: 'corner' },
        { id: 'sh_p_bot', x: 0, y: pH, type: 'corner' },
        { id: 'sh_p_ml', x: -pW / 2, y: pH - 25, type: 'corner' },
      ],
      edges: [
        { id: 'e_shp_top', fromPointId: 'sh_p_tl', toPointId: 'sh_p_tr', type: 'line', name: 'Pocket Hem Opening' },
        { id: 'e_shp_r', fromPointId: 'sh_p_tr', toPointId: 'sh_p_mr', type: 'line', name: 'Pocket Side R' },
        { id: 'e_shp_bot_r', fromPointId: 'sh_p_mr', toPointId: 'sh_p_bot', type: 'line', name: 'Pocket Point R' },
        { id: 'e_shp_bot_l', fromPointId: 'sh_p_bot', toPointId: 'sh_p_ml', type: 'line', name: 'Pocket Point L' },
        { id: 'e_shp_l', fromPointId: 'sh_p_ml', toPointId: 'sh_p_tl', type: 'line', name: 'Pocket Side L' },
      ],
      position: { x: 380, y: 780 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_POPLIN',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 20 }, end: { x: 0, y: pH - 20 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#38bdf8',
    };

    return [
      frontLeftPiece,
      frontRightPiece,
      backPiece,
      yokePiece,
      sleeveLeftPiece,
      sleeveRightPiece,
      cuffLeftPiece,
      cuffRightPiece,
      collarLeafPiece,
      collarStandPiece,
      pocketPiece,
    ];
  };

  const defaultSewing: SewingRelationship[] = [
    { id: 'sew_sh_cf', name: 'Front Placket Button Join', pieceAId: 'shirt_front_left', edgeAId: 'e_shfl_cf', pieceBId: 'shirt_front_right', edgeBId: 'e_shfr_cf', seamType: 'plain', flipped: false, enabled: true },
    { id: 'sew_sh_yoke_l', name: 'Yoke to Back Left', pieceAId: 'shirt_back_yoke', edgeAId: 'e_yk_bot_l', pieceBId: 'shirt_back_body', edgeBId: 'e_shb_yoke_l', seamType: 'plain', flipped: false, enabled: true },
    { id: 'sew_sh_yoke_r', name: 'Yoke to Back Right', pieceAId: 'shirt_back_yoke', edgeAId: 'e_yk_bot_r', pieceBId: 'shirt_back_body', edgeBId: 'e_shb_yoke_r', seamType: 'plain', flipped: false, enabled: true },
    { id: 'sew_sh_sh_l', name: 'Shoulder Left to Yoke', pieceAId: 'shirt_front_left', edgeAId: 'e_shfl_shoulder', pieceBId: 'shirt_back_yoke', edgeBId: 'e_yk_shoulder_l', seamType: 'plain', flipped: false, enabled: true },
    { id: 'sew_sh_sh_r', name: 'Shoulder Right to Yoke', pieceAId: 'shirt_front_right', edgeAId: 'e_shfr_shoulder', pieceBId: 'shirt_back_yoke', edgeBId: 'e_yk_shoulder_r', seamType: 'plain', flipped: false, enabled: true },
  ];

  const gradingRules: SizeGradingRule[] = [
    { size: 'XS' as StandardSize, measurementDeltas: { chestWidth: -50, bodyLength: -30, shoulderWidth: -25, sleeveLength: -15 } },
    { size: 'S' as StandardSize, measurementDeltas: { chestWidth: -25, bodyLength: -15, shoulderWidth: -12, sleeveLength: -8 } },
    { size: 'M' as StandardSize, measurementDeltas: {} },
    { size: 'L' as StandardSize, measurementDeltas: { chestWidth: 35, bodyLength: 15, shoulderWidth: 15, sleeveLength: 10 } },
    { size: 'XL' as StandardSize, measurementDeltas: { chestWidth: 70, bodyLength: 30, shoulderWidth: 28, sleeveLength: 18 } },
    { size: 'XXL' as StandardSize, measurementDeltas: { chestWidth: 105, bodyLength: 45, shoulderWidth: 42, sleeveLength: 25 } },
  ];

  return {
    id,
    name,
    category: 'tops',
    subcategory: 'Casual Shirt',
    fit,
    description,
    thumbnail: '/thumbnails/tshirt.svg',
    baseSize: 'M',
    measurements: measurementsList,
    gradingRules,
    defaultFabricCode: 'FAB_COTTON_POPLIN',
    modelId: 'shirt-short-sleeve',
    generatePatterns,
    defaultSewing,
  };
}

