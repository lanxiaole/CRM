<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCustomerDetailApi } from '../api/customer'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 响应式数据
const customerInfo = ref({})
const loading = ref(false)

// 获取客户详情
const fetchCustomerDetail = async () => {
  const id = route.params.id
  if (!id) {
    ElMessage.error('客户ID不存在')
    router.push('/customers')
    return
  }

  loading.value = true
  try {
    customerInfo.value = await getCustomerDetailApi(id)
  } catch (error) {
    ElMessage.error('获取客户详情失败')
    console.error(error)
    router.push('/customers')
  } finally {
    loading.value = false
  }
}

// 编辑客户
const handleEdit = () => {
  router.push({
    path: '/customers/form',
    query: { id: route.params.id }
  })
}

// 返回列表
const handleBack = () => {
  router.push('/customers')
}

// 页面加载时获取数据
onMounted(() => {
  fetchCustomerDetail()
})
</script>

<template>
  <div class="customer-detail-container">
    <!-- 客户详情卡片 -->
    <el-card class="customer-detail-card" :loading="loading">
      <template #header>
        <div class="card-header">
          <span>客户详情</span>
        </div>
      </template>

      <!-- 客户信息 -->
      <el-descriptions :column="3" border>
        <el-descriptions-item label="客户姓名" span="1">
          {{ customerInfo.name || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="客户状态" span="1">
          <el-tag 
            :type="customerInfo.status === 'following' ? 'success' : 
                  customerInfo.status === 'success' ? 'primary' : 
                  customerInfo.status === 'lost' ? 'danger' : 'info'"
          >
            {{ customerInfo.status === 'following' ? '跟进中' : 
               customerInfo.status === 'success' ? '已成交' : 
               customerInfo.status === 'lost' ? '已流失' : customerInfo.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="客户等级" span="1">
          {{ customerInfo.level || '-' }}
        </el-descriptions-item>
        
        <el-descriptions-item label="联系电话" span="1">
          {{ customerInfo.phone || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="电子邮箱" span="1">
          {{ customerInfo.email || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="公司名称" span="1">
          {{ customerInfo.company || '-' }}
        </el-descriptions-item>
        
        <el-descriptions-item label="跟进人" span="1">
          {{ customerInfo.followUser || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" span="1">
          {{ customerInfo.createTime || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" span="3">
          {{ customerInfo.remark || '-' }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button @click="handleBack">返回列表</el-button>
        <el-button type="primary" @click="handleEdit">编辑客户</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.customer-detail-container {
  padding: 20px;
}

.customer-detail-card {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  margin-top: 30px;
  text-align: right;
}

.action-buttons .el-button {
  margin-left: 10px;
}
</style>
