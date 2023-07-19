import request from "@/libs/request";

/**
 * 查询流程对应的所有模块和字段列表
 */
export const findModuleFields = data => {
  return request({
    url: "/workorder/management/workFlowColumnRelation/findAllWorkflowColumns",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};
/**
 * 查询流程对应的已配置过的模块和字段列表
 */
export const findTemplateFields = data => {
  return request({
    url: "/workorder/management/workFlowColumnRelation/findWorkflowColumns",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/**
 * 查询流程的国家，服务商，分类信息
 */
export const getProcessInfo = params => {
  return request({
    url: "/workorder/management/serviceWorkflow/getWorkFlowAttr",
    method: "get",
    params
  });
};

/**
 * 保存或者新增节点对应的字段模板
 */
export const saveOrUpdateTemplate = data => {
  return request({
    url: "/workorder/management/workFlowColumnRelation/saveOrUpdate",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};
