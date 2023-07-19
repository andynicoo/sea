<template>
  <div>
    <el-table border :data="detailInfo.orderRefundVOList" :max-height="260" class="table">
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="退款订单号" prop="refundNo"> </el-table-column>
      <el-table-column align="center" label="退款商品" prop="productName"></el-table-column>
      <el-table-column align="center" label="商品实付金额" prop="productPaidMoney">
        <template slot-scope="scope">
          <span>￥{{ scope.row.productPaidMoney | formatQianFenWei }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请退款金额">
        <template slot-scope="scope"> ￥ {{ scope.row.refundMoney | formatQianFenWei }} </template>
      </el-table-column>

      <el-table-column align="center" label="退款收手续费" prop="refundPoundage">
        <template slot-scope="scope"> ￥ {{ scope.row.refundPoundage | formatQianFenWei }} </template>
      </el-table-column>
      <el-table-column align="center" label="退款成功金额">
        <template slot-scope="scope"> ￥ {{ scope.row.refundStatus == 'REFUNDED' ? scope.row.refundMoney : 0 }} </template>
      </el-table-column>
      <el-table-column align="center" label="退款路径" prop="refundMethod"> </el-table-column>
      <el-table-column align="center" label="退款类型" prop="refundApplyType">
        <template slot-scope="scope">
          {{ scope.row.refundApplyType | refundApplyTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="退款状态" prop="refundApplyType">
        <template slot-scope="scope">
          {{ scope.row.refundStatus | refundStatusFilter(statusList) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请人" prop="applyName"></el-table-column>

      <el-table-column align="center" label="申请时间" prop="createTime"></el-table-column>
      <el-table-column align="center" label="操作" prop="remark">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="查看详情" placement="top">
            <el-link type="primary" :underline="false" @click="refundDetail(scope.row)" class="icon icon-see"></el-link>
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
  },

  data() {
    return {
      statusList: [
        { id: 'WAIT_AUDIT', label: '审批中' },
        { id: 'WAIT_REFUND', label: '审批通过' },
        { id: 'REFUNDING', label: '退款中' },
        { id: 'REFUNDED', label: '已退款' },
        { id: 'UNREFUND', label: '无需退款' },
        { id: 'REFUND_FAIL', label: '退款失败' },
        { id: 'AUDIT_FAIL', label: '审批不通过' },
        { id: 'CANCEL', label: '已取消' },
      ],
    };
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
    refundStatusFilter(val, list) {
      return (list.find((item) => item.id == val) || {}).label;
    },
  },
  created() {},
  methods: {
    refundDetail(row) {
      this.$router.push({
        path: '/refundorder/detail',
        query: { id: row.orderRefundId },
      });
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
