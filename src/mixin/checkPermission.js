import store from '@/store'
export default {
  methods: {
    checkPermission(key) {
      const { userInfo } = store.state.user
      if (userInfo.roles.points.includes(key)) {
        return true
      }
      return false
    }
  }
}
