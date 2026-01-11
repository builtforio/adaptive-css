#!/usr/bin/env node

// Polyfill DOM for Node.js environment - must happen before any other imports
import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();

// Now dynamically import everything else
async function main() {
    const { readFileSync, writeFileSync, existsSync } = await import("fs");
    const { resolve } = await import("path");
    const { generateCSS } = await import("./generator.js");

    interface CliArgs {
        config?: string;
        output?: string;
        neutral?: string;
        accent?: string;
        contrast?: "AA" | "AAA";
        help?: boolean;
        init?: boolean;
    }

    function parseArgs(args: string[]): CliArgs {
        const result: CliArgs = {};

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            const next = args[i + 1];

            switch (arg) {
                case "-c":
                case "--config":
                    result.config = next;
                    i++;
                    break;
                case "-o":
                case "--output":
                    result.output = next;
                    i++;
                    break;
                case "--neutral":
                    result.neutral = next;
                    i++;
                    break;
                case "--accent":
                    result.accent = next;
                    i++;
                    break;
                case "--contrast":
                    result.contrast = next as "AA" | "AAA";
                    i++;
                    break;
                case "-h":
                case "--help":
                    result.help = true;
                    break;
                case "--init":
                    result.init = true;
                    break;
            }
        }

        return result;
    }

    function printHelp(): void {
        console.log(`
adaptive-css - Generate accessible, adaptive color systems as CSS

Usage:
  adaptive-css [options]

Options:
  -c, --config <file>    Path to JSON config file
  -o, --output <file>    Output CSS file path (default: stdout)
  --neutral <color>      Neutral base color (hex)
  --accent <color>       Accent base color (hex)
  --contrast <level>     WCAG contrast level: AA or AAA (default: AA)
  --init                 Create a sample config file
  -h, --help             Show this help message

Examples:
  # Generate from config file
  adaptive-css --config colors.json --output colors.css

  # Quick generation with inline colors
  adaptive-css --neutral "#6B7280" --accent "#3B82F6" --output theme.css

  # Create a sample config file
  adaptive-css --init

Config file format:
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
    "darkModeSelector": "[data-theme=\\"dark\\"]",
    "respectSystemPreference": true
  }
`);
    }

    function createSampleConfig(path: string): void {
        const sampleConfig = {
            palettes: {
                neutral: "#6B7280",
                accent: "#3B82F6",
                success: "#10B981",
                warning: "#F59E0B",
                error: "#EF4444",
            },
            contrastLevel: "AA",
            includePaletteVars: true,
            includeUtilityClasses: true,
            darkModeSelector: '[data-theme="dark"]',
            respectSystemPreference: true,
        };

        writeFileSync(path, JSON.stringify(sampleConfig, null, 2));
        console.log(`Created sample config at: ${path}`);
    }

    const args = parseArgs(process.argv.slice(2));

    if (args.help) {
        printHelp();
        process.exit(0);
    }

    if (args.init) {
        const configPath = args.config || "adaptive-css.config.json";
        createSampleConfig(configPath);
        process.exit(0);
    }

    let config: any;

    if (args.config) {
        const configPath = resolve(process.cwd(), args.config);
        if (!existsSync(configPath)) {
            console.error(`Config file not found: ${configPath}`);
            process.exit(1);
        }
        const configContent = readFileSync(configPath, "utf-8");
        config = JSON.parse(configContent);
    } else if (args.neutral && args.accent) {
        config = {
            palettes: {
                neutral: args.neutral,
                accent: args.accent,
            },
            contrastLevel: args.contrast || "AA",
        };
    } else {
        console.error("Error: Must provide either --config or both --neutral and --accent");
        console.error("Run with --help for usage information");
        process.exit(1);
    }

    try {
        const css = generateCSS(config);

        if (args.output) {
            const outputPath = resolve(process.cwd(), args.output);
            writeFileSync(outputPath, css);
            console.log(`Generated: ${outputPath}`);
        } else {
            console.log(css);
        }
    } catch (error) {
        console.error("Error generating CSS:", (error as Error).message);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
