import request from "@/libs/request";
// 获取商标注册所有注册进度
export const getAllServiceProgressAPI = (data) => {
  return request({
    url: "/workorder/management/trademark/workorder/getAllServiceProgress",
    data,
    method: "post",
  });
};
/**
 * 分页获取服务列表
 */
export const getServicesList = (data) => {
  return request({
    url: "/workorder/client/trademark/workorder/pagelist",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};

/**
 * 分页获取服务数量
 */
export const getNodeCount = (data) => {
  return request({
    url: "/workorder/client/trademark/workorder/getNodeCount",
    data,
    method: "get",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};

// 查询商标工单详情
export const workorderDetailAPI = (data) => {
  return request({
    url: "/workorder/management/trademark/workorder/detail",
    data,
    method: "post",
  });
};

// 商标工单节点状态变更
export const updateNodeAPI = (data) => {
  return request({
    url: "/workorder/client/trademark/workorder/updateNode",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};

// 获取更新记录
export const getAmazonRecord = (data) => {
  return request({
    url: "/workorder/management/amazonRecordInfo/getAmazonRecord",
    data,
    params: data,
    method: "get",
  });
};
/**
 * 提交使用证据
 */
export const submitEvidence = (data) => {
  return request({
    url: '/workorder/client/trademark/workorder/submitEvidence',
    data: data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}