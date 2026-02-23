<script setup>
import { useRoute } from 'vue-router'
import { Odometer, User, Lock, Setting, List } from '@element-plus/icons-vue'

const route = useRoute()
</script>

<template>
  <el-menu
    :default-active="route.path"
    class="sidebar-menu"
    router
    mode="vertical"
    :collapse="false"
  >
    <!-- 仪表盘 -->
    <el-menu-item index="/">
      <template #icon>
        <odometer />
      </template>
      <span>仪表盘</span>
    </el-menu-item>

    <!-- 客户管理 -->
    <el-sub-menu index="customer">
      <template #icon>
        <user />
      </template>
      <template #title>客户管理</template>
      <el-menu-item index="/customers">
        <template #icon>
          <list />
        </template>
        客户列表
      </el-menu-item>
    </el-sub-menu>

    <!-- 权限管理 -->
    <el-sub-menu index="auth">
      <template #icon>
        <lock />
      </template>
      <template #title>权限管理</template>
      <el-menu-item index="/users">
        <template #icon>
          <list />
        </template>
        用户管理
      </el-menu-item>
      <el-menu-item index="/roles">
        <template #icon>
          <list />
        </template>
        角色管理
      </el-menu-item>
    </el-sub-menu>

    <!-- 个人设置 -->
    <el-menu-item index="/profile">
      <template #icon>
        <setting />
      </template>
      <span>个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
.sidebar-menu {
  width: 250px;
  height: 100vh;
  border-right: 1px solid #e4e7ed;
}
</style>
