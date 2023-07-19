<template>
  <div class="container">
    <div class="title">
      <span>申请时效走势</span>
      <a-popover :title="null">
        <template slot="content">
          <div class="content">
            展示商标各个阶段的处理时效：<br />
            分配审查律师（待分配）：当前还没分配审查律师的商标，其分配审查律师的平均时效（每天更新）<br />
            时效=当前日期 - 申请日期<br /><br />
            分配审查律师（已分配）：已经分配审查律师的商标，其分配审查律师的平均时效<br />
            时效=分配审查律师日期 - 申请日期<br /><br />
            审核期：审核期的平均时效<br />
            已经进入公共期的商标，时效=公告日期 - 分配审查律师日期；<br />
            未进入公共期的商标，时效=当前日期 - 分配审查律师日期；<br /><br />
            公告期：公告期的平均时效<br />
            已经注册成功的商标，时效=注册日期 - 公告日期；<br />
            未注册成功的商标，时效=当前日期 - 公告日期；<br /><br />
            注册成功：已经注册成功的商标，从商标提交申请到商标注册成功的平均时效<br />
            时效=注册日期-申请日期
          </div>
        </template>
        <a-icon type="question-circle" class="icon-question" />
      </a-popover>
    </div>
    <div class="types" v-if="isTab">
      <strong>类型</strong>
      <a-radio-group @change="handleChangeType" v-model="modelValue.type">
        <a-radio-button v-for="(item,index) in typeOptions" :key="index" :value="item.value">
          {{ item.label }}
        </a-radio-button>
      </a-radio-group>
      <strong class="node">节点</strong>
      <a-select
        class="select"
        v-model="modelValue.status"
        @change="handleChangeStatus"
        v-if="isTab"
      >
        <a-select-option :value="item.value" v-for="(item, index) in statusList" :key="index">
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <div class="loading" v-if="prescriptionTrendLoading">
      <a-spin size="large" />
    </div>
    <div class="empty" v-show="!isShow">
      <img src="@/assets/images/depot/discount.svg" />
      <div class="text">暂无数据</div>
    </div>
    <div ref="chart" class="chart" v-show="isShow"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      statusList: [
        { label: "分配审查律师(待分配)", value: "NO_ASSIGNED_TO_EXAMINER" },
        { label: "分配审查律师(已分配)", value: "ASSIGNED_TO_EXAMINER" },        
        { label: "审核期", value: "NEW_APPLICATION_ENTERED" },
        { label: "公告期", value: "OFFICIAL_GAZETTE_MAILED" },
        { label: "注册成功", value: "REGISTERED_PRINCIPAL_REGISTER" },
      ],
      typeOptions:[
        { label: "全部", value: "ALL"},
        { label: "国家", value: "COUNTRY"},
        { label: "分类", value: "CATEGORY"},
        // { label: "商标状态", value: "STATUS"},
      ],
      modelValue: {
        status: this.prescriptionTrendStatus,
        type: this.prescriptionTrendType,
      },      
      isShow: true,
    };
  },
  props: {
    prescriptionTrendType:{
      type: String
    },
    prescriptionTrendStatus:{
      type: String,
    },
    applyPrescriptionTrendList: {
      type: Array,
      default: [],
    },
    isTab: {
      type: Boolean,
      default: true,
    },
    prescriptionTrendLoading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    applyPrescriptionTrendList(val) {
      let colorArry = [
        "#3370FF",
        "#87DDFE",
        "#84D480",
        "#FDDE69",
        "#92B2FF",
        "#7FDFD8",
        "#8DC21F",
        "#EF9901",
        "#EE81BE",
      ];
      let isShow = false;
      let seriesData = []
      let yData = [];
      let legendData = []
      let xData = []
      
      if(this.modelValue.type === 'ALL') {        
        xData = val.map((item) => {
          if (Number(item.ycount) > 0) {
            isShow = true;
          }
          yData.push(item.timeRatio)
          return item.xDate;
        });
        seriesData =[{
          data: yData,
          type: 'line',
          // smooth: true
        }]
      }else{
        legendData = val.map(item => {
          return item.groupType
        })
        xData = val[0].trademarkTimeList.map( o => o.xDate)
        val.forEach((item, index) => {
          let json = {
            name: item.groupType,
            type: "line",
            // smooth: true,
            showAllSymbol: true,
            // symbol: "circle",
            // symbolSize: 1,
            data: [],
          };
          item.trademarkTimeList.forEach((k) => {
            json.data.push(k.timeRatio);
            isShow = true
          });
          seriesData.push(json);
        });
      }
      this.isShow = isShow;
      let option = {
        backgroundColor: "#fff",
        title: {
          textStyle: {
            rich: {
              a: {
                fontSize: 16,
                fontWeight: 600,
              },
            },
          },
          top: "2%",
          left: "2%",
        },
        legend: {
          data: legendData,
          textStyle: {
            align: "right",
          },
          top: "2%",
          right: "0%",
        },
        tooltip: {
          trigger: "axis",
          valueFormatter: (val) => `${val} 天`
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            realtime: true,
            start: 0,
            end: 70,
            xAxisIndex: [0, 70],
            height: 25,
            bottom: 10
          },
        ],
        grid: {
          top: 50,
          left: 60,
          right: 5,
          bottom: 65
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              show: true,
            },
            splitArea: {
              color: "#f00",
              lineStyle: {
                color: "#f00",
              },
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              margin: 10,
            },
            boundaryGap: false,
            data: xData,
          },
        ],

        yAxis: [
          {
            name: '天',
            nameTextStyle: {  
              fontSize: 12,
              padding: [0, 0, 6, -50],
            },
            type: "value",
            splitNumber: 4,
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: "#e3e3e3",
              },
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              margin: 20,
              formatter: `{value}`,
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: seriesData,
      };
      this.chart = this.$echarts.init(this.$refs.chart);
      this.chart.setOption(option, true);
    },
  },
  mounted() {},
  methods: {
    // 分类
    handleChangeType(e) {      
      this.$emit("change", {
        ...this.modelValue,
        type: e.target.value
      });
    },
    // 改变节点状态
    handleChangeStatus(val) {
      this.$emit("change", {
        ...this.modelValue,
        status: val
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  position: relative;
  padding: 15px 20px 20px;
  background: #fff;
  .title {
    font-size: 16px;
    color: #333;
    line-height: 30px;
    display: flex;
  }

  .types {
    margin-top: 15px;
    strong{
      margin-right: 10px;
    }
    strong.node{
      margin-left: 24px;
    }
    .select {
      width: 180px;
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
    margin: 80px auto;
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
    height: 350px
  }  
}
.content{
  line-height: 26px;
}
</style>
