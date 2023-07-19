import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import { getCountrySelectList } from '@/api/base/basicsData';
import dayjs from 'dayjs';

export const rule: any = ref([
  {
    title: '服务号',
    field: 'serviceNo',
    type: 'input',
  },
  {
    title: '手机号',
    field: 'userMobile',
    type: 'input',
  },
  {
    title: '申请人',
    field: 'companyName',
    type: 'input',
  },
  {
    title: '商标名称',
    field: 'trademarkNameEn',
    type: 'input',
  },
  {
    title: '服务名称',
    field: 'serviceName',
    type: 'input',
  },
  {
    title: '国家',
    field: 'countryCode',
    type: 'select',
    options: async () => {
      return ((await getCountrySelectList()) as any).map((v: { countryCode: string; countryNameZh: string }) => {
        return {
          value: v.countryCode,
          label: v.countryNameZh,
        };
      });
    },
  },
  {
    title: '订单编号',
    field: 'orderNo',
    type: 'input',
  },
  {
    title: '受理号',
    field: 'acceptNum',
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
    title: '创建时间',
    field: 'createTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '修改时间',
    field: 'updateTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '受理日期',
    field: 'acceptTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '客户截止时间',
    field: 'customerExpiryTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '官方要求答复时间',
    field: 'officialExpirationDateTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '发送注册资料',
    field: 'flagCustomerData',
    type: 'select',
    options: [
      {
        value: true,
        label: '是',
      },
      {
        value: false,
        label: '否',
      },
    ],
  },
  {
    title: '客户发送邮件状态',
    field: 'emailSend',
    type: 'select',
    options: [
      {
        value: true,
        label: '是',
      },
      {
        value: false,
        label: '否',
      },
    ],
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
    width: 90,
  },
  {
    title: '申请人',
    dataIndex: 'applyName',
    width: 120,
  },
  {
    title: '注册进度',
    dataIndex: 'serviceProgressStr',
    width: 120,
  },
  {
    title: '服务状态',
    dataIndex: 'serviceStatusStr',
    width: 90,
  },
  {
    title: '受理号/日期',
    dataIndex: 'acceptInfo',
    width: 190,
  },
  {
    title: '修改时间',
    dataIndex: 'updateTime',
    width: 150,
  },
  {
    title: '客户截止时间',
    dataIndex: 'lastDealDate',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '处理人',
    dataIndex: 'handleInfo',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 70,
    fixed: 'right',
  },
]);
