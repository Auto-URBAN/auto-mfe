// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/icon', '@nuxt/ui'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },  
  runtimeConfig: {
    apiUrl: process.env.NUXT_API_URL,
  },
  future: {
    compatibilityVersion: 4,
  },
})