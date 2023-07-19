import axios from '@/utils/axios';
import type * as Types from '@/types/distribution';
import type { AxiosResponse, AxiosPromise } from 'axios';

//分销人员列表
export const drpUserList = (data: any) => {
  return axios({
    url: '/order/management/drpUser/user/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//结算明细
export const productList = (data: any) => {
  return axios({
    url: '/order/management/drpUser/order/product/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 新增代理人
export const addAgent = (data: any) => {
  return axios({
    url: '/order/management/drpUser/user/agent/apply',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 解除上下级关系
export const unbindDrpUser = (data: any) => {
  return axios({
    url: '/order/management/drpUser/user/unbind',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 更新上级代言人
export const updateSpokesman = (data: any) => {
  return axios({
    url: '/order/management/drpUser/user/update/spokesman',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 提现记录
export const withdrawRecord = (data: any) => {
  return axios({
    url: '/order/management/drpUser/withdraw/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 删除配置
export const deleteConfig = (data: any) => {
  return axios({
    url: '/order/management/drpProductPercentageConfig/percentage/delete',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 配置的启用和停用
export const updateConfig = (data: any) => {
  return axios({
    url: '/order/management/drpProductPercentageConfig/percentage/status/update',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 佣金分配管理列表
export const commissionList = (data: any) => {
  return axios({
    url: '/order/management/drpProductPercentageConfig/percentage/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 新增和修改佣金比列配置
export const saveUpdate = (data: any) => {
  return axios({
    url: '/order/management/drpProductPercentageConfig/percentage/save',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 提现记录的导出
export const exportWithdraw = (data: any) => {
  return axios({
    url: '/order/management/drpUser/withdraw/export',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};

// 结算明细的导出
export const exportProduct = (data: any) => {
  return axios({
    url: '/order/management/drpUser/order/product/export',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};

// 文章、海报列表
export const drpList = (data: any) => {
  return axios({
    url: '/order/drpPosterArticle/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 文章、海报的删除
export const drpDelete = (data: any) => {
  return axios({
    url: '/order/drpPosterArticle/delete',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 文章、海报的状态更新
export const drpUpdateStatus = (data: any) => {
  return axios({
    url: '/order/drpPosterArticle/status/update',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 文章编辑新增
export const saveArticle = (data: Types.SaveArticle) => {
  return axios({
    url: '/order/drpPosterArticle/saveArticle',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 海报新增修改
export const savePoster = (data: Types.SavePoster) => {
  return axios({
    url: '/order/drpPosterArticle/savePoster',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 文章海报详情
export const drpPosterArticleDetail = (id: string) => {
  return axios.request<Types.Detail>({
    url: '/order/drpPosterArticle/detail',
    method: 'get',
    params: {
      id,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
