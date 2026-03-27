// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  
  // GitHub Pages deployment
  ssr: false, // SPA mode for static hosting
  app: {
    baseURL: '/visual-communication-app/', // GitHub repo name
    buildAssetsDir: 'assets',
  },
  
  // Generate configuration
  nitro: {
    preset: 'github-pages',
  },
  
  // TypeScript
  typescript: {
    strict: true,
  },
})
