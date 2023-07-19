<template>
  <div class="qwrz">
    <h2>我们获得的权威认证</h2>
    <div class="content ksy-w1320">
      <a-row :gutter="[150,40]">
        <a-col class="gutter-row" :span="8">
          <div class="item">
            <img src="~/assets/images/about/qianwei1.png" alt="权威认证" />
            <h2>高新技术企业认定</h2>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="item">
            <img src="~/assets/images/about/qianwei2.png" alt="权威认证" />
            <h2>CMMI3证书</h2>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="item">
            <img src="~/assets/images/about/qianwei3.png" alt="权威认证" />
            <h2>企业信用登记AAA级</h2>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="item">
            <img src="~/assets/images/about/qianwei4.png" alt="权威认证" />
            <h2>雨果奖“2020年度最佳知识产权”</h2>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="item">
            <img src="~/assets/images/about/qianwei5.png" alt="权威认证" />
            <h2>2019跨境电商行业百强企业</h2>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="item">
            <img src="~/assets/images/about/qianwei6.png" alt="权威认证" />
            <h2>年度跨境电商综合服务商</h2>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<style lang="less" scoped>
.qwrz {
  // max-width: 1920px;
  height: 760px;
  background: #ffffff;
  padding: 80px 0px;
  margin: 0 auto;
  h2 {
    color: @textColor;
    text-align: center;
    margin: 0 !important;
    font-size: 28px;
  }
  .content {
    margin: 0 auto;
    margin-top: 40px;
    .item {
      height: 217px;
      background: #ffffff;
      box-shadow: 0px 2px 12px 0px rgba(16, 68, 166, 0.07);
      opacity: 1;
      text-align: center;
      img {
        padding-top: 32px;
        padding-bottom: 35px;
      }
      h2 {
        font-size: 16px;
        color: @textColor;
      }
    }
  }
}
</style>
