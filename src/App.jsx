import { useState } from "react";
import { Map as MapIcon, BarChart3, Layers, Search, Info, Flame, MapPin, Satellite } from "lucide-react";
import ThermalMap from "./components/ThermalMap";
import LayersPanel from "./components/LayersPanel";
import IntelligenceCard from "./components/IntelligenceCard";
import StatisticsView from "./components/StatisticsView";
import LayersView from "./components/LayersView";
import ThermalHunt from "./components/ThermalHunt";
import AboutView from "./components/AboutView";
import { useThermalStore } from "./store/useThermalStore";
import { C, FONT_SANS, FONT_MONO } from "./theme";

const NAV_ITEMS = [
  { id: "map", label: "Map View", Icon: MapIcon },
  { id: "stats", label: "Statistics", Icon: BarChart3 },
  { id: "layers", label: "Layers", Icon: Layers },
  { id: "hunt", label: "Thermal Hunt", Icon: Search },
  { id: "about", label: "About", Icon: Info },
];

export default function App() {
  const [activeNav, setActiveNav] = useState("map");
  const selectedId = useThermalStore((s) => s.selectedId);

  return (
    <div
      style={{ background: C.bg, color: C.text, fontFamily: FONT_SANS, minHeight: "100vh" }}
      className="w-full overflow-hidden"
    >
      {/* Header */}
      <div
        style={{ borderColor: C.border, background: C.panel }}
        className="flex items-center justify-between px-5 py-3 border-b"
      >
        <div className="flex items-center gap-3">
          <div
            style={{ background: `linear-gradient(135deg, ${C.flare}, ${C.wildfire})` }}
            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
          >
            <Flame size={18} color="#0A0F1C" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-semibold leading-tight" style={{ fontSize: "15px" }}>
              THERMAL-EYE
            </div>
            <div style={{ color: C.textFaint, fontFamily: FONT_MONO, fontSize: "11px" }}>
              Thermal Anomaly Investigation Engine · SIH26162
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            style={{ background: C.panelAlt, border: `1px solid ${C.border}`, fontFamily: FONT_MONO, fontSize: "12px" }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md"
          >
            <MapPin size={13} color={C.textDim} />
            <span style={{ color: C.textDim }}>Region:</span>
            <span>Odisha Industrial Belt</span>
          </div>
          <div
            style={{ background: C.industrial, color: "#1A1206" }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
          >
            JD
          </div>
        </div>
      </div>

      <div className="flex" style={{ height: "calc(100vh - 57px)" }}>
        {/* Nav rail */}
        <div style={{ borderColor: C.border, background: C.panel }} className="w-16 sm:w-40 flex-shrink-0 border-r py-3">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = activeNav === id;
            return (
              <button
                key={id}
                onClick={() => setActiveNav(id)}
                style={{
                  color: active ? C.text : C.textFaint,
                  borderLeft: active ? `2px solid ${C.flare}` : "2px solid transparent",
                  background: active ? C.panelAlt : "transparent",
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors"
              >
                <Icon size={16} strokeWidth={2} className="flex-shrink-0" />
                <span className="hidden sm:inline" style={{ fontSize: "13px", fontWeight: active ? 600 : 400 }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {activeNav === "stats" ? (
          <StatisticsView />
        ) : activeNav === "layers" ? (
          <LayersView />
        ) : activeNav === "hunt" ? (
          <ThermalHunt />
        ) : activeNav === "about" ? (
          <AboutView />
        ) : (
          <>
            {/* Map area */}
            <div className="flex-1 relative p-4 flex flex-col">
              <ThermalMap />

              <div
                style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.textDim, fontSize: "12px" }}
                className="mt-3 rounded-lg px-4 py-2.5 flex items-center gap-2"
              >
                <Satellite size={14} color={C.blue} className="flex-shrink-0" />
                NASA FIRMS + OSM Overpass + Sentinel-2 spectral index, fused into an evidence-traceable classification —
                not just a hotspot on a map.
              </div>
            </div>

            {/* Right panel */}
            <div
              style={{ borderColor: C.border, background: C.panel }}
              className="w-[320px] flex-shrink-0 border-l overflow-y-auto hidden md:block"
            >
              {!selectedId ? <LayersPanel /> : <IntelligenceCard />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
