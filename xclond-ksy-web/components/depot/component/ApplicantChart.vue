<template>
  <div class="lawyer-agent">
    <div class="title-header">
      <div class="title">申请人持有商标数量</div>
      <div class="top"></div>
      <div class="num">{{ total }}</div>
      <div class="tag">总申请量:</div>
    </div>
    <div class="loading" v-if="applicantLoading">
      <a-spin size="large" />
    </div>
    <div class="empty" v-show="!isShow">
      <img src="@/assets/images/depot/column.svg" alt="" />
      <div class="text">暂无数据</div>
    </div>
    <div ref="applicantChart" style="width: 100%; height: 259px" v-show="isShow"></div>
    <div class="pagination ksy-text-right ksy-mt-4" v-show="isShow">
      <a-pagination
        :current="Number(listPage.current) || 1"
        :total="Number(listPage.total) || 0"
        :pageSize="5"
        @change="change"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listPage: {
        current: 1,
        total: 1,
        size: 10,
      },
      total: 0,
      isShow: true,
    };
  },
  props: {
    topTrademarkList: {
      type: Object,
      default: {},
    },
    applicantLoading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    topTrademarkList(val) {
      this.listPage.current = val.current;
      this.listPage.total = val.total;
      let ydate = [];
      let xdate = [];
      if (val.records.length > 0) {
        ydate = val.records.map((item) => {
          return item.name;
        });
        xdate = val.records.map((item) => {
          return item.number;
        });
        this.total = val.records[0].total;
        this.isShow = true;
      } else {
        this.isShow = false;
      }
      let option = {
        color: ["#3370FF"],
        tooltip: {
          trigger: "item",
          position: function (point) {
            // 固定在顶部
            return [point[0], "50%"];
          },
          formatter: (params) => {
            return `
      <div style="font-size:12px;color:rgba(0,0,0,0.85);margin-bottom:10px;font-family:Source Han Sans CN-Medium;font-weight: 500;margin-bottom:23px">${params.name}</div>
      <div style="font-size: 12px;font-family: Source Han Sans CN-Normal;font-weight: 400;color: rgba(0,0,0,0.65);">当前持有<span style="font-size: 16px;font-family: Source Han Sans CN-Bold;font-weight: bold;color: #397EF0;;margin:2px">${params.value}</span>人次</div>
    	`;
          },
          extraCssText:
            "background-color:rgba(255, 255, 255, 0.8);padding:12px;box-shadow: 0px 3px 12px 1px rgba(57,126,240,0.22);border-radius: 4px;filter: blur(undefinedpx);border:none;",
        },
        grid: {
          left: "0",
          right: "30",
          bottom: "0", //下边距,
          top: "0",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          axisLabel: {
            //坐标轴字体颜色
            textStyle: {
              color: "rgba(0,0,0,0.85)",
              fontSize: "12",
              fontFamily: "Source Han Sans CN-Regular",
            },
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
          splitLine: {
            //网格
            show: true,
            lineStyle: {
              color: "rgba(0, 0, 0, 0.1)",
              type: "dashed",
            },
          },
        },
        yAxis: {
          type: "category",
          inverse: true,
          axisLabel: {
            //坐标轴字体颜色
            textStyle: {
              color: "rgba(0, 0, 0, 0.85)",
              fontSize: "12",
              fontFamily: "Source Han Sans CN-Regular",
            },
            formatter: function (value) {
              var maxlength = 8;
              if (value.length > maxlength) {
                return value.substring(0, maxlength - 1) + "...";
              } else {
                return value;
              }
            },
          },
          axisLine: {
            lineStyle: {
              color: "#CCCCCC",
            },
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
          splitLine: {
            //网格
            show: false,
          },
          data: ydate,
        },
        series: [
          {
            name: "当前预警人次",
            type: "bar",
            barWidth: "32px", //柱子宽度

            itemStyle: {
              barBorderRadius: [2, 2, 0, 0],
            },
            label: {
              show: true,
              formatter: "{c}",
              color: "#FFFFFF",
              fontSize: 14,
              position: "inside",
            },
            data: xdate,
          },
        ],
      };
      this.chart = this.$echarts.init(this.$refs.applicantChart);
      this.chart.setOption(option, true);
      this.chart.off().on("click", params => {
        this.$emit('change', {
          ownerNameList: [params.name],
        })
      })
    },
  },
  mounted() {},
  methods: {
    change(val) {
      this.$emit("changePageTrademark", val);
    },
  },
};
</script>

<style lang="less" scoped>
.lawyer-agent {
  padding: 16px;
  position: relative;
  .title-header {
    overflow: hidden;
    margin-bottom: 26px;

    .title {
      font-size: 18px;
      color: #303132;
      line-height: 30px;
      float: left;
      margin-right: 4px;
    }

    .top {
      width: 72px;
      height: 26px;
      background: url("@/assets/images/depot/top.svg") no-repeat;
      background-size: contain;
      float: left;
      margin-top: 7px;
    }

    .tag {
      float: right;
      height: 3px;
      font-size: 12px;
      color: #606266;
      line-height: 30px;
    }

    .num {
      float: right;
      height: 3px;
      font-size: 18px;
      color: @primaryClick;
      line-height: 30px;
      margin-left: 6px;
    }
  }
  .loading {
    z-index: 999;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    text-align: center;
    padding-top: 140px;
  }
  .empty {
    width: 74px;
    margin: 120px auto;
    img {
      display: block;
      width: 100%;
    }
    .text {
      margin-top: 8px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.25);
      line-height: 22px;
      text-align: center;
    }
  }
}
</style>
