import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * 通用列表逻辑封装（适用于前端分页+搜索场景）
 * @param {Function} fetchApi - 获取列表数据的API函数
 * @param {Object} options - 配置选项
 * @param {Object} options.initialSearchForm - 搜索表单初始值
 * @param {Number} options.defaultPageSize - 默认每页条数
 * @param {Function} options.customFilter - 自定义过滤函数，接收(原始数据, 搜索表单)返回过滤后的数据
 * @returns {Object} 列表相关的响应式数据和方法
 */
export function useList(fetchApi, options = {}) {
  // 默认配置
  const {
    initialSearchForm = {},
    defaultPageSize = 10,
    customFilter = null
  } = options

  // 响应式数据
  const tableData = ref([])
  const total = ref(0)
  const pageNum = ref(1)
  const pageSize = ref(defaultPageSize)
  const loading = ref(false)
  const searchForm = reactive({ ...initialSearchForm })

  /**
   * 获取列表数据
   */
  const fetchData = async () => {
    loading.value = true
    try {
      // 获取原始数据
      const allData = await fetchApi()
      
      // 数据过滤
      let filteredData = [...allData]
      if (customFilter && typeof customFilter === 'function') {
        // 使用自定义过滤逻辑
        filteredData = customFilter(filteredData, searchForm)
      } else {
        // 默认模糊过滤逻辑：遍历searchForm所有字段做包含匹配
        Object.keys(searchForm).forEach(key => {
          if (searchForm[key]) {
            filteredData = filteredData.filter(item => {
              return item[key]?.toString().includes(searchForm[key])
            })
          }
        })
      }
      
      // 分页处理
      total.value = filteredData.length
      const start = (pageNum.value - 1) * pageSize.value
      const end = start + pageSize.value
      tableData.value = filteredData.slice(start, end)
    } catch (error) {
      ElMessage.error('获取列表数据失败')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 搜索
   */
  const handleSearch = () => {
    pageNum.value = 1
    fetchData()
  }

  /**
   * 重置搜索
   */
  const handleReset = () => {
    Object.keys(initialSearchForm).forEach(key => {
      searchForm[key] = initialSearchForm[key]
    })
    handleSearch()
  }

  /**
   * 页码变化
   */
  const handlePageChange = (val) => {
    pageNum.value = val
    fetchData()
  }

  /**
   * 每页条数变化
   */
  const handleSizeChange = (val) => {
    pageSize.value = val
    pageNum.value = 1
    fetchData()
  }

  return {
    // 响应式数据
    tableData,
    total,
    pageNum,
    pageSize,
    loading,
    searchForm,
    // 方法
    fetchData,
    handleSearch,
    handleReset,
    handlePageChange,
    handleSizeChange
  }
}
