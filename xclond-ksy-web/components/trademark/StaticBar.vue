<template>
  <div class="agency-static-top flex flex-b">
    <template v-if="hasName">
      <div class="flex flex-c-b">
        <div class="user flex flex-c-c">
          <div v-if="!isOwner" class="img flex flex-c-c">
            <img src="~/assets/images/trademark/v230401/lawyerHead.png" alt="" />
          </div>
          <div class="flex flex-j-c flex-column">
            <b>{{ name }}</b>
            <span v-if="rangeDate.length"
              >统计日期：{{ moment(rangeDate[0]).format("YYYY/MM/DD") }}-{{
                moment(rangeDate[1]).format("YYYY/MM/DD")
              }}</span
            >
          </div>
        </div>
        <div class="bar flex flex-c">
          <RangeMonth v-on="$listeners"></RangeMonth>
        </div>
      </div>
      <div class="flex flex-c agency-static-nums">
        <dl>
          <dt>{{ title }}：</dt>
          <dd>{{ total }}</dd>
        </dl>
        <dl>
          <dt>审核期：</dt>
          <dd>{{ getDataByName("审核期") }}</dd>
        </dl>
        <dl>
          <dt>公告期：</dt>
          <dd>{{ getDataByName("公告期") }}</dd>
        </dl>
        <dl>
          <dt>已注册：</dt>
          <dd>{{ getDataByName("已注册") }}</dd>
        </dl>
        <dl>
          <dt>注册异常：</dt>
          <dd>{{ getDataByName("注册异常") }}</dd>
        </dl>
        <dl>
          <dt>已失效：</dt>
          <dd>{{ getDataByName("已失效") }}</dd>
        </dl>
        <dl>
          <dt>其他：</dt>
          <dd>{{ getDataByName("") }}</dd>
        </dl>
      </div>
    </template>
    <div v-else class="flex flex-c" style="height: 100%; font-size: 20px">{{ noText }}</div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props: {
    hasName: Boolean,
    status: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      default: "--",
    },
    title: {
      type: String,
      default: "累计代理商标量",
    },
    total: {
      type: Number,
      default: 0,
    },
    rangeDate: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    isOwner() {
      return this.$route.path === "/fastResult/brandPersonnel";
    },
    noText() {
      const path = this.$route.path;
      if (!this.hasName) {
        return path === "/fastResult/brandLawyer" ? "暂未查到该律师代理的商标数据。" : "暂未查到该持有人的商标数据";
      }
    },
  },
  data() {
    return {
      bar: [
        {
          label: "近一年申请",
          id: "1",
        },
        {
          label: "自定义",
          id: "3",
        },
      ],
      barId: "1",
      rangDate: [],
      monthArr: [],
      valueTime: ["", ""],
      endOpenMonth: false,
    };
  },
  watch: {
    // barId: {
    //   handler(newVal) {
    //     console.log("barId");
    //     const nowYear = new Date().getFullYear();
    //     const nowMonth = new Date().getMonth() + 1;
    //     let lastDate = this.getMothLastDate(nowYear, nowMonth); //获取当月最后一日
    //     let filterDate = [];
    //     // 今年
    //     if (+this.barId === 1) {
    //       filterDate = [
    //         `${nowYear - 1}-${this.dealNum(nowMonth + 1 > 12 ? 1 : nowMonth + 1)}-01`,
    //         `${nowYear}-${this.dealNum(nowMonth)}-${this.dealNum(lastDate)}`,
    //       ];
    //       console.log("barId 111");
    //       this.$emit("change", filterDate);
    //     } else if (+this.barId === 2) {
    //       // 去年
    //       filterDate = [`${nowYear - 1}-01-01`, `${nowYear - 1}-12-31`];
    //     } else {
    //     }
    //   },
    //   immediate: true,
    // },
  },
  mounted() {
    this.monthArr[0] = this.moment().format("YYYY") + "-01-01";
    this.monthArr[1] = this.moment().format("YYYY") + "-12-31";
    this.valueTime[0] = this.moment().format("YYYY") + "-01-01";
    this.valueTime[1] = this.moment().format("YYYY") + "-12-31";
  },
  methods: {
    moment,
    panelChange(value) {
      console.log("value", value);
    },
    getMothLastDate(year, month) {
      return new Date(year, month, 0).getDate();
    },
    disabledStartDateMonth(current) {
      const endValue = this.monthArr[1];
      if (!current || !endValue) {
        return false;
      }
      let year = this.moment(endValue).format("YYYY") * 1;
      let month = this.moment(endValue).format("M") * 1;
      //开始月份是根据结束月份往前推12个月，因此用下面的方法来处理，最后一个参数是月的个数
      let preDate = this.getMonthDiff(year, month, 1, 12);
      return current.valueOf() > endValue.valueOf() || current.valueOf() < this.moment(preDate).valueOf();
    },
    //结束月份的禁用判断
    disabledEndDateMonth(current) {
      const startValue = this.monthArr[0];
      if (!current || !startValue) {
        return false;
      }
      let year = this.moment(startValue).format("YYYY") * 1;
      let month = this.moment(startValue).format("M") * 1;
      //结束月份是根据开始月份往后推12个月，用下面的方法来处理，最后一个参数是月的个数，往前推是正数，往后推是负数。
      let nextDate = this.getMonthDiff(year, month, 1, -12);
      return current.valueOf() < startValue.valueOf() || current.valueOf() > this.moment(nextDate).valueOf();
    },
    //获取指定年月日的之前mon月数的时间，往前推是正数，往后推是负数
    getMonthDiff(year, month, day, mon) {
      if (month - mon < 0) {
        month = 12 + (month - mon);
        year -= 1;
      } else if (month - mon > 12) {
        month = month - mon - 12;
        year += 1;
      } else {
        month = month - mon;
      }
      var days = new Date(year, month, 0).getDate();
      if (day > days - 1) {
        day = days - 1;
      }
      return `${year}-${month}-${day}`;
    },
    //开始月份监听面板的变化
    handleStartOpenChangeMonth(open) {
      if (!open) {
        this.endOpenMonth = true;
      }
    },
    //结束月份监听面板的变化
    handleEndOpenChangeMonth(open) {
      this.endOpenMonth = open;
    },
    dealNum(num) {
      return +num > 9 ? num : `0${num}`;
    },
    getDataByName(name) {
      let val = 0;
      if (this.status.length) {
        const cur = this.status.filter((item) => item.name === name);
        if (cur.length) {
          return cur[0]["count"];
        }
      }
      return val;
    },
    onChange(date, dateString, type) {
      const dateArr = dateString.split("-");
      let arr = [...this.monthArr];
      console.log("dateArr", dateArr);
      if (type === "preDate") {
        let lastDate = this.getMothLastDate(dateArr[0], dateArr[1]);
        arr[0] = dateArr[0] + "-" + dateArr[1] + "-" + lastDate;
      } else {
        let lastDate = this.getMothLastDate(dateArr[0], dateArr[1]);
        arr[1] = dateArr[0] + "-" + dateArr[1] + "-" + lastDate;
      }
      this.monthArr = [...arr];
      this.$emit("change", this.monthArr);
    },
  },
};
</script>
<style lang="less" scoped>
.agency-static {
  &-wrap {
    padding: 16px 24px;
    background: #fff;
    font-size: 14px;
    color: #606266;
    line-height: 22px;
  }
  &-top {
    flex-direction: column;
    height: 100px;
    background: linear-gradient(90deg, #eef4fe 0%, rgba(238, 244, 254, 0) 100%);
    border-radius: 2px;
    padding: 8px 20px 10px;
    margin-bottom: 16px;
    .user {
      .img {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        margin-right: 13px;
        overflow: hidden;
        img {
          display: block;
          width: 100%;
        }
      }
      b {
        font-size: 18px;
        font-weight: 500;
        color: #303132;
      }
      span {
        font-size: 14px;
        color: #919498;
        line-height: 22px;
      }
    }
    .bar {
      ul {
        margin: 0;
        li {
          height: 32px;
          padding: 0 16px;
          border: 1px solid #d9d9d9;
          margin-left: -1px;
          cursor: pointer;
          &:first-child {
            border-radius: 2px 0 0 2px;
          }
          &:last-child {
            border-radius: 0 2px 2px 0;
          }
          &.active {
            color: @primaryColor;
            border-color: @primaryColor;
            & + li {
              border-left-color: @primaryColor;
            }
          }
        }
      }
      .ant-calendar-picker {
        margin-left: 24px;
      }
    }
  }
  &-nums {
    dl {
      display: flex;
      align-items: center;
      margin: 0 32px 0 0;
      &:first-child {
        font-size: 16px;
        dd {
          font-size: 20px;
          font-weight: 500;
        }
      }
      dd {
        margin-bottom: 0;
        color: @primaryColor;
      }
    }
  }
}
</style>
