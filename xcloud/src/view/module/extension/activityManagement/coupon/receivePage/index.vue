<!-- receive -->
<template>
  <div>
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box">
        <el-form ref="searchForm" inline>
          <el-form-item label="客户手机号">
            <el-input placeholder="请输入客户手机号" clearable style="width: 168px" size="small" v-model="listQuery.userMobile" @clear="queryData" />
          </el-form-item>
          <el-form-item label="优惠券名称">
            <el-input placeholder="请输入优惠名称" clearable style="width: 220px" size="small" v-model="listQuery.couponName" @clear="queryData" />
          </el-form-item>
          <el-form-item label="发放人">
            <el-input placeholder="请输入发放人" clearable style="width: 168px" size="small" v-model="listQuery.createBy" @clear="queryData" />
          </el-form-item>
          <el-form-item label="使用状态">
            <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.status">
              <el-option label="全部" value="-1"></el-option>
              <el-option v-for="item in useStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单号">
            <el-input placeholder="请输入订单号" clearable style="width: 220px" size="small" v-model="listQuery.usedOrderCode" @clear="queryData" />
          </el-form-item>
          <el-form-item label="是否新客">
            <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.newUserUsed">
              <el-option label="全部" value="-1"></el-option>
              <el-option v-for="item in newUserUsedList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="领取时间">
            <el-date-picker v-model="listQuery.receivedTime" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
          </el-form-item>
          <el-form-item label="领取方式">
            <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.issueType">
              <el-option label="全部" value="-1"></el-option>
              <el-option :label="item.label" v-for="item in sourceList" :key="item.value" :value="item.value + ''"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中" v-loading="listLoading" :data="list" :height="tableHeight" border highlight-current-row>
        <Empty slot="empty" />
        <el-table-column align="center" label="优惠劵名称" width="200">
          <template slot-scope="scope">{{ scope.row.couponName }}</template>
        </el-table-column>
        <el-table-column align="center" label="领取手机号" width="200">
          <template slot-scope="scope">{{ scope.row.userMobile }}</template>
        </el-table-column>
        <el-table-column align="center" label="已领劵券码" width="200">
          <template slot-scope="scope">{{ scope.row.couponCode }}</template>
        </el-table-column>
        <el-table-column align="center" label="使用状态" width="120">
          <template slot-scope="scope">
            <!-- -->
            <el-tag :class="scope.row.status | filterKey(useStatusList, 'class')">
              <span>
                {{ scope.row.status | filterKey(useStatusList) }}
              </span>
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="优惠内容">
          <template slot-scope="scope">{{ scope.row.couponContent }}</template>
        </el-table-column>
        <el-table-column align="center" label="是否新客">
          <template slot-scope="scope">{{ scope.row.newUserUsed | filterKey(newUserUsedList) }}</template>
        </el-table-column>
        <el-table-column align="center" label="订单号" prop="usedOrderCode">
          <template slot-scope="scope">{{ scope.row.usedOrderCode || '-' }}</template>
        </el-table-column>

        <el-table-column align="center" label="使用范围" width="200">
          <template slot-scope="scope">{{ scope.row.applyProductType | filterKey(useRangeList) }}</template>
        </el-table-column>

        <el-table-column align="center" label="发放人" width="120">
          <template slot-scope="scope">{{ scope.row.createBy }}</template>
        </el-table-column>
        <el-table-column align="center" label="领取方式">
          <template slot-scope="scope">
            {{ scope.row.issueType | filterKey(sourceList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="领取时间" width="200">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="使用时间" width="200">
          <template slot-scope="scope">{{ scope.row.couponUseDate || '-' }}</template>
        </el-table-column>
        <el-table-column align="center" label="过期日期" width="200">
          <template slot-scope="scope">
            {{ scope.row.effectiveEndTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" width="200">
          <template slot-scope="scope">
            {{ scope.row.remark || '-' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="作废" class="icon" placement="top">
              <el-link type="primary" :underline="false" @click="deleteCoupon(scope.row)" v-show="hasAuthority('E2_21')" v-if="[useStatusEnum.UNUSED, useStatusEnum.UN_TAKE_EFFECT].includes(scope.row.status)">
                <img src="@/assets/images/zt-upgrade-1/recovery.svg" />
              </el-link>
            </el-tooltip>
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
import { getReceivedList, invalid } from '@/api/newApi/extension/coupon.js';
import { couponTypeList, useStatusList, useStatusEnum, sourceList, useRangeList, newUserUsedList } from '../enumObj';
export default {
  filters: {
    //状态
    filterKey(value, list, key = 'label') {
      let temp = list.find((item) => item.value === value);
      return temp ? temp[key] : value;
    },
  },

  data() {
    return {
      moreSerch: false, //更多查询条件
      list: [],
      // 分页
      listTotal: 0,
      listLoading: false,
      initHeight: 65,
      listQuery: {
        page: 1,
        limit: 20,
        userMobile: '',
        createBy: '',
        couponName: '', //优惠券码
        status: '-1', //状态
        enterpriseId: '',
        receivedTime: [],
        issueType: '-1',
        newUserUsed: '-1',
      },
      searchFlag: false,
      // 优惠券类型列表
      couponTypeList,
      // 使用状态列表
      useStatusList,
      // 使用状态枚举
      useStatusEnum,
      // 领取方式列表
      sourceList,
      useRangeList,
      newUserUsedList,
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
      getReceivedList(this.setGetListParm())
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
          params.receivedTimeStart = params[item][0];
          params.receivedTimeEnd = params[item][1];
        }
        if (params[item] == '-1') {
          params[item] = null;
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
        userMobile: '',
        createBy: '',
        couponName: '', //优惠券码
        status: '-1', //状态
        enterpriseId: window.localStorage.getItem('enterpriseId'),
        receivedTime: [],
        issueType: '-1',
        newUserUsed: '-1',
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
      this.listQuery.pageNo = 1;
      this.queryData();
    },

    /** 作废 */
    deleteCoupon(row) {
      this.$confirm('确定作废该优惠券吗？', '作废提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        invalid({ couponId: row.userCouponId, enterpriseId: window.localStorage.getItem('enterpriseId') - 0 }).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '优惠券作废成功',
            });
            this.queryData();
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        });
      });
    },
    /** 发放优惠券 */
    grantCoupon() {
      this.$router.push({ path: '/extension/coupon/addEdit' });
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
