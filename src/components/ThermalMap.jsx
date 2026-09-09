import React from "react";
import { MapContainer, TileLayer, CircleMarker, Circle, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { HOTSPOTS } from "../data/hotspots";
import { CLASS_CONFIG, C, FONT_MONO } from "../theme";
import { useThermalStore } from "../store/useThermalStore";

const MAP_CENTER = [21.0, 82.2]; // Pan-India centroid of the active hotspot set

export default function ThermalMap() {
  const { layers, selectedId, setSelectedId, setHoveredId } = useThermalStore();

  return (
    <div
      style={{ border: `1px solid ${C.border}` }}
      className="relative flex-1 rounded-lg overflow-hidden"
    >
      <div
        style={{ color: C.textFaint, fontFamily: FONT_MONO, fontSize: "11px" }}
        className="absolute top-3 left-3 z-[1000] pointer-events-none"
      >
        PAN-INDIA · VIIRS/MODIS FUSION · LAST 5 DAYS
      </div>

      <MapContainer
        center={MAP_CENTER}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", background: C.bg }}
      >
        {/* Free, no-API-key satellite basemap (Esri World Imagery) — darkened via CSS filter in index.css */}
        {layers.satelliteBasemap && (
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        {layers.facilities &&
          HOTSPOTS.filter((h) => h.facility.distance !== null).map((h) => (
            <Circle
              key={`fac-${h.id}`}
              center={[h.lat, h.lng]}
              radius={2500}
              pathOptions={{ color: C.blue, weight: 1, dashArray: "4 4", fillOpacity: 0 }}
            />
          ))}

        {layers.hotspots &&
          HOTSPOTS.map((h) => {
            const cfg = CLASS_CONFIG[h.classification];
            const isSelected = selectedId === h.id;
            return (
              <CircleMarker
                key={h.id}
                center={[h.lat, h.lng]}
                radius={8 + h.priority / 12}
                pathOptions={{
                  color: isSelected ? "#0A0F1C" : "#0A0F1C",
                  weight: isSelected ? 3 : 1.5,
                  fillColor: cfg.color,
                  fillOpacity: 0.9,
                }}
                eventHandlers={{
                  click: () => setSelectedId(h.id),
                  mouseover: () => setHoveredId(h.id),
                  mouseout: () => setHoveredId(null),
                }}
              >
                <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: "11px" }}>
                    {h.id} · {h.classification}
                  </span>
                </Tooltip>
              </CircleMarker>
            );
          })}
      </MapContainer>

      {/* legend */}
      <div
        style={{ background: `${C.panel}dd`, border: `1px solid ${C.border}` }}
        className="absolute bottom-3 left-3 z-[1000] rounded-md px-3 py-2 flex flex-wrap gap-x-4 gap-y-1.5"
      >
        {Object.entries(CLASS_CONFIG).map(([label, cfg]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span style={{ background: cfg.color, width: 8, height: 8 }} className="rounded-full inline-block" />
            <span style={{ color: C.textDim, fontSize: "11px" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
