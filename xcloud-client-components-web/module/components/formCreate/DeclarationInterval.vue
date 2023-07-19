<template>
  <div>
    <div class="declaration-interval">
      <template v-if="declarePeriod === 'lastDeclarePeriod'">
        <b class="disabled-mask" :class="{ maskWidth: disabled }"></b>
        <span class="declaration-start-time">{{ startTime || '开始月份' }}</span
        ><a-icon type="swap-right" /><a-month-picker
          :value="endTime"
          placeholder="结束月份"
          @change="endTimeChange"
          :disabled-date="endDisabledDate"
        />
      </template>
      <template v-else>
        <b class="disabled-mask position-right" :class="{ maskWidth: disabled }"></b
        ><a-month-picker
          class="month-picker"
          :value="startTime"
          placeholder="开始月份"
          @change="startTimeChange"
          :disabled-date="startDisabledDate"
        /><a-icon type="swap-right" /><span class="declaration-start-time">{{ endTime || '结束月份' }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  props: {
    value: { type: Array },
    formItem: { type: Object },
    fApi: { type: Object },
  },
  data() {
    return {
      currentVal: '1',
      startTime: null,
      endTime: null,
      disabled: false,
      // quarterTips: false,
      // yearTips: false,
      declarePeriod: 'lastDeclarePeriod',
    };
  },
  mounted() {
    this.declarePeriod = this.formItem.keyName;
    // if (
    //   !['0', '1', '2'].includes(this.fApi.getValue('currentDeclarePeriod')) ||
    //   this.formItem.keyName === 'nextDeclarePeriod'
    // ) {
    // this.disabled = true;
    // } else {
    //   this.disabled = false;
    // }
  },

  watch: {
    value: {
      immediate: true, // 这是为了第一次拿到值的时候就对sd进行监听
      handler(val) {
        this.currentVal = val;
        console.log(val, 9999);
        // this.yearTips = false;
        // this.quarterTips = false;

        if (val && val[0]) {
          this.startTime = val[0];
          this.endTime = val[1] ? val[1] : null;
          // let currentDeclarePeriodVal = this.fApi.getValue('currentDeclarePeriod');
          // if (currentDeclarePeriodVal === '1') {
          //   let month = moment(this.startTime).month() + 1;
          //   if (![1, 4, 7, 10].includes(month)) {
          //     this.quarterTips = true;
          //   }
          // } else if (currentDeclarePeriodVal === '2') {
          //   let month = moment(this.startTime).month() + 1;
          //   if (![1].includes(month)) {
          //     this.yearTips = true;
          //   }
          // }
        } else {
          this.startTime = null;
          this.endTime = null;
        }
      },
    },
  },
  methods: {
    endTimeChange(date, dateString) {
      console.log(date, dateString);
      let declarePeriodVal = this.fApi.getValue('declarePeriod');
      if (this.declarePeriod === 'lastDeclarePeriod') {
        this.fApi.setValue({ currentDeclarePeriod: declarePeriodVal });
      }
      let currentDeclarePeriodVal = this.fApi.getValue('currentDeclarePeriod');
      if (!dateString) {
        return this.fApi.setValue({
          lastDeclarePeriod: [],
          nextDeclarePeriod: [],
        });
      }

      if (declarePeriodVal === '1') {
        let startDateString = moment(dateString)
          .add(-2, 'M')
          .format('YYYY-MM');
        this.fApi.setValue({
          lastDeclarePeriod: [startDateString, dateString],
        });
      } else if (declarePeriodVal === '2') {
        let startDateString = moment(dateString)
          .add(-11, 'M')
          .format('YYYY-MM');
        this.fApi.setValue({
          lastDeclarePeriod: [startDateString, dateString],
        });
      } else {
        this.fApi.setValue({
          lastDeclarePeriod: [dateString, dateString],
        });
      }
      if (currentDeclarePeriodVal === '1') {
        let startNextDateString = moment(dateString)
          .add(1, 'M')
          .format('YYYY-MM');
        let endNextDateString = moment(dateString)
          .add(3, 'M')
          .format('YYYY-MM');
        this.fApi.setValue({
          nextDeclarePeriod: [startNextDateString, endNextDateString],
        });
      } else if (currentDeclarePeriodVal === '2') {
        let startNextDateString = moment(dateString)
          .add(1, 'M')
          .format('YYYY-MM');
        let endNextDateString = moment(dateString)
          .add(12, 'M')
          .format('YYYY-MM');
        this.fApi.setValue({
          nextDeclarePeriod: [startNextDateString, endNextDateString],
        });
      } else {
        let nextDateString = moment(dateString)
          .add(1, 'M')
          .format('YYYY-MM');
        this.fApi.setValue({
          nextDeclarePeriod: [nextDateString, nextDateString],
        });
      }
      this.fApi.validateField('lastDeclarePeriod');
      this.fApi.validateField('nextDeclarePeriod');
    },
    startTimeChange(date, dateString) {
      console.log(date, dateString);
      // let declarePeriodVal = this.fApi.getValue('declarePeriod');
      // if (this.declarePeriod === 'lastDeclarePeriod') {
      //   this.fApi.setValue({ currentDeclarePeriod: declarePeriodVal });
      // }
      let currentDeclarePeriodVal = this.fApi.getValue('currentDeclarePeriod');
      if (!dateString) {
        return this.fApi.setValue({
          nextDeclarePeriod: [],
        });
      }

      if (currentDeclarePeriodVal === '1') {
        let endNextDateString = moment(dateString)
          .add(2, 'M')
          .format('YYYY-MM');
        this.fApi.setValue({
          nextDeclarePeriod: [dateString, endNextDateString],
        });
      } else if (currentDeclarePeriodVal === '2') {
        let endNextDateString = moment(dateString)
          .add(11, 'M')
          .format('YYYY-MM');
        this.fApi.setValue({
          nextDeclarePeriod: [dateString, endNextDateString],
        });
      } else {
        this.fApi.setValue({
          nextDeclarePeriod: [dateString, dateString],
        });
      }
      this.fApi.validateField('lastDeclarePeriod');
      this.fApi.validateField('nextDeclarePeriod');
    },
    endDisabledDate(current) {
      console.log(this.formItem.keyName);
      let declarePeriodVal = this.fApi.getValue('declarePeriod');
      if (declarePeriodVal === '1') {
        let month = moment(current).month() + 1;
        return current && ![3, 6, 9, 12].includes(month);
      } else if (declarePeriodVal === '2') {
        let month = moment(current).month() + 1;
        return current && ![12].includes(month);
      } else {
        return false;
      }
    },
    startDisabledDate(current) {
      console.log(this.formItem.keyName);
      let declarePeriodVal = this.fApi.getValue('currentDeclarePeriod');
      let lastDeclarePeriodVal = this.fApi.getValue('lastDeclarePeriod')[1];
      let noSelect = true;
      if (lastDeclarePeriodVal) {
        noSelect = moment(current).diff(moment(lastDeclarePeriodVal), 'months') < 1;
      } else {
        noSelect = true;
      }
      if (declarePeriodVal === '1') {
        let month = moment(current).month() + 1;
        return noSelect || (current && ![1, 4, 7, 10].includes(month));
      } else if (declarePeriodVal === '2') {
        let month = moment(current).month() + 1;
        return noSelect || (current && ![1].includes(month));
      } else {
        return noSelect || false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.declaration-interval {
  position: relative;
  width: 300px;
  height: 32px;
  background: #ffffff;
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #d9d9d9;
  color: rgba(0, 0, 0, 0.35);
  vertical-align: top;
  /deep/.ant-input {
    width: 135px !important;
    border: none;
    height: 30px;
    color: rgba(0, 0, 0, 0.35);
  }
  /deep/.ant-calendar-picker {
    vertical-align: top;
  }
  .declaration-start-time {
    width: 135px;
    display: inline-block;
    height: 30px;
    text-align: center;
    margin-right: 12px;
  }
  .disabled-mask {
    position: absolute;
    top: 0;
    left: 0;
    height: 30px;
    width: 135px;
    background: rgba(0, 0, 0, 0.05);
    z-index: 2;
  }
  .position-right {
    left: auto;
    right: 0;
  }
  .maskWidth {
    width: 100%;
  }
  .month-picker {
    vertical-align: top;
  }
}
</style>
