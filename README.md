# Drone Parts Planner

A 3D interactive web application for building and customizing drones. Built with React and React Three Fiber.

## Features

- **3D Frame Selection**: Browse and select from a catalog of drone frames
- **Interactive 3D Viewer**: Rotate, zoom, and pan to view your selected frame
- **Real-time Preview**: See your drone frame in 3D as you build

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Set up the model symlink (links DroneModels to public folder):
```bash
./setup-models.sh
```

2. Generate the frame catalog (scans for all available GLB files):
```bash
npm run generate-catalog
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
drone-parts-planner/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── DroneViewer.js      # 3D model viewer component
│   │   └── FrameSelector.js    # Frame selection UI
│   ├── App.js                  # Main application component
│   ├── App.css                 # Application styles
│   ├── index.js                # Entry point
│   └── index.css               # Global styles
└── package.json
```

## Technologies

- **React** - UI library
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **Three.js** - 3D graphics library

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Future Features

- Add motors, propellers, and other components
- Customize colors and materials
- Export drone configuration
- Save and load drone builds
