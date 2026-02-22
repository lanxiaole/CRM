import axios from 'axios'
import router from '../router'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
})

// 请求拦截器：自动附加Token
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
// // 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//     // 在发送请求之前做些什么
//     return config;
//   }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   });

// 响应拦截器：统一处理错误
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const { status } = error.response || {}

    if (status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
      ElMessage.error('登录已过期，请重新登录')
    } else {
      ElMessage.error(error.response?.data?.message || error.message || '请求失败')
    }

    return Promise.reject(error)
  },
)

// // 添加响应拦截器
// axios.interceptors.response.use(function (response) {
//     // 2xx 范围内的状态码都会触发该函数。
//     // 对响应数据做点什么
//     return response;
//   }, function (error) {
//     // 超出 2xx 范围的状态码都会触发该函数。
//     // 对响应错误做点什么
//     return Promise.reject(error);
//   });

export default service
