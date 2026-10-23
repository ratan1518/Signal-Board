# SignalBoard — Operations Monitoring Dashboard

SignalBoard is an independent frontend portfolio project demonstrating a responsive operations dashboard with simulated service events. It is not affiliated with FirstHire and is not connected to real production systems.

## Features
- Responsive dark dashboard for desktop and mobile
- React + TypeScript and reusable metric component
- Simulated event stream that can be paused and resumed
- Search events by ID, service, message, or status
- Filter events by severity
- Cycle event status: Investigating → Acknowledged → Resolved → Investigating
- Export the current event log to CSV
- Response-time chart with simulated samples
- Service health summary, warning count, and unresolved critical count
- Accessible labels, keyboard-operable controls, focus states, empty state, and status announcements
- Automated tests for dashboard rendering, search, severity filtering, and stream pause

## Tech stack
React 18, TypeScript, Vite, Recharts, Lucide React, Vitest, Testing Library.

## Requirements
Install Node.js LTS (Node 20 or newer recommended) and VS Code.

## Run locally
Open this folder in VS Code, open **Terminal → New Terminal**, then run:

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal (usually `http://localhost:5173`). Keep the terminal running while you use the app.

## Test and production build
```bash
npm test
npm run build
```

`npm test` runs the automated interaction tests. `npm run build` type-checks the project and creates an optimized production build in `dist/`. Fix any errors before describing the build as verified.

## Project structure
```text
signalboard/
├── public/                  # Static assets
├── src/
│   ├── App.tsx              # Dashboard UI, state, and interactions
│   ├── App.test.tsx         # UI interaction tests
│   ├── main.tsx             # React entry point
│   ├── styles.css           # Responsive theme and layout
│   ├── test-setup.ts        # Testing Library setup
│   └── utils.test.ts        # Focused event-filtering tests
├── index.html               # HTML document and page metadata
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite and Vitest configuration
└── README.md                # Setup, feature, and scope documentation
```

## Data and privacy
All event data is generated locally in the browser. No real services, customer data, authentication provider, backend, or WebSocket connection is used. The live feed is simulated with a browser timer. Do not describe this demo as production monitoring or genuine real-time infrastructure.

## Current limitations
- Service health and metrics are illustrative, not real measurements.
- Event changes reset on page refresh.
- CSV export downloads the current in-memory event list.
- The navigation provides a dashboard-style view, not separate routed pages.
- Authentication, server persistence, real alert delivery, and real-time server integration are intentionally outside this MVP.

## Interview talking points
- Explain why the event list is filtered from state rather than separately stored.
- Explain the difference between simulated polling and a real WebSocket connection.
- Describe how the layout adapts to smaller screens and how keyboard focus is visible.
- Explain what the tests cover and what additional tests you would add before production.
- Be honest about the demo's limitations and the parts you personally changed or implemented.
