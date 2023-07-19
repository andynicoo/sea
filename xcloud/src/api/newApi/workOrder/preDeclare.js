import request from '@/libs/request';

/**
 * EPR查询列表页
 * @param {*} params 参数，
 */
export function getPreDeclareListAPI(data) {
  return request({
    url: '/workorder/management/vat/pre/epr/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * EPR查询详情
 * @param {*} params 参数，
 */
export function getPreDeclareDetailAPI(data) {
  return request({
    url: '/workorder/management/vat/pre/epr/detail',
    method: 'post',
    params: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export function submitEprDecalre(data) {
  return request({
    url: '/workorder/management/vat/pre/epr/submitDeclare',
    method: 'post',
    params: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export function submitPreDecalre(data) {
  return request({
    url: '/workorder/management/vat/pre/epr/submitPreDeclare',
    method: 'post',
    params: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * EPR上传回执
 * @param {*} params 参数，
 */
export function preDeclareupload(data) {
  return request({
    url: '/workorder/management/vat/pre/epr/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}


