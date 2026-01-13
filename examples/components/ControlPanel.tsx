interface ControlPanelProps {
  contrastLevel: "AA" | "AAA";
  onContrastLevelChange: (level: "AA" | "AAA") => void;
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
  preferWhiteText: boolean;
  onPreferWhiteTextChange: (prefer: boolean) => void;
  onDownloadCSS: () => void;
  onDownloadConfig: () => void;
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
}: ControlPanelProps) {
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
        <h3 className="text-sm font-semibold text-default mb-3">Export</h3>
        <div className="space-y-2">
          <button
            onClick={onDownloadCSS}
            className="w-full px-4 py-2 bg-default border border-border text-default rounded font-medium hover:bg-elevated transition-colors"
          >
            ⬇️ Download CSS
          </button>
          <button
            onClick={onDownloadConfig}
            className="w-full px-4 py-2 bg-default border border-border text-default rounded font-medium hover:bg-elevated transition-colors"
          >
            📋 Download Config
          </button>
        </div>
      </div>
    </div>
  );
}
