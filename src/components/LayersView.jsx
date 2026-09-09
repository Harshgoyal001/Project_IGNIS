import {
  Flame,
  Factory,
  Gauge,
  Map as MapIcon,
  Satellite,
  Users,
  Database,
} from "lucide-react";
import { useThermalStore } from "../store/useThermalStore";
import { HOTSPOTS } from "../data/hotspots";
import { C, FONT_MONO } from "../theme";

const LAYER_DEFS = [
  {
    key: "hotspots",
    label: "FIRMS Hotspots",
    Icon: Flame,
    color: C.flare,
    source: "NASA FIRMS (VIIRS / MODIS)",
    desc: "Raw thermal anomaly detections — the base signal every other layer builds context around.",
  },
  {
    key: "facilities",
    label: "Industrial Facilities",
    Icon: Factory,
    color: C.blue,
    source: "OSM Overpass API",
    desc: "Nearest refinery, plant, or factory tags used for facility-level attribution.",
  },
  {
    key: "priorityShading",
    label: "Priority Risk Shading",
    Icon: Gauge,
    color: C.industrial,
    source: "Computed — Priority Score Engine",
    desc: "Weighted 0–100 score fusing persistence, intensity, and proximity factors.",
  },
  {
    key: "landCover",
    label: "Land Cover",
    Icon: MapIcon,
    color: C.teal,
    source: "ESA WorldCover / Dynamic World",
    desc: "Forest, agricultural, industrial, or ambiguous classification per anomaly location.",
  },
  {
    key: "satelliteBasemap",
    label: "Satellite Basemap",
    Icon: Satellite,
    color: C.crop,
    source: "Esri World Imagery",
    desc: "Structural corroboration — is there a visible facility, burn scar, or bare cropland.",
  },
  {
    key: "populationDensity",
    label: "Population Density",
    Icon: Users,
    color: C.wildfire,
    source: "WorldPop (optional)",
    desc: "Converts 'interesting' into 'urgent' by weighting proximity to populated areas.",
  },
];

const SOURCES = [
  { name: "NASA FIRMS", note: "Free API key, VIIRS/MODIS hotspots" },
  { name: "OSM Overpass API", note: "Free, no account needed" },
  { name: "ESA WorldCover", note: "Free via Google Earth Engine / STAC" },
  { name: "Sentinel-2 / Landsat", note: "Free via Copernicus Data Space" },
];

function Toggle({ on, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 38,
        height: 21,
        borderRadius: 999,
        background: on ? color : C.borderSoft,
        position: "relative",
        transition: "background 0.15s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 19 : 2,
          width: 17,
          height: 17,
          borderRadius: "50%",
          background: "#0A0F1C",
          transition: "left 0.15s",
        }}
      />
    </button>
  );
}

export default function LayersView() {
  const { layers, toggleLayer } = useThermalStore();
  const activeCount = Object.values(layers).filter(Boolean).length;

  return (
    <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 57px)" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div style={{ fontWeight: 600, fontSize: "16px" }}>Layers</div>
          <div style={{ color: C.textFaint, fontSize: "12px" }}>
            Control what's rendered on the GIS canvas in Map View
          </div>
        </div>
        <div
          style={{ background: C.panelAlt, border: `1px solid ${C.border}`, fontFamily: FONT_MONO, fontSize: "12px", color: C.textDim }}
          className="px-3 py-1.5 rounded-md"
        >
          {activeCount}/{LAYER_DEFS.length} active
        </div>
      </div>

      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {LAYER_DEFS.map(({ key, label, Icon, color, source, desc }) => {
          const on = layers[key];
          return (
            <div
              key={key}
              style={{
                background: C.panelAlt,
                border: `1px solid ${on ? color + "55" : C.border}`,
              }}
              className="rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    style={{ background: `${color}22`, border: `1px solid ${color}55` }}
                    className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                  >
                    <Icon size={15} color={color} />
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: "10.5px", color: C.textFaint, fontFamily: FONT_MONO }}>{source}</div>
                  </div>
                </div>
                <Toggle on={on} onClick={() => toggleLayer(key)} color={color} />
              </div>
              <div style={{ fontSize: "12px", color: C.textDim, lineHeight: 1.5 }}>{desc}</div>
            </div>
          );
        })}
      </div>

      <div style={{ background: C.panelAlt, border: `1px solid ${C.border}` }} className="rounded-lg p-4">
        <div className="flex items-center gap-1.5 mb-3" style={{ fontWeight: 600, fontSize: "13px" }}>
          <Database size={14} color={C.textDim} />
          Data Sources — all free, all API-accessible
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {SOURCES.map((s) => (
            <div
              key={s.name}
              style={{ background: C.panel, border: `1px solid ${C.border}` }}
              className="rounded-md px-3 py-2.5"
            >
              <div style={{ fontSize: "12.5px", fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontSize: "11px", color: C.textFaint }}>{s.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ color: C.textFaint, fontSize: "11px" }} className="mt-3">
        {HOTSPOTS.length} hotspots currently rendered from the active layer set above.
      </div>
    </div>
  );
}
