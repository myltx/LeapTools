import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {}
  },
  corePlugins: {
    preflight: false
  },
  plugins: [
    nextui({
      defaultTheme: "light",
      themes: {
        light: {
          colors: {
            background: "#fcfcfc",
            foreground: "#1a1a1e",
            content1: "#ffffff",
            content2: "#f7f7f8",
            content3: "#f1f1f3",
            content4: "#e4e4e7",
            divider: "#e4e4e7",
            overlay: "rgba(0,0,0,0.4)",
            focus: "#006fee",
            default: {
              DEFAULT: "#e4e4e7",
              foreground: "#1a1a1e"
            },
            primary: {
              DEFAULT: "#006fee",
              foreground: "#ffffff"
            },
            secondary: {
              DEFAULT: "#27272a",
              foreground: "#ffffff"
            },
            success: {
              DEFAULT: "#17c964",
              foreground: "#052814"
            },
            warning: {
              DEFAULT: "#f5a524",
              foreground: "#2b1d00"
            },
            danger: {
              DEFAULT: "#f31260",
              foreground: "#ffffff"
            }
          },
          layout: {
            radius: {
              small: "4px",
              medium: "8px",
              large: "14px"
            }
          }
        },
        dark: {
          colors: {
            background: "#0b0b0d",
            foreground: "#f4f4f5",
            content1: "#141418",
            content2: "#111113",
            content3: "#0f0f12",
            content4: "rgba(255,255,255,0.08)",
            divider: "rgba(255,255,255,0.08)",
            overlay: "rgba(0,0,0,0.55)",
            focus: "#338ef7",
            default: {
              DEFAULT: "rgba(255,255,255,0.12)",
              foreground: "#f4f4f5"
            },
            primary: {
              DEFAULT: "#338ef7",
              foreground: "#071427"
            },
            secondary: {
              DEFAULT: "#a1a1aa",
              foreground: "#0b0b0d"
            },
            success: {
              DEFAULT: "#17c964",
              foreground: "#052814"
            },
            warning: {
              DEFAULT: "#f5a524",
              foreground: "#2b1d00"
            },
            danger: {
              DEFAULT: "#f31260",
              foreground: "#ffffff"
            }
          },
          layout: {
            radius: {
              small: "4px",
              medium: "8px",
              large: "14px"
            }
          }
        }
      }
    })
  ]
};

export default config;
