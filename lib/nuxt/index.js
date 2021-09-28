import Vue from 'vue';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const VueService = require('../');
import { resolve } from 'path';
Vue.use(VueService);
const NuxtModule = function (moduleOptions) {
    this.addPlugin({
        src: resolve(__dirname, '../plugin.ejs'),
        fileName: 'vueService.js',
        options: this.options.vueServices,
    });
};
export default NuxtModule;
