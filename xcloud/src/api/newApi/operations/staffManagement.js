import request from "@/libs/request";

/**
 * 员工管理-列表
 * @param {*} params
 * @returns
 */
export function getList(params) {
  return request({
    url: "/custuser/management/enterprise/list",
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
}
