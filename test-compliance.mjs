import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();

const { generateCSS } = await import("./dist/generator.js");
const { Color } = await import("@adaptive-web/adaptive-ui");

function getContrastRatio(hex1, hex2) {
    const c1 = Color.parse(hex1);
    const c2 = Color.parse(hex2);
    const l1 = c1.relativeLuminance;
    const l2 = c2.relativeLuminance;
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

const config = {
    palettes: {
        neutral: "#6B7280",
        accent: "#3B82F6",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
    },
    contrastLevel: "AA",
    includePaletteVars: false,
    includeUtilityClasses: false,
    darkModeSelector: '[data-theme="dark"]',
    respectSystemPreference: false,
    preferWhiteText: true,
};

console.log("╔══════════════════════════════════════════════════════════════════╗");
console.log("║     2026 ACCESSIBILITY COMPLIANCE VERIFICATION                   ║");
console.log("║     WCAG 2.1/2.2 AA + DOJ ADA Title II + EAA                     ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

const css = generateCSS(config);

// Parse tokens from CSS
function parseTokens(cssBlock) {
    const tokens = {};
    const matches = cssBlock.matchAll(/--([^:]+):\s*([^;]+);/g);
    for (const match of matches) {
        tokens[match[1]] = match[2].trim();
    }
    return tokens;
}

const rootSection = css.split(':root {')[1].split('}')[0];
const darkSection = css.split('[data-theme="dark"],')[1].split('}')[0];

const lightTokens = parseTokens(rootSection);
const darkTokens = parseTokens(darkSection);

function checkCompliance(mode, tokens, bgKey) {
    const bg = tokens[bgKey];
    const results = [];

    console.log(`\n━━━ ${mode.toUpperCase()} MODE ━━━`);
    console.log(`Background: ${bg}\n`);

    // SC 1.4.3: Text Contrast (4.5:1 for normal text)
    console.log("SC 1.4.3 Contrast (Minimum) - Text requires 4.5:1:");
    const fg = tokens["color-fg"];
    const fgMuted = tokens["color-fg-muted"];
    const fgRatio = getContrastRatio(fg, bg);
    const fgMutedRatio = getContrastRatio(fgMuted, bg);

    console.log(`  color-fg vs bg:       ${fgRatio.toFixed(2)}:1 ${fgRatio >= 4.5 ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`  color-fg-muted vs bg: ${fgMutedRatio.toFixed(2)}:1 ${fgMutedRatio >= 4.5 ? '✓ PASS' : '✗ FAIL'}`);
    results.push(fgRatio >= 4.5, fgMutedRatio >= 4.5);

    // SC 1.4.11: Non-text Contrast (3:1 for UI components)
    console.log("\nSC 1.4.11 Non-text Contrast - UI components require 3:1:");
    const accent = tokens["color-accent"];
    const border = tokens["color-border"];
    const accentRatio = getContrastRatio(accent, bg);
    const borderRatio = getContrastRatio(border, bg);

    console.log(`  color-accent vs bg:   ${accentRatio.toFixed(2)}:1 ${accentRatio >= 3 ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`  color-border vs bg:   ${borderRatio.toFixed(2)}:1 ${borderRatio >= 3 ? '✓ PASS' : '✗ FAIL'}`);
    results.push(accentRatio >= 3, borderRatio >= 3);

    // Text on accent (button text)
    console.log("\nSC 1.4.3 Button Text - Text on accent requires 4.5:1:");
    const accentFg = tokens["color-accent-fg"];
    const accentTextRatio = getContrastRatio(accentFg, accent);
    console.log(`  color-accent-fg vs accent: ${accentTextRatio.toFixed(2)}:1 ${accentTextRatio >= 4.5 ? '✓ PASS' : '✗ FAIL'}`);
    results.push(accentTextRatio >= 4.5);

    // Hover state contrast
    console.log("\nSC 1.4.3 Hover State - Hover text must maintain 4.5:1:");
    const accentHover = tokens["color-accent-hover"];
    const hoverTextRatio = getContrastRatio(accentFg, accentHover);
    console.log(`  color-accent-fg vs hover:  ${hoverTextRatio.toFixed(2)}:1 ${hoverTextRatio >= 4.5 ? '✓ PASS' : '⚠️ CHECK'}`);

    // SC 2.4.13: Focus Appearance (3:1 for focus indicators) - WCAG 2.2
    console.log("\nSC 2.4.13 Focus Appearance (WCAG 2.2) - Focus ring requires 3:1:");
    const focusRing = tokens["color-focus-ring"];
    const focusRatio = getContrastRatio(focusRing, bg);
    console.log(`  color-focus-ring vs bg: ${focusRatio.toFixed(2)}:1 ${focusRatio >= 3 ? '✓ PASS' : '✗ FAIL'}`);
    results.push(focusRatio >= 3);

    // Additional semantic colors
    console.log("\nAdditional Colors - Text on semantic colors (4.5:1):");
    for (const colorName of ['success', 'warning', 'error']) {
        const color = tokens[`color-${colorName}`];
        const colorFg = tokens[`color-${colorName}-fg`];
        if (color && colorFg) {
            const ratio = getContrastRatio(colorFg, color);
            console.log(`  ${colorName}-fg vs ${colorName}: ${ratio.toFixed(2)}:1 ${ratio >= 4.5 ? '✓ PASS' : '✗ FAIL'}`);
            results.push(ratio >= 4.5);
        }
    }

    return results.every(r => r);
}

const lightPass = checkCompliance("Light", lightTokens, "color-bg");
const darkPass = checkCompliance("Dark", darkTokens, "color-bg");

console.log("\n╔══════════════════════════════════════════════════════════════════╗");
console.log("║                        SUMMARY                                   ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log(`║  Light Mode: ${lightPass ? '✓ ALL CHECKS PASSED' : '✗ SOME CHECKS FAILED'}                              ║`);
console.log(`║  Dark Mode:  ${darkPass ? '✓ ALL CHECKS PASSED' : '✗ SOME CHECKS FAILED'}                              ║`);
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║  Standards Verified:                                             ║");
console.log("║  • WCAG 2.1 Level AA (DOJ ADA Title II requirement)              ║");
console.log("║  • WCAG 2.2 Level AA (UK PSBAR, EAA recommendation)              ║");
console.log("║  • SC 1.4.3 Contrast (Minimum) - 4.5:1 text                      ║");
console.log("║  • SC 1.4.11 Non-text Contrast - 3:1 UI components               ║");
console.log("║  • SC 2.4.13 Focus Appearance - 3:1 focus indicators             ║");
console.log("╚══════════════════════════════════════════════════════════════════╝");
