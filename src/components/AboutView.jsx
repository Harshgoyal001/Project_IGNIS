import React from "react";
import { Flame, CheckCircle2, Users, Layers as LayersIcon, ArrowRight } from "lucide-react";
import { C, FONT_MONO } from "../theme";

const PIPELINE = [
  "FIRMS Detection",
  "Context (OSM + Land Cover)",
  "Classification",
  "Persistence",
  "Attribution",
  "Risk Score",
  "Evidence",
];

const USPS = [
  "Evidence-traceable classification — every label has a visible for/against evidence chain, not a black-box number.",
  "Persistence-aware reasoning — tells 'happened once' apart from 'happened 27 times this month.'",
  "Facility-level attribution — ties anomalies to real named industrial infrastructure via spatial joins.",
  "Honest uncertainty — an explicit 'Unknown / Insufficient Evidence' class instead of a forced guess.",
  "Priority scoring for triage — turns an unbounded hotspot stream into a ranked, actionable queue.",
];

const TECH = [
  "React", "Tailwind CSS", "Zustand", "Recharts", "Leaflet",
  "FastAPI", "GeoPandas", "XGBoost", "PostGIS-ready",
];

const TEAM = [
  { name: "Anjali & Yashika", role: "PPT & Research" },
  { name: "Harsh", role: "Frontend" },
  { name: "Kunal & Sanjeet", role: "Backend / Data Proof" },
  { name: "Yash", role: "Verifier — reality check" },
];

export default function AboutView() {
  return (
    <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 57px)" }}>
      <div className="flex items-center gap-3 mb-1">
        <div
          style={{ background: `linear-gradient(135deg, ${C.flare}, ${C.wildfire})` }}
          className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0"
        >
          <Flame size={18} color="#0A0F1C" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "16px" }}>THERMAL-EYE</div>
          <div style={{ color: C.textFaint, fontSize: "11.5px", fontFamily: FONT_MONO }}>SIH26162 · NTRO</div>
        </div>
      </div>

      {/* 3-line pitch */}
      <div
        style={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.flare}` }}
        className="rounded-lg p-4 my-4"
      >
        <div style={{ fontSize: "13px", lineHeight: 1.7, color: C.text }}>
          Satellite data (FIRMS) tells us <em>"it's hot here"</em> but not <em>"what's hot"</em> — a
          factory, a wildfire, or a farmer's field burning. THERMAL-EYE identifies which, explains why,
          and ranks the most important anomalies first — so nobody has to manually check 1,000
          hotspots.
        </div>
      </div>

      {/* Pipeline */}
      <div style={{ fontWeight: 600, fontSize: "13px" }} className="mb-2">
        Investigation Pipeline
      </div>
      <div className="flex flex-wrap items-center gap-1.5 mb-6">
        {PIPELINE.map((step, i) => (
          <React.Fragment key={step}>
            <div
              style={{ background: C.panelAlt, border: `1px solid ${C.border}`, fontSize: "11.5px" }}
              className="px-2.5 py-1.5 rounded-md"
            >
              {step}
            </div>
            {i < PIPELINE.length - 1 && <ArrowRight size={13} color={C.textFaint} className="flex-shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      {/* USPs */}
      <div style={{ fontWeight: 600, fontSize: "13px" }} className="mb-2">
        Why This Isn't Just a Hotspot Map
      </div>
      <div className="space-y-2 mb-6">
        {USPS.map((u) => (
          <div key={u} className="flex items-start gap-2">
            <CheckCircle2 size={15} color={C.teal} className="flex-shrink-0 mt-0.5" />
            <span style={{ fontSize: "12.5px", color: C.textDim, lineHeight: 1.5 }}>{u}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Tech stack */}
        <div style={{ background: C.panelAlt, border: `1px solid ${C.border}` }} className="rounded-lg p-4">
          <div className="flex items-center gap-1.5 mb-2.5" style={{ fontWeight: 600, fontSize: "13px" }}>
            <LayersIcon size={14} color={C.textDim} />
            Tech Stack
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TECH.map((t) => (
              <span
                key={t}
                style={{
                  background: C.panel,
                  border: `1px solid ${C.border}`,
                  color: C.textDim,
                  fontSize: "11px",
                  fontFamily: FONT_MONO,
                }}
                className="px-2 py-1 rounded"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ background: C.panelAlt, border: `1px solid ${C.border}` }} className="rounded-lg p-4">
          <div className="flex items-center gap-1.5 mb-2.5" style={{ fontWeight: 600, fontSize: "13px" }}>
            <Users size={14} color={C.textDim} />
            Team
          </div>
          <div className="space-y-1.5">
            {TEAM.map((t) => (
              <div key={t.name} className="flex items-center justify-between" style={{ fontSize: "12px" }}>
                <span style={{ color: C.text }}>{t.name}</span>
                <span style={{ color: C.textFaint, fontSize: "11px" }}>{t.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ color: C.textFaint, fontSize: "11px" }} className="mt-4">
        All data sources — NASA FIRMS, OSM Overpass, ESA WorldCover, Sentinel-2 — are free and
        API-accessible. No paid infrastructure required to reproduce this demo.
      </div>
    </div>
  );
}
