<script setup></script>

<template>
  <div class="customer-list-container">
    <!-- 顶部搜索栏 -->
    <el-card class="search-card">
      <el-form inline>
        <el-form-item label="客户姓名">
          <el-input placeholder="请输入客户姓名" style="width: 200px" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input placeholder="请输入联系电话" style="width: 200px" />
        </el-form-item>
        <el-form-item label="客户状态">
          <el-select placeholder="请选择状态" style="width: 200px">
            <el-option label="跟进中" value="following" />
            <el-option label="已成交" value="success" />
            <el-option label="已流失" value="lost" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
          <el-button>重置</el-button>
        </el-form-item>
        <el-form-item class="ml-auto">
          <el-button type="primary" icon="Plus">新增客户</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 中间表格区域 -->
    <el-card class="table-card">
      <el-table :data="[]" border style="width: 100%" stripe>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="客户姓名" min-width="120" />
        <el-table-column prop="phone" label="联系电话" min-width="130" />
        <el-table-column prop="status" label="客户状态" min-width="100">
          <template #default>
            <el-tag type="success">跟进中</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="followUser" label="跟进人" min-width="100" />
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
        <el-table-column label="操作" min-width="200" fixed="right">
          <el-button size="small" type="primary">查看</el-button>
          <el-button size="small">编辑</el-button>
          <el-button size="small" type="danger">删除</el-button>
        </el-table-column>
      </el-table>

      <!-- 底部分页 -->
      <div class="pagination-wrap">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="100"
          :page-size="10"
          :page-sizes="[10, 20, 50, 100]"
          background
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
