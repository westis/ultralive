/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";
import pinia from "../stores";
import { createRouter, createWebHistory } from "vue-router/auto";
import { auth } from "../firebase/init"; // Adjust the path as necessary
import { onAuthStateChanged } from "firebase/auth";

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  });

  let isAuthReady = false;

  onAuthStateChanged(auth, (user) => {
    if (!isAuthReady) {
      isAuthReady = true;
      router.beforeEach((to, from, next) => {
        if (to.meta.requiresAuth && !user) {
          // Redirect to login page or store the intended destination
          // For example, redirect to '/login'
          next("/login");
        } else {
          const storedUrl = sessionStorage.redirect;
          if (storedUrl) {
            delete sessionStorage.redirect;
            const redirectUrl = new URL(storedUrl);
            const basePath = import.meta.env.VITE_APP_BASE_URL;
            const relativePath =
              redirectUrl.pathname.replace(basePath, "") +
              redirectUrl.search +
              redirectUrl.hash;
            next(relativePath);
          } else {
            next(); // Proceed as normal
          }
        }
      });
    }
  });

  app.use(vuetify).use(router).use(pinia);
}
