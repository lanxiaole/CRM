<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { getDashboardDataApi } from '../api/dashboard'

echarts.use([TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer])

const stats = ref({
  total: 0,
  newToday: 0,
  following: 0,
  tasks: 0,
})

const chartOption = ref({})

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
        <el-card title="客户增长趋势">
          <v-chart :option="chartOption" style="width: 100%; height: 400px" />
        </el-card>
      </el-col>

      <!-- 右侧待办列表 -->
      <el-col :span="8">
        <el-card title="今日待办">
          <el-list>
            <el-list-item>跟进客户张三的需求</el-list-item>
            <el-list-item>提交本月销售报表</el-list-item>
            <el-list-item>回访意向客户李四</el-list-item>
            <el-list-item>整理新客户资料</el-list-item>
            <el-list-item>参加部门周会</el-list-item>
          </el-list>
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
</style>
