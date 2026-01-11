# adaptive-css

Generate accessible, adaptive color systems as CSS custom properties. Built on top of the [Adaptive UI](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components) color algorithms.

## Features

- **Accessible by default** - Automatically generates colors that meet WCAG AA or AAA contrast requirements
- **Adaptive** - Seamlessly supports light and dark modes with proper contrast in both
- **CSS-first** - Outputs standard CSS custom properties that work with any framework
- **Flexible** - Use the generated palettes directly or rely on semantic tokens
- **Simple** - One command to generate your entire color system

## Installation

```bash
npm install adaptive-css
```

## Quick Start

### CLI Usage

```bash
# Generate with inline colors
npx adaptive-css --neutral "#6B7280" --accent "#3B82F6" --output colors.css

# Generate from config file
npx adaptive-css --config colors.config.json --output colors.css

# Create a sample config file
npx adaptive-css --init
```

### Programmatic Usage

```typescript
import { generateCSS } from "adaptive-css";

const css = generateCSS({
  palettes: {
    neutral: "#6B7280",
    accent: "#3B82F6",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  },
  contrastLevel: "AA",
});

console.log(css);
```

## Configuration

Create a `adaptive-css.config.json` file:

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
  "respectSystemPreference": true,
  "prefix": ""
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `palettes` | object | required | Color palettes to generate. Must include `neutral` and `accent`. |
| `contrastLevel` | `"AA"` \| `"AAA"` | `"AA"` | WCAG contrast level (4.5:1 or 7:1) |
| `includePaletteVars` | boolean | `true` | Include raw palette variables (e.g., `--neutral-0`) |
| `includeUtilityClasses` | boolean | `true` | Include utility classes (e.g., `.bg-accent`) |
| `darkModeSelector` | string | `[data-theme="dark"]` | CSS selector for dark mode |
| `respectSystemPreference` | boolean | `true` | Add `prefers-color-scheme` media query |
| `prefix` | string | `""` | Prefix for all CSS variables |

## Generated CSS

### Semantic Tokens

```css
:root {
  /* Backgrounds */
  --color-bg: #f9fafb;
  --color-bg-subtle: #f3f4f6;
  --color-bg-elevated: #e5e7eb;
  --color-bg-surface: #f9fafb;

  /* Foregrounds */
  --color-fg: #000000;
  --color-fg-muted: #6b7280;

  /* Borders */
  --color-border: #9ca3af;
  --color-border-subtle: #d1d5db;

  /* Accent */
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-accent-active: #3b82f6;
  --color-accent-fg: #ffffff;
}
```

### Raw Palette Variables

```css
:root {
  --neutral-0: #ffffff;
  --neutral-1: #f9fafb;
  --neutral-2: #f3f4f6;
  /* ... up to ~20 swatches */

  --accent-0: #eff6ff;
  --accent-1: #dbeafe;
  /* ... */
}
```

### Utility Classes

```css
.bg-default { background-color: var(--color-bg); }
.bg-subtle { background-color: var(--color-bg-subtle); }
.bg-accent { background-color: var(--color-accent); }

.text-default { color: var(--color-fg); }
.text-muted { color: var(--color-fg-muted); }
.text-on-accent { color: var(--color-accent-fg); }

.border-default { border-color: var(--color-border); }
```

## Usage in HTML

```html
<!DOCTYPE html>
<html data-theme="light">
<head>
  <link rel="stylesheet" href="colors.css">
</head>
<body class="bg-default text-default">
  <header class="bg-elevated">
    <h1>My App</h1>
  </header>

  <button class="bg-accent text-on-accent">
    Click me
  </button>

  <p class="text-muted">Secondary text</p>

  <!-- Toggle dark mode -->
  <script>
    function toggleTheme() {
      const html = document.documentElement;
      html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
    }
  </script>
</body>
</html>
```

## Dark Mode

The generated CSS supports three dark mode strategies:

1. **Manual toggle** - Set `data-theme="dark"` on `<html>`
2. **Class-based** - Add `.dark` class to any element
3. **System preference** - Automatically respects `prefers-color-scheme`

```html
<!-- Manual toggle -->
<html data-theme="dark">

<!-- Class-based -->
<html class="dark">

<!-- System preference works automatically -->
```

## Build Integration

Add to your build process:

```json
{
  "scripts": {
    "generate:colors": "adaptive-css --config colors.config.json --output src/styles/colors.css",
    "build": "npm run generate:colors && your-build-command"
  }
}
```

## How It Works

This tool uses the [Adaptive UI](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components) color algorithms to:

1. Generate a full luminance palette from each base color
2. Calculate accessible color combinations that meet WCAG contrast requirements
3. Create semantic tokens that automatically adapt between light and dark modes
4. Ensure foreground colors always have sufficient contrast against their backgrounds

The algorithms are the same ones used in Microsoft's Fluent UI Web Components.

## License

MIT
