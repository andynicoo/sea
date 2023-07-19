import request from "@/utils/request";

/**
 *根据id广告查询
 */
export function advertisementGetById(params) {
  return request({
    url: "/information/client/ad/getAdByAdPositionKey",
    method: "get",
    params,
  });
}
