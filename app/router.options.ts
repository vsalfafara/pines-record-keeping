import type { RouterConfig } from "@nuxt/schema";

export default {
  // https://router.vuejs.org/api/interfaces/routeroptions.html#routes
  routes: (_routes) => [
    {
      name: "Login",
      path: "/login",
      component: () => import("~/pages/login.vue"),
    },
    {
      name: "Access Management",
      path: "/access-management",
      component: () => import("~/pages/access-management.vue"),
    },
    {
      name: "Property Portfolio",
      path: "/property-portfolio",
      component: () => import("~/pages/property-portfolio.vue"),
    },
  ],
} satisfies RouterConfig;
