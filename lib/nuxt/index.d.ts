import { Module } from '@nuxt/types';
import { CommonConfig } from '../';
declare module '@nuxt/types' {
    interface NuxtOptions {
        vueService: CommonConfig;
    }
}
declare const NuxtModule: Module;
export default NuxtModule;
