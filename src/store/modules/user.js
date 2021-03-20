import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getUserInfo, getUserDetailById } from '@/api/user'
const state = {
  token: getToken(),
  userInfo: {} // 设置一个空对象而不是null, 因为后面要通过userinfo.username的方式取数据,避免了报错
}
const mutations = {
  setToken(state, token) {
    // 将token存储到vuex
    state.token = token
    // 将token存储到缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = { ...userInfo } // 用浅拷贝的方式去赋值对象, 因为这样数据更新之后,才会触发组件的更新
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    const result = await login(data)
    context.commit('setToken', result)
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    const baseResult = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseResult })
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
