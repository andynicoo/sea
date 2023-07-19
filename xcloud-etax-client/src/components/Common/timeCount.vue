<template>
  <div class="meClocker">
    <div class="run-time" v-if="timeobj.hours || timeobj.minutes || timeobj.seconds">
      <template v-if="showDay">
        <span class="timing">{{ timeobj.days | add0 }}</span>
        <span class="flag-time">天</span>
      </template>
      <span class="timing">{{ timeobj.hours | add0 }}</span>
      <span class="flag-time">时</span>
      <span class="timing">{{ timeobj.minutes | add0 }}</span>
      <span class="flag-time">分</span>
      <span class="timing">{{ timeobj.seconds | add0 }}</span>
      <span class="flag-time">秒</span>
    </div>
    <div class="txt-time">{{ msg }}</div>
  </div>
</template>
<script>
import { boolean, string } from 'mathjs';
export default {
  name: 'home-clock',
  data() {
    return {
      clocker: '', // 显示倒计时
      timeobj: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      msg: '',
      go: null,
    };
  },
  filters: {
    add0: function (num) {
      return num < 10 ? '0' + num : num;
    },
  },
  props: {
    startTime: String,
    endTime: String,
    showDay: {
      type: Boolean,
      default: () => false,
    },
  },
  methods: {
    timeStatus() {
      clearInterval(this.go);
      let begDate = new Date(this.startTime);
      let endDate = new Date(this.endTime);
      let end = endDate.getTime(); // 结束秒数
      let beg = begDate.getTime(); // 开始秒数

      this.go = setInterval(function () {
        timeFunction();
      }, 1000);

      let timeFunction = () => {
        let date = new Date();
        let now = date.getTime();
        let leftTime = end - now;
        let begTime = beg - now;
        if (begTime >= 0) {
          this.msg = '后开始';
          this.timeobj = {
            days: Math.floor(begTime / 1000 / 60 / 60 / 24),
            hours: this.showDay ? Math.floor((begTime / 1000 / 60 / 60) % 24) : Math.floor(begTime / 1000 / 60 / 60),
            minutes: Math.floor((begTime / 1000 / 60) % 60),
            seconds: Math.floor((begTime / 1000) % 60),
          };
        } else if (leftTime >= 0) {
          this.msg = '后结束';
          this.timeobj = {
            days: Math.floor(leftTime / 1000 / 60 / 60 / 24),
            hours: this.showDay ? Math.floor((leftTime / 1000 / 60 / 60) % 24) : Math.floor(leftTime / 1000 / 60 / 60),
            minutes: Math.floor((leftTime / 1000 / 60) % 60),
            seconds: Math.floor((leftTime / 1000) % 60),
          };
        } else {
          this.msg = '后结束';
          this.timeobj = {
            days: '0',
            hours: '0',
            minutes: '0',
            seconds: '0',
          };
          clearInterval(this.go);
        }
      };
      timeFunction();
    },
  },
  created() {
    this.timeStatus();
  },
  beforeDestroy() {
    clearInterval(this.go);
    this.go = null;
  },
};
</script>
<style lang="less" scoped>
.meClocker {
  display: flex;
  align-items: center;
  font-size: 14px;
  .txt-time {
    margin-right: 12px;
  }
  .run-time {
    display: flex;
    align-items: center;
    .timing {
      margin-right: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 2px 2px 2px 2px;
    }
    .flag-time {
      margin-right: 12px;
    }
  }
}
</style>
