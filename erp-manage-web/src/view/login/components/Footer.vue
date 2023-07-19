<template>
  <div class="footer-content">
    深圳市卖旺信息技术有限公司 All Rights Reserved.
    <a
      href="https://beian.miit.gov.cn"
      style="margin: 0 12px"
      target="_blank"
    >备案号：{{ forRecord }}</a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      forRecord: null
    }
  },
  mounted() {
    if (/emalacca|192|127/.test(location.href)) {
      this.forRecord = '粤ICP备2020141515号'
    }
    if (/emosea/.test(location.href)) {
      this.forRecord = '粤ICP备2021070349号-1'
    }
  }
}
</script>

<style lang="less" scoped>
.footer-content {
  height: 60px;
  line-height: 60px;
  text-align: center;
  position: absolute;
  bottom: 0px;
  margin-left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 12px;
  a {
    color: #fff;
  }
  a:hover {
    text-decoration: underline;
  }
}
</style>
