import request from "@/libs/request";

/**
 * 获取部门列表
 */
 export function getDepartmentAll(data) {
  return request({
    url: "/base/xcloudOrgDepartment/all",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}

/**
 * 获取部门树级列表
 */
 export function getDepartmentTree(data) {
  return request({
    url: "/base/xcloudOrgDepartment/all/tree",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}

/**
 * 获取上级部门列表
 */
 export function getParentDepartmentList(data) {
  return request({
    url: "/base/xcloudOrgDepartment/parentList",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
}

/**
 * 获取分页部门列表
 */
 export function getDepartmentList(data) {
  return request({
    url: "/base/xcloudOrgDepartment/pageList",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}

/**
 * 新增部门
 */
 export function addDepartment(data) {
  return request({
    url: "/base/xcloudOrgDepartment/insert",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}

/**
 * 编辑部门
 */
 export function updateDepartment(data) {
  return request({
    url: "/base/xcloudOrgDepartment/update",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}

/**
 * 禁用部门
 */
 export function disabledDepartment(data) {
  return request({
    url: "/base/xcloudOrgDepartment/status",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
}

/**
 * 删除部门
 */
 export function delDepartment(data) {
  return request({
    url: "/base/xcloudOrgDepartment/delete",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
}