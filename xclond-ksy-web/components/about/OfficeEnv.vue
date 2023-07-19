<template>
  <div class="bghj">
    <h2>办公环境</h2>
    <div class="content ksy-w1320">
      <div class="left">
        <img src="~/assets/images/bghj1.png" alt="办公环境" />
        <img src="~/assets/images/bghj2.png" alt="办公环境" />
      </div>
      <div class="right">
        <img src="~/assets/images/bghj3.png" alt="办公环境" />
        <img src="~/assets/images/bghj4.png" alt="办公环境" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.bghj {
  // max-width: 1920px;
  height: 926px;
  background: #f5f7fa;
  padding: 80px 0px;
  padding-bottom: 0px;
  h2 {
    font-size: 28px;
    color: @textColor;
    text-align: center;
  }
  .content {
    margin: 0 auto;
    margin-top: 40px;
    .left {
      width: 55.5%;
      margin-right: 3%;
      overflow: hidden;
      float: left;
      img {
        margin-bottom: 17px;
        width: 100%;
      }
    }
    .right {
      width: 41.5%;
      overflow: hidden;
      float: left;
      img {
        margin-bottom: 15px;
        width: 100%;
      }
    }
  }
}
</style>
