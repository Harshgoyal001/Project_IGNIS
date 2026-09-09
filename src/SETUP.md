# THERMAL-EYE Dashboard — Setup

## 1. Install the missing packages
Run this inside `my-react-app`:

```
npm install lucide-react leaflet react-leaflet zustand recharts
```

## 2. Confirm Tailwind is wired up
You said Tailwind CSS is already in your stack. Just double check
`tailwind.config.js` has your `src` folder in `content`:

```js
content: ["./index.html", "./src/**/*.{js,jsx}"],
```

## 3. Copy these files into your project
Replace/add files so your `src/` folder looks like:

```
src/
  App.jsx
  index.css
  theme.js
  data/
    hotspots.js
  store/
    useThermalStore.js
  components/
    ThermalMap.jsx
    LayersPanel.jsx
    IntelligenceCard.jsx
```

Make sure `src/main.jsx` imports `./index.css` (Vite's default template
already does this — if yours imports a different CSS file, just point it
at `index.css`, or merge the `@import`/`@tailwind` lines into your
existing one).

## 4. Run it
```
npm run dev
```

## About the other tools in your stack table
- **Zustand** — now driving hotspot selection + layer toggles (`store/useThermalStore.js`).
- **Recharts** — now used for the Classification Mix bar chart in the Layers panel.
- **shadcn/ui, TanStack Table, React Hook Form** — not wired in yet because this screen
  doesn't need them: no data table, no form input right now. They'll make sense once you
  build things like a sortable hotspot list (TanStack Table) or the Thermal Hunt query
  input (React Hook Form + shadcn Input/Button). Ask and I'll wire those in when you get there.
