import request from "@/utils/request";

// 客户端获取消息条数
export const stationLetterCount = (params) => {
  return request({
    url: "/information/client/announcement/count",
    params,
    method: "get",
  });
};

// 获取分页数据
export const stationLetterList = (params) => {
  return request({
    url: "/information/client/announcement/page",
    params,
    method: "get",
    // headers: {
    //     'Content-Type': 'application/json;charset=UTF-8'
    //   }
  });
};

// 客户端查看详情
export const stationLetterDetail = (id) => {
  return request({
    url: `/information/client/announcement/item/${id}`,
    method: "get",
  });
};
