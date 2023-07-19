<template>
  <div class="month-range" ref="monthPage">
    <a-radio-group v-model="type" @change="onChangeType">
      <a-radio-button v-for="(item, index) in typeList" :key="index" :value="item.value">{{
        item.label
      }}</a-radio-button>
    </a-radio-group>
    <a-range-picker
      v-show="type == 'custom'"
      :allowClear="false"
      :open="open"
      :placeholder="['开始月份', '结束月份']"
      format="YYYY-MM"
      :value="value"
      :mode="mode"
      @openChange="openChange"
      @panelChange="handlePanelChange"
      @change="handleChange"
      @ok="onOk"
      :getCalendarContainer="() => $refs['monthPage']"
      show-time
      style="width: 200px"
    >
    </a-range-picker>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      moment,      
      mode: ["month", "month"],
      value: [],
      // 默认为近一年
      defaultDate: [],
      open: false,
      typeList: [
        {
          value: "default",
          label: "近五年申请",
        },
        {
          value: "oneYear",
          label: "近一年申请",
        },
        {
          value: "custom",
          label: "自定义",
        },
      ],
      type: "default",
    };
  },
  computed: {
    rangeDate() {},
  },
  methods: {
    async onChangeType(e) {
      const value = e.target.value;
      if (value === "custom") {
        return;
      }      
      await this.getLatestDate(value === "default" ? 5 : 1);
      this.value = [...this.defaultDate];
      this.$emit("timeChange", this.defaultDate);
    },
    getTenNum(num) {
      return +num > 9 ? num : `0${num}`;
    },
    // 获取当月最后一天
    getMothLastDate(year, month) {
      let d = new Date(year, month, 0).getDate();
      return this.getTenNum(d);
    },
    // 获取日期
    getLatestDate(num) {
      let nowYear = this.moment().year();
      let nowMonth = this.moment().month() + 1;
      const dates = [
        ...[
          `${nowYear - num}-${this.getTenNum(nowMonth)}-01`,
          `${nowYear}-${this.getTenNum(nowMonth)}-${this.getMothLastDate(nowYear, nowMonth)}`,
        ],
      ];
      this.defaultDate = [...dates];
      this.$emit("timeChange", this.defaultDate);
    },
    handleChange(value) {
      this.value = value;
    },
    handlePanelChange(value) {
      this.value = value;
    },
    openChange(e) {
      this.open = e;
    },
    onOk(value) {
      console.log("选择了月份");
      let start = this.moment(value[0]).format("YYYY-MM-DD");
      let end = this.moment(value[1]).format("YYYY-MM-DD");
      let startYear = this.moment(start).year();
      let startMonth = this.moment(start).month() + 1;
      let endYear = this.moment(end).year();
      let endMonth = this.moment(end).month() + 1;
      let lastDate = this.getMothLastDate(endYear, endMonth);
      this.value = [
        ...[`${startYear}-${this.getTenNum(startMonth)}-01`, `${endYear}-${this.getTenNum(endMonth)}-${lastDate}`],
      ];
      this.$emit("timeChange", this.value);
    },
  },
  mounted() {
    this.getLatestDate(5);
    this.value = [...this.defaultDate];
  },
};
</script>
<style lang="less" scoped>
.month-range {
  /deep/ .ant-calendar-time .ant-calendar-footer .ant-calendar-time-picker-btn {
    display: none;
  }
}
</style>
