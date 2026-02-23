<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 面包屑列表
const breadcrumbList = computed(() => {
  // 过滤掉layout父路由，只保留子路由
  const matched = route.matched.filter((item) => item.meta?.breadcrumb)

  return [
    // 首页固定项
    {
      path: '/',
      name: '首页',
    },
    // 路由中配置的面包屑
    ...matched.map((item) => ({
      path: item.path,
      name: item.meta.breadcrumb,
    })),
  ]
})
</script>

<template>
  <el-breadcrumb separator="/">
    <template v-for="(item, index) in breadcrumbList" :key="item.path">
      <!-- 最后一项不可点击 -->
      <el-breadcrumb-item v-if="index === breadcrumbList.length - 1">
        {{ item.name }}
      </el-breadcrumb-item>
      <!-- 前面的可点击跳转 -->
      <el-breadcrumb-item v-else :to="{ path: item.path }">
        {{ item.name }}
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<style scoped></style>
