/**
 * Configuration for a color palette
 */
export interface PaletteConfig {
    /** Base color in hex format (e.g., "#0078D4") */
    base: string;
    /** Optional name for the palette (defaults to key name) */
    name?: string;
}

/**
 * Configuration for semantic color mappings
 */
export interface SemanticConfig {
    /** Palette to use for backgrounds */
    background?: string;
    /** Palette to use for foreground/text */
    foreground?: string;
    /** Light mode swatch index for background */
    lightIndex?: number;
    /** Dark mode swatch index for background */
    darkIndex?: number;
}

/**
 * Main configuration for the color system
 */
export interface ColorSystemConfig {
    /** Palettes to generate */
    palettes: {
        neutral: string | PaletteConfig;
        accent: string | PaletteConfig;
        [key: string]: string | PaletteConfig;
    };

    /** WCAG contrast level: "AA" (4.5:1) or "AAA" (7:1) */
    contrastLevel?: "AA" | "AAA";

    /** Whether to include raw palette variables (--neutral-0, etc.) */
    includePaletteVars?: boolean;

    /** Whether to include utility classes */
    includeUtilityClasses?: boolean;

    /** CSS selector for dark mode */
    darkModeSelector?: string;

    /** Whether to respect prefers-color-scheme */
    respectSystemPreference?: boolean;

    /** Custom prefix for CSS variables */
    prefix?: string;
}

/**
 * Generated color values for a mode
 */
export interface ModeColors {
    bg: string;
    bgSubtle: string;
    bgElevated: string;
    bgSurface: string;
    fg: string;
    fgMuted: string;
    border: string;
    borderSubtle: string;
    accent: string;
    accentHover: string;
    accentActive: string;
    accentFg: string;
    [key: string]: string;
}

/**
 * Default configuration values
 */
export const defaultConfig: Partial<ColorSystemConfig> = {
    contrastLevel: "AA",
    includePaletteVars: true,
    includeUtilityClasses: true,
    darkModeSelector: '[data-theme="dark"]',
    respectSystemPreference: true,
    prefix: "",
};
