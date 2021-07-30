```vue
<script>
import VueService from 'vue-api-services'

const BookService = VueService.create({
  name: 'books',
  endpoints: {
    list: {
      url: 'http://openlibrary.org/api/books.json',
      method: 'get',
      params: {
        bibkeys: 'ISBN:0201558025,LCCN:93005405',
      },
      handleResponse(data) {
        return { example: data }
      },
    },
    get: (id) => ({
      url: 'book/' + id,
      method: 'get',
      params: { archived: false },
    }),
  },
})

export default {
  services: {
    BookService,
  },
  async asyncData(ctx) {
    const userService = BookService.use(ctx) // You can use it in asyncData this way
    return { list: await userService.list }
  },
  async mounted() {
    const list = await this.$services.user.list // Or this way in component
    console.log(list)
  },
  created() {
    console.log(this.list)
  },
}
</script>
```
