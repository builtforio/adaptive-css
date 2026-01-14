import {
    Color,
    PaletteRGB,
    contrastSwatch,
    blackOrWhiteByContrast,
    type Palette,
} from "@adaptive-web/adaptive-ui";
import { ColorSystemConfig, defaultConfig, PaletteConfig } from "./types.js";

interface GeneratedPalette {
    name: string;
    palette: PaletteRGB;
    swatches: string[];
}

/**
 * Generates an adaptive color system as CSS
 */
export class ColorSystemGenerator {
    private config: Required<ColorSystemConfig>;
    private palettes: Map<string, GeneratedPalette> = new Map();
    private contrastRatio: number;

    constructor(config: ColorSystemConfig) {
        this.config = { ...defaultConfig, ...config } as Required<ColorSystemConfig>;
        this.contrastRatio = this.config.contrastLevel === "AAA" ? 7 : 4.5;
        this.generatePalettes();
    }

    private generatePalettes(): void {
        for (const [key, value] of Object.entries(this.config.palettes)) {
            const paletteConfig: PaletteConfig = typeof value === "string"
                ? { base: value }
                : value;

            const color = Color.parse(paletteConfig.base);
            if (!color) {
                throw new Error(`Invalid color "${paletteConfig.base}" for palette "${key}"`);
            }

            const palette = PaletteRGB.from(color);
            this.palettes.set(key, {
                name: paletteConfig.name || key,
                palette,
                swatches: palette.swatches.map(s => s.toColorString()),
            });
        }
    }

    private getPalette(name: string): GeneratedPalette {
        const palette = this.palettes.get(name);
        if (!palette) {
            throw new Error(`Palette "${name}" not found`);
        }
        return palette;
    }

    private getContrastColor(palette: Palette, reference: Color): string {
        return contrastSwatch(palette, reference, this.contrastRatio).toColorString();
    }

    private getForegroundColor(background: Color): string {
        // defaultBlack: false = prefer white, true = prefer black
        const preferBlack = !this.config.preferWhiteText;
        return blackOrWhiteByContrast(background, this.contrastRatio, preferBlack).toColorString();
    }

    /**
     * Calculate WCAG contrast ratio between two colors
     */
    private getContrastRatio(color1: Color, color2: Color): number {
        const l1 = color1.relativeLuminance;
        const l2 = color2.relativeLuminance;
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * Get accent color optimized for the preferred text color.
     * When preferWhiteText is true, finds a darker accent that allows white text.
     * When preferWhiteText is false (default), finds a lighter accent that allows black text.
     *
     * WCAG 2.1 Requirements (2026 Standards):
     * - Text contrast (SC 1.4.3): 4.5:1 for AA, 7:1 for AAA (normal text)
     * - Button-to-background (SC 1.4.11): 3:1 minimum for non-text UI elements
     *
     * The algorithm prioritizes:
     * 1. Swatches that meet text contrast AND have 3:1+ against background
     * 2. If none found with preferred text, find best available option
     *
     * Returns both the color and whether the preferred foreground meets accessibility requirements.
     */
    private getAccentColorWithPreferredText(
        palette: PaletteRGB,
        background: Color
    ): { color: Color; preferredFgAccessible: boolean } {
        const white = Color.parse("#ffffff")!;
        const black = Color.parse("#000000")!;
        const preferWhite = this.config.preferWhiteText;
        const preferredFg = preferWhite ? white : black;

        // WCAG 2.1 SC 1.4.11: Non-text elements need 3:1 contrast against background
        const nonTextContrastMin = 3.0;

        // Collect all swatches with their contrast info
        const allSwatches: {
            index: number;
            swatch: Color;
            bgContrast: number;
            fgContrast: number;
        }[] = [];

        for (let i = 0; i < palette.swatches.length; i++) {
            const swatch = palette.swatches[i];
            const bgContrast = this.getContrastRatio(swatch, background);
            const fgContrast = this.getContrastRatio(swatch, preferredFg);
            allSwatches.push({ index: i, swatch, bgContrast, fgContrast });
        }

        // Strategy 1: Find swatches that meet text contrast AND 3:1 background contrast
        // This is the ideal case - button is visible AND text is accessible
        const perfectSwatches = allSwatches.filter(
            s => s.bgContrast >= nonTextContrastMin && s.fgContrast >= this.contrastRatio
        );

        if (perfectSwatches.length > 0) {
            // Pick the one with highest background contrast for best visibility
            perfectSwatches.sort((a, b) => b.bgContrast - a.bgContrast);
            return { color: perfectSwatches[0].swatch, preferredFgAccessible: true };
        }

        // Strategy 2: Find swatches that meet 3:1 background contrast
        // Then pick based on text preference
        const visibleSwatches = allSwatches.filter(s => s.bgContrast >= nonTextContrastMin);

        if (visibleSwatches.length > 0) {
            if (preferWhite) {
                // For white text preference, pick the darkest visible swatch
                // (highest index = darkest = best chance for white text contrast)
                visibleSwatches.sort((a, b) => b.index - a.index);
            } else {
                // For black text preference, pick the lightest visible swatch
                visibleSwatches.sort((a, b) => a.index - b.index);
            }
            // Check if the selected swatch meets text contrast
            const selected = visibleSwatches[0];
            return {
                color: selected.swatch,
                preferredFgAccessible: selected.fgContrast >= this.contrastRatio,
            };
        }

        // Strategy 3: Fallback - no swatches meet 3:1 background contrast
        // Use standard contrast swatch (prioritizes text readability over button visibility)
        return {
            color: contrastSwatch(palette, background, this.contrastRatio),
            preferredFgAccessible: false,
        };
    }

    private varName(name: string): string {
        const prefix = this.config.prefix ? `${this.config.prefix}-` : "";
        return `--${prefix}${name}`;
    }

    private generatePaletteVars(): string {
        if (!this.config.includePaletteVars) return "";

        const lines: string[] = ["  /* Raw Palette Values */"];

        for (const [key, { swatches }] of this.palettes) {
            lines.push(`  /* ${key} palette */`);
            swatches.forEach((color, i) => {
                lines.push(`  ${this.varName(`${key}-${i}`)}: ${color};`);
            });
            lines.push("");
        }

        return lines.join("\n");
    }

    private generateSemanticTokens(isDark: boolean): string {
        const neutral = this.getPalette("neutral");
        const accent = this.getPalette("accent");

        const lastIdx = neutral.swatches.length - 1;

        // Background indices
        const bgIdx = isDark ? lastIdx - 2 : 1;
        const bgSubtleIdx = isDark ? lastIdx - 1 : 0;
        const bgElevatedIdx = isDark ? lastIdx - 4 : 2;
        const bgSurfaceIdx = isDark ? lastIdx - 3 : 1;

        // Get background color for contrast calculations
        const bgColor = Color.parse(neutral.swatches[bgIdx])!;

        // Foreground
        const fg = this.getForegroundColor(bgColor);
        // Calculate muted foreground with proper contrast
        const fgMuted = this.getContrastColor(neutral.palette, bgColor);

        // Borders - WCAG 2.1 SC 1.4.11 requires 3:1 contrast for UI components
        // Use contrast-based selection to ensure borders are visible
        const border = this.getContrastColor(neutral.palette, bgColor);
        const borderColor = Color.parse(border)!;
        const borderIdx = neutral.palette.swatches.findIndex(
            s => s.toColorString() === borderColor.toColorString()
        );
        // Subtle border is slightly closer to background but still aims for visibility
        const borderSubtleIdx = Math.max(0, borderIdx - (isDark ? 2 : -2));

        // Accent colors - use preference-aware selection
        const accentResult = this.getAccentColorWithPreferredText(accent.palette, bgColor);
        const accentColor = accentResult.color;
        const accentHoverIdx = accent.palette.swatches.findIndex(
            s => s.toColorString() === accentColor.toColorString()
        );
        const accentHover = accent.swatches[Math.max(0, accentHoverIdx - (isDark ? -2 : 2))];
        const accentActive = accent.swatches[Math.min(lastIdx, accentHoverIdx + (isDark ? -2 : 2))];
        // Use the preferred foreground if accessible, otherwise fall back to contrast-based selection
        const accentFg = accentResult.preferredFgAccessible
            ? (this.config.preferWhiteText ? "#ffffff" : "#000000")
            : this.getForegroundColor(accentColor);

        // WCAG 2.2 SC 2.4.13 Focus Appearance: Focus indicator needs 3:1 contrast
        // Generate a focus ring color that contrasts with both background and accent
        const focusRing = this.getContrastColor(accent.palette, bgColor);

        // Generate additional palette semantic tokens
        const additionalTokens: string[] = [];
        for (const [key, { palette, swatches }] of this.palettes) {
            if (key === "neutral" || key === "accent") continue;

            const color = this.getContrastColor(palette, bgColor);
            const colorParsed = Color.parse(color)!;
            const colorFg = this.getForegroundColor(colorParsed);

            additionalTokens.push(`  ${this.varName(`color-${key}`)}: ${color};`);
            additionalTokens.push(`  ${this.varName(`color-${key}-fg`)}: ${colorFg};`);
        }

        const lines = [
            `  /* Backgrounds */`,
            `  ${this.varName("color-bg")}: ${neutral.swatches[bgIdx]};`,
            `  ${this.varName("color-bg-subtle")}: ${neutral.swatches[bgSubtleIdx]};`,
            `  ${this.varName("color-bg-elevated")}: ${neutral.swatches[bgElevatedIdx]};`,
            `  ${this.varName("color-bg-surface")}: ${neutral.swatches[bgSurfaceIdx]};`,
            ``,
            `  /* Foregrounds */`,
            `  ${this.varName("color-fg")}: ${fg};`,
            `  ${this.varName("color-fg-muted")}: ${fgMuted};`,
            ``,
            `  /* Borders */`,
            `  ${this.varName("color-border")}: ${neutral.swatches[borderIdx]};`,
            `  ${this.varName("color-border-subtle")}: ${neutral.swatches[borderSubtleIdx]};`,
            ``,
            `  /* Accent */`,
            `  ${this.varName("color-accent")}: ${accentColor.toColorString()};`,
            `  ${this.varName("color-accent-hover")}: ${accentHover};`,
            `  ${this.varName("color-accent-active")}: ${accentActive};`,
            `  ${this.varName("color-accent-fg")}: ${accentFg};`,
            ``,
            `  /* Focus - WCAG 2.2 SC 2.4.13 Focus Appearance */`,
            `  ${this.varName("color-focus-ring")}: ${focusRing};`,
        ];

        if (additionalTokens.length > 0) {
            lines.push(``);
            lines.push(`  /* Additional Colors */`);
            lines.push(...additionalTokens);
        }

        return lines.join("\n");
    }

    private generateUtilityClasses(): string {
        if (!this.config.includeUtilityClasses) return "";

        const v = (name: string) => `var(${this.varName(name)})`;

        return `
/* Background Utilities */
.bg-default { background-color: ${v("color-bg")}; }
.bg-subtle { background-color: ${v("color-bg-subtle")}; }
.bg-elevated { background-color: ${v("color-bg-elevated")}; }
.bg-surface { background-color: ${v("color-bg-surface")}; }
.bg-accent { background-color: ${v("color-accent")}; }

/* Text Utilities */
.text-default { color: ${v("color-fg")}; }
.text-muted { color: ${v("color-fg-muted")}; }
.text-accent { color: ${v("color-accent")}; }
.text-on-accent { color: ${v("color-accent-fg")}; }

/* Border Utilities */
.border-default { border-color: ${v("color-border")}; }
.border-subtle { border-color: ${v("color-border-subtle")}; }
.border-accent { border-color: ${v("color-accent")}; }
`;
    }

    /**
     * Generate the complete CSS output
     */
    generate(): string {
        const sections: string[] = [
            `/**`,
            ` * Adaptive Color System`,
            ` * Generated with adaptive-css`,
            ` * Contrast Level: WCAG ${this.config.contrastLevel} (${this.contrastRatio}:1)`,
            ` */`,
            ``,
        ];

        // Root variables (light mode default)
        sections.push(`:root {`);
        if (this.config.includePaletteVars) {
            sections.push(this.generatePaletteVars());
        }
        sections.push(`  /* Semantic Tokens - Light Mode */`);
        sections.push(this.generateSemanticTokens(false));
        sections.push(`}`);
        sections.push(``);

        // Dark mode
        sections.push(`/* Dark Mode */`);
        sections.push(`${this.config.darkModeSelector},`);
        sections.push(`.dark {`);
        sections.push(this.generateSemanticTokens(true));
        sections.push(`}`);
        sections.push(``);

        // System preference
        if (this.config.respectSystemPreference) {
            sections.push(`/* Respect System Preference */`);
            sections.push(`@media (prefers-color-scheme: dark) {`);
            sections.push(`  :root:not([data-theme="light"]):not(.light) {`);
            sections.push(this.generateSemanticTokens(true).split('\n').map(l => '  ' + l).join('\n'));
            sections.push(`  }`);
            sections.push(`}`);
            sections.push(``);
        }

        // Utility classes
        if (this.config.includeUtilityClasses) {
            sections.push(this.generateUtilityClasses());
        }

        return sections.join("\n");
    }

    /**
     * Get palette information for debugging/inspection
     */
    getPaletteInfo(): Record<string, { base: string; swatches: string[] }> {
        const info: Record<string, { base: string; swatches: string[] }> = {};
        for (const [key, { palette, swatches }] of this.palettes) {
            info[key] = {
                base: palette.source.toColorString(),
                swatches,
            };
        }
        return info;
    }
}

/**
 * Generate CSS from a configuration
 */
export function generateCSS(config: ColorSystemConfig): string {
    const generator = new ColorSystemGenerator(config);
    return generator.generate();
}
