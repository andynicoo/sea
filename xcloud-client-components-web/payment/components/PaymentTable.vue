<template>
  <div class="paymenttable">
    <a-table :columns="columns" :data-source="serviceList" :rowKey="(record, index) => index" :pagination="false">
      <template slot="productName" slot-scope="text, record">
        {{ record.productName }}
        <span class="refund-type" v-if="orderType === 'EXCHANGE'">退换货</span>
      </template>
      <span slot="productPaymentMoney" slot-scope="text, record">
        {{ text }}/<span v-if="record.unit === 1">年</span>
        <span v-else-if="record.unit === 2">个</span>
        <span v-else-if="record.unit === 3">次</span>
        <span v-else-if="record.unit === 4">类</span>
        <span v-else>个</span>
        <!-- {{ record }} -->
      </span>
      <template slot="specName" slot-scope="text, record">
        {{ record.specsNameList.join(';') }}
      </template>
      <template slot="unit" slot-scope="text, record">
        ￥{{ util.toDecimalRound(Number(record.productPaymentMoney) * Number(record.quantity)) }}
      </template>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '序号',
    width: 70,
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
    scopedSlots: { customRender: 'productName' },
  },
  {
    title: '服务项目',
    dataIndex: 'specName',
    key: 'specName',
    scopedSlots: { customRender: 'specName' },
  },
  {
    title: '国家',
    dataIndex: 'countryName',
    key: 'countryName',
    width: 80,
  },
  {
    title: '公司名称',
    dataIndex: 'serviceCompanyName',
    key: 'serviceCompanyName',
  },
  {
    title: '商品售价',
    dataIndex: 'productPaymentMoney',
    key: 'productPaymentMoney',
    scopedSlots: { customRender: 'productPaymentMoney' },
    align: 'right',
    width: 120,
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 80,
    align: 'right',
  },
  {
    title: '小计',
    dataIndex: 'unit',
    key: 'unit',
    scopedSlots: { customRender: 'unit' },
    align: 'right',
    width: 120,
  },
];
export default {
  data() {
    return {
      columns,
      util: this.$util,
    };
  },
  props: {
    serviceList: {
      type: Array,
      default: () => [],
    },
    orderType: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="less" scoped>
.paymenttable {
}
</style>
