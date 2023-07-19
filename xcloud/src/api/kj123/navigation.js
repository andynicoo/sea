import request from '@/libs/request'

// 分页获取类目
export const categoryListAPI = (data) => {
  return request({
    url: '/guide/console/category/list',
    data,
    method: 'post'
  })
}

// 新增或修改目录
export const addCategoryAPI = (data) => {
  return request({
    url: '/guide/console/category/addOrUpdate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 删除一级目录
export const delCategoryAPI = (data) => {
  return request({
    url: '/guide/console/category/del',
    data,
    method: 'post',
  })
}

// 分页获取服务商列表信息
export const categoryServiceListAPI = (data) => {
  return request({
    url: '/guide/console/categoryService/list',
    data,
    method: 'post'
  })
}

// 新增或修改目录服务商
export const addCategoryServiceAPI = (data) => {
  return request({
    url: '/guide/console/categoryService/addOrUpdate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 删除服务商
export const delServiceAPI = (data) => {
  return request({
    url: '/guide/console/categoryService/del',
    data,
    method: 'post',
  })
}
