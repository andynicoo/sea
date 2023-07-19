<template>
  <div class="lawyer">
    <div class="title">代理律师数据看板</div>
    <div class="lawyer-chart">
      <!-- 审查律师分配分析 -->
      <LawyerChart :distributionList="distributionList" :loading="loading" @change="data => $emit('change', data)" />
    </div>
    <div class="item">
      <!-- <div class="left">
       
        <LawyerAgentChart
          :topLawyerList="topLawyerList"
          @changePageAgent="changePageAgent"
          :agentLoading="agentLoading"
        />
      </div> -->
      <div class="right">
        <!-- 申请人持有商标数量 -->
        <ApplicantChart
          :topTrademarkList="topTrademarkList"
          @changePageTrademark="changePageTrademark"
          :applicantLoading="applicantLoading"
          @change="data => $emit('change', data)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LawyerChart from "./component/LawyerChart.vue";
import LawyerAgentChart from "./component/LawyerAgentChart.vue";
import ApplicantChart from "./component/ApplicantChart.vue";
export default {
  components: {
    LawyerChart,
    LawyerAgentChart,
    ApplicantChart,
  },
  data() {
    return {};
  },
  props: {
    distributionList: {
      type: Object,
      default: {},
    },
    topLawyerList: {
      type: Object,
      default: {},
    },
    topTrademarkList: {
      type: Object,
      default: {},
    },
    cateSmall: {
      type: String,
      default: "01",
    },
    cateBrand: {
      type: String,
      default: "01",
    },

    loading: {
      type: Boolean,
      default: false,
    },
    agentLoading: {
      type: Boolean,
      default: false,
    },
    applicantLoading: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {},
  methods: {
    changePageAgent(val) {
      this.$emit("pageAgent", val);
    },
    changePageTrademark(val) {
      this.$emit("pageTrademark", val);
    },
  },
};
</script>

<style lang="less" scoped>
.lawyer {
  .title {
    font-size: 24px;
    font-weight: 500;
    color: @textColor;
    border-left: 3px solid #3370ff;
    padding-left: 4px;
    line-height: 24px;
    margin-bottom: 20px;
    margin-top: 24px;
  }
  .lawyer-chart {
    background: #ffffff;
    border-radius: 10px 10px 10px 10px;
    margin-bottom: 16px;
    height: 342px;
  }

  .item {
    overflow: hidden;
    margin-bottom: 16px;

    .left {
      width: 590px;
      height: 399px;
      background: #ffffff;
      border-radius: 10px 10px 10px 10px;
      float: left;
    }

    .right {
      width: 100%;
      height: 399px;
      background: #ffffff;
      border-radius: 10px 10px 10px 10px;
      float: right;
    }
  }
}
</style>
