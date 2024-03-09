/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";
import pinia from "../stores";
import { createRouter, createWebHistory } from "vue-router/auto";

// Types
import type { App } from "vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // the routes property is handled by the plugin
});

// Add navigation guard for handling GitHub Pages redirection
router.beforeEach((to, from, next) => {
  const redirectPath = sessionStorage.redirect;
  if (redirectPath) {
    delete sessionStorage.redirect;
    if (to.path === "/") {
      next(redirectPath);
    } else {
      next();
    }
  } else {
    next();
  }
});

export function registerPlugins(app: App) {
  app.use(vuetify).use(router).use(pinia);
}
