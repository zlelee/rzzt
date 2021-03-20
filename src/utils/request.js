import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 环境变量
  timeout: 5000 // 超时时间
})
service.interceptors.request.use(config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
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
  Message.error(err.message) // err.message是错误对象的描述信息
  return Promise.reject(err) // 抛出错误,走 catch
})
export default service
