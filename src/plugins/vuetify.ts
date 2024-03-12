/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// Utilize window.matchMedia to check if the user prefers a dark theme
const userPrefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export default createVuetify({
  theme: {
    defaultTheme: userPrefersDark ? "dark" : "light", // Automatically set based on user preference
    themes: {
      light: {
        colors: {
          primary: "#670D15", // Example primary color for light theme
          chartColor1: "#03A9F4", // Light Blue
          chartColor2: "#FF5722", // Deep Orange
          chartColor3: "#CDDC39", // Lime
          chartColor4: "#9C27B0", // Purple
          chartColor5: "#1DE9B6", // Teal
          chartColor6: "#FFC107", // Amber
          chartColor7: "#00BCD4", // Cyan
          chartColor8: "#E91E63", // Pink
          chartColor9: "#3F51B5", // Indigo
          chartColor10: "#8BC34A", // Light Green
        },
      },
      dark: {
        colors: {
          primary: "#30070f", // Example primary color for dark theme
          chartColor1: "#2196F3", // Blue
          chartColor2: "#FF9800", // Orange
          chartColor3: "#673AB7", // Deep Purple
          chartColor4: "#4CAF50", // Green
          chartColor5: "#F44336", // Red
          chartColor6: "#009688", // Teal
          chartColor7: "#795548", // Brown
          chartColor8: "#FF5722", // Deep Orange
          chartColor9: "#00BCD4", // Cyan
          chartColor10: "#607D8B", // Blue Grey
        },
      },
    },
  },
});
