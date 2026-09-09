import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Circle, Tooltip, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Flame, ArrowRight, Activity, Crosshair } from "lucide-react";
import { HOTSPOTS } from "../data/hotspots";
import { CLASS_CONFIG, C, FONT_MONO } from "../theme";
import { useThermalStore } from "../store/useThermalStore";

const ODISHA_CENTER = [20.6, 85.4];

function CoordinateTracker({ onMove }) {
  useMapEvents({
    mousemove(e) {
      onMove(e.latlng);
    },
  });
  return null;
}

export default function ThermalMap() {
  const { layers, selectedId, setSelectedId, setHoveredId } = useThermalStore();
  const [cursorCoords, setCursorCoords] = useState({ lat: 20.6124, lng: 85.4218 });

  return (
    <div
      style={{ border: `1px solid ${C.border}` }}
      className="relative flex-1 rounded-lg overflow-hidden"
    >
      {/* Top Left Title HUD */}
      <div
        style={{ color: C.textFaint, fontFamily: FONT_MONO, fontSize: "11px" }}
        className="absolute top-3 left-3 z-[1000] pointer-events-none flex items-center gap-2 bg-[#0A0F1C]/80 px-2.5 py-1 rounded border border-[#22304A]/60 backdrop-blur-sm"
      >
        <Activity size={12} color={C.teal} className="animate-pulse" />
        <span>ODISHA AOI · SENTINEL-2 & VIIRS FUSION STREAM</span>
      </div>

      {/* Top Right Coordinate & Telemetry HUD */}
      <div
        style={{ color: C.textDim, fontFamily: FONT_MONO, fontSize: "10.5px" }}
        className="absolute top-3 right-3 z-[1000] pointer-events-none hidden sm:flex items-center gap-2 bg-[#0A0F1C]/85 px-3 py-1.5 rounded border border-[#22304A] backdrop-blur-sm shadow"
      >
        <Crosshair size={12} color={C.blue} />
        <span>LAT: {cursorCoords.lat.toFixed(4)}°N</span>
        <span className="text-slate-600">|</span>
        <span>LNG: {cursorCoords.lng.toFixed(4)}°E</span>
        <span className="text-slate-600">|</span>
        <span className="text-emerald-400">FEED: SYNCED</span>
      </div>

      <MapContainer
        center={ODISHA_CENTER}
        zoom={7}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", background: C.bg }}
      >
        <CoordinateTracker onMove={setCursorCoords} />

        {/* Free, no-API-key satellite basemap (Esri World Imagery) — darkened via CSS filter in index.css */}
        {layers.satelliteBasemap && (
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        {/* Facility Buffers */}
        {layers.facilities &&
          HOTSPOTS.filter((h) => h.facility.distance !== null).map((h) => (
            <Circle
              key={`fac-${h.id}`}
              center={[h.lat, h.lng]}
              radius={2500}
              pathOptions={{ color: C.blue, weight: 1, dashArray: "4 4", fillOpacity: 0.04, fillColor: C.blue }}
            />
          ))}

        {/* Thermal Dispersion Shading */}
        {layers.priorityShading &&
          HOTSPOTS.map((h) => {
            const cfg = CLASS_CONFIG[h.classification];
            return (
              <Circle
                key={`heat-${h.id}`}
                center={[h.lat, h.lng]}
                radius={3000 + h.frp * 25}
                pathOptions={{
                  color: cfg.color,
                  weight: 0,
                  fillColor: cfg.color,
                  fillOpacity: 0.12,
                }}
              />
            );
          })}

        {/* Hotspots Markers with Rich Popups */}
        {layers.hotspots &&
          HOTSPOTS.map((h) => {
            const cfg = CLASS_CONFIG[h.classification];
            const isSelected = selectedId === h.id;
            const previewImg = h.imagery?.swir || h.imagery?.optical;

            return (
              <CircleMarker
                key={h.id}
                center={[h.lat, h.lng]}
                radius={8 + h.priority / 12}
                pathOptions={{
                  color: isSelected ? "#FFFFFF" : "#0A0F1C",
                  weight: isSelected ? 3 : 1.5,
                  fillColor: cfg.color,
                  fillOpacity: 0.95,
                }}
                eventHandlers={{
                  click: () => setSelectedId(h.id),
                  mouseover: () => setHoveredId(h.id),
                  mouseout: () => setHoveredId(null),
                }}
              >
                <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: "11px" }}>
                    {h.id} · {h.classification} ({h.frp} MW)
                  </span>
                </Tooltip>

                <Popup minWidth={240} maxWidth={260} className="custom-dark-popup">
                  <div className="text-slate-100 overflow-hidden rounded-md">
                    {/* Image Banner */}
                    {previewImg && (
                      <div className="relative h-24 w-full bg-black overflow-hidden">
                        <img
                          src={previewImg}
                          alt={h.classification}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1.5 left-1.5 bg-[#0A0F1C]/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-cyan-300">
                          {h.imagery?.swir ? "SWIR INFRARED" : "OPTICAL RGB"}
                        </div>
                        <div className="absolute top-1.5 right-1.5 bg-red-950/80 border border-red-700/50 px-1.5 py-0.5 rounded text-[9px] font-mono text-red-300 flex items-center gap-0.5">
                          <Flame size={9} color={C.flare} />
                          <span>{h.frp} MW</span>
                        </div>
                      </div>
                    )}

                    {/* Content Body */}
                    <div className="p-3 bg-[#111A2B]">
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ color: cfg.color }} className="font-semibold text-xs">
                          {h.classification}
                        </span>
                        <span style={{ fontFamily: FONT_MONO }} className="text-[10px] text-slate-400">
                          #{h.id}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300 mb-2 truncate">
                        {h.facility.name !== "None within 5km" ? h.facility.name : h.landCover}
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[10px] font-mono bg-[#16223A] p-1.5 rounded mb-2.5">
                        <div className="text-slate-400">
                          TEMP: <span className="text-slate-200">{h.brightnessTemp}K</span>
                        </div>
                        <div className="text-slate-400 text-right">
                          PERSIST: <span className="text-slate-200">{h.persistenceDays}/30d</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedId(h.id)}
                        style={{ background: C.flare }}
                        className="w-full py-1.5 px-2 rounded text-[11px] font-semibold text-[#0A0F1C] flex items-center justify-center gap-1 hover:brightness-110 transition-all cursor-pointer shadow"
                      >
                        <span>Open Intelligence Dossier</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>

      {/* Legend */}
      <div
        style={{ background: `${C.panel}dd`, border: `1px solid ${C.border}` }}
        className="absolute bottom-3 left-3 z-[1000] rounded-md px-3 py-2 flex flex-wrap gap-x-4 gap-y-1.5 backdrop-blur-sm"
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
