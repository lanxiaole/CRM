import request from '../utils/request'

/**
 * 仪表盘相关接口
 */

// 获取仪表盘数据
export const getDashboardDataApi = () => {
  return request({
    url: '/dashboard',
    method: 'get'
  })
}

export default {
  getDashboardDataApi
}
