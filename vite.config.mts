// Plugins
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Fonts from "unplugin-fonts/vite";
import VueRouter from "unplugin-vue-router/vite";
import Layouts from "vite-plugin-vue-layouts";
import Vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// Utilities
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";

// Define a function to dynamically set the configuration based on the mode
export default ({ mode }) => {
  // Load environment variables based on the current mode
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  // Return the Vite configuration
  return defineConfig({
    plugins: [
      VueRouter(),
      Layouts(),
      Vue({
        template: { transformAssetUrls },
      }),
      Vuetify({
        autoImport: true,
        // styles: {
        //   configFile: "src/styles/settings.scss",
        // },
      }),
      Components(),
      Fonts({
        google: {
          families: [
            {
              name: "Roboto",
              styles: "wght@100;300;400;500;700;900",
            },
          ],
        },
      }),
      AutoImport({
        imports: ["vue", "vue-router"],
        dts: true,
        eslintrc: {
          enabled: true,
        },
        vueTemplate: true,
      }),
    ],
    define: { "process.env": {} },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
    },
    base: process.env.VITE_APP_BASE_URL,
  });
};
