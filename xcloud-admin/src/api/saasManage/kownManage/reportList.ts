import axios from '@/utils/axios';

// 获取分类报告选项列表
export const getCategoryOption = () => {
  return axios({
    url: 'information/management/documentCategory/module/4',
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 获取报告列表数据
export const getReportList = (data: any) => {
  return axios({
    url: '/information/report/getPage',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 发布报告
export const publishReport = (data: any) => {
  return axios({
    url: '/information/report/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 修改报告
export const updateReport = (data: any) => {
  return axios({
    url: '/information/report/edit',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 获取模态框表格数据
export const getData = (
  url: string,
  data: {
    attributeWordName: string;
    current: number;
    labelName: string;
    size: number;
  }
) => {
  return axios({
    url,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 获取报告详情
export const getDetail = (data: any) => {
  return axios({
    url: '/information/report/detail',
    method: 'get',
    params: data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 删除报告
export const deleteReport = (data: any) => {
  return axios({
    url: '/information/report/del',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 批量下载报告
export const download = (url: string, data: any) => {
  return axios({
    url,
    method: 'post',
    data,
    responseType: 'blob',
  });
};

// 批量删除报告
export const batchDel = (data: any) => {
  return axios({
    url: '/information/report/batchDel',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
