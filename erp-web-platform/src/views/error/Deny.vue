<template>
  <div class="exception">
    <div class="mr-3 hidden-sm-and-down">
      <img src="/static/error/403.svg" alt="" />
    </div>
    <div class="text-md-center">
      <h1>403</h1>
      <h2 class="my-3 headline ">Sorry, access denied.</h2>
      <div>
        <a-button color="primary" @click="goHome">Go Home</a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.push({ path: '/' })
    }
  },
  created() {
    console.log('here')
  }
}
</script>
<style lang="scss" scoped>
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
