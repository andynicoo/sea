<template>
  <div>
    <el-table border :data="detailInfo.exchangeOrderList" :max-height="260" class="table">
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单号" prop="orderNo"> </el-table-column>
      <el-table-column align="center" label="换货商品" prop="productNames"></el-table-column>

      <el-table-column align="center" label="订单金额">
        <template slot-scope="scope"> ￥ {{ scope.row.orderMoney | formatQianFenWei }} </template>
      </el-table-column>

      <el-table-column align="center" label="应付金额" prop="orderPaymentMoney">
        <template slot-scope="scope"> ￥ {{ scope.row.orderPaymentMoney | formatQianFenWei }} </template>
      </el-table-column>
      <el-table-column align="center" label="实付金额">
        <template slot-scope="scope"> ￥ {{ scope.row.orderPaidMoney | formatQianFenWei }} </template>
      </el-table-column>
      <el-table-column align="center" label="订单状态" prop="orderStatus">
        <template slot-scope="scope"> {{ scope.row.orderStatus | filterName(statusList) }} </template>
      </el-table-column>
      <el-table-column align="center" label="销售人员" prop="attributionName"> </el-table-column>

      <el-table-column align="center" label="操作" prop="remark">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="查看详情" placement="top">
            <el-link type="primary" :underline="false" @click="orderDetail(scope.row)" class="icon icon-see"></el-link>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    detailInfo: { type: Object },
    statusList: { type: Array },
  },

  data() {
    return {};
  },
  filters: {
    refundApplyTypeFilter(val) {
      switch (val) {
        case 'ONLY_REFUND':
          return '仅退款 ';
        case 'ONLY_CANCEL_SERVICE':
          return '仅取消服务';
        case 'REFUND_CANCEL_SERVICE':
          return '退款并取消服务';
        default:
          return '';
      }
    },
    filterName(type, list) {
      let item = list.find((i) => i.dataCode === type);
      return item ? item.dataValue : '';
    },
  },
  created() {},
  methods: {
    orderDetail(row) {
      this.$router.push({ name: 'salesorderdetail', query: { id: row.orderId } });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-table .el-table__header th {
  background: #f6f6f6 !important;
}
.table {
  margin: 0px 20px;
  width: auto;
}
</style>
