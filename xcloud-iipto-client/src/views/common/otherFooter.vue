<template>
  <div class="footer-box">
    <template v-if="PROCESS_ENV.NODE_PLA==='kby'">
      <a href="https://ori.iipto.com/agreement.html" target="_blank">《跨标云用户协议》</a>
      <a href="https://ori.iipto.com/privacy.html" target="_blank">《跨标云隐私策略》</a> ICP证:
      <a href="http://beian.miit.gov.cn/" target="_blank">粤ICP备20016192号</a> Copyright @ 2020 跨标云
    </template>
    <template v-if="PROCESS_ENV.NODE_PLA==='wg'">
      <a :href="htmlUrl+'agreementwg.html'" target="_blank">《盛骁科技用户协议》</a>
      <a :href="htmlUrl+'privacyagreementwg.html'" target="_blank">《盛骁科技隐私政策》</a>
      <!-- ICP证:<a href="http://beian.miit.gov.cn/" target="_blank">粤ICP备20016192号</a> Copyright @ 2020 辰知云 -->
    </template>
  </div>
</template>
<script>
export default {
  methods: {
  },
  computed: {
    htmlUrl() {
      let url=this.wgUrl;
      url= url.replace("/client/","/")
      return url
    }
  },
}
</script>
<style lang="less" scoped>
.footer-box {
  width: 100%;
  height: 54px;
  background-color: #010e1d;
  text-align: center;
  line-height: 54px;
  font-size: 14px;
  color: #ffffff;
  margin-top: 46px;
  a {
    color: #ffffff;
  }
}
</style>
