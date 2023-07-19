import axios from '@/utils/axios';

//oa审查意见列表
export const getListPage = (data: any) => {
  return axios({
    url: '/workorder/management/official/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

// 文件OA状态列表
export const getOaStatusList = () => {
  return axios({
    url: '/workorder/management/workOrder/oa/list/oa-status',
    method: 'get',
  });
};

// 查询OA工单详情  serviceId
export const oaWorkorderDetailAPI = (data: any) => {
  return axios({
    url: '/workorder/management/official/detail',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

//平台审核、律师审核  不通过
export const rejectMaterials = (data: any) => {
  return axios({
    url: '/workorder/management/workOrder/oa/reject/answer/materials',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};
