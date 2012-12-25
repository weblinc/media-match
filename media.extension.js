/* Extension to Media - Adds new media features. Authors & copyright (c) 2012: WebLinc, David Knight. */

// Added device-pixel-ratio even though it's covered by resolution #dppx
window.Media.features["device-pixel-ratio"]  = window.Media.resolution;

// Modernizr.touch
window.Media.features["touch-enabled"]  = Number(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch || 0);