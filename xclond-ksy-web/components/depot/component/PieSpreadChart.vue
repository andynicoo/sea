<template>
  <div class="pie-speard">
    <div class="title">
      美标申请分布
      <a-popover :title="null">
        <template slot="content">
          <p class="ksy-mb-0">展示所选条件下的商标，按国家、分类及商标状态的分布情况</p>
        </template>
        <a-icon type="question-circle" class="icon-question" />
      </a-popover>
    </div>
    <div class="types" v-if="isTab">
      <a-radio-group @change="changeType" v-model="type">
        <a-radio-button v-for="(item,index) in typeOptions" :key="index" :value="item.value">
          {{ item.label }}
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class="loading" v-if="speardLoading">
      <a-spin size="large" />
    </div>
    <div class="empty" v-show="!isShow">
      <img src="@/assets/images/depot/round.svg" alt="" />
      <div class="text">暂无数据</div>
    </div>
    <div ref="chartSpread" class="chart" v-show="isShow"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      typeOptions:[
        // { label: "全部", value: "ALL"},
        { label: "国家", value: "COUNTRY"},
        { label: "分类", value: "CATEGORY"},
        { label: "状态", value: "STATUS"},
      ],
      type: this.speType,
      isShow: true,
      load: true,
    };
  },
  props: {
    applyList: {
      type: Array,
      default: [],
    },
    isTab: {
      type: Boolean,
      default: true,
    },
    speType: {
      type: String,
    },
    speardLoading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    speType(val) {
      this.type = val;
    },
    applyList(val) {
      if (val.length > 6) {
        val = val.slice(0, 6);
      }
      let text = "";
      let name = "暂无数据";
      let valData = [];
      if (val.length > 0) {
        valData = val.map((item) => {
          return { name: item.name, value: item.number, total: item.total };
        });
        name = "美标申请量";
      }
      if (valData.length > 0) {
        text = valData[0].total;
        this.isShow = true;
      } else {
        this.isShow = false;
      }
      let option = {
        color: ["#3370FF", "#87DDFE", "#84D480", "#FDDE69", "#92B2FF", "#7FDFD8", "#8DC21F", "#EF9901", "#EE81BE"],
        tooltip: {
          trigger: "item",
        },
        textStyle: {
          rich: {
            name: {
              color: "#919498",
              fontSize: 14,
              width: 100,
            },
            value: {
              color: "#919498",
              fontSize: 14,
              width: 100,
            },
          },
        },
        series: [
          {
            name: name,
            type: "pie",
            radius: ["40%", "65%"],
            center: ["50%", "50%"],
            label: {
              position: 'outer',
              alignTo: 'edge',
              margin: 20,
              formatter:`{percent|{d}%}\n{name|{b}}`,
              rich:{
                percent:{
                  height: 30,
                  fontSize: '16px',
                  color:'#3370FF',
                  lineHeight: 28,
                },
                name:{
                  color:'#999'
                }
              }
            },
            data: valData,
          },
          {
            name: name,
            type: "pie",
            radius: ["0%", "0%"],
            center: ["50%", "50%"],
            itemStyle: {
              color: "transparent",
            },
            label: {
              position: "inside",
              formatter: `{data|{c}}\n{serie|{a}}`,
              rich: {
                data: {
                  fontWeight: "400",
                  fontSize: 24,
                  color: `#3370FF`,
                  lineHeight: 36,
                },
                serie: {
                  fontSize: 14,
                  color: `#999`,
                },
              },
            },
            data: [text],
          },
        ],
      };
      this.chart = this.$echarts.init(this.$refs.chartSpread);
      this.chart.setOption(option, true);
    },
  },
  mounted() {},
  methods: {
    // 分类
    changeType(e) {
      this.type = e.target.value;
      this.$emit("changeSpeardType", this.type);
    },
  },
};
</script>

<style lang="less" scoped>
.pie-speard {
  padding: 16px;
  position: relative;
  .title {
    font-size: 16px;
    color: #303132;
    line-height: 30px;
    display: flex;
  }

  .types {
    margin-top: 15px;
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
    margin: 100px auto;
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
  .chart{
    margin-top: 15px;
    height: 300px
  }
}
</style>
