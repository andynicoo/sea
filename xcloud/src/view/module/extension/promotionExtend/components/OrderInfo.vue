<template>
  <div class="orderInfo">
    <el-table border :data="data" class="table " ref="table" :height="tableHeight"  highlight-current-row>
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="scope"> {{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column align="center" label="订单号">
        <template slot-scope="scope"> {{ scope.row.orderNo }}</template>
      </el-table-column>
      <el-table-column align="center" label="客户手机号">
        <template slot-scope="scope"> {{ scope.row.userMobile }}</template>
      </el-table-column>
      <el-table-column align="center" label="订单金额">
        <template slot-scope="scope"> {{ scope.row.orderOldMoney }}</template>
      </el-table-column>
      <el-table-column align="center" label="优惠金额">
        <template slot-scope="scope"> {{ scope.row.discAmount }}</template>
      </el-table-column>
      <el-table-column align="center" label="已付金额">
        <template slot-scope="scope"> {{ scope.row.amountMoney }}</template>
      </el-table-column>
      <el-table-column align="center" label="来源">
        <template slot-scope="scope"> {{ scope.row.orderSource==1?'PC网页端':scope.row.orderSource==2?'H5':scope.row.orderSource==3?'手工录入':scope.row.orderSource==4?'微信小程序':'' }}</template>
      </el-table-column>
      <el-table-column align="center" label="下单时间">
        <template slot-scope="scope"> {{ scope.row.paymentTime }}</template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.pageIndex"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTotal"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getOrderChannelInfo } from "@/api/newApi/extension/promotionExtend.js";
export default {
  data() {
    return {
      // 分页
      listTotal: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        channelId: this.$route.query.channelId,
      },
      //数据
      data: [],
      initHeight:140
    };
  },
  created() {
    this.getInfoFunc()
  },
  methods: {
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getInfoFunc()
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.getInfoFunc()
    },
    getInfoFunc(){
      getOrderChannelInfo(this.listQuery).then(res=>{
        this.data=res.data.records
        this.listTotal=Number(res.data.total)
      })
    },
  },
};
</script>
<style lang="scss" scoped>
.table {
   height: calc(808px - 205px);
  }
.pagination-container {
  margin-top: 24px;
}
</style>