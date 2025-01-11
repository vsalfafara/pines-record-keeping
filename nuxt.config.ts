// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@nuxt/image",
    "@nuxtjs/cloudinary",
    "nuxt-auth-utils",
  ],
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
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
  ssr: false,
});
