import { resolve } from 'path'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'vue-services',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '~/../nuxt/index.js',
  ],

  vueServices: {
    transformResponse: (response) => ({
      example: response.data,
    }),
  },

  alias: {
    'vue-api-services': resolve(__dirname, '../dist/main.bundle.js'),
    'vue-api-services/nuxt': resolve(__dirname, '../nuxt'),
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'http://openlibrary.org/api/',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
