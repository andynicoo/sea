import request from "@/libs/request";

// 客户线索列表
export function getClueList(data) {
  return request({
    url: "/data/data-customer-lead/pageList",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json"
    }
  })
}

// 客户线索导出
export function excelList(data) {
  return request({
    url: "/data/data-customer-lead/export",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    responseType: "blob"
  })
}
