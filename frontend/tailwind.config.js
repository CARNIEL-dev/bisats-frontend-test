/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand / Static Colors
        priYellow: "#F5BB00",
        priWhite: "#F7F7F7",
        priBlack: "#0A0E12",
        "primary-light": "#fff9e4",

        // OKLCH-based colors
        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "oklch(1 0 0)",
        "popover-foreground": "oklch(0.145 0 0)",

        primary: "#f5bb00",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#f5f5f5",
        "secondary-foreground": "#171717",

        muted: "oklch(27.274% 0.00003 271.152)",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "oklch(0.97 0 0)",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.577 0.245 27.325)",

        border: "oklch(0.922 0 0)",
        input: "oklch(0.922 0 0)",
        ring: "oklch(0.708 0 0)",

        "chart-1": "oklch(0.646 0.222 41.116)",
        "chart-2": "oklch(0.6 0.118 184.704)",
        "chart-3": "oklch(0.398 0.07 227.392)",
        "chart-4": "oklch(0.828 0.189 84.429)",
        "chart-5": "oklch(0.769 0.188 70.08)",

        sidebar: "oklch(0.985 0 0)",
        "sidebar-foreground": "oklch(0.145 0 0)",
        "sidebar-primary": "oklch(0.205 0 0)",
        "sidebar-primary-foreground": "oklch(0.985 0 0)",
        "sidebar-accent": "oklch(0.97 0 0)",
        "sidebar-accent-foreground": "oklch(0.205 0 0)",
        "sidebar-border": "oklch(0.922 0 0)",
        "sidebar-ring": "oklch(0.708 0 0)",
      },

      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        zoomIn: {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        zoomOut: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0.95)" },
        },
        slideInFromTop: {
          "0%": { transform: "translateY(-0.5rem)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        slideInFromBottom: {
          "0%": { transform: "translateY(0.5rem)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        slideInFromLeft: {
          "0%": { transform: "translateX(-0.5rem)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        slideInFromRight: {
          "0%": { transform: "translateX(0.5rem)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.2s ease-in-out",
        "fade-out": "fadeOut 0.2s ease-in-out",
        "zoom-in": "zoomIn 0.2s ease-in-out",
        "zoom-out": "zoomOut 0.2s ease-in-out",
        "slide-in-from-top": "slideInFromTop 0.3s ease-out",
        "slide-in-from-bottom": "slideInFromBottom 0.3s ease-out",
        "slide-in-from-left": "slideInFromLeft 0.3s ease-out",
        "slide-in-from-right": "slideInFromRight 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
