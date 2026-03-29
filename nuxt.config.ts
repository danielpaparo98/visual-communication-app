// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    // '@nuxt/icon', // Disabled - use @iconify/vue directly for Nuxt 4 compatibility
  ],
  
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      Roboto: [400, 500, 700],
      'Open+Sans': [400, 500, 600, 700],
      Lato: [400, 500, 700],
      Poppins: [400, 500, 600, 700],
      Fredoka: [400, 500, 600, 700],
    },
    display: 'swap',
  },
  
  // GitHub Pages deployment
  ssr: false, // SPA mode for static hosting
  app: {
    baseURL: '/', // GitHub repo name
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
