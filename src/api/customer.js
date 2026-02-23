import request from '../utils/request'

/**
 * 客户相关接口
 */

// 获取客户列表
export const getCustomerListApi = (params) => {
  return request({
    url: '/customers',
    method: 'get',
    params
  })
}

// 新增客户
export const addCustomerApi = (data) => {
  return request({
    url: '/customers',
    method: 'post',
    data
  })
}

// 修改客户
export const updateCustomerApi = (id, data) => {
  return request({
    url: `/customers/${id}`,
    method: 'put',
    data
  })
}

// 删除客户
export const deleteCustomerApi = (id) => {
  return request({
    url: `/customers/${id}`,
    method: 'delete'
  })
}

// 获取客户状态列表
export const getStatusListApi = () => {
  return request({
    url: '/statuses',
    method: 'get'
  })
}

export default {
  getCustomerListApi,
  addCustomerApi,
  updateCustomerApi,
  deleteCustomerApi,
  getStatusListApi
}
