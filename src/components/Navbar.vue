<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { FullScreen, Bell, Setting, Lock, SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 修改密码弹窗
const showPwdDialog = ref(false)

// 退出登录
const handleLogout = () => {
  userStore.logout()
}
</script>

<template>
  <div class="navbar">
    <!-- 左侧面包屑 -->
    <div class="navbar-left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>仪表盘</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右侧操作区 -->
    <div class="navbar-right">
      <!-- 全屏按钮 -->
      <el-tooltip content="全屏" placement="bottom">
        <div class="nav-item">
          <full-screen />
        </div>
      </el-tooltip>

      <!-- 消息通知 -->
      <el-tooltip content="消息通知" placement="bottom">
        <div class="nav-item">
          <bell />
          <el-badge :value="9" class="badge" />
        </div>
      </el-tooltip>

      <!-- 用户下拉菜单 -->
      <el-dropdown trigger="hover">
        <div class="user-info">
          <el-avatar :size="32" icon="UserFilled" />
          <span class="username">{{ userStore.userInfo.name }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="router.push('/profile')" :icon="Setting">
              个人中心
            </el-dropdown-item>
            <el-dropdown-item @click="showPwdDialog = true" :icon="Lock">
              修改密码
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout" :icon="SwitchButton">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <!-- 修改密码弹窗（占位，后续可完善功能） -->
  <el-dialog v-model="showPwdDialog" title="修改密码" width="500px">
    <p>修改密码功能开发中...</p>
    <template #footer>
      <el-button @click="showPwdDialog = false">取消</el-button>
      <el-button type="primary">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-item {
  font-size: 20px;
  color: #606266;
  cursor: pointer;
  position: relative;
}

.nav-item:hover {
  color: #409eff;
}

.badge {
  position: absolute;
  top: -5px;
  right: -10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: #303133;
}
</style>
