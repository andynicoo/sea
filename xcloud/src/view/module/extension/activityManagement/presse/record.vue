<template>
  <div class="app-container">
    <!-- header -->
    <div class="header-container" ref="searchBox">
      <BackHerader @back="goback" title="砍价记录"></BackHerader>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中" v-loading="listLoading" :data="list" :height="tableHeight" border highlight-current-row>
        <Empty slot="empty" />
        <el-table-column align="center" label="砍价编号" width="200">
          <template slot-scope="scope">{{ scope.row.bargainNumber }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动名称" width="200">
          <template slot-scope="scope">{{ scope.row.activityName }}</template>
        </el-table-column>
        <el-table-column align="center" label="发起用户" width="200">
          <template slot-scope="scope">{{ scope.row.userMobile }}</template>
        </el-table-column>
        <el-table-column align="center" label="砍价商品" width="300">
          <template slot-scope="scope">
            <div>
              <el-image style="width: 48px; height: 33px" :src="getImgSrc(scope.row.activityProductImgUrl, scope.row.mobileProductImgUrl)" :preview-src-list="[getImgSrc(scope.row.activityProductImgUrl, scope.row.mobileProductImgUrl)]">
                <div slot="error" class="image-slot">
                  <img src="@/assets/images/infoDetail/default.png" alt="" />
                </div>
              </el-image>
              <span style="margin-left: 10px">{{ scope.row.productName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="已帮砍/目标帮砍次数">
          <template slot-scope="scope">{{ scope.row.alreadyBargainNumber + '/' + scope.row.bargainHelpPersonNum }}</template>
        </el-table-column>
        <el-table-column align="center" label="已帮砍/目标帮砍金额">
          <template slot-scope="scope">{{ scope.row.alreadyBargainAmount + '/' + scope.row.bargainLowestPrice }}</template>
        </el-table-column>
        <el-table-column align="center" label="砍价状态">
          <template slot-scope="scope">{{ statusType[scope.row.bargainStatus] }}</template>
        </el-table-column>
        <el-table-column align="center" label="砍价发起/结束时间" width="300">
          <template slot-scope="scope">{{ scope.row.bargainStartTime + '至' + scope.row.bargainEndTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="toPresseRecord(scope.row)">详情</el-button>
          </template>
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
import { presseRecordList } from '@/api/newApi/extension/activity.js';
import BackHerader from '@/components/backHerader';
export default {
  components: {
    BackHerader,
  },
  data() {
    return {
      moreSerch: false, //更多查询条件
      list: [],
      // 分页
      listTotal: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        enterpriseId: '',
        bargainActivityId: this.$route.query.id,
      },
      statusType: {
        BARGAIN_ING: '砍价中',
        BARGAIN_SUCCESS: '砍价成功',
        BARGAIN_FAIL: '砍价失败',
      },
      searchFlag: false,
    };
  },
  created() {
    this.listQuery.enterpriseId = window.localStorage.getItem('enterpriseId');
    this.queryData();
  },
  methods: {
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      this.listQuery.enterpriseId = window.localStorage.getItem('enterpriseId');
      presseRecordList(this.listQuery)
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

    search() {
      this.searchFlag = true;
      this.listQuery.page = 1;
      this.queryData();
    },
    getImgSrc(pcImg, mobileImg) {
      if (pcImg) {
        return JSON.parse(pcImg)[0].imgUrl;
      } else if (mobileImg) {
        return JSON.parse(mobileImg)[0].imgUrl;
      }
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        enterpriseId: '',
        createTimeQuery: [],
      };
      this.search();
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
    toPresseRecord(row) {
      this.$router.push({
        name: 'presseRecordDel',
        path: '/extension/activityManagement/presse/recordDel',
        query: {
          id: row.bargainActivityInitiateRecordId,
          name: row.activityName,
          startTime: row.bargainStartTime,
          finishTime: row.bargainEndTime,
          key: this.$route.query.id,
        },
      });
    },
    // 返回列表
    goback() {
      this.$router.push({
        path: '/extension/activityManagement/presse/index.vue',
        name: 'presse',
      });
    },
  },
};
</script>
<style scoped lang="scss">
.app-container {
  .header-container {
    margin-bottom: 0px;
  }
  .test {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #67c23a;
    background: #eaffe0;
    border: 1px solid #67c23a;
  }

  .text-blue {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffc100;
    background: #fff8e1;
    border: 1px solid #ffc100;
  }
  .text-warning {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #b8b8b8;
    background: #f4f4f4;
    border: 1px solid #b8b8b8;
  }
}
.search-box-header {
  display: flex;
  justify-content: space-between;
}
/deep/ .el-tabs__nav-wrap::after {
  height: 0px;
}
</style>
