import axios from 'axios'
import router from '../router'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000
})

// 请求拦截器：自动附加Token
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器：统一处理错误
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const { status } = error.response || {}
    
    if (status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
      ElMessage.error('登录已过期，请重新登录')
    } else {
      ElMessage.error(error.response?.data?.message || error.message || '请求失败')
    }
    
    return Promise.reject(error)
  }
)

export default service
