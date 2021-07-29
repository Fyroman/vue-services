<template>
  <Tutorial />
</template>

<script>
import VueService from '../../lib'

const UserService = VueService.create({
  name: 'user',
  endpoints: {
    list: {
      url: 'http://openlibrary.org/api/books.json',
      method: 'get',
      params: {
        bibkeys: 'ISBN:0201558025,LCCN:93005405',
      },
      handleResponse(data) {
        return data
      },
    },
    get: (id) => ({
      url: 'user/' + id,
      method: 'get',
      params: { archived: false },
    }),
  },
})

export default {
  services: {
    UserService,
  },
  async asyncData(ctx) {
    const userService = UserService.use(ctx)
    return { list: await userService.list }
  },
  async mounted() {
    // const someUser = await this.$services.user.get(2)
    // console.log(someUser)
    const list = await this.$services.user.list
    console.log(list)
  },
  created() {
    console.log(this.list)
  },
}
</script>
