# fndash - Flexible Dashboard System

A modern, customizable dashboard system with dynamic grid layout and real-time widget management.

## Features

- **Dynamic Grid System** - Adjustable columns, rows, gap, and styling
- **Widget Management** - Drag, resize, configure, duplicate, and delete widgets
- **Map Synchronization** - Real-time map sync with multiple modes (All Leaders, Primary Leader)
- **Sunburst Charts** - Interactive hierarchical data visualization with ECharts
- **Background Customization** - Background color picker
- **Keyboard Shortcuts** - Efficient navigation and control
- **Mode Switching** - Toggle between edit and view modes
- **Real-time Updates** - Live configuration panels and position tracking

## Quick Start

1. Clone the repository
2. Open `index.html` in a modern browser
3. Use the toolbar to adjust grid settings
4. Add widgets and configure them via the gear icon

## ⌨️ Keyboard Shortcuts

- `Shift + G` - Toggle grid visibility
- `Shift + ?` (or `Shift + /`) - Toggle add widget menu
- `Cmd + Shift + Arrow Keys` - Adjust grid dimensions
- `ESC` - Deselect widgets or close menus

## Architecture

```
fndash/
├── script.js              # Grid system & coordination
├── config-panel.js        # Widget configuration management
├── widget-manager.js      # Widget lifecycle & interactions
├── keyboard.js            # Keyboard shortcuts
├── widgets/
│   ├── WidgetCore.js      # Base widget class
│   ├── map-widget.js      # Mapbox integration
│   ├── chart-widget.js    # Chart widget (placeholder)
│   ├── sunburst-widget.js # ECharts sunburst visualization
│   ├── map-sync.js        # Map synchronization
│   └── widget.css         # Widget styling
├── style.css              # Main application styles
└── index.html
```

## Widget Types

- **Map Widget** - Interactive maps with Mapbox GL JS
- **Sunburst Widget** - Hierarchical data visualization with ECharts
- **Chart Widget** - Data visualization with ECharts (placeholder)

## Configuration

Widgets can be configured through the gear icon:
- Position and size adjustment
- Map synchronization settings
- Sunburst chart data sources and visual settings
- Style and behavior options

## Widget Controls

Each widget has hover controls:
- **Move** - Drag to reposition
- **Configure** - Open settings panel
- **Duplicate** - Copy widget with all settings
- **Delete** - Remove widget instantly

## Technologies

- **Vanilla JavaScript** - No frameworks, pure performance
- **CSS Grid** - Modern layout system
- **Mapbox GL JS** - Interactive maps
- **ECharts** - Data visualization library
- **Lucide Icons** - Clean iconography

## Map Synchronization

Two synchronization modes:
- **All Leaders** - Any map can become the leader
- **Primary Leader** - One designated map controls all others

## Customization

- Adjustable grid dimensions (1-12 columns/rows)
- Customizable gap, padding, and border radius
- Real-time background color picker
- Real-time visual feedback
- Responsive design

---

Built with ❤️ for modern web applications
