import type { TableColumnsType } from 'ant-design-vue';
import { ref } from 'vue';
// import dayjs from 'dayjs';

export const rule: any = ref([
  {
    title: '来源',
    field: 'source',
    type: 'select',
    options: [
      {
        value: '',
        label: '全部',
      },
      {
        value: 'WECHAT',
        label: '微信',
      },
      {
        value: 'ALIPAY',
        label: '支付宝',
      },
    ],
  },
  {
    title: '投诉日期',
    field: 'searchTime',
    type: 'datePicker',
    props: {
      range: true,
      // defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD',
    },
  },
]);

export const columns: TableColumnsType = [
  {
    title: '序号',
    dataIndex: 'id',
    width: 70,
  },
  {
    title: '来源',
    dataIndex: 'source',
    width: 100,
  },
  {
    title: '商户主体名称',
    dataIndex: 'subjectName',
    width: 200,
  },
  {
    title: '投诉单号',
    dataIndex: 'complaintId',
    width: 250,
  },
  {
    title: '交易号',
    dataIndex: 'tradeNo',
    width: 200,
  },
  {
    title: '商户订单号',
    dataIndex: 'outTradeNo',
    width: 200,
  },
  {
    title: '投诉时间',
    dataIndex: 'complaintTime',
    width: 150,
  },
  {
    title: '投诉详情',
    dataIndex: 'complaintDetail',
    width: 250,
  },
  {
    title: '投诉单状态',
    dataIndex: 'complaintStatus',
    width: 100,
  },
  {
    title: '投诉人联系方式',
    dataIndex: 'mobile',
    width: 140,
  },
  {
    title: '问题描述',
    dataIndex: 'problemDesc',
    width: 100,
  },
  {
    title: '用户投诉次数',
    dataIndex: 'userComplaintCount',
    width: 140,
  },
  {
    title: '投诉资料列表',
    dataIndex: 'complaintList',
    width: 130,
  },
  {
    title: '销售归属人',
    dataIndex: 'attributionName',
    width: 100,
  },
  //   {
  //     title: '操作',
  //     dataIndex: 'operation',
  //     fixed: 'right',
  //     width: 150,
  //   },
];
