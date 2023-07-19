<template>
  <div class="static-status">
    <div class="static-status-hd">
      <span v-for="(item, index) in cate" :key="index">{{ item }}类,</span>近似状态统计
    </div>
    <div class="static-status-bd">
      <div ref="staticType" id="static-box" style="width: 100%; height: 300px"></div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: {
    cate: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState("staticConfig", ["primaryColor"]),
    dataSort() {
      if (this.data.length) {
        return this.data.sort((a, b) => {
          return Number(a.value) - Number(b.value);
        });
      } else {
        return [];
      }
    },
    typeData() {
      let arr = [];
      if (this.dataSort.length) {
        return this.dataSort.map((item) => item.name);
      }
      return arr;
    },
    option() {
      return {
        grid: {
          x: 56,
          y: 20,
          x2: 30,
          y2: 30,
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: this.typeData,
        },
        series: [
          {
            data: this.dataSort,
            type: "bar",
            itemStyle: {
              color: this.primaryColor,
            },
            label: {
              show: true,
              position: "right",
            },
          },
        ],
      };
    },
  },
  watch: {
    data: {
      handler(newVal) {
        if (newVal.length) {
          this.init();
        }
      },
      deep: true,
    },
  },
  methods: {
    init() {
      this.chart = this.$echarts.init(this.$refs.staticType);
      this.chart.setOption(this.option, true);
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="less" scoped>
.static-status {
  width: 319px;
  min-height: 342px;
  margin-top: 16px;
  background: #fff;
  padding: 16px;
  &-hd {
    font-size: 14px;
    font-weight: 500;
    color: #303132;
    line-height: 22px;
  }
}
</style>
