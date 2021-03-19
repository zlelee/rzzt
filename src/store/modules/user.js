import { getToken, setToken, removeToken } from '@/utils/auth'
const state = {
  token: getToken()
}
const mutations = {
  setToken(state, token) {
    state.token = token
    // 将token存储到缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  }
}
const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
