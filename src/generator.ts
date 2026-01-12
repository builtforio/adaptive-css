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
        return blackOrWhiteByContrast(background, this.contrastRatio, true).toColorString();
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

        // Borders
        const borderIdx = isDark ? lastIdx - 8 : 6;
        const borderSubtleIdx = isDark ? lastIdx - 6 : 4;

        // Accent colors
        const accentColor = Color.parse(this.getContrastColor(accent.palette, bgColor))!;
        const accentHoverIdx = accent.palette.swatches.findIndex(
            s => s.toColorString() === accentColor.toColorString()
        );
        const accentHover = accent.swatches[Math.max(0, accentHoverIdx - (isDark ? -2 : 2))];
        const accentActive = accent.swatches[Math.min(lastIdx, accentHoverIdx + (isDark ? -2 : 2))];
        const accentFg = this.getForegroundColor(accentColor);

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
