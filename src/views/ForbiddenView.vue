<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="forbidden-container">
    <div class="forbidden-content">
      <h1 class="code">403</h1>
      <p class="message">抱歉，您没有权限访问该页面</p>
      <p class="tip">请联系管理员获取相应权限</p>
      <div class="actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forbidden-container {
  height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.forbidden-content {
  text-align: center;
}

.code {
  font-size: 120px;
  font-weight: bold;
  color: #f56c6c;
  margin: 0;
  line-height: 1;
}

.message {
  font-size: 24px;
  color: #303133;
  margin: 20px 0 10px;
}

.tip {
  font-size: 14px;
  color: #909399;
  margin-bottom: 30px;
}

.actions .el-button {
  margin: 0 10px;
}
</style>
