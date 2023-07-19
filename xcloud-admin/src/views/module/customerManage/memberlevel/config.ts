import type { TableColumnsType } from 'ant-design-vue';

export const columns: TableColumnsType = [
  {
    title: '等级级别',
    dataIndex: 'key',
    width: 150,
  },
  {
    title: '等级名称',
    dataIndex: 'value',
    width: 150,
  },
  {
    title: '等级icon',
    dataIndex: 'min',
    width: 200,
  },
  {
    title: '级别鉴定',
    dataIndex: 'max',
    width: 200,
  },
  {
    title: '等级折扣',
    dataIndex: 'zk',
    width: 120,
  },
];
