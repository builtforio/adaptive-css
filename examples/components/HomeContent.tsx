"use client";

import { useState, useEffect } from "react";
import { generateCSS } from "adaptive-css";
import ColorPicker from "@/components/ColorPicker";
import PreviewPanel from "@/components/PreviewPanel";
import ControlPanel from "@/components/ControlPanel";

export default function HomeContent() {
  const [neutral, setNeutral] = useState("#6B7280");
  const [accent, setAccent] = useState("#3B82F6");
  const [success, setSuccess] = useState("#10B981");
  const [warning, setWarning] = useState("#F59E0B");
  const [error, setError] = useState("#EF4444");
  const [info, setInfo] = useState("#06B6D4");

  const [contrastLevel, setContrastLevel] = useState<"AA" | "AAA">("AA");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [preferWhiteText, setPreferWhiteText] = useState(false);
  const [generatedCSS, setGeneratedCSS] = useState("");

  // Generate CSS whenever colors or settings change
  useEffect(() => {
    try {
      const css = generateCSS({
        palettes: {
          neutral,
          accent,
          success,
          warning,
          error,
          info,
        },
        contrastLevel,
        preferWhiteText,
        includePaletteVars: true,
        includeUtilityClasses: true,
        darkModeSelector: '[data-theme="dark"]',
        respectSystemPreference: false,
      });

      setGeneratedCSS(css);

      // Inject CSS into the page
      const styleId = "adaptive-css-dynamic";
      let styleEl = document.getElementById(styleId) as HTMLStyleElement;

      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }

      styleEl.textContent = css;
    } catch (err) {
      console.error("Error generating CSS:", err);
    }
  }, [neutral, accent, success, warning, error, info, contrastLevel, preferWhiteText]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleDownloadCSS = () => {
    const blob = new Blob([generatedCSS], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `adaptive-colors-${contrastLevel}.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadConfig = () => {
    const config = {
      palettes: { neutral, accent, success, warning, error, info },
      contrastLevel,
      preferWhiteText,
      includePaletteVars: true,
      includeUtilityClasses: true,
      darkModeSelector: '[data-theme="dark"]',
      respectSystemPreference: true,
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "adaptive-css.config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-default">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-default mb-2">
            Adaptive CSS
            <span className="ml-3 text-sm font-normal px-3 py-1 rounded bg-accent text-on-accent">
              WCAG {contrastLevel}
            </span>
          </h1>
          <p className="text-muted text-lg">
            Generate accessible, adaptive color systems in real-time
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Color Controls */}
          <div className="lg:col-span-1 space-y-6">
            <ControlPanel
              contrastLevel={contrastLevel}
              onContrastLevelChange={setContrastLevel}
              theme={theme}
              onThemeChange={setTheme}
              preferWhiteText={preferWhiteText}
              onPreferWhiteTextChange={setPreferWhiteText}
              onDownloadCSS={handleDownloadCSS}
              onDownloadConfig={handleDownloadConfig}
            />

            <div className="bg-surface border-default border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold text-default mb-4">Brand Colors</h2>

              <ColorPicker
                label="Neutral"
                color={neutral}
                onChange={setNeutral}
                description="Base gray scale"
              />

              <ColorPicker
                label="Accent"
                color={accent}
                onChange={setAccent}
                description="Primary brand color"
              />

              <ColorPicker
                label="Success"
                color={success}
                onChange={setSuccess}
                description="Positive actions"
              />

              <ColorPicker
                label="Warning"
                color={warning}
                onChange={setWarning}
                description="Caution states"
              />

              <ColorPicker
                label="Error"
                color={error}
                onChange={setError}
                description="Error states"
              />

              <ColorPicker
                label="Info"
                color={info}
                onChange={setInfo}
                description="Informational"
              />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            <PreviewPanel contrastLevel={contrastLevel} neutralColor={neutral} accentColor={accent} />
          </div>
        </div>
      </div>
    </div>
  );
}
