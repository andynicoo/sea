import request from "@/libs/request";

/**
 * 查询所有模块列表
 */
export const findModules = params => {
  return request({
    url: "/workorder/management/serviceModule",
    params,
    method: "get"
  });
};
/**
 * 分页查询字段列表
 */
export const findFields = params => {
  return request({
    url: "/workorder/management/serviceColumns/page",
    params,
    method: "get"
  });
};
/**
 * 查询所有字段
 */
export const findAllFileds = params => {
  return request({
    url: "/workorder/management/serviceColumns",
    params,
    method: "get"
  });
};
/**
 * 根据模块id查询对应的单选类型的字段列表
 */
export const findModuleRadios = params => {
  return request({
    url: "/workorder/management/workFlowColumnRelation/listColumnRelationByAttr",
    params,
    method: "get"
  });
};
/**
 * 根据模块id查询对应的字段列表
 */
export const findFieldsByModuleId = params => {
  return request({
    url: `/workorder/management/serviceColumns/module/${params.moduleId}`,
    method: "get"
  });
};
/**
 * 查询字段详情
 */
export const getFieldDetail = params => {
  return request({
    url: `/workorder/management/serviceColumns/${params.id}`,
    method: "get"
  });
};
/**
 * 查询下拉固有选项列表
 */
export const findSelectFixeds = params => {
  return request({
    url: `/workorder/management/serviceColumns/selects`,
    method: "get"
  });
};

/**
 * 新增字段（系统）
 */
export const addFieldSystem = data => {
  return request({
    url: "/workorder/management/serviceColumns/system",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};
/**
 * 新增字段（自定义）
 */
export const addFieldCustom = data => {
  return request({
    url: "/workorder/management/serviceColumns",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/**
 * 字段修改
 */
export const updateFieldCustom = data => {
  return request({
    url: "/workorder/management/serviceColumns",
    data,
    method: "put",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/**
 * 字段拖拽排序
 */
export const updateFieldsSort = data => {
  return request({
    url: "/workorder/management/serviceColumns/sort",
    data,
    method: "put",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};
