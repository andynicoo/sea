import request from '@/libs/request'

// 获取所有一级商标分类列表
export const oneCategoryListAPI = (data) => {
  return request({
    url: '/workorder/management/trademark/category/allList',
    data,
    method: 'post'
  })
}

// 获取所有二级商标分类列表
export const subCategoryListAPI = (data) => {
  return request({
    url: '/workorder/management/trademark/category/subCategoryList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
      }
  })
}

  /** 
 * 手动文件上传
 */
export const upload2 = (data) => {
  return request({
    url: '/file/oss/upload2',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}