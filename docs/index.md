# Adaptive CSS Documentation

**Adaptive CSS** is a tool for generating accessible, adaptive color systems as CSS custom properties. It uses advanced color algorithms from [Adaptive UI](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components) to create colors that automatically meet WCAG contrast requirements.

## Why Adaptive CSS?

Traditional color systems require manual selection of every color variant and careful checking of contrast ratios. Adaptive CSS takes a different approach:

1. **Define base colors** — Just provide your brand colors
2. **Generate palettes** — Algorithms create full luminance ramps
3. **Automatic contrast** — Colors are selected to meet accessibility requirements
4. **Adaptive modes** — Light and dark modes work automatically

## Features

- **WCAG Compliant** — All color combinations meet AA (4.5:1) or AAA (7:1) contrast ratios
- **Automatic Dark Mode** — Colors adapt correctly in both light and dark contexts
- **CSS Custom Properties** — Framework-agnostic output works everywhere
- **Semantic Tokens** — Meaningful names like `--color-bg` and `--color-accent`
- **Full Palettes** — Access raw palette values for custom use cases
- **Utility Classes** — Optional Tailwind-style classes included

## Documentation

| Document | Description |
|----------|-------------|
| [Getting Started](./getting-started.md) | Quick start guide and installation |
| [Configuration](./configuration.md) | All configuration options explained |
| [CSS Output](./css-output.md) | Understanding the generated CSS |
| [Dark Mode](./dark-mode.md) | Implementing light/dark mode switching |
| [Color System](./color-system.md) | How the color algorithms work |
| [API Reference](./api-reference.md) | Programmatic usage in JavaScript/TypeScript |
| [Examples](./examples.md) | Real-world usage examples |

## Quick Example

**Input configuration:**

```json
{
  "palettes": {
    "neutral": "#6B7280",
    "accent": "#3B82F6"
  }
}
```

**Generated CSS (simplified):**

```css
:root {
  --color-bg: #f9fafb;
  --color-fg: #000000;
  --color-accent: #2563eb;
  --color-accent-fg: #ffffff;
}

[data-theme="dark"] {
  --color-bg: #111827;
  --color-fg: #ffffff;
  --color-accent: #60a5fa;
  --color-accent-fg: #000000;
}
```

**Usage in HTML:**

```html
<body class="bg-default text-default">
  <button class="bg-accent text-on-accent">
    Accessible Button
  </button>
</body>
```

## How It Works

```
┌─────────────────┐
│  Base Colors    │  You provide: #6B7280, #3B82F6
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Palette Gen     │  Creates 50+ swatches per color
│ (LAB color      │  using perceptually uniform
│  space)         │  luminance steps
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Contrast Calc   │  Selects colors meeting
│ (WCAG formulas) │  4.5:1 or 7:1 contrast
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ CSS Generation  │  Outputs semantic tokens,
│                 │  palette vars, utilities
└─────────────────┘
```

## Requirements

- Node.js 18+
- npm or yarn

## License

MIT
