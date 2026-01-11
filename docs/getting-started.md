# Getting Started

This guide will help you install and use Adaptive CSS to generate your first color system.

## Installation

### Global Installation

Install globally to use the `adaptive-css` command anywhere:

```bash
npm install -g adaptive-css
```

### Local Installation

Or install as a dev dependency in your project:

```bash
npm install --save-dev adaptive-css
```

Then run via npx:

```bash
npx adaptive-css --help
```

## Quick Start

### Option 1: Inline Colors (Fastest)

Generate a color system directly from the command line:

```bash
adaptive-css --neutral "#6B7280" --accent "#3B82F6" --output colors.css
```

This creates `colors.css` with a complete color system based on your two colors.

### Option 2: Configuration File (Recommended)

For more control, create a configuration file:

```bash
adaptive-css --init
```

This creates `adaptive-css.config.json`:

```json
{
  "palettes": {
    "neutral": "#6B7280",
    "accent": "#3B82F6",
    "success": "#10B981",
    "warning": "#F59E0B",
    "error": "#EF4444"
  },
  "contrastLevel": "AA",
  "includePaletteVars": true,
  "includeUtilityClasses": true,
  "darkModeSelector": "[data-theme=\"dark\"]",
  "respectSystemPreference": true
}
```

Edit the colors to match your brand, then generate:

```bash
adaptive-css --config adaptive-css.config.json --output src/styles/colors.css
```

## Using the Generated CSS

### 1. Include the CSS

```html
<link rel="stylesheet" href="colors.css">
```

Or import in your JavaScript/CSS:

```css
@import './colors.css';
```

```javascript
import './colors.css';
```

### 2. Apply Base Styles

Add the semantic classes to your body or root element:

```html
<body class="bg-default text-default">
  <!-- Your content -->
</body>
```

### 3. Use Semantic Tokens

Apply colors using the utility classes or CSS custom properties:

```html
<!-- Using utility classes -->
<button class="bg-accent text-on-accent">
  Primary Button
</button>

<p class="text-muted">
  Secondary text content
</p>

<!-- Using CSS custom properties -->
<style>
  .custom-card {
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border);
    color: var(--color-fg);
  }
</style>
```

### 4. Add Dark Mode Toggle

```html
<button onclick="toggleTheme()">Toggle Dark Mode</button>

<script>
  function toggleTheme() {
    const html = document.documentElement;
    html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
  }
</script>
```

## Build Integration

Add color generation to your build process:

```json
{
  "scripts": {
    "generate:colors": "adaptive-css --config adaptive-css.config.json --output src/styles/colors.css",
    "prebuild": "npm run generate:colors",
    "build": "your-build-command"
  }
}
```

## Verifying Accessibility

The generated colors are automatically accessible, but you can verify:

1. Open your site in Chrome DevTools
2. Go to the "Rendering" tab
3. Enable "Emulate vision deficiencies"
4. Check that text remains readable

Or use the Lighthouse accessibility audit to confirm contrast ratios.

## Next Steps

- [Configuration](./configuration.md) — Customize every aspect of generation
- [CSS Output](./css-output.md) — Understand what's generated
- [Dark Mode](./dark-mode.md) — Advanced dark mode patterns
- [Examples](./examples.md) — Real-world usage patterns
