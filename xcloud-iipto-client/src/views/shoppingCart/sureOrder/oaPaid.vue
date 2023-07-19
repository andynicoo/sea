<template>
  <div class="mainContent">
    <div class="mainContent">
      <div class="top-contnet">
        <div class="title">
          <img class="settingIcon" src="~@/assets/images/setting/settingIcon.svg" alt="" />支付订单
        </div>
      </div>
      <div class="main-box">
        <img src="~@/assets/images/status/success.png" alt="" />
        <h4>支付成功</h4>
        <div class="info">
          <dl>
            <dt>服务名称：</dt>
            <dd>服务名称服务名称服务名称服务名称</dd>
          </dl>
          <dl>
            <dt>工单号：</dt>
            <dd>21212122</dd>
          </dl>
        </div>
        <div class="btns">
          <div class="btn1">查看服务工单</div>
          <div class="btn2" @click="toOrder">查看订单</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import '@/assets/style/common.less';
export default {
  data() {
    return {
      serviceId: '',
      nodeCode: '',
    };
  },
  methods: {
    toOrder() {
      this.$router.push({
        path: '/myOrder',
      });
    },
    toMyBrand() {
      const { serviceId, nodeCode } = this;
      this.$router.push({
        path: '/myBrand',
        query: {
          serviceId,
          nodeCode,
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import url('./index.less');
.main-box {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-top: 1px solid #eee;
  img {
    width: 70px;
  }
  h4 {
    margin: 24px 0 8px;
    font-size: 24px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 32px;
  }
  .info {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;
    dl {
      display: flex;
      align-items: center;
      margin: 0 20px;
      font-size: 14px;
      color: #666666;
      line-height: 22px;
      dt {
        color: #333;
        margin: 0;
      }
      dd {
        margin: 0;
      }
    }
  }
  .btns {
    font-size: 14px;
    display: flex;
    align-items: center;
    .btn1 {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 116px;
      height: 32px;
      background: #ffffff;
      border-radius: 2px 2px 2px 2px;
      opacity: 1;
      color: #919498;
      border: 1px solid #d9d9d9;
      margin-right: 8px;
      cursor: pointer;
    }
    .btn2 {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 88px;
      height: 32px;
      background: #00a3ff;
      border-radius: 2px 2px 2px 2px;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
</style>
