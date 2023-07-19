import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from './_util';

const dataSourceList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 4; index++) {
    result.push({
      id: index + 1,
      name: `数据源${index}`,
      createTime: '@datetime',
      remark: '@cword(10,20)',
    });
  }
  return result;
})();

const dataTypeList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 4; index++) {
    result.push({
      id: index + 1,
      name: `数据类型${index}`,
      createTime: '@datetime',
      remark: '@cword(10,20)',
    });
  }
  return result;
})();

const contentList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 20; index++) {
    result.push({
      id: `${index}`,
      source: ['数据源1', '数据源2', '数据源3'][index % 3],
      type: ['政策与法规', '新闻资讯'][index % 2],
      title: '@cword(10,20)',
      createTime: '@datetime',
      tags: (() => {
        const children: any[] = [];
        for (let j = 0; j < 4; j++) {
          children.push('@cword(2,5)');
        }
        return children;
      })(),
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/subscribe/getDataSourceList',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(dataSourceList);
    },
  },
  {
    url: '/basic-api/subscribe/getDataTypeList',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(dataTypeList);
    },
  },
  {
    url: '/basic-api/subscribe/getContentList',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(contentList);
    },
  },
] as MockMethod[];
