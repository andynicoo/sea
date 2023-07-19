<template>
  <div>
    <div class="title">
      <el-divider direction="vertical"></el-divider>
      <span class="text-info">退货商品</span>
    </div>
    <el-table border :data="formattableData" :max-height="260" class="table" :span-method="objectSpanMethod">
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单号" prop="orderNo"></el-table-column>
      <el-table-column align="center" label="商品名称" prop="productName"></el-table-column>
      <el-table-column align="center" label="国家" prop="countryName"></el-table-column>
      <el-table-column align="center" label="服务项目" prop="specsName"></el-table-column>
      <el-table-column align="center" label="商品金额">
        <template slot-scope="scope">
          <span>￥{{ scope.row.productMoney | formatQianFenWei }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品售价">
        <template slot-scope="scope">
          <span>￥{{ scope.row.productPaymentMoney | formatQianFenWei }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠金额">
        <template slot-scope="scope">
          <span>￥{{ scope.row.discountMoney | formatQianFenWei }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品实付金额">
        <template slot-scope="scope">
          <span>￥{{ scope.row.productPaidMoney | formatQianFenWei }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="付款状态" prop="paymentStatus"></el-table-column>
      <el-table-column align="center" label="服务公司名称" prop="serviceCompanyName"></el-table-column>
      <el-table-column align="center" label="服务号" prop="serviceNo"></el-table-column>
      <el-table-column align="center" label="服务进度" prop="serviceProgressName"></el-table-column>
      <el-table-column align="center" label="服务状态" prop="serviceStatusName"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    orderProductRefundDetailList: { type: Array },
  },

  computed: {
    formattableData() {
      let list = [];
      if (this.orderProductRefundDetailList && this.orderProductRefundDetailList.length) {
        this.orderProductRefundDetailList.forEach((item) => {
          item.orderProductDetail.forEach((detail, i) => {
            list.push({
              ...item,
              ...detail,
              rowspan: item.orderProductDetail.length,
              index: i,
            });
          });
        });
      }

      return list;
    },
  },
  methods: {
    objectSpanMethod({ row, column }) {
      let combineList = ['productName'];
      if (combineList.includes(column.property)) {
        if (row.index === 0) {
          return [row.rowspan, 1];
        } else {
          return [0, 0];
        }
      }
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
  margin: 15px 20px;
  width: auto;
}
</style>
