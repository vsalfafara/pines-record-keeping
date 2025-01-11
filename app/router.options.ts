import type { RouterConfig } from "@nuxt/schema";
import {
  Users,
  ChartColumnIncreasing,
  MapPin,
  UserRoundCog,
} from "lucide-vue-next";

export const sidebarRoutes = [
  {
    name: "Platform",
    access: ["ADMIN", "ACCOUNTS_CLERK"],
    routes: [
      {
        name: "Client Records",
        path: "/client-records",
        meta: {
          icon: Users,
          access: ["ADMIN", "ACCOUNTS_CLERK"],
        },
        component: () => import("~/pages/client-records/index.vue"),
      },
    ],
  },
  {
    name: "Admin",
    access: ["ADMIN"],
    routes: [
      {
        name: "Property Portfolio",
        path: "/property-portfolio",
        meta: {
          icon: MapPin,
          access: ["ADMIN"],
        },
        component: () => import("~/pages/property-portfolio/index.vue"),
      },
      {
        name: "Access Management",
        path: "/access-management",
        meta: {
          icon: ChartColumnIncreasing,
          access: ["ADMIN"],
        },
        component: () => import("~/pages/access-management.vue"),
      },
    ],
  },
];

export default {
  // https://router.vuejs.org/api/interfaces/routeroptions.html#routes
  routes: (_routes) => [
    {
      name: "Login",
      path: "/login",
      component: () => import("~/pages/login.vue"),
    },
    ...sidebarRoutes.map((routes) => routes.routes).flat(),
    {
      name: "Client",
      path: "/client-records/:id",
      component: () => import("~/pages/client-records/[id]/index.vue"),
    },
    {
      name: "Property",
      path: "/property-portfolio/:id",
      component: () => import("~/pages/property-portfolio/[id]/index.vue"),
    },
    {
      path: "/**",
      redirect: "/access-management",
    },
  ],
} satisfies RouterConfig;
