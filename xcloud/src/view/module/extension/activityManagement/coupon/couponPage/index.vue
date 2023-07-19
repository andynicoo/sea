<!--  -->
<template>
  <div>
    <div class="header-container" ref="searchBox">
      <el-form :model="listQuery" inline ref="searchForm">
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input placeholder="请输入优惠券码" clearable style="width: 220px" size="small" v-model="listQuery.couponName" @clear="queryData" />
        </el-form-item>
        <el-form-item label="优惠券类型" prop="couponType">
          <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.couponType">
            <el-option label="全部类型" value=""></el-option>
            <el-option v-for="item in couponTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券状态" prop="status">
          <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.status">
            <el-option label="全部类型" value=""></el-option>
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--表格  -->
    <div class="table-container">
      <el-table ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中" v-loading="listLoading" :data="list" :height="tableHeight" border highlight-current-row>
        <Empty slot="empty" />
        <el-table-column align="center" label="优惠券名称" width="200">
          <template slot-scope="scope">{{ scope.row.couponName }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动栏目" width="200">
          <template slot-scope="scope">{{ activityType[scope.row.activityType] }}</template>
        </el-table-column>
        <el-table-column align="center" label="优惠券类型" width="120">
          <template slot-scope="scope">
            {{ scope.row.couponType | filterLabel(couponTypeList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="优惠内容" width="200">
          <template slot-scope="scope">{{ scope.row.couponContent || '-' }}</template>
        </el-table-column>
        <el-table-column :min-width="200" align="center" label="优惠券状态">
          <template slot-scope="scope">{{ scope.row.status | filterLabel(statusList) }}</template>
        </el-table-column>
        <el-table-column align="center" label="用劵时间" :min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ setUserTime(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="发放总量" width="200">
          <template slot-scope="scope">{{ scope.row.couponTotal == -1 ? '不限量' : scope.row.couponTotal }}</template>
        </el-table-column>
        <el-table-column align="center" label="已领取" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.receiveNum }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="剩余" width="200">
          <template slot-scope="scope">
            {{ scope.row.surplusNum == -1 ? '不限量' : scope.row.surplusNum == 0 ? '-' : scope.row.surplusNum }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="已使用">
          <template slot-scope="scope">
            {{ scope.row.usedNum }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="200">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="创建人" width="200">
          <template slot-scope="scope">{{ scope.row.createBy }}</template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="详情" v-show="hasAuthority('E2_22')" class="icon" placement="top">
              <el-link type="primary" :underline="false" @click="goAddEditPage(scope.row, true)">
                <i class="icon icon-see"></i>
              </el-link>
            </el-tooltip>
            <el-tooltip content="编辑" v-show="hasAuthority('E2_24')" class="icon" placement="top" v-if="scope.row.status !== statusEnum.FINISHED">
              <el-link type="primary" :underline="false" @click="goAddEditPage(scope.row)">
                <i class="icon icon-edit"></i>
              </el-link>
            </el-tooltip>
            <el-tooltip content="开始领取" v-show="hasAuthority('E2_25')" class="icon" v-if="scope.row.status === statusEnum.NOT_STARTED" placement="top">
              <el-link type="primary" :underline="false" @click="activityBegin(scope.row)">
                <i class="icon icon-processing"></i>
              </el-link>
            </el-tooltip>
            <el-tooltip content="结束领取" v-show="hasAuthority('E2_25')" class="icon" placement="top" v-if="scope.row.status === statusEnum.PROCESSING">
              <el-link type="primary" :underline="false" @click="activityEnd(scope.row)">
                <i class="icon icon-complete"></i>
              </el-link>
            </el-tooltip>
            <el-tooltip content="删除" v-show="hasAuthority('E2_23')" class="icon" placement="top">
              <el-link type="primary" :underline="false" @click="deleteCouponAPI(scope.row)">
                <i class="icon icon-del"></i>
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
import { getList, deleteCoupon, startOrFinish } from '@/api/newApi/extension/coupon.js';
import { couponTypeList, statusList, statusEnum, useTimeTypeEnum } from '../enumObj.js';
export default {
  data() {
    return {
      list: [],
      // 分页
      listTotal: 0,
      listLoading: false,
      initHeight: 65,
      listQuery: {
        page: 1,
        limit: 20,
        couponName: '',
        couponType: '', //优惠券类型
        status: '', //优惠券状态
      },
      searchFlag: false,
      activityType: {
        VIP_COUPON: '专享礼券（官网首页可见）',
        VOUCHER_CENTER_PC: '领券中心（客户端和小程序/可见）',
        POLITE_INVITATION: '领券活动（用户不可见）',
      },
      initHeight: 65,
      couponTypeList,
      statusList,
      statusEnum,
      useTimeTypeEnum,
    };
  },
  filters: {
    filterLabel(value, list) {
      let temp = list.find((item) => item.value === value);
      return temp ? temp.label : value;
    },
  },

  created() {
    this.listQuery.enterpriseId = window.localStorage.getItem('enterpriseId');
    this.queryData();
  },

  methods: {
    goAddEditPage(row, disabled = false) {
      let disabledType = disabled || row.status;
      this.$router.push({
        path: '/extension/activityManagement/coupon/addEdit',
        query: { source: 'ACTIVITY', disabledType, isEdit: row.marketingCouponActivityId },
      });
    },
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      getList(this.listQuery)
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

    /**开始领取 */
    activityBegin(row) {
      this.$confirm(`开始领取:${row.couponName}`, '开始领取', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        this.startOrFinishFun(row, 'PROCESSING');
      });
    },

    /**结束领取 */
    activityEnd(row) {
      this.$confirm(`确定结束领取:新会员专享？结束领取的优惠券不能重新开始领取，请谨慎操作`, '结束领取', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        this.startOrFinishFun(row, 'FINISHED');
      });
    },

    startOrFinishFun(row, status) {
      startOrFinish({ id: row.marketingCouponActivityId, status, enterpriseId: window.localStorage.getItem('enterpriseId') - 0 }).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '开始领取成功',
          });
          this.queryData();
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },

    setUserTime(row) {
      switch (row.useTimeType) {
        case this.useTimeTypeEnum.FIXED_TIME:
          return row.useTimeConfig.validStartDate + '~' + row.useTimeConfig.effectiveEndDate;
        case this.useTimeTypeEnum.TERM_EFFECTIVE:
          return '领券后立即生效，有效期' + row.useTimeConfig.day + '天';
        case this.useTimeTypeEnum.VALID_AFTER_EXPIRATION:
          return '领劵' + row.useTimeConfig.afterDayStart + '天后生效，有效期' + row.useTimeConfig.afterDayEnd + '天';
      }
    },

    handleReset() {
      this.$refs.searchForm.resetFields();
      console.log(111, this.listQuery);
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
    deleteCouponAPI(row) {
      this.$confirm(`确定删除？${row.couponName}么`, '删除优惠券', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        deleteCoupon({
          couponId: row.marketingCouponActivityId,
          enterpriseId: window.localStorage.getItem('enterpriseId') - 0,
        }).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '优惠券删除成功',
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
  },
};
</script>
<style lang="scss" scoped></style>
