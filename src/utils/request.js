import axios from 'axios'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 环境变量
  timeout: 5000 // 超时时间
})
service.interceptors.request.use()
service.interceptors.response.use()
export default service
