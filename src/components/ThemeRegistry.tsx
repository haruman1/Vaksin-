'use client';

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

type Mode = "light" | "dark";

interface ThemeContextType {
  mode: Mode;
  toggleMode: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function useThemeContext() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProviderWrapper");
  }
  return context;
}

export default function ThemeRegistry({ children, fontClassName }: { children: React.ReactNode, fontClassName?: string }) {
  const [mode, setMode] = React.useState<Mode>("light");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const savedMode = localStorage.getItem("theme") as Mode;
    if (savedMode) {
      setMode(savedMode);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setMode("dark");
    }
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
    localStorage.setItem("theme", mode);
  }, [mode, mounted]);

  const toggleMode = React.useCallback(() => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // Premium design tokens
  const theme = React.useMemo(() => {
    const isDark = mode === "dark";
    return createTheme({
      palette: {
        mode,
        primary: {
          main: isDark ? "#818cf8" : "#4f46e5", // Rich Indigo
          contrastText: "#ffffff",
        },
        secondary: {
          main: isDark ? "#2dd4bf" : "#0d9488", // Teal/Cyan
          contrastText: "#ffffff",
        },
        background: {
          default: isDark ? "#0f172a" : "#f8fafc", // Slate backgrounds
          paper: isDark ? "#1e293b" : "#ffffff",
        },
        text: {
          primary: isDark ? "#f1f5f9" : "#0f172a",
          secondary: isDark ? "#94a3b8" : "#475569",
        },
        divider: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
      },
      typography: {
        fontFamily: fontClassName || "var(--font-outfit), Inter, sans-serif",
        h1: { fontSize: "2rem", fontWeight: 700 },
        h2: { fontSize: "1.5rem", fontWeight: 700 },
        h3: { fontSize: "1.25rem", fontWeight: 600 },
        body1: { fontSize: "0.95rem", lineHeight: 1.6 },
        body2: { fontSize: "0.875rem", lineHeight: 1.5 },
        button: { textTransform: "none", fontWeight: 600 },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              boxShadow: isDark
                ? "0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.2)"
                : "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.06)",
              borderRadius: 16,
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              padding: "8px 16px",
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 10,
            },
          },
        },
      },
    });
  }, [mode, fontClassName]);

  // Prevent flash of unstyled content by rendering a blank template if not mounted
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
