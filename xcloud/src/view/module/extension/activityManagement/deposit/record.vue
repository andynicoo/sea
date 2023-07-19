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
        <el-table-column align="center" label="手机号" width="200">
          <template slot-scope="scope">{{ scope.row.userMobile }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动商品" width="300">
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
        <el-table-column align="center" label="商品规格" width="200">
          <template slot-scope="scope">{{ scope.row.productSpecsName }}</template>
        </el-table-column>
        <el-table-column align="center" label="销售价格" width="200">
          <template slot-scope="scope">{{ scope.row.servicePrice }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.activityStatus | filterStyle">
              <span>
                {{ scope.row.depositStatus | filterState }}
              </span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="定金金额" width="200">
          <template slot-scope="scope">{{ scope.row.groupPrice }}</template>
        </el-table-column>
        <el-table-column align="center" label="定金支付时间" width="300">
          <template slot-scope="scope">{{ scope.depositPaymentTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="尾款状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.finalStatus | filterStylefin">
              <span>
                {{ scope.row.finalStatus | filterStatefin }}
              </span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="尾款金额" width="200">
          <template slot-scope="scope">{{ scope.row.finalAmount }}</template>
        </el-table-column>
        <el-table-column align="center" label="尾款支付时间" width="300">
          <template slot-scope="scope">{{ scope.row.finalPaymentTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="300">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="订单号" width="300">
          <template slot-scope="scope">{{ scope.row.orderNo }}</template>
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
import { preSaleActivityRecord } from '@/api/newApi/extension/activity.js';
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
  filters: {
    //不同状态显示不同的文字颜色
    filterStyle(val) {
      if (val == 'WAIT_PAY_DEPOSIT') {
        return 'warning';
      } else if (val == 'PAID_DEPOSIT') {
        return 'success';
      }
    },
    //不同状态显示不同的文字颜色
    filterState(val) {
      if (val == 'WAIT_PAY_DEPOSIT') {
        return '待支付定金';
      } else if (val == 'PAID_DEPOSIT') {
        return '已支付定金';
      }
    },
    //不同状态显示不同的文字颜色
    filterStylefin(val) {
      if (val == 'WAIT_PAY_FINAL') {
        return 'warning';
      } else if (val == 'PAID_FINAL') {
        return 'success';
      }
    },
    //不同状态显示不同的文字颜色
    filterStatefin(val) {
      if (val == 'WAIT_PAY_FINAL') {
        return '待支付尾款';
      } else if (val == 'PAID_FINAL') {
        return '已支付尾款';
      }
    },
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
      preSaleActivityRecord(this.listQuery)
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
