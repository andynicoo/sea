<template>
  <div class="pie-panel flex flex-b">
    <div class="pie-panel-hd flex flex-c"><slot name="title">商标分类布局</slot></div>
    <div class="pie-panel-bd flex flex-c-c">
      <div v-show="valueDatas.length" :id="id" style="width: 260px; height: 217px" ref="static-pie"></div>
      <StaticEmpty v-show="!valueDatas.length" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
      default: "main-pie",
    },
    left: {
      type: String,
      default: "34%",
    },
  },
  computed: {
    valueDatas() {
      let arr = [];
      if (this.data.length) {
        arr = this.data.map((item) => {
          const { nameZh, count, name } = item;
          return { value: count, name: nameZh || name };
        });
      }
      return arr;
    },
    option() {
      let obj = {
        tooltip: {
          trigger: "item",
        },
        color: ["#3370FF", "#87DDFE", "#84D480", "#FDDE69"],
        series: [
          {
            type: "pie",
            center: [this.left, "50%"],
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
              },
            },
            labelLine: {
              show: false,
            },
            data: this.valueDatas,
          },
        ],
      };
      if (this.left !== "50%") {
        obj.legend = {
          orient: "vertical",
          top: 50,
          right: "right",
        };
      }
      return obj;
    },
  },
  watch: {
    data: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  methods: {
    init() {
      this.$nextTick(() => {
        console.log("绘制饼图");
        this.chart = this.$echarts.init(this.$refs["static-pie"]);
        this.chart.setOption(this.option, true);
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="less" scoped>
.pie-panel {
  flex-direction: column;
  height: 100%;
  &-hd {
    font-size: 14px;
    color: #303132;
    line-height: 22px;
    margin-bottom: 6px;
    img {
      height: 12px;
      width: auto;
      margin-left: 4px;
    }
  }
  &-bd {
    flex: 1;
    box-shadow: 0px 0px 3px #bbbbbb82;
  }
}
</style>
