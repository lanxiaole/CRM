<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '../stores/userStore'
import { registerApi } from '../api/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

// 切换登录/注册状态
const isLogin = ref(true)

// 登录表单
const loginForm = reactive({
  username: '',
  password: '',
})

// 注册表单
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能由字母和数字组成', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能由字母和数字组成', trigger: 'blur' },
  ],
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20位', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能由字母和数字组成', trigger: 'blur' },
  ],
  name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能由字母和数字组成', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

const formRef = ref()

// 登录提交
const handleLogin = async () => {
  await formRef.value.validate()
  await userStore.login(loginForm)
}

// 注册提交
const handleRegister = async () => {
  await formRef.value.validate()
  try {
    // 检查用户名是否已存在
    const existUser = await registerApi({
      username: registerForm.username,
    })
    if (existUser.length > 0) {
      ElMessage.error('用户名已存在')
      return
    }

    // 注册新用户
    await registerApi({
      username: registerForm.username,
      password: registerForm.password,
      name: registerForm.name,
      role: 'user',
      avatar: '',
      token: `user-token-${Date.now()}`,
    })

    ElMessage.success('注册成功，请登录')
    isLogin.value = true
    // 清空注册表单
    Object.assign(registerForm, {
      username: '',
      password: '',
      confirmPassword: '',
      name: '',
    })
  } catch (error) {
    console.log(error)
    ElMessage.error('注册失败，请稍后重试')
  }
}

// 切换登录/注册
const toggleMode = () => {
  isLogin.value = !isLogin.value
  formRef.value?.resetFields()
}
</script>

<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <h2 class="title">{{ isLogin ? 'CRM系统登录' : '用户注册' }}</h2>

      <el-form
        ref="formRef"
        :model="isLogin ? loginForm : registerForm"
        :rules="isLogin ? loginRules : registerRules"
        label-width="0"
      >
        <!-- 登录表单 -->
        <template v-if="isLogin">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="用户名"
              prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              block
              @click="handleLogin"
              :loading="userStore.loading"
            >
              登录
            </el-button>
          </el-form-item>
        </template>

        <!-- 注册表单 -->
        <template v-else>
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="用户名"
              prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="name">
            <el-input
              v-model="registerForm.name"
              placeholder="真实姓名"
              prefix-icon="UserFilled"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="密码"
              prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="确认密码"
              prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" block @click="handleRegister"> 注册 </el-button>
          </el-form-item>
        </template>

        <div class="toggle-link">
          <span @click="toggleMode">
            {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
          </span>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 420px;
  padding: 30px 40px;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  color: #333;
  font-weight: 600;
}

/* 确保表单按钮居中且和输入框同宽 */
.el-form-item {
  text-align: center;
}

.el-form-item .el-button {
  width: 100%;
  margin: 0 auto;
}

.toggle-link {
  text-align: center;
  color: #409eff;
  cursor: pointer;
  font-size: 14px;
}

.toggle-link:hover {
  text-decoration: underline;
}
</style>
