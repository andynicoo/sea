<template>
  <div class="registeredUser">
    <el-table border class="table" :data="data"  ref="table" :height="tableHeight" highlight-current-row>
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column align="center" label="用户昵称">
        <template slot-scope="scope">{{ scope.row.nickName }}</template>
      </el-table-column>
      <el-table-column align="center" label="客户手机号">
        <template slot-scope="scope">{{ scope.row.mobile }}</template>
      </el-table-column>
      <el-table-column align="center" label="是否付费">
        <template slot-scope="scope">{{scope.row.payFlag==1?'付费':'未付费'}}</template>
      </el-table-column>
      <el-table-column align="center" label="链接名称">
        <template slot-scope="scope">{{scope.row.pageName}}</template>
      </el-table-column>
      <el-table-column align="center" label="网页链接">
        <template slot-scope="scope">{{scope.row.pageUrl}}</template>
      </el-table-column>
      <el-table-column align="center" label="注册时间">
        <template slot-scope="scope">{{ scope.row.registerTime }}</template>
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
import { getUserChannelRegisterInfo } from "@/api/newApi/extension/promotionExtend.js";
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
      getUserChannelRegisterInfo(this.listQuery).then(res=>{
        this.data=res.data.records
        this.listTotal=Number(res.data.total)
      })
    },
  },
};
</script>
<style lang="scss" scoped>
.pagination-container {
  margin-top: 24px;
}
.table {
  height: calc(808px - 205px);
}
</style>
