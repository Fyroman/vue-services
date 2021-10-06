import { Module } from '@nuxt/types'
import { ModuleThis } from '@nuxt/types/config/module'
import { CommonConfig } from '../'
import { resolve } from 'path'
import { writeFileSync, mkdirSync, readdirSync } from 'fs'
import template from 'lodash.template'
// @ts-ignore
import serialize from 'serialize-javascript'

declare module '@nuxt/types' {
  interface NuxtOptions {
    vueService: CommonConfig
  }
}

const PLUGIN_FOLDER = 'vueApiService'
const PLUGIN_FILENAME = 'index.js'
const GLOBAL_SERVICE_FILENAME = 'globalServices.js'

const NuxtModule: Module = function (moduleOptions) {
  this.nuxt.hook('builder:extendPlugins', extendPlugins.bind(this))
  this.nuxt.hook('build:templates', templateCallback.bind(this))
}

function extendPlugins(this: ModuleThis, plugins: string[]) {
  const names = [PLUGIN_FILENAME, GLOBAL_SERVICE_FILENAME]
  plugins.push(
    ...names.map((name) => resolve(this.options.buildDir, PLUGIN_FOLDER, name))
  )
}

function templateCallback(
  this: ModuleThis,
  { resolve: r }: { resolve: typeof resolve }
) {
  this.options.watch.push('~/services/')
  mkdirSync(r(this.options.buildDir, PLUGIN_FOLDER))
  customAddTemplate.call(this, {
    resolve: r,
    name: PLUGIN_FILENAME,
    options: this.options.vueServices,
    src: 'plugin.ejs',
  })
  const globalFilenames = findGlobalFilenames.call(this)
  customAddTemplate.call(this, {
    resolve: r,
    name: GLOBAL_SERVICE_FILENAME,
    options: { files: globalFilenames },
    src: 'services.ejs',
  })
}

function customAddTemplate(
  this: ModuleThis,
  {
    resolve: r,
    name,
    src,
    options,
  }: { resolve: typeof resolve; name: string; src: string; options: any }
) {
  const relativePath = r(this.options.buildDir, PLUGIN_FOLDER, name)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const templateContent = require('Templates/' + src) as string
  const templateExecutor = template(templateContent)
  const compiledTemplate = templateExecutor({
    options,
    serialize,
  })
  writeFileSync(relativePath, compiledTemplate, 'utf-8')
}

function findGlobalFilenames(this: ModuleThis): string[] {
  try {
    this.nuxt.resolvePath('services')
  } catch (e) {
    return []
  }
  const servicesPath = this.nuxt.resolvePath('services')
  const fileNames = readdirSync(servicesPath)
  const globalServiceFileNames = fileNames.filter((filename) =>
    filename.includes('.global.')
  )
  return globalServiceFileNames
}

export default NuxtModule
