import { Module } from '@nuxt/types'
import { CommonConfig } from '../src'
import { resolve } from 'path'

declare module '@nuxt/types' {
  interface NuxtOptions {
    vueService: CommonConfig
  }
}

const NuxtModule: Module = function (moduleOptions) {
  this.addPlugin({
    src: resolve(__dirname, './plugin.ejs'),
    fileName: 'vueService.js',
    options: this.options.vueServices,
  })
}

export default NuxtModule
