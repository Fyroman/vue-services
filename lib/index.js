import _axios from 'axios';
function promisify(config, service, ctx) {
    const _ctx = ctx;
    const axios = config.axios ||
        service.axios ||
        ctx.$serviceOptions.axios ||
        _ctx.$axios ||
        _axios;
    return axios
        .request(config)
        .then((res) => {
        const handleResponse = config.handleResponse ||
            service.handleResponse ||
            ctx.$serviceOptions?.handleResponse ||
            ((data) => data);
        return handleResponse(res.data);
    })
        .catch((err) => {
        if (_axios.isAxiosError(err)) {
            const handleError = config.handleError ||
                service.handleError ||
                ctx.$serviceOptions?.handleError ||
                ((res) => res.response?.data || res.message);
            return handleError(err);
        }
        throw err;
    });
}
function install(Vue, $options = {}) {
    if (install.isInstalled)
        return;
    install.isInstalled = true;
    Vue.serviceOptions = Vue.prototype.$serviceOptions = $options;
    Vue.mixin({
        created() {
            const opts = this.$options;
            const $services = {};
            for (const servicesKey in opts.services) {
                if (!opts.services.hasOwnProperty(servicesKey))
                    continue;
                const service = opts.services[servicesKey];
                const { name } = service.options;
                $services[name] = $services[name] || service.use(this);
            }
            Object.assign(this, { $services });
        },
        beforeDestroy() {
            Object.assign(this, { $services: undefined });
        },
    });
}
function create(options) {
    return {
        options,
        use(ctx) {
            const { endpoints } = options;
            const calls = {};
            for (const endpointsKey in endpoints) {
                if (!endpoints.hasOwnProperty(endpointsKey))
                    continue;
                const endpoint = endpoints[endpointsKey];
                const call = typeof endpoint === 'function'
                    ? (config) => promisify(endpoint(config), options, ctx)
                    : promisify(endpoint, options, ctx);
                Object.assign(calls, {
                    [endpointsKey]: call,
                });
            }
            return calls;
        },
    };
}
const VueService = {
    install,
    create,
};
export default VueService;
