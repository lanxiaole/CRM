import request from '../utils/request'

/**
 * 客户相关接口
 */

// 获取客户列表（返回完整响应，包含headers用于获取总条数）
export const getCustomerListApi = (params) => {
  return request({
    url: '/customers',
    method: 'get',
    params,
    needFullResponse: true,
  })
}

// 新增客户
export const addCustomerApi = (data) => {
  return request({
    url: '/customers',
    method: 'post',
    data,
  })
}

// 修改客户
export const updateCustomerApi = (id, data) => {
  return request({
    url: `/customers/${id}`,
    method: 'put',
    data,
  })
}

// 删除客户
export const deleteCustomerApi = (id) => {
  return request({
    url: `/customers/${id}`,
    method: 'delete',
  })
}

// 获取客户状态列表
export const getStatusListApi = () => {
  return request({
    url: '/statuses',
    method: 'get',
  })
}

export default {
  getCustomerListApi,
  addCustomerApi,
  updateCustomerApi,
  deleteCustomerApi,
  getStatusListApi,
}
