import axios from '@/utils/axios';

//订单销售数据统计
export const getOrderSalesStatistics = (data: any) => {
  return axios({
    url: '/xxjob/management/channel/channelStatis ',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//获取渠道公司二级联动
export const getChannelUserAll = () => {
  return axios({
    url: '/xxjob/management/channel/userAll',
    method: 'post',
  });
};
