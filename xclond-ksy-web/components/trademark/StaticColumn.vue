<template>
  <div class="column-panel">
    <div class="column-panel-hd flex flex-c">
      代理律师 <img src="~/assets/images/trademark/v230401/top/top6.png" alt="" />
    </div>
    <div class="column-panel-bd flex flex-c-c">
      <div v-show="data.length" id="main-column" style="width: 100%; height: 217px" ref="static-column"></div>
      <StaticEmpty v-show="!data.length" type="line" />
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
    ...mapState("staticConfig", ["primaryColor"]),
    useData() {
      if (this.data.length) {
        return this.data.map((item) => {
          let temp = { ...item };
          if (temp.name === "") {
            temp.name = "其他";
          }
          return temp;
        });
      } else {
        return [];
      }
    },
    xData() {
      if (this.useData.length) {
        return this.useData.map((item) => item.name);
      } else {
        return [];
      }
    },
    yData() {
      if (this.xData.length) {
        let arr = [];
        this.xData.map((x) => {
          let temp = {};
          temp = this.useData.filter((d) => d.name === x)[0].count;
          arr.push(temp);
        });
        return arr;
      } else {
        return [];
      }
    },
    option() {
      return {
        grid: {
          top: 40,
          bottom: 20, // 调整这个属性
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "category",
          data: this.xData,
          axisLabel: {
            inside: false,
            textStyle: {
              color: this.primaryColor,
              fontSize: "10",
            },
            //文字换行
            formatter: function (value) {
              return value.length > 6 ? value.slice(0, 4) + "..." : value;
            },
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.yData,
            type: "bar",
            itemStyle: {
              normal: {
                color: "#3A7FFF",
              },
            },
            label: {
              show: true,
              position: "top",
            },
          },
        ],
      };
    },
  },
  watch: {
    data: {
      handler(newVal) {
        if (newVal) {
          this.init();
        }
      },
      deep: true,
    },
  },
  methods: {
    init() {
      this.$nextTick(() => {
        if (this.data.length) {
          console.log("绘制柱状图");
          this.chart = this.$echarts.init(this.$refs["static-column"]);
          this.chart.setOption(this.option, true);
        }
      });
    },
    strCut(arr) {
      return arr.map((item) => {
        if (item.length > 3) {
          return item.slice(0, 3) + "...";
        } else {
          return item;
        }
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="less" scoped>
.column-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 383px;
  height: 239px;
  &-hd {
    font-size: 14px;
    color: #303132;
    line-height: 22px;
    margin-bottom: 6px;
    img {
      display: block;
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
