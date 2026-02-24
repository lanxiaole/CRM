<script setup>
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { Odometer, User, Lock, Setting, List } from '@element-plus/icons-vue'

const route = useRoute()
const userStore = useUserStore()

// 菜单配置
const menuConfig = [
  {
    path: '/',
    title: '仪表盘',
    icon: 'Odometer',
    permission: 'dashboard:view',
  },
  {
    title: '客户管理',
    icon: 'User',
    children: [
      {
        path: '/customers',
        title: '客户列表',
        icon: 'List',
        permission: 'customer:view',
      },
    ],
  },
  {
    title: '权限管理',
    icon: 'Lock',
    children: [
      {
        path: '/users',
        title: '用户管理',
        icon: 'List',
        permission: 'user:manage',
      },
      {
        path: '/roles',
        title: '角色管理',
        icon: 'List',
        permission: 'role:manage',
      },
    ],
  },
  {
    path: '/profile',
    title: '个人设置',
    icon: 'Setting',
    permission: 'profile:view',
  },
]

// 图标映射
const iconMap = {
  Odometer,
  User,
  Lock,
  Setting,
  List,
}

// 过滤有权限的菜单
const filterMenus = (menus) => {
  return menus.filter((menu) => {
    // 有子菜单的情况
    if (menu.children) {
      // 过滤子菜单
      menu.children = filterMenus(menu.children)
      // 如果子菜单有值，显示父菜单，否则隐藏
      return menu.children.length > 0
    }
    // 没有子菜单的情况，检查是否有权限
    return userStore.permissions.includes(menu.permission)
  })
}

// 最终显示的菜单
const filteredMenus = filterMenus(menuConfig)
</script>

<template>
  <div class="sidebar">
    <div class="logo">
      <h3>CRM管理系统</h3>
    </div>
    <el-menu
      :default-active="route.path"
      class="sidebar-menu"
      router
      mode="vertical"
      :collapse="false"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <!-- 动态渲染菜单 -->
      <template v-for="menu in filteredMenus" :key="menu.path || menu.title">
        <!-- 有子菜单的情况 -->
        <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.title">
          <template #title>
            <el-icon><component :is="iconMap[menu.icon]" /></el-icon>
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item v-for="subMenu in menu.children" :key="subMenu.path" :index="subMenu.path">
            <el-icon><component :is="iconMap[subMenu.icon]" /></el-icon>
            <span>{{ subMenu.title }}</span>
          </el-menu-item>
        </el-sub-menu>
        <!-- 没有子菜单的情况 -->
        <el-menu-item v-else :index="menu.path">
          <el-icon><component :is="iconMap[menu.icon]" /></el-icon>
          <span>{{ menu.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style scoped>
.sidebar-menu {
  width: 250px;
  height: 100vh;
  border-right: 1px solid #e4e7ed;
}
</style>
