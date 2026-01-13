"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";

interface ColorSystemContextType {
  neutral: string;
  setNeutral: (color: string) => void;
  accent: string;
  setAccent: (color: string) => void;
  success: string;
  setSuccess: (color: string) => void;
  warning: string;
  setWarning: (color: string) => void;
  error: string;
  setError: (color: string) => void;
  info: string;
  setInfo: (color: string) => void;
  contrastLevel: "AA" | "AAA";
  setContrastLevel: (level: "AA" | "AAA") => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  preferWhiteText: boolean;
  setPreferWhiteText: (prefer: boolean) => void;
  generatedCSS: string;
  isLoaded: boolean;
}

const ColorSystemContext = createContext<ColorSystemContextType | null>(null);

export function useColorSystem() {
  const context = useContext(ColorSystemContext);
  if (!context) {
    throw new Error("useColorSystem must be used within a ColorSystemProvider");
  }
  return context;
}

interface ColorSystemProviderProps {
  children: ReactNode;
}

export default function ColorSystemProvider({ children }: ColorSystemProviderProps) {
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [generateCSS, setGenerateCSS] = useState<((config: unknown) => string) | null>(null);

  // Load the adaptive-css library once on mount
  useEffect(() => {
    import("adaptive-css")
      .then((module) => {
        setGenerateCSS(() => module.generateCSS);
      })
      .catch((err) => {
        console.error("Error importing adaptive-css:", err);
        setIsLoaded(true);
      });
  }, []);

  // Generate CSS whenever colors or settings change
  useEffect(() => {
    if (!generateCSS) return;

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
      setIsLoaded(true);

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
      setIsLoaded(true);
    }
  }, [generateCSS, neutral, accent, success, warning, error, info, contrastLevel, preferWhiteText]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const value: ColorSystemContextType = {
    neutral,
    setNeutral,
    accent,
    setAccent,
    success,
    setSuccess,
    warning,
    setWarning,
    error,
    setError,
    info,
    setInfo,
    contrastLevel,
    setContrastLevel,
    theme,
    setTheme,
    preferWhiteText,
    setPreferWhiteText,
    generatedCSS,
    isLoaded,
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Generating color system...</p>
        </div>
      </div>
    );
  }

  return (
    <ColorSystemContext.Provider value={value}>
      {children}
    </ColorSystemContext.Provider>
  );
}
