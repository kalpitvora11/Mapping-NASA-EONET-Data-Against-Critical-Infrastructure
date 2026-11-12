
import ollama
from typing import Dict, List


def generate_executive_briefing(
    event_type: str,
    event_id: int,
    risk_counts: Dict[str, int],
    forecast: Dict[str, List[float]]
) -> str:

    type_map = {
        "TC": "Tropical Cyclone / Hurricane",
        "FL": "Severe Flood",
        "WF": "Wildfire / Forest Fire",
        "EQ": "Earthquake"
    }

    hazard_name = type_map.get(event_type, "Hazardous Event")

        # Generate a factual overview using verified event information.
    overview = (
        f"A {hazard_name} event (ID: {event_id}) is under assessment. "
        "This report summarizes the available infrastructure risk "
        "and AI forecast data."
    )

    # Generate infrastructure statistics directly from backend data.
    critical = risk_counts.get("CRITICAL_IMPACT", 0)
    high = risk_counts.get("HIGH_RISK", 0)
    elevated = risk_counts.get("ELEVATED", 0)
    monitoring = risk_counts.get("MONITORING", 0)

    # Generate forecast information directly from Chronos.
    p10 = forecast.get("p10", [])
    p50 = forecast.get("p50", [])
    p90 = forecast.get("p90", [])

    has_forecast = bool(p10 and p50 and p90)

    briefing = f"""### SITUATION OVERVIEW

{overview}

### INFRASTRUCTURE AT RISK

| Risk Category | Distance from Hazard | Asset Count |
|---|---|---:|
| Critical Impact | Inside hazard polygon | {critical} |
| High Risk | Within 5 km | {high} |
| Elevated Risk | Within 15 km | {elevated} |
| Monitoring | Beyond 15 km | {monitoring} |

### AI TRAJECTORY

"""

    if has_forecast:
        briefing += f"""Chronos-Bolt generated a 7-day forecast.

- **P10 (Lower quantile):** {p10}
- **P50 (Median quantile):** {p50}
- **P90 (Upper quantile):** {p90}

These are model forecast values. They should not be interpreted as
water levels, percentages, or guaranteed outcomes without additional
unit and calibration information.
"""
    else:
        briefing += (
            "No valid river-discharge forecast is currently available. "
            "The AI trajectory cannot be assessed from the available data."
        )

    return briefing
