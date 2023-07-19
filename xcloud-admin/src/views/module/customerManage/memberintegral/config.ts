import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { ref } from 'vue';
// import type { FormItem } from '@/types/member';

// 不能将类型“FormItem[]”分配给类型“never[]”
export const rule: any = ref([
  {
    title: '手机号',
    field: 'userMobile',
    type: 'input',
  },
  {
    title: '选择时间',
    field: 'createTimeQuery',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs().startOf('day'), dayjs().endOf('day')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      showTime: true,
    },
  },
  {
    title: '收入/支出',
    field: 'changeType',
    type: 'select',
    options: [
      {
        value: null,
        label: '全部',
      },
      {
        value: 1,
        label: '收入',
      },
      {
        value: 2,
        label: '支出',
      },
      {
        value: 3,
        label: '退回',
      },
    ],
  },
]);

export const columns: TableColumnsType = [
  {
    title: '会员手机号',
    dataIndex: 'userMobile',
    width: 150,
  },
  {
    title: '收入/支出/退回',
    dataIndex: 'changeType',
    width: 150,
  },
  {
    title: '剩余积分',
    dataIndex: 'afterIntegral',
    width: 150,
  },
  {
    title: '时间',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: '详细说明',
    dataIndex: 'remark',
    width: 200,
  },
  {
    title: '操作员',
    dataIndex: 'updateBy',
    width: 120,
  },
];
