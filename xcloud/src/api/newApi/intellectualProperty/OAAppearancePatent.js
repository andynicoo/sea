import request from '@/libs/request'

// OA外观专利列表
export const OAPatentList = data => {
  return request({
    url: '/workorder/management/design_patent_oa/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// OA外观专利详情
export const OAPatentInfo = data => {
  return request({
    url: '/workorder/management/design_patent_oa/detail',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// OA外观专利审核
export const OAPatentAudit = data => {
  return request({
    url: '/workorder/management/design_patent_oa/audit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// OA外观专利删除
export const OAPatentDel = data => {
  return request({
    url: '/workorder/management/design_patent_oa/del',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// OA外观专利修改官方文件
export const OAPatentUpdateOfficialFile = data => {
  return request({
    url: '/workorder/management/design_patent_oa/updateOfficialFile',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// OA外观专利上传官方文件
export const OAPatentUploadOfficialFile = data => {
  return request({
    url: '/workorder/management/design_patent_oa/uploadOfficialFile',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 翻译OA
export const OAPatentTranslate = data => {
  return request({
    url: '/workorder/management/design_patent_oa/translate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 关闭OA
export const OAPatentClose = data => {
  return request({
    url: '/workorder/management/design_patent_oa/close',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
