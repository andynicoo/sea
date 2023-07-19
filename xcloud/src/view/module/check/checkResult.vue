<template>
  <div class="check-result-wrapper" v-loading="loading">
    <div class="tab-wrapper">
      <div class="search-wrapper">
        <Search :inputVal="val" ref="search" @check="checkFn" :hiddenHistory="true" />
        <el-button type="primary" icon="el-icon-search" @click="check">查一查</el-button>
        <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
      </div>
      <div class="tab-block-wrapper">
        <div class="tab-block" v-for="(item, index) in tabList" :key="index" @click="tabNav = item.tab">
          <img class="tab-block-icon" :src="item.icon" alt="" />
          <div class="tab-block-title-wrapper">
            <div class="tab-block-title">{{ item.title }}</div>
            <div class="tab-block-content">{{ statisticsObj[item.tab] }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="info-wrapper">
      <el-tabs v-model="tabNav">
        <el-tab-pane :label="item.label" :name="item.value" v-for="(item, index) in tabs" :key="index"></el-tab-pane>
      </el-tabs>
      <CustomInfo ref="customInfo" v-show="tabNav === 'customInfo'" :type="type" :statisticsData="statisticsData" :tags="tags" />
      <OrderInfo ref="orderInfo" v-show="tabNav === 'orderInfo'" :type="type" :val="val" :firmList="firmList" />
      <ServiceInfo ref="serviceInfo" v-show="tabNav === 'serviceInfo'" :type="type" :val="val" :firmList="firmList" />
      <WarnInfo ref="warnInfo" v-show="tabNav === 'warnInfo'" :type="type" :val="val" :firmList="firmList" />
      <!-- <LifeCycle ref="lifeCycle" v-show="tabNav === 'lifeCycle'" :type="type" :val="val" /> -->
    </div>
  </div>
</template>

<script>
import CustomInfo from './components/customInfo';
import OrderInfo from './components/orderInfo';
import ServiceInfo from './components/serviceInfo';
import WarnInfo from './components/warnInfo';
// import LifeCycle from './components/lifeCycle';
import Search from './components/search';
import { checkStatistics } from '@/api/newApi/check/check.js';
import { getList } from '@/api/newApi/operations/firm.js';
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      loading: false,
      val: this.$route.params.val || '',
      type: this.$route.params.type || '',
      tabList: [
        { title: '客户', tab: 'customInfo', icon: require('@/assets/images/check/custom-icon.png') },
        { title: '订单', tab: 'orderInfo', icon: require('@/assets/images/check/order-icon.png') },
        { title: '服务', tab: 'serviceInfo', icon: require('@/assets/images/check/service-icon.png') },
        { title: '预警', tab: 'warnInfo', icon: require('@/assets/images/check/warn-icon.png') },
      ],
      statisticsObj: {},
      statisticsData: {},
      tags: {},
      tabs: [
        { label: '客户信息', value: 'customInfo' },
        { label: '订单信息', value: 'orderInfo' },
        { label: '服务信息', value: 'serviceInfo' },
        { label: '预警信息', value: 'warnInfo' },
        // { label: '生命周期', value: 'lifeCycle' },
      ],
      tabNav: 'customInfo',
      historyKey: 'checkHistoryList',
      firmList: [],
      showCompany: false,
    };
  },
  components: {
    CustomInfo,
    OrderInfo,
    ServiceInfo,
    WarnInfo,
    // LifeCycle,
    Search,
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.val = this.$route.params.val || '';
    this.type = this.$route.params.type || '';
    if (this.val) {
      this._check();
    }
  },
  watch: {
    '$store.state.check.isCheck'(val) {
      if (val) {
        this.search();
      }
    },
  },
  computed: {
    isCompany() {
      return this.type === '5';
    },
  },
  mounted() {
    this.getFirm();
    if (this.val) {
      this.search();
    }
  },
  methods: {
    getStorage() {
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            let checkObj = JSON.parse(localStorage.getItem('checkObj'));
            this.val = checkObj.val;
            this.type = checkObj.type;
          } catch (error) {}
          resolve();
        });
      });
    },
    async search() {
      await this.getStorage();
      this.$nextTick(() => {
        this._check();
      });
    },
    turnTabNav() {
      switch (this.type) {
        case '0':
        case '5':
          this.tabNav = 'customInfo';
          break;
        case '1':
          this.tabNav = 'orderInfo';
          break;
        case '3':
        case '4':
          this.tabNav = 'serviceInfo';
          break;
      }
    },
    ...mapMutations(['setCheck']),
    check() {
      this.$refs.search.check();
    },
    checkFn({ val, type }) {
      this.val = val;
      this.type = type;
      this._check();
    },
    _check() {
      this.$util.interruptRequest();
      this.setCheck(false);
      this.turnTabNav();
      this.setStorage();
      this.getData();
      this.$nextTick(() => {
        this.$refs.orderInfo.handleCurrentChange(1);
        this.$refs.serviceInfo.handleCurrentChange(1);
        this.$refs.warnInfo.handleCurrentChange(1);
        // this.$refs.lifeCycle.handleCurrentChange(1);
      });
    },
    getFirm() {
      getList({
        pageSize: -1,
      }).then((res) => {
        this.firmList = res.data.records;
      });
    },
    setStorage() {
      localStorage.setItem(
        'checkObj',
        JSON.stringify({
          val: this.val,
          type: this.type,
        })
      );
    },
    getData() {
      setTimeout(() => {
        this.loading = true;
      });
      checkStatistics({
        type: this.type,
        value: this.val,
      })
        .then((res) => {
          if (res.code === 0) {
            this.statisticsData = res.data;
            this.statisticsObj = {
              customInfo: this.isCompany ? this.val : res.data.custUserCustomers.map((item) => item.mobile).join('、'),
              orderInfo: res.data.orderNum,
              serviceInfo: res.data.workNum,
              warnInfo: res.data.earlyWarningNum,
            };
            this.tags = res.data.tags;
          } else {
            this.resetData();
          }
        })
        .catch(() => {
          this.resetData();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetData() {
      this.statisticsData = {};
      this.statisticsObj = {};
      this.tags = {};
    },
    reset() {
      this.val = '';
    },
  },
};
</script>

<style lang="less" scoped>
.company-list {
  width: 560px !important;
  top: 35px;
}
.check-result-wrapper {
  .tab-wrapper {
    padding: 20px 25px;
    background-color: #fff;
    margin-bottom: 15px;
    .search-wrapper {
      display: flex;
      position: relative;
      .search-box {
        width: 560px;
        margin-right: 20px;
      }
    }
    .tab-block-wrapper {
      display: flex;
      align-items: center;
      margin-top: 24px;
      .tab-block {
        flex: 1;
        padding: 26px 32px;
        border-radius: 4px;
        background-color: #f4f7f9;
        display: flex;
        align-items: center;
        cursor: pointer;
        &-icon {
          flex: 0 0 56px;
          width: 56px;
          height: 56px;
          margin-right: 20px;
        }
        &-title-wrapper {
          color: #333;
          .tab-block-title {
            font-size: 16px;
          }
          .tab-block-content {
            font-size: 18px;
            font-weight: bold;
          }
        }
        &:not(:last-child) {
          margin-right: 24px;
        }
      }
    }
  }
  .info-wrapper {
    padding: 20px 25px;
    background-color: #fff;
    min-height: calc(100vh - 345px);
    display: flex;
    flex-direction: column;
  }
}
</style>
