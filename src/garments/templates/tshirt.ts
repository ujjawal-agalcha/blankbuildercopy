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

    const shoulderSlope = fit === 'drop-shoulder' || fit === 'oversized' ? 50 : 42;
    const armholeDepth = Math.max(210, halfChest * 0.44);

    // ==========================================
    // 1. FRONT BODY PANEL
    // ==========================================
    const frontPoints: ControlPoint[] = [
      { id: 'fn_cf', x: 0, y: neckFront, type: 'smooth' },
      { id: 'fn_hsp_l', x: -halfNeck, y: 0, type: 'corner' },
      { id: 'fn_lsp_l', x: -halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'fn_armpit_l', x: -halfChest / 2, y: armholeDepth, type: 'smooth' },
      { id: 'fn_hem_l', x: -halfHem, y: length, type: 'corner' },
      { id: 'fn_hem_cf', x: 0, y: length, type: 'corner' },
      { id: 'fn_hem_r', x: halfHem, y: length, type: 'corner' },
      { id: 'fn_armpit_r', x: halfChest / 2, y: armholeDepth, type: 'smooth' },
      { id: 'fn_lsp_r', x: halfShoulder, y: shoulderSlope, type: 'corner' },
      { id: 'fn_hsp_r', x: halfNeck, y: 0, type: 'corner' },
    ];

    const frontEdges: Edge2D[] = [
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
      { id: 'e_f_shoulder_l', fromPointId: 'fn_hsp_l', toPointId: 'fn_lsp_l', type: 'line', name: 'Shoulder Seam L' },
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
      { id: 'e_f_side_l', fromPointId: 'fn_armpit_l', toPointId: 'fn_hem_l', type: 'line', name: 'Side Seam L' },
      { id: 'e_f_hem_l', fromPointId: 'fn_hem_l', toPointId: 'fn_hem_cf', type: 'line', name: 'Front Hem L' },
      { id: 'e_f_hem_r', fromPointId: 'fn_hem_cf', toPointId: 'fn_hem_r', type: 'line', name: 'Front Hem R' },
      { id: 'e_f_side_r', fromPointId: 'fn_hem_r', toPointId: 'fn_armpit_r', type: 'line', name: 'Side Seam R' },
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
      { id: 'e_f_shoulder_r', fromPointId: 'fn_lsp_r', toPointId: 'fn_hsp_r', type: 'line', name: 'Shoulder Seam R' },
    ];

    const frontPiece: PatternPiece = {
      id: 'piece_front_body',
      name: 'Front Body',
      category: 'body',
      points: frontPoints,
      edges: frontEdges,
      position: { x: 380, y: 100 },
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
      grainline: { start: { x: 0, y: 150 }, end: { x: 0, y: length - 100 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#3b82f6',
    };

    // ==========================================
    // 2. BACK BODY PANEL
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
      position: { x: 1020, y: 100 },
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
    // 3. LEFT SLEEVE PIECE
    // ==========================================
    const sleeveCapHeight = 120;
    const sleeveBicep = armholeDepth * 0.95;

    const sleeveLeftPoints: ControlPoint[] = [
      { id: 'sll_top', x: 0, y: 0, type: 'smooth' },
      { id: 'sll_under_r', x: sleeveBicep, y: sleeveCapHeight, type: 'corner' },
      { id: 'sll_cuff_r', x: halfSleeveOpen, y: sleeveLen, type: 'corner' },
      { id: 'sll_cuff_center', x: 0, y: sleeveLen, type: 'smooth' },
      { id: 'sll_cuff_l', x: -halfSleeveOpen, y: sleeveLen, type: 'corner' },
      { id: 'sll_under_l', x: -sleeveBicep, y: sleeveCapHeight, type: 'corner' },
    ];

    const sleeveLeftEdges: Edge2D[] = [
      {
        id: 'e_sll_cap_r',
        fromPointId: 'sll_top',
        toPointId: 'sll_under_r',
        type: 'cubic-bezier',
        name: 'Sleeve Cap Front',
        controlPoints: [
          { x: sleeveBicep * 0.45, y: sleeveCapHeight * 0.05 },
          { x: sleeveBicep * 0.75, y: sleeveCapHeight * 0.8 },
        ],
      },
      { id: 'e_sll_inseam_r', fromPointId: 'sll_under_r', toPointId: 'sll_cuff_r', type: 'line', name: 'Inseam R' },
      { id: 'e_sll_hem_r', fromPointId: 'sll_cuff_r', toPointId: 'sll_cuff_center', type: 'line', name: 'Cuff Hem R' },
      { id: 'e_sll_hem_l', fromPointId: 'sll_cuff_center', toPointId: 'sll_cuff_l', type: 'line', name: 'Cuff Hem L' },
      { id: 'e_sll_inseam_l', fromPointId: 'sll_cuff_l', toPointId: 'sll_under_l', type: 'line', name: 'Inseam L' },
      {
        id: 'e_sll_cap_l',
        fromPointId: 'sll_under_l',
        toPointId: 'sll_top',
        type: 'cubic-bezier',
        name: 'Sleeve Cap Back',
        controlPoints: [
          { x: -sleeveBicep * 0.75, y: sleeveCapHeight * 0.8 },
          { x: -sleeveBicep * 0.45, y: sleeveCapHeight * 0.05 },
        ],
      },
    ];

    const sleeveLeftPiece: PatternPiece = {
      id: 'piece_sleeve_left',
      name: 'Left Sleeve',
      category: 'sleeve',
      points: sleeveLeftPoints,
      edges: sleeveLeftEdges,
      position: { x: 260, y: 900 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_JERSEY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [
        { id: 'n_sll_cap_center', edgeId: 'e_sll_cap_r', distanceRatio: 0.0, type: 'single', depth: 4 },
        { id: 'n_sll_back_double', edgeId: 'e_sll_cap_l', distanceRatio: 0.5, type: 'double', depth: 4 },
      ],
      darts: [],
      grainline: { start: { x: 0, y: 40 }, end: { x: 0, y: sleeveLen - 40 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#10b981',
    };

    // ==========================================
    // 4. RIGHT SLEEVE PIECE
    // ==========================================
    const sleeveRightPoints: ControlPoint[] = [
      { id: 'slr_top', x: 0, y: 0, type: 'smooth' },
      { id: 'slr_under_r', x: sleeveBicep, y: sleeveCapHeight, type: 'corner' },
      { id: 'slr_cuff_r', x: halfSleeveOpen, y: sleeveLen, type: 'corner' },
      { id: 'slr_cuff_center', x: 0, y: sleeveLen, type: 'smooth' },
      { id: 'slr_cuff_l', x: -halfSleeveOpen, y: sleeveLen, type: 'corner' },
      { id: 'slr_under_l', x: -sleeveBicep, y: sleeveCapHeight, type: 'corner' },
    ];

    const sleeveRightEdges: Edge2D[] = [
      {
        id: 'e_slr_cap_r',
        fromPointId: 'slr_top',
        toPointId: 'slr_under_r',
        type: 'cubic-bezier',
        name: 'Sleeve Cap Back',
        controlPoints: [
          { x: sleeveBicep * 0.45, y: sleeveCapHeight * 0.05 },
          { x: sleeveBicep * 0.75, y: sleeveCapHeight * 0.8 },
        ],
      },
      { id: 'e_slr_inseam_r', fromPointId: 'slr_under_r', toPointId: 'slr_cuff_r', type: 'line', name: 'Inseam R' },
      { id: 'e_slr_hem_r', fromPointId: 'slr_cuff_r', toPointId: 'slr_cuff_center', type: 'line', name: 'Cuff Hem R' },
      { id: 'e_slr_hem_l', fromPointId: 'slr_cuff_center', toPointId: 'slr_cuff_l', type: 'line', name: 'Cuff Hem L' },
      { id: 'e_slr_inseam_l', fromPointId: 'slr_cuff_l', toPointId: 'slr_under_l', type: 'line', name: 'Inseam L' },
      {
        id: 'e_slr_cap_l',
        fromPointId: 'slr_under_l',
        toPointId: 'slr_top',
        type: 'cubic-bezier',
        name: 'Sleeve Cap Front',
        controlPoints: [
          { x: -sleeveBicep * 0.75, y: sleeveCapHeight * 0.8 },
          { x: -sleeveBicep * 0.45, y: sleeveCapHeight * 0.05 },
        ],
      },
    ];

    const sleeveRightPiece: PatternPiece = {
      id: 'piece_sleeve_right',
      name: 'Right Sleeve',
      category: 'sleeve',
      points: sleeveRightPoints,
      edges: sleeveRightEdges,
      position: { x: 740, y: 900 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_JERSEY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [
        { id: 'n_slr_cap_center', edgeId: 'e_slr_cap_r', distanceRatio: 0.0, type: 'single', depth: 4 },
        { id: 'n_slr_front_single', edgeId: 'e_slr_cap_l', distanceRatio: 0.5, type: 'single', depth: 4 },
      ],
      darts: [],
      grainline: { start: { x: 0, y: 40 }, end: { x: 0, y: sleeveLen - 40 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#10b981',
    };

    // ==========================================
    // 5. NECK RIB BAND (Rib Knit Collar)
    // ==========================================
    const neckCircumference = (halfNeck * 2 * Math.PI * 0.65) * 0.85;
    const ribWidth = neckCircumference / 2;
    const ribPoints: ControlPoint[] = [
      { id: 'rp_tl', x: -ribWidth, y: 0, type: 'corner' },
      { id: 'rp_tr', x: ribWidth, y: 0, type: 'corner' },
      { id: 'rp_br', x: ribWidth, y: collarH * 2, type: 'corner' },
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
      position: { x: 1180, y: 900 },
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

    return [frontPiece, backPiece, sleeveLeftPiece, sleeveRightPiece, collarPiece];
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
      id: 'sew_armhole_l',
      name: 'Set-in Sleeve Left',
      pieceAId: 'piece_front_body',
      edgeAId: 'e_f_armhole_l',
      pieceBId: 'piece_sleeve_left',
      edgeBId: 'e_sll_cap_r',
      seamType: 'overlock',
      flipped: false,
      enabled: true,
    },
    {
      id: 'sew_armhole_r',
      name: 'Set-in Sleeve Right',
      pieceAId: 'piece_front_body',
      edgeAId: 'e_f_armhole_r',
      pieceBId: 'piece_sleeve_right',
      edgeBId: 'e_slr_cap_l',
      seamType: 'overlock',
      flipped: false,
      enabled: true,
    },
  ];

  const gradingRules: SizeGradingRule[] = [
    { size: 'XS' as StandardSize, measurementDeltas: { chestWidth: -50, bodyLength: -30, shoulderWidth: -30, sleeveLength: -15, hemWidth: -50 } },
    { size: 'S' as StandardSize, measurementDeltas: { chestWidth: -25, bodyLength: -15, shoulderWidth: -15, sleeveLength: -8, hemWidth: -25 } },
    { size: 'M' as StandardSize, measurementDeltas: {} },
    { size: 'L' as StandardSize, measurementDeltas: { chestWidth: 35, bodyLength: 15, shoulderWidth: 15, sleeveLength: 10, hemWidth: 35 } },
    { size: 'XL' as StandardSize, measurementDeltas: { chestWidth: 70, bodyLength: 30, shoulderWidth: 30, sleeveLength: 18, hemWidth: 70 } },
    { size: 'XXL' as StandardSize, measurementDeltas: { chestWidth: 105, bodyLength: 45, shoulderWidth: 45, sleeveLength: 25, hemWidth: 105 } },
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
    modelId: 'tee-t5',
    generatePatterns,
    defaultSewing,
  };
}

/**
 * Generates an authentic Tank Top pattern with scoop front,
 * racer/scoop back, neck binding rib, and left/right armhole bindings.
 */
export function createTankTemplate(
  id: string,
  name: string,
  fit: 'regular' | 'slim' | 'relaxed' | 'cropped',
  description: string
): GarmentTemplate {
  const base = createTShirtTemplate(id, name, fit as any, description, {
    chestWidth: 480,
    bodyLength: 700,
    shoulderWidth: 340,
    sleeveLength: 0,
    sleeveOpening: 0,
    neckWidth: 200,
    neckDepthFront: 140,
    neckDepthBack: 55,
    hemWidth: 480,
    collarHeight: 20,
  });

  const generatePatterns = (m: Record<string, number>): PatternPiece[] => {
    const halfChest = (m.chestWidth || 480) / 2;
    const length = m.bodyLength || 700;
    const halfShoulder = (m.shoulderWidth || 340) / 2;
    const halfNeck = (m.neckWidth || 200) / 2;
    const neckFront = m.neckDepthFront || 140;
    const neckBack = m.neckDepthBack || 55;
    const armholeDepth = Math.max(240, halfChest * 0.55);

    // Front Tank Body
    const frontPoints: ControlPoint[] = [
      { id: 'tn_f_neck', x: 0, y: neckFront, type: 'smooth' },
      { id: 'tn_f_hsp_l', x: -halfNeck, y: 0, type: 'corner' },
      { id: 'tn_f_lsp_l', x: -halfShoulder, y: 35, type: 'corner' },
      { id: 'tn_f_armpit_l', x: -halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'tn_f_hem_l', x: -halfChest, y: length, type: 'corner' },
      { id: 'tn_f_hem_c', x: 0, y: length, type: 'corner' },
      { id: 'tn_f_hem_r', x: halfChest, y: length, type: 'corner' },
      { id: 'tn_f_armpit_r', x: halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'tn_f_lsp_r', x: halfShoulder, y: 35, type: 'corner' },
      { id: 'tn_f_hsp_r', x: halfNeck, y: 0, type: 'corner' },
    ];
    const frontEdges: Edge2D[] = [
      { id: 'e_tnf_neck_r', fromPointId: 'tn_f_hsp_r', toPointId: 'tn_f_neck', type: 'cubic-bezier', name: 'Front Scoop Neck R' },
      { id: 'e_tnf_neck_l', fromPointId: 'tn_f_neck', toPointId: 'tn_f_hsp_l', type: 'cubic-bezier', name: 'Front Scoop Neck L' },
      { id: 'e_tnf_shoulder_l', fromPointId: 'tn_f_hsp_l', toPointId: 'tn_f_lsp_l', type: 'line', name: 'Strap L' },
      { id: 'e_tnf_armhole_l', fromPointId: 'tn_f_lsp_l', toPointId: 'tn_f_armpit_l', type: 'cubic-bezier', name: 'Armhole Cutout L' },
      { id: 'e_tnf_side_l', fromPointId: 'tn_f_armpit_l', toPointId: 'tn_f_hem_l', type: 'line', name: 'Side Seam L' },
      { id: 'e_tnf_hem_l', fromPointId: 'tn_f_hem_l', toPointId: 'tn_f_hem_c', type: 'line', name: 'Hem L' },
      { id: 'e_tnf_hem_r', fromPointId: 'tn_f_hem_c', toPointId: 'tn_f_hem_r', type: 'line', name: 'Hem R' },
      { id: 'e_tnf_side_r', fromPointId: 'tn_f_hem_r', toPointId: 'tn_f_armpit_r', type: 'line', name: 'Side Seam R' },
      { id: 'e_tnf_armhole_r', fromPointId: 'tn_f_armpit_r', toPointId: 'tn_f_lsp_r', type: 'cubic-bezier', name: 'Armhole Cutout R' },
      { id: 'e_tnf_shoulder_r', fromPointId: 'tn_f_lsp_r', toPointId: 'tn_f_hsp_r', type: 'line', name: 'Strap R' },
    ];
    const frontPiece: PatternPiece = {
      id: 'tank_front_body',
      name: 'Tank Front Body',
      category: 'body',
      points: frontPoints,
      edges: frontEdges,
      position: { x: 380, y: 100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_JERSEY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 150 }, end: { x: 0, y: length - 100 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#3b82f6',
    };

    // Back Tank Body
    const backPoints: ControlPoint[] = [
      { id: 'tn_b_neck', x: 0, y: neckBack, type: 'smooth' },
      { id: 'tn_b_hsp_l', x: -halfNeck, y: 0, type: 'corner' },
      { id: 'tn_b_lsp_l', x: -halfShoulder, y: 35, type: 'corner' },
      { id: 'tn_b_armpit_l', x: -halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'tn_b_hem_l', x: -halfChest, y: length, type: 'corner' },
      { id: 'tn_b_hem_c', x: 0, y: length, type: 'corner' },
      { id: 'tn_b_hem_r', x: halfChest, y: length, type: 'corner' },
      { id: 'tn_b_armpit_r', x: halfChest, y: armholeDepth, type: 'smooth' },
      { id: 'tn_b_lsp_r', x: halfShoulder, y: 35, type: 'corner' },
      { id: 'tn_b_hsp_r', x: halfNeck, y: 0, type: 'corner' },
    ];
    const backEdges: Edge2D[] = [
      { id: 'e_tnb_neck_r', fromPointId: 'tn_b_hsp_r', toPointId: 'tn_b_neck', type: 'cubic-bezier', name: 'Back Neck R' },
      { id: 'e_tnb_neck_l', fromPointId: 'tn_b_neck', toPointId: 'tn_b_hsp_l', type: 'cubic-bezier', name: 'Back Neck L' },
      { id: 'e_tnb_shoulder_l', fromPointId: 'tn_b_hsp_l', toPointId: 'tn_b_lsp_l', type: 'line', name: 'Back Strap L' },
      { id: 'e_tnb_armhole_l', fromPointId: 'tn_b_lsp_l', toPointId: 'tn_b_armpit_l', type: 'cubic-bezier', name: 'Back Armhole L' },
      { id: 'e_tnb_side_l', fromPointId: 'tn_b_armpit_l', toPointId: 'tn_b_hem_l', type: 'line', name: 'Side Seam L' },
      { id: 'e_tnb_hem_l', fromPointId: 'tn_b_hem_l', toPointId: 'tn_b_hem_c', type: 'line', name: 'Hem L' },
      { id: 'e_tnb_hem_r', fromPointId: 'tn_b_hem_c', toPointId: 'tn_b_hem_r', type: 'line', name: 'Hem R' },
      { id: 'e_tnb_side_r', fromPointId: 'tn_b_hem_r', toPointId: 'tn_b_armpit_r', type: 'line', name: 'Side Seam R' },
      { id: 'e_tnb_armhole_r', fromPointId: 'tn_b_armpit_r', toPointId: 'tn_b_lsp_r', type: 'cubic-bezier', name: 'Back Armhole R' },
      { id: 'e_tnb_shoulder_r', fromPointId: 'tn_b_lsp_r', toPointId: 'tn_b_hsp_r', type: 'line', name: 'Back Strap R' },
    ];
    const backPiece: PatternPiece = {
      id: 'tank_back_body',
      name: 'Tank Back Body',
      category: 'body',
      points: backPoints,
      edges: backEdges,
      position: { x: 1040, y: 100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_JERSEY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 150 }, end: { x: 0, y: length - 100 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#06b6d4',
    };

    // Bindings
    const neckBindingPiece: PatternPiece = {
      id: 'tank_neck_binding',
      name: 'Neck Binding Trim',
      category: 'collar',
      points: [
        { id: 'tn_nb_tl', x: -260, y: 0, type: 'corner' },
        { id: 'tn_nb_tr', x: 260, y: 0, type: 'corner' },
        { id: 'tn_nb_br', x: 260, y: 22, type: 'corner' },
        { id: 'tn_nb_bl', x: -260, y: 22, type: 'corner' },
      ],
      edges: [
        { id: 'e_tn_nb_top', fromPointId: 'tn_nb_tl', toPointId: 'tn_nb_tr', type: 'line', name: 'Binding Top' },
        { id: 'e_tn_nb_r', fromPointId: 'tn_nb_tr', toPointId: 'tn_nb_br', type: 'line', name: 'Binding Join' },
        { id: 'e_tn_nb_bot', fromPointId: 'tn_nb_br', toPointId: 'tn_nb_bl', type: 'line', name: 'Binding Sew' },
        { id: 'e_tn_nb_l', fromPointId: 'tn_nb_bl', toPointId: 'tn_nb_tl', type: 'line', name: 'Binding Join' },
      ],
      position: { x: 380, y: 880 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 8,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -240, y: 11 }, end: { x: 240, y: 11 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    const armBindingLPiece: PatternPiece = {
      id: 'tank_arm_binding_left',
      name: 'Left Armhole Binding',
      category: 'trim',
      points: [
        { id: 'tn_abl_tl', x: -240, y: 0, type: 'corner' },
        { id: 'tn_abl_tr', x: 240, y: 0, type: 'corner' },
        { id: 'tn_abl_br', x: 240, y: 22, type: 'corner' },
        { id: 'tn_abl_bl', x: -240, y: 22, type: 'corner' },
      ],
      edges: [
        { id: 'e_tn_abl_top', fromPointId: 'tn_abl_tl', toPointId: 'tn_abl_tr', type: 'line', name: 'Arm Binding Top' },
        { id: 'e_tn_abl_r', fromPointId: 'tn_abl_tr', toPointId: 'tn_abl_br', type: 'line', name: 'Join' },
        { id: 'e_tn_abl_bot', fromPointId: 'tn_abl_br', toPointId: 'tn_abl_bl', type: 'line', name: 'Arm Binding Sew' },
        { id: 'e_tn_abl_l', fromPointId: 'tn_abl_bl', toPointId: 'tn_abl_tl', type: 'line', name: 'Join' },
      ],
      position: { x: 1040, y: 880 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 8,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -220, y: 11 }, end: { x: 220, y: 11 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    const armBindingRPiece: PatternPiece = {
      id: 'tank_arm_binding_right',
      name: 'Right Armhole Binding',
      category: 'trim',
      points: [
        { id: 'tn_abr_tl', x: -240, y: 0, type: 'corner' },
        { id: 'tn_abr_tr', x: 240, y: 0, type: 'corner' },
        { id: 'tn_abr_br', x: 240, y: 22, type: 'corner' },
        { id: 'tn_abr_bl', x: -240, y: 22, type: 'corner' },
      ],
      edges: [
        { id: 'e_tn_abr_top', fromPointId: 'tn_abr_tl', toPointId: 'tn_abr_tr', type: 'line', name: 'Arm Binding Top' },
        { id: 'e_tn_abr_r', fromPointId: 'tn_abr_tr', toPointId: 'tn_abr_br', type: 'line', name: 'Join' },
        { id: 'e_tn_abr_bot', fromPointId: 'tn_abr_br', toPointId: 'tn_abr_bl', type: 'line', name: 'Arm Binding Sew' },
        { id: 'e_tn_abr_l', fromPointId: 'tn_abr_bl', toPointId: 'tn_abr_tl', type: 'line', name: 'Join' },
      ],
      position: { x: 1040, y: 940 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 8,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -220, y: 11 }, end: { x: 220, y: 11 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    return [
      frontPiece,
      backPiece,
      neckBindingPiece,
      armBindingLPiece,
      armBindingRPiece,
    ];
  };

  return {
    ...base,
    subcategory: 'Tank Top',
    modelId: 'tee-t5',
    generatePatterns,
  };
}

/**
 * Generates an authentic Long-Sleeve T-shirt pattern with front, back,
 * extended long sleeves, neck rib band, and left/right ribbed wrist cuffs.
 */
export function createLongSleeveTShirtTemplate(
  id: string,
  name: string,
  fit: 'regular' | 'oversized' | 'relaxed',
  description: string
): GarmentTemplate {
  const base = createTShirtTemplate(id, name, fit as any, description, {
    chestWidth: 550,
    bodyLength: 740,
    shoulderWidth: 490,
    sleeveLength: 640,
    sleeveOpening: 135,
    neckWidth: 185,
    neckDepthFront: 90,
    neckDepthBack: 22,
    hemWidth: 550,
    collarHeight: 25,
  });

  const generatePatterns = (m: Record<string, number>): PatternPiece[] => {
    const pieces = base.generatePatterns(m);

    const cuffW = 125 * 2;
    const cuffH = 65;

    const cuffLeft: PatternPiece = {
      id: 'piece_sleeve_cuff_left',
      name: 'Left Sleeve Rib Cuff',
      category: 'trim',
      points: [
        { id: 'lscl_tl', x: -cuffW / 2, y: 0, type: 'corner' },
        { id: 'lscl_tr', x: cuffW / 2, y: 0, type: 'corner' },
        { id: 'lscl_br', x: cuffW / 2, y: cuffH, type: 'corner' },
        { id: 'lscl_bl', x: -cuffW / 2, y: cuffH, type: 'corner' },
      ],
      edges: [
        { id: 'e_lscl_t', fromPointId: 'lscl_tl', toPointId: 'lscl_tr', type: 'line', name: 'Cuff Attach' },
        { id: 'e_lscl_r', fromPointId: 'lscl_tr', toPointId: 'lscl_br', type: 'line', name: 'Cuff Join R' },
        { id: 'e_lscl_b', fromPointId: 'lscl_br', toPointId: 'lscl_bl', type: 'line', name: 'Cuff Hem' },
        { id: 'e_lscl_l', fromPointId: 'lscl_bl', toPointId: 'lscl_tl', type: 'line', name: 'Cuff Join L' },
      ],
      position: { x: 260, y: 1160 },
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

    const cuffRight: PatternPiece = {
      id: 'piece_sleeve_cuff_right',
      name: 'Right Sleeve Rib Cuff',
      category: 'trim',
      points: [
        { id: 'lscr_tl', x: -cuffW / 2, y: 0, type: 'corner' },
        { id: 'lscr_tr', x: cuffW / 2, y: 0, type: 'corner' },
        { id: 'lscr_br', x: cuffW / 2, y: cuffH, type: 'corner' },
        { id: 'lscr_bl', x: -cuffW / 2, y: cuffH, type: 'corner' },
      ],
      edges: [
        { id: 'e_lscr_t', fromPointId: 'lscr_tl', toPointId: 'lscr_tr', type: 'line', name: 'Cuff Attach' },
        { id: 'e_lscr_r', fromPointId: 'lscr_tr', toPointId: 'lscr_br', type: 'line', name: 'Cuff Join R' },
        { id: 'e_lscr_b', fromPointId: 'lscr_br', toPointId: 'lscr_bl', type: 'line', name: 'Cuff Hem' },
        { id: 'e_lscr_l', fromPointId: 'lscr_bl', toPointId: 'lscr_tl', type: 'line', name: 'Cuff Join L' },
      ],
      position: { x: 740, y: 1160 },
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

    return [...pieces, cuffLeft, cuffRight];
  };

  return {
    ...base,
    subcategory: 'Long-Sleeve T-Shirt',
    modelId: 'tee-longsleeve',
    generatePatterns,
  };
}

/**
 * Generates an authentic Pocket T-Shirt pattern with patch chest pocket.
 */
export function createPocketTShirtTemplate(
  id: string,
  name: string,
  fit: 'regular' | 'oversized' | 'relaxed',
  description: string
): GarmentTemplate {
  const base = createTShirtTemplate(id, name, fit as any, description, {
    chestWidth: 540,
    bodyLength: 720,
    shoulderWidth: 480,
    sleeveLength: 220,
    sleeveOpening: 185,
    neckWidth: 185,
    neckDepthFront: 88,
    neckDepthBack: 22,
    hemWidth: 540,
    collarHeight: 25,
  });

  const generatePatterns = (m: Record<string, number>): PatternPiece[] => {
    const pieces = base.generatePatterns(m);

    const pW = 115;
    const pH = 130;
    const pocketPiece: PatternPiece = {
      id: 'piece_chest_pocket',
      name: 'Left Chest Patch Pocket',
      category: 'pocket',
      points: [
        { id: 'tcp_tl', x: -pW / 2, y: 0, type: 'corner' },
        { id: 'tcp_tr', x: pW / 2, y: 0, type: 'corner' },
        { id: 'tcp_mr', x: pW / 2, y: pH - 20, type: 'corner' },
        { id: 'tcp_b', x: 0, y: pH, type: 'corner' },
        { id: 'tcp_ml', x: -pW / 2, y: pH - 20, type: 'corner' },
      ],
      edges: [
        { id: 'e_tcp_t', fromPointId: 'tcp_tl', toPointId: 'tcp_tr', type: 'line', name: 'Pocket Hem' },
        { id: 'e_tcp_r', fromPointId: 'tcp_tr', toPointId: 'tcp_mr', type: 'line', name: 'Pocket Side R' },
        { id: 'e_tcp_br', fromPointId: 'tcp_mr', toPointId: 'tcp_b', type: 'line', name: 'Pocket Point R' },
        { id: 'e_tcp_bl', fromPointId: 'tcp_b', toPointId: 'tcp_ml', type: 'line', name: 'Pocket Point L' },
        { id: 'e_tcp_l', fromPointId: 'tcp_ml', toPointId: 'tcp_tl', type: 'line', name: 'Pocket Side L' },
      ],
      position: { x: 380, y: 780 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_JERSEY',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 15 }, end: { x: 0, y: pH - 15 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#38bdf8',
    };

    return [...pieces, pocketPiece];
  };

  return {
    ...base,
    subcategory: 'Pocket T-Shirt',
    modelId: 'tee-t5',
    generatePatterns,
  };
}

/**
 * Generates an authentic Ringer T-Shirt pattern with contrast rib neckband and sleeve bindings.
 */
export function createRingerTShirtTemplate(
  id: string,
  name: string,
  fit: 'regular' | 'slim',
  description: string
): GarmentTemplate {
  const base = createTShirtTemplate(id, name, fit as any, description, {
    chestWidth: 520,
    bodyLength: 720,
    shoulderWidth: 460,
    sleeveLength: 220,
    sleeveOpening: 175,
    neckWidth: 180,
    neckDepthFront: 88,
    neckDepthBack: 22,
    hemWidth: 520,
    collarHeight: 22,
  });

  const generatePatterns = (m: Record<string, number>): PatternPiece[] => {
    const pieces = base.generatePatterns(m);

    const bindW = 175 * 2;
    const bindH = 22;

    const bindLeft: PatternPiece = {
      id: 'piece_sleeve_binding_left',
      name: 'Left Sleeve Contrast Binding',
      category: 'trim',
      points: [
        { id: 'sbl_tl', x: -bindW / 2, y: 0, type: 'corner' },
        { id: 'sbl_tr', x: bindW / 2, y: 0, type: 'corner' },
        { id: 'sbl_br', x: bindW / 2, y: bindH, type: 'corner' },
        { id: 'sbl_bl', x: -bindW / 2, y: bindH, type: 'corner' },
      ],
      edges: [
        { id: 'e_sbl_t', fromPointId: 'sbl_tl', toPointId: 'sbl_tr', type: 'line', name: 'Binding Attach' },
        { id: 'e_sbl_r', fromPointId: 'sbl_tr', toPointId: 'sbl_br', type: 'line', name: 'Binding Join R' },
        { id: 'e_sbl_b', fromPointId: 'sbl_br', toPointId: 'sbl_bl', type: 'line', name: 'Binding Hem' },
        { id: 'e_sbl_l', fromPointId: 'sbl_bl', toPointId: 'sbl_tl', type: 'line', name: 'Binding Join L' },
      ],
      position: { x: 260, y: 1140 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 8,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -bindW / 2 + 20, y: bindH / 2 }, end: { x: bindW / 2 - 20, y: bindH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#ef4444',
    };

    const bindRight: PatternPiece = {
      id: 'piece_sleeve_binding_right',
      name: 'Right Sleeve Contrast Binding',
      category: 'trim',
      points: [
        { id: 'sbr_tl', x: -bindW / 2, y: 0, type: 'corner' },
        { id: 'sbr_tr', x: bindW / 2, y: 0, type: 'corner' },
        { id: 'sbr_br', x: bindW / 2, y: bindH, type: 'corner' },
        { id: 'sbr_bl', x: -bindW / 2, y: bindH, type: 'corner' },
      ],
      edges: [
        { id: 'e_sbr_t', fromPointId: 'sbr_tl', toPointId: 'sbr_tr', type: 'line', name: 'Binding Attach' },
        { id: 'e_sbr_r', fromPointId: 'sbr_tr', toPointId: 'sbr_br', type: 'line', name: 'Binding Join R' },
        { id: 'e_sbr_b', fromPointId: 'sbr_br', toPointId: 'sbr_bl', type: 'line', name: 'Binding Hem' },
        { id: 'e_sbr_l', fromPointId: 'sbr_bl', toPointId: 'sbr_tl', type: 'line', name: 'Binding Join L' },
      ],
      position: { x: 740, y: 1140 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_RIB_KNIT',
      defaultSeamAllowance: 8,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -bindW / 2 + 20, y: bindH / 2 }, end: { x: bindW / 2 - 20, y: bindH / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#ef4444',
    };

    return [...pieces, bindLeft, bindRight];
  };

  return {
    ...base,
    subcategory: 'Ringer T-Shirt',
    modelId: 'tee-t5',
    generatePatterns,
  };
}
