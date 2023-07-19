<template>
  <div class="fwys">
    <h2>服务优势</h2>
    <p>专注于为卖家提供专业VAT服务，推动跨境电商税务合规化、标准化、智能化</p>
    <div class="item ksy-w1320">
      <div class="box">
        <img src="~/assets/images/ys-1.png" alt="专业" />
        <h3>专业</h3>
        <p>500+海外税务专家</p>
        <p>专业税务服务团队</p>
        <p>客服团队成员均在VAT行业扎根5年</p>
        <p>服务专业、及时、高效</p>
        <p>......</p>
      </div>
      <div  class="box">
        <img src="~/assets/images/ys-2.png" alt="高效" />
        <h3>高效</h3>
        <p>实时核对税金</p>
        <p>英德秒下回执</p>
        <p>多税号管理</p>
        <p>申报流程实时提醒</p>
        <p>......</p>
      </div>
      <div  class="box">
        <img src="~/assets/images/ys-3.png" alt="安全" />
        <h3>安全</h3>
        <p>SaaS系统采用SSL</p>
        <p>256位数据加密技术</p>
        <p>双云服务器分布式计算</p>
        <p>国家信息安全等级三级认证</p>
        <p>......</p>
      </div>
      <div class="box none">
        <img src="~/assets/images/ys-4.png" alt="本土" />
        <h3>本土</h3>
        <p>上百位海外本土税务师</p>
        <p>申报更安全</p>
        <p>英德法意西本土自营资质</p>
        <p>服务更有保障</p>
        <p>......</p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.fwys {
  height: 840px;
  background-image: url(@/assets/images/fwysbg.png);
  background-repeat: no-repeat;
  background-color:#232A36;
  padding-top: 100px;
  margin: 0 auto;
  h2 {
    color: @whiteTextColor;
    font-size: 28px;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: bold;
    text-align: center;
    margin: 0px !important;
  }
  p {
    color: @whiteTextColor;
    font-size: 14px;
    text-align: center;
    padding-top: 12px;
    margin: 0px !important;
  }
  .item {
    display: flex;
    margin: 0 auto;
    h3 {
      color: @whiteTextColor;
      font-size: 16px;
    }
    div{
      width: 25%;
      margin-top: 40px;
      text-align: center;
      border-right: 1px solid #474747;
      padding: 90px 0px;
      img{
        margin-bottom: 38px;
      }
      p{
        margin: 0px !important;
      }
    }
    .none{
      border-right: 0px solid #474747;
    }
  }
  .box:hover{
    // background: red;
  }
}
</style>
