import request from '@/libs/request'

// 提交授权代表资料
export const saveOrSubmitCompliance = (data) => {
  return request({
    url: '/etax/authorisedRepresentativeManagement/submit/information',
    data,
    method: 'post',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
//获取授权代表服务列表
export const getComplianceList = (data) => {
    return request({
      url: '/etax/services/management/authorisedRepresentative/list',
      data,
      method: 'post',
    })
  }

//获取详情信息
export const getComplianceDetail = (data) => {
    return request({
      url: '/etax/services/management/detail',
      data,
      method: 'post',
    })
  }

  //发送提醒
export const sendXinxiTixing = (data) => {
    return request({
      url: '/etax/authorisedRepresentativeManagement/send/msm',
      data,
      method: 'post',
    })
  }

  //审核资料
export const shenheComplian = (data) => {
    return request({
      url: '/etax/authorisedRepresentativeManagement/verify/material',
      data,
      method: 'post',
    })
  }
  //上传协议和证书
  export const subComplian = (data) => {
    return request({
      url: '/etax/authorisedRepresentativeManagement/upload/certificate',
      data,
      method: 'post',
    })
  }
  //上传协议和证书
  export const subComplianAgin = (data) => {
    return request({
      url: '/etax/euroEnProxy/uploadFile',
      data,
      method: 'post',
    })
  }
  //录入信息
export const enterComplian = (data) => {
    return request({
      url: '/etax/authorisedRepresentativeManagement/submit/agreementInfo',
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  }

  //授权驳回
  export const denied = (data) => {
    return request({
      url: '/etax/euroEnProxy/denied',
      data,
      method: 'post',
    })
  }

  //授权驳回原因
  export const deniedList = (data) => {
    return request({
      url: '/etax/refuse/list',
      data,
      method: 'post',
    })
  }

  //获取欧代服务商
  export const showProvider = (data) => {
    return request({
      url: '/etax/euroEnProxy/search/provider',
      data,
      method: 'post',
    })
  }

  //根据服务商展示录入信息
  export const euroEnProxyNews = (data) => {
    return request({
      url: '/etax/euroEnProxy/search/id',
      data,
      method: 'post',
    })
  }