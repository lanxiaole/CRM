import { defineStore } from 'pinia'
import { loginApi } from '../api/user'
import router from '../router'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {},
    token: localStorage.getItem('token') || '',
    isLoggedIn: !!localStorage.getItem('token'),
  }),

  actions: {
    // 登录方法
    async login(loginForm) {
      try {
        // 先根据用户名查询用户
        const res = await loginApi({
          username: loginForm.username.trim(), // 自动去除首尾空格
        })

        if (res.length > 0) {
          const user = res[0]
          // 再对比密码
          if (user.password === loginForm.password.trim()) {
            // 保存用户信息和token
            this.userInfo = user
            this.token = user.token
            this.isLoggedIn = true
            localStorage.setItem('token', user.token)
            localStorage.setItem('userInfo', JSON.stringify(user))

            ElMessage.success('登录成功')
            router.push('/')
            return true
          } else {
            ElMessage.error('密码错误')
            return false
          }
        } else {
          ElMessage.error('用户名不存在')
          return false
        }
      } catch (error) {
        console.error('登录错误:', error)
        ElMessage.error('登录失败，请稍后重试')
        return false
      }
    },

    // 退出登录
    logout() {
      this.userInfo = {}
      this.token = ''
      this.isLoggedIn = false
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      ElMessage.success('已退出登录')
      router.push('/login')
    },

    // 初始化用户信息
    initUserInfo() {
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo)
      }
    },
  },
})
