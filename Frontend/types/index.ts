/* Risk severity tiers, ordered from most to least severe */
export type EventSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

/* Category labels returned by EONET API (and the backend normaliser) */
export type EventCategory =
  | 'Wildfires'
  | 'Severe Storms'
  | 'Volcanoes'
  | 'Floods'
  | 'Sea and Lake Ice'
  | 'Dust and Haze'
  | 'Earthquakes';

/** Asset type icons are driven off this union in the UI */
export type AssetType = 'Power' | 'Health' | 'Transport' | 'Utility';

/**
 * A critical infrastructure asset that falls within the spatial buffer
 * of a hazard event. Field names match the FastAPI Pydantic model.
 */
export interface ExposedAsset {
  id: string;
  name: string;
  type: AssetType;
  distance_km: number;
  risk_level: EventSeverity;
  lat: number;
  lng: number;
}

/**
 * A single NASA EONET hazard event enriched with infrastructure analysis.
 */
export interface EonetEvent {
  id: string;
  title: string;
  category: EventCategory;
  severity: EventSeverity;
  threat_score: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  radius_km: number;
  exposed_assets: ExposedAsset[];
  summary: string;
}

/**
 * Live health status of each backend engine sub-system.
 * Returned by GET /api/status
 */
export interface SystemStatus {
  eonet_status: boolean;
  overpass_status: boolean;
  ollama_status: boolean;
  geopandas_status: boolean;
}