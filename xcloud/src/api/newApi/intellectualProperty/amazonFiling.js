import request from "@/libs/request";

// 查询亚马逊列表
export const amazonRecordListAPI = (data) => {
  return request({
    url: "/workorder/management/amazonRecordInfo/list",
    data,
    method: "post",
  });
};

// 录入验证码
export const inputFilingCodeAPI = (data) => {
  return request({
    url: "/workorder/management/amazonRecordInfo/inputVerificationCode",
    data,
    method: "post",
  });
};

// 更新验证码
export const updateFilingCodeAPI = (data) => {
  return request({
    url: "/workorder/management/amazonRecordInfo/update",
    data,
    method: "post",
  });
};

// 驳回申请
export const rejectFilingCodeAPI = (data) => {
  return request({
    url: "/workorder/management/amazonRecordInfo/rejectVerificationCode",
    data,
    method: "post",
  });
};

// 获取更新进度
export const getAmazonRecordAPI = (data) => {
  return request({
    url: "/workorder/management/amazonRecordInfo/getAmazonRecord",
    data,
    params: data,
    method: "get",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};

// 更新进度
export const setAmazonRecordAPI = (data) => {
  return request({
    url: "/workorder/management/amazonRecordInfo/updAmazonProgress",
    data,
    method: "post",
  });
};
