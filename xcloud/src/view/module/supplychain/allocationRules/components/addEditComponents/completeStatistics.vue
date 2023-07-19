<!-- 完成统计 -->

<template>
  <div class="main" v-show="isShow">
    <div>每日0时更新数据</div>
    <div>统计时间范围：最近半年</div>
    <div>预警时效：{{ delTime("warnDuration") || "--" }}</div>
    <div>交付时效：{{ delTime("deliverDuration") || "--" }}</div>
    <div>
      字段释义
      <el-tooltip class="item" effect="dark" placement="top-start">
        <div slot="content">
          <p>已提交：已经提交给供应商处理的单</p>
          <p>提前完成：服务预警之前供应商处理完成的单</p>
          <p>按时完成：服务已预警但在交付时效内供应商处理完成的单</p>
          <p>超时完成：服务超时后供应商处理完成的单</p>
          <p>未完成：已经提交给供应商，还未处理完成的单</p>
          <p>超时未完成：已经提交给供应商，且服务已超时都未完成的单</p>
        </div>
        <i class="el-icon-question text-warning"></i>
      </el-tooltip>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column fixed prop="realName" label="供应商"> </el-table-column>
      <el-table-column prop="workStatistics.submitted" label="已提交" align="center"></el-table-column>
      <el-table-column prop="workStatistics.advanceComplete" label="提前完成"> </el-table-column>
      <el-table-column prop="workStatistics.onTimeComplete" label="按时完成"> </el-table-column>
      <el-table-column prop="workStatistics.overtimeComplete" label="超时完成"> </el-table-column>
      <el-table-column prop="workStatistics.noComplete" label="未完成" align="center"></el-table-column>
      <el-table-column prop="workStatistics.overtimeNoComplete" label="超时未完成"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { number } from "echarts/lib/export";
import { getSupplierAllotRuleInfo } from "@/api/newApi/supplyChain/allocationRules.js";
import eaitMixins from "../../util/eaitMixins.js";
export default {
  name: "CompleteStatistics",
  mixins: [eaitMixins],
  props: {
    tabkey: {
      //当前点击的tab Key
      type: [Number, String],
      default: "1",
    },
    comKey: {
      //组件的key
      type: [Number, String],
      default: "1",
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    completeCom: {
      type: Object,
      default: () => {},
    },
    deliverDuration: Number, // 交付时效
    warnDuration: Number, // 预警时效
  },
  data() {
    return {
      id: this.$route.query.id || "",
      menuId: this.$route.query.menuId,
      allocationFunctionCode: this.$route.query.functionCode || 0,
      showType: 1,
      delData: this.$parent.$parent.infoData.durationConfigs,
    };
  },

  computed: {
    delTime() {
      return function (key) {
        if (this.delData) {
          let timeUnit = this.delData.timeUnit == "DAY" ? "天" : this.delData.timeUnit == "WEEK" ? "周" : "月";
          if (key == "warnDuration") {
            return this.delData.warnDuration ? this.delData.warnDuration + timeUnit : "--";
          } else {
            return this.delData.deliverDuration ? this.delData.deliverDuration + timeUnit : "--";
          }
        }
      };
    },
  },

  created() {
    if (this.id) {
      this.getInfo();
    }
  },
  methods: {
    getInfo() {
      getSupplierAllotRuleInfo({
        id: this.id,
        showType: this.showType,
        functionCode: this.allocationFunctionCode || 0,
      }).then((res) => {
        this.delData = res.data.durationConfigs;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  padding: 55px;
}
</style>
