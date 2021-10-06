<template>
  <Tutorial />
</template>

<script>
import BookService from '../services/BookService'
export default {
  services: {
    BookService,
  },
  async asyncData(ctx) {
    console.log(ctx.$services)
    return { list: await ctx.$services.user.list }
  },
  mounted() {
    // const someUser = await this.$services.user.get(2)
    // console.log(someUser)
    // const list = await this.$services.user.list
    // console.log(list)
    console.log('servisi', this.$services)
  },
  created() {
    console.log(this.list)
  },
}
</script>
