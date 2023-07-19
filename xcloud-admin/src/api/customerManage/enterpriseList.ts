import axios from '@/utils/axios';

//根据编码查询 企业所在省份
export const getRegionList = () => {
  return axios({
    url: '/relationshipmap/region/list',
    method: 'get',
  });
};

// 查询下来选项
export const getDictList = (params: { code: string }) => {
  return axios({
    url: '/relationshipmap/dict/list',
    method: 'get',
    params,
  });
};

//查询企业统计
export const selectCompanyNameStatistics = (data: any) => {
  return axios({
    url: '/relationshipmap/datanode/management/company/selectCompanyNameStatistics',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//查询企业列表
export const selectCompanyNameList = (data: any) => {
  return axios({
    url: '/relationshipmap/datanode/management/company/selectCompanyNameList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
