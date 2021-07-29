import { Module } from '@nuxt/types'
import Vue from 'vue'
import VueService from '../'
import { CommonConfig } from '../'
import { resolve } from 'path'

Vue.use(VueService)

declare module '@nuxt/types' {
  interface NuxtOptions {
    vueService: CommonConfig
  }
}

const NuxtModule: Module = function (moduleOptions) {
  this.addPlugin({
    src: resolve(__dirname, '../plugin.ejs'),
    fileName: 'vueService.js',
    options: this.options.vueServices,
  })
}

export default NuxtModule
