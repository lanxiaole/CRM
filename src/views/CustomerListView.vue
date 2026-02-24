<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useList } from '../composables/useList'
import { getCustomerListApi, deleteCustomerApi, getStatusListApi } from '../api/customer'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()

const statusOptions = ref([])
// 状态类型颜色映射
const statusTypeMap = {
  following: 'success',
  success: 'primary',
  lost: 'danger',
}

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
} = useList(getCustomerListApi, {
  initialSearchForm: { name: '', phone: '', status: '' },
  defaultPageSize: 10,
  // 自定义过滤逻辑，状态字段是精确匹配
  customFilter: (data, searchForm) => {
    let filteredData = [...data]
    if (searchForm.name) {
      filteredData = filteredData.filter((item) => item.name.includes(searchForm.name))
    }
    if (searchForm.phone) {
      filteredData = filteredData.filter((item) => item.phone.includes(searchForm.phone))
    }
    if (searchForm.status) {
      filteredData = filteredData.filter((item) => item.status === searchForm.status)
    }
    return filteredData
  },
})

// 新增客户
const handleAdd = () => {
  router.push('/customers/form')
}

// 查看客户详情
const handleView = (row) => {
  router.push(`/customers/${row.id}`)
}

// 编辑客户
const handleEdit = (row) => {
  router.push({
    path: '/customers/form',
    query: { id: row.id },
  })
}

// 删除客户
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该客户吗？删除后无法恢复', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 调用删除接口
    await deleteCustomerApi(row.id)
    ElMessage.success('删除成功')

    // 重新获取数据
    fetchData()
  } catch (error) {
    // 用户取消删除或者删除失败
    if (error !== 'cancel') {
      ElMessage.error('删除失败，请稍后重试')
      console.error(error)
    }
  }
}

// 页面加载时获取数据
onMounted(async () => {
  // 获取状态选项列表
  try {
    statusOptions.value = await getStatusListApi()
  } catch (error) {
    ElMessage.error('获取状态列表失败')
    console.error(error)
  }
  // 获取客户列表
  fetchData()
})
</script>

<template>
  <div class="customer-list-container">
    <!-- 顶部搜索栏 -->
    <el-card class="search-card">
      <el-form inline :model="searchForm">
        <el-form-item label="客户姓名">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入客户姓名"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input
            v-model="searchForm.phone"
            placeholder="请输入联系电话"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item label="客户状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item class="ml-auto">
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增客户</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 中间表格区域 -->
    <el-card class="table-card">
      <el-table :data="tableData" border style="width: 100%" stripe v-loading="loading">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="客户姓名" min-width="120" />
        <el-table-column prop="phone" label="联系电话" min-width="130" />
        <el-table-column prop="status" label="客户状态" min-width="100">
          <template #default="scope">
            <el-tag :type="statusTypeMap[scope.row.status] || 'info'">
              {{
                statusOptions.find((item) => item.value === scope.row.status)?.label ||
                scope.row.status
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="followUser" label="跟进人" min-width="100" />
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
        <el-table-column label="操作" min-width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-wrap" style="display: flex; justify-content: center; margin-top: 20px">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50, 100]"
          background
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.customer-list-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.ml-auto {
  margin-left: auto;
}

.table-card {
  padding-bottom: 10px;
}

.pagination-wrap {
  padding: 20px 0;
  text-align: right;
}
</style>
