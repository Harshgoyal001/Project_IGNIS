// NASA FIRMS (VIIRS / MODIS) + Sentinel-2 MSI + OSM Overpass Fusion Feed
// Calibrated telemetry dataset for SIH26162 / NTRO Thermal Anomaly Engine

export const HOTSPOTS = [
  {
    id: "TH-1048",
    lat: 20.316,
    lng: 86.611,
    classification: "Gas Flare",
    confidence: 91,
    priority: 82,
    persistenceDays: 24,
    windowDays: 30,
    facility: { name: "Paradip Refinery Complex", distance: 42 },
    landCover: "Industrial (Built-up Class 50)",
    satellite: "Continuous elevated flare stack observed; intense thermal radiance core.",
    frp: 58.4, // Fire Radiative Power in MW
    brightnessTemp: 358.2, // Kelvin (VIIRS I-4 Channel)
    sensor: "Sentinel-2 MSI (10m) / VIIRS I-4 (375m)",
    acquired: "2026-03-08 05:42 UTC (Day Pass)",
    wind: "11 km/h @ 195° S",
    imagery: {
      optical: "/images/hotspots/th-1048-optical.jpg",
      swir: "/images/hotspots/th-1048-swir.jpg",
      baseline: null,
      resolution: "10m / pixel (Sentinel-2 L2A)",
      bands: "B12 (2190nm), B8A (865nm), B4 (665nm)",
      interpretation: "Intense concentrated SWIR radiance at the tip of the refinery flare stack. Surrounding storage units remain thermal baseline cool.",
    },
    evidenceFor: [
      "Persistent across 24/30 days in 30-day temporal window",
      "Located 42m from refinery infrastructure centroid",
      "Point-source SWIR saturation typical of hydrocarbon flare combustion",
      "Industrial land cover with zero spatial drift",
    ],
    evidenceAgainst: [
      "Moderate wind causing slight smoke plume drift across perimeter",
      "FIRMS 375m pixel resolution encompasses nearby storage tanks",
    ],
  },
  {
    id: "TH-1091",
    lat: 20.8397,
    lng: 85.1019,
    classification: "Industrial Process",
    confidence: 78,
    priority: 64,
    persistenceDays: 18,
    windowDays: 30,
    facility: { name: "Angul Steel & Power", distance: 120 },
    landCover: "Industrial (Heavy Metal Fabrication)",
    satellite: "Blast furnace and slag discharge thermal bloom identified.",
    frp: 74.1, // Fire Radiative Power in MW
    brightnessTemp: 366.5, // Kelvin
    sensor: "Sentinel-2 MSI (10m) / NOAA-20 VIIRS",
    acquired: "2026-03-08 06:12 UTC (Day Pass)",
    wind: "8 km/h @ 160° SSE",
    imagery: {
      optical: "/images/hotspots/th-1091-optical.jpg",
      swir: "/images/hotspots/th-1091-swir.jpg",
      baseline: null,
      resolution: "10m / pixel (Sentinel-2 L2A)",
      bands: "B12 (2190nm), B11 (1610nm), B4 (665nm)",
      interpretation: "Thermal signature correlates directly with molten slag discharge pit and furnace core within mapped industrial polygon.",
    },
    evidenceFor: [
      "Day/night cyclic thermal regularity matching plant shift operations",
      "Located inside designated metallurgical manufacturing polygon",
      "Stable spatial coordinates over 18 observed passes",
      "High FRP (74.1 MW) characteristic of molten metal / slag cooling",
    ],
    evidenceAgainst: [
      "Moderate offset (120m) from tagged facility centroid",
    ],
  },
  {
    id: "TH-1122",
    lat: 21.55,
    lng: 84.05,
    classification: "Wildfire",
    confidence: 89,
    priority: 88,
    persistenceDays: 3,
    windowDays: 30,
    facility: { name: "None within 5km (Reserve Forest)", distance: null },
    landCover: "Deciduous Forest Canopy (Class 10)",
    satellite: "Active 1.8km flame front with dense drifting smoke and severe burn scar.",
    frp: 184.6, // Fire Radiative Power in MW (severe wildfire)
    brightnessTemp: 384.9, // Kelvin
    sensor: "Sentinel-2 MSI (10m) / Suomi NPP VIIRS",
    acquired: "2026-03-08 07:18 UTC (Day Pass)",
    wind: "22 km/h @ 225° SW",
    imagery: {
      optical: "/images/hotspots/th-1122-optical.jpg",
      swir: "/images/hotspots/th-1122-swir.jpg",
      baseline: "/images/hotspots/th-1122-baseline.jpg",
      resolution: "10m / pixel (Sentinel-2 L2A)",
      bands: "B12 (2190nm), B8A (865nm), B4 (665nm)",
      interpretation: "SWIR infrared pierces dense smoke column, revealing active propagating flame front and dark charred burn scar over 45 hectares.",
    },
    evidenceFor: [
      "Transient emergence — zero thermal detections in preceding 27 days",
      "Dense forest canopy with high fuel-load biomass index (NDVI > 0.65)",
      "Continuous spatial drift (1.8km spread) along prevailing 22 km/h SW wind",
      "Critical FRP surge (184.6 MW) indicating active uncontrolled biomass combustion",
    ],
    evidenceAgainst: [
      "High atmospheric smoke density partially scatters optical spectrum",
    ],
  },
  {
    id: "TH-1156",
    lat: 19.85,
    lng: 85.9,
    classification: "Crop Burning",
    confidence: 73,
    priority: 41,
    persistenceDays: 6,
    windowDays: 30,
    facility: { name: "None within 5km (Farmland)", distance: null },
    landCover: "Cropland / Post-Harvest Stubble (Class 40)",
    satellite: "Segmented burn scars along agricultural parcel boundaries with active flame lines.",
    frp: 28.3, // Fire Radiative Power in MW
    brightnessTemp: 329.1, // Kelvin
    sensor: "Sentinel-2 MSI (10m) / Aqua MODIS",
    acquired: "2026-03-08 08:05 UTC (Day Pass)",
    wind: "14 km/h @ 180° S",
    imagery: {
      optical: "/images/hotspots/th-1156-optical.jpg",
      swir: "/images/hotspots/th-1156-swir.jpg",
      baseline: null,
      resolution: "10m / pixel (Sentinel-2 L2A)",
      bands: "B12 (2190nm), B8A (865nm), B4 (665nm)",
      interpretation: "Thin flaming lines advancing across harvested paddy parcels. Distinct geometric parcel boundaries evident in post-burn charcoal reflectance.",
    },
    evidenceFor: [
      "Spatial clustering with simultaneous adjacent agricultural plot fires",
      "ESA WorldCover Class 40 (Cropland) alignment",
      "Low to moderate FRP (28.3 MW) typical of rapid grass/stubble burning",
      "Characteristic post-harvest seasonal timing",
    ],
    evidenceAgainst: [
      "Short burn duration per field causes frequent satellite pass misses",
    ],
  },
  {
    id: "TH-1203",
    lat: 20.1,
    lng: 85.55,
    classification: "Unknown",
    confidence: 38,
    priority: 27,
    persistenceDays: 2,
    windowDays: 30,
    facility: { name: "None within 5km", distance: null },
    landCover: "Ambiguous (Optical Occlusion)",
    satellite: "Dense monsoon stratus/cumulus cloud layer completely blocking surface view.",
    frp: 12.8, // Fire Radiative Power in MW
    brightnessTemp: 304.2, // Kelvin
    sensor: "Suomi NPP VIIRS (375m)",
    acquired: "2026-03-08 06:45 UTC (Day Pass)",
    wind: "18 km/h @ 240° WSW",
    imagery: {
      optical: "/images/hotspots/th-1203-optical.jpg",
      swir: null,
      baseline: null,
      resolution: "10m / pixel (Sentinel-2 L2A)",
      bands: "Optical RGB (B4, B3, B2)",
      interpretation: "Complete cloud deck obstruction (>95% cloud fraction). Thermal signature cannot be corroborated with optical or SWIR structural evidence.",
    },
    evidenceFor: [
      "Two isolated VIIRS mid-infrared thermal detections",
      "Marginal brightness temperature delta above local terrain background",
    ],
    evidenceAgainst: [
      "No industrial facility or mapped settlement within 5km",
      "Optical and SWIR satellite verification fully obscured by cloud deck",
      "Confidence calibrated below 40% threshold — triage requires revisit",
    ],
  },
  {
    id: "TH-1240",
    lat: 20.95,
    lng: 85.2333,
    classification: "Gas Flare",
    confidence: 88,
    priority: 76,
    persistenceDays: 27,
    windowDays: 30,
    facility: { name: "Talcher Gas Terminal", distance: 65 },
    landCover: "Industrial (Natural Gas Terminal)",
    satellite: "Clean hydrocarbon flare stack visible; persistent localized point source.",
    frp: 49.7, // Fire Radiative Power in MW
    brightnessTemp: 352.4, // Kelvin
    sensor: "Sentinel-2 MSI (10m) / VIIRS I-4",
    acquired: "2026-03-08 07:02 UTC (Day Pass)",
    wind: "9 km/h @ 200° SSW",
    imagery: {
      optical: "/images/hotspots/th-1240-optical.jpg",
      swir: "/images/hotspots/th-1240-swir.jpg",
      baseline: null,
      resolution: "10m / pixel (Sentinel-2 L2A)",
      bands: "B12 (2190nm), B8A (865nm), B4 (665nm)",
      interpretation: "Isolated elevated flare stack combustion. Near-zero spatial variance across 27 detection cycles confirms permanent operational flare.",
    },
    evidenceFor: [
      "High persistence index (detected in 27 of past 30 days)",
      "Located 65m from registered gas pipeline compression terminal",
      "Pinpoint SWIR infrared saturation with no ground footprint expansion",
      "Consistent heat signature across night and day satellite passes",
    ],
    evidenceAgainst: [
      "Minor flaring throughput fluctuations recorded over last 5 days",
    ],
  },
];

export function persistenceStrip(activeDays, windowDays) {
  // Deterministic pseudo-pattern simulating satellite overpass detections
  const cells = [];
  let seed = activeDays * 7 + windowDays;
  for (let i = 0; i < windowDays; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const chance = seed / 233280;
    cells.push(chance < activeDays / windowDays);
  }
  return cells;
}
