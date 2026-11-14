import { ControlPoint, Edge2D, PatternPiece } from '../../types/cad';
import { GarmentTemplate, StandardSize } from '../../types/garment';
import { SewingRelationship } from '../../types/sewing';

export function createPantsTemplate(
  id: string,
  name: string,
  fit: 'straight' | 'relaxed' | 'baggy',
  description: string
): GarmentTemplate {
  const defaultMeasurements = {
    waistHalf: 420,     // 84cm circumference (Size 32 / M)
    hipHalf: 540,       // 108cm circumference
    totalLength: 1040,  // Outseam mm
    inseamLength: 760,  // Inseam mm
    frontRise: 290,     // Crotch depth front
    backRise: 370,      // Crotch depth back
    thighHalf: 330,
    legOpeningHalf: 220,
    waistbandHeight: 45,
  };

  const measurementsList = [
    { id: 'waistHalf', name: 'Waist Width (Half)', description: 'Across waistband flat', value: defaultMeasurements.waistHalf, min: 320, max: 620, step: 5, category: 'circumference' as const },
    { id: 'hipHalf', name: 'Hip Width (Half)', description: 'Across widest part of seat', value: defaultMeasurements.hipHalf, min: 420, max: 720, step: 5, category: 'circumference' as const },
    { id: 'totalLength', name: 'Outseam Length', description: 'From top of waistband to hem', value: defaultMeasurements.totalLength, min: 900, max: 1200, step: 5, category: 'length' as const },
    { id: 'inseamLength', name: 'Inseam Length', description: 'From crotch point to bottom hem', value: defaultMeasurements.inseamLength, min: 650, max: 920, step: 5, category: 'leg' as const },
    { id: 'thighHalf', name: 'Thigh Width (Half)', description: '1 inch below crotch level', value: defaultMeasurements.thighHalf, min: 240, max: 440, step: 5, category: 'width' as const },
    { id: 'legOpeningHalf', name: 'Leg Opening (Half)', description: 'Across bottom pant hem', value: defaultMeasurements.legOpeningHalf, min: 140, max: 320, step: 5, category: 'leg' as const },
  ];

  const generatePatterns = (m: Record<string, number>): PatternPiece[] => {
    const halfWaist = (m.waistHalf || defaultMeasurements.waistHalf) / 2;
    const len = m.totalLength || defaultMeasurements.totalLength;
    const fRise = defaultMeasurements.frontRise;
    const thigh = m.thighHalf || defaultMeasurements.thighHalf;
    const hem = m.legOpeningHalf || defaultMeasurements.legOpeningHalf;

    // 1. FRONT LEFT LEG
    const frontPoints: ControlPoint[] = [
      { id: 'pfl_waist_out', x: 0, y: 0, type: 'corner' },
      { id: 'pfl_waist_cf', x: halfWaist, y: 15, type: 'corner' },
      { id: 'pfl_crotch', x: thigh, y: fRise, type: 'smooth' },
      { id: 'pfl_hem_in', x: hem, y: len, type: 'corner' },
      { id: 'pfl_hem_out', x: 0, y: len, type: 'corner' },
      { id: 'pfl_hip_out', x: -15, y: fRise * 0.7, type: 'smooth' },
    ];

    const frontEdges: Edge2D[] = [
      { id: 'e_pfl_waist', fromPointId: 'pfl_waist_out', toPointId: 'pfl_waist_cf', type: 'line', name: 'Front Waist' },
      { id: 'e_pfl_cf_crotch', fromPointId: 'pfl_waist_cf', toPointId: 'pfl_crotch', type: 'cubic-bezier', name: 'Front Crotch Curve' },
      { id: 'e_pfl_inseam', fromPointId: 'pfl_crotch', toPointId: 'pfl_hem_in', type: 'line', name: 'Front Inseam' },
      { id: 'e_pfl_hem', fromPointId: 'pfl_hem_in', toPointId: 'pfl_hem_out', type: 'line', name: 'Front Hem' },
      { id: 'e_pfl_outseam', fromPointId: 'pfl_hem_out', toPointId: 'pfl_hip_out', type: 'line', name: 'Front Outseam Lower' },
      { id: 'e_pfl_hip', fromPointId: 'pfl_hip_out', toPointId: 'pfl_waist_out', type: 'cubic-bezier', name: 'Front Outseam Upper' },
    ];

    const frontLeftPiece: PatternPiece = {
      id: 'pants_front_leg_left',
      name: 'Pants Front Left Leg',
      category: 'body',
      points: frontPoints,
      edges: frontEdges,
      position: { x: 380, y: 100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_DENIM_RAW',
      defaultSeamAllowance: 12,
      seamAllowanceEnabled: true,
      notches: [{ id: 'n_pfl_knee', edgeId: 'e_pfl_inseam', distanceRatio: 0.5, type: 'single', depth: 4 }],
      darts: [],
      grainline: { start: { x: halfWaist * 0.5, y: 100 }, end: { x: halfWaist * 0.5, y: len - 100 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#3b82f6',
    };

    // 2. FRONT RIGHT LEG
    const frontRightPoints: ControlPoint[] = frontPoints.map((p) => ({
      ...p,
      id: p.id.replace('pfl_', 'pfr_'),
      x: -p.x,
    }));

    const frontRightEdges: Edge2D[] = [
      { id: 'e_pfr_waist', fromPointId: 'pfr_waist_cf', toPointId: 'pfr_waist_out', type: 'line', name: 'Front Waist R' },
      { id: 'e_pfr_hip', fromPointId: 'pfr_waist_out', toPointId: 'pfr_hip_out', type: 'cubic-bezier', name: 'Outseam Upper R' },
      { id: 'e_pfr_outseam', fromPointId: 'pfr_hip_out', toPointId: 'pfr_hem_out', type: 'line', name: 'Outseam Lower R' },
      { id: 'e_pfr_hem', fromPointId: 'pfr_hem_out', toPointId: 'pfr_hem_in', type: 'line', name: 'Hem R' },
      { id: 'e_pfr_inseam', fromPointId: 'pfr_hem_in', toPointId: 'pfr_crotch', type: 'line', name: 'Inseam R' },
      { id: 'e_pfr_cf_crotch', fromPointId: 'pfr_crotch', toPointId: 'pfr_waist_cf', type: 'cubic-bezier', name: 'Crotch Curve R' },
    ];

    const frontRightPiece: PatternPiece = {
      id: 'pants_front_leg_right',
      name: 'Pants Front Right Leg',
      category: 'body',
      points: frontRightPoints,
      edges: frontRightEdges,
      position: { x: 780, y: 100 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_DENIM_RAW',
      defaultSeamAllowance: 12,
      seamAllowanceEnabled: true,
      notches: [{ id: 'n_pfr_knee', edgeId: 'e_pfr_inseam', distanceRatio: 0.5, type: 'single', depth: 4 }],
      darts: [],
      grainline: { start: { x: -halfWaist * 0.5, y: 100 }, end: { x: -halfWaist * 0.5, y: len - 100 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#3b82f6',
    };

    // 3. BACK LEFT LEG (Extended seat curve)
    const backPoints: ControlPoint[] = [
      { id: 'pbl_waist_out', x: 0, y: 0, type: 'corner' },
      { id: 'pbl_waist_cb', x: halfWaist + 25, y: -35, type: 'corner' },
      { id: 'pbl_crotch', x: thigh + 60, y: fRise + 40, type: 'smooth' },
      { id: 'pbl_hem_in', x: hem + 20, y: len, type: 'corner' },
      { id: 'pbl_hem_out', x: -10, y: len, type: 'corner' },
    ];

    const backEdges: Edge2D[] = [
      { id: 'e_pbl_waist', fromPointId: 'pbl_waist_out', toPointId: 'pbl_waist_cb', type: 'line', name: 'Back Waist' },
      { id: 'e_pbl_cb_crotch', fromPointId: 'pbl_waist_cb', toPointId: 'pbl_crotch', type: 'cubic-bezier', name: 'Back Crotch Curve' },
      { id: 'e_pbl_inseam', fromPointId: 'pbl_crotch', toPointId: 'pbl_hem_in', type: 'line', name: 'Back Inseam' },
      { id: 'e_pbl_hem', fromPointId: 'pbl_hem_in', toPointId: 'pbl_hem_out', type: 'line', name: 'Back Hem' },
      { id: 'e_pbl_outseam', fromPointId: 'pbl_hem_out', toPointId: 'pbl_waist_out', type: 'line', name: 'Back Outseam' },
    ];

    const backLeftPiece: PatternPiece = {
      id: 'pants_back_leg_left',
      name: 'Pants Back Left Leg',
      category: 'body',
      points: backPoints,
      edges: backEdges,
      position: { x: 1250, y: 100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_DENIM_RAW',
      defaultSeamAllowance: 12,
      seamAllowanceEnabled: true,
      notches: [{ id: 'n_pbl_knee', edgeId: 'e_pbl_inseam', distanceRatio: 0.5, type: 'double', depth: 4 }],
      darts: [],
      grainline: { start: { x: halfWaist * 0.5, y: 100 }, end: { x: halfWaist * 0.5, y: len - 100 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#6366f1',
    };

    // 4. BACK RIGHT LEG
    const backRightPoints: ControlPoint[] = backPoints.map((p) => ({
      ...p,
      id: p.id.replace('pbl_', 'pbr_'),
      x: -p.x,
    }));

    const backRightEdges: Edge2D[] = [
      { id: 'e_pbr_waist', fromPointId: 'pbr_waist_cb', toPointId: 'pbr_waist_out', type: 'line', name: 'Back Waist R' },
      { id: 'e_pbr_outseam', fromPointId: 'pbr_waist_out', toPointId: 'pbr_hem_out', type: 'line', name: 'Back Outseam R' },
      { id: 'e_pbr_hem', fromPointId: 'pbr_hem_out', toPointId: 'pbr_hem_in', type: 'line', name: 'Back Hem R' },
      { id: 'e_pbr_inseam', fromPointId: 'pbr_hem_in', toPointId: 'pbr_crotch', type: 'line', name: 'Back Inseam R' },
      { id: 'e_pbr_cb_crotch', fromPointId: 'pbr_crotch', toPointId: 'pbr_waist_cb', type: 'cubic-bezier', name: 'Back Crotch R' },
    ];

    const backRightPiece: PatternPiece = {
      id: 'pants_back_leg_right',
      name: 'Pants Back Right Leg',
      category: 'body',
      points: backRightPoints,
      edges: backRightEdges,
      position: { x: 1720, y: 100 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_DENIM_RAW',
      defaultSeamAllowance: 12,
      seamAllowanceEnabled: true,
      notches: [{ id: 'n_pbr_knee', edgeId: 'e_pbr_inseam', distanceRatio: 0.5, type: 'double', depth: 4 }],
      darts: [],
      grainline: { start: { x: -halfWaist * 0.5, y: 100 }, end: { x: -halfWaist * 0.5, y: len - 100 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#6366f1',
    };

    // 5. WAISTBAND
    const wbLength = (m.waistHalf || defaultMeasurements.waistHalf) * 2;
    const wbHeight = defaultMeasurements.waistbandHeight;
    const wbPoints: ControlPoint[] = [
      { id: 'wb_tl', x: 0, y: 0, type: 'corner' },
      { id: 'wb_tr', x: wbLength, y: 0, type: 'corner' },
      { id: 'wb_br', x: wbLength, y: wbHeight, type: 'corner' },
      { id: 'wb_bl', x: 0, y: wbHeight, type: 'corner' },
    ];
    const wbEdges: Edge2D[] = [
      { id: 'e_wb_top', fromPointId: 'wb_tl', toPointId: 'wb_tr', type: 'line', name: 'Waistband Top' },
      { id: 'e_wb_right', fromPointId: 'wb_tr', toPointId: 'wb_br', type: 'line', name: 'Waistband Fly End' },
      { id: 'e_wb_bottom', fromPointId: 'wb_br', toPointId: 'wb_bl', type: 'line', name: 'Waistband Attach Edge' },
      { id: 'e_wb_left', fromPointId: 'wb_bl', toPointId: 'wb_tl', type: 'line', name: 'Waistband Button Overlap' },
    ];

    const waistbandPiece: PatternPiece = {
      id: 'pants_waistband',
      name: 'Waistband Strip',
      category: 'waistband',
      points: wbPoints,
      edges: wbEdges,
      position: { x: 500, y: 880 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_DENIM_RAW',
      defaultSeamAllowance: 12,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 50, y: wbHeight / 2 }, end: { x: wbLength - 50, y: wbHeight / 2 }, hasArrowBothEnds: true, angle: 0 },
      internalLines: [],
      color: '#f59e0b',
    };

    return [frontLeftPiece, frontRightPiece, backLeftPiece, backRightPiece, waistbandPiece];
  };

  const defaultSewing: SewingRelationship[] = [
    {
      id: 'sew_pants_front_crotch',
      name: 'Front Crotch Seam',
      pieceAId: 'pants_front_leg_left',
      edgeAId: 'e_pfl_cf_crotch',
      pieceBId: 'pants_front_leg_right',
      edgeBId: 'e_pfr_cf_crotch',
      seamType: 'plain',
      flipped: false,
      enabled: true,
    },
    {
      id: 'sew_pants_back_crotch',
      name: 'Back Seat Crotch Seam',
      pieceAId: 'pants_back_leg_left',
      edgeAId: 'e_pbl_cb_crotch',
      pieceBId: 'pants_back_leg_right',
      edgeBId: 'e_pbr_cb_crotch',
      seamType: 'plain',
      flipped: false,
      enabled: true,
    },
    {
      id: 'sew_pants_inseam_l',
      name: 'Inseam Left Leg',
      pieceAId: 'pants_front_leg_left',
      edgeAId: 'e_pfl_inseam',
      pieceBId: 'pants_back_leg_left',
      edgeBId: 'e_pbl_inseam',
      seamType: 'plain',
      flipped: false,
      enabled: true,
    },
    {
      id: 'sew_pants_outseam_l',
      name: 'Outseam Left Leg',
      pieceAId: 'pants_front_leg_left',
      edgeAId: 'e_pfl_outseam',
      pieceBId: 'pants_back_leg_left',
      edgeBId: 'e_pbl_outseam',
      seamType: 'plain',
      flipped: false,
      enabled: true,
    },
  ];

  return {
    id,
    name,
    category: 'bottoms',
    subcategory: 'Pants',
    fit,
    description,
    thumbnail: '/thumbnails/pants.svg',
    baseSize: 'M',
    measurements: measurementsList,
    gradingRules: [
      { size: 'XS' as StandardSize, measurementDeltas: { waistHalf: -40, hipHalf: -40, thighHalf: -20, legOpeningHalf: -15 } },
      { size: 'S' as StandardSize, measurementDeltas: { waistHalf: -20, hipHalf: -20, thighHalf: -10, legOpeningHalf: -8 } },
      { size: 'M' as StandardSize, measurementDeltas: {} },
      { size: 'L' as StandardSize, measurementDeltas: { waistHalf: 25, hipHalf: 25, thighHalf: 12, legOpeningHalf: 10 } },
      { size: 'XL' as StandardSize, measurementDeltas: { waistHalf: 50, hipHalf: 50, thighHalf: 25, legOpeningHalf: 18 } },
      { size: 'XXL' as StandardSize, measurementDeltas: { waistHalf: 75, hipHalf: 75, thighHalf: 38, legOpeningHalf: 25 } },
    ],
    defaultFabricCode: 'FAB_DENIM_RAW',
    modelId: 'moto-pants',
    generatePatterns,
    defaultSewing,
  };
}

/**
 * Generates an authentic 5-Pocket Jeans pattern with front legs,
 * back legs, Western back yokes, contoured waistband, and rear patch pockets.
 */
export function createJeansTemplate(
  id: string,
  name: string,
  fit: 'straight' | 'relaxed' | 'baggy' | 'slim',
  description: string
): GarmentTemplate {
  const base = createPantsTemplate(id, name, fit as any, description);

  const generatePatterns = (m: Record<string, number>): PatternPiece[] => {
    const basePieces = base.generatePatterns(m);

    // Jeans Back Yoke Left & Right
    const yokeWidth = 240;
    const yokeHeightOuter = 75;
    const yokeHeightInner = 50;

    const yokeLeft: PatternPiece = {
      id: 'jeans_yoke_left',
      name: 'Back Yoke Left',
      category: 'trim',
      points: [
        { id: 'jyl_tl', x: -yokeWidth, y: 0, type: 'corner' },
        { id: 'jyl_tr', x: 0, y: 0, type: 'corner' },
        { id: 'jyl_br', x: 0, y: yokeHeightInner, type: 'corner' },
        { id: 'jyl_bl', x: -yokeWidth, y: yokeHeightOuter, type: 'corner' },
      ],
      edges: [
        { id: 'e_jyl_t', fromPointId: 'jyl_tl', toPointId: 'jyl_tr', type: 'line', name: 'Yoke Waist Join' },
        { id: 'e_jyl_r', fromPointId: 'jyl_tr', toPointId: 'jyl_br', type: 'line', name: 'Yoke Center Back' },
        { id: 'e_jyl_b', fromPointId: 'jyl_br', toPointId: 'jyl_bl', type: 'line', name: 'Yoke Seat Join' },
        { id: 'e_jyl_l', fromPointId: 'jyl_bl', toPointId: 'jyl_tl', type: 'line', name: 'Yoke Outseam' },
      ],
      position: { x: 300, y: 1100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_DENIM_RAW',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: -yokeWidth / 2, y: 15 }, end: { x: -yokeWidth / 2, y: yokeHeightInner + 10 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#1e3a8a',
    };

    const yokeRight: PatternPiece = {
      id: 'jeans_yoke_right',
      name: 'Back Yoke Right',
      category: 'trim',
      points: [
        { id: 'jyr_tl', x: 0, y: 0, type: 'corner' },
        { id: 'jyr_tr', x: yokeWidth, y: 0, type: 'corner' },
        { id: 'jyr_br', x: yokeWidth, y: yokeHeightOuter, type: 'corner' },
        { id: 'jyr_bl', x: 0, y: yokeHeightInner, type: 'corner' },
      ],
      edges: [
        { id: 'e_jyr_t', fromPointId: 'jyr_tl', toPointId: 'jyr_tr', type: 'line', name: 'Yoke Waist Join' },
        { id: 'e_jyr_r', fromPointId: 'jyr_tr', toPointId: 'jyr_br', type: 'line', name: 'Yoke Outseam' },
        { id: 'e_jyr_b', fromPointId: 'jyr_br', toPointId: 'jyr_bl', type: 'line', name: 'Yoke Seat Join' },
        { id: 'e_jyr_l', fromPointId: 'jyr_bl', toPointId: 'jyr_tl', type: 'line', name: 'Yoke Center Back' },
      ],
      position: { x: 600, y: 1100 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_DENIM_RAW',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: yokeWidth / 2, y: 15 }, end: { x: yokeWidth / 2, y: yokeHeightInner + 10 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#1e3a8a',
    };

    // Rear Patch Pockets with Arcuate Stitch Line
    const pocketW = 160;
    const pocketH = 175;
    const backPocketLeft: PatternPiece = {
      id: 'jeans_back_pocket_left',
      name: 'Back Pocket Left (5-Pocket)',
      category: 'pocket',
      points: [
        { id: 'jpl_tl', x: -pocketW / 2, y: 0, type: 'corner' },
        { id: 'jpl_tr', x: pocketW / 2, y: 0, type: 'corner' },
        { id: 'jpl_mr', x: pocketW / 2, y: pocketH * 0.75, type: 'corner' },
        { id: 'jpl_b', x: 0, y: pocketH, type: 'corner' },
        { id: 'jpl_ml', x: -pocketW / 2, y: pocketH * 0.75, type: 'corner' },
      ],
      edges: [
        { id: 'e_jpl_top', fromPointId: 'jpl_tl', toPointId: 'jpl_tr', type: 'line', name: 'Pocket Hem' },
        { id: 'e_jpl_r', fromPointId: 'jpl_tr', toPointId: 'jpl_mr', type: 'line', name: 'Pocket Right' },
        { id: 'e_jpl_br', fromPointId: 'jpl_mr', toPointId: 'jpl_b', type: 'line', name: 'Pocket Point R' },
        { id: 'e_jpl_bl', fromPointId: 'jpl_b', toPointId: 'jpl_ml', type: 'line', name: 'Pocket Point L' },
        { id: 'e_jpl_l', fromPointId: 'jpl_ml', toPointId: 'jpl_tl', type: 'line', name: 'Pocket Left' },
      ],
      position: { x: 920, y: 1100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_DENIM_RAW',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 20 }, end: { x: 0, y: pocketH - 20 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [
        { id: 'il_arcuate_1', points: [{ x: -pocketW * 0.4, y: pocketH * 0.4 }, { x: 0, y: pocketH * 0.55 }, { x: pocketW * 0.4, y: pocketH * 0.4 }], type: 'style', name: 'Arcuate Stitch' },
      ],
      color: '#3b82f6',
    };

    const backPocketRight: PatternPiece = {
      id: 'jeans_back_pocket_right',
      name: 'Back Pocket Right (5-Pocket)',
      category: 'pocket',
      points: [
        { id: 'jpr_tl', x: -pocketW / 2, y: 0, type: 'corner' },
        { id: 'jpr_tr', x: pocketW / 2, y: 0, type: 'corner' },
        { id: 'jpr_mr', x: pocketW / 2, y: pocketH * 0.75, type: 'corner' },
        { id: 'jpr_b', x: 0, y: pocketH, type: 'corner' },
        { id: 'jpr_ml', x: -pocketW / 2, y: pocketH * 0.75, type: 'corner' },
      ],
      edges: [
        { id: 'e_jpr_top', fromPointId: 'jpr_tl', toPointId: 'jpr_tr', type: 'line', name: 'Pocket Hem' },
        { id: 'e_jpr_r', fromPointId: 'jpr_tr', toPointId: 'jpr_mr', type: 'line', name: 'Pocket Right' },
        { id: 'e_jpr_br', fromPointId: 'jpr_mr', toPointId: 'jpr_b', type: 'line', name: 'Pocket Point R' },
        { id: 'e_jpr_bl', fromPointId: 'jpr_b', toPointId: 'jpr_ml', type: 'line', name: 'Pocket Point L' },
        { id: 'e_jpr_l', fromPointId: 'jpr_ml', toPointId: 'jpr_tl', type: 'line', name: 'Pocket Left' },
      ],
      position: { x: 1140, y: 1100 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_DENIM_RAW',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 20 }, end: { x: 0, y: pocketH - 20 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [
        { id: 'il_arcuate_2', points: [{ x: -pocketW * 0.4, y: pocketH * 0.4 }, { x: 0, y: pocketH * 0.55 }, { x: pocketW * 0.4, y: pocketH * 0.4 }], type: 'style', name: 'Arcuate Stitch' },
      ],
      color: '#3b82f6',
    };

    // Coin / Watch Pocket (5th pocket)
    const coinW = 85;
    const coinH = 95;
    const coinPocket: PatternPiece = {
      id: 'jeans_coin_pocket',
      name: 'Coin / Watch Pocket',
      category: 'pocket',
      points: [
        { id: 'jcp_tl', x: -coinW / 2, y: 0, type: 'corner' },
        { id: 'jcp_tr', x: coinW / 2, y: 0, type: 'corner' },
        { id: 'jcp_br', x: coinW / 2, y: coinH, type: 'corner' },
        { id: 'jcp_bl', x: -coinW / 2, y: coinH, type: 'corner' },
      ],
      edges: [
        { id: 'e_jcp_t', fromPointId: 'jcp_tl', toPointId: 'jcp_tr', type: 'line', name: 'Coin Pocket Hem' },
        { id: 'e_jcp_r', fromPointId: 'jcp_tr', toPointId: 'jcp_br', type: 'line', name: 'Coin Pocket R' },
        { id: 'e_jcp_b', fromPointId: 'jcp_br', toPointId: 'jcp_bl', type: 'line', name: 'Coin Pocket Bottom' },
        { id: 'e_jcp_l', fromPointId: 'jcp_bl', toPointId: 'jcp_tl', type: 'line', name: 'Coin Pocket L' },
      ],
      position: { x: 1360, y: 1100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_DENIM_RAW',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 10 }, end: { x: 0, y: coinH - 10 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#3b82f6',
    };

    // Fly Shield Facing
    const flyLen = 200;
    const flyShield: PatternPiece = {
      id: 'jeans_fly_shield',
      name: 'Zipper Fly Shield',
      category: 'trim',
      points: [
        { id: 'jfs_tl', x: -22, y: 0, type: 'corner' },
        { id: 'jfs_tr', x: 22, y: 0, type: 'corner' },
        { id: 'jfs_br', x: 22, y: flyLen - 25, type: 'corner' },
        { id: 'jfs_bot', x: 0, y: flyLen, type: 'smooth' },
        { id: 'jfs_bl', x: -22, y: flyLen - 25, type: 'corner' },
      ],
      edges: [
        { id: 'e_jfs_t', fromPointId: 'jfs_tl', toPointId: 'jfs_tr', type: 'line', name: 'Shield Top' },
        { id: 'e_jfs_r', fromPointId: 'jfs_tr', toPointId: 'jfs_br', type: 'line', name: 'Shield Right' },
        { id: 'e_jfs_br', fromPointId: 'jfs_br', toPointId: 'jfs_bot', type: 'line', name: 'Shield Curve R' },
        { id: 'e_jfs_bl', fromPointId: 'jfs_bot', toPointId: 'jfs_bl', type: 'line', name: 'Shield Curve L' },
        { id: 'e_jfs_l', fromPointId: 'jfs_bl', toPointId: 'jfs_tl', type: 'line', name: 'Shield Left' },
      ],
      position: { x: 1520, y: 1100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_DENIM_RAW',
      defaultSeamAllowance: 8,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 15 }, end: { x: 0, y: flyLen - 15 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#1e3a8a',
    };

    return [
      ...basePieces,
      yokeLeft,
      yokeRight,
      backPocketLeft,
      backPocketRight,
      coinPocket,
      flyShield,
    ];
  };

  return {
    ...base,
    subcategory: 'Jeans',
    modelId: 'moto-pants',
    generatePatterns,
  };
}

/**
 * Generates an authentic Cargo Pants pattern with bellows pleated side cargo pockets,
 * knee dart reinforcement, reinforced waistband, and top pocket flaps.
 */
export function createCargoPantsTemplate(
  id: string,
  name: string,
  fit: 'straight' | 'relaxed' | 'baggy',
  description: string
): GarmentTemplate {
  const base = createPantsTemplate(id, name, fit as any, description);

  const generatePatterns = (m: Record<string, number>): PatternPiece[] => {
    const basePieces = base.generatePatterns(m);

    const cargoW = 190;
    const cargoH = 220;
    const flapH = 65;

    const cargoLeft: PatternPiece = {
      id: 'cargo_pocket_left',
      name: 'Left Bellows Cargo Pocket',
      category: 'pocket',
      points: [
        { id: 'cpl_tl', x: -cargoW / 2, y: 0, type: 'corner' },
        { id: 'cpl_tr', x: cargoW / 2, y: 0, type: 'corner' },
        { id: 'cpl_br', x: cargoW / 2, y: cargoH, type: 'corner' },
        { id: 'cpl_bl', x: -cargoW / 2, y: cargoH, type: 'corner' },
      ],
      edges: [
        { id: 'e_cpl_t', fromPointId: 'cpl_tl', toPointId: 'cpl_tr', type: 'line', name: 'Pocket Top' },
        { id: 'e_cpl_r', fromPointId: 'cpl_tr', toPointId: 'cpl_br', type: 'line', name: 'Pocket Right' },
        { id: 'e_cpl_b', fromPointId: 'cpl_br', toPointId: 'cpl_bl', type: 'line', name: 'Pocket Bottom' },
        { id: 'e_cpl_l', fromPointId: 'cpl_bl', toPointId: 'cpl_tl', type: 'line', name: 'Pocket Left' },
      ],
      position: { x: 300, y: 1100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_TWILL',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 20 }, end: { x: 0, y: cargoH - 20 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [
        { id: 'il_pleat', points: [{ x: 0, y: 0 }, { x: 0, y: cargoH }], type: 'box-pleat', name: 'Center Box Pleat' },
      ],
      color: '#475569',
    };

    const cargoRight: PatternPiece = {
      id: 'cargo_pocket_right',
      name: 'Right Bellows Cargo Pocket',
      category: 'pocket',
      points: [
        { id: 'cpr_tl', x: -cargoW / 2, y: 0, type: 'corner' },
        { id: 'cpr_tr', x: cargoW / 2, y: 0, type: 'corner' },
        { id: 'cpr_br', x: cargoW / 2, y: cargoH, type: 'corner' },
        { id: 'cpr_bl', x: -cargoW / 2, y: cargoH, type: 'corner' },
      ],
      edges: [
        { id: 'e_cpr_t', fromPointId: 'cpr_tl', toPointId: 'cpr_tr', type: 'line', name: 'Pocket Top' },
        { id: 'e_cpr_r', fromPointId: 'cpr_tr', toPointId: 'cpr_br', type: 'line', name: 'Pocket Right' },
        { id: 'e_cpr_b', fromPointId: 'cpr_br', toPointId: 'cpr_bl', type: 'line', name: 'Pocket Bottom' },
        { id: 'e_cpr_l', fromPointId: 'cpr_bl', toPointId: 'cpr_tl', type: 'line', name: 'Pocket Left' },
      ],
      position: { x: 550, y: 1100 },
      rotation: 0,
      mirror: true,
      cutQuantity: 1,
      fabricCode: 'FAB_COTTON_TWILL',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 20 }, end: { x: 0, y: cargoH - 20 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [
        { id: 'il_pleat_r', points: [{ x: 0, y: 0 }, { x: 0, y: cargoH }], type: 'box-pleat', name: 'Center Box Pleat' },
      ],
      color: '#475569',
    };

    const flapLeft: PatternPiece = {
      id: 'cargo_flap_left',
      name: 'Cargo Pocket Flap L',
      category: 'trim',
      points: [
        { id: 'cfl_tl', x: -cargoW / 2, y: 0, type: 'corner' },
        { id: 'cfl_tr', x: cargoW / 2, y: 0, type: 'corner' },
        { id: 'cfl_br', x: cargoW / 2, y: flapH, type: 'corner' },
        { id: 'cfl_bl', x: -cargoW / 2, y: flapH, type: 'corner' },
      ],
      edges: [
        { id: 'e_cfl_t', fromPointId: 'cfl_tl', toPointId: 'cfl_tr', type: 'line', name: 'Flap Sew Edge' },
        { id: 'e_cfl_r', fromPointId: 'cfl_tr', toPointId: 'cfl_br', type: 'line', name: 'Flap Right' },
        { id: 'e_cfl_b', fromPointId: 'cfl_br', toPointId: 'cfl_bl', type: 'line', name: 'Flap Edge' },
        { id: 'e_cfl_l', fromPointId: 'cfl_bl', toPointId: 'cfl_tl', type: 'line', name: 'Flap Left' },
      ],
      position: { x: 800, y: 1100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 2,
      fabricCode: 'FAB_COTTON_TWILL',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 10 }, end: { x: 0, y: flapH - 10 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#334155',
    };

    const flapRight: PatternPiece = {
      id: 'cargo_flap_right',
      name: 'Cargo Pocket Flap R',
      category: 'trim',
      points: [
        { id: 'cfr_tl', x: -cargoW / 2, y: 0, type: 'corner' },
        { id: 'cfr_tr', x: cargoW / 2, y: 0, type: 'corner' },
        { id: 'cfr_br', x: cargoW / 2, y: flapH, type: 'corner' },
        { id: 'cfr_bl', x: -cargoW / 2, y: flapH, type: 'corner' },
      ],
      edges: [
        { id: 'e_cfr_t', fromPointId: 'cfr_tl', toPointId: 'cfr_tr', type: 'line', name: 'Flap Sew Edge' },
        { id: 'e_cfr_r', fromPointId: 'cfr_tr', toPointId: 'cfr_br', type: 'line', name: 'Flap Right' },
        { id: 'e_cfr_b', fromPointId: 'cfr_br', toPointId: 'cfr_bl', type: 'line', name: 'Flap Edge' },
        { id: 'e_cfr_l', fromPointId: 'cfr_bl', toPointId: 'cfr_tl', type: 'line', name: 'Flap Left' },
      ],
      position: { x: 1040, y: 1100 },
      rotation: 0,
      mirror: true,
      cutQuantity: 2,
      fabricCode: 'FAB_COTTON_TWILL',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 10 }, end: { x: 0, y: flapH - 10 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#334155',
    };

    const pocketBagPiece: PatternPiece = {
      id: 'cargo_pocket_bag',
      name: 'Side Slant Pocket Bag',
      category: 'pocket',
      points: [
        { id: 'pb_tl', x: -90, y: 0, type: 'corner' },
        { id: 'pb_tr', x: 90, y: 0, type: 'corner' },
        { id: 'pb_br', x: 90, y: 240, type: 'corner' },
        { id: 'pb_bl', x: -90, y: 240, type: 'corner' },
      ],
      edges: [
        { id: 'e_pb_t', fromPointId: 'pb_tl', toPointId: 'pb_tr', type: 'line', name: 'Waist Bag Edge' },
        { id: 'e_pb_r', fromPointId: 'pb_tr', toPointId: 'pb_br', type: 'line', name: 'Bag Outseam' },
        { id: 'e_pb_b', fromPointId: 'pb_br', toPointId: 'pb_bl', type: 'line', name: 'Bag Bottom' },
        { id: 'e_pb_l', fromPointId: 'pb_bl', toPointId: 'pb_tl', type: 'line', name: 'Bag Inseam' },
      ],
      position: { x: 1280, y: 1100 },
      rotation: 0,
      mirror: false,
      cutQuantity: 2,
      fabricCode: 'FAB_COTTON_POPLIN',
      defaultSeamAllowance: 10,
      seamAllowanceEnabled: true,
      notches: [],
      darts: [],
      grainline: { start: { x: 0, y: 20 }, end: { x: 0, y: 220 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#cbd5e1',
    };

    return [
      ...basePieces,
      cargoLeft,
      cargoRight,
      flapLeft,
      flapRight,
      pocketBagPiece,
    ];
  };

  return {
    ...base,
    subcategory: 'Cargo Pants',
    modelId: 'moto-pants',
    generatePatterns,
  };
}
