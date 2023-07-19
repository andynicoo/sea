<template>
  <div class="standard">
    <div class="title" v-if="isTab">美标数据看板</div>
    <!-- 世界地图 -->
    <!-- <WorldMap :mapList="mapList" :loading="loading" /> -->
    <div class="item">
      <!-- 美标申请趋势 -->
      <DiscountChart
        :trendList="trendList"
        @changeDiscount="changeDiscount"
        :isTab="isTab"
        :disType="disType"
        :discountLoading="discountLoading"
      />
    </div>
    <div class="item">
      <div class="col">
        <!-- 美标申请分布 -->
        <PieSpreadChart
          :applyList="applyList"          
          @changeSpeardType="changeSpeardType"
          :isTab="isTab"
          :speType="speType"
          :speardLoading="speardLoading"
        />
      </div>
      <div class="col">
        <!-- 美标申请时效 -->
        <PieTimeChart
          :selectCountry="selectCountry"
          :timeList="timeList"
          @change="changeStatusTime"
          :isTab="isTab"
          :applyStatus="applyStatus"
          :timeLoading="timeLoading"
          :isChildEmit="isChildEmit"
        />
      </div>
    </div>
    <div class="item">
      <!-- 申请时效趋势 -->
      <ApplyPrescriptionTrend
        :applyPrescriptionTrendList="applyPrescriptionTrendList"
        @change="changeApplyPrescriptionTrend"
        :isTab="isTab"
        :disType="disType"
        :prescriptionTrendLoading="prescriptionTrendLoading"
        :prescriptionTrendType="prescriptionTrendType"
        :prescriptionTrendStatus="prescriptionTrendStatus"
      />
    </div>
  </div>
</template>
<script>
import WorldMap from "./component/WorldMap.vue";
import PieSpreadChart from "./component/PieSpreadChart.vue";
import DiscountChart from "./component/DiscountChart.vue";
import PieTimeChart from "./component/PieTimeChart.vue";
import ApplyPrescriptionTrend from "./component/ApplyPrescriptionTrend.vue";
export default {
  data() {
    return {};
  },
  props: {
    mapList: {
      type: Array,
      default: [],
    },
    applyList: {
      type: Array,
      default: [],
    },
    applyPrescriptionTrendList: {
      type: Array,
      default: [],
    },
    trendList: {
      type: Array,
      default: [],
    },
    timeList: {
      type: Object,
      default: {},
    },
    isTab: {
      type: Boolean,
      default: true,
    },
    speType: {
      type: String,
    },
    disType: {
      type: String,
    },
    applyStatus: {
      type: String,
      default: "NO_ASSIGNED_TO_EXAMINER",
    },
    loading: {
      type: Boolean,
      default: true,
    },
    speardLoading: {
      type: Boolean,
      default: false,
    },
    discountLoading: {
      type: Boolean,
      default: false,
    },
    prescriptionTrendLoading: {
      type: Boolean,
      default: false,
    },
    timeLoading: {
      type: Boolean,
      default: false,
    },
    selectCountry:{
      type: Array,
      default: [],
    },
    isChildEmit: {
      type: Boolean,
      default: false,
    },
    prescriptionTrendType:{
      type: String
    },
    prescriptionTrendStatus:{
      type: String,
    },
  },
  components: {
    WorldMap,
    PieSpreadChart,
    DiscountChart,
    PieTimeChart,
    ApplyPrescriptionTrend
  },
  mounted() {},
  methods: {
    changeStatusTime(val) {
      this.$emit("changeStatusTime", val);
    },
    changeDiscount(obj) {
      this.$emit("changeDiscount", obj);
    },
    changeSpeardType(val) {
      this.$emit("changeSpeard", val);
    },
    changeApplyPrescriptionTrend(obj){
      this.$emit("changeApplyPrescriptionTrend", obj);
    }
  },
};
</script>

<style lang="less" scoped>
.standard {
  margin-top: 24px;
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
  .item {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    width: 100%;

    .col {
      width: 588px;
      height: 430px;
      background: #fff;
      border-radius: 10px;
    }
  }
}
</style>
