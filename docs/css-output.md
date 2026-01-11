# CSS Output

This document explains the structure and contents of the generated CSS.

## Output Structure

The generated CSS file contains four main sections:

```css
/**
 * Adaptive Color System
 * Generated with adaptive-css
 * Contrast Level: WCAG AA (4.5:1)
 */

/* 1. Root Variables (Light Mode Default) */
:root {
  /* Raw palette values */
  /* Semantic tokens */
}

/* 2. Dark Mode Overrides */
[data-theme="dark"],
.dark {
  /* Semantic token overrides */
}

/* 3. System Preference Media Query */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not(.light) {
    /* Semantic token overrides */
  }
}

/* 4. Utility Classes */
.bg-default { ... }
.text-muted { ... }
```

---

## Raw Palette Variables

When `includePaletteVars` is `true`, the full palette is included:

```css
:root {
  /* neutral palette */
  --neutral-0: #ffffff;
  --neutral-1: #f9fafb;
  --neutral-2: #f3f4f6;
  --neutral-3: #e5e7eb;
  /* ... continues to ~55 swatches */
  --neutral-54: #030712;
  --neutral-55: #000000;

  /* accent palette */
  --accent-0: #ffffff;
  --accent-1: #eff6ff;
  --accent-2: #dbeafe;
  /* ... continues to ~52 swatches */
  --accent-51: #1e1b4b;
  --accent-52: #000000;
}
```

### Palette Ordering

Palettes are ordered from **light to dark**:
- Index `0` is always the lightest (white or near-white)
- Higher indices are progressively darker
- The last index is always the darkest (black or near-black)

### Using Raw Palette Values

Access any swatch directly when you need fine-grained control:

```css
.custom-highlight {
  background: var(--accent-5);
  border-left: 4px solid var(--accent-25);
}

.subtle-surface {
  background: var(--neutral-2);
}
```

---

## Semantic Tokens

Semantic tokens provide meaningful names for common use cases.

### Background Tokens

| Token | Purpose | Light Mode | Dark Mode |
|-------|---------|------------|-----------|
| `--color-bg` | Primary background | Near white | Near black |
| `--color-bg-subtle` | Subtle/recessed background | White | Darker |
| `--color-bg-elevated` | Elevated surfaces (cards, modals) | Light gray | Lighter than bg |
| `--color-bg-surface` | Content surface areas | Near white | Dark gray |

```css
body {
  background: var(--color-bg);
}

.card {
  background: var(--color-bg-elevated);
}

.sidebar {
  background: var(--color-bg-subtle);
}
```

### Foreground Tokens

| Token | Purpose | Light Mode | Dark Mode |
|-------|---------|------------|-----------|
| `--color-fg` | Primary text | Black | White |
| `--color-fg-muted` | Secondary/muted text | Gray | Light gray |

```css
h1 {
  color: var(--color-fg);
}

.caption {
  color: var(--color-fg-muted);
}
```

### Border Tokens

| Token | Purpose | Light Mode | Dark Mode |
|-------|---------|------------|-----------|
| `--color-border` | Standard borders | Medium gray | Medium gray |
| `--color-border-subtle` | Subtle separators | Light gray | Dark gray |

```css
.divider {
  border-top: 1px solid var(--color-border-subtle);
}

.input {
  border: 1px solid var(--color-border);
}
```

### Accent Tokens

| Token | Purpose | Light Mode | Dark Mode |
|-------|---------|------------|-----------|
| `--color-accent` | Primary brand color | Contrasting accent | Contrasting accent |
| `--color-accent-hover` | Hover state | Slightly darker | Slightly lighter |
| `--color-accent-active` | Active/pressed state | Darker | Lighter |
| `--color-accent-fg` | Text on accent background | White or black | White or black |

```css
.button-primary {
  background: var(--color-accent);
  color: var(--color-accent-fg);
}

.button-primary:hover {
  background: var(--color-accent-hover);
}

.button-primary:active {
  background: var(--color-accent-active);
}
```

### Additional Color Tokens

For each additional palette (success, warning, error, info), these tokens are generated:

| Token | Purpose |
|-------|---------|
| `--color-{name}` | The color meeting contrast requirements |
| `--color-{name}-fg` | Foreground color for text on that background |

```css
.alert-success {
  background: var(--color-success);
  color: var(--color-success-fg);
}

.alert-error {
  background: var(--color-error);
  color: var(--color-error-fg);
}
```

---

## Utility Classes

When `includeUtilityClasses` is `true`, these classes are generated:

### Background Classes

| Class | Property |
|-------|----------|
| `.bg-default` | `background-color: var(--color-bg)` |
| `.bg-subtle` | `background-color: var(--color-bg-subtle)` |
| `.bg-elevated` | `background-color: var(--color-bg-elevated)` |
| `.bg-surface` | `background-color: var(--color-bg-surface)` |
| `.bg-accent` | `background-color: var(--color-accent)` |

### Text Classes

| Class | Property |
|-------|----------|
| `.text-default` | `color: var(--color-fg)` |
| `.text-muted` | `color: var(--color-fg-muted)` |
| `.text-accent` | `color: var(--color-accent)` |
| `.text-on-accent` | `color: var(--color-accent-fg)` |

### Border Classes

| Class | Property |
|-------|----------|
| `.border-default` | `border-color: var(--color-border)` |
| `.border-subtle` | `border-color: var(--color-border-subtle)` |
| `.border-accent` | `border-color: var(--color-accent)` |

### Usage Example

```html
<div class="bg-elevated border-default" style="border-width: 1px;">
  <h2 class="text-default">Card Title</h2>
  <p class="text-muted">Card description text</p>
  <button class="bg-accent text-on-accent">
    Action Button
  </button>
</div>
```

---

## Dark Mode Output

The dark mode section overrides semantic tokens only (not raw palette values):

```css
[data-theme="dark"],
.dark {
  /* Backgrounds */
  --color-bg: #0d0f21;
  --color-bg-subtle: #060719;
  --color-bg-elevated: #1a1c2d;
  --color-bg-surface: #141628;

  /* Foregrounds */
  --color-fg: #ffffff;
  --color-fg-muted: #6b7280;

  /* Borders */
  --color-border: #374151;
  --color-border-subtle: #1f2937;

  /* Accent - recalculated for dark backgrounds */
  --color-accent: #60a5fa;
  --color-accent-hover: #93c5fd;
  --color-accent-active: #3b82f6;
  --color-accent-fg: #000000;

  /* Additional colors */
  --color-success: #34d399;
  --color-success-fg: #000000;
}
```

### Why Accents Change

The accent color is recalculated in dark mode to maintain contrast:
- In light mode, a darker shade of the accent might be used
- In dark mode, a lighter shade ensures readability
- The foreground (`--color-accent-fg`) flips between white and black as needed

---

## File Size

Approximate output sizes:

| Configuration | Approximate Size |
|--------------|------------------|
| Minimal (2 palettes, no utilities) | ~3 KB |
| Standard (2 palettes + utilities) | ~8 KB |
| Full (6 palettes + utilities) | ~20 KB |
| Full, minified | ~12 KB |
| Full, minified + gzipped | ~2 KB |

To minimize size:
- Set `includePaletteVars: false` if you don't need raw values
- Set `includeUtilityClasses: false` if using a CSS framework
- Minify with your build tool
