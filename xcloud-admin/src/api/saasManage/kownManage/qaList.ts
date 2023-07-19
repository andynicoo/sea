import axios from '@/utils/axios';

// 获取问答分类选项列表
export const getCategoryOption = () => {
  return axios({
    url: 'information/management/documentCategory/module/5',
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 获取问答列表数据
export const getqaList = (data: any) => {
  return axios({
    url: '/information/question/getPage',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 获取添加问答回答者OPTION
export const getOption = () => {
  return axios({
    url: '/information/question/queryRespondent',
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 发布问答
export const publishQa = (data: any) => {
  return axios({
    url: '/information/question/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 修改问答
export const updateQa = (data: any) => {
  return axios({
    url: '/information/question/edit',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 添加属性词
export const addAttr = (url: string, data: any) => {
  return axios({
    url,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 新增属性词
export const addnewAttr = (data: any) => {
  return axios({
    url: '/information/attributeWord/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 覆盖属性词
export const coverAttr = (url: string, data: any) => {
  return axios({
    url,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 获取问答详情
export const getDetail = (data: any) => {
  return axios({
    url: '/information/question/detail',
    method: 'get',
    params: data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 删除问答
export const deleteReport = (data: any) => {
  return axios({
    url: '/information/question/del',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 批量下载问答
export const download = (data: any) => {
  return axios({
    url: '/information/question/export',
    method: 'post',
    data,
    responseType: 'blob',
  });
};

// 批量删除问答
export const batchDel = (data: any) => {
  return axios({
    url: '/information/question/batchDel',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
