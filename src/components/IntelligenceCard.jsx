import { useState } from "react";
import {
  ChevronLeft,
  X,
  Factory,
  Map as MapIcon,
  Satellite,
  ShieldAlert,
  Flame,
  Wind,
  Thermometer,
  Maximize2,
  Eye,
  Sliders,
  Sparkles,
} from "lucide-react";
import { HOTSPOTS, persistenceStrip } from "../data/hotspots";
import { CLASS_CONFIG, C, FONT_MONO } from "../theme";
import { useThermalStore } from "../store/useThermalStore";

function RiskRing({ value, color }) {
  const size = 74;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.borderSoft} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function IntelligenceCard() {
  const { selectedId, setSelectedId } = useThermalStore();
  const [bandMode, setBandMode] = useState("optical"); // 'optical' | 'swir' | 'compare'
  const [sliderPos, setSliderPos] = useState(50);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hotspot = HOTSPOTS.find((h) => h.id === selectedId);
  if (!hotspot) return null;

  const cfg = CLASS_CONFIG[hotspot.classification];
  const strip = persistenceStrip(hotspot.persistenceDays, hotspot.windowDays);
  const Icon = cfg.Icon;
  const onBack = () => setSelectedId(null);
  const img = hotspot.imagery;

  const hasSwir = Boolean(img?.swir);
  const hasBaseline = Boolean(img?.baseline);

  const currentDisplayImage =
    bandMode === "swir" && hasSwir
      ? img.swir
      : img?.optical;

  return (
    <div className="p-4 relative">
      {/* Back button & ID */}
      <button
        onClick={onBack}
        style={{ color: C.textDim, fontSize: "12px" }}
        className="flex items-center gap-1 mb-3 hover:opacity-80 transition-opacity"
      >
        <ChevronLeft size={14} />
        Back to layers
      </button>

      <div className="flex items-start justify-between mb-1">
        <div style={{ fontFamily: FONT_MONO, color: C.textFaint, fontSize: "11px" }}>
          HOTSPOT #{hotspot.id} · {hotspot.sensor.split("/")[0].trim()}
        </div>
        <button onClick={onBack} style={{ color: C.textFaint }} className="hover:text-white">
          <X size={14} />
        </button>
      </div>

      {/* Header Badge */}
      <div className="flex items-center gap-2 mb-3">
        <div
          style={{ background: `${cfg.color}22`, border: `1px solid ${cfg.color}55` }}
          className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
        >
          <Icon size={16} color={cfg.color} />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "14px", color: cfg.color }}>{hotspot.classification}</div>
          <div style={{ color: C.textFaint, fontSize: "11.5px", fontFamily: FONT_MONO }}>
            Confidence {hotspot.confidence}% · {hotspot.acquired}
          </div>
        </div>
      </div>

      {/* MULTI-SPECTRAL SATELLITE EVIDENCE CARD */}
      <div
        style={{ background: C.panelAlt, border: `1px solid ${C.border}` }}
        className="rounded-lg overflow-hidden mb-4"
      >
        <div className="px-3 py-2 border-b border-[#22304A] flex items-center justify-between">
          <div className="flex items-center gap-1.5" style={{ fontSize: "11px", fontWeight: 600, color: C.text }}>
            <Satellite size={13} color={C.blue} />
            <span>SATELLITE EVIDENCE CHIP</span>
          </div>
          <div style={{ fontFamily: FONT_MONO, fontSize: "10px", color: C.teal }}>
            {img?.resolution || "10m Resolution"}
          </div>
        </div>

        {/* Band Switcher Tabs */}
        <div className="flex bg-[#0A0F1C] border-b border-[#22304A] text-[11px] p-1 gap-1">
          <button
            onClick={() => setBandMode("optical")}
            style={{
              background: bandMode === "optical" ? C.panelAlt : "transparent",
              color: bandMode === "optical" ? C.text : C.textFaint,
              border: bandMode === "optical" ? `1px solid ${C.border}` : "1px solid transparent",
            }}
            className="flex-1 py-1 rounded flex items-center justify-center gap-1 transition-all"
          >
            <Eye size={12} />
            <span>Visible (RGB)</span>
          </button>

          {hasSwir && (
            <button
              onClick={() => setBandMode("swir")}
              style={{
                background: bandMode === "swir" ? `${C.flare}22` : "transparent",
                color: bandMode === "swir" ? C.flare : C.textFaint,
                border: bandMode === "swir" ? `1px solid ${C.flare}55` : "1px solid transparent",
              }}
              className="flex-1 py-1 rounded flex items-center justify-center gap-1 transition-all"
            >
              <Sparkles size={12} />
              <span>SWIR Infrared</span>
            </button>
          )}

          {hasBaseline && (
            <button
              onClick={() => setBandMode("compare")}
              style={{
                background: bandMode === "compare" ? `${C.teal}22` : "transparent",
                color: bandMode === "compare" ? C.teal : C.textFaint,
                border: bandMode === "compare" ? `1px solid ${C.teal}55` : "1px solid transparent",
              }}
              className="flex-1 py-1 rounded flex items-center justify-center gap-1 transition-all"
            >
              <Sliders size={12} />
              <span>Before/After</span>
            </button>
          )}
        </div>

        {/* Visual Canvas Area */}
        <div className="relative w-full h-[190px] bg-black overflow-hidden group">
          {bandMode === "compare" && hasBaseline ? (
            /* Interactive Split Comparison Slider */
            <div className="relative w-full h-full select-none">
              {/* After (Active Fire / Flare) */}
              <img
                src={img.optical}
                alt="Active event"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span
                style={{ fontFamily: FONT_MONO }}
                className="absolute top-2 right-2 text-[10px] bg-red-950/80 text-red-300 px-1.5 py-0.5 rounded border border-red-700/50 z-10"
              >
                ACTIVE EVENT
              </span>

              {/* Before (Baseline Green) clipped by sliderPos */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={img.baseline}
                  alt="Baseline pre-event"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: "100%", minWidth: "288px" }}
                />
                <span
                  style={{ fontFamily: FONT_MONO }}
                  className="absolute top-2 left-2 text-[10px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700/50 z-10"
                >
                  PRE-BURN BASELINE
                </span>
              </div>

              {/* Draggable Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none z-20 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-white/90 text-black flex items-center justify-center text-[10px] shadow font-bold">
                  ↔
                </div>
              </div>

              {/* Range Input Overlay for scrub */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />
            </div>
          ) : (
            /* Single Band Image with Tactical HUD */
            <>
              <img
                src={currentDisplayImage}
                alt={hotspot.classification}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Corner HUD Badges */}
              <div className="absolute top-2 left-2 bg-[#0A0F1C]/80 backdrop-blur-sm border border-[#22304A] px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400">
                {bandMode === "swir" ? "SWIR B12 (2190nm)" : "TRUE COLOR RGB"}
              </div>

              <div className="absolute top-2 right-2 bg-[#0A0F1C]/80 backdrop-blur-sm border border-[#22304A] px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 flex items-center gap-1">
                <Flame size={10} color={C.flare} />
                <span>{hotspot.frp} MW</span>
              </div>

              <div className="absolute bottom-2 left-2 bg-[#0A0F1C]/80 backdrop-blur-sm border border-[#22304A] px-2 py-0.5 rounded text-[9.5px] font-mono text-slate-300">
                {hotspot.acquired.split("(")[0]}
              </div>

              {/* Click to Enlarge Button */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-md border border-white/20 transition-all opacity-80 hover:opacity-100"
                title="Expand Fullscreen Imagery"
              >
                <Maximize2 size={13} />
              </button>
            </>
          )}
        </div>

        {/* Analyst Interpretation Footer */}
        <div className="p-2.5 bg-[#111A2B] text-[11.5px] text-slate-300 leading-relaxed border-t border-[#22304A]">
          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mb-1">
            <span style={{ color: C.teal }}>●</span>
            <span>SPECTRAL ANALYSIS · {img?.bands}</span>
          </div>
          {img?.interpretation}
        </div>
      </div>

      {/* DEFENSE-GRADE TELEMETRY GRID */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {/* Fire Radiative Power */}
        <div style={{ background: C.panelAlt, border: `1px solid ${C.border}` }} className="p-2 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5 font-mono">
            <Flame size={11} color={C.flare} />
            <span>FRP</span>
          </div>
          <div style={{ fontFamily: FONT_MONO, color: C.flare }} className="text-sm font-semibold">
            {hotspot.frp} <span className="text-[9px] font-normal text-slate-400">MW</span>
          </div>
        </div>

        {/* Brightness Temperature */}
        <div style={{ background: C.panelAlt, border: `1px solid ${C.border}` }} className="p-2 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5 font-mono">
            <Thermometer size={11} color={C.industrial} />
            <span>BRIGHT. T</span>
          </div>
          <div style={{ fontFamily: FONT_MONO, color: C.text }} className="text-sm font-semibold">
            {hotspot.brightnessTemp} <span className="text-[9px] font-normal text-slate-400">K</span>
          </div>
          <div className="text-[9.5px] text-slate-500 font-mono">
            ({(hotspot.brightnessTemp - 273.15).toFixed(1)}°C)
          </div>
        </div>

        {/* Local Wind Vector */}
        <div style={{ background: C.panelAlt, border: `1px solid ${C.border}` }} className="p-2 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5 font-mono">
            <Wind size={11} color={C.blue} />
            <span>WIND</span>
          </div>
          <div style={{ fontFamily: FONT_MONO, color: C.text }} className="text-[11.5px] font-semibold truncate">
            {hotspot.wind.split("@")[0].trim()}
          </div>
          <div className="text-[9px] text-slate-400 font-mono truncate">
            @{hotspot.wind.split("@")[1]?.trim() || "CALM"}
          </div>
        </div>
      </div>

      {/* PRIORITY SCORE CARD */}
      <div
        style={{ background: C.panelAlt, border: `1px solid ${C.border}` }}
        className="rounded-lg p-3 mb-4 flex items-center gap-4"
      >
        <div className="relative flex-shrink-0" style={{ width: 74, height: 74 }}>
          <RiskRing value={hotspot.priority} color={cfg.color} />
          <div
            style={{ fontFamily: FONT_MONO, fontSize: "16px", fontWeight: 600 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {hotspot.priority}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "12.5px", fontWeight: 600 }}>Priority Score</div>
          <div style={{ color: C.textDim, fontSize: "11.5px", lineHeight: 1.4 }}>
            Calibrated against FRP intensity, multi-pass persistence, wind vector, and facility proximity.
          </div>
        </div>
      </div>

      {/* PERSISTENCE STRIP */}
      <div className="mb-4">
        <div className="flex justify-between mb-1.5" style={{ fontSize: "12px" }}>
          <span style={{ color: C.textDim }}>Persistence Timeline</span>
          <span style={{ fontFamily: FONT_MONO, color: C.textFaint }}>
            {hotspot.persistenceDays}/{hotspot.windowDays} days detected
          </span>
        </div>
        <div className="flex gap-[2px]">
          {strip.map((active, i) => (
            <div
              key={i}
              style={{ background: active ? cfg.color : C.borderSoft, height: "16px" }}
              className="flex-1 rounded-[1px]"
              title={`Day ${i + 1}: ${active ? "Thermal Anomaly Detected" : "Nominal Background"}`}
            />
          ))}
        </div>
      </div>

      {/* GEOGRAPHIC CONTEXT */}
      <div className="space-y-2.5 mb-4" style={{ fontSize: "12.5px" }}>
        <div className="flex items-start gap-2">
          <Factory size={14} color={C.blue} className="flex-shrink-0 mt-0.5" />
          <div>
            <span style={{ color: C.textDim }}>Nearest facility: </span>
            {hotspot.facility.name}
            {hotspot.facility.distance !== null && (
              <span style={{ color: C.textFaint, fontFamily: FONT_MONO }}> · {hotspot.facility.distance}m</span>
            )}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapIcon size={14} color={C.teal} className="flex-shrink-0 mt-0.5" />
          <div>
            <span style={{ color: C.textDim }}>Land cover: </span>
            {hotspot.landCover}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Satellite size={14} color={C.industrial} className="flex-shrink-0 mt-0.5" />
          <div>
            <span style={{ color: C.textDim }}>Sensor payload: </span>
            <span style={{ fontFamily: FONT_MONO, fontSize: "11.5px" }}>{hotspot.sensor}</span>
          </div>
        </div>
      </div>

      {/* EVIDENCE CHAIN */}
      <div style={{ background: C.panelAlt, border: `1px solid ${C.border}` }} className="rounded-lg p-3">
        <div className="flex items-center gap-1.5 mb-2" style={{ fontWeight: 600, fontSize: "12.5px" }}>
          <ShieldAlert size={14} color={C.textDim} />
          Why this classification?
        </div>
        <div className="space-y-1 mb-2.5">
          {hotspot.evidenceFor.map((e, i) => (
            <div key={i} style={{ fontSize: "12px", color: C.textDim }} className="flex items-start gap-1.5">
              <span style={{ color: C.teal }}>✓</span>
              {e}
            </div>
          ))}
        </div>
        {hotspot.evidenceAgainst.length > 0 && (
          <>
            <div style={{ color: C.textFaint, fontSize: "11px", fontFamily: FONT_MONO }} className="mb-1">
              COUNTER-EVIDENCE
            </div>
            <div className="space-y-1">
              {hotspot.evidenceAgainst.map((e, i) => (
                <div key={i} style={{ fontSize: "12px", color: C.textDim }} className="flex items-start gap-1.5">
                  <span style={{ color: C.industrial }}>⚠</span>
                  {e}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="bg-[#111A2B] border border-[#22304A] rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-[#22304A] flex items-center justify-between">
              <div>
                <div className="font-semibold text-white flex items-center gap-2">
                  <span>{hotspot.classification} Imagery Dossier</span>
                  <span className="font-mono text-xs text-slate-400">#{hotspot.id}</span>
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  {hotspot.facility.name} · {hotspot.lat.toFixed(4)}°N, {hotspot.lng.toFixed(4)}°E
                </div>
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="w-8 h-8 rounded-full bg-[#16223A] border border-[#22304A] flex items-center justify-center text-slate-300 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body: Side by side images */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-mono text-cyan-400 mb-1.5 flex items-center justify-between">
                  <span>OPTICAL TRUE COLOR (RGB)</span>
                  <span className="text-slate-500">Bands 4, 3, 2</span>
                </div>
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#22304A] bg-black">
                  <img src={img.optical} alt="Optical RGB" className="w-full h-full object-cover" />
                </div>
                <div className="text-[11px] text-slate-400 mt-1.5">
                  Natural color representation showing surface topography, structural installations, and smoke plumes.
                </div>
              </div>

              {hasSwir ? (
                <div>
                  <div className="text-xs font-mono text-amber-400 mb-1.5 flex items-center justify-between">
                    <span>SWIR INFRARED (B12/8A/4)</span>
                    <span className="text-slate-500">2190nm / 865nm / 665nm</span>
                  </div>
                  <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#22304A] bg-black">
                    <img src={img.swir} alt="SWIR Infrared" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1.5">
                    Atmospheric penetration highlighting radiant thermal combustion and high-temperature point sources.
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-mono text-amber-400 mb-1.5">
                    SENSOR OCCLUSION DIAGNOSTIC
                  </div>
                  <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#22304A] bg-black/60 flex flex-col items-center justify-center p-6 text-center">
                    <ShieldAlert size={32} color={C.industrial} className="mb-2" />
                    <div className="text-sm font-semibold text-slate-200">SWIR Channel Unavailable</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Dense meteorological cloud cover prevents optical and short-wave infrared surface transmission.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-[#0A0F1C] border-t border-[#22304A] flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4 font-mono text-[11px]">
                <span>FRP: <strong className="text-amber-300">{hotspot.frp} MW</strong></span>
                <span>Temp: <strong className="text-white">{hotspot.brightnessTemp} K</strong></span>
                <span>Wind: <strong className="text-blue-300">{hotspot.wind}</strong></span>
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="px-3 py-1 bg-[#16223A] hover:bg-[#22304A] text-white rounded text-xs border border-[#22304A]"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
