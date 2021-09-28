import Vue, { VueConstructor } from 'vue';
import { Context } from '@nuxt/types';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
export interface CommonConfig {
    handleResponse?: (response: AxiosResponse) => unknown;
    handleError?: (response: AxiosError) => unknown;
    axios?: AxiosInstance;
}
declare type EndpointConfig = CommonConfig & AxiosRequestConfig;
declare type EndpointArguments = unknown[];
declare type Endpoint = ((...args: EndpointArguments) => EndpointConfig) | EndpointConfig;
interface ServiceOptions extends CommonConfig {
    name: string;
    endpoints: Record<string, Endpoint>;
}
declare type Call = ((...args: EndpointArguments) => Promise<unknown>) | Promise<unknown>;
interface Calls {
    [call: string]: Call;
}
interface Services {
    [service: string]: Calls;
}
interface ServiceInstance {
    options: ServiceOptions;
    use(ctx: Context): Calls;
}
declare module 'vue/types/vue' {
    interface Vue {
        $services: Services;
        $serviceOptions: CommonConfig;
    }
    interface VueConstructor {
        serviceOptions: CommonConfig;
    }
}
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        services?: Record<string, ServiceInstance>;
    }
}
declare module '@nuxt/types' {
    interface Context {
        $serviceOptions: CommonConfig;
    }
}
declare function install(Vue: VueConstructor, $options?: CommonConfig): void;
declare function create<O extends ServiceOptions>(options: O): ServiceInstance;
declare const VueService: {
    install: typeof install;
    create: typeof create;
};
export default VueService;
