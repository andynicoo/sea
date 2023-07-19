<template>
  <div class="line-static flex flex-b">
    <div class="line-static-hd">
      <div class="title">申请注册趋势</div>
      <a-checkbox-group v-if="bigest > 0" v-model="choose" @change="onChange">
        <a-checkbox v-for="(check, index) in filters" :key="index" :value="check.value" :disabled="check.disabled"
          ><span :style="{ color: check.color }">{{ check.label }}</span></a-checkbox
        >
      </a-checkbox-group>
    </div>
    <div class="line-static-bd flex flex-c-c">
      <div v-show="bigest > 0" id="main-line" style="width: 516px; height: 176px" ref="static-line"></div>
      <StaticEmpty v-show="bigest === 0" type="line" />
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
    maxData: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      //审核期  公告期 注册异常 已失效 已下证 已注册
      filters: [
        {
          label: "总代理",
          value: "总代理",
          color: "#6293F9",
          disabled: false,
          checked: true,
        },
        {
          label: "审核期",
          value: "审核期",
          color: "#5DC9F4",
          disabled: false,
          checked: false,
        },
        {
          label: "公告期",
          value: "公告期",
          color: "#F0B03B",
          disabled: false,
          checked: false,
        },
        {
          label: "已注册",
          value: "已注册",
          color: "#69B842",
          disabled: false,
          checked: false,
        },
        {
          label: "注册异常",
          value: "注册异常",
          color: "#EF6666",
          disabled: false,
        },
        {
          label: "已失效",
          value: "已失效",
          color: "#A3A3A3",
          disabled: false,
          checked: false,
        },
      ],
      choose: ["总代理"],
    };
  },
  computed: {
    xData() {
      return this.data.map((item) => item.xdate);
    },
    valueDatas() {
      let temp = {};
      const yValuesKey = this.filters.map((item) => item.value);
      yValuesKey.map((item) => {
        temp[item] = [];
      });
      this.data.map((item) => {
        item.statusList.map((status) => {
          let statusKey = status.name;
          if (yValuesKey.includes(statusKey)) {
            temp[statusKey].push(status.count);
          }
          //temp[statusKey].push(status.count);
        });
        temp["总代理"].push(item.ycount);
      });
      return temp;
    },
    seriesData() {
      let arr = [];
      this.choose.map((check) => {
        let temp = {
          name: "",
          color: "",
          type: "line",
          symbolSize: 8,
          data: [],
        };
        const datas = this.valueDatas[check];
        temp.color = this.filters.filter((item) => item.value === check)[0].color;
        temp.name = check;
        temp.data = datas;
        arr.push(temp);
      });
      return arr;
    },
    dataZoom() {
      return [];
    },
    option() {
      return {
        grid: {
          top: 10,
          bottom: 60, // 调整这个属性
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            animation: false,
          },
        },
        axisPointer: {
          link: [
            {
              xAxisIndex: "all",
            },
          ],
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 30,
            end: 70,
            xAxisIndex: [0, 1],
            height: 20,
            bottom: 10
          },
        ],
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: { onZero: true },
            data: this.xData,
          },
        ],
        yAxis: [
          {
            type: "value",
            max: this.bigest,
          },
        ],
        series: this.seriesData,
      };
    },
    bigest() {
      if (this.data.length) {
        let big = 0;
        this.data.forEach((outItem) => {
          outItem.statusList.forEach((inItem) => {
            if (big < +inItem.count) {
              big = +inItem.count;
            }
          });
          big = big < +outItem.ycount ? outItem.ycount : big;
        });
        return big;
      } else {
        return 0;
      }
    },
  },
  watch: {
    option: {
      handler(newVal) {
        if (newVal) {
          this.draw();
        }
      },
    },
    deep: true,
  },
  methods: {
    draw() {
      this.$nextTick(() => {
        if (this.valueDatas) {
          console.log("绘制折线图");
          this.chart = this.$echarts.init(this.$refs["static-line"]);
          this.chart.setOption(this.option, true);
        }
      });
    },
    onChange() {
      // todo
    },
  },
  mounted() {
    this.draw();
  },
};
</script>
<style lang="less" scoped>
.title {
  font-size: 14px;
  color: #303132;
  line-height: 22px;
}
.line-static {
  flex-direction: column;
  height: 100%;
  &-hd {
    margin-bottom: 6px;
  }
  &-bd {
    flex: 1;
    box-shadow: 0px 0px 3px #bbbbbb82;
  }
}
</style>
