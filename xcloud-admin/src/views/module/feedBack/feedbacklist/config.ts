import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { ref } from 'vue';
// import type { FormItem } from '@/types/member';

// 不能将类型“FormItem[]”分配给类型“never[]”
export const rule: any = ref([
  {
    title: '提交用户',
    field: 'mobile',
    type: 'input',
  },
  {
    title: '提交时间',
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
    title: '功能模块',
    field: 'functionalModule',
    type: 'select',
    options: [
      {
        value: '官网',
        label: '官网',
      },
      {
        value: '产品服务',
        label: '产品服务',
      },
      {
        value: '外观专利',
        label: '外观专利',
      },
      {
        value: '工具箱',
        label: '工具箱',
      },
      {
        value: '订单管理',
        label: '订单管理',
      },
      {
        value: '账户管理',
        label: '账户管理',
      },
      {
        value: '其他',
        label: '其他',
      },
    ],
  },
  {
    title: '处理时间',
    field: 'handlingTimeQuery',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs().startOf('day'), dayjs().endOf('day')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      showTime: true,
    },
  },
]);

export const columns: TableColumnsType = [
  {
    title: '编号',
    dataIndex: 'feedbackNo',
    width: 150,
  },
  {
    title: '客户端',
    dataIndex: 'enterpriseId',
    width: 150,
  },
  {
    title: '提交用户',
    dataIndex: 'mobile',
    width: 150,
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    width: 170,
  },
  {
    title: '功能模块',
    dataIndex: 'functionalModule',
    width: 200,
  },
  {
    title: '标题',
    dataIndex: 'title',
    width: 200,
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: 200,
  },
  {
    title: '图片',
    dataIndex: 'screenshot',
    width: 200,
  },
  {
    title: '处理状态',
    dataIndex: 'status',
    width: 100,
  },
  {
    title: '处理时间',
    dataIndex: 'handlingTime',
    width: 170,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 100,
  },
];
