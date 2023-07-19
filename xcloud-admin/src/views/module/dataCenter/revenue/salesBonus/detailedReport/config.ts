import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';

export const rule: any = ref([
  {
    title: '姓名',
    field: 'name',
    type: 'input',
    style: {
      width: '251px',
    },
  },
  {
    title: '工号',
    field: 'badgeNumber',
    type: 'input',
    style: {
      width: '251px',
    },
  },
  {
    title: '部门',
    field: 'teamTypeList',
    type: 'select',
    options: [
      { label: '首购', value: '首购' },
      { label: '复购', value: '复购' },
    ],
    props: {
      mode: 'multiple',
    },
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '编号',
    dataIndex: 'index',
    width: 80,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '工号',
    dataIndex: 'badgeNumber',
    width: 120,
  },
  {
    title: '部门',
    dataIndex: 'teamType',
    width: 120,
  },
  {
    title: '排名',
    dataIndex: 'ranking',
    width: 120,
  },
  {
    title: '不翻倍部分实际业绩',
    dataIndex: 'notDoublePracticalPerformance',
    width: 160,
  },
  {
    title: '不翻倍部分订单数量',
    dataIndex: 'notDoublePracticalOrderQuantity',
    width: 160,
  },
  {
    title: '翻倍部分实际业绩',
    dataIndex: 'doublePracticalPerformance',
    width: 160,
  },
  {
    title: '翻倍部分订单数量',
    dataIndex: 'doublePracticalOrderQuantity',
    width: 160,
  },
  {
    title: '不翻倍部分个人业绩',
    dataIndex: 'notDoublePersonagePerformance',
    width: 160,
  },
  {
    title: '翻倍部分个人业绩',
    dataIndex: 'doublePersonagePerformance',
    width: 170,
  },
  {
    title: '个人业绩合计',
    dataIndex: 'personalAchievement',
    width: 160,
  },
  {
    title: '所得奖金',
    dataIndex: 'bonus',
    width: 150,
  },
]);
