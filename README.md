# Fndash - Flexible Dashboard System

A customizable, plugin-based dashboard system with a dynamic grid layout and widget management.

## Features

- **Dynamic Grid System**: Adjustable columns, rows, gap, padding, and border radius
- **Coordinate-Based Positioning**: Widgets positioned using grid coordinates (1A, 2B, etc.)
- **Widget Management**: Drag, resize, and select widgets with visual feedback
- **Mode Switching**: Toggle between edit mode (grid visible) and view mode (grid hidden)
- **Keyboard Shortcuts**: 
  - `Shift+G`: Toggle grid visibility
  - `Cmd+Shift+Arrow Keys`: Adjust grid dimensions
  - `ESC`: Deselect widgets
- **Real-time Debug Info**: Shows widget bounding box and grid coordinates

## Current Status

This is the initial working version with a single map widget. The system is ready for refactoring to support multiple widget types.

## Project Structure

```
fndash/
├── index.html              # Main dashboard page
├── main.js                 # Core dashboard logic
├── styles.css              # Dashboard styling
├── data.js                 # Sample data
├── utils/
│   └── helpers.js          # Utility functions
├── widgets/
│   └── simple-pie-chart.js # Sample widget
└── grid-test/              # Grid system prototype
    ├── index.html          # Grid test page
    ├── script.js           # Grid system implementation
    └── style.css           # Grid styling
```

## Grid Test

The `grid-test/` directory contains a working prototype of the grid system with:
- Dynamic grid creation and management
- Widget positioning and interaction
- Drag and resize functionality
- Mode switching between edit and view

## Getting Started

1. Open `index.html` in a browser to see the main dashboard
2. Open `grid-test/index.html` to test the grid system
3. Use the toolbar controls to adjust grid parameters
4. Press `Shift+G` to toggle between edit and view modes

## Next Steps

- Refactor grid system for multi-widget support
- Implement widget factory pattern
- Add more widget types (charts, tables, etc.)
- Create widget configuration system

## Technologies Used

- Vanilla JavaScript
- CSS Grid
- Lucide Icons
- ECharts (for chart widgets)
