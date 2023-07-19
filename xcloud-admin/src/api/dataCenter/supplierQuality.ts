import axios from '@/utils/axios';

// 供应商质量-列表
export const getListPage = (data: any) => {
  return axios({
    url: '/workorder/management/supplierQuality/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
