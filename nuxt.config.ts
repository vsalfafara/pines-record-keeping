// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@nuxt/image",
    "nuxt-auth-utils",
  ],
  // nitro: {
  //   preset: "cloudflare-pages",
  //   esbuild: {
  //     options: {
  //       target: "esnext",
  //     },
  //   },
  // },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  image: {
    dir: "assets/images",
  },
  routeRules: {
    "/": { redirect: "/login" },
  },
  runtimeConfig: {
    dbUrl: process.env.DATABASE_URL,
    secret: process.env.SECRET,
    origin: process.env.ORIGIN,
  },
});
