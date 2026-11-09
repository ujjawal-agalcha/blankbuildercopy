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
    const halfHip = (m.hipHalf || defaultMeasurements.hipHalf) / 2;
    const len = m.totalLength || defaultMeasurements.totalLength;
    const fRise = defaultMeasurements.frontRise;
    const thigh = m.thighHalf || defaultMeasurements.thighHalf;
    const hem = m.legOpeningHalf || defaultMeasurements.legOpeningHalf;

    // 1. FRONT LEG PIECE
    const frontPoints: ControlPoint[] = [
      { id: 'pf_waist_out', x: 0, y: 0, type: 'corner' },
      { id: 'pf_waist_cf', x: halfWaist, y: 15, type: 'corner' },
      { id: 'pf_crotch', x: thigh, y: fRise, type: 'smooth' },
      { id: 'pf_hem_in', x: hem, y: len, type: 'corner' },
      { id: 'pf_hem_out', x: 0, y: len, type: 'corner' },
      { id: 'pf_hip_out', x: -15, y: fRise * 0.7, type: 'smooth' },
    ];

    const frontEdges: Edge2D[] = [
      { id: 'e_pf_waist', fromPointId: 'pf_waist_out', toPointId: 'pf_waist_cf', type: 'line', name: 'Front Waist' },
      { id: 'e_pf_cf_crotch', fromPointId: 'pf_waist_cf', toPointId: 'pf_crotch', type: 'cubic-bezier', name: 'Front Crotch Curve' },
      { id: 'e_pf_inseam', fromPointId: 'pf_crotch', toPointId: 'pf_hem_in', type: 'line', name: 'Front Inseam' },
      { id: 'e_pf_hem', fromPointId: 'pf_hem_in', toPointId: 'pf_hem_out', type: 'line', name: 'Front Hem' },
      { id: 'e_pf_outseam', fromPointId: 'pf_hem_out', toPointId: 'pf_hip_out', type: 'line', name: 'Front Outseam Lower' },
      { id: 'e_pf_hip', fromPointId: 'pf_hip_out', toPointId: 'pf_waist_out', type: 'cubic-bezier', name: 'Front Outseam Upper' },
    ];

    const frontPiece: PatternPiece = {
      id: 'pants_front_leg',
      name: 'Pants Front Leg (Pair)',
      category: 'body',
      points: frontPoints,
      edges: frontEdges,
      position: { x: 450, y: 100 },
      rotation: 0,
      mirror: true,
      cutQuantity: 2,
      fabricCode: 'FAB_DENIM_RAW',
      defaultSeamAllowance: 12,
      seamAllowanceEnabled: true,
      notches: [{ id: 'n_pf_knee', edgeId: 'e_pf_inseam', distanceRatio: 0.5, type: 'single', depth: 4 }],
      darts: [],
      grainline: { start: { x: halfWaist * 0.5, y: 100 }, end: { x: halfWaist * 0.5, y: len - 100 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#3b82f6',
    };

    // 2. BACK LEG PIECE (Extended crotch extension for seat curve)
    const backPoints: ControlPoint[] = [
      { id: 'pb_waist_out', x: 0, y: 0, type: 'corner' },
      { id: 'pb_waist_cb', x: halfWaist + 20, y: -35, type: 'corner' },
      { id: 'pb_crotch', x: thigh + 55, y: fRise + 35, type: 'smooth' },
      { id: 'pb_hem_in', x: hem + 20, y: len, type: 'corner' },
      { id: 'pb_hem_out', x: -10, y: len, type: 'corner' },
    ];

    const backEdges: Edge2D[] = [
      { id: 'e_pb_waist', fromPointId: 'pb_waist_out', toPointId: 'pb_waist_cb', type: 'line', name: 'Back Waist' },
      { id: 'e_pb_cb_crotch', fromPointId: 'pb_waist_cb', toPointId: 'pb_crotch', type: 'cubic-bezier', name: 'Back Crotch Curve' },
      { id: 'e_pb_inseam', fromPointId: 'pb_crotch', toPointId: 'pb_hem_in', type: 'line', name: 'Back Inseam' },
      { id: 'e_pb_hem', fromPointId: 'pb_hem_in', toPointId: 'pb_hem_out', type: 'line', name: 'Back Hem' },
      { id: 'e_pb_outseam', fromPointId: 'pb_hem_out', toPointId: 'pb_waist_out', type: 'line', name: 'Back Outseam' },
    ];

    const backPiece: PatternPiece = {
      id: 'pants_back_leg',
      name: 'Pants Back Leg (Pair)',
      category: 'body',
      points: backPoints,
      edges: backEdges,
      position: { x: 1000, y: 100 },
      rotation: 0,
      mirror: true,
      cutQuantity: 2,
      fabricCode: 'FAB_DENIM_RAW',
      defaultSeamAllowance: 12,
      seamAllowanceEnabled: true,
      notches: [{ id: 'n_pb_knee', edgeId: 'e_pb_inseam', distanceRatio: 0.5, type: 'double', depth: 4 }],
      darts: [],
      grainline: { start: { x: halfWaist * 0.5, y: 100 }, end: { x: halfWaist * 0.5, y: len - 100 }, hasArrowBothEnds: true, angle: 90 },
      internalLines: [],
      color: '#1d4ed8',
    };

    return [frontPiece, backPiece];
  };

  const defaultSewing: SewingRelationship[] = [
    {
      id: 'sew_pants_inseam',
      name: 'Inseam',
      pieceAId: 'pants_front_leg',
      edgeAId: 'e_pf_inseam',
      pieceBId: 'pants_back_leg',
      edgeBId: 'e_pb_inseam',
      seamType: 'flat-felled',
      flipped: false,
      enabled: true,
    },
    {
      id: 'sew_pants_outseam',
      name: 'Outseam',
      pieceAId: 'pants_front_leg',
      edgeAId: 'e_pf_outseam',
      pieceBId: 'pants_back_leg',
      edgeBId: 'e_pb_outseam',
      seamType: 'topstitched',
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
    gradingRules: [],
    defaultFabricCode: 'FAB_DENIM_RAW',
    generatePatterns,
    defaultSewing,
  };
}

