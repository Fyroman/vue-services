## Installation
```bash
npm i -D vue-api-services
```

## Usage
```vue
<script>
import VueService from 'vue-api-services'
import Vue from 'vue'

// Local registration
Vue.use(VueService)

// This part would obviously suit much nicer in a separate file
const BookService = VueService.create({
  name: 'books', // this.$services[name] in component
  endpoints: {
    list: {
      // If you are using Nuxt, it will use your global axios instance by default
      url: 'books.json',
      method: 'get',
      params: {
        bibkeys: 'ISBN:0201558025,LCCN:93005405',
      },
      // You can optionally transform response data this way
      handleResponse(data) {
        return { example: data }
      },
    },
    // It can be a method as well, obviously
    get: (id) => ({
      url: 'book/' + id,
      method: 'get',
      params: { archived: false },
    }),
  },
})

export default {
  // Services registered here will be available using this.$services
  services: {
    BookService,
  },
  async asyncData(ctx) {
    // You can use it in asyncData this way
    const bookService = BookService.use(ctx)
    return {
      list: await bookService.list
    }
  },
  async mounted() {
    // Or this way in a component
    const list = await this.$services.books.list
    
    // In case of a method
    const book = await this.$services.books.get(666)
  },
}
</script>
```

## Nuxt

Place is in modules like this for global registration.

```js
export default {
  modules: [
    'vue-api-services/nuxt',
  ],
}
```
