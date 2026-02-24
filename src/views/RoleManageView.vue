<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useList } from '../composables/useList'
import { getRoleListApi, addRoleApi, updateRoleApi, deleteRoleApi } from '../api/role'
import { ElMessage, ElMessageBox } from 'element-plus'

const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const formRef = ref(null)
// 存储所有角色列表，用于code唯一性校验
const allRoles = ref([])

// 表单数据
const form = reactive({
  id: '',
  name: '',
  code: '',
  description: '',
})

// 编辑模式
const isEdit = computed(() => !!form.id)

// 表单验证规则
const formRules = ref({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2到20个字符', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        // 校验code唯一性
        if (!value) return callback()
        const exist = allRoles.value.find((item) => item.code === value && item.id !== form.id)
        if (exist) {
          callback(new Error('角色标识已存在'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

// 使用封装的列表逻辑
const {
  tableData,
  total,
  pageNum,
  pageSize,
  loading,
  searchForm,
  fetchData,
  handleSearch,
  handleReset,
  handlePageChange,
  handleSizeChange,
} = useList(getRoleListApi, {
  initialSearchForm: { name: '' },
  defaultPageSize: 10,
  // 获取全量角色数据用于code校验
  customFilter: (data, searchForm) => {
    allRoles.value = [...data]
    let filteredData = [...data]
    if (searchForm.name) {
      filteredData = filteredData.filter((item) => item.name.includes(searchForm.name))
    }
    return filteredData
  },
})

// 新增角色
const handleAdd = () => {
  dialogTitle.value = '新增角色'
  Object.assign(form, {
    id: '',
    name: '',
    code: '',
    description: '',
  })
  dialogVisible.value = true
}

// 编辑角色
const handleEdit = (row) => {
  dialogTitle.value = '编辑角色'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 删除角色
const handleDelete = async (row) => {
  // 安全校验：确保id存在
  if (!row.id) {
    ElMessage.error('角色ID不存在，无法删除')
    console.error('当前行数据：', row)
    return
  }
  try {
    await ElMessageBox.confirm(`确定要删除角色 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteRoleApi(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitLoading.value = true

    if (isEdit.value) {
      // 编辑模式
      await updateRoleApi(form.id, form)
      ElMessage.success('角色信息更新成功')
    } else {
      // 新增模式：移除空id字段，让json-server自动生成id
      const addData = { ...form }
      delete addData.id
      await addRoleApi(addData)
      ElMessage.success('角色新增成功')
    }

    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新角色信息失败' : '新增角色失败')
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
  formRef.value?.resetFields()
}

// 页面初始化
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="role-manage-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.name" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleAdd">新增角色</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <el-table :data="tableData" v-loading="loading" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="name" label="角色名称" width="180" />
        <el-table-column prop="code" label="角色标识" width="180" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)"> 编辑 </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)"> 删除 </el-button>
            <el-button type="info" size="small" disabled> 权限配置 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-wrap" style="display: flex; justify-content: center; margin-top: 20px">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="handleClose">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色标识" :disabled="isEdit" />
          <div
            v-if="isEdit"
            class="tip-text"
            style="font-size: 12px; color: #909399; margin-top: 4px"
          >
            角色标识不可修改
          </div>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.role-manage-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  width: 100%;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.dialog-footer .el-button {
  margin-left: 10px;
}

.tip-text {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
