import axios from '@/utils/axios';

// 报表-列表
export const getListPage = (data: any) => {
  return axios({
    url: '/xxjob/management/sqlTask/pages',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 新增
export const addPush = (data: any) => {
  return axios({
    url: '/xxjob/management/sqlTask/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 编辑
export const editConfig = (data: any) => {
  return axios({
    url: '/xxjob/management/sqlTask/submitSql',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 推送记录-导出
export const pushRecordExport = (data: any) => {
  return axios({
    url: '/xxjob/management/sqlTaskDownloadLog/downloadSqlTaskById',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    }
  });
};

// 推送
export const pushRecord = (data: any) => {
  return axios({
    url: '/xxjob/management/sqlTask/dataPush',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//下载文件记录
export const fileDownloadRecord = (data: any) => {
  return axios({
    url: '/xxjob/management/sqlTaskDownloadLog/pages',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
