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
          // You can define other color properties for the light theme here
        },
      },
      dark: {
        colors: {
          primary: "#30070f", // Example primary color for dark theme
          // You can define other color properties for the dark theme here
        },
      },
    },
  },
});
