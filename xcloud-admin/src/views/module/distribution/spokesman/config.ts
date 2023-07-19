import type { TableColumnsType } from 'ant-design-vue';
import { ref } from 'vue';
export const columns: TableColumnsType = [
  {
    title: '代言人ID',
    dataIndex: 'userMobile',
    width: 150,
  },
  {
    title: '加入时间',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '一级代理人(人数)',
    dataIndex: 'oneLevel',
    width: 200,
  },
  {
    title: '二级代理人(人数)',
    dataIndex: 'twoLevel',
    width: 200,
  },
  {
    title: '分销总额(元)',
    dataIndex: 'drpMoney',
    width: 120,
  },
  {
    title: '分销单量(单)',
    dataIndex: 'drpNumber',
    width: 120,
  },
  {
    title: '佣金金额(元)',
    dataIndex: 'commissionMoney',
    width: 120,
  },
  {
    title: '已结算总额(元)',
    dataIndex: 'settledMoney',
    width: 120,
  },
  {
    title: '佣金余额(元)',
    dataIndex: 'balanceMoney',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 180,
  },
];

export const columns1: TableColumnsType = [
  {
    title: '代理人ID',
    dataIndex: 'userMobile',
    width: 150,
  },
  {
    title: '加入时间',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '下级人数',
    dataIndex: 'oneLevel',
    width: 200,
  },
  {
    title: '分销总额(元)',
    dataIndex: 'drpMoney',
    width: 120,
  },
  {
    title: '分销单量(单)',
    dataIndex: 'drpNumber',
    width: 120,
  },
  {
    title: '佣金金额(元)',
    dataIndex: 'commissionMoney',
    width: 120,
  },
  {
    title: '已结算总额(元)',
    dataIndex: 'settledMoney',
    width: 120,
  },
  {
    title: '佣金余额(元)',
    dataIndex: 'balanceMoney',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 280,
  },
];

export const columnsSpokesman: TableColumnsType = [
  {
    title: '代理人ID',
    dataIndex: 'userMobile',
    width: 150,
  },
  {
    title: '加入时间',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '一级代理人(人数)',
    dataIndex: 'oneLevel',
    width: 200,
  },
  {
    title: '二级代理人(人数)',
    dataIndex: 'twoLevel',
    width: 200,
  },
  {
    title: '分销总额(元)',
    dataIndex: 'drpMoney',
    width: 120,
  },
  {
    title: '分销单量(单)',
    dataIndex: 'drpNumber',
    width: 120,
  },
  {
    title: '佣金金额(元)',
    dataIndex: 'commissionMoney',
    width: 120,
  },
  {
    title: '已结算总额(元)',
    dataIndex: 'settledMoney',
    width: 120,
  },
  {
    title: '佣金余额(元)',
    dataIndex: 'balanceMoney',
    width: 120,
  },
];

export const columnsAgent: TableColumnsType = [
  {
    title: '代理人ID',
    dataIndex: 'userMobile',
    width: 150,
  },
  {
    title: '加入时间',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '下级人数',
    dataIndex: 'oneLevel',
    width: 200,
  },
  {
    title: '分销总额(元)',
    dataIndex: 'drpMoney',
    width: 120,
  },
  {
    title: '分销单量(单)',
    dataIndex: 'drpNumber',
    width: 120,
  },
  {
    title: '佣金金额(元)',
    dataIndex: 'commissionMoney',
    width: 120,
  },
  {
    title: '已结算总额(元)',
    dataIndex: 'settledMoney',
    width: 120,
  },
  {
    title: '佣金余额(元)',
    dataIndex: 'balanceMoney',
    width: 120,
  },
];

export const rule: any = ref([
  {
    title: '用户手机号',
    field: 'userMobile',
    type: 'input',
  },
]);