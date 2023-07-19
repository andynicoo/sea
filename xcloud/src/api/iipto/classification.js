import request from '@/libs/request'

//分页查询商标小类列表
export const subcategoryListApi = (data) => {
  return request({
    url: '/trademark/manage/category/subcategory/list',
    data,
    method: 'post'
  })
}

//新增或修改商标小类
export const subcategoryUpdateApi = (data) => {
  return request({
    url: '/trademark/manage/category/subcategory/update',
    data,
    method: 'post'
  })
}

//导出商标小类EXCEL列表
export const importSubcategoryFileApi = (data) => {
  return request({
    url: '/trademark/manage/category/subcategory/importSubcategoryFile',
    data,
    method: 'post'
  })
}

//商标小类条件信息
export const subcategoryConditionApi = () => {
  return request({
    url: '/trademark/manage/category/subcategory/condition',
    method: 'get'
  })
}

//根据商标小类ID删除小类
export const subcategoryDelApi = (params) => {
  return request({
    url: '/trademark/manage/category/subcategory/del',
    params,
    method: 'get'
  })
}

//校验商标小类文件信息
export const checkSubcategoryFileApi = (data) => {
  return request({
    url: '/trademark/manage/category/subcategory/checkSubcategoryFile',
    data,
    method: 'post'
  })
}

//上传商标小类文件
export const uploadSubcategoryFileApi = (data) => {
  return request({
    url: '/trademark/manage/category/subcategory/uploadSubcategoryFile',
    data,
    method: 'post'
  })
}