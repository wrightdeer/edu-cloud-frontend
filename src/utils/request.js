import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/storage' // 引入存储工具
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 设置基础 URL，根据环境变量配置
  timeout: 50000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    config.url = `/api/${config.url}`
    const token = getToken()
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    // 请求错误处理
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 如果状态码不是 200，提示错误信息
    if (response.status !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    }

    // 如果 code 为 0，提示错误信息
    if (res.code === 0) {
      return Promise.reject(new Error(res.msg || 'Error'))
    }

    return res.data
  },
  error => {
    let message = error.message
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.push('/login')
          break
        case 404:
          message = '请求地址不存在'
          break
        case 403:
          message = '请求被拒绝'
          break
        case 405:
          message = '请求方法不被允许'
          break
        default:
          if (String(error.response.status).startsWith('4') || String(error.response.status).startsWith('5')) {
            message = `请求失败: ${error.response.statusText}`
          } else {
            message = '请求失败，请稍后再试'
          }
      }
    }

    error.message = message // 设置 err.message
    return Promise.reject(error)
  }
)

export default service
