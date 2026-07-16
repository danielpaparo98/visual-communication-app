// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  // devtools disabled — Vue Devtools v7 __vrv_devtools conflicts in SPA mode
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  // SPA mode — fully static for GitHub Pages
  ssr: false,

  app: {
    // Matches GitHub repo name so deployment "just works"
    baseURL: '/visual-communication-app/',
    buildAssetsDir: 'assets',
  },

  nitro: {
    preset: 'github-pages',
  },

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
  },
})
