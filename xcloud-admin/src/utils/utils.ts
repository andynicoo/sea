import { computed } from 'vue';
import { message } from 'ant-design-vue';
import { useStore } from '@/stores/store';
import type { IactionRecord } from '@/types';
import router from '@/router';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

//判断页面按钮权限
export function useButton(str: string) {
  const routerPath = router.currentRoute.value.path || '';
  const MenuPath = useStore().menuData.record.path || '';
  if (routerPath.substring(routerPath.length - 20) === MenuPath.substring(MenuPath.length - 20)) {
    const actionList = computed<Array<IactionRecord>>(() => useStore().menuData.record.actionList || []);
    const authorityArr = actionList.value.map((v: IactionRecord) => v.actionCode) || [];
    return authorityArr.indexOf(str) !== -1;
  } else {
    const actionList = computed<Array<IactionRecord>>(() => useStore().authoritiesList || []);
    const authorityArr = actionList.value.map((v: IactionRecord) => v.authority) || [];
    return authorityArr.indexOf('ACTION_' + str) !== -1;
  }
}

//导出文件
export const downloadFile = (resBlob: Blob, fileName: string) => {
  const blob = new Blob([resBlob], { type: 'application/vnd.ms-excel' });
  const elink = document.createElement('a');
  elink.download = fileName;
  elink.style.display = 'none';
  elink.href = URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href);
  document.body.removeChild(elink);
};

//复制文本
export const textCopy = (str: string) => {
  const textarea = document.createElement('textarea');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  textarea.value = str;
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  const result = document.execCommand('Copy');
  if (result) {
    message.success('已复制到剪切板');
    textarea.remove();
  }
};

// 搜索时间格式处理 [s,e]==> s1,e1
export const handleTime = (time: string[], isStartTime: boolean) => {
  let resultTime = '';
  isStartTime ? (time && time.length ? (resultTime = time[0]) : '') : time && time.length ? (resultTime = time[1]) : '';

  return resultTime;
};

//跳转页面(非菜单配置的详情页，兼容微服务)
export const jumpPage = (path: string) => {
  if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    window.history.pushState('', '', '/adminNewApp' + path);
  } else {
    router.push(path);
  }
};

//返回时间段内所有日期 （YYYY-MM-DD）格式
export const betweenDay = (startDate: string, endDate: string) => {
  const dateList = [];
  const startTime = new Date(startDate);
  const endTime = new Date(endDate);
  while (endTime.getTime() - startTime.getTime() >= 0) {
    const year = startTime.getFullYear();
    const month = startTime.getMonth() + 1 < 10 ? '0' + (startTime.getMonth() + 1) : startTime.getMonth() + 1;
    const day = startTime.getDate().toString().length == 1 ? '0' + startTime.getDate() : startTime.getDate();
    dateList.push(year + '-' + month + '-' + day);
    startTime.setDate(startTime.getDate() + 1);
  }
  return dateList;
};

// 秒转换成day、hour、minutes、seconds
export const formatSecond = (second: number) => {
  const days = Math.floor(second / 86400);
  const hours = Math.floor((second % 86400) / 3600);
  const minutes = Math.floor(((second % 86400) % 3600) / 60);
  const seconds = Math.floor(((second % 86400) % 3600) % 60);
  const forMatDate = {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
  return forMatDate;
};

// 截取字符串
export const stringSlice = (value: string | undefined, length: number) => {
  value === undefined || value === null ? (value = '') : '';
  value.length > length ? (value = value.slice(0, length) + '...') : value;
  return value;
};
