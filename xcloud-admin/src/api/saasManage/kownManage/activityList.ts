import axios from '@/utils/axios';


// 获取活动列表数据
export const getReportList = (data: any) => {
  return axios({
    url: '/information/activity/getPage',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 创建活动
export const publishReport = (data: any) => {
  return axios({
    url: '/information/activity/add',
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
    url: '/information/activity/edit',
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

// 获取活动详情
export const getDetail = (data: any) => {
  return axios({
    url: '/information/activity/detail',
    method: 'get',
    params: data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 删除活动
export const deleteReport = (data: any) => {
  return axios({
    url: '/information/activity/del',
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
