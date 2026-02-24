import request from '../utils/request'

/**
 * 角色相关接口
 */

// 获取角色列表
export const getRoleListApi = (params) => {
  return request({
    url: '/roles',
    method: 'get',
    params
  })
}

// 新增角色
export const addRoleApi = (data) => {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

// 修改角色
export const updateRoleApi = (id, data) => {
  return request({
    url: `/roles/${id}`,
    method: 'put',
    data
  })
}

// 删除角色
export const deleteRoleApi = (id) => {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}

export default {
  getRoleListApi,
  addRoleApi,
  updateRoleApi,
  deleteRoleApi
}
