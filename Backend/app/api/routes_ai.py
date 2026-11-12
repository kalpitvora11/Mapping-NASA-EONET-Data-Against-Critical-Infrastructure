from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import geopandas as gpd

from app.connectors.gdacs import fetch_event_polygon
from app.connectors.openmeteo import fetch_hydro_timeseries
from app.api.routes_impact import get_infrastructure_risk
from app.ai_models.forecaster import run_severity_forecast
from app.ai_models.llm_agent import generate_executive_briefing

router = APIRouter()

@router.get("/{event_type}/{event_id}/{episode_id}/briefing")
async def get_ai_briefing(event_type: str, event_id: int, episode_id: int):
    """
    The master endpoint: runs spatial analysis, AI forecasting, and LLM report generation.
    """
    risk_geojson = await get_infrastructure_risk(event_type, event_id, episode_id)
    
    risk_counts = {"CRITICAL_IMPACT": 0, "HIGH_RISK": 0, "ELEVATED": 0, "MONITORING": 0}
    if risk_geojson and "features" in risk_geojson:
        for feature in risk_geojson["features"]:
            tier = feature.get("properties", {}).get("risk_tier")
            if tier in risk_counts:
                risk_counts[tier] += 1

    polygon_geojson = await fetch_event_polygon(event_type, event_id, episode_id)
    if not polygon_geojson.get("features"):
        raise HTTPException(status_code=404, detail="Disaster polygon missing.")
        
    gdf = gpd.GeoDataFrame.from_features(polygon_geojson["features"])
    centroid = gdf.geometry.centroid.iloc[0]
    
    hydro_data = await fetch_hydro_timeseries(centroid.y, centroid.x)
    daily_discharge = hydro_data.get("daily", {}).get("river_discharge", [])
    
    forecast_metrics = {"p10": [], "p50": [], "p90": []}

    if hydro_data.get("metric") == "river_discharge" and daily_discharge:
        clean_history = [x for x in daily_discharge if x is not None]

        if len(clean_history) >= 14:
            forecast_metrics = run_severity_forecast(clean_history)

    event_name = f"{event_type} - ID: {event_id}"
    briefing_markdown = generate_executive_briefing(event_type, event_id, risk_counts, forecast_metrics)

    return {
        "event": event_name,
        "infrastructure_stats": risk_counts,
        "ai_forecast": forecast_metrics,
        "executive_briefing": briefing_markdown
    }
