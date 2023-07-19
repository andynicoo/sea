import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
// import type { FormItem } from '@/types/member';
import { ref } from 'vue';

// 不能将类型“FormItem[]”分配给类型“never[]”
export const rule: any = ref([
  {
    title: '会员手机号',
    field: 'userMobile',
    type: 'input',
  },
  {
    title: '收货人',
    field: 'name',
    type: 'input',
  },
  {
    title: '收货人联系方式',
    field: 'mobile',
    type: 'input',
  },
]);

export const columns: TableColumnsType = [
  {
    title: '会员手机号',
    dataIndex: 'userMobile',
    width: 150,
  },
  {
    title: '收货人',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '收货人联系方式',
    dataIndex: 'mobile',
    width: 150,
  },
  {
    title: '收货地址',
    dataIndex: 'province',
    width: 250,
  },
  {
    title: '默认地址',
    dataIndex: 'defaultFlag',
    width: 150,
  },
  {
    title: '邮政编码',
    dataIndex: 'postalCode',
    width: 200,
  },
];
