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
    generatePatterns,
    defaultSewing,
  };
}
