import request from "@/libs/request";
/**
 * 交付时效配置列表
 */
export const abnormalList = (data) => {
  return request({
    url: "/workorder/management/durationConfigs/abnormalList",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};
/** 导出 */
/** 导出 */
export const abnormalListExport = (data) => {
  return request({
    url: "/workorder/management/durationConfigs/abnormalList/export",
    data,
    method: "post",
    responseType: "blob",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/** 服务商 */
export const getSupplierList = (data) => {
  return request({
    url: "/workorder/management/supplierAllotRule/getSupplierList",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};


/**
 * 分页查询流程节点列表
 */
export const findProcesses = data => {
  return request({
    url: '/workorder/management/serviceWorkflow/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}