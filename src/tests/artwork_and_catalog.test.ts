import { describe, it, expect } from 'vitest';
import { mapPieceIdToModelPiece } from '../components/viewer3d/textureGenerator';
import { GARMENT_TEMPLATES, getTemplateById } from '../garments/catalog';
import { createTShirtTemplate } from '../garments/templates/tshirt';
import { createHoodieTemplate } from '../garments/templates/hoodie';
import { createPantsTemplate } from '../garments/templates/pants';
import { useGarmentStore } from '../store/useGarmentStore';
import { useDesignStore } from '../store/useDesignStore';

describe('Artwork Piece Mapping & UV Orientation', () => {
  it('correctly maps 2D pattern pieces to 3D model piece IDs', () => {
    expect(mapPieceIdToModelPiece('piece_front_body', 'front-chest')).toBe('front');
    expect(mapPieceIdToModelPiece('piece_back_body', 'back-full')).toBe('back');
    expect(mapPieceIdToModelPiece('piece_sleeve_left', 'sleeve-left')).toBe('sleeveL');
    expect(mapPieceIdToModelPiece('piece_sleeve_right', 'sleeve-right')).toBe('sleeveR');
    expect(mapPieceIdToModelPiece('hoodie_pocket', 'pocket-center')).toBe('pocket');
    expect(mapPieceIdToModelPiece('hoodie_hood_left', 'hood-left')).toBe('hoodL');
    expect(mapPieceIdToModelPiece('pants_front_leg_left', 'pant-left-thigh')).toBe('thighL');
    expect(mapPieceIdToModelPiece('pants_back_leg_left', 'pant-back-seat')).toBe('seatL');
  });

  it('preserves layer independence when moving artwork on front body vs sleeve', () => {
    const { addTextLayer, updateLayer, layers } = useDesignStore.getState();

    // Add front layer
    addTextLayer('piece_front_body', 'FRONT ARTWORK');
    const frontId = useDesignStore.getState().layers[0].id;

    // Add sleeve layer
    addTextLayer('piece_sleeve_left', 'SLEEVE LOGO');
    const sleeveId = useDesignStore.getState().layers[0].id;

    // Move front layer
    updateLayer(frontId, { x: 50, y: -20 });

    const currentLayers = useDesignStore.getState().layers;
    const updatedFront = currentLayers.find((l) => l.id === frontId)!;
    const updatedSleeve = currentLayers.find((l) => l.id === sleeveId)!;

    expect(updatedFront.x).toBe(50);
    expect(updatedFront.y).toBe(-20);
    expect(updatedSleeve.x).toBe(0); // Sleeve layer is unaffected!
    expect(updatedSleeve.y).toBe(0);
  });
});

describe('Garment-Specific 2D Pattern Generation', () => {
  it('generates 5 distinct pattern pieces for T-Shirt (front, back, left sleeve, right sleeve, neck rib)', () => {
    const tpl = createTShirtTemplate('test_tee', 'Oversized Tee', 'oversized', 'Test', {
      chestWidth: 620,
      bodyLength: 750,
      shoulderWidth: 560,
      sleeveLength: 250,
      sleeveOpening: 210,
      neckWidth: 195,
      neckDepthFront: 95,
      neckDepthBack: 25,
      hemWidth: 620,
      collarHeight: 30,
    });

    const pieces = tpl.generatePatterns({});
    expect(pieces.length).toBe(5);

    const pieceIds = pieces.map((p) => p.id);
    expect(pieceIds).toContain('piece_front_body');
    expect(pieceIds).toContain('piece_back_body');
    expect(pieceIds).toContain('piece_sleeve_left');
    expect(pieceIds).toContain('piece_sleeve_right');
    expect(pieceIds).toContain('piece_neck_rib');

    // Both sleeves have their own distinct geometry and IDs
    const sleeveL = pieces.find((p) => p.id === 'piece_sleeve_left')!;
    const sleeveR = pieces.find((p) => p.id === 'piece_sleeve_right')!;
    expect(sleeveL.edges.length).toBeGreaterThan(4);
    expect(sleeveR.edges.length).toBeGreaterThan(4);
    expect(sleeveL.position.y).not.toBe(sleeveR.position.y); // Placed at different workspace coordinates
  });

  it('generates 7 distinct pattern pieces for Hoodie (front, back, pocket, left sleeve, right sleeve, left hood, right hood)', () => {
    const hoodie = createHoodieTemplate('test_hoodie', 'Pullover Hoodie', 'oversized', 'Test Hoodie');
    const pieces = hoodie.generatePatterns({});

    expect(pieces.length).toBe(7);
    const pieceIds = pieces.map((p) => p.id);
    expect(pieceIds).toContain('hoodie_front');
    expect(pieceIds).toContain('hoodie_back');
    expect(pieceIds).toContain('hoodie_pocket');
    expect(pieceIds).toContain('hoodie_sleeve_left');
    expect(pieceIds).toContain('hoodie_sleeve_right');
    expect(pieceIds).toContain('hoodie_hood_left');
    expect(pieceIds).toContain('hoodie_hood_right');
  });

  it('generates 5 distinct pattern pieces for Pants (front left leg, front right leg, back left leg, back right leg, waistband)', () => {
    const pants = createPantsTemplate('test_pants', 'Straight Jeans', 'straight', 'Test Pants');
    const pieces = pants.generatePatterns({});

    expect(pieces.length).toBe(5);
    const pieceIds = pieces.map((p) => p.id);
    expect(pieceIds).toContain('pants_front_leg_left');
    expect(pieceIds).toContain('pants_front_leg_right');
    expect(pieceIds).toContain('pants_back_leg_left');
    expect(pieceIds).toContain('pants_back_leg_right');
    expect(pieceIds).toContain('pants_waistband');
  });
});

describe('132+ Garment Catalog Integrity', () => {
  it('has at least 132 configured garments in the catalog', () => {
    expect(GARMENT_TEMPLATES.length).toBeGreaterThanOrEqual(132);
  });

  it('every garment template defines valid pattern generator, measurements, and grading rules', () => {
    GARMENT_TEMPLATES.forEach((tpl) => {
      expect(tpl.id).toBeDefined();
      expect(tpl.name).toBeDefined();
      expect(tpl.category).toBeDefined();
      expect(tpl.measurements.length).toBeGreaterThanOrEqual(4);
      expect(tpl.gradingRules.length).toBeGreaterThanOrEqual(5);

      const pieces = tpl.generatePatterns({});
      expect(pieces.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('retrieves template by ID accurately without fallback if exists', () => {
    const hoodie = getTemplateById('hoodie_pullover');
    expect(hoodie.id).toBe('hoodie_pullover');
    expect(hoodie.name).toContain('Hoodie');

    const pants = getTemplateById('pants_straight_jeans');
    expect(pants.id).toBe('pants_straight_jeans');
  });
});

describe('Manual 2D Position Editing & Sizing Persistence', () => {
  it('updates piece position and does not snap back', () => {
    const store = useGarmentStore.getState();
    const firstPiece = store.pieces[0];

    store.updatePiecePosition(firstPiece.id, 999, 888);

    const updated = useGarmentStore.getState().pieces.find((p) => p.id === firstPiece.id)!;
    expect(updated.position.x).toBe(999);
    expect(updated.position.y).toBe(888);
  });

  it('rotates a pattern piece freely', () => {
    const store = useGarmentStore.getState();
    const piece = store.pieces[0];
    const initialRot = piece.rotation;

    store.rotatePiece(piece.id, 90);

    const updated = useGarmentStore.getState().pieces.find((p) => p.id === piece.id)!;
    expect(updated.rotation).toBe((initialRot + 90) % 360);
  });

  it('applies size grading deltas from XS to XXL and updates measurements', () => {
    const store = useGarmentStore.getState();
    store.setActiveSize('XXL');

    const xxlMeasurements = useGarmentStore.getState().measurements;
    expect(useGarmentStore.getState().activeSize).toBe('XXL');
    expect(xxlMeasurements.chestWidth).toBeGreaterThan(600);
  });
});

