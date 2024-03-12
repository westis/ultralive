/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import { createApp } from "vue";
import App from "./App.vue";
import pinia from "@/stores"; // Import the initialized Pinia store
import { registerPlugins } from "@/plugins";

const app = createApp(App);

app.use(pinia); // Use the imported Pinia store
registerPlugins(app);

app.mount("#app");
