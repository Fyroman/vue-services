import { Module } from '@nuxt/types'
import { ModuleThis } from '@nuxt/types/config/module'
import { CommonConfig } from '../'
import { resolve } from 'path'
import { writeFileSync } from 'fs'
import template from 'lodash.template'
// @ts-ignore
import serialize from 'serialize-javascript'

declare module '@nuxt/types' {
  interface NuxtOptions {
    vueService: CommonConfig
  }
}

const PLUGIN_FILENAME = 'vueService.js'

const NuxtModule: Module = function (moduleOptions) {
  this.nuxt.hook('builder:extendPlugins', extendPlugins.bind(this))
  this.nuxt.hook('build:templates', templateCallback.bind(this))
}

function templateCallback(
  this: ModuleThis,
  { resolve: r }: { resolve: typeof resolve }
) {
  const relativePath = r(this.options.buildDir, PLUGIN_FILENAME)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const templateContent = require('Templates/plugin.ejs') as string
  const templateExecutor = template(templateContent)
  const compiledTemplate = templateExecutor({
    options: this.options.vueServices,
    serialize,
  })
  writeFileSync(relativePath, compiledTemplate, 'utf-8')
}

function extendPlugins(this: ModuleThis, plugins: string[]) {
  plugins.unshift(resolve(this.options.buildDir, PLUGIN_FILENAME))
}

export default NuxtModule
