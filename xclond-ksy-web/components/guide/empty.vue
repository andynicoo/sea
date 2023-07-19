<template>
  <div class="guide-empty">
    <img src="@/assets/images/kby/empty.png" alt="" />
    <p>数据未更新，去看看其他吧</p>
    <a-button type="primary" @click="$router.push('/')">去首页</a-button>
  </div>
</template>
<script>
export default {
    name: 'GuideEmpty'
}
</script>
<style lang="less" scoped>
.guide-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  font-size: 16px;
  color: rgba(@textColor, 0.6);
  line-height: 24px;
  img {
    width: 300px;
  }
  p {
    margin: 12px 0 24px;
  }
  button {
    width: 112px;
    height: 44px;
    background: @primaryColor;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    border-radius: 2px;
  }
}
</style>
