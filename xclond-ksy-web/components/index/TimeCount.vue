<template>
  <div class="meClocker">
    <div class="txt-time">{{msg}}</div>
    <div class="run-time" v-if="timeobj.hours || timeobj.minutes || timeobj.seconds">
<!--      <tempalte v-if="timeobj.days">-->
<!--        <span class="timing">{{timeobj.days | add0}}</span>-->
<!--        <span class="flag-time">天</span>-->
<!--      </tempalte>-->
      <span class="timing">{{timeobj.hours | add0}}</span>
      <span class="flag-time">时</span>
      <span class="timing">{{timeobj.minutes | add0}}</span>
      <span class="flag-time">分</span>
      <span class="timing">{{timeobj.seconds | add0}}</span>
      <span class="flag-time">秒</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'home-clock',
  data() {
    return {
      clocker: "", //显示倒计时
      timeobj: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      msg: '',
      go:null
    };
  },
  filters: {
    add0: function (num) {
      return num < 10 ? "0" + num : num;
    }
  },
  props: ["startTime", "endTime"],
  methods:{
    timeStatus(){
      clearInterval(this.go);
      let begDate = new Date(this.startTime);
      let endDate = new Date(this.endTime);
      let end = endDate.getTime(); // 结束秒数
      let beg = begDate.getTime(); // 开始秒数

      let timeFunction = () => {
        let date = new Date();
        let now = date.getTime();
        let leftTime = end - now;
        let begTime = beg - now;
        if (begTime >= 0) {
          this.msg = '距秒杀开始还有';
          this.timeobj = {
            // days: Math.floor(begTime / 1000 / 60 / 60 / 24),
            hours: Math.floor(begTime / 1000 / 60 / 60),
            minutes: Math.floor(begTime / 1000 / 60 % 60),
            seconds: Math.floor(begTime / 1000 % 60)
          };
        } else if (leftTime >= 0) {
          this.msg = '距秒杀结束还有';
          this.timeobj = {
            // days: Math.floor(leftTime / 1000 / 60 / 60 / 24),
            hours: Math.floor(leftTime / 1000 / 60 / 60),
            minutes: Math.floor(leftTime / 1000 / 60 % 60),
            seconds: Math.floor(leftTime / 1000 % 60)
          };
        } else {
          this.msg = "秒杀已结束";
          clearInterval(this.go);
        }
      };
      timeFunction();
      if (process.client) {
        this.go = setInterval(timeFunction, 1000);
      }
    }
  },
  created() {
    this.timeStatus()
  },
  beforeDestroy() {
    if (process.client) {
      clearInterval(this.go);
      this.go=null
    }
  },
};
</script>
<style lang="less" scoped>
.meClocker {
  display: flex;
  align-items: center;
  color: rgba(@textColor, .9);
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
      background: rgba(@tagColor, .1);
      border-radius: 2px 2px 2px 2px;
      color: @priceColor;
    }
    .flag-time {
      margin-right: 12px;
    }
  }
}
</style>

