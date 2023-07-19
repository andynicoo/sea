import type { TableColumnsType } from 'ant-design-vue';
import { ref } from 'vue';
export const columns: TableColumnsType = [
  {
    title: '分佣者ID',
    dataIndex: 'disUserMobile',
    width: 150,
  },
  {
    title: '分佣金额',
    dataIndex: 'drpMoney',
    width: 150,
  },
  {
    title: '分享者ID',
    dataIndex: 'userMobile',
    width: 150,
  },
  {
    title: '订购商品',
    dataIndex: 'productName',
    width: 200,
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: '订单号',
    dataIndex: 'orderNo',
    width: 200,
  },
  {
    title: '分佣比例',
    dataIndex: 'drpPercentage',
    width: 120,
  },
  {
    title: '分佣状态',
    dataIndex: 'settlementStatus',
    width: 120,
  },
];

export const rule: any = ref([
  {
    title: '分佣者ID',
    field: 'disUserMobile',
    type: 'input',
  },
  {
    title: '分享者ID',
    field: 'userMobile',
    type: 'input',
  },
]);