<template>
  <div class="right">
    <h3>专属顾问 品质服务</h3>
    <div class="list">
      <p>
        <img src="~/assets/images/shendu.svg" />
        深度分析竞争对手和消费者偏好
      </p>
      <p>
        <img src="~/assets/images/qiye.svg" />
        结合企业理念
      </p>
      <p>
        <img src="~/assets/images/fangan.svg" />
        量身定制解决方案
      </p>
      <p>
        <img src="~/assets/images/zhuanye.svg" />
        专家团队一对一服务<br /><span style="margin-left: 33px">品质取名</span>
      </p>
    </div>
  </div>
</template>
<style scoped lang="less">
.right {
  width: 235px;
  height: 330px;
  background: url("@/assets/images/rengongshenhe.png") no-repeat;
  background-size: 235px 330px;
  padding: 24px 16px;
  h3 {
    height: 22px;
    font-size: 14px;
    font-weight: 500;
    color: #886239;
    line-height: 22px;
  }
  .list {
    margin-top: 24px;
    p {
      height: 20px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.6);
      line-height: 20px;
      margin-bottom: 15px;
      img {
        margin-right: 8px;
      }
    }
  }
}
</style>
