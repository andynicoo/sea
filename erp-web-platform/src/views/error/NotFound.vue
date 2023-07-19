<template>
  <div class="exception">
    <div class="text-md-center">
      <img src="@/assets/images/error404.png" class="error-img" />
      <h2 class="my-3 headline">哎呀！ 页面出错了！</h2>
      <div><a-button type="primary" @click="goHome">返回首页</a-button></div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
<style lang="scss">
.exception {
  .text-md-center {
    height: 400px;
    width: 400px;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -200px;
    margin-left: -200px;
    h2 {
      line-height: 60px;
    }
  }
}
</style>
