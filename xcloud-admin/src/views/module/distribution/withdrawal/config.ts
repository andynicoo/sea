import type { TableColumnsType } from 'ant-design-vue';

export const columns: TableColumnsType = [
  {
    title: '提现金额',
    dataIndex: 'withdrawMoney',
    width: 150,
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '银行卡账号',
    dataIndex: 'bankAccount',
    width: 200,
  },
  {
    title: '开户姓名',
    dataIndex: 'bankAccountName',
    width: 200,
  },
 
];
