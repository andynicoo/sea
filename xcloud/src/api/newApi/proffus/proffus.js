import request from "@/libs/request";
/**
 * 后台-录入证据服务列表
 * @param data
 */
export const evidencelistApi = (data) => {
  return request({
    url: "/workorder/management/trademark/workorder/evidence/pagelist",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};

/**
 * 查询制作套餐列表
 * @param data
 */
export const evidenceComboListApi = (params) => {
  return request({
    url: "/workorder/management/trademark/workorder/evidence/evidenceComboList",
    params,
    method: "get",
  });
};

/**
 * 获得详情
 * @param data
 */
export const evidenceDetailApi = (data) => {
  return request({
    url: "/workorder/management/trademark/workorder/evidence/detail",
    data,
    method: "post",
  });
};

/**
 * 后台-39录入证据服务列表
 * @param data
 */
export const evidenceUpdate = (data) => {
  return request({
    url: "/workorder/management/trademark/workorder/evidence/evidenceUpdate",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};

/**
 * 后台-录入证据服务列表
 * @param data
 */
export const submitEvidencelistApi = (data) => {
  return request({
    url: "/workorder/management/trademark/workorder/evidence/updateNode",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};

/**
 * 修改美标使用证据套餐或备注
 * @param data
 */
export const updateEvidenceApi = (data) => {
  return request({
    url: "/workorder/management/trademark/workorder/evidence/updateEvidenceCombo",
    data,
    method: "post",
  });
};
