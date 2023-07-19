import request from "@/libs/request";

//初审统计列表
export const getInitialAuditEfficiencyListApi = (params) => {
  return request({
    url: "/workorder/workOrderInitialAuditEfficiency/list",
    params,
    method: "get",
  });
};

//初审统计数量汇总
export const getInitialAuditEfficiencyCountStatisticsApi = (params) => {
  return request({
    url: "/workorder/workOrderInitialAuditEfficiency/countStatistics",
    params,
    method: "get",
  });
};

//OA统计列表
export const getOaStatisticsListApi = (params) => {
  return request({
    url: "/workorder/workOrderOaStatistics/list",
    params,
    method: "get",
  });
};

//OA统计数量汇总
export const getOaCountStatisticsApi = (params) => {
  return request({
    url: "/workorder/workOrderOaStatistics/countStatistics",
    params,
    method: "get",
  });
};

//律师审核统计列表
export const lawyerAuditListApi = (params) => {
  return request({
    url: "/workorder/workOrderMaterialDownloadOperateRecord/list",
    params,
    method: "get",
  });
};

//律师审核统计
export const lawyerAuditStaticsApi = (params) => {
  return request({
    url: "/workorder/workOrderMaterialDownloadOperateRecord/countStatistics",
    params,
    method: "get",
  });
};

//获取部门和员工
export const getAllUserAndDepartmentApi = (params) => {
  return request({
    url: "/workorder/management/UserDepartment/getAllUserAndDepartment",
    params,
    method: "get",
  });
};

//获取部门
export const getDepartmentAll = (data) => {
  return request({
    url: "/base/xcloudOrgDepartment/all",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};
//获取员工
export const getEmployees = (params) => {
  return request({
    url: "/base/department/selected/users",
    params,
    method: "get",
  });
};
