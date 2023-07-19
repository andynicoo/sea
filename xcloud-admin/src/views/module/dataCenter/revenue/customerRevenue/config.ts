import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';

export const rule: any = ref([
  {
    title: '公司名称',
    field: 'companyName',
    type: 'input'
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '公司名称',
    dataIndex: 'companyName',
    width: 150,
  },
  {
    title: '商品一级分类',
    dataIndex: 'productCategoryName',
    width: 120,
  },
  {
    title: '国家',
    dataIndex: 'countryName',
    width: 100,
  },
  {
    title: '商品名称',
    dataIndex: 'productName',
    width: 180,
  },
  {
    title: '2020年',
    dataIndex: 'twenty',
    width: 120,
  },
  {
    title: '2021年',
    dataIndex: 'twentyOne',
    width: 110,
  },
  {
    title: '2022年',
    dataIndex: 'twentyTwo',
    width: 100,
  },
  {
    title: '2023年',
    dataIndex: 'twentyThree',
    width: 100,
  },
  {
    title: '总计',
    dataIndex: 'total',
    width: 100,
  },
  {
    title: '详情',
    dataIndex: 'operation',
    width: 70,
    fixed: 'right'
  },
]);

export const salesDetailColumns = ref<TableColumnsType>([
  {
    title: '销售订单号',
    dataIndex: 'orderNo',
    width: 120,
  },
  {
    title: '商品一级分类',
    dataIndex: 'productCategoryName',
    width: 120,
  },
  {
    title: '国家',
    dataIndex: 'countryName',
    width: 100,
  },
  {
    title: '所属主体',
    dataIndex: 'enterpriseName',
    width: 100,
  },
  {
    title: '商品名称',
    dataIndex: 'productName',
    width: 150,
  },
  {
    title: '商品规格名称',
    dataIndex: 'specsName',
    width: 150,
  },
  {
    title: '商品金额',
    dataIndex: 'specsMoney',
    width: 100,
  },
  {
    title: '应付金额',
    dataIndex: 'specsPaymentMoney',
    width: 100,
  },
  {
    title: '实付金额',
    dataIndex: 'specsPaidMoney',
    width: 100,
  },
  {
    title: '下单时间',
    dataIndex: 'orderCreateTime',
    width: 150,
  },
  {
    title: '付款时间',
    dataIndex: 'paymentTime',
    width: 150,
  },
  {
    title: '到账时间',
    dataIndex: 'toAccountTime',
    width: 150,
  },
  {
    title: '订单归属人',
    dataIndex: 'attributionName',
    width: 100,
  },
  {
    title: '客户手机号',
    dataIndex: 'userMobile',
    width: 120,
  },
  {
    title: '支付方式',
    dataIndex: 'payWay',
    width: 100,
  },
  {
    title: '订单来源',
    dataIndex: 'orderSource',
    width: 100,
  },
  {
    title: '付款类型',
    dataIndex: 'paymentType',
    width: 150,
  },
  {
    title: '订单类型',
    dataIndex: 'orderType',
    width: 100,
  },
  {
    title: '服务号',
    dataIndex: 'serviceNo',
    width: 180,
  },
  {
    title: '工单服务公司',
    dataIndex: 'companyName',
    width: 150,
  },
]);