# fndash

A modern, customizable dashboard system with dynamic grid layout and real-time widget management.

## Table of Contents

- [Demo](#demo)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Features](#features)
- [Widget Types](#widget-types)
- [Configuration](#configuration)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Architecture](#architecture)
- [Custom Widgets](#custom-widgets)
- [Dashboard Management](#dashboard-management)
- [Map Synchronization](#map-synchronization)
- [Technologies](#technologies)
- [Customization](#customization)
- [AI Integration](#ai-integration)

## Demo

![Main Dashboard Demo](main-demo.gif)

*Dashboard workflow - grid management, widget creation, dashboard switching, and mode transitions*

![Dashboard Demo](demo.gif)

*Watch the dashboard in action - dynamic grid resizing, widget management, and real-time configuration*

![Dashboard Demo 2](demo2.gif)

*Additional demo showcasing custom widgets, configuration panels, and advanced features*

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fndash.git
   cd fndash
   ```

2. **Open in browser**
   - Simply open `index.html` in any modern browser
   - No build process or dependencies required
   - Works offline after initial load

3. **Alternative: Local server (recommended)**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
   Then visit `http://localhost:8000`

## Quick Start

1. Open `index.html` in a modern browser
2. Use the toolbar to adjust grid settings
3. Add widgets and configure them via the gear icon
4. Create custom widgets with JSON configuration

## Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Dynamic Grid System** | Adjustable columns, rows, gap, and styling with no widget duplication on resize | ✅ Complete |
| **Dashboard Management** | Save, load, and switch between multiple dashboards with localStorage persistence | ✅ Complete |
| **Widget Management** | Drag, resize, configure, duplicate, and delete widgets with hover controls | ✅ Complete |
| **Map Synchronization** | Real-time map sync with multiple modes (All Leaders, Primary Leader) | ✅ Complete |
| **Sunburst Charts** | Interactive hierarchical data visualization with ECharts and multiple data sources | ✅ Complete |
| **Chart Widget System** | Categorized chart types with 12 logical categories and grid-based selection interface | 🚧 Partial |
| **Custom Widgets** | AI-generated widgets with JSON configuration and localStorage persistence | ✅ Complete |
| **RichText Widgets** | HTML content widgets with dynamic positioning for edit/view modes | ✅ Complete |
| **Dev Widgets** | Developer instruction widgets visible only in edit mode | ✅ Complete |
| **Background Customization** | Real-time background color picker in toolbar | ✅ Complete |
| **Widget Controls** | Hover-based controls for move, config, duplicate, delete | ✅ Complete |
| **Keyboard Shortcuts** | Efficient navigation and control including dashboard creation | ✅ Complete |
| **Mode Switching** | Toggle between edit and view modes with smooth toolbar transitions | ✅ Complete |
| **Real-time Updates** | Live configuration panels and position tracking | ✅ Complete |
| **WebGL Context Management** | Prevents context leaks and crashes during grid operations | ✅ Complete |
| **Change Detection** | Visual indicators for unsaved changes with smart save states | ✅ Complete |
| **Centralized Widget System** | Unified widget naming and configuration management | ✅ Complete |
| **Video Widget** | Embed YouTube, Vimeo, and other video platforms | 🔄 Planned |
| **Data Table Widget** | Sortable, filterable data tables with CSV/JSON import | 🔄 Planned |
| **Calendar Widget** | Interactive calendar with event management | 🔄 Planned |
| **Weather Widget** | Real-time weather data with location-based updates | 🔄 Planned |
| **Clock Widget** | Multiple timezone clocks and timers | 🔄 Planned |
| **Image Gallery Widget** | Photo galleries with lightbox and slideshow | 🔄 Planned |
| **Code Editor Widget** | Syntax-highlighted code editor with multiple languages | 🔄 Planned |
| **Markdown Widget** | Live markdown preview and editing | 🔄 Planned |
| **API Widget** | REST API data fetching and display | 🔄 Planned |
| **Notification Widget** | Toast notifications and alerts system | 🔄 Planned |
| **Progress Widget** | Progress bars, loading states, and status indicators | 🔄 Planned |
| **Social Media Widget** | Twitter, Instagram, LinkedIn feeds | 🔄 Planned |
| **Stock Widget** | Real-time stock prices and financial data | 🔄 Planned |
| **News Widget** | RSS feeds and news aggregation | 🔄 Planned |
| **Todo Widget** | Task management with drag-and-drop | 🔄 Planned |
| **Notes Widget** | Sticky notes and text snippets | 🔄 Planned |
| **Calculator Widget** | Scientific calculator with history | 🔄 Planned |
| **QR Code Widget** | QR code generator and scanner | 🔄 Planned |
| **PDF Viewer Widget** | PDF document viewer and annotation | 🔄 Planned |
| **Whiteboard Widget** | Collaborative drawing and annotation | 🔄 Planned |
| **Terminal Widget** | Command line interface simulation | 🔄 Planned |
| **Database Widget** | SQL query interface and results display | 🔄 Planned |
| **Webhook Widget** | Incoming webhook data display and processing | 🔄 Planned |
| **WebSocket Widget** | Real-time data streaming and monitoring | 🔄 Planned |
| **File Upload Widget** | Drag-and-drop file upload with preview | 🔄 Planned |
| **Search Widget** | Global search across all widgets and data | 🔄 Planned |
| **Theme Widget** | Dynamic theme switching and customization | 🔄 Planned |
| **Export Widget** | Dashboard export to PDF, PNG, and other formats | 🔄 Planned |
| **Import Widget** | Import dashboards from external sources | 🔄 Planned |
| **Collaboration Widget** | Real-time multi-user editing and comments | 🔄 Planned |
| **Analytics Widget** | Usage statistics and performance metrics | 🔄 Planned |
| **Backup Widget** | Automated backup and restore functionality | 🔄 Planned |
| **Plugin System** | Third-party widget development and marketplace | 🔄 Planned |
| **Mobile Responsive** | Touch-optimized interface for mobile devices | 🔄 Planned |
| **Offline Support** | PWA capabilities with offline data access | 🔄 Planned |
| **Accessibility** | WCAG compliance and screen reader support | 🔄 Planned |
| **Internationalization** | Multi-language support and localization | 🔄 Planned |
| **Performance Monitoring** | Real-time performance metrics and optimization | 🔄 Planned |
| **Security Features** | Data encryption, authentication, and authorization | 🔄 Planned |

## Widget Types

- **Map Widget** - Interactive maps with Mapbox GL JS (attribution removed)
- **Sunburst Widget** - Hierarchical data visualization with ECharts and multiple data sources
- **Chart Widget** - Categorized data visualization with 12 chart categories and grid-based selection
- **RichText Widget** - HTML content display with dynamic positioning for edit/view modes
- **Dev Widget** - Developer instructions and keyboard shortcuts (edit mode only)
- **Custom Widget** - AI-generated widgets with JSON configuration and localStorage persistence

## Configuration

Widgets can be configured through the gear icon:
- **Widget Info** - ID, type, and position display with unified naming system
- Position and size adjustment
- Map synchronization settings
- Chart category selection with 12 logical categories and grid-based interface
- Sunburst chart data sources and visual settings
- Custom widget JSON configuration with full-height editor
- Style and behavior options

## Keyboard Shortcuts

- `Shift + G` - Toggle grid visibility and edit/view mode
- `Shift + ?` (or `Shift + /`) - Toggle add widget menu
- `Shift + N` - Create new dashboard
- `Cmd + Shift + Arrow Keys` - Adjust grid dimensions
- `ESC` - Deselect widgets or close menus

## Architecture

```
fndash/
├── script.js              # Grid system & coordination with widget preservation
├── config-panel.js        # Widget configuration management
├── widget-manager.js      # Widget lifecycle & interactions
├── keyboard.js            # Keyboard shortcuts
├── widgets/
│   ├── WidgetCore.js      # Base widget class
│   ├── map-widget.js      # Mapbox integration (attribution removed)
│   ├── chart-widget.js    # Chart widget with config panel
│   ├── sunburst-widget.js # ECharts sunburst visualization with data sources
│   ├── custom-widget.js   # AI-generated custom widgets with JSON editor
│   ├── map-sync.js        # Map synchronization
│   └── widget.css         # Widget styling with consistent info sections
├── style.css              # Main application styles with text selection prevention
├── prompt.md              # AI prompt templates for custom widgets
└── index.html
```

## Custom Widgets

Create powerful custom widgets using JSON configuration:

### JSON Structure
```json
{
  "title": "Widget Name",
  "description": "Description",
  "html": "Complete HTML with unique IDs",
  "css": "Modern CSS with animations",
  "js": "Interactive functionality with data updates",
  "settings": { "backgroundColor": "#1a1a1a", ... },
  "layout": { "minWidth": 3, "minHeight": 3, ... },
  "interactions": { "clickable": true, ... },
  "data": { "source": "static", "refreshInterval": 3000, ... }
}
```

### Usage
1. Add a Custom Widget from the widget menu
2. Click the gear icon to open configuration
3. Paste your JSON configuration in the JSON field
4. Widget updates automatically when valid JSON is detected
5. Save your custom widget for future use with localStorage persistence

## Dashboard Management

- **Save Dashboards** - Save current grid and widget configuration with custom names
- **Load Dashboards** - Switch between saved dashboards with dropdown menu
- **Create New Dashboards** - Use `Shift + N` or dropdown menu to create empty dashboards
- **Change Detection** - Visual indicators show when dashboards have unsaved changes
- **localStorage Persistence** - All dashboards saved locally in browser
- **Default Dashboards** - Pre-configured "START PAGE" and "FINANCE" dashboards

## Map Synchronization

Two synchronization modes:
- **All Leaders** - Any map can become the leader
- **Primary Leader** - One designated map controls all others

## Technologies

- **Vanilla JavaScript** - No frameworks, pure performance
- **CSS Grid** - Modern layout system
- **Mapbox GL JS** - Interactive maps
- **ECharts** - Data visualization library
- **Lucide Icons** - Clean iconography
- **JSON Configuration** - Flexible widget system

## Customization

- Adjustable grid dimensions (1-12 columns/rows)
- Customizable gap, padding (max 500px), and border radius (max 800px)
- Real-time background color picker in toolbar
- Real-time visual feedback
- Responsive design
- Custom widget creation with AI assistance
- Consistent widget information sections across all widget types
- Compact configuration panel headers
- Dynamic widget positioning based on edit/view mode
- MacBook-style keycap styling for keyboard shortcuts
- Simplified widget menu with text-based interface
- Glassmorphism styling for consistent visual language

## AI Integration

The system supports AI-generated custom widgets:
- Use the prompt templates in `prompt.md`
- Generate JSON configurations with AI
- Paste configurations directly into custom widgets
- Save and reuse custom widget configurations with localStorage

---

Built for modern web applications
