import request from '@/utils/request'

// 查询列表列表
export function listList(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

// 查询列表详细
export function getListById(id) {
  return request({
    url: '/user/item/',
    method: 'get',
    params: { id }
  })
}

// 新增列表
export function addList(item) {
  return request({
    url: '/user/list',
    method: 'post',
    data: item
  })
}

// 修改列表
export function updateList(item) {
  return request({
    url: '/user/list',
    method: 'put',
    data: item
  })
}

// 删除列表
export function delList(id) {
  return request({
    url: '/user/list',
    method: 'delete',
    params: { id }
  })
}
