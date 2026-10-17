import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"SF Pro Display"',
          "Inter",
          "sans-serif",
        ],
      },
      colors: {
        // Apple HIG System Materials
        apple: {
          canvas: {
            light: "#F5F5F7",
            dark: "#000000",
          },
          subcanvas: {
            light: "#FFFFFF",
            dark: "#161618",
          },
          label: {
            primary: {
              light: "#1D1D1F",
              dark: "#F5F5F7",
            },
            secondary: {
              light: "#6E6E73",
              dark: "#86868B",
            },
            tertiary: {
              light: "#86868B",
              dark: "#6E6E73",
            },
          },
          blue: {
            light: "#0071E3",
            dark: "#2997FF",
          },
          emerald: {
            light: "#34C759",
            dark: "#30D158",
          },
          amber: {
            light: "#FF9500",
            dark: "#FF9F0A",
          },
        },
        // Liquid Glass Translucent Material Fills
        glass: {
          "ultra-thin-light": "rgba(255, 255, 255, 0.45)",
          "thin-light": "rgba(255, 255, 255, 0.65)",
          "regular-light": "rgba(255, 255, 255, 0.80)",
          "thick-light": "rgba(255, 255, 255, 0.92)",
          "ultra-thin-dark": "rgba(28, 28, 30, 0.45)",
          "thin-dark": "rgba(28, 28, 30, 0.65)",
          "regular-dark": "rgba(28, 28, 30, 0.82)",
          "thick-dark": "rgba(20, 20, 22, 0.94)",
        },
      },
      backdropBlur: {
        xs: "4px",
        "2xl": "40px",
        "3xl": "64px",
      },
      boxShadow: {
        // Multi-tier diffused elevation shadows with specular highlights
        "liquid-sm":
          "0 2px 8px -1px rgba(0, 0, 0, 0.05), inset 0 1px 1px 0 rgba(255, 255, 255, 0.5)",
        "liquid-md":
          "0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04), inset 0 1px 1px 0 rgba(255, 255, 255, 0.6)",
        "liquid-lg":
          "0 20px 40px -8px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.04), inset 0 1px 2px 0 rgba(255, 255, 255, 0.7)",
        "liquid-dock":
          "0 24px 48px -12px rgba(0, 0, 0, 0.18), 0 8px 16px -4px rgba(0, 0, 0, 0.06), inset 0 1px 1px 0 rgba(255, 255, 255, 0.5)",
        // Dark Mode Liquid Specular Shadows
        "liquid-dark-md":
          "0 12px 32px -4px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)",
        "liquid-dark-dock":
          "0 28px 56px -12px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
      },
      animation: {
        "pulse-slow": "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-subtle": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
