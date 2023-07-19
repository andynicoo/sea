import type { TableColumnsType } from 'ant-design-vue';

export const columns: TableColumnsType = [
  {
    title: '代言人分佣比例',
    dataIndex: 'spokesmanPercentage',
  },
  {
    title: '代理人分佣比例',
    dataIndex: 'agentPercentage',
  },
  {
    title: '当前状态',
    dataIndex: 'status',
  },
  {
    title: '使用范围（优先按照商品分类的比例计算佣金）',
    dataIndex: 'productCategoryName',
  },
  {
    title: '操作',
    dataIndex: 'operation',
  },
];
