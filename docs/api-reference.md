# API Reference

Adaptive CSS can be used programmatically in JavaScript/TypeScript applications.

## Installation

```bash
npm install adaptive-css
```

## Basic Usage

```typescript
import { generateCSS } from 'adaptive-css';

const css = generateCSS({
  palettes: {
    neutral: '#6B7280',
    accent: '#3B82F6',
  },
});

console.log(css);
```

---

## Functions

### `generateCSS(config)`

Generates a complete CSS string from a configuration object.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `ColorSystemConfig` | Configuration object |

**Returns:** `string` — The generated CSS

**Example:**

```typescript
import { generateCSS } from 'adaptive-css';

const css = generateCSS({
  palettes: {
    neutral: '#6B7280',
    accent: '#3B82F6',
    success: '#10B981',
  },
  contrastLevel: 'AA',
  includePaletteVars: true,
  includeUtilityClasses: true,
});

// Write to file
import { writeFileSync } from 'fs';
writeFileSync('colors.css', css);
```

---

## Classes

### `ColorSystemGenerator`

The main class for generating color systems. Use this when you need more control than `generateCSS()` provides.

#### Constructor

```typescript
new ColorSystemGenerator(config: ColorSystemConfig)
```

#### Methods

##### `generate(): string`

Generates the complete CSS output.

```typescript
const generator = new ColorSystemGenerator({
  palettes: {
    neutral: '#6B7280',
    accent: '#3B82F6',
  },
});

const css = generator.generate();
```

##### `getPaletteInfo(): Record<string, PaletteInfo>`

Returns information about the generated palettes. Useful for debugging or building custom tooling.

```typescript
const generator = new ColorSystemGenerator({
  palettes: {
    neutral: '#6B7280',
    accent: '#3B82F6',
  },
});

const info = generator.getPaletteInfo();
console.log(info);
// {
//   neutral: {
//     base: '#6B7280',
//     swatches: ['#FFFFFF', '#F9FAFB', ..., '#000000']
//   },
//   accent: {
//     base: '#3B82F6',
//     swatches: ['#FFFFFF', '#EFF6FF', ..., '#000000']
//   }
// }
```

---

## Types

### `ColorSystemConfig`

Main configuration interface.

```typescript
interface ColorSystemConfig {
  palettes: {
    neutral: string | PaletteConfig;
    accent: string | PaletteConfig;
    [key: string]: string | PaletteConfig;
  };
  contrastLevel?: 'AA' | 'AAA';
  includePaletteVars?: boolean;
  includeUtilityClasses?: boolean;
  darkModeSelector?: string;
  respectSystemPreference?: boolean;
  prefix?: string;
}
```

### `PaletteConfig`

Configuration for a single palette.

```typescript
interface PaletteConfig {
  base: string;      // Hex color, e.g., '#3B82F6'
  name?: string;     // Optional custom name
}
```

### `defaultConfig`

Default configuration values.

```typescript
import { defaultConfig } from 'adaptive-css';

console.log(defaultConfig);
// {
//   contrastLevel: 'AA',
//   includePaletteVars: true,
//   includeUtilityClasses: true,
//   darkModeSelector: '[data-theme="dark"]',
//   respectSystemPreference: true,
//   prefix: ''
// }
```

---

## Advanced Usage

### Custom Build Script

```typescript
// scripts/build-colors.ts
import { generateCSS } from 'adaptive-css';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const config = {
  palettes: {
    neutral: process.env.NEUTRAL_COLOR || '#6B7280',
    accent: process.env.ACCENT_COLOR || '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  contrastLevel: 'AA' as const,
};

const css = generateCSS(config);

const outputPath = 'src/styles/colors.css';
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, css);

console.log(`Generated ${outputPath}`);
```

### Generating Multiple Themes

```typescript
import { generateCSS, ColorSystemConfig } from 'adaptive-css';
import { writeFileSync } from 'fs';

const themes: Record<string, ColorSystemConfig> = {
  blue: {
    palettes: { neutral: '#6B7280', accent: '#3B82F6' },
  },
  purple: {
    palettes: { neutral: '#6B7280', accent: '#8B5CF6' },
  },
  green: {
    palettes: { neutral: '#6B7280', accent: '#10B981' },
  },
};

for (const [name, config] of Object.entries(themes)) {
  const css = generateCSS({
    ...config,
    prefix: name,
  });
  writeFileSync(`themes/${name}.css`, css);
}
```

### Extracting Palette Data

```typescript
import { ColorSystemGenerator } from 'adaptive-css';
import { writeFileSync } from 'fs';

const generator = new ColorSystemGenerator({
  palettes: {
    neutral: '#6B7280',
    accent: '#3B82F6',
  },
});

// Get palette data as JSON
const paletteInfo = generator.getPaletteInfo();

// Create a JSON token file
const tokens = {
  colors: {} as Record<string, Record<string, string>>,
};

for (const [name, info] of Object.entries(paletteInfo)) {
  tokens.colors[name] = {};
  info.swatches.forEach((color, index) => {
    tokens.colors[name][index.toString()] = color;
  });
}

writeFileSync('design-tokens.json', JSON.stringify(tokens, null, 2));
```

### Integration with PostCSS

```typescript
// postcss.config.js
import { generateCSS } from 'adaptive-css';
import { writeFileSync } from 'fs';

// Generate colors before PostCSS runs
const css = generateCSS({
  palettes: {
    neutral: '#6B7280',
    accent: '#3B82F6',
  },
});
writeFileSync('src/styles/generated-colors.css', css);

export default {
  plugins: [
    // Your PostCSS plugins
  ],
};
```

### Watch Mode for Development

```typescript
// scripts/watch-colors.ts
import { generateCSS } from 'adaptive-css';
import { writeFileSync, watchFile, readFileSync } from 'fs';

const configPath = 'adaptive-css.config.json';
const outputPath = 'src/styles/colors.css';

function build() {
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    const css = generateCSS(config);
    writeFileSync(outputPath, css);
    console.log(`[${new Date().toLocaleTimeString()}] Generated ${outputPath}`);
  } catch (error) {
    console.error('Build error:', error);
  }
}

// Initial build
build();

// Watch for config changes
watchFile(configPath, { interval: 1000 }, () => {
  console.log('Config changed, rebuilding...');
  build();
});

console.log(`Watching ${configPath} for changes...`);
```

---

## Error Handling

The generator throws errors for invalid input:

```typescript
import { generateCSS } from 'adaptive-css';

try {
  const css = generateCSS({
    palettes: {
      neutral: 'not-a-color', // Invalid!
      accent: '#3B82F6',
    },
  });
} catch (error) {
  console.error('Invalid configuration:', error.message);
  // "Invalid color "not-a-color" for palette "neutral""
}
```

Common errors:

| Error | Cause |
|-------|-------|
| `Invalid color "..." for palette "..."` | Hex color couldn't be parsed |
| `Palette "neutral" not found` | Required palette missing |
| `Palette "accent" not found` | Required palette missing |

---

## Node.js Environment

The library requires a DOM environment due to dependencies. This is handled automatically in the CLI, but for programmatic usage you may need to polyfill:

```typescript
// At the very top of your entry file
import { GlobalRegistrator } from '@happy-dom/global-registrator';
GlobalRegistrator.register();

// Now you can import adaptive-css
import { generateCSS } from 'adaptive-css';
```

Or use the CLI for build scripts:

```bash
adaptive-css --config colors.json --output colors.css
```
