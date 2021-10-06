import VueService from 'vue-api-services'

const UserService = VueService.create({
  name: 'user',
  endpoints: {
    list: {
      url: 'books.json',
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

export default UserService
