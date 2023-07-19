import request from '@/libs/request';

// 外观专利列表
export const patentList = (params) => {
  return request({
    url: '/workorder/management/design_patent/page',
    params,
    method: 'get',
  });
};

// 外观专利详情
export const patentInfo = (id) => {
  return request({
    url: '/workorder/management/design_patent/' + id,
    method: 'get',
  });
};

// 保存外观专利资料
export const savePatent = (data) => {
  return request({
    url: '/workorder/management/design_patent/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 提交外观专利资料
export const submitPatent = (data) => {
  return request({
    url: '/workorder/management/design_patent/submit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 初步审核
export const patentPreAudit = (data) => {
  return request({
    url: '/workorder/management/design_patent/preliminary_audit',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 律师审核
export const patentAttorneyAudit = (data) => {
  return request({
    url: '/workorder/management/design_patent/attorney_audit',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 发送短信
export const patentAttorneyMessage = (id) => {
  return request({
    url: '/workorder/management/design_patent/message_notice/' + id,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 下载资料
export const patentAttorneyDownload = (id) => {
  return request({
    url: '/workorder/management/design_patent/download/' + id,
    method: 'get',
  });
};

// 上传外观专利证书
export const patentAttorneyUpload = (data) => {
  return request({
    url: '/workorder/management/design_patent/certificate',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 修改律师
export const changeAttorney = (data) => {
  return request({
    url: '/workorder/management/design_patent/batchUpdAttorney',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
