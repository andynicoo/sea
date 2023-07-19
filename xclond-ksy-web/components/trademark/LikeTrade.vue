<template>
  <div class="like">
    <div class="content ksy-w1320">
      <h2>没有找到您心仪的商标</h2>
      <p>提交需求后会有资深专家顾问帮您快速找到想要的商标，并为您提供优质的商标服务。 海量商标，需求尽能满足！</p>
      <a-button class="free" type="primary" @click="customerFunc"> 免费获取服务 </a-button>
    </div>
  </div>
</template>

<script>
import { customerFunc } from "@/utils/index";

export default {
  data() {
    return {
      customerFunc
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.like {
  height: 300px;
  background: url("@/assets/images/likebg.png") no-repeat center/cover;
  padding-top: 60px;
  .content {
    margin: 0 auto;

    h2 {
      font-size: 28px;
      color: @textColor;
    }
    p {
      font-size: 14px;
      color: @textColor6;
      margin-top: 10px;
    }
    .free {
      width: 160px;
      height: 45px;
      border-radius: 2px 2px 2px 2px;
      margin-top: 35px;
      background: #ffffff00;
      color: #3370ffff;
    }
    .free:hover {
      width: 160px;
      height: 46px;
      background: linear-gradient(279deg, #3370ff 0%, #6895ff 100%);
      opacity: 1;
      color: #ffffff;
    }
  }
}
</style>
