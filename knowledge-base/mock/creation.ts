import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from './_util';

const dataList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 8; index++) {
    result.push({
      id: index + 1,
      createTime: '@datetime',
      title: '@cword(10,20)',
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/creation/getConversationList',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(dataList);
    },
  },
] as MockMethod[];
