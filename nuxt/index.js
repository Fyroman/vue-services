import { resolve } from 'path'

const NuxtModule = function (moduleOptions) {
  this.addPlugin({
    src: resolve(__dirname, './plugin.ejs'),
    fileName: 'vueService.js',
    options: this.options.vueServices,
  })
}

export default NuxtModule
