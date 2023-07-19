<template>
  <div>
    <DataTable
      ref="dataTable"
      :columns="columns"
      :methodName="getOrderList"
      :mainTable="false"
      scrollY="calc(100vh - 370px)"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'details'">
          {{ record.details }}
        </template>
      </template>
      <template #summary>
        <a-table-summary-cell :index="0" :col-span="5">合计</a-table-summary-cell>
        <a-table-summary-cell> {{ orderPaymentMoneySum }} </a-table-summary-cell>
        <a-table-summary-cell> </a-table-summary-cell>
        <a-table-summary-cell> {{ orderPaidMoneySum }} </a-table-summary-cell>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';

import DataTable from '@/components/page/DataTable.vue';
import { getOrderList, getOrderCount } from '@/api/customerManage/customerCenter';
import router from '@/router';
import { getEnterpriseSelect } from '@/api/base/basicsData';

const columns = ref([
  {
    title: '订单号',
    dataIndex: 'orderNo',
    width: 120,
  },
  {
    title: '主体',
    dataIndex: 'enterpriseName',
    width: 120,
  },
  {
    title: '跟进人',
    dataIndex: 'attributionName',
    width: 120,
  },
  {
    title: '订单来源',
    dataIndex: 'orderSource',
    width: 120,
  },
  {
    title: '订单状态',
    dataIndex: 'orderStatus',
    width: 120,
  },
  {
    title: '应付金额',
    dataIndex: 'orderPaymentMoney',
    width: 120,
  },
  {
    title: '优惠金额',
    dataIndex: 'discountMoney',
    width: 120,
  },
  {
    title: '实付金额',
    dataIndex: 'orderPaidMoney',
    width: 120,
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
    width: 160,
  },
]);

onMounted(() => {
  getList([-1]);
  getOrderCountFn();
});

type orderMoney = number | string;
// 实付金额
const orderPaidMoneySum: Ref<orderMoney> = ref('--');
// 应付金额
const orderPaymentMoneySum: Ref<orderMoney> = ref('--');

// 获取表格统计信息
const getOrderCountFn = () => {
  getOrderCount({ enterpriseIdList: [-1], userMobile: router.currentRoute.value.query.mobile }).then((res: any) => {
    orderPaidMoneySum.value = res.orderPaidMoneySum;
    orderPaymentMoneySum.value = res.orderPaymentMoneySum;
  });
};

//获取列表
const dataTable: Ref = ref(null);
const getList = (idList: Array<number>) => {
  dataTable.value.getList({
    userMobile: router.currentRoute.value.query.mobile,
    enterpriseIdList: idList,
  });
};
</script>

<style scoped lang="less"></style>
