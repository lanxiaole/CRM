import request from '../utils/request'

/**
 * 用户相关接口
 */

// 登录（查询用户）
export const loginApi = (params) => {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

// 注册（新增用户）
export const registerApi = (data) => {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

// 获取用户列表
export const getUserListApi = (params) => {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

// 删除用户
export const deleteUserApi = (id) => {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

// 编辑用户
export const updateUserApi = (id, data) => {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data
  })
}

export default {
  loginApi,
  registerApi,
  getUserListApi,
  deleteUserApi,
  updateUserApi
}
