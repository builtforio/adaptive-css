# Configuration

This document covers all configuration options available in Adaptive CSS.

## Configuration File

Create a JSON configuration file (typically `adaptive-css.config.json`):

```json
{
  "palettes": {
    "neutral": "#6B7280",
    "accent": "#3B82F6"
  },
  "contrastLevel": "AA",
  "includePaletteVars": true,
  "includeUtilityClasses": true,
  "darkModeSelector": "[data-theme=\"dark\"]",
  "respectSystemPreference": true,
  "prefix": ""
}
```

## Options Reference

### `palettes` (required)

Defines the color palettes to generate. Must include `neutral` and `accent` at minimum.

```json
{
  "palettes": {
    "neutral": "#6B7280",
    "accent": "#3B82F6",
    "success": "#10B981",
    "warning": "#F59E0B",
    "error": "#EF4444",
    "info": "#06B6D4"
  }
}
```

Each palette can be specified as:

**Simple hex string:**
```json
{
  "palettes": {
    "accent": "#3B82F6"
  }
}
```

**Object with options:**
```json
{
  "palettes": {
    "accent": {
      "base": "#3B82F6",
      "name": "brand-primary"
    }
  }
}
```

#### Required Palettes

| Palette | Purpose |
|---------|---------|
| `neutral` | Background, foreground, and border colors |
| `accent` | Primary interactive color (buttons, links, focus) |

#### Optional Palettes

Any additional palettes become available as `--color-{name}` tokens:

| Palette | Typical Use |
|---------|-------------|
| `success` | Success states, confirmations |
| `warning` | Warning states, cautions |
| `error` | Error states, destructive actions |
| `info` | Informational states |

---

### `contrastLevel`

WCAG contrast level to target.

| Value | Contrast Ratio | Use Case |
|-------|---------------|----------|
| `"AA"` (default) | 4.5:1 | Standard accessibility requirement |
| `"AAA"` | 7:1 | Enhanced accessibility |

```json
{
  "contrastLevel": "AA"
}
```

**Note:** AAA produces more conservative color choices with higher contrast, which may reduce the vibrancy of some colors.

---

### `includePaletteVars`

Whether to include raw palette variables in the output.

| Value | Result |
|-------|--------|
| `true` (default) | Includes `--neutral-0`, `--accent-15`, etc. |
| `false` | Only semantic tokens are generated |

```json
{
  "includePaletteVars": true
}
```

**When to disable:** If you only need semantic tokens and want smaller CSS output.

---

### `includeUtilityClasses`

Whether to include utility classes in the output.

| Value | Result |
|-------|--------|
| `true` (default) | Includes `.bg-default`, `.text-accent`, etc. |
| `false` | Only CSS custom properties are generated |

```json
{
  "includeUtilityClasses": true
}
```

**When to disable:** If you're using a CSS framework like Tailwind that provides its own utilities.

---

### `darkModeSelector`

CSS selector used to activate dark mode.

```json
{
  "darkModeSelector": "[data-theme=\"dark\"]"
}
```

**Common patterns:**

| Selector | HTML Usage |
|----------|------------|
| `[data-theme="dark"]` | `<html data-theme="dark">` |
| `.dark` | `<html class="dark">` |
| `[data-mode="dark"]` | `<html data-mode="dark">` |

The generated CSS will use this selector:

```css
[data-theme="dark"],
.dark {
  --color-bg: #111827;
  /* ... */
}
```

---

### `respectSystemPreference`

Whether to add a `prefers-color-scheme` media query.

| Value | Result |
|-------|--------|
| `true` (default) | Adds `@media (prefers-color-scheme: dark)` |
| `false` | Only manual dark mode switching |

```json
{
  "respectSystemPreference": true
}
```

When enabled, the system generates:

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not(.light) {
    --color-bg: #111827;
    /* ... */
  }
}
```

This allows the site to automatically match the user's OS preference while still allowing manual override.

---

### `prefix`

Prefix for all CSS custom property names.

```json
{
  "prefix": "my-app"
}
```

**Without prefix:**
```css
--color-bg: #ffffff;
--neutral-0: #ffffff;
```

**With prefix `"my-app"`:**
```css
--my-app-color-bg: #ffffff;
--my-app-neutral-0: #ffffff;
```

**When to use:** When integrating with existing systems that might have conflicting variable names.

---

## CLI Options

The CLI accepts these arguments:

| Option | Alias | Description |
|--------|-------|-------------|
| `--config <file>` | `-c` | Path to JSON config file |
| `--output <file>` | `-o` | Output CSS file path |
| `--neutral <color>` | | Neutral base color (hex) |
| `--accent <color>` | | Accent base color (hex) |
| `--contrast <level>` | | WCAG contrast level: AA or AAA |
| `--init` | | Create sample config file |
| `--help` | `-h` | Show help message |

### Examples

```bash
# From config file
adaptive-css --config colors.json --output styles/colors.css

# Inline colors
adaptive-css --neutral "#374151" --accent "#8B5CF6" --output theme.css

# With AAA contrast
adaptive-css --config colors.json --contrast AAA --output colors.css

# Create starter config
adaptive-css --init --config my-colors.json
```

---

## Example Configurations

### Minimal

```json
{
  "palettes": {
    "neutral": "#6B7280",
    "accent": "#3B82F6"
  }
}
```

### Full Featured

```json
{
  "palettes": {
    "neutral": "#6B7280",
    "accent": "#3B82F6",
    "success": "#10B981",
    "warning": "#F59E0B",
    "error": "#EF4444",
    "info": "#06B6D4"
  },
  "contrastLevel": "AA",
  "includePaletteVars": true,
  "includeUtilityClasses": true,
  "darkModeSelector": "[data-theme=\"dark\"]",
  "respectSystemPreference": true,
  "prefix": ""
}
```

### Minimal Output

```json
{
  "palettes": {
    "neutral": "#6B7280",
    "accent": "#3B82F6"
  },
  "includePaletteVars": false,
  "includeUtilityClasses": false
}
```

### Tailwind Integration

```json
{
  "palettes": {
    "neutral": "#6B7280",
    "accent": "#3B82F6"
  },
  "includePaletteVars": true,
  "includeUtilityClasses": false,
  "darkModeSelector": ".dark"
}
```

### Namespaced

```json
{
  "palettes": {
    "neutral": "#6B7280",
    "accent": "#3B82F6"
  },
  "prefix": "acme",
  "darkModeSelector": "[data-acme-theme=\"dark\"]"
}
```
