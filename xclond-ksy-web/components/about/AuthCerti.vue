<template>
  <div class="qwrz">
    <h2>我们获得的权威认证</h2>
    <div class="content">
      <div class="top">
        <div class="item mr24">
          <dl>
            <dt>
              <img src="~/assets/images/qwrz1.png" alt="权威认证" />
            </dt>
            <dd>
              <h3>英国会计工会资质证书</h3>
              <p>
                英国财务会计师公会（The Institute of Financial Accountants - IFA）创立于1916年，是英国第一大为工商
                业会计师授予资格证明的专业机构，也是世界上历史最悠 久的专业会计团体之一。
              </p>
            </dd>
          </dl>
        </div>
        <div class="item">
          <dl>
            <dt>
              <img src="~/assets/images/qwrz2.png" alt="权威认证" />
            </dt>
            <dd>
              <h3>ACCA证书</h3>
              <p>
                成立于1904年的英国特许公认会计师公会，The Association of Chartered Certified Accountants（简称
                ACCA）是目前世界上领先的专业会计团体，具有真正的 国际性。
              </p>
            </dd>
          </dl>
        </div>
      </div>
      <div class="bottom">
        <div class="item">
          <img src="~/assets/images/qwrz3.png" alt="权威认证" />
          <p>智能税务系统软件注册权证书</p>
        </div>
        <div class="item">
          <img src="~/assets/images/qwrz3.png" alt="权威认证" />
          <p>跨境电商VAT申报平台软件著作权证书</p>
        </div>
        <div class="item">
          <div style="height:162px" class="flex flex-c-c">
            <img src="~/assets/images/qwrz4.png" alt="权威认证" />
          </div>
          <p>深圳市跨境电子商务协会理事单位</p>
        </div>
        <div class="item">
          <img src="~/assets/images/qwrz5.png" alt="权威认证" />
          <p>2020年优秀跨境电商科技类企业十强</p>
        </div>
        <div class="item">
          <img src="~/assets/images/qwrz3.png" alt="权威认证" />
          <p>跨税云支付系统软件著作权证书</p>
        </div>
      </div>
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
    max-width: 1320px;
    margin: 0 auto;
    .top {
      margin-top: 40px;
      display: flex;
      .item {
        max-width: 648px;
        height: 230px;
        background: #ffffff;
        box-shadow: 0px 2px 12px 1px rgba(16, 68, 166, 0.07);
        border-radius: 4px 4px 4px 4px;
        opacity: 1;
        padding: 22px 32px;
        dt {
          float: left;
          margin-right: 24px;
        }
        dd {
          h3 {
            font-size: 24px;
            color: #000000;
          }
          p {
            color: #000000;
            font-family: 16px;
            margin-top: 14px;
          }
        }
      }
      .mr24 {
        margin-right: 24px;
      }
    }
    .bottom {
      max-width: 1320px;
      height: 262px;
      background: #ffffff;
      box-shadow: 0px 2px 12px 1px rgba(16, 68, 166, 0.07);
      margin-top: 37px;
      display: flex;
      padding-top: 24px;
      .item{
        width: 25%;
        text-align: center;
        p{
          font-size: 14px;
          color: #000000;
          margin-top: 12px;
        }
      }
    }
  }
}
</style>
