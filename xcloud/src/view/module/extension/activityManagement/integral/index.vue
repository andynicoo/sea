<template>
  <div class="app-container">
    <div class="header-container">
      <!-- 查询条件 -->
      <div class="search-box">
        <div class="search-box-header">
          <el-tabs v-model="activeTable" @tab-click="handleClick">
            <el-tab-pane label="积分商品" name="0"></el-tab-pane>
            <el-tab-pane label="兑换记录" name="1"></el-tab-pane>
            <el-tab-pane label="商品分类" name="2"></el-tab-pane>
          </el-tabs>
          <div class="btns">
            <el-button type="success" size="small" v-show="activeTable === '0' && hasAuthority('E2_26')" @click="goProductDetail(0)">新增商品</el-button>
          </div>
        </div>
      </div>
    </div>
    <ProductPage v-if="activeTable === '0'" />
    <RecordPage v-else-if="activeTable === '1'" />
    <ClassifyPage v-else-if="activeTable === '2'" />
  </div>
</template>
<script>
import ProductPage from './productpage/index';
import RecordPage from './recordpage/index';
import ClassifyPage from './classifyPage/index';
const cunponType = {
  CREATECUNPON: 2,
  SENDCUNPON: 1,
};
export default {
  data() {
    return {
      activeTable: 0,
      cunponType,
    };
  },

  watch: {
    activeTable: function (val) {
      return val;
    },
  },
  components: {
    ProductPage,
    RecordPage,
    ClassifyPage,
  },

  methods: {
    handleClick() {},

    goProductDetail(type) {
      this.$router.push({ path: '/extension/activityManagement/integral/addEdit', query: { type } });
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
