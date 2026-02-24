<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  addCustomerApi,
  updateCustomerApi,
  getCustomerDetailApi,
  getStatusListApi,
} from '../api/customer'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 响应式数据
const formRef = ref(null)
const form = ref({
  name: '',
  phone: '',
  email: '',
  company: '',
  level: '',
  status: '',
  remark: '',
})
const loading = ref(false)
const statusOptions = ref([])
const levelOptions = ref([
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
])

// 表单验证规则
const formRules = ref({
  name: [
    { required: true, message: '请输入客户姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '客户姓名长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
  company: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择客户状态', trigger: 'change' }],
  level: [{ required: true, message: '请选择客户等级', trigger: 'change' }],
})

// 判断当前模式（新增/编辑）
const isEdit = computed(() => !!route.query.id)

// 获取状态选项
const fetchStatusOptions = async () => {
  try {
    statusOptions.value = await getStatusListApi()
  } catch (error) {
    ElMessage.error('获取状态选项失败')
    console.error(error)
  }
}

// 获取客户详情（编辑模式）
const fetchCustomerDetail = async () => {
  const id = route.query.id
  if (!id) return

  loading.value = true
  try {
    const customer = await getCustomerDetailApi(id)
    form.value = customer
  } catch (error) {
    ElMessage.error('获取客户详情失败')
    console.error(error)
    router.push('/customers')
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    if (isEdit.value) {
      // 编辑模式
      await updateCustomerApi(route.query.id, form.value)
      ElMessage.success('客户信息更新成功')
      router.push(`/customers/${route.query.id}`)
    } else {
      // 新增模式
      await addCustomerApi(form.value)
      ElMessage.success('客户新增成功')
      router.push('/customers')
    }
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新客户信息失败' : '新增客户失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 取消按钮
const handleCancel = () => {
  if (isEdit.value) {
    router.push(`/customers/${route.query.id}`)
  } else {
    router.push('/customers')
  }
}

// 页面加载时初始化
onMounted(async () => {
  await fetchStatusOptions()
  if (isEdit.value) {
    await fetchCustomerDetail()
  }
})
</script>

<template>
  <div
    class="customer-form-container"
    style="padding: 20px; display: flex; justify-content: center"
  >
    <el-card class="customer-form-card" :loading="loading" style="width: 100%; max-width: 900px">
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑客户' : '新增客户' }}</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
        class="customer-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入客户姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入电子邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司名称" prop="company">
              <el-input v-model="form.company" placeholder="请输入公司名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户等级" prop="level">
              <el-select v-model="form.level" placeholder="请选择客户等级">
                <el-option
                  v-for="option in levelOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择客户状态">
                <el-option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="4" placeholder="请输入备注信息" />
        </el-form-item>

        <div class="form-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            {{ isEdit ? '更新客户' : '新增客户' }}
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.customer-form-container {
  padding: 20px;
}

.customer-form-card {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.customer-form {
  margin-top: 20px;
}

.form-actions {
  margin-top: 30px;
  text-align: right;
}

.form-actions .el-button {
  margin-left: 10px;
}
</style>
