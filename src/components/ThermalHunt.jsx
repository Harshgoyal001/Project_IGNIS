import { useMemo, useState } from "react";
import { Search, MapPin, ArrowUpRight } from "lucide-react";
import { HOTSPOTS } from "../data/hotspots";
import { CLASS_CONFIG, C, FONT_MONO } from "../theme";
import { useThermalStore } from "../store/useThermalStore";
import IntelligenceCard from "./IntelligenceCard";

const EXAMPLE_QUERIES = [
  "persistent industrial thermal activity",
  "flare near refinery",
  "wildfire forest",
  "crop burning",
  "unknown low confidence",
];

function score(hotspot, query) {
  if (!query.trim()) return 1;
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = [
    hotspot.classification,
    hotspot.landCover,
    hotspot.facility.name,
    hotspot.id,
    hotspot.satellite,
    ...hotspot.evidenceFor,
  ]
    .join(" ")
    .toLowerCase();
  const hits = tokens.filter((t) => haystack.includes(t)).length;
  return hits / tokens.length;
}

export default function ThermalHunt() {
  const [query, setQuery] = useState("");
  const { selectedId, setSelectedId } = useThermalStore();

  const results = useMemo(() => {
    return HOTSPOTS.map((h) => ({ h, s: score(h, query) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || b.h.priority - a.h.priority)
      .map((r) => r.h);
  }, [query]);

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 57px)" }}>
        <div className="mb-1" style={{ fontWeight: 600, fontSize: "16px" }}>
          Thermal Hunt
        </div>
        <div style={{ color: C.textFaint, fontSize: "12px" }} className="mb-3">
          Describe what you're looking for in plain language — the query filters live against
          persistence, land cover, facility context, and evidence text.
        </div>

        <div
          style={{ background: C.panelAlt, border: `1px solid ${C.border}` }}
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 mb-3"
        >
          <Search size={16} color={C.textFaint} className="flex-shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='e.g. "abnormal persistent thermal activity near industrial regions"'
            style={{ background: "transparent", color: C.text, fontSize: "13px", outline: "none" }}
            className="flex-1"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => setQuery(q)}
              style={{
                background: query === q ? `${C.flare}22` : C.panelAlt,
                border: `1px solid ${query === q ? C.flare + "77" : C.border}`,
                color: query === q ? C.text : C.textDim,
                fontSize: "11.5px",
              }}
              className="px-2.5 py-1 rounded-full"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: "12px", color: C.textFaint, fontFamily: FONT_MONO }}>
            {results.length} match{results.length !== 1 ? "es" : ""}
          </span>
        </div>

        <div className="space-y-2">
          {results.map((h) => {
            const cfg = CLASS_CONFIG[h.classification];
            const isSelected = selectedId === h.id;
            const thumb = h.imagery?.swir || h.imagery?.optical;
            return (
              <button
                key={h.id}
                onClick={() => setSelectedId(h.id)}
                style={{
                  background: C.panelAlt,
                  border: `1px solid ${isSelected ? cfg.color + "77" : C.border}`,
                }}
                className="w-full text-left rounded-lg p-2.5 flex items-center gap-3 hover:border-slate-500 transition-colors"
              >
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-black flex-shrink-0 border border-[#22304A]">
                  {thumb ? (
                    <img src={thumb} alt={h.classification} className="w-full h-full object-cover" />
                  ) : (
                    <div
                      style={{ background: `${cfg.color}22` }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <cfg.Icon size={18} color={cfg.color} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "13px", fontWeight: 600, color: isSelected ? cfg.color : C.text }}>
                      {h.classification}
                    </span>
                    <span style={{ fontFamily: FONT_MONO, fontSize: "10.5px", color: C.textFaint }}>#{h.id}</span>
                  </div>
                  <div style={{ fontSize: "11.5px", color: C.textDim }} className="flex items-center gap-1 truncate">
                    <MapPin size={11} className="flex-shrink-0" />
                    {h.facility.name}
                    <span style={{ color: C.textFaint }}>· {h.landCover}</span>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right pr-1">
                  <div style={{ fontFamily: FONT_MONO, fontSize: "13px", fontWeight: 600, color: cfg.color }}>
                    {h.priority} <span style={{ fontSize: "9px", color: C.textDim }}>PRIO</span>
                  </div>
                  <div style={{ fontSize: "10.5px", color: C.flare, fontFamily: FONT_MONO }}>
                    {h.frp} MW
                  </div>
                </div>
                <ArrowUpRight size={14} color={C.textFaint} className="flex-shrink-0" />
              </button>
            );
          })}
          {results.length === 0 && (
            <div style={{ color: C.textFaint, fontSize: "12.5px" }} className="text-center py-8">
              No hotspots match that query. Try a different phrase or one of the examples above.
            </div>
          )}
        </div>
      </div>

      <div
        style={{ borderColor: C.border, background: C.panel }}
        className="w-[320px] flex-shrink-0 border-l overflow-y-auto hidden md:block"
      >
        {selectedId ? (
          <IntelligenceCard />
        ) : (
          <div style={{ color: C.textFaint, fontSize: "12.5px" }} className="p-4">
            Select a result to open its full Intelligence Card here.
          </div>
        )}
      </div>
    </div>
  );
}
