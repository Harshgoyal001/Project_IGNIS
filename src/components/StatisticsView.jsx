import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { Flame, ShieldCheck, Radar } from "lucide-react";
import { HOTSPOTS, persistenceStrip } from "../data/hotspots";
import { CLASS_CONFIG, C, FONT_MONO } from "../theme";

function StatCard({ Icon, label, value, sub, color }) {
  return (
    <div
      style={{ background: C.panelAlt, border: `1px solid ${C.border}` }}
      className="rounded-lg p-4 flex-1 min-w-[160px]"
    >
      <div className="flex items-center justify-between mb-2">
        <span style={{ color: C.textDim, fontSize: "12px" }}>{label}</span>
        <Icon size={15} color={color} />
      </div>
      <div style={{ fontFamily: FONT_MONO, fontSize: "24px", fontWeight: 600 }}>{value}</div>
      {sub && (
        <div style={{ color: C.textFaint, fontSize: "11px" }} className="mt-1">
          {sub}
        </div>
      )}
    </div>
  );
}

// Radial gauge — same visual language as the Intelligence Card's priority ring
function RadialGauge({ value, color, size = 64, stroke = 6 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
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
      <div
        style={{ fontFamily: FONT_MONO, fontSize: "14px", fontWeight: 600 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {value}
      </div>
    </div>
  );
}

function GaugeStatCard({ label, value, sub, color }) {
  return (
    <div
      style={{ background: C.panelAlt, border: `1px solid ${C.border}` }}
      className="rounded-lg p-4 flex-1 min-w-[160px] flex items-center gap-3"
    >
      <RadialGauge value={value} color={color} />
      <div>
        <div style={{ color: C.textDim, fontSize: "12px" }}>{label}</div>
        <div style={{ fontFamily: FONT_MONO, fontSize: "18px", fontWeight: 600 }}>{value}</div>
        {sub && <div style={{ color: C.textFaint, fontSize: "10.5px" }}>{sub}</div>}
      </div>
    </div>
  );
}

// Priority score buckets, low → high severity
const PRIORITY_BUCKETS = [
  { range: "0-20", min: 0, max: 20, color: C.teal },
  { range: "21-40", min: 21, max: 40, color: C.blue },
  { range: "41-60", min: 41, max: 60, color: C.industrial },
  { range: "61-80", min: 61, max: 80, color: C.flare },
  { range: "81-100", min: 81, max: 100, color: C.wildfire },
];

export default function StatisticsView() {
  const total = HOTSPOTS.length;
  const avgPriority = Math.round(HOTSPOTS.reduce((s, h) => s + h.priority, 0) / total);
  const highPriority = HOTSPOTS.filter((h) => h.priority >= 70).length;
  const avgPersistence = Math.round(
    (HOTSPOTS.reduce((s, h) => s + h.persistenceDays / h.windowDays, 0) * 100) / total
  );

  const classCounts = HOTSPOTS.reduce((acc, h) => {
    acc[h.classification] = (acc[h.classification] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(classCounts).map(([name, value]) => ({
    name,
    value,
    color: CLASS_CONFIG[name].color,
  }));

  // Histogram: bucket priority scores into ranges instead of one bar per hotspot
  const histogramData = PRIORITY_BUCKETS.map((b) => ({
    range: b.range,
    count: HOTSPOTS.filter((h) => h.priority >= b.min && h.priority <= b.max).length,
    color: b.color,
  }));

  const landCoverCounts = HOTSPOTS.reduce((acc, h) => {
    acc[h.landCover] = (acc[h.landCover] || 0) + 1;
    return acc;
  }, {});
  const landCoverData = Object.entries(landCoverCounts).map(([name, count]) => ({ name, count }));

  // Real 30-day time series: reuse each hotspot's deterministic persistence strip
  // and sum how many hotspots were actively detected on each day of the window.
  const dailyTrend = Array.from({ length: 30 }, (_, dayIndex) => {
    const count = HOTSPOTS.reduce((sum, h) => {
      const strip = persistenceStrip(h.persistenceDays, h.windowDays);
      return sum + (strip[dayIndex] ? 1 : 0);
    }, 0);
    return { day: `D${dayIndex + 1}`, detections: count };
  });

  return (
    <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 57px)" }}>
      <div className="mb-4">
        <div style={{ fontWeight: 600, fontSize: "16px" }}>Statistics</div>
        <div style={{ color: C.textFaint, fontSize: "12px" }}>
          Aggregated across all active hotspots in the current 30-day window
        </div>
      </div>

      {/* Summary cards */}
      <div className="flex flex-wrap gap-3 mb-5">
        <StatCard Icon={Flame} label="Active Hotspots" value={total} sub="Odisha Industrial Belt" color={C.flare} />
        <GaugeStatCard label="Avg Priority Score" value={avgPriority} sub="out of 100" color={C.industrial} />
        <StatCard
          Icon={ShieldCheck}
          label="High Priority"
          value={highPriority}
          sub="score \u2265 70, needs review"
          color={C.wildfire}
        />
        <StatCard Icon={Radar} label="Avg Persistence" value={`${avgPersistence}%`} sub="of the 30-day window" color={C.teal} />
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Classification donut */}
        <div style={{ background: C.panelAlt, border: `1px solid ${C.border}` }} className="rounded-lg p-4">
          <div style={{ fontWeight: 600, fontSize: "13px" }} className="mb-3">
            Classification Breakdown
          </div>
          <div className="flex items-center gap-4">
            <div style={{ width: 140, height: 140 }} className="flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={40} outerRadius={65} paddingAngle={2} stroke="none">
                    {pieData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: "12px" }}
                    labelStyle={{ color: C.text }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 flex-1">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center justify-between" style={{ fontSize: "12px" }}>
                  <div className="flex items-center gap-1.5">
                    <span style={{ background: d.color, width: 8, height: 8 }} className="rounded-full inline-block" />
                    <span style={{ color: C.textDim }}>{d.name}</span>
                  </div>
                  <span style={{ fontFamily: FONT_MONO, color: C.textFaint }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Land cover breakdown — now horizontal */}
        <div style={{ background: C.panelAlt, border: `1px solid ${C.border}` }} className="rounded-lg p-4">
          <div style={{ fontWeight: 600, fontSize: "13px" }} className="mb-3">
            Land Cover Distribution
          </div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={landCoverData} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.borderSoft} horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fill: C.textDim, fontSize: 11 }} axisLine={{ stroke: C.border }} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  tick={{ fill: C.textDim, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: C.panel }}
                  contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: "12px" }}
                  labelStyle={{ color: C.text }}
                />
                <Bar dataKey="count" fill={C.blue} radius={[0, 3, 3, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority histogram */}
        <div
          style={{ background: C.panelAlt, border: `1px solid ${C.border}`, gridColumn: "1 / -1" }}
          className="rounded-lg p-4"
        >
          <div style={{ fontWeight: 600, fontSize: "13px" }} className="mb-3">
            Priority Score Distribution
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.borderSoft} vertical={false} />
                <XAxis dataKey="range" tick={{ fill: C.textDim, fontSize: 11 }} axisLine={{ stroke: C.border }} tickLine={false} />
                <YAxis
                  tick={{ fill: C.textDim, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: C.panel }}
                  contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: "12px" }}
                  labelStyle={{ color: C.text }}
                />
                <Bar dataKey="count" radius={[3, 3, 0, 0]} barSize={40}>
                  {histogramData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real 30-day time series */}
        <div
          style={{ background: C.panelAlt, border: `1px solid ${C.border}`, gridColumn: "1 / -1" }}
          className="rounded-lg p-4"
        >
          <div style={{ fontWeight: 600, fontSize: "13px" }} className="mb-3">
            30-Day Detection Trend
          </div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrend} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.flare} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={C.flare} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.borderSoft} vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: C.textFaint, fontSize: 10 }}
                  axisLine={{ stroke: C.border }}
                  tickLine={false}
                  interval={4}
                />
                <YAxis tick={{ fill: C.textDim, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: "12px" }}
                  labelStyle={{ color: C.text }}
                  labelFormatter={(d) => `Day ${d.slice(1)}`}
                />
                <Area
                  type="monotone"
                  dataKey="detections"
                  stroke={C.flare}
                  strokeWidth={2}
                  fill="url(#trendFill)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}