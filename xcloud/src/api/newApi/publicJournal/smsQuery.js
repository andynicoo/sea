import request from '@/libs/request';

//短信查询列表
export const smsList = (data) => {
  return request({
    url: '/msg/management/messageSendRecord/page/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
