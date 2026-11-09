import { PatternPiece } from './cad';
import { GarmentTemplate, StandardSize } from './garment';
import { SewingRelationship } from './sewing';
import { ArtworkLayer } from './artwork';
import { FabricMaterial } from './material';
import { SceneSettings } from './scene';

export interface ProjectMetadata {
  id: string;
  name: string;
  author: string;
  season?: string;
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface ProjectData {
  metadata: ProjectMetadata;
  templateId: string;
  activeSize: StandardSize;
  measurements: Record<string, number>;
  patternPieces: PatternPiece[];
  sewingRelationships: SewingRelationship[];
  artworkLayers: ArtworkLayer[];
  fabric: FabricMaterial;
  sceneSettings: SceneSettings;
}

