<template>
  <div class="app-container">
    <el-table ref="table"  :data="list" :height="tableHeight" highlight-current-row :v-loading="listLoading" border>
      <Empty slot="empty" />
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="scope"> {{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column align="center" label="订单号">
        <template slot-scope="scope"> {{ scope.row.orderNo }}</template>
      </el-table-column>
      <el-table-column align="center" label="来源">
        <template slot-scope="scope"> {{scope.row.orderSource | filterSource }}</template>
      </el-table-column>
      <el-table-column align="center" label="应付金额">
        <template slot-scope="scope"> ￥{{ scope.row.orderMoney | formatQianFenWei }}</template>
      </el-table-column>
      <el-table-column align="center" label="优惠金额">
        <template slot-scope="scope"> ￥{{ scope.row.discAmount | formatQianFenWei }}</template>
      </el-table-column>
      <el-table-column align="center" label="实付金额">
        <template slot-scope="scope"> ￥{{ scope.row.amountMoney | formatQianFenWei }}</template>
      </el-table-column>
      <el-table-column align="center" label="下单时间" prop="createTime">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTotal"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getorderlist} from "@/api/newApi/orderManage/salesorder.js";
export default {
  data() {
    return {
      // 分页
      listLoading:false,
      listTotal: 0,
      listQuery: {
        page: 1,
        limit: 10,
        userMobile:this.$route.query.mobile
      },
       //数据
      list: [],
      initHeight: 125
    };
  },
  created() {
      this.queryData()
  },
  methods: {
      queryData(){
        this.listLoading = true;
       getorderlist(this.listQuery)
        .then((res) => {
          // 延迟loading关闭
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
          if (res.code == 0) {
            // 设置列表和总条数
            this.list = res.data.records;
            this.listTotal =Number(res.data.total);
          }
        })
        .catch((err) => {
          this.$message.error(err.message)
        });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
        this.queryData()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
        this.queryData()
    },
  },
};
</script>
<style scoped lang="scss">
.pagination-container {
  margin-top: 24px;
}
</style>
