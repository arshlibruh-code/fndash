// Configuration file for environment variables
// In a real application, you'd use a build process to inject these
// For now, we'll use a simple approach

const CONFIG = {
    MAPBOX_ACCESS_TOKEN: 'pk.eyJ1Ijoic2FpdGVqYXVzIiwiYSI6ImNrM2R5emU5cTFmcHYzaXBkbzZzcjE1enkifQ.wB24J_XpAwaarHM1fmJ4Xw'
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
