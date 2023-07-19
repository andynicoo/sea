<template>
  <div class="bottom-bg">
    <div class="center ksy-w1320">
      <h3>免费注册，资深专家团队竭诚为您服务。</h3>
      <a :href="$store.state.host.server_url + '/login'" target="_blank">立即体验</a>
    </div>
  </div>
</template>

<style lang="less" scoped>
.bottom-bg {
  height: 200px;
  background: url("@/assets/images/index/kqy/bottom-bg-1.png") no-repeat center/cover;
  padding-top: 48px;
  text-align: center;
  h3 {
    color: #fff;
    font-size: 28px;
    font-weight: 600;
    line-height: 40px;
    margin: 0 0 16px;
  }
  a {
    display: block;
    width: 160px;
    height: 48px;
    font-size: 16px;
    color: #fff;
    line-height: 48px;
    text-align: center;
    border-radius: 2px;
    border: 1px solid #ffffff;
    margin: 0 auto;
    &:hover {
      color: #3370ff;
      border: 0;
      background: #fff;
      box-shadow: 0px 3px 16px -2px rgba(16, 68, 166, 0.12), 0px 6px 12px 0px rgba(0, 0, 0, 0.05),
        0px 4px 6px -3px rgba(0, 0, 0, 0.02);
    }
  }
}
</style>
