"use client";

import { useEffect, useState } from "react";

interface PreviewPanelProps {
  contrastLevel: "AA" | "AAA";
  neutralColor?: string;
  accentColor?: string;
}

export default function PreviewPanel({ contrastLevel, neutralColor, accentColor }: PreviewPanelProps) {
  const [palettes, setPalettes] = useState<{
    neutral: string[];
    accent: string[];
  }>({ neutral: [], accent: [] });

  useEffect(() => {
    // Read generated palette colors from CSS variables
    // Use requestAnimationFrame to ensure CSS has been applied
    requestAnimationFrame(() => {
      const styles = getComputedStyle(document.documentElement);
      const neutral: string[] = [];
      const accent: string[] = [];

      for (let i = 0; i < 56; i++) {
        const neutralVal = styles.getPropertyValue(`--neutral-${i}`).trim();
        const accentVal = styles.getPropertyValue(`--accent-${i}`).trim();

        if (neutralVal) neutral.push(neutralVal);
        if (accentVal) accent.push(accentVal);
      }

      setPalettes({ neutral, accent });
    });
  }, [contrastLevel, neutralColor, accentColor]);

  return (
    <div className="space-y-6">
      {/* Semantic Colors Preview */}
      <div className="bg-surface border-default border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-default mb-4">Semantic Colors</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-default border border-border rounded p-4 text-center">
            <div className="text-sm font-medium text-default">bg-default</div>
            <div className="text-xs text-muted mt-1">Main background</div>
          </div>

          <div className="bg-subtle border border-border rounded p-4 text-center">
            <div className="text-sm font-medium text-default">bg-subtle</div>
            <div className="text-xs text-muted mt-1">Subtle background</div>
          </div>

          <div className="bg-elevated border border-border rounded p-4 text-center">
            <div className="text-sm font-medium text-default">bg-elevated</div>
            <div className="text-xs text-muted mt-1">Raised surfaces</div>
          </div>

          <div className="bg-surface border border-border rounded p-4 text-center">
            <div className="text-sm font-medium text-default">bg-surface</div>
            <div className="text-xs text-muted mt-1">Card surfaces</div>
          </div>

          <div className="bg-accent text-on-accent rounded p-4 text-center">
            <div className="text-sm font-medium">bg-accent</div>
            <div className="text-xs opacity-80 mt-1">Primary actions</div>
          </div>
        </div>
      </div>

      {/* Component Previews */}
      <div className="bg-surface border-default border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-default mb-4">Components</h2>

        <div className="space-y-4">
          {/* Buttons */}
          <div>
            <h3 className="text-sm font-semibold text-default mb-2">Buttons</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-accent text-on-accent rounded font-medium hover:opacity-90 transition-opacity">
                Primary Button
              </button>
              <button className="px-4 py-2 bg-default border border-border text-default rounded font-medium hover:bg-elevated transition-colors">
                Secondary Button
              </button>
              <button className="px-4 py-2 text-accent rounded font-medium hover:bg-elevated transition-colors">
                Text Button
              </button>
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 className="text-sm font-semibold text-default mb-2">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-default border border-border rounded-lg p-4">
                <h4 className="font-semibold text-default mb-1">Default Card</h4>
                <p className="text-sm text-muted">
                  This card uses the default background color with proper contrast.
                </p>
              </div>

              <div className="bg-elevated border border-border-subtle rounded-lg p-4">
                <h4 className="font-semibold text-default mb-1">Elevated Card</h4>
                <p className="text-sm text-muted">
                  This card uses the elevated background for emphasis.
                </p>
              </div>
            </div>
          </div>

          {/* Status Colors */}
          <div>
            <h3 className="text-sm font-semibold text-default mb-2">Status Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div
                className="rounded p-3 text-center"
                style={{
                  background: "var(--color-success)",
                  color: "var(--color-success-fg)",
                }}
              >
                <div className="font-medium text-sm">Success</div>
              </div>

              <div
                className="rounded p-3 text-center"
                style={{
                  background: "var(--color-warning)",
                  color: "var(--color-warning-fg)",
                }}
              >
                <div className="font-medium text-sm">Warning</div>
              </div>

              <div
                className="rounded p-3 text-center"
                style={{
                  background: "var(--color-error)",
                  color: "var(--color-error-fg)",
                }}
              >
                <div className="font-medium text-sm">Error</div>
              </div>

              <div
                className="rounded p-3 text-center"
                style={{
                  background: "var(--color-info)",
                  color: "var(--color-info-fg)",
                }}
              >
                <div className="font-medium text-sm">Info</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Palette Visualization */}
      <div className="bg-surface border-default border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-default mb-4">Color Palettes</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-default mb-2">
              Neutral ({palettes.neutral.length} swatches)
            </h3>
            <div className="flex gap-px overflow-x-auto rounded">
              {palettes.neutral.slice(0, 30).map((color, i) => (
                <div
                  key={i}
                  className="h-12 flex-1 min-w-[8px] group relative"
                  style={{ background: color }}
                  title={`--neutral-${i}: ${color}`}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-default mb-2">
              Accent ({palettes.accent.length} swatches)
            </h3>
            <div className="flex gap-px overflow-x-auto rounded">
              {palettes.accent.slice(0, 30).map((color, i) => (
                <div
                  key={i}
                  className="h-12 flex-1 min-w-[8px] group relative"
                  style={{ background: color }}
                  title={`--accent-${i}: ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Information Box */}
      <div className="bg-elevated border-default border rounded-lg p-6">
        <h3 className="text-sm font-semibold text-default mb-2">
          About WCAG {contrastLevel} Compliance
        </h3>
        <p className="text-sm text-muted">
          {contrastLevel === "AA" ? (
            <>
              All colors meet the <strong>WCAG AA standard (4.5:1 contrast ratio)</strong> for normal text.
              This is the recommended level for most web applications and provides good accessibility.
            </>
          ) : (
            <>
              All colors meet the <strong>WCAG AAA standard (7:1 contrast ratio)</strong> for normal text.
              This enhanced level provides maximum readability and is recommended for applications requiring
              the highest accessibility standards.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
