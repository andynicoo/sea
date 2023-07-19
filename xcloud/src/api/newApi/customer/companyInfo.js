import request from "@/libs/request";

/**
 * 公司信息列表
 */
 export const getUserCompanyMaterialList = params => {
    return request({
      url: "/workorder/management/userCompanyMaterial/page",
      params,
      method: "GET"
    });
  };

/**
 * 公司信息详情
 */
 export const getUserCompanyMaterialInfo = id => {
    return request({
      url: "/workorder/management/userCompanyMaterial/getDetail/" + id,
      method: "GET"
    });
  };

/**
 * 新增公司信息
 */
 export const addUserCompanyMaterial = data => {
    return request({
      url: "/workorder/management/userCompanyMaterial/save",
      data,
      method: "post",
      headers: {
        "Content-Type": "application/json"
      }
    });
  };

/**
 * 修改公司信息
 */
 export const updateUserCompanyMaterial = data => {
    return request({
      url: "/workorder/management/userCompanyMaterial/update",
      data,
      method: "post",
      headers: {
        "Content-Type": "application/json"
      }
    });
  };

/**
 * 获取国家列表
 */
 export const getWorldCountryListByLevel = params => {
    return request({
      url: "/workorder/management/worldCountry/listByLevel",
      params,
      method: "GET"
    });
  };

/**
 * 获取省市列表
 */
 export const getWorldCountryListByPid = params => {
    return request({
      url: "/workorder/management/worldCountry/listByPid",
      params,
      method: "GET"
    });
};

/**
 * 获取客户
 */
 export const getUserList = data => {
    return request({
      url: "/custuser/management/user/list",
      data,
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    });
};

/**
 * 获取公司所在地区列表
 */
 export const getRegionList = params => {
    return request({
      url: "/workorder/vat/deRegion",
      params,
      method: "get"
    });
};

/**
 * 验证公司是否存在
 */
 export const validateCompany = params => {
  return request({
    url: "/workorder/management/userCompanyMaterial/volidateCompany",
    params,
    method: "get"
  });
};