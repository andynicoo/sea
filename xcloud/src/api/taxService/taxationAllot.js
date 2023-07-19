import request from '@/libs/request'

//税务经理自动分配列表
export const allocList = (data) => {
  return request({
    url: '/etax/person/alloc/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
//查询角色成员（获取税务经理列表）
export const taxManagerList = () => {
  return request({
    url: '/base/role/users/info',
    params: {
      roleCode: 'tax_commissioner'
    },
    method: 'get',
  })
}
//注册工单分配-保存（新增）
export const addAlloc = (data) => {
  return request({
    url: '/etax/person/alloc/save',
    data,
    method: 'post',
  })
}
//注册工单分配-修改（编辑）
export const editAlloc = (data) => {
  return request({
    url: '/etax/person/alloc/modify',
    data,
    method: 'post',
  })
}
//注册工单分配-删除
export const deleteAlloc = (data) => {
  return request({
    url: '/etax/person/alloc/delete',
    data,
    method: 'post',
  })
}
//注册工单分配-查看操作日志
export const getLog = (data) => {
  return request({
    url: '/etax/person/alloc/logs',
    data,
    method: 'post',
  })
}
