<template>
  <div>
    <el-table
      ref="table"
      :data="followRecordList"
      highlight-current-row
      border
      :height="tableHeight"
    >
      <Empty slot="empty" />
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="scope"> {{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column align="center" label="跟进内容">
        <template slot-scope="scope"> {{ scope.row.remark }}</template>
      </el-table-column>
      <el-table-column align="center" label="跟进时间" width="200px">
        <template slot-scope="scope"> {{ scope.row.updateTime }}</template>
      </el-table-column>
      <el-table-column align="center" label="添加人" width="200px">
        <template slot-scope="scope"> {{ scope.row.followUserName }}</template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.pageNo"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTotal"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getRecordList } from "@/api/newApi/customer/customerInfo.js";
export default {
  data() {
    return {
      // 分页
      listTotal: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        service: "",
        status: "",
      },
      initHeight: 125,
      followRecordList: [],
    };
  },
  created() {
    this.getRecord();
  },
  methods: {
    /**
     * 跟进记录
     */
    getRecord() {
      getRecordList({
        pageSize: this.listQuery.pageSize,
        pageIndex: this.listQuery.pageNo,
        enterpriseId: this.$route.query.enterpriseId,
        userId: this.$route.query.userId,
      }).then((res) => {
        // 延迟loading关闭
        setTimeout(() => {
          this.listLoading = false;
        }, 300);
        if (res.code == 0) {
          this.followRecordList = res.data.records;
          this.listTotal = Number(res.data.total);
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getRecord();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      this.getRecord();
    },
  },
  mounted() {},
};
</script>
<style  scoped lang="scss">
.pagination-container {
  margin-top: 24px;
}
</style>
