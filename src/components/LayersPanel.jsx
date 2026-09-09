import { Radio } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { HOTSPOTS } from "../data/hotspots";
import { CLASS_CONFIG, C, FONT_MONO } from "../theme";
import { useThermalStore } from "../store/useThermalStore";

const LAYER_OPTIONS = [
  { key: "hotspots", label: "FIRMS Hotspots" },
  { key: "facilities", label: "Industrial Facilities" },
  { key: "priorityShading", label: "Priority Shading" },
];

export default function LayersPanel() {
  const { layers, toggleLayer } = useThermalStore();

  const counts = HOTSPOTS.reduce((acc, h) => {
    acc[h.classification] = (acc[h.classification] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    color: CLASS_CONFIG[name].color,
  }));

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold" style={{ fontSize: "14px" }}>
          Layers
        </span>
      </div>
      <div className="space-y-2 mb-5">
        {LAYER_OPTIONS.map((l) => (
          <label
            key={l.key}
            style={{ background: C.panelAlt, border: `1px solid ${C.border}` }}
            className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer"
          >
            <span style={{ fontSize: "13px" }}>{l.label}</span>
            <input
              type="checkbox"
              checked={layers[l.key]}
              onChange={() => toggleLayer(l.key)}
              style={{ accentColor: C.flare }}
            />
          </label>
        ))}
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold" style={{ fontSize: "14px" }}>
          Classification Mix
        </span>
        <span style={{ color: C.textFaint, fontFamily: FONT_MONO, fontSize: "11px" }}>
          {HOTSPOTS.length} active
        </span>
      </div>
      <div style={{ height: 190 }} className="mb-5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 12, top: 4, bottom: 4 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fill: C.textDim, fontSize: 11 }}
              axisLine={{ stroke: C.border }}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: C.panelAlt }}
              contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: "12px" }}
              labelStyle={{ color: C.text }}
            />
            <Bar dataKey="count" radius={[0, 3, 3, 0]} barSize={14}>
              {chartData.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.textDim, fontSize: "12px" }}
        className="rounded-md px-3 py-3 leading-relaxed"
      >
        <div className="flex items-center gap-1.5 mb-1.5" style={{ color: C.text, fontWeight: 600, fontSize: "12.5px" }}>
          <Radio size={13} color={C.flare} />
          Click any hotspot
        </div>
        to open its full Intelligence Card — persistence history, facility attribution, land cover, satellite
        corroboration, and a ranked priority score.
      </div>
    </div>
  );
}
