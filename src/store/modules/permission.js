import { constantRoutes } from '@/router'

const state = {
  routes: constantRoutes // 所有人默认的静态路由
}
const mutations = {
  setRoutes(state, payload) {
    state.routes = [...constantRoutes, ...payload]
  }
}
const actions = {}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
