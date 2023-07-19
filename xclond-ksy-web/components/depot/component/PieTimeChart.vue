<template>
  <div class="pie-time">
    <div class="title">
      美标申请时效
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
    <div class="types">
      <strong>国家</strong>
      <a-select
        class="select"
        v-model="modelValue.country"
        @change="handleChangeCountry"
        v-if="isSelect && isTab"
      >
        <a-select-option :value="item" v-for="(item, index) in countryList" :key="index">
          {{ item }}
        </a-select-option>
      </a-select>
      <strong>节点</strong>
      <a-select
        class="select select2"
        v-model="modelValue.status"
        @change="handleChangeStatus"
        v-if="isSelect && isTab"
      >
        <a-select-option :value="item.value" v-for="(item, index) in selectList" :key="index">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </div>
    <div class="loading" v-if="timeLoading">
      <a-spin size="large" />
    </div>
    <div class="empty" v-show="!isShow">
      <img src="@/assets/images/depot/round.svg" alt="" />
      <div class="text">暂无数据</div>
    </div>
    <div ref="chartTime" class="chart" v-show="isShow"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      selectList: [
        { name: "分配审查律师(待分配)", value: "NO_ASSIGNED_TO_EXAMINER" },
        { name: "分配审查律师(已分配)", value: "ASSIGNED_TO_EXAMINER" },        
        { name: "审核期", value: "NEW_APPLICATION_ENTERED" },
        { name: "公告期", value: "OFFICIAL_GAZETTE_MAILED" },
        { name: "注册成功", value: "REGISTERED_PRINCIPAL_REGISTER" },
      ],
      modelValue:{
        status: "NO_ASSIGNED_TO_EXAMINER",
        country: '全部',
      },
      countryList: [],
      isSelect: false,
      isShow: true,
    };
  },
  props: {
    timeList: {
      type: Object,
      default: {},
    },
    isTab: {
      type: Boolean,
      default: true,
    },
    applyStatus: {
      type: String,
    },
    timeLoading: {
      type: Boolean,
      default: false,
    },
    selectCountry: {
      type: Array,
      default: [],
    },
    isChildEmit: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    applyStatus(val) {
      this.status = val;
    },
    selectCountry:{
      handler(val) {
        this.countryList = this.selectCountry.length === 1 ? [...val] : ['全部', ...val]
        this.modelValue.country = this.countryList[0]
      },
      deep:true
    },
    timeList(val) {
      let total = 0;
      let totalConsuming = Number(val.totalConsuming);
      let data = val.statusData.map((item) => {
        total = total + Number(item.number);
        return { name: item.name, value: item.number };
      });
      if (total > 0) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
      if(!this.isChildEmit && this.selectCountry.length !== 1){
        this.modelValue.country = '全部'
      }
      let day = total ? parseFloat((totalConsuming / total).toFixed(2)) : "0";
      let option = {
        color: ["#3370FF", "#87DDFE", "#84D480", "#FDDE69", "#92B2FF", "#7FDFD8", "#8DC21F", "#EF9901", "#EE81BE"],
        tooltip: {
          trigger: "item",
        },
        // legend: {
        //   orient: "vertical",
        //   right: "right",
        //   top: "center",
        //   formatter: (name) => {
        //     const item = data.filter((item) => item.name === name)[0];
        //     let c = Number(item.value);
        //     let t = Number(total);
        //     let value = total == 0 ? total : parseFloat(((c / t) * 100).toFixed(2)) + "%";
        //     return `{name|${name}}{value| ${value}}`;
        //   },
        // },
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
            // name: "时效(天)",
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
            data: data,
          },
          {
            name: "平均时效(天)",
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
            data: [day],
          },
        ],
      };
      this.chart = this.$echarts.init(this.$refs.chartTime);
      this.chart.setOption(option, true);
    },
  },
  mounted() {
    this.isSelect = true;
  },
  methods: {
    // 改变节点状态
    handleChangeStatus(val) {
      this.$emit("change", {
        ...this.modelValue,
        status: val
      });
    },
    // 改变国家
    handleChangeCountry(val) {
      this.$emit("change", {
        ...this.modelValue,
        country: val
      });
    },
  },
};
</script>

<style lang="less" scoped>
.pie-time {
  padding: 16px;
  position: relative;
  .title {
    font-size: 16px;
    color: #303132;
    line-height: 30px;
  }
  .types{
    margin-top: 15px;
  }
  .select {
    width: 140px;
    margin: 0 32px 0 16px;
  }
  .select2{
    width: 180px;
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
.content{
  line-height: 26px;
}
</style>
