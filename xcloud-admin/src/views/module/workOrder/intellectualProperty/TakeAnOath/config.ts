import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';

export const rule: any = ref([
  {
    title: '服务号',
    field: 'serviceNo',
    type: 'input',
  },
  {
    title: '订单号',
    field: 'userMobile',
    type: 'input',
  },
  {
    title: '手机号',
    field: 'companyName',
    type: 'input',
  },
  {
    title: '服务状态',
    field: 'servicesStatus',
    type: 'select',
    options: [
      {
        value: 1,
        label: '服务中',
      },
      {
        value: 9,
        label: '已取消',
      },
      {
        value: 10,
        label: '封存',
      },
      {
        value: 11,
        label: '取消中',
      },
    ],
  },
  {
    title: '服务生成时间',
    field: 'createTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '商标',
    dataIndex: 'trademarkInfo',
    width: 250,
    fixed: true,
  },
  {
    title: '国家',
    dataIndex: 'countryNameZh',
    width: 120,
  },
  {
    title: '服务进度',
    dataIndex: 'serviceProgressStr',
    width: 120,
  },
  {
    title: '服务状态',
    dataIndex: 'serviceStatusStr',
    width: 120,
  },
  {
    title: '处理人',
    dataIndex: 'handleInfo',
    width: 150,
  },
  {
    title: '服务生成时间',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 80,
    fixed: 'right',
  },
]);
