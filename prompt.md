# AI-GENERATED JSON FOR CUSTOM WIDGETS

## JSON Schema Template

```json
{
  "title": "Your Widget Name",
  "description": "Brief description",
  "html": "Complete HTML with unique IDs",
  "css": "Complete CSS styles",
  "js": "Complete JavaScript code",
  "settings": {
    "backgroundColor": "#1a1a1a",
    "textColor": "#ffffff",
    "borderRadius": "12px",
    "fontSize": "14px",
    "fontFamily": "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
  },
  "layout": {
    "minWidth": 3,
    "minHeight": 3,
    "preferredWidth": 3,
    "preferredHeight": 3
  },
  "interactions": {
    "clickable": true,
    "hoverable": true,
    "draggable": false,
    "resizable": true,
    "refreshable": false
  },
  "data": {
    "source": "static",
    "refreshInterval": 1000,
    "sampleData": {}
  }
}
```

## Working Example - World Clock

```json
{
  "title": "Live World Clock",
  "description": "Real-time clock with multiple time zones",
  "html": "<div class='clock-widget'><div class='clock-header'><h3>{{title}}</h3><div class='status-dot'></div></div><div class='time-zones'><div class='time-zone'><div class='location'>New York</div><div class='time' id='ny-time'>--:--:--</div><div class='date' id='ny-date'>--</div></div><div class='time-zone'><div class='location'>London</div><div class='time' id='london-time'>--:--:--</div><div class='date' id='london-date'>--</div></div><div class='time-zone'><div class='location'>Tokyo</div><div class='time' id='tokyo-time'>--:--:--</div><div class='date' id='tokyo-date'>--</div></div><div class='time-zone'><div class='location'>Sydney</div><div class='time' id='sydney-time'>--:--:--</div><div class='date' id='sydney-date'>--</div></div></div><div class='local-time'><div class='local-label'>Local Time</div><div class='local-display' id='local-time'>--:--:--</div></div></div>",
  "css": ".clock-widget {background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); border-radius: 12px; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; height: 100%; display: flex; flex-direction: column; }.clock-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2); }.clock-header h3 { margin: 0; font-size: 16px; font-weight: 600; }.status-dot { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; animation: pulse 2s infinite; }.time-zones { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px; flex: 1; }.time-zone { background: rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; text-align: center; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); }.location { font-size: 11px; opacity: 0.8; margin-bottom: 4px; font-weight: 500; }.time { font-size: 18px; font-weight: bold; margin-bottom: 2px; color: #4ade80; font-family: 'Courier New', monospace; }.date { font-size: 10px; opacity: 0.7; }.local-time { text-align: center; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.2); }.local-label { font-size: 11px; opacity: 0.8; margin-bottom: 4px; }.local-display { font-size: 20px; font-weight: bold; color: #22c55e; font-family: 'Courier New', monospace; }@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; }}",
  "js": "// World Clock Widget\nclass WorldClock {\n  constructor() {\n    this.timeZones = {\n      'ny': 'America/New_York',\n      'london': 'Europe/London', \n      'tokyo': 'Asia/Tokyo',\n      'sydney': 'Australia/Sydney'\n    };\n    \n    this.init();\n  }\n  \n  init() {\n    this.updateAllClocks();\n    this.startUpdates();\n  }\n  \n  formatTime(date) {\n    return date.toLocaleTimeString('en-US', { \n      hour12: false,\n      hour: '2-digit',\n      minute: '2-digit',\n      second: '2-digit'\n    });\n  }\n  \n  formatDate(date) {\n    return date.toLocaleDateString('en-US', {\n      month: 'short',\n      day: 'numeric'\n    });\n  }\n  \n  updateAllClocks() {\n    const now = new Date();\n    \n    // Update local time\n    document.getElementById('local-time').textContent = this.formatTime(now);\n    \n    // Update world times\n    Object.keys(this.timeZones).forEach(zone => {\n      try {\n        const zoneTime = new Date(now.toLocaleString('en-US', { timeZone: this.timeZones[zone] }));\n        document.getElementById(`${zone}-time`).textContent = this.formatTime(zoneTime);\n        document.getElementById(`${zone}-date`).textContent = this.formatDate(zoneTime);\n      } catch (error) {\n        console.error(`Error updating ${zone} time:`, error);\n      }\n    });\n  }\n  \n  startUpdates() {\n    // Update every second\n    setInterval(() => {\n      this.updateAllClocks();\n    }, 1000);\n  }\n}\n\n// Initialize the world clock\nconst worldClock = new WorldClock();",
  "settings": {
    "backgroundColor": "#1a1a1a",
    "textColor": "#ffffff",
    "borderRadius": "12px",
    "fontSize": "14px",
    "fontFamily": "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
  },
  "layout": {
    "minWidth": 3,
    "minHeight": 3,
    "preferredWidth": 3,
    "preferredHeight": 3
  },
  "interactions": {
    "clickable": true,
    "hoverable": true,
    "draggable": false,
    "resizable": true,
    "refreshable": false
  },
  "data": {
    "source": "static",
    "refreshInterval": 1000,
    "sampleData": {}
  }
}
```

## AI Prompt Template

```
Create a custom widget JSON for [YOUR WIDGET TYPE] that shows:
- [Feature 1]
- [Feature 2] 
- [Feature 3]
- Use modern gradient design with dark theme
- Include interactive hover effects
- Make it update every [X] seconds with sample data

Follow this JSON structure:
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

## Key Requirements

1. **HTML**: Include unique IDs for JavaScript targeting
2. **CSS**: Use modern design with gradients and animations
3. **JavaScript**: Add functionality with data updates
4. **Settings**: Use dark theme colors that match the dashboard
5. **Layout**: Set appropriate size constraints
6. **Interactions**: Configure behavior options

## Usage Instructions

1. Copy the JSON template above
2. Replace placeholder values with your widget details
3. Paste the complete JSON into the custom widget "Code" field
4. The widget will update automatically when valid JSON is detected
