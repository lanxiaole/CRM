<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { useUserStore } from '../stores/userStore'
import { patchUserApi } from '../api/user'

const userStore = useUserStore()

// 表单引用
const profileFormRef = ref(null)
const passwordFormRef = ref(null)

// 个人信息表单
const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  avatar: '',
})

// 密码修改表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 表单验证规则
const profileRules = {
  name: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' },
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }],
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 初始化表单数据
onMounted(() => {
  const userInfo = userStore.userInfo
  profileForm.name = userInfo.name || ''
  profileForm.email = userInfo.email || ''
  profileForm.phone = userInfo.phone || ''
  profileForm.avatar = userInfo.avatar || ''
})

// 保存个人信息
const handleSaveProfile = async () => {
  if (!profileFormRef.value) return

  try {
    await profileFormRef.value.validate()

    const userId = userStore.userInfo.id
    await patchUserApi(userId, profileForm)

    // 更新store和localStorage
    userStore.userInfo = { ...userStore.userInfo, ...profileForm }
    localStorage.setItem('userInfo', JSON.stringify(userStore.userInfo))

    ElMessage.success('个人信息保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请稍后重试')
  }
}

// 修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()

    // 验证原密码是否正确
    if (passwordForm.oldPassword !== userStore.userInfo.password) {
      ElMessage.error('原密码错误')
      return
    }

    // 新密码不能和原密码相同
    if (passwordForm.newPassword === passwordForm.oldPassword) {
      ElMessage.error('新密码不能与原密码相同')
      return
    }

    const userId = userStore.userInfo.id
    await patchUserApi(userId, { password: passwordForm.newPassword })

    // 更新store和localStorage中的密码
    userStore.userInfo.password = passwordForm.newPassword
    localStorage.setItem('userInfo', JSON.stringify(userStore.userInfo))

    ElMessage.success('密码修改成功，请下次登录使用新密码')

    // 清空表单
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    console.error('密码修改失败:', error)
    ElMessage.error('密码修改失败，请稍后重试')
  }
}
</script>

<template>
  <div class="profile-view">
    <h2 class="page-title">个人设置</h2>

    <el-row gutter="20">
      <!-- 个人信息卡片 -->
      <el-col :span="12">
        <el-card shadow="hover" class="profile-card">
          <template #header>
            <span>个人信息</span>
          </template>

          <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            label-width="100px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input :value="userStore.userInfo.username" disabled />
            </el-form-item>

            <el-form-item label="角色" prop="role">
              <el-input
                :value="userStore.userInfo.role === 'admin' ? '管理员' : '普通用户'"
                disabled
              />
            </el-form-item>

            <el-form-item label="真实姓名" prop="name">
              <el-input v-model="profileForm.name" placeholder="请输入真实姓名" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="profileForm.email" placeholder="请输入邮箱地址" />
            </el-form-item>

            <el-form-item label="手机号" prop="phone">
              <el-input v-model="profileForm.phone" placeholder="请输入手机号" />
            </el-form-item>

            <el-form-item label="头像URL" prop="avatar">
              <el-input v-model="profileForm.avatar" placeholder="请输入头像地址" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSaveProfile">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 修改密码卡片 -->
      <el-col :span="12">
        <el-card shadow="hover" class="password-card">
          <template #header>
            <span>修改密码</span>
          </template>

          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="100px"
          >
            <el-form-item label="原密码" prop="oldPassword">
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                placeholder="请输入原密码"
                show-password
              />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="请输入新密码"
                show-password
              />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleChangePassword">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.profile-view {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}

.profile-card,
.password-card {
  margin-bottom: 20px;
}
</style>
