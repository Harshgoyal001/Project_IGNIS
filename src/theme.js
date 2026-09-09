import { Flame, Factory, HelpCircle, Sprout } from "lucide-react";

export const C = {
  bg: "#0A0F1C",
  panel: "#111A2B",
  panelAlt: "#16223A",
  border: "#22304A",
  borderSoft: "#1A2540",
  text: "#EDF1F8",
  textDim: "#93A2BE",
  textFaint: "#5C6C8A",
  flare: "#FF5A36",
  wildfire: "#E63946",
  industrial: "#F4A814",
  crop: "#E9C46A",
  unknown: "#6B7A99",
  teal: "#37C2B0",
  blue: "#5B8DEF",
};

export const FONT_SANS = "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif";
export const FONT_MONO = "'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace";

export const CLASS_CONFIG = {
  "Gas Flare": { color: C.flare, Icon: Flame },
  "Industrial Process": { color: C.industrial, Icon: Factory },
  Wildfire: { color: C.wildfire, Icon: Flame },
  "Crop Burning": { color: C.crop, Icon: Sprout },
  Unknown: { color: C.unknown, Icon: HelpCircle },
};
