<template>
  <div v-if="isShow">
    <div class="service hand" :class="{ log: ifLogin }" v-if="hideSide">
      <div class="ksy-pr kefu">
        <img src="@/assets/images/common/zskf.png" alt="专属客服" />
        <span class="ksy-pa title">专属客服</span>
      </div>
      <div v-if="NODE_PLA === 'wg'">
        <div class="box box0 code" v-if="ifLogin">
          <a-popover v-model="visiblezs" placement="left" :overlayClassName="popClass" :title="null" trigger="hover">
            <div slot="content">
              <div class="top" v-if="NODE_PLA === 'kby'">
                <p>用心为您提供专属服务</p>
                <p class="tips">跨标云专业商标、知识产权、外观专利客户经理和您一对一沟通，为您提供专业服务</p>
              </div>
              <div class="top" v-if="NODE_PLA === 'wg'">
                <p>用心为您提供专属服务</p>
                <p class="tips">辰知云外观专利客户经理和您一对一沟通，<br />为您提供专业服务</p>
              </div>
              <div class="mid center">
                <p v-if="NODE_PLA === 'kby'">遇到商标专利问题 专属顾问为您解答</p>
                <p v-if="NODE_PLA === 'wg'">遇到外观专利问题 专属顾问为您解答</p>
                <img src="@/assets/images/common/onetoone.svg" alt="客户经理" />
              </div>
              <div class="foot center">
                <div class="ksy-fl">
                  <p class="tit">有问题随时联系我哦～</p>
                  <div class="text">扫码加我微信</div>
                  <!-- <div class="text">{{ managerCode.mobile }}</div> -->
                </div>
                <div class="ksy-fl wchat ksy-ml-3">
                  <img :src="managerCode.qrCode" alt="客户经理" style="width: 84px" />
                </div>
              </div>
            </div>
            <img src="@/assets/images/common/zhuanshu.svg" alt="客户经理" />
            <p class="ksy-mb-0">专属</p>
            <p class="ksy-mb-0">客户经理</p>
          </a-popover>
        </div>
        <div class="box box0 code" v-else @click="goLogin">
          <img src="@/assets/images/common/zhuanshu.svg" alt="客户经理" />
          <p class="ksy-mb-0">专属</p>
          <p class="ksy-mb-0">客户经理</p>
        </div>
      </div>
      <div
        @click="customerFunc"
        class="box box1 contact"
        v-sensors="{
          type: 'ClickOnlineAdvice',
          getParams: () => {
            return {
              page_name: $route.mate ? $route.mate.title : $route.name,
            };
          },
          event: 'click',
        }"
      >
        <img src="@/assets/images/common/lxwm.svg" alt="在线客服" />
        <p>在线客服</p>
      </div>

      <!-- <div class="box box2 code" v-show="NODE_PLA !== 'wg'">
        <a-popover v-model="visible" placement="left" overlayClassName="ksyrightpop" :title="null" trigger="hover">
          <div slot="content">
            <img src="@/assets/images/common/iipto-qr.jpg" alt="公众号" style="width: 200px" />
            <h3>关注公众号</h3>
            <p>实时接收商标提醒</p>
          </div>
          <img src="@/assets/images/common/gzh.svg" alt="公众号" />
          <p>公众号</p>
        </a-popover>
      </div> -->
      <div class="box box1" @click="goFeedBack" :class="{ yuan: !showToTop }">
        <img src="@/assets/images/common/feedicon.svg" alt="意见反馈" />
        <p>意见反馈</p>
      </div>
      <div class="box box1 top" v-show="showToTop" @click="backTop">
        <img src="@/assets/images/common/totop.svg" alt="返回顶部" />
        <p>返回顶部</p>
      </div>
      <div class="box fold" @click="hideSide = false">
        <img src="@/assets/images/common/fold.svg" alt="收缩" />
      </div>
    </div>
    <div class="service hand folded" v-else @click="hideSide = true">
      <img src="@/assets/images/common/folded_kf.svg" alt="展开" />
    </div>
  </div>
</template>

<script>
import { getEmployeeCode } from '@/api/myOrder.js';
export default {
  data() {
    return {
      showToTop: false,
      visiblezs: false,
      visible: false,
      visibleWechat: false,
      NODE_ENV: process.env.NODE_ENV,
      NODE_PLA: process.env.NODE_PLA,
      managerCode: {},
      hideSide: true,
    };
  },
  watch: {
    ifLogin(val) {
      if (val) {
        this.getManagerCode();
      }
    },
  },
  computed: {
    // 是否显示
    isShow() {
      return !['/paymentSuccess','/payment','/trademarkNameReviewReport'].includes(this.$route.path);
    },
    ifLogin() {
      return this.$store.state.login.isLogin;
    },
    popClass() {
      let className = '';
      switch (this.NODE_PLA) {
        case 'wg':
          className = 'zhuanshu wgbox';
          break;

        default:
          className = 'zhuanshu';
          break;
      }
      return className;
    },
  },
  async mounted() {
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 300) {
          this.showToTop = true;
        } else {
          this.showToTop = false;
        }
      },
      {
        passive: true,
      }
    );
  },
  methods: {
    backTop() {
      window.scrollTo({
        top: 0,
      });
    },
    hide() {
      this.visible = false;
    },
    customerFunc() {
      let configId = 'dd7e53bf-c965-49aa-8281-9aee10fca011'; // 售后
      if (location.href.indexOf('productDetail') !== -1) {
        configId = 'b4a50b72-c5a2-498b-a617-8b4357dafd95'; // 售前
      }
      easemobim.bind({ configId });
    },
    goFeedBack() {
      if (this.ifLogin) {
        window.location.href = location.origin + '/feedback';
      } else {
        this.goLogin();
      }
    },
    goLogin() {
      this.$router.push({ path: `/login` });
    },
    // 专属客户经理信息
    getManagerCode() {
      let that = this;
      getEmployeeCode().then(
        (res) => {
          if (res.code === 0) {
            that.managerCode = res.data;
          } else {
            that.$Message.error(res.message);
          }
        },
        (err) => {
          that.$Message.error(err.message);
        }
      );
    },
  },
};
</script>

<style lang="less" scoped>
.service {
  position: fixed;
  bottom: 100px;
  right: 0;
  width: 82px;
  z-index: 999;
  .kefu {
    cursor: default;
    .title {
      left: 17px;
      bottom: 7px;
      font-size: 12px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      line-height: 20px;
    }
  }
  .box0 {
    height: 80px !important;
  }
  .box0 {
    border-bottom: 1px solid #356bd6;
  }
  .box0:hover {
    background: #358dff;
  }
  .box {
    width: 64px;
    height: 64px;
    background: #3a7fff;
    color: #fff;
    margin: 0px 10px;
    text-align: center;
    font-size: 12px;
    img {
      padding-top: 12px;
      padding-bottom: 4px;
    }
  }
  .fold {
    height: 20px;
    img {
      padding-top: 5px;
    }
    border-radius: 0 0 4px 4px;
  }
  .box1:hover {
    background: #358dff;
  }
  .box2:hover {
    background: #358dff;
  }
  .box1,
  .box2 {
    border-bottom: 1px solid #356bd6;
  }
}
.service.folded {
  width: 40px;
  height: 128px;
}
</style>
<style lang="less">
.wgbox {
  .ant-popover-inner {
    background: url('~@/assets/images/common/guanjiawg.png') no-repeat #fafbfc !important;
    background-size: 325px 201px !important;
    height: 495px !important;
  }
}
.ksyrightpop {
  text-align: center;
  width: 257px !important;
  height: 175px;
  border-radius: 2px 2px 2px 2px;
  padding-top: 25px;
  h3 {
    font-size: 12px;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: bold;
    padding-top: 14px;
  }
  p {
    font-size: 12px;
    font-family: PingFang SC-Medium, PingFang SC;
    color: rgba(0, 0, 0, 0.6);
    padding-top: 5px;
  }
}
.zhuanshu {
  width: 335px;
  height: 486px;
  // background: #f0f1f2;
  opacity: 1;
  .ant-popover-arrow {
    display: none;
  }
  .ant-popover-inner-content {
    padding: 0px;
  }
  .ant-popover-inner {
    box-shadow: 0px 2px 12px 0px rgba(16, 68, 166, 0.07);
    // background-color: #f0f1f2;
    background: url('~@/assets/images/common/guanjia.png') no-repeat #fafbfc;
    background-size: 325px 201px;
    height: 495px;
  }
  .top {
    height: 201px;
    padding: 20px;
    p {
      height: 22px;
      font-size: 14px;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.6);
      line-height: 22px;
    }
    .tips {
      height: 40px;
      font-size: 12px;
      font-weight: 400;
      color: #ffffff;
      line-height: 20px;
      margin-top: 60px;
      margin-left: 39px;
    }
  }
  .mid {
    width: 284px;
    height: 149px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 0px rgba(16, 68, 166, 0.07);
    opacity: 1;
    margin-top: -20px;
    border-radius: 2px;
    padding-top: 16px;
    p {
      height: 22px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.9);
      line-height: 22px;
      text-align: center;
      // margin-top: 16px;
    }
  }
  .foot {
    width: 284px;
    height: 134px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 0px rgba(16, 68, 166, 0.07);
    opacity: 1;
    margin-top: 12px;
    padding: 16px 20px;
    border-radius: 4px;
    .tit {
      height: 22px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.9);
      line-height: 22px;
    }
    .text {
      font-size: 12px;
    }
    .code {
      .text {
        float: left;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.9);
        width: 170px;
      }
      .wchat {
        float: left;
        width: 60px;
      }
    }
  }
}
</style>
