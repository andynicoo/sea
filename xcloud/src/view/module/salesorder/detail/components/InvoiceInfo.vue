<template>
  <div>
    <!-- <div class="title">
      <el-divider direction="vertical"></el-divider>
      <span class="text-info">开票信息</span>
    </div> -->
    <el-table border :data="invoiceInfoList" :max-height="260" class="table">
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="开票类型" prop="orderNo">
        <template slot-scope="scope">
          {{ scope.row.invoiceType === 'GENERAL' ? '增值税普通发票' : scope.row.invoiceType === 'SPECIAL' ? '增值税专用发票' : '不开票' }}
          <span v-if="scope.row.subjectType">({{ scope.row.subjectType === 'PERSON' ? '个人' : scope.row.subjectType === 'ENTERPRISE' ? '公司' : '' }}) </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单金额" prop="orderPaidMoney"></el-table-column>
      <el-table-column align="center" label="税点" prop="taxPoint"></el-table-column>
      <el-table-column align="center" label="发票金额">
        <template slot-scope="scope">
          <span>￥{{ scope.row.makeInvoiceMoney | formatQianFenWei }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开票状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开票时间">
        <template slot-scope="scope">
          <span>{{ scope.row.status == '已开票' ? scope.row.updateTime : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" prop="paymentStatus">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="查看详情" placement="top">
            <el-link type="primary" :underline="false" @click="handleDetail(scope.row)" class="icon icon-see"></el-link>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    invoiceInfoList: { type: Array },
  },
  methods: {
    /** 查看详情  */
    handleDetail(row) {
      this.$router.push({
        path: '/finance/invoice/invoiceDetails',
        query: { id: row.orderInvoiceId },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-table .el-table__header th {
  background: #f6f6f6 !important;
}
.title {
  font-size: 16px;
  font-weight: bold;
}
.table {
  margin: 0px 20px;
  width: auto;
}
</style>
