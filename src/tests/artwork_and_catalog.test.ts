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
    expect(sleeveL.position.x).not.toBe(sleeveR.position.x); // Placed at distinct workspace coordinates
  });

  it('generates 11 distinct pattern pieces for Hoodie (front, back, pocket, left/right sleeves, left/right cuffs, left/right hood, gusset, waistband)', () => {
    const hoodie = createHoodieTemplate('test_hoodie', 'Pullover Hoodie', 'oversized', 'Test Hoodie');
    const pieces = hoodie.generatePatterns({});

    expect(pieces.length).toBe(11);
    const pieceIds = pieces.map((p) => p.id);
    expect(pieceIds).toContain('hoodie_front');
    expect(pieceIds).toContain('hoodie_back');
    expect(pieceIds).toContain('hoodie_pocket');
    expect(pieceIds).toContain('hoodie_sleeve_left');
    expect(pieceIds).toContain('hoodie_sleeve_right');
    expect(pieceIds).toContain('hoodie_cuff_left');
    expect(pieceIds).toContain('hoodie_cuff_right');
    expect(pieceIds).toContain('hoodie_hood_left');
    expect(pieceIds).toContain('hoodie_hood_right');
    expect(pieceIds).toContain('hoodie_hood_gusset');
    expect(pieceIds).toContain('hoodie_waistband');
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

describe('Catalog-to-Model Mapping & Construction Verification', () => {
  it('maps Oversized T-Shirt to tee-oversize-1 with 5 distinct pieces', () => {
    const tpl = getTemplateById('tshirt_oversized');
    expect(tpl.modelId).toBe('tee-oversize-1');
    const pieces = tpl.generatePatterns({});
    expect(pieces.length).toBe(5);
  });

  it('maps Regular T-Shirt to tee-t5 with 5 distinct pieces', () => {
    const tpl = getTemplateById('tshirt_regular');
    expect(tpl.modelId).toBe('tee-t5');
    const pieces = tpl.generatePatterns({});
    expect(pieces.length).toBe(5);
  });

  it('maps Classic Hoodie to hoodie model with 11 distinct pieces', () => {
    const tpl = getTemplateById('hoodie_classic');
    expect(tpl.modelId).toBe('hoodie');
    const pieces = tpl.generatePatterns({});
    expect(pieces.length).toBe(11);
  });

  it('maps Zip-Up Hoodie to hoodie-body with 13 split front, pocket, cuff, and facing pieces', () => {
    const tpl = getTemplateById('hoodie_zip_up');
    expect(tpl.modelId).toBe('hoodie-body');
    const pieces = tpl.generatePatterns({});
    expect(pieces.length).toBe(13);
    const pieceIds = pieces.map((p) => p.id);
    expect(pieceIds).toContain('hoodie_front_left');
    expect(pieceIds).toContain('hoodie_front_right');
    expect(pieceIds).toContain('hoodie_pocket_left');
    expect(pieceIds).toContain('hoodie_pocket_right');
    expect(pieceIds).toContain('hoodie_zipper_facing');
  });

  it('maps Sweatshirt to hoodie-flat with 9 sweatshirt pieces', () => {
    const tpl = getTemplateById('sweatshirt_classic');
    expect(tpl.modelId).toBe('hoodie-flat');
    const pieces = tpl.generatePatterns({});
    expect(pieces.length).toBe(9);
    const pieceIds = pieces.map((p) => p.id);
    expect(pieceIds).toContain('sweatshirt_front');
    expect(pieceIds).toContain('sweatshirt_collar_rib');
    expect(pieceIds).toContain('sweatshirt_waistband_rib');
    expect(pieceIds).toContain('sweatshirt_v_insert');
  });

  it('maps Jeans to moto-pants with 11 pieces including back yokes, patch pockets, coin pocket, and fly shield', () => {
    const tpl = getTemplateById('pants_straight_jeans');
    expect(tpl.modelId).toBe('moto-pants');
    const pieces = tpl.generatePatterns({});
    expect(pieces.length).toBe(11);
    const pieceIds = pieces.map((p) => p.id);
    expect(pieceIds).toContain('jeans_yoke_left');
    expect(pieceIds).toContain('jeans_yoke_right');
    expect(pieceIds).toContain('jeans_back_pocket_left');
    expect(pieceIds).toContain('jeans_coin_pocket');
    expect(pieceIds).toContain('jeans_fly_shield');
  });

  it('maps Cargo Pants to moto-pants with 10 pieces including bellows cargo pockets and flaps', () => {
    const tpl = getTemplateById('pants_cargo');
    expect(tpl.modelId).toBe('moto-pants');
    const pieces = tpl.generatePatterns({});
    expect(pieces.length).toBe(10);
    const pieceIds = pieces.map((p) => p.id);
    expect(pieceIds).toContain('cargo_pocket_left');
    expect(pieceIds).toContain('cargo_pocket_right');
    expect(pieceIds).toContain('cargo_flap_left');
    expect(pieceIds).toContain('cargo_flap_right');
  });

  it('maps Bomber Jacket to hoodie-body with jacket construction', () => {
    const tpl = getTemplateById('jacket_bomber');
    expect(tpl.modelId).toBe('hoodie-body');
    const pieces = tpl.generatePatterns({});
    expect(pieces.length).toBeGreaterThanOrEqual(7);
  });

  it('maps Tank Top to tee-t5 with 5 sleeveless binding pieces', () => {
    const tpl = getTemplateById('tank_classic');
    expect(tpl.modelId).toBe('tee-t5');
    const pieces = tpl.generatePatterns({});
    expect(pieces.length).toBe(5);
    const pieceIds = pieces.map((p) => p.id);
    expect(pieceIds).toContain('tank_front_body');
    expect(pieceIds).toContain('tank_neck_binding');
    expect(pieceIds).toContain('tank_arm_binding_left');
  });

  it('maps Casual Button-Up Shirt to shirt-short-sleeve with 11 distinct pieces', () => {
    const tpl = getTemplateById('shirt_button_up');
    expect(tpl.modelId).toBe('shirt-short-sleeve');
    const pieces = tpl.generatePatterns({});
    expect(pieces.length).toBe(11);
    const pieceIds = pieces.map((p) => p.id);
    expect(pieceIds).toContain('shirt_front_left');
    expect(pieceIds).toContain('shirt_front_right');
    expect(pieceIds).toContain('shirt_back_body');
    expect(pieceIds).toContain('shirt_back_yoke');
    expect(pieceIds).toContain('shirt_sleeve_left');
    expect(pieceIds).toContain('shirt_sleeve_right');
    expect(pieceIds).toContain('shirt_cuff_left');
    expect(pieceIds).toContain('shirt_cuff_right');
    expect(pieceIds).toContain('shirt_collar_leaf');
    expect(pieceIds).toContain('shirt_collar_stand');
    expect(pieceIds).toContain('shirt_chest_pocket');
  });

  it('generates 7 distinct pieces for Long Sleeve T-Shirt', () => {
    const tpl = getTemplateById('tshirt_baseball');
    expect(tpl.modelId).toBe('tee-longsleeve');
    const pieces = tpl.generatePatterns({});
    expect(pieces.length).toBe(7);
    const pieceIds = pieces.map((p) => p.id);
    expect(pieceIds).toContain('piece_sleeve_left');
    expect(pieceIds).toContain('piece_sleeve_right');
    expect(pieceIds).toContain('piece_sleeve_cuff_left');
    expect(pieceIds).toContain('piece_sleeve_cuff_right');
  });

  it('generates 6 pieces for Pocket T-Shirt and 7 pieces for Ringer T-Shirt', () => {
    const pocketTpl = getTemplateById('tshirt_pocket');
    const pocketPieces = pocketTpl.generatePatterns({});
    expect(pocketPieces.length).toBe(6);
    expect(pocketPieces.map((p) => p.id)).toContain('piece_chest_pocket');

    const ringerTpl = getTemplateById('tshirt_ringer');
    const ringerPieces = ringerTpl.generatePatterns({});
    expect(ringerPieces.length).toBe(7);
    expect(ringerPieces.map((p) => p.id)).toContain('piece_sleeve_binding_left');
    expect(ringerPieces.map((p) => p.id)).toContain('piece_sleeve_binding_right');
  });

  it('contains exactly 132 unique garments in the master catalog loaded from individual folders', () => {
    expect(GARMENT_TEMPLATES.length).toBe(132);
    const ids = new Set(GARMENT_TEMPLATES.map((g) => g.id));
    expect(ids.size).toBe(132);

    // Verify all garments generate valid pattern pieces and have a non-empty name and modelId
    for (const garment of GARMENT_TEMPLATES) {
      expect(garment.id).toBeTruthy();
      expect(garment.name).toBeTruthy();
      expect(garment.modelId).toBeTruthy();
      const pieces = garment.generatePatterns({});
      expect(pieces.length).toBeGreaterThanOrEqual(2);
      for (const piece of pieces) {
        expect(piece.points.length).toBeGreaterThanOrEqual(3);
        expect(Number.isFinite(piece.position.x)).toBe(true);
        expect(Number.isFinite(piece.position.y)).toBe(true);
      }
    }
  });
});

describe('Auto-Arrange & Fabric Roll Nesting', () => {
  it('arranges pattern pieces in clear non-overlapping rows without NaN values', async () => {
    const { autoArrangePatternPieces } = await import('../geometry/nesting');
    const teeTpl = getTemplateById('tshirt_regular');
    const pieces = teeTpl.generatePatterns({});

    const arranged = autoArrangePatternPieces(pieces, 50);
    expect(arranged.length).toBe(pieces.length);

    // Verify all pieces have valid finite coordinates
    for (const p of arranged) {
      expect(Number.isFinite(p.position.x)).toBe(true);
      expect(Number.isFinite(p.position.y)).toBe(true);
    }

    // Verify pieces are separated (no duplicate positions)
    const posKeys = arranged.map((p) => `${p.position.x},${p.position.y}`);
    const uniquePositions = new Set(posKeys);
    expect(uniquePositions.size).toBe(arranged.length);
  });

  it('nests pattern pieces on a 1500mm fabric roll and calculates length and efficiency', async () => {
    const { nestPiecesForCutting } = await import('../geometry/nesting');
    const hoodieTpl = getTemplateById('hoodie_classic');
    const pieces = hoodieTpl.generatePatterns({});

    const result = nestPiecesForCutting(pieces, 1450, 30);
    expect(result.pieces.length).toBe(pieces.length);
    expect(result.totalLengthMm).toBeGreaterThan(0);
    expect(result.efficiency).toBeGreaterThan(0);
    expect(result.efficiency).toBeLessThanOrEqual(100);
  });
});


