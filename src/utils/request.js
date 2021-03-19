import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 环境变量
  timeout: 5000 // 超时时间
})
service.interceptors.request.use()

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
