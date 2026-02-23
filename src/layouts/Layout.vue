<script setup>
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
</script>

<template>
  <div class="layout">
    <!-- 侧边栏 -->
    <Sidebar />
    <!-- 右侧内容区 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <Navbar />
      <!-- 页面内容区 -->
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.page-content {
  flex: 1;
  overflow-y: auto;
}
</style>
