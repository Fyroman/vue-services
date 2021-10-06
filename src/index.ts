import Vue, { ComponentOptions, VueConstructor } from 'vue'
import { Context } from '@nuxt/types'
import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'
// eslint-disable-next-line @typescript-eslint/no-var-requires
import _axios from 'axios'

export interface CommonConfig {
  handleResponse?: (response: AxiosResponse) => unknown
  handleError?: (response: AxiosError) => unknown
  axios?: AxiosInstance
}

type EndpointConfig = CommonConfig & AxiosRequestConfig

type EndpointArguments = unknown[]

type Endpoint =
  | ((...args: EndpointArguments) => EndpointConfig)
  | EndpointConfig

interface ServiceOptions extends CommonConfig {
  name: string
  endpoints: Record<string, Endpoint>
}

type Call =
  | ((...args: EndpointArguments) => Promise<unknown>)
  | Promise<unknown>

interface Calls {
  [call: string]: Call
}

interface Services {
  [service: string]: Calls
}

interface ServiceInstance {
  options: ServiceOptions
  use(ctx: Context): Calls
}

declare module 'vue/types/vue' {
  interface Vue {
    $services: Services
    $serviceOptions: CommonConfig
  }
  interface VueConstructor {
    serviceOptions: CommonConfig
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    services?: Record<string, ServiceInstance>
  }
}

declare module '@nuxt/types' {
  interface Context {
    $serviceOptions: CommonConfig
  }
}

function promisify(
  config: EndpointConfig,
  service: ServiceOptions,
  ctx: Context
): Promise<unknown> {
  const _ctx = ctx as unknown as { $axios: AxiosInstance }
  const axios: AxiosInstance = getShared('axios') || _ctx.$axios || _axios
  return axios
    .request(config)
    .then((res) => {
      const handleResponse =
        getShared('handleResponse') || ((data: unknown) => data)
      return handleResponse(res.data)
    })
    .catch((err: Error | AxiosError) => {
      if (_axios.isAxiosError(err)) {
        const handleError =
          getShared('handleError') ||
          ((res: AxiosError) =>
            (res.response && res.response.data) || res.message)
        // @ts-ignore
        return handleError(err)
      }
      throw err
    })

  type SharedUnion = typeof config | typeof service | typeof ctx.$serviceOptions
  type SharedKey = keyof SharedUnion
  function getShared<K extends SharedKey>(key: K): SharedUnion[K] {
    return config[key] || service[key] || ctx.$serviceOptions?.[key]
  }
}

function install(Vue: VueConstructor, $options: CommonConfig = {}) {
  if ((install as any).isInstalled) return
  ;(install as any).isInstalled = true

  Vue.serviceOptions = Vue.prototype.$serviceOptions = $options

  Vue.mixin({
    created() {
      const opts = (this as { $options: ComponentOptions<Vue> }).$options

      const $services = {} as Services

      for (const servicesKey in opts.services) {
        if (!opts.services.hasOwnProperty(servicesKey)) continue

        const service = opts.services[servicesKey]
        const { name } = service.options
        $services[name] = $services[name] || service.use(this as Context)
      }

      if ('$services' in this) {
        Object.assign(this['$services'], $services)
      } else {
        Object.assign(this, { $services })
      }
    },
    beforeDestroy() {
      Object.assign(this, { $services: undefined })
    },
  })
}

function create<O extends ServiceOptions>(options: O): ServiceInstance {
  return {
    options,
    use(ctx: Context) {
      const { endpoints } = options

      const calls = {} as Calls

      for (const endpointsKey in endpoints) {
        if (!endpoints.hasOwnProperty(endpointsKey)) continue

        const endpoint = endpoints[endpointsKey]

        const call =
          typeof endpoint === 'function'
            ? (config: unknown) => promisify(endpoint(config), options, ctx)
            : promisify(endpoint, options, ctx)

        Object.assign(calls, {
          [endpointsKey]: call,
        })
      }
      return calls
    },
  }
}

const VueService = {
  install,
  create,
}

export default VueService
