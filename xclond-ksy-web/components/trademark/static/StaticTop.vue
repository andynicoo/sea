<template>
  <div class="top-static">
    <div class="top-static-hd">近似商标热门类别<img src="~/assets/images/trademark/v230401/top/top5.png" alt="" /></div>
    <div class="top-static-bd">
      <div ref="staticTop" id="static-box" style="height: 330px"></div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState("staticConfig", ["colors"]),
    option() {
      return {
        // tooltip: {
        //   trigger: "axis",
        // },
        tooltip: {
          trigger: "item",
        },
        color: this.colors.slice(0, 5),
        legend: {
          bottom: 10,
          left: "center",
        },
        series: [
          {
            type: "pie",
            center: ["50%", "40%"],
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
              },
            },
            labelLine: {
              show: false,
            },
            data: this.data,
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
      this.chart = this.$echarts.init(this.$refs.staticTop);
      this.chart.setOption(this.option, true);
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="less" scoped>
.top-static {
  background: #fff;
  padding: 16px;
  &-hd {
    font-size: 14px;
    font-weight: 500;
    color: #303132;
    line-height: 22px;
    img {
      height: 10.5px;
      margin-left: 4px;
    }
  }
  &-bd {
  }
}
</style>
