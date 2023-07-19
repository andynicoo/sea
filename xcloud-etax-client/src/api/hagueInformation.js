import request from "@/utils/request";

/**
 * 服务工单详情
 */
export function getDetail(data) {
  return request({
    url: '/workorder/client/vat/workOrder/detail',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
}

/**
 * 保存资料
 */
 export function saveInfo(data) {
  return request({
    url: '/workorder/client/taxApostille/save',
    method: 'post',
    data,
    headers: {
      "Content-Type": "application/json"
    }
  })
}

/**
 * 提交资料
 */
 export function submitInfo(data) {
  return request({
    url: '/workorder/client/taxApostille/submit',
    method: 'post',
    data,
    headers: {
      "Content-Type": "application/json"
    }
  })
}

/**
 * 用户公司列表
 */
export function getUserCompanyMaterial(params) {
  return request({
    url: '/workorder/client/userCompanyMaterial/list',
    method: 'get',
    params,
  })
}