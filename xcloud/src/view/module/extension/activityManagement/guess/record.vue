<!-- receive -->
<template>
  <div class="app-container">
    <!-- header -->
    <div class="header-container" ref="searchBox">
      <BackHerader @back="goback" title="答题记录"></BackHerader>

      <el-form ref="searchForm" inline>
        <el-form-item label="活动名称">
          {{ name }} <span class="mr-10">（{{ startTime }} 至 {{ finishTime }}）</span></el-form-item
        >
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="table-container">
      <el-table ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中" v-loading="listLoading" :data="list" :height="tableHeight" border highlight-current-row>
        <Empty slot="empty" />
        <el-table-column align="center" label="手机号">
          <template slot-scope="scope">{{ scope.row.userPhone }}</template>
        </el-table-column>
        <el-table-column align="center" label="答对/总题">
          <template slot-scope="scope">{{ scope.row.answerQuestions }} / {{ scope.row.topicTotal }}</template>
        </el-table-column>
        <el-table-column align="center" label="得分">
          <template slot-scope="scope">
            {{ scope.row.score }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="答题用时">
          <template slot-scope="scope">{{ scope.row.topicTime }}</template>
        </el-table-column>

        <el-table-column align="center" label="提交时间">
          <template slot-scope="scope">{{ scope.row.submissionTime }}</template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
  </div>
</template>
<script>
import BackHerader from '@/components/backHerader';
import { answerRecord } from '@/api/newApi/extension/activity.js';
export default {
  components: {
    BackHerader,
  },

  data() {
    return {
      list: [],
      // 分页
      listTotal: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        answerId: this.$route.query.id,
      },
      searchFlag: true,
      name: this.$route.query.name,
      startTime: this.$route.query.startTime,
      finishTime: this.$route.query.finishTime,
    };
  },

  created() {
    this.queryData();
  },
  methods: {
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      answerRecord(this.listQuery)
        .then((res) => {
          this.listLoading = false;
          if (res.code == 0) {
            // 设置列表和总条数
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
            if (this.searchFlag) {
              this.$message({
                message: `搜索完成，为您搜索${this.listTotal}条结果`,
                type: 'success',
                duration: 2000,
              });
              this.searchFlag = false;
            }
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },

    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.queryData();
    },

    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.queryData();
    },

    // 返回列表
    goback() {
      this.$router.push({
        path: '/extension/activityManagement/guess/index.vue',
        name: 'guess',
      });
    },
  },
};
</script>
<style scoped lang="scss">
/deep/ .el-page-header__title {
  font-size: 18px;
  color: #333;
}
/deep/ .el-page-header__left {
  font-size: 20px;
  color: #333;
}
</style>
