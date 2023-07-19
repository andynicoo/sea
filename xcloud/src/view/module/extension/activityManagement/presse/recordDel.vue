<!-- receive -->
<template>
  <div class="app-container">
    <!-- header -->
    <div class="header-container" ref="searchBox">
      <BackHerader @back="goback" title="砍价详情"></BackHerader>
      <el-form inline label-width="70px">
        <el-form-item>
          <h4>{{ `活动名称：${name}（${startTime} 至 ${finishTime}）` }}</h4>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="table-container">
      <h3 style="margin-bottom: 10px">发起人&&商品信息</h3>
      <el-table ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中" v-loading="listLoading" :data="recordlist" border highlight-current-row>
        <Empty slot="empty" />
        <el-table-column align="center" label="发起用户">
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
        <!-- <el-table-column align="center" label="商品规格">
          <template slot-scope="scope">{{ scope.row.productSpecification }}</template>
        </el-table-column> -->
        <el-table-column align="center" label="销售价">
          <template slot-scope="scope">{{ scope.row.standardPrice }}</template>
        </el-table-column>
        <el-table-column align="center" label="帮砍金额总计">
          <template slot-scope="scope">{{ scope.row.bargainPriceTotal }}</template>
        </el-table-column>
        <el-table-column align="center" label="实际购买金额">
          <template slot-scope="scope">{{ scope.row.orderPaidMoney }}</template>
        </el-table-column>
        <el-table-column align="center" label="数量">
          <template slot-scope="scope">{{ scope.row.quantity }}</template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">{{ statusType[scope.row.bargainStatus] }}</template>
        </el-table-column>
        <el-table-column align="center" label="订单号">
          <template slot-scope="scope">{{ scope.row.orderNo }}</template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 列表 -->
    <div class="table-container">
      <h3 style="margin-bottom: 10px">帮砍记录</h3>
      <el-table ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中" v-loading="listLoading" :data="list" border highlight-current-row>
        <Empty slot="empty" />
        <el-table-column align="center" label="成员信息">
          <template slot-scope="scope">{{ scope.row.userMobile }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作时间">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="帮砍金额">
          <template slot-scope="scope">{{ scope.row.bargainPrice }}</template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
  </div>
</template>
<script>
import BackHerader from '@/components/backHerader';
import { presseRecord, helpPresseDetails } from '@/api/newApi/extension/activity.js';
export default {
  components: {
    BackHerader,
  },
  data() {
    return {
      moreSerch: false, //更多查询条件
      list: [],
      recordlist: [],
      // 分页
      listTotal: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        enterpriseId: window.localStorage.getItem('enterpriseId'),
        initiateRecordId: this.$route.query.id,
      },
      searchFlag: false,
      name: this.$route.query.name,
      startTime: this.$route.query.startTime,
      finishTime: this.$route.query.finishTime,
      statusType: {
        BARGAIN_ING: '砍价中',
        BARGAIN_SUCCESS: '砍价成功',
        BARGAIN_FAIL: '砍价失败',
      },
    };
  },

  created() {
    this.listQuery.enterpriseId = window.localStorage.getItem('enterpriseId');
    this.queryData();
    this.getPreseeRecord();
  },
  methods: {
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      helpPresseDetails(this.setGetListParm())
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

    setGetListParm() {
      let params = { ...this.listQuery };
      Object.keys(params).map((item) => {
        if (item == 'receivedTime' && params['receivedTime'] && params['receivedTime'].length > 0) {
          params.startTime = params[item][0];
          params.finishTime = params[item][1];
        }
        if (params[item] == '-1') {
          params[item] = null;
        }
        if (params[item] == '') {
          delete params[item];
        }
        return item;
      });
      return params;
    },
    getPreseeRecord() {
      presseRecord({ initiateRecordId: this.$route.query.id })
        .then((res) => {
          if (res.code == 0) {
            // 设置列表和总条数
            this.recordlist = [res.data];
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .catch((err) => {});
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
        spellGroupRecordId: '',
        receivedTime: [],
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
    /**
     * 搜索全部/清空时间分页为第一页
     */
    searchData() {
      this.listQuery.current = 1;
      this.queryData();
    },
    // 返回列表
    goback() {
      this.$router.push({
        name: 'presseRecord',
        path: '/extension/activityManagement/presse/record',
        query: {
          id: this.$route.query.key,
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
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
</style>
