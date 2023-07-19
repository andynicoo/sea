<template>
  <div class="main-wrapper">
    <template v-if="[statusObj.SUBMIT, statusObj.WAIT].includes(status)">
      <div class="system-tip">系统升级： 传输税局接口优化，为您的申报提供高效、安全、稳定的保障</div>
      <div class="title">正在对接税局进行数据传输</div>
      <template v-if="status === statusObj.SUBMIT">
        <i-circle :percent="percent" :size="70" trail-color="#fff"></i-circle>
        <div class="time">预计等待{{ time }}s</div>
        <div class="tip1">请等待传输结果</div>
      </template>
      <template v-if="status === statusObj.WAIT">
        <div class="wait-tip">系统繁忙，请退出等待</div>
        <div class="wait-tip">若30min仍未获取申报结果，请联系客服</div>
      </template>
      <Button @click="back">返回申报列表</Button>
      <div class="tip2">若等待结果过程中离开此页，请在VAT申报-列表页查看传输结果</div>
    </template>
    <div class="fail-wrapper" v-if="status === statusObj.FAIL">
      <img class="fail-icon" src="@/assets/images/computedTax/fail.png" />
      <div class="fail-title">申报失败</div>
      <div class="fail-reason text-warning">{{ failReason }}</div>
      <div class="declare-info">
        <p>公司名称：{{ companyName }}</p>
        <p>申报国家：{{ countryNameEn }}</p>
        <p>申报区间：{{ beginTime.slice(0, 10) }}至{{ endTime.slice(0, 10) }}</p>
        <p>申报时间：{{ submitTime }}</p>
      </div>
      <Button @click="back">返回</Button>
      <Button type="primary" @click="reSubmit">重新提交</Button>
      <Button @click="concat">联系客服</Button>
    </div>
  </div>
</template>

<script>
const statusObj = {
  SUBMIT: 'SUBMIT',
  WAIT: 'WAIT',
  FAIL: 'FAIL',
};
export default {
  props: {
    submitStatus: String,
    failReason: String,
    companyName: String,
    countryNameEn: String,
    beginTime: String,
    endTime: String,
    submitTime: String,
  },
  data() {
    return {
      statusObj,
      status: this.submitStatus || this.$route.query.status || statusObj.SUBMIT,
      totalTime: 30,
      time: 0,
      percent: 0,
    };
  },
  watch: {
    submitStatus(val) {
      this.status = val;
    },
  },
  mounted() {
    this.time = this.totalTime;
    this.timeDown();
  },
  methods: {
    timeDown() {
      if (this.status === statusObj.SUBMIT) {
        let timer = setInterval(() => {
          if (this.status !== statusObj.SUBMIT) {
            clearInterval(timer);
          }
          if (this.time > 0) {
            this.time -= 1;
            this.percent = ((this.totalTime - this.time) / this.totalTime) * 100;
          } else {
            this.stopTimeDown(timer);
            this.status = statusObj.WAIT;
          }
        }, 1000);
      }
    },
    stopTimeDown(timer) {
      clearInterval(timer);
      this.$emit('stopTimeDown');
    },
    back() {
      this.$router.push({
        path: '/filingManagement',
      });
    },
    reSubmit() {
      this.$router.back();
    },
    concat() {
      let el = document.querySelector('.box.box1.contact');
      el.onclick();
    },
  },
};
</script>

<style lang="less" scoped>
.main-wrapper {
  min-height: calc(100vh - 60px);
  padding: 25px 35px 29px 27px;
  background-color: #fff;
  text-align: center;
  .system-tip {
    text-align: left;
    padding: 12px 16px;
    line-height: 22px;
    color: #303132;
    background-color: #f0f6ff;
    border-radius: 2px;
    border: 1px solid #cce1ff;
  }
  .title {
    font-size: 30px;
    font-weight: bold;
    margin: 50px 0 30px;
  }
  .wait-tip {
    color: red;
    margin-bottom: 24px;
  }
  .time {
    font-size: 24px;
    font-weight: bold;
    margin: 24px 0;
  }
  .tip1 {
    margin-bottom: 24px;
  }
  .tip2 {
    margin-top: 24px;
  }
  .fail-wrapper {
    max-width: 540px;
    text-align: center;
    margin: 0 auto;
    .fail-icon {
      width: 80px;
      height: 80px;
      margin-bottom: 25px;
    }
    .fail-title {
      font-size: 24px;
      margin-bottom: 24px;
    }
    .fail-reason {
      font-size: 14px;
      margin-bottom: 24px;
    }
    .declare-info {
      text-align: left;
      padding: 20px 24px;
      line-height: 30px;
      color: #303132;
      background-color: #fafafa;
      margin-bottom: 24px;
    }
  }
}
</style>
