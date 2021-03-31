import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  routes: constantRoutes // 所有人默认的静态路由
}
const mutations = {
  setRoutes(state, payload) {
    state.routes = [...constantRoutes, ...payload]
  }
}
const actions = {
  filterRoute(context, menus) {
    const routes = asyncRoutes.filter(item => menus.includes(item.name))
    context.commit('setRoutes', routes)
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
