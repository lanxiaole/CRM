<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="not-found-container" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f7fa;">
    <el-card style="width: 600px; text-align: center; padding: 60px 40px;">
      <el-empty description="页面不存在" image-size="200">
        <template #image>
          <h1 style="font-size: 120px; font-weight: bold; color: #409eff; line-height: 1; margin: 0;">404</h1>
        </template>
        <p style="color: #909399; font-size: 18px; margin: 20px 0 40px;">抱歉，您访问的页面不存在或已被移除</p>
        <el-space>
          <el-button type="primary" @click="goHome">返回首页</el-button>
          <el-button @click="goBack">返回上页</el-button>
        </el-space>
      </el-empty>
    </el-card>
  </div>
</template>

<style scoped>
</style>
