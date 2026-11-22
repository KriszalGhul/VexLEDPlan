# VexLEDPlan

A browser based LED wall cabling planner. The app is a static site deployed to GitHub Pages from the `main` branch by `.github/workflows/pages.yml`.

## Project files

- `index.html` defines the interface and loads the app scripts in dependency order.
- `styles.css` contains the visual styles.
- `app-core.js` owns shared app state, cabinet and wall calculations, and SVG rendering.
- `app-stats.js` calculates wall totals and route summaries.
- `app-routing.js` handles route drawing, editing, and canvas input.
- `app-ports.js` renders signal and power port assignment bars.
- `app-interactions.js` connects controls, pointer and keyboard input, and side panels.
- `app-project.js` handles project pages, save/open, and cabling export.
- `led screens.xlsx` is the cabinet catalog source workbook; use **Refresh from workbook** in the app after editing it.

Keep the script tags in `index.html` in their current order. The scripts share the app's top-level state and functions in the browser.

Project files are saved locally through the app's **Save project** action. Use **Open project** to restore one.

## Deployment

After the first workflow run, open the repository's **Settings → Pages** to find the published site URL.
