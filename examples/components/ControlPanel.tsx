"use client";

import { useState } from "react";

interface ControlPanelProps {
  contrastLevel: "AA" | "AAA";
  onContrastLevelChange: (level: "AA" | "AAA") => void;
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
  preferWhiteText: boolean;
  onPreferWhiteTextChange: (prefer: boolean) => void;
  onDownloadCSS: () => void;
  onDownloadConfig: () => void;
  onImportCoolors?: (colors: { neutral?: string; accent?: string; success?: string; warning?: string; error?: string; info?: string }) => void;
  dismissCoolorsPalette?: boolean;
  onDismissCoolorsPaletteHandled?: () => void;
}

/**
 * Parse a Coolors URL and extract hex colors
 * Supports formats:
 * - coolors.co/3b82f6-6b7280-10b981-f59e0b-ef4444
 * - coolors.co/palette/3b82f6-6b7280-10b981
 * - coolors.co/generate/3b82f6-6b7280-10b981
 */
function parseCoolorsUrl(url: string): string[] | null {
  try {
    // Extract the hex portion from the URL
    const hexPattern = /(?:coolors\.co\/(?:palette\/|generate\/)?)?([a-f0-9]{6}(?:-[a-f0-9]{6})*)/i;
    const match = url.match(hexPattern);

    if (!match) return null;

    const hexString = match[1];
    const colors = hexString.split("-").map(hex => `#${hex.toUpperCase()}`);

    // Validate all are valid hex colors
    const isValid = colors.every(color => /^#[A-F0-9]{6}$/i.test(color));
    if (!isValid) return null;

    return colors;
  } catch {
    return null;
  }
}

export default function ControlPanel({
  contrastLevel,
  onContrastLevelChange,
  theme,
  onThemeChange,
  preferWhiteText,
  onPreferWhiteTextChange,
  onDownloadCSS,
  onDownloadConfig,
  onImportCoolors,
  dismissCoolorsPalette,
  onDismissCoolorsPaletteHandled,
}: ControlPanelProps) {
  const [coolorsUrl, setCoolorsUrl] = useState("");
  const [parsedColors, setParsedColors] = useState<string[]>([]);
  const [selectedAccentIndex, setSelectedAccentIndex] = useState(0);
  const [importError, setImportError] = useState("");

  // Handle external dismiss signal (when user manually changes brand colors)
  if (dismissCoolorsPalette && parsedColors.length > 0) {
    setCoolorsUrl("");
    setParsedColors([]);
    setSelectedAccentIndex(0);
    onDismissCoolorsPaletteHandled?.();
  }

  const handleUrlChange = (url: string) => {
    setCoolorsUrl(url);
    setImportError("");

    // Try to parse colors as user types
    const colors = parseCoolorsUrl(url);
    if (colors && colors.length > 0) {
      setParsedColors(colors);
      setSelectedAccentIndex(0);
      // Immediately apply the first color
      onImportCoolors?.({ accent: colors[0] });
    } else {
      setParsedColors([]);
    }
  };

  const handleColorSelect = (index: number) => {
    setSelectedAccentIndex(index);
    // Immediately apply the selected color
    onImportCoolors?.({ accent: parsedColors[index] });
  };

  const handleDismissPalette = () => {
    setCoolorsUrl("");
    setParsedColors([]);
    setSelectedAccentIndex(0);
  };

  return (
    <div className="bg-surface border-default border rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-default mb-3">Contrast Level</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onContrastLevelChange("AA")}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
              contrastLevel === "AA"
                ? "bg-accent text-on-accent"
                : "bg-default border border-border text-default hover:bg-elevated"
            }`}
          >
            AA (4.5:1)
          </button>
          <button
            onClick={() => onContrastLevelChange("AAA")}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
              contrastLevel === "AAA"
                ? "bg-accent text-on-accent"
                : "bg-default border border-border text-default hover:bg-elevated"
            }`}
          >
            AAA (7:1)
          </button>
        </div>
        <p className="text-xs text-muted mt-2">
          {contrastLevel === "AA"
            ? "Standard WCAG accessibility level"
            : "Enhanced accessibility for maximum readability"}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-default mb-3">Theme</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onThemeChange("light")}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
              theme === "light"
                ? "bg-accent text-on-accent"
                : "bg-default border border-border text-default hover:bg-elevated"
            }`}
          >
            ☀️ Light
          </button>
          <button
            onClick={() => onThemeChange("dark")}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
              theme === "dark"
                ? "bg-accent text-on-accent"
                : "bg-default border border-border text-default hover:bg-elevated"
            }`}
          >
            🌙 Dark
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-default mb-3">Text on Colors</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onPreferWhiteTextChange(false)}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
              !preferWhiteText
                ? "bg-accent text-on-accent"
                : "bg-default border border-border text-default hover:bg-elevated"
            }`}
          >
            Prefer Black
          </button>
          <button
            onClick={() => onPreferWhiteTextChange(true)}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
              preferWhiteText
                ? "bg-accent text-on-accent"
                : "bg-default border border-border text-default hover:bg-elevated"
            }`}
          >
            Prefer White
          </button>
        </div>
        <p className="text-xs text-muted mt-2">
          {preferWhiteText
            ? "Prefer white text when both meet contrast requirements"
            : "Prefer black text when both meet contrast requirements"}
        </p>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-default mb-3">Import from Coolors</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={coolorsUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="Paste Coolors URL..."
            className="w-full px-3 py-2 bg-default border border-border text-default rounded text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          />

          {/* Color swatches for selection */}
          {parsedColors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">Click to preview:</p>
                <button
                  onClick={handleDismissPalette}
                  className="text-xs text-muted hover:text-default transition-colors"
                >
                  Dismiss
                </button>
              </div>
              <div className="flex gap-1">
                {parsedColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorSelect(index)}
                    className={`w-10 h-10 rounded transition-all ${
                      selectedAccentIndex === index
                        ? "ring-2 ring-offset-2 ring-accent scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <p className="text-xs text-muted">
                Active: <span className="font-mono">{parsedColors[selectedAccentIndex]}</span>
              </p>
            </div>
          )}

          {importError && (
            <p className="text-xs text-red-500">{importError}</p>
          )}
          {parsedColors.length === 0 && (
            <p className="text-xs text-muted">
              Paste a URL like: coolors.co/3b82f6-6b7280-10b981
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-default mb-3">Export</h3>
        <div className="space-y-2">
          <button
            onClick={onDownloadCSS}
            className="w-full px-4 py-2 bg-default border border-border text-default rounded font-medium hover:bg-elevated transition-colors"
          >
            Download CSS
          </button>
          <button
            onClick={onDownloadConfig}
            className="w-full px-4 py-2 bg-default border border-border text-default rounded font-medium hover:bg-elevated transition-colors"
          >
            Download Config
          </button>
        </div>
      </div>
    </div>
  );
}
