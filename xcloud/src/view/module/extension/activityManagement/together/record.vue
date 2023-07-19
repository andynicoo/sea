<!-- receive -->
<template>
  <div class="app-container">
    <!-- header -->
    <div class="header-container" ref="searchBox">
      <BackHerader @back="goback" title="拼团参与记录"></BackHerader>
      <el-form inline label-width="70px">
        <el-form-item>
          <h4>{{ `活动名称：${name}（${startTime} 至 ${finishTime}）` }}</h4>
        </el-form-item>
      </el-form>
      <el-form ref="searchForm" inline>
        <el-form-item label="团单ID">
          <el-input placeholder="请输入团单ID" clearable style="width: 168px" size="small" v-model="listQuery.spellGroupRecordId" @clear="queryData" />
        </el-form-item>
        <el-form-item label="参团手机号">
          <el-input placeholder="请输入参团手机号" clearable style="width: 168px" size="small" v-model="listQuery.userMobile" @clear="queryData" />
        </el-form-item>
        <el-form-item label="拼团状态">
          <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="待拼团" value="WAIT_SPELL_GROUP"></el-option>
            <el-option label="拼团已取消" value="CANCEL"></el-option>
            <el-option label="拼团中" value="SPELL_GROUP_ING"></el-option>
            <el-option label="拼团成功" value="SPELL_GROUP_SUCCESS"></el-option>
            <el-option label="拼团失败" value="SPELL_GROUP_FAIL"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开团时间">
          <el-date-picker v-model="listQuery.receivedTime" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
        </el-form-item>
        <el-form-item label="奖品类型">
          <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.prizeType" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="未中奖" value="nothing"></el-option>
            <el-option label="优惠券" value="coupon"></el-option>
            <el-option label="实物图片" value="entity"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="table-container">
      <el-table ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中" v-loading="listLoading" :data="list" :height="tableHeight" border highlight-current-row>
        <Empty slot="empty" />
        <el-table-column align="center" label="团单ID">
          <template slot-scope="scope">{{ scope.row.spellGroupRecordId }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动名称">
          <template slot-scope="scope">{{ scope.row.activityName }}</template>
        </el-table-column>
        <el-table-column align="center" label="团长手机号">
          <template slot-scope="scope">{{ scope.row.headUserMobile }}</template>
        </el-table-column>
        <el-table-column align="center" label="参团手机号">
          <template slot-scope="scope">{{ scope.row.joinUserMobile }}</template>
        </el-table-column>
        <el-table-column align="center" label="拼团商品">
          <template slot-scope="scope">
            <el-image style="width: 48px; height: 33px" :src="scope.row.activityProductImgUrl" v-if="scope.row.activityProductImgUrl">
              <div slot="error" class="image-slot"><img src="@/assets/images/infoDetail/default.png" alt="" /></div>
            </el-image>
            <div>
              {{ scope.row.productName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品规格">
          <template slot-scope="scope">{{ scope.row.productSpecsName }}</template>
        </el-table-column>
        <el-table-column align="center" label="订单状态">
          <template slot-scope="scope">{{ orderStatusType[scope.row.orderStatus] }}</template>
        </el-table-column>
        <el-table-column align="center" label="参团时间">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
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
import { togetherJoinList } from '@/api/newApi/extension/activity.js';
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
        spellGroupRecordId: this.$route.query.id,
        receivedTime: [],
      },
      searchFlag: false,
      prizeType: {
        nothing: '未中奖',
        coupon: '优惠券',
        entity: '实物商品',
      },
      name: this.$route.query.name,
      startTime: this.$route.query.startTime,
      finishTime: this.$route.query.finishTime,
      orderStatusType: {
        CANCEL: '已取消',
        WAIT_AUDIT: '待审核',
        WAIT_PAY: '待付款',
        PAID: '已付款',
        PART_PAID: '部分付款 ',
        AUDIT_FAIL: '审核不通过',
        APPLY_REFUND: '申请退款',
      },
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
      togetherJoinList(this.setGetListParm())
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

    search() {
      this.searchFlag = true;
      this.listQuery.page = 1;
      this.queryData();
    },

    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        spellGroupRecordId: '',
        enterpriseId: window.localStorage.getItem('enterpriseId'),
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
        path: '/extension/activityManagement/together/index.vue',
        name: 'together',
        query: {
          active: 1,
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
