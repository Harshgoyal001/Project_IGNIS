import { create } from "zustand";

export const useThermalStore = create((set) => ({
  selectedId: null,
  hoveredId: null,
  layers: {
    hotspots: true,
    facilities: true,
    priorityShading: true,
    landCover: true,
    satelliteBasemap: true,
    populationDensity: false,
  },
  setSelectedId: (id) => set({ selectedId: id }),
  setHoveredId: (id) => set({ hoveredId: id }),
  toggleLayer: (key) =>
    set((state) => ({ layers: { ...state.layers, [key]: !state.layers[key] } })),
}));
