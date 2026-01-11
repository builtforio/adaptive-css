# Color System

This document explains the color science and algorithms behind Adaptive CSS.

## Overview

Adaptive CSS uses algorithms from [Adaptive UI](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components), the same color system used in Microsoft's Fluent UI Web Components. The system is designed to:

1. Generate perceptually uniform color palettes
2. Automatically select colors meeting contrast requirements
3. Adapt colors for different contexts (light/dark mode)

---

## Palette Generation

### The Problem with RGB Gradients

Simple RGB interpolation produces uneven gradients:

```
#3B82F6 (blue) → #FFFFFF (white)

RGB interpolation produces washed-out,
perceptually uneven steps
```

### LAB Color Space

Adaptive CSS generates palettes using the **LAB color space**, which is designed to be perceptually uniform. This means equal numerical steps produce equal perceived differences.

```
LAB Lightness (L): 0 (black) to 100 (white)
a: green (-) to red (+)
b: blue (-) to yellow (+)
```

### Generation Algorithm

1. **Convert base color to LAB**
   ```
   #3B82F6 → L:55, a:10, b:-60
   ```

2. **Create high-resolution luminance ramp**
   - Keep `a` and `b` constant (preserves hue)
   - Vary `L` from 0 to 100
   - Generate 200+ intermediate colors

3. **Sample by contrast**
   - Start from lightest color
   - Find next color with minimum 1.05:1 contrast
   - Repeat until reaching darkest color
   - Result: ~50 swatches with consistent perceived steps

4. **Preserve saturation**
   - LAB can desaturate colors at extremes
   - Algorithm bumps saturation back to match source

### Palette Output

The result is a palette ordered light-to-dark:

```
Index 0:  #FFFFFF (lightest)
Index 1:  #EFF6FF
Index 2:  #DBEAFE
...
Index 25: #3B82F6 (source color, approximately)
...
Index 50: #1E1B4B
Index 51: #000000 (darkest)
```

---

## Contrast Calculation

### WCAG Contrast Formula

Contrast ratio is calculated using the WCAG 2.1 formula:

```
Contrast = (L1 + 0.05) / (L2 + 0.05)

Where L1 is the lighter color's relative luminance
and L2 is the darker color's relative luminance
```

Relative luminance is calculated as:

```
L = 0.2126 * R + 0.7152 * G + 0.0722 * B

Where R, G, B are linearized (gamma-corrected) values
```

### Contrast Levels

| Level | Ratio | Use Case |
|-------|-------|----------|
| AA (normal text) | 4.5:1 | Body text, UI text |
| AA (large text) | 3:1 | 18pt+ or 14pt bold |
| AAA | 7:1 | Enhanced accessibility |

### Finding Contrasting Colors

When selecting a color from a palette:

1. Calculate the reference color's luminance
2. Search the palette for colors meeting the target ratio
3. Prefer colors in the "natural" direction (darker for light backgrounds)
4. Return the first color meeting the requirement

```javascript
// Simplified algorithm
function findContrastingColor(palette, reference, targetRatio) {
  const refLuminance = getLuminance(reference);

  for (const swatch of palette) {
    const ratio = getContrastRatio(swatch, reference);
    if (ratio >= targetRatio) {
      return swatch;
    }
  }
}
```

---

## Semantic Color Selection

### Background Colors

Background colors are selected from fixed palette indices based on mode:

| Token | Light Mode Index | Dark Mode Index |
|-------|-----------------|-----------------|
| `--color-bg` | 1 (near white) | last - 2 (near black) |
| `--color-bg-subtle` | 0 (white) | last - 1 (darker) |
| `--color-bg-elevated` | 2 (light gray) | last - 4 (lighter) |
| `--color-bg-surface` | 1 | last - 3 |

### Foreground Colors

Foreground colors are calculated for contrast:

```javascript
function getForeground(background) {
  const blackContrast = getContrastRatio(black, background);
  const whiteContrast = getContrastRatio(white, background);

  // Prefer black (defaultBlack: true)
  if (blackContrast >= targetRatio) return black;
  if (whiteContrast >= targetRatio) return white;

  // If neither meets target, return higher contrast
  return blackContrast > whiteContrast ? black : white;
}
```

### Accent Colors

Accent colors are selected to contrast with the current background:

```javascript
function getAccent(accentPalette, background) {
  // Find swatch in accent palette that meets contrast
  return findContrastingColor(accentPalette, background, 4.5);
}
```

This means:
- **Light mode**: Darker accent shades are used
- **Dark mode**: Lighter accent shades are used

---

## Adaptive Behavior

### Why Colors Change Between Modes

A single hex color can't work in both modes:

```
Background: #FFFFFF (light) vs #111827 (dark)
Accent #3B82F6:
  - On white: 3.2:1 contrast ❌ (fails AA)
  - On dark:  5.1:1 contrast ✓ (passes AA)
```

The system automatically selects different shades:

```
Light mode: #1D4ED8 (darker blue, 5.5:1 on white) ✓
Dark mode:  #60A5FA (lighter blue, 5.8:1 on dark) ✓
```

### Color Relationships

The system maintains relationships even as colors adapt:

- Hover states are always slightly different from rest
- Active states are more different than hover
- Foreground always contrasts with its background

---

## Perceptual Uniformity

### What It Means

In a perceptually uniform palette:
- The difference between index 5 and 6 looks the same as 25 and 26
- You can safely skip indices for consistent visual steps
- Animations between adjacent colors appear smooth

### Why It Matters

Non-uniform palettes cause problems:

```
RGB gradient:
- Steps 1-10: Barely visible changes
- Steps 15-20: Dramatic jumps
- Makes it hard to design consistent UIs
```

Uniform palettes:
```
LAB-based gradient:
- Each step is equally perceptible
- Predictable results when picking colors
- Consistent visual hierarchy
```

---

## Color Spaces Used

### Input: Hex RGB

Colors are specified as hex strings:

```
#3B82F6
```

### Processing: LAB

Palette generation uses CIELAB:

```
L: 55.41
a: 10.23
b: -60.17
```

### Processing: HSL

Saturation preservation uses HSL:

```
H: 217°
S: 91%
L: 60%
```

### Output: Hex RGB

Final output is hex for CSS compatibility:

```
#3B82F6
```

---

## Comparison with Other Systems

### vs. Simple Tint/Shade

Traditional approach:
```css
--blue-100: mix(white, blue, 90%);
--blue-200: mix(white, blue, 80%);
/* Not perceptually uniform */
/* No contrast guarantees */
```

Adaptive CSS:
```css
--accent-10: #DBEAFE; /* Calculated for uniformity */
--accent-20: #93C5FD; /* Guaranteed contrast steps */
```

### vs. Manual Color Picking

Manual approach:
- Pick colors by eye
- Check contrast manually
- Redo for dark mode

Adaptive CSS:
- Define base colors
- Contrast automatically ensured
- Dark mode generated automatically

### vs. Tailwind Default Palette

Tailwind provides pre-defined palettes (gray-50 to gray-950).

Adaptive CSS:
- Generates from your brand color
- Ensures your exact hue throughout
- Mathematically consistent steps
