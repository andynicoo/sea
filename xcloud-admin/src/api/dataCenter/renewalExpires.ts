import axios from '@/utils/axios';

//续费列表
export const getRenewalAlarmList = (data: any) => {
  return axios({
    url: '/reportserver/renewal/renewalAlarmList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 修改备注
export const updateRenewalAlarmRemark = (params: any) => {
  return axios({
    url: '/reportserver/renewal/updateRenewalAlarmRemark',
    method: 'get',
    params,
  });
};

//根据续费id编辑跟进记录
export const editFollowUpRecordById = (data: any) => {
  return axios({
    url: '/reportserver/renewal/editFollowUpRecordById',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 列表-导出
export const renewalAlarmExport = (data: any) => {
  return axios({
    url: '/reportserver/renewal/renewalAlarmExport',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};

// 获取注意事项
export const getMattersNeedingAttention = (params: any) => {
  return axios({
    url: '/reportserver/renewal/getMattersNeedingAttention',
    method: 'get',
    params,
  });
};

// 设置注意事项
export const setMattersNeedingAttention = (data: any) => {
  return axios({
    url: '/reportserver/renewal/setMattersNeedingAttention',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
