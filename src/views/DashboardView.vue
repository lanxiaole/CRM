<script setup>
import { ref, reactive, onMounted } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { List, Check, Clock, TrendCharts, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElForm } from 'element-plus'
import { useUserStore } from '../stores/userStore'
import { getDashboardDataApi } from '../api/dashboard'

echarts.use([TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer])

const stats = ref({
  total: 0,
  newToday: 0,
  following: 0,
  tasks: 0,
})

const chartOption = ref({})
const userStore = useUserStore()

// 待办本地存储key（区分不同用户）
const TODO_STORAGE_KEY = `crm_todo_${userStore.userInfo.id}`

// 默认待办数据
const defaultTodos = [
  { id: 1, content: '跟进客户张三的需求', completed: false, time: '10:00' },
  { id: 2, content: '提交本月销售报表', completed: false, time: '14:00' },
  { id: 3, content: '回访意向客户李四', completed: false, time: '15:30' },
  { id: 4, content: '整理新客户资料', completed: true, time: '09:30' },
  { id: 5, content: '参加部门周会', completed: true, time: '16:00' },
]

// 从本地存储加载待办数据
const loadTodos = () => {
  const saved = localStorage.getItem(TODO_STORAGE_KEY)
  return saved ? JSON.parse(saved) : defaultTodos
}

// 保存待办数据到本地存储
const saveTodos = () => {
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todoList))
}

// 今日待办数据
const todoList = reactive(loadTodos())

// 切换待办完成状态
const toggleTodo = (item) => {
  item.completed = !item.completed
  saveTodos() // 切换后立即保存
}

// 新增待办弹窗
const showAddDialog = ref(false)
const addFormRef = ref(null)
const addForm = reactive({
  content: '',
  time: '',
})
const addFormRules = {
  content: [{ required: true, message: '请输入待办内容', trigger: 'blur' }],
  time: [
    { required: true, message: '请输入时间', trigger: 'blur' },
    { pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, message: '时间格式为HH:mm', trigger: 'blur' },
  ],
}

// 编辑待办弹窗
const showEditDialog = ref(false)
const editFormRef = ref(null)
const editForm = reactive({
  id: null,
  content: '',
  time: '',
})
const editFormRules = { ...addFormRules }

// 新增待办
const handleAdd = () => {
  showAddDialog.value = true
}

// 提交新增
const submitAdd = async () => {
  if (!addFormRef.value) return

  try {
    await addFormRef.value.validate()

    const newTodo = {
      id: Date.now(), // 时间戳作为唯一ID
      content: addForm.content,
      time: addForm.time,
      completed: false,
    }

    todoList.unshift(newTodo) // 新增到最前面
    saveTodos()
    ElMessage.success('待办新增成功')

    // 关闭弹窗清空表单
    showAddDialog.value = false
    addForm.content = ''
    addForm.time = ''
  } catch (error) {
    console.error('新增失败:', error)
  }
}

// 编辑待办
const handleEdit = (item) => {
  editForm.id = item.id
  editForm.content = item.content
  editForm.time = item.time
  showEditDialog.value = true
}

// 提交编辑
const submitEdit = async () => {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()

    const index = todoList.findIndex((item) => item.id === editForm.id)
    if (index !== -1) {
      todoList[index].content = editForm.content
      todoList[index].time = editForm.time
      saveTodos()
      ElMessage.success('待办修改成功')
    }

    showEditDialog.value = false
  } catch (error) {
    console.error('编辑失败:', error)
  }
}

// 删除待办
const handleDelete = async (item) => {
  try {
    await ElMessageBox.confirm(`确定要删除待办 "${item.content}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const index = todoList.findIndex((todo) => todo.id === item.id)
    if (index !== -1) {
      todoList.splice(index, 1)
      saveTodos()
      ElMessage.success('删除成功')
    }
  } catch (error) {
    // 取消删除
    console.log('删除取消:', error)
  }
}

const getDashboardData = async () => {
  const res = await getDashboardDataApi()
  // 统计数据
  stats.value = res.stats
  // 图表数据
  chartOption.value = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: res.chart.dates,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '新增客户',
        type: 'line',
        smooth: true,
        data: res.chart.values,
        itemStyle: {
          color: '#409eff',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' },
          ]),
        },
      },
    ],
  }
}

onMounted(() => {
  getDashboardData()
})
</script>

<template>
  <div class="dashboard-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="mb-20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-title">总客户数</div>
          <div class="stat-num">{{ stats.total }}</div>
          <div class="stat-trend up">+12% 较上月</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-title">今日新增客户</div>
          <div class="stat-num">{{ stats.newToday }}</div>
          <div class="stat-trend up">+3 较昨日</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-title">跟进中客户</div>
          <div class="stat-num">{{ stats.following }}</div>
          <div class="stat-trend down">-5 较上周</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-title">待办任务</div>
          <div class="stat-num">{{ stats.tasks }}</div>
          <div class="stat-trend up">+2 今日新增</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 下方内容区 -->
    <el-row :gutter="20">
      <!-- 左侧图表区域 -->
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon color="#409EFF" size="20"><TrendCharts /></el-icon>
              <span class="card-title">客户增长趋势</span>
            </div>
          </template>
          <v-chart :option="chartOption" style="width: 100%; height: 400px" />
        </el-card>
      </el-col>

      <!-- 右侧待办列表 -->
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon color="#67c23a" size="20"><List /></el-icon>
              <span class="card-title">今日待办</span>
              <span class="todo-count"
                >{{ todoList.filter((item) => !item.completed).length }}/{{ todoList.length }}</span
              >
              <el-button type="primary" size="small" @click="handleAdd">+ 新增</el-button>
            </div>
          </template>
          <div class="todo-list">
            <div
              v-for="item in todoList"
              :key="item.id"
              class="todo-item"
              :class="{ completed: item.completed }"
            >
              <div class="todo-left" @click="toggleTodo(item)">
                <el-icon class="todo-checkbox" :color="item.completed ? '#67c23a' : '#dcdfe6'">
                  <Check />
                </el-icon>
                <span class="todo-content">{{ item.content }}</span>
              </div>
              <div class="todo-right">
                <span class="todo-time">
                  <el-icon size="14" color="#909399"><Clock /></el-icon>
                  <span>{{ item.time }}</span>
                </span>
                <div class="todo-actions">
                  <el-icon class="action-icon edit" title="编辑" @click.stop="handleEdit(item)">
                    <Edit />
                  </el-icon>
                  <el-icon class="action-icon delete" title="删除" @click.stop="handleDelete(item)">
                    <Delete />
                  </el-icon>
                </div>
              </div>
            </div>
          </div>

          <!-- 新增待办弹窗 -->
          <el-dialog v-model="showAddDialog" title="新增待办" width="500px">
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
              <el-form-item label="待办内容" prop="content">
                <el-input v-model="addForm.content" placeholder="请输入待办内容" />
              </el-form-item>
              <el-form-item label="时间" prop="time">
                <el-input v-model="addForm.time" placeholder="请输入时间（如10:00）" />
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="showAddDialog = false">取消</el-button>
              <el-button type="primary" @click="submitAdd">确定</el-button>
            </template>
          </el-dialog>

          <!-- 编辑待办弹窗 -->
          <el-dialog v-model="showEditDialog" title="编辑待办" width="500px">
            <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
              <el-form-item label="待办内容" prop="content">
                <el-input v-model="editForm.content" placeholder="请输入待办内容" />
              </el-form-item>
              <el-form-item label="时间" prop="time">
                <el-input v-model="editForm.time" placeholder="请输入时间（如10:00）" />
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="showEditDialog = false">取消</el-button>
              <el-button type="primary" @click="submitEdit">确定</el-button>
            </template>
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 10px;
}

.stat-num {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stat-trend {
  font-size: 12px;
}

.stat-trend.up {
  color: #67c23a;
}

.stat-trend.down {
  color: #f56c6c;
}

/* 卡片头部样式 */
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.todo-count {
  font-size: 14px;
  color: #909399;
  background: #f5f7fa;
  padding: 2px 8px;
  border-radius: 10px;
  margin-right: 8px;
}

/* 待办列表样式 */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 6px;
  transition: all 0.3s;
  background: #fafafa;
}

.todo-item:hover {
  background: #f5f7fa;
  transform: translateX(4px);
}

.todo-item:hover .todo-actions {
  opacity: 1;
}

.todo-item.completed .todo-content {
  text-decoration: line-through;
  color: #c0c4cc;
}

.todo-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  cursor: pointer;
}

.todo-checkbox {
  flex-shrink: 0;
}

.todo-content {
  font-size: 14px;
  color: #303133;
  line-height: 1.5;
}

.todo-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.todo-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.todo-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.action-icon {
  font-size: 14px;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-icon.edit {
  color: #409eff;
}

.action-icon.edit:hover {
  background: #ecf5ff;
}

.action-icon.delete {
  color: #f56c6c;
}

.action-icon.delete:hover {
  background: #fef0f0;
}
</style>
