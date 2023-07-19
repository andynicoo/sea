import axios from '@/utils/axios';

// 获取标签列表数据
export const getTagList = (data: any) => {
  return axios({
    url: '/information/label/getPage',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 删除标签
export const deleteReport = (data: any) => {
  return axios({
    url: '/information/label/del',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 编辑标签
export const editTagName = (data: any) => {
  return axios({
    url: '/information/label/edit',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};


// 确认seo
export const setSeo = (data: any) => {
  return axios({
    url: '/information/label/editSEO',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 批量下载标签
export const download = (url: string, data: any) => {
  return axios({
    url,
    method: 'post',
    data,
    responseType: 'blob',
  });
};

// 批量删除标签
export const batchDel = (data: any) => {
  return axios({
    url: '/information/label/batchDel',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
