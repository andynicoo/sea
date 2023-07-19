<template>
  <div class="footer-content">
    {{ company }} All Rights Reserved.
    <a href="https://beian.miit.gov.cn" style="margin:0 12px" target="_blank"
      >备案号：{{ forRecord }}</a
    >
    <!-- <a href="/public/agreement">《用户协议》</a>                                                                                                                                                                                                                                                                                                                                                  
    <a href="/public/privacy">《隐私政策》</a> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      forRecord: null,
      company: ''
    }
  },
  mounted() {
    if (/emalacca|192|127/.test(location.href)) {
      this.forRecord = '粤ICP备2020141515号'
      this.company = '深圳市卖旺信息技术有限公司'
    }
    if (/emosea/.test(location.href)) {
      this.forRecord = '粤ICP备2021070349号'
      this.company = '深圳市速卖通服务有限公司'
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-content {
  height: 60px;
  line-height: 60px;
  text-align: center;
  position: absolute;
  bottom: 0px;
  margin-left: 50%;
  transform: translateX(-50%);
  color: #606166;
  font-size: 12px;
  a {
    color: #606166;
  }
  a:hover {
    text-decoration: underline;
  }
}
</style>
