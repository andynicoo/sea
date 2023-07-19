import request from '@/utils/request'

/**
 * 账号列表
 */
export const accountList = (data) => {
  return request({
    url: 'work_client/customer/customer_list',
    data,
    method: 'get'
  })
}
/**
 * 账号新增
 */
export const accountAdd = (data) => {
  return request({
    url: 'work_client/customer/customer_add',
    data,
    method: 'post'
  })
}
// /**
//  * 用户名修改
//  */
// export const accountEditName = (data) => {
//   return request({
//     url: 'work_client/customer/edit',
//     data,
//     method: 'post'
//   })
// }
// /**
//  * 用户公司修改
//  */
// export const accountEditCompany = (data) => {
//   return request({
//     url: 'work_client/customer/customer_name_edit',
//     data,
//     method: 'post'
//   })
// }
/**
 * 用户公司修改整合
 */
export const accountEditAll = (data) => {
  return request({
    url: 'work_client/customer/customer_name_edit',
    data,
    method: 'post'
  })
}
/**
 * 账号删除
 */
export const accountDel = (data) => {
  return request({
    url: 'work_client/customer/del',
    data,
    method: 'post'
  })
}

// 获取专属客户经理
export const getEmployeeCode = () => {
  return request({
    url: `custuser/client/user/get/emp/qrCode`,
    method: 'get',
  })
}

// 获取广告
export const getAdByCode = (params) => {
  return request({
    url: "information/client/ad/getAdByAdPositionKey",
    params,
    methods: "get",
  })
}

export const stationLetterList = (params) => {
  return request({
    url: "/information/client/announcement/page",
    params,
    method: "get",
    // headers: {
    //     'Content-Type': 'application/json;charset=UTF-8'
    //   }
  });
};

// 获取网站信息 客服二维码等
export const getWebsitInfo = (params) => {
  return request({
    url: "/custuser/enterprise/getEnterpriseInfo",
    params,
    methods: "get",
  })
}