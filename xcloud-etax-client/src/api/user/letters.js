import request from "@/utils/request";

/**
 * 分页获取用户信件列表
 */
export const letterList = (data) => {
  return request({
    url: "/information/client/stationLetter/page",
    data,
    method: "post",
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
/**
 * 左侧菜单信件数量 后端说了还没做，暂时先不管
 */
// export const letterCount = (data) => {
//   return request({
//     url: "/etax/letter/count",
//     data,
//     method: "post",
//   });
// };

/**
 * 用户处理信件
 */
export const dispose = (data) => {
  return request({
    // url: '/etax/letter/dispose',
    url: "/information/client/stationLetter/dispose",
    data,
    method: "post",
  });
};

/**
 * 根据id获取用户信件详情
 */
export const detail = (id) => {
  return request({
    url: `/information/client/stationLetter/item/${id}`,
    method: "get",
  });
};

/**
 * 信件模版下拉数据
 */
 export const getTemplateListApi = (params) => {
  return request({
      url: "/information/client/stationLetterTemplate/pull/list",
      method: 'get',
      params
  })
}

/**
 * 信件模版下拉数据
 */
 export const stationLetterTemplateApi = (params) => {
  return request({
      url: "/information/client/stationLetterTemplate/list",
      method: 'get',
      params
  })
}