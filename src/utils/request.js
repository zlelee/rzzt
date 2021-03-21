import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import { getTimeStamp } from './auth'
import router from '@/router'

const timeout = 3600 // token的超时事件
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 环境变量
  timeout: 5000 // 发送请求的超时时间
})
// 请求拦截器
service.interceptors.request.use(config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
    if (isCheckTimeOut()) {
      // token超时了
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token已超时'))
    }
    // 如果token存在 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  const { success, data, message } = response.data
  if (success) {
    return data
  } else {
    // 业务错误, 后端没有返回成功提示
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, err => {
  // 状态码在 2xx 范围之外都会走这里
  // err里面有 response 对象
  if (err.response && err.response.data && err.response.data.code === 10002) {
    // 后端告诉我们token过期了
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(err.message) // err.message是错误对象的描述信息
  }
  return Promise.reject(err) // 抛出错误,走 catch
})
function isCheckTimeOut() {
  const currentTime = Date.now()
  const timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > timeout
}
export default service
