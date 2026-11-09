import { ControlPoint, Edge2D, Grainline, PatternPiece } from '../../types/cad';
import { GarmentTemplate, StandardSize, SizeGradingRule } from '../../types/garment';
import { SewingRelationship } from '../../types/sewing';

export function createTShirtTemplate(
  id: string,
  name: string,
  fit: 'regular' | 'oversized' | 'boxy' | 'drop-shoulder' | 'cropped' | 'slim',
  description: string,
  defaultMeasurements: {
    chestWidth: number;
    bodyLength: number;
    shoulderWidth: number;
    sleeveLength: number;
    sleeveOpening: number;
    neckWidth: number;
    neckDepthFront: number;
    neckDepthBack: number;
    hemWidth: number;
    collarHeight: number;
  }
): GarmentTemplate {
  const measurementsList = [
    { id: 'chestWidth', name: 'Chest Width (Half)', description: 'Across front chest from armpit to armpit', value: defaultMeasurements.chestWidth, min: 380, max: 750, step: 5, category: 'width' as const },
    { id: 'bodyLength', name: 'Body Length', description: 'From high shoulder point to bottom hem', value: defaultMeasurements.bodyLength, min: 450, max: 900, step: 5, category: 'length' as const },
    { id: 'shoulderWidth', name: 'Shoulder Width', description: 'From shoulder point to shoulder point', value: defaultMeasurements.shoulderWidth, min: 380, max: 680, step: 5, category: 'width' as const },
    { id: 'sleeveLength', name: 'Sleeve Length', description: 'From shoulder seam to sleeve cuff', value: defaultMeasurements.sleeveLength, min: 140, max: 680, step: 5, category: 'sleeve' as const },
    { id: 'sleeveOpening', name: 'Sleeve Opening (Half)', description: 'Half circumference of sleeve cuff', value: defaultMeasurements.sleeveOpening, min: 120, max: 280, step: 5, category: 'sleeve' as const },
    { id: 'neckWidth', name: 'Neck Width', description: 'Width of neck opening at shoulder seams', value: defaultMeasurements.neckWidth, min: 140, max: 260, step: 2, category: 'neck' as const },
    { id: 'neckDepthFront', name: 'Front Neck Depth', description: 'Depth from shoulder line to center front neckline', value: defaultMeasurements.neckDepthFront, min: 50, max: 140, step: 2, category: 'neck' as const },
    { id: 'neckDepthBack', name: 'Back Neck Depth', description: 'Depth from shoulder line to center back neckline', value: defaultMeasurements.neckDepthBack, min: 15, max: 45, step: 1, category: 'neck' as const },
    { id: 'hemWidth', name: 'Bottom Hem Width', description: 'Across bottom sweep', value: defaultMeasurements.hemWidth, min: 380, max: 760, step: 5, category: 'width' as const },
    { id: 'collarHeight', name: 'Rib Collar Height', description: 'Width of neck rib band', value: defaultMeasurements.collarHeight, min: 15, max: 40, step: 1, category: 'neck' as const },
  ];

  const generatePatterns = (m: Record<string, number>): PatternPiece[] => {
    const halfChest = m.chestWidth || defaultMeasurements.chestWidth;
    const length = m.bodyLength || defaultMeasurements.bodyLength;
    const halfShoulder = (m.shoulderWidth || defaultMeasurements.shoulderWidth) / 2;
    const sleeveLen = m.sleeveLength || defaultMeasurements.sleeveLength;
    const halfSleeveOpen = m.sleeveOpening || defaultMeasurements.sleeveOpening;
    const halfNeck = (m.neckWidth || defaultMeasurements.neckWidth) / 2;
    const neckFront = m.neckDepthFront || defaultMeasurements.neckDepthFront;
    const neckBack = m.neckDepthBack || defaultMeasurements.neckDepthBack;
    const halfHem = (m.hemWidth || defaultMeasurements.hemWidth) / 2;
    const collarH = m.collarHeight || defaultMeasurements.collarHeight;

    const shoulderSlope = 42; // mm drop
    const armholeDepth = Math.max(200, halfChest * 0.42);

    // ==========================================
    // 1. FRONT BODY (Centered on 2D table at X: 150, Y: 100)
    // ==========================================
    const frontPoints: ControlPoint[] = [
      // 0: Center front neck
      { id: 'fn_cf', x: 0, y: neckFront, type: 'smooth' },
      // 1: High shoulder point (HSP) Left
      { id: 'fn_hsp_l', x: -halfNeck, y: 0, type: 'corner' },
      // 2: Low shoulder point Left
      { id: 'fn_lsp_l', x: -halfShoulder, y: shoulderSlope, type: 'corner' },
      // 3: Armpit Left
      { id: 'fn_armpit_l', x: -halfChest / 2, y: armholeDepth, type: 'smooth' },
      // 4: Bottom Hem Left
      { id: 'fn_hem_l', x: -halfHem, y: length, type: 'corner' },
      // 5: Center Front Hem
      { id: 'fn_hem_cf', x: 0, y: length, type: 'corner' },
      // 6: Bottom Hem Right
      { id: 'fn_hem_r', x: halfHem, y: length, type: 'corner' },
      // 7: Armpit Right
      { id: 'fn_armpit_r', x: halfChest / 2, y: armholeDepth, type: 'smooth' },
      // 8: Low shoulder point Right
      { id: 'fn_lsp_r', x: halfShoulder, y: shoulderSlope, type: 'corner' },
      // 9: High shoulder point Right
      { id: 'fn_hsp_r', x: halfNeck, y: 0, type: 'corner' },
    ];

    const frontEdges: Edge2D[] = [
      // HSP_R -> CF Neck (Cubic Bezier)
      {
        id: 'e_f_neck_r',
        fromPointId: 'fn_hsp_r',
        toPointId: 'fn_cf',
        type: 'cubic-bezier',
        name: 'Front Neckline R',
        controlPoints: [
          { x: halfNeck * 0.6, y: neckFront * 0.4 },
          { x: halfNeck * 0.2, y: neckFront * 0.95 },
        ],
      },
      // CF Neck -> HSP_L (Cubic Bezier)
      {
        id: 'e_f_neck_l',
        fromPointId: 'fn_cf',
        toPointId: 'fn_hsp_l',
        type: 'cubic-bezier',
        name: 'Front Neckline L',
        controlPoints: [
          { x: -halfNeck * 0.2, y: neckFront * 0.95 },
          { x: -halfNeck * 0.6, y: neckFront * 0.4 },
        ],
      },
      // HSP_L -> LSP_L (Shoulder Seam Left)
      { id: 'e_f_shoulder_l', fromPointId: 'fn_hsp_l', toPointId: 'fn_lsp_l', type: 'line', name: 'Shoulder Seam L' },
      // LSP_L -> Armpit_L (Armhole curve Left)
      {
        id: 'e_f_armhole_l',
        fromPointId: 'fn_lsp_l',
        toPointId: 'fn_armpit_l',
        type: 'cubic-bezier',
        name: 'Armhole L',
        controlPoints: [
          { x: -halfShoulder + 10, y: shoulderSlope + (armholeDepth - shoulderSlope) * 0.5 },
          { x: -halfChest / 2 + 15, y: armholeDepth - 15 },
        ],
      },
      // Armpit_L -> Hem_L (Side Seam Left)
      { id: 'e_f_side_l', fromPointId: 'fn_armpit_l', toPointId: 'fn_hem_l', type: 'line', name: 'Side Seam L' },
      // Hem_L -> Hem_CF
      { id: 'e_f_hem_l', fromPointId: 'fn_hem_l', toPointId: 'fn_hem_cf', type: 'line', name: 'Front Hem L' },
      // Hem_CF -> Hem_R
      { id: 'e_f_hem_r', fromPointId: 'fn_hem_cf', toPointId: 'fn_hem_r', type: 'line', name: 'Front Hem R' },
      // Hem_R -> Armpit_R (Side Seam Right)
      { id: 'e_f_side_r', fromPointId: 'fn_hem_r', toPointId: 'fn_armpit_r', type: 'line', name: 'Side Seam R' },
      // Armpit_R -> LSP_R (Armhole curve Right)
      {
        id: 'e_f_armhole_r',
        fromPointId: 'fn_armpit_r',
        toPointId: 'fn_lsp_r',
        type: 'cubic-bezier',
        name: 'Armhole R',
        controlPoints: [
          { x: halfChest / 2 - 15, y: armholeDepth - 15 },
          { x: halfShoulder - 10, y: shoulderSlope + (armholeDepth - shoulderSlope) * 0.5 },
        ],
      },
      // LSP_R -> HSP_R (Shoulder Seam Right)
      { id: 'e_f_shoulder_r', fromPointId: 'fn_lsp_r', toPointId: 'fn_hsp_r', type: 'line', name: 'Shoulder Seam R' },
    ];

    const frontGrain: Grainline = {
      start: { x: 0, y: 150 },
      end: { x: 0, y: length - 100 },
      hasArrowBothEnds: true,
      angle: 90,
    };

    const frontPiece: PatternPiece = {
      id: 'piece_front_body',
      name: 'Front Body',
      category: 'body',
      points: frontPoints,
      edges: frontEdges,
      position: { x: 420, y: 100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_JERSEY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [
        { id: 'n_f_arm_l', edgeId: 'e_f_armhole_l', distanceRatio: 0.5, type: 'single', depth: 5 },
        { id: 'n_f_arm_r', edgeId: 'e_f_armhole_r', distanceRatio: 0.5, type: 'single', depth: 5 },
      ],
      darts: [],
      grainline: frontGrain,
      internalLines: [],
      color: '#3b82f6',
    };

    // ==========================================
    // 2. BACK BODY (Placed next to Front at X: 950)
    // ==========================================
    const backPoints: ControlPoint[] = [
      { id: 'bn_cb', x: 0, y: neckBack, type: 'smooth' },
      { id: 'bn_hsp_l', x: -halfNeck, y: 0, type: 'corner' },
      { id: 'bn_lsp_l', x: -halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'bn_armpit_l', x: -halfChest / 2, y: armholeDepth, type: 'smooth' },
      { id: 'bn_hem_l', x: -halfHem, y: length, type: 'corner' },
      { id: 'bn_hem_cb', x: 0, y: length, type: 'corner' },
      { id: 'bn_hem_r', x: halfHem, y: length, type: 'corner' },
      { id: 'bn_armpit_r', x: halfChest / 2, y: armholeDepth, type: 'smooth' },
      { id: 'bn_lsp_r', x: halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'bn_hsp_r', x: halfNeck, y: 0, type: 'corner' },
    ];

    const backEdges: Edge2D[] = [
      {
        id: 'e_b_neck_r',
        fromPointId: 'bn_hsp_r',
        toPointId: 'bn_cb',
        type: 'cubic-bezier',
        name: 'Back Neckline R',
        controlPoints: [
          { x: halfNeck * 0.5, y: neckBack * 0.8 },
          { x: halfNeck * 0.2, y: neckBack },
        ],
      },
      {
        id: 'e_b_neck_l',
        fromPointId: 'bn_cb',
        toPointId: 'bn_hsp_l',
        type: 'cubic-bezier',
        name: 'Back Neckline L',
        controlPoints: [
          { x: -halfNeck * 0.2, y: neckBack },
          { x: -halfNeck * 0.5, y: neckBack * 0.8 },
        ],
      },
      { id: 'e_b_shoulder_l', fromPointId: 'bn_hsp_l', toPointId: 'bn_lsp_l', type: 'line', name: 'Back Shoulder L' },
      {
        id: 'e_b_armhole_l',
        fromPointId: 'bn_lsp_l',
        toPointId: 'bn_armpit_l',
        type: 'cubic-bezier',
        name: 'Back Armhole L',
        controlPoints: [
          { x: -halfShoulder + 12, y: shoulderSlope + (armholeDepth - shoulderSlope) * 0.4 },
          { x: -halfChest / 2 + 10, y: armholeDepth - 10 },
        ],
      },
      { id: 'e_b_side_l', fromPointId: 'bn_armpit_l', toPointId: 'bn_hem_l', type: 'line', name: 'Back Side Seam L' },
      { id: 'e_b_hem_l', fromPointId: 'bn_hem_l', toPointId: 'bn_hem_cb', type: 'line', name: 'Back Hem L' },
      { id: 'e_b_hem_r', fromPointId: 'bn_hem_cb', toPointId: 'bn_hem_r', type: 'line', name: 'Back Hem R' },
      { id: 'e_b_side_r', fromPointId: 'bn_hem_r', toPointId: 'bn_armpit_r', type: 'line', name: 'Back Side Seam R' },
      {
        id: 'e_b_armhole_r',
        fromPointId: 'bn_armpit_r',
        toPointId: 'bn_lsp_r',
        type: 'cubic-bezier',
        name: 'Back Armhole R',
        controlPoints: [
          { x: halfChest / 2 - 10, y: armholeDepth - 10 },
          { x: halfShoulder - 12, y: shoulderSlope + (armholeDepth - shoulderSlope) * 0.4 },
        ],
      },
      { id: 'e_b_shoulder_r', fromPointId: 'bn_lsp_r', toPointId: 'bn_hsp_r', type: 'line', name: 'Back Shoulder R' },
    ];

    const backPiece: PatternPiece = {
      id: 'piece_back_body',
      name: 'Back Body',
      category: 'body',
      points: backPoints,
      edges: backEdges,
      position: { x: 1000, y: 100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_JERSEY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [
        { id: 'n_b_arm_l', edgeId: 'e_b_armhole_l', distanceRatio: 0.5, type: 'double', depth: 5 },
        { id: 'n_b_arm_r', edgeId: 'e_b_armhole_r', distanceRatio: 0.5, type: 'double', depth: 5 },
      ],
      darts: [],
      grainline: { start: { x: 0, y: 150 }, end: { x: 0, y: length - 100 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#06b6d4',
    };

    // ==========================================
    // 3. SLEEVE (Symmetrical sleeve piece, cut 2)
    // ==========================================
    const sleeveCapHeight = 120;
    const sleeveBicep = armholeDepth * 0.95;

    const sleevePoints: ControlPoint[] = [
      // 0: Sleeve Cap Top
      { id: 'sl_top', x: 0, y: 0, type: 'smooth' },
      // 1: Cap Right Underarm
      { id: 'sl_under_r', x: sleeveBicep, y: sleeveCapHeight, type: 'corner' },
      // 2: Cuff Right
      { id: 'sl_cuff_r', x: halfSleeveOpen, y: sleeveLen, type: 'corner' },
      // 3: Cuff Center
      { id: 'sl_cuff_center', x: 0, y: sleeveLen, type: 'smooth' },
      // 4: Cuff Left
      { id: 'sl_cuff_l', x: -halfSleeveOpen, y: sleeveLen, type: 'corner' },
      // 5: Cap Left Underarm
      { id: 'sl_under_l', x: -sleeveBicep, y: sleeveCapHeight, type: 'corner' },
    ];

    const sleeveEdges: Edge2D[] = [
      // Top -> Underarm R (S-curve for sleeve cap)
      {
        id: 'e_sl_cap_r',
        fromPointId: 'sl_top',
        toPointId: 'sl_under_r',
        type: 'cubic-bezier',
        name: 'Sleeve Cap R',
        controlPoints: [
          { x: sleeveBicep * 0.45, y: sleeveCapHeight * 0.05 },
          { x: sleeveBicep * 0.75, y: sleeveCapHeight * 0.8 },
        ],
      },
      // Underarm R -> Cuff R (Inseam Right)
      { id: 'e_sl_inseam_r', fromPointId: 'sl_under_r', toPointId: 'sl_cuff_r', type: 'line', name: 'Sleeve Inseam R' },
      // Cuff R -> Cuff Center
      { id: 'e_sl_hem_r', fromPointId: 'sl_cuff_r', toPointId: 'sl_cuff_center', type: 'line', name: 'Sleeve Hem R' },
      // Cuff Center -> Cuff L
      { id: 'e_sl_hem_l', fromPointId: 'sl_cuff_center', toPointId: 'sl_cuff_l', type: 'line', name: 'Sleeve Hem L' },
      // Cuff L -> Underarm L (Inseam Left)
      { id: 'e_sl_inseam_l', fromPointId: 'sl_cuff_l', toPointId: 'sl_under_l', type: 'line', name: 'Sleeve Inseam L' },
      // Underarm L -> Top (S-curve for sleeve cap)
      {
        id: 'e_sl_cap_l',
        fromPointId: 'sl_under_l',
        toPointId: 'sl_top',
        type: 'cubic-bezier',
        name: 'Sleeve Cap L',
        controlPoints: [
          { x: -sleeveBicep * 0.75, y: sleeveCapHeight * 0.8 },
          { x: -sleeveBicep * 0.45, y: sleeveCapHeight * 0.05 },
        ],
      },
    ];

    const sleevePiece: PatternPiece = {
      id: 'piece_sleeve',
      name: 'Sleeve (Pair)',
      category: 'sleeve',
      points: sleevePoints,
      edges: sleeveEdges,
      position: { x: 1550, y: 150 },
      rotation: 0,
      mirror: true,
      cutQuantity: 2,
      fabricCode: 'FAB_COTTON_JERSEY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [
        { id: 'n_sl_cap_center', edgeId: 'e_sl_cap_r', distanceRatio: 0.0, type: 'single', depth: 4 },
        { id: 'n_sl_back_double', edgeId: 'e_sl_cap_l', distanceRatio: 0.5, type: 'double', depth: 4 },
      ],
      darts: [],
      grainline: { start: { x: 0, y: 40 }, end: { x: 0, y: sleeveLen - 40 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#10b981',
    };

    // ==========================================
    // 4. NECK RIB (Rib Knit Band)
    // ==========================================
    const neckCircumference = (halfNeck * 2 * Math.PI * 0.65) * 0.85; // 85% stretch ratio
    const ribWidth = neckCircumference / 2;
    const ribPoints: ControlPoint[] = [
      { id: 'rp_tl', x: -ribWidth, y: 0, type: 'corner' },
      { id: 'rp_tr', x: ribWidth, y: 0, type: 'corner' },
      { id: 'rp_br', x: ribWidth, y: collarH * 2, type: 'corner' }, // Folded in half
      { id: 'rp_bl', x: -ribWidth, y: collarH * 2, type: 'corner' },
    ];

    const ribEdges: Edge2D[] = [
      { id: 'e_rib_top', fromPointId: 'rp_tl', toPointId: 'rp_tr', type: 'line', name: 'Neckband Outer' },
      { id: 'e_rib_right', fromPointId: 'rp_tr', toPointId: 'rp_br', type: 'line', name: 'Neckband Join' },
      { id: 'e_rib_bottom', fromPointId: 'rp_br', toPointId: 'rp_bl', type: 'line', name: 'Neckband Sew Edge' },
      { id: 'e_rib_left', fromPointId: 'rp_bl', toPointId: 'rp_tl', type: 'line', name: 'Neckband Join' },
    ];

    const collarPiece: PatternPiece = {
      id: 'piece_neck_rib',
      name: 'Neck Rib Band',
      category: 'collar',
      points: ribPoints,
      edges: ribEdges,
      position: { x: 700, y: 880 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -ribWidth + 20, y: collarH }, end: { x: ribWidth - 20, y: collarH }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [
        { id: 'il_rib_fold', points: [{ x: -ribWidth, y: collarH }, { x: ribWidth, y: collarH }], type: 'fold', name: 'Fold Line' },
      ],
      color: '#f59e0b',
    };

    return [frontPiece, backPiece, sleevePiece, collarPiece];
  };

  const defaultSewing: SewingRelationship[] = [
    {
      id: 'sew_shoulder_l',
      name: 'Shoulder Left',
      pieceAId: 'piece_front_body',
      edgeAId: 'e_f_shoulder_l',
      pieceBId: 'piece_back_body',
      edgeBId: 'e_b_shoulder_l',
      seamType: 'plain',
      flipped: false,
      enabled: true,
    },
    {
      id: 'sew_shoulder_r',
      name: 'Shoulder Right',
      pieceAId: 'piece_front_body',
      edgeAId: 'e_f_shoulder_r',
      pieceBId: 'piece_back_body',
      edgeBId: 'e_b_shoulder_r',
      seamType: 'plain',
      flipped: false,
      enabled: true,
    },
    {
      id: 'sew_side_l',
      name: 'Side Seam Left',
      pieceAId: 'piece_front_body',
      edgeAId: 'e_f_side_l',
      pieceBId: 'piece_back_body',
      edgeBId: 'e_b_side_l',
      seamType: 'overlock',
      flipped: false,
      enabled: true,
    },
    {
      id: 'sew_side_r',
      name: 'Side Seam Right',
      pieceAId: 'piece_front_body',
      edgeAId: 'e_f_side_r',
      pieceBId: 'piece_back_body',
      edgeBId: 'e_b_side_r',
      seamType: 'overlock',
      flipped: false,
      enabled: true,
    },
    {
      id: 'sew_sleeve_armhole_f',
      name: 'Sleeve to Front Armhole',
      pieceAId: 'piece_sleeve',
      edgeAId: 'e_sl_cap_r',
      pieceBId: 'piece_front_body',
      edgeBId: 'e_f_armhole_l',
      seamType: 'overlock',
      flipped: false,
      enabled: true,
    },
    {
      id: 'sew_sleeve_armhole_b',
      name: 'Sleeve to Back Armhole',
      pieceAId: 'piece_sleeve',
      edgeAId: 'e_sl_cap_l',
      pieceBId: 'piece_back_body',
      edgeBId: 'e_b_armhole_l',
      seamType: 'overlock',
      flipped: false,
      enabled: true,
    },
    {
      id: 'sew_sleeve_underarm',
      name: 'Sleeve Underarm Inseam',
      pieceAId: 'piece_sleeve',
      edgeAId: 'e_sl_inseam_l',
      pieceBId: 'piece_sleeve',
      edgeBId: 'e_sl_inseam_r',
      seamType: 'overlock',
      flipped: false,
      enabled: true,
    },
    {
      id: 'sew_neck_rib',
      name: 'Rib to Neckline',
      pieceAId: 'piece_neck_rib',
      edgeAId: 'e_rib_bottom',
      pieceBId: 'piece_front_body',
      edgeBId: 'e_f_neck_l',
      seamType: 'overlock',
      flipped: false,
      enabled: true,
    },
  ];

  // Professional grading rules across XS to XXL
  const gradingRules: SizeGradingRule[] = [
    { size: 'XS', measurementDeltas: { chestWidth: -50, bodyLength: -30, shoulderWidth: -30, sleeveLength: -15, sleeveOpening: -10 } },
    { size: 'S', measurementDeltas: { chestWidth: -25, bodyLength: -15, shoulderWidth: -15, sleeveLength: -8, sleeveOpening: -5 } },
    { size: 'M', measurementDeltas: {} }, // Base
    { size: 'L', measurementDeltas: { chestWidth: 30, bodyLength: 15, shoulderWidth: 15, sleeveLength: 10, sleeveOpening: 8 } },
    { size: 'XL', measurementDeltas: { chestWidth: 60, bodyLength: 30, shoulderWidth: 30, sleeveLength: 20, sleeveOpening: 16 } },
    { size: 'XXL', measurementDeltas: { chestWidth: 95, bodyLength: 45, shoulderWidth: 45, sleeveLength: 30, sleeveOpening: 24 } },
  ];

  return {
    id,
    name,
    category: 'tops',
    subcategory: 'T-Shirt',
    fit,
    description,
    thumbnail: '/thumbnails/tshirt.svg',
    baseSize: 'M',
    measurements: measurementsList,
    gradingRules,
    defaultFabricCode: 'FAB_COTTON_JERSEY',
    generatePatterns,
    defaultSewing,
  };
}
