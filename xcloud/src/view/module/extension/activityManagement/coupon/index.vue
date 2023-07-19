<template>
  <div class="app-container">
    <div class="header-container">
      <!-- 查询条件 -->
      <div class="search-box">
        <div class="search-box-header">
          <el-tabs v-model="activeTable" @tab-click="handleClick">
            <el-tab-pane label="优惠劵" name="0"></el-tab-pane>
            <el-tab-pane label="领取记录" name="1"></el-tab-pane>
          </el-tabs>
          <div class="btns">
            <el-button type="success" size="small" v-show="hasAuthority('E2_19')" @click="grantCoupon(sourceEnum.MANUAL)">发放优惠券(手动发)</el-button>
            <el-button type="success" size="small" v-show="hasAuthority('E2_20')" @click="grantCoupon(sourceEnum.ACTIVITY)">新建满减劵(用户领)</el-button>
          </div>
        </div>
      </div>
    </div>

    <CouponPage v-if="activeTable == 0" />
    <ReceivePage v-else />
  </div>
</template>
<script>
import CouponPage from './couponPage/index';
import { statusEnum, sourceEnum } from './enumObj';
import ReceivePage from './receivePage/index';
export default {
  data() {
    return {
      activeTable: 0,
      sourceEnum,
    };
  },

  watch: {
    activeTable: function (val) {
      return val;
    },
  },
  components: {
    CouponPage,
    ReceivePage,
  },

  methods: {
    handleClick() {},

    /** 发放优惠券 */
    grantCoupon(source) {
      this.$router.push({ path: '/extension/activityManagement/coupon/addEdit', query: { source, disabledType: statusEnum.NOT_STARTED } });
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
