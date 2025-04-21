// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  runtimeConfig: {
    public:{
      apiBase: 'https://giggle-api.giggleappdevop.workers.dev/api/v1'
    }
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-primevue",
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/i18n",
    "@formkit/auto-animate/nuxt",
    "@pinia/colada-nuxt",
    "@nuxt/eslint",
    "@nuxthub/core",
    "@sentry/nuxt/module"
  ],

  css: ['primeicons/primeicons.css','primevue/resources/themes/aura-light-green/theme.css'],

  googleFonts: {
    families:{
      Inter: true
    }
  },

  i18n:{
    defaultLocale:"en",
    strategy: "no_prefix",
    vueI18n: './i18n.config.ts'
  },

  compatibilityDate: "2024-12-21",

  sentry: {
    sourceMapsUploadOptions: {
      org: "giggle",
      project: "javascript-nuxt"
    }
  },

  sourcemap: {
    client: "hidden"
  }
})