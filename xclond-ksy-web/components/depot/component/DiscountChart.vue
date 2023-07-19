<template>
  <div class="discount">
    <div class="title">
      <span 
        @click="handleChangeStatissticsType(item)"
        v-for="(item,index) in statissticsTypeOptions"
        :key="index"
        :class="item.value === statissticsType ? 'active' : ''"
      >{{ item.label }}</span>
      <a-popover :title="null">
        <template slot="content">
          <div class="content">
            申请总量：商标申请总量<br/>
            通过率：已经通过审核的商标数/商标申请总数<br/>
            审查率：已经分配了审查律师且触发了OA的商标数/已经分配了审查律师的商标数
          </div>
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
    <div class="loading" v-if="discountLoading">
      <a-spin size="large" />
    </div>
    <div class="empty" v-show="!isShow">
      <img src="@/assets/images/depot/discount.svg" alt="" />
      <div class="text">暂无数据</div>
    </div>
    <div ref="chart" class="chart" v-show="isShow"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 统计维度
      statissticsTypeOptions: [{
        label:'申请总量走势',
        value: 1
      },{
        label:'通过率走势',
        value: 2
      },{
        label: 'OA率走势',  
        value: 3
      }],
      statissticsType: 1,
      type: this.disType,
      isShow: true,
    };
  },
  props: {
    trendList: {
      type: Array,
      default: [],
    },
    isTab: {
      type: Boolean,
      default: true,
    },
    disType: {
      type: String,
    },
    discountLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed:{
    typeOptions(){
      let options = [{ label: "全部", value: "ALL"},
        { label: "国家", value: "COUNTRY"},
        { label: "分类", value: "CATEGORY"},]
      return this.statissticsType === 1 ? [...options,{ label: "状态", value: "STATUS"}] : options
    }    
  },
  watch: {
    disType(val) {
      this.type = val;
    },
    trendList(val) {
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
      let nameData = []
      let seriesData = [];
      let yData=[];
      let xData = val.map((item) => {
        if (Number(item.ycount) > 0) {
          isShow = true;
        }
        // 1申请总量走势,2通过率走势,3审查率走势
        yData.push(this.statissticsType === 1 ? item.ycount : this.statissticsType === 2 ?  (item.passRatio * 100).toFixed(2) : (item.oaRatio * 100).toFixed(2))
        return item.xDate;
      });
      // 类型为全部ALL时，数据结构不同
      if(this.type === 'ALL'){
        // nameData = this.statissticsType === 1 ? ['申请总量'] : this.statissticsType === 2 ?  ['通过率'] : ['审查率']
        seriesData=[{
          type: "line",
          // smooth: true,
          data: yData
        }]        
      } else {
      let long = val[0].statusList;
      if (val[0].statusList.length > 5) {
        long = val[0].statusList.slice(0, 5);
      }      
      nameData = long.map((item) => {
        return item.name;
      });      
      this.isShow = isShow;      
      nameData.forEach((item, index) => {
        let json = {
          name: item,
          type: "line",
          // smooth: true,
          showAllSymbol: true,
          // symbol: "circle",
          // symbolSize: 1,
          lineStyle: {
            normal: {
              color: colorArry[index],
            },
          },
          itemStyle: {
            color: colorArry[index],
            borderWidth: 3,
            borderColor: "#f3f3f3",
          },
          data: [],
        };
        val.forEach((i) => {
          i.statusList.forEach((k) => {
            if (item == k.name) {
              // 1申请总量走势,2通过率走势,3审查率走势
              json.data.push(this.statissticsType === 1 ? k.count : this.statissticsType === 2 ? (k.passRatio * 100).toFixed(2) : (k.oaRatio * 100).toFixed(2));
            }
          });
        });
        seriesData.push(json);
      });
      }
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
          data: nameData,
          textStyle: {
            align: "right",
          },
          top: "2%",
          right: "0%",
        },
        tooltip: {
          trigger: "axis",
          // 1申请总量走势,2通过率走势,3审查率走势
          valueFormatter: (value) => this.statissticsType === 1 ? `${value} 个` :  this.statissticsType === 2 ? `${value}%` : `${value}%`
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
          left: 70,
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
            name: `${this.statissticsType === 1 ? '个' : '%'}`,
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
  methods: {
    // 统计维度
    handleChangeStatissticsType(item){
      this.statissticsType = item.value
      this.$emit("changeDiscount",{
        statissticsType: item.value,
        type: this.type
      });
    },
    // 分类
    changeType(e) {
      this.type = e.target.value;
      this.$emit("changeDiscount",{
        type: this.type,
        statissticsType: this.statissticsType,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.discount {
  width: 100%;
  position: relative;
  padding: 15px 20px 20px;
  background: #fff;
  .title {
    font-size: 16px;
    color: #303132;
    line-height: 30px;
    display: flex;
    span{
      margin-right: 24px;
      color:#aaa;
      cursor: pointer;
    }
    span.active{
      color:#303132;
      font-weight: 700;
    }
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
  line-height: 28px;
}
</style>
