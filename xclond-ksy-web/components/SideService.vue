<template>
  <div class="service hand" :class="{ log: auth.userId }" v-if="hideSide">
    <div class="ksy-pr kefu">
      <img src="~/assets/images/zskf.png" alt="专属客服" />
      <span class="ksy-pa title">专属客服</span>
    </div>
    <div v-if="NODE_PLA === 'kqy' && NODE_PLA === 'kby'">
      <div
        class="box box0 code xxx"
        v-if="auth.userId"
        :class="{ wgbox: NODE_PLA === 'wg', kqybox: NODE_PLA === 'kqy' }"
      >
        <a-popover v-model="visiblezs" placement="left" :overlayClassName="popClass" :title="null" trigger="hover">
          <div slot="content">
            <div class="top" v-if="NODE_PLA === 'wg'">
              <p>用心为您提供专属服务</p>
              <p class="tips">辰知云外观专利客户经理和您一对一沟通，<br />为您提供专业服务</p>
            </div>
            <div class="top" v-if="NODE_PLA === 'kqy'">
              <p>用心为您提供专属服务</p>
              <p class="tips">跨企云客户经理和您一对一沟通，<br />为您提供专业服务</p>
            </div>
            <div class="mid center">
              <p v-if="NODE_PLA === 'wg'">遇到外观专利问题 专属顾问为您解答</p>
              <p v-if="NODE_PLA === 'kqy'">遇到注册问题 专属顾问为您解答</p>
              <img src="~/assets/images/onetoone.svg" alt="客户经理" />
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
          <img src="~/assets/images/zhuanshu.svg" alt="客户经理" />
          <p class="ksy-mb-0">专属</p>
          <p class="ksy-mb-0">客户经理</p>
        </a-popover>
      </div>
      <div class="box box0 code" v-else @click="goLogin" :class="{ kqybox: NODE_PLA === 'kqy' }">
        <img src="~/assets/images/zhuanshu.svg" alt="客户经理" />
        <p class="ksy-mb-0">专属</p>
        <p class="ksy-mb-0">客户经理</p>
      </div>
    </div>
    <div
      @click="customerFunc"
      class="box box1 contact"
      v-sensorsDire="{
        type: 'ClickOnlineAdvice',
        event: 'click',
        getParams: () => ({}),
      }"
    >
      <img src="~/assets/images/lxwm.svg" alt="在线客服" />
      <p>在线客服</p>
    </div>

    <div class="box box2 code" v-if="NODE_PLA === 'kqy'">
      <a-popover v-model="visible" placement="left" overlayClassName="ksyrightpop" :title="null" trigger="hover">
        <div slot="content" class="ksy-text-center">
          <img :src="webInfo.gzhQrCode" alt="公众号" style="width: 200px" />
          <h3>关注公众号</h3>
        </div>
        <img src="~/assets/images/gzh.svg" alt="公众号" />
        <p>公众号</p>
      </a-popover>
    </div>
    <div class="box box2 code" v-if="!auth.userId && ['ksy', 'kby'].includes(NODE_PLA)">
      <a-popover v-model="visible" placement="left" overlayClassName="ksyrightpop" :title="null" trigger="hover">
        <div slot="content" class="ksy-text-center">
          <img v-if="NODE_PLA == 'ksy'" src="~/assets/images/ksy/sqzx.png" alt="售前咨询" style="width: 200px" />
          <img v-if="NODE_PLA == 'kby'" src="~/assets/images/kby/sqzx.png" alt="售前咨询" style="width: 200px" />
        </div>
        <img src="~/assets/images/gzh.svg" alt="售前咨询" />
        <p>售前咨询</p>
      </a-popover>
    </div>

    <div class="box box1" @click="goFeedBack">
      <img src="~/assets/images/feedicon.svg" alt="意见反馈" />
      <p>意见反馈</p>
    </div>
    <div class="box box1 top" v-show="showToTop" @click="backTop">
      <img src="~/assets/images/totop.svg" alt="返回顶部" />
      <p>返回顶部</p>
    </div>
    <div class="box fold" @click="hideSide = false">
      <img src="@/assets/images/fold.svg" alt="收缩" />
    </div>
  </div>
  <div class="service hand folded" v-else @click="hideSide = true">
    <img src="@/assets/images/folded_kf.svg" alt="展开" />
  </div>
</template>

<script>
import common from "@/apis/common";
import { mapState } from "vuex";
import { customerFunc } from "@/utils/index";

export default {
  data() {
    return {
      showToTop: false,
      visiblezs: false,
      visible: false,
      visibleWechat: false,
      webInfo: {},
      NODE_PLA: process.env.NODE_PLA,
      setWechatImg: null,
      managerCode: {},
      customerFunc,
      hideSide: true
    };
  },
  watch: {
    auth: {
      handler(newVal) {
        if (this.auth.userId) {
          this.getManagerCode();
        }
      },
    },
  },
  computed: {
    ...mapState({
      auth: (state) => state.auth,
    }),
    popClass() {
      let className = "";
      switch (this.NODE_PLA) {
        case "wg":
          className = "zhuanshu wgbox";
          break;

        default:
          className = "zhuanshu";
          break;
      }
      return className;
    },
  },
  async mounted() {
    // console.log(this.$PLA)
    console.log(this.auth.userId, 333);
    window.addEventListener(
      "scroll",
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
    let res = await this.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods);
    this.webInfo = res.data;

    if (this.auth.userId) {
      this.getManagerCode();
    }
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
    goFeedBack() {
      if (this.auth.userId) {
        this.$router.push("/feedback");
      } else {
        window.location = location.origin + "/client/login";
      }
    },
    goLogin() {
      window.location = location.origin + "/client/login";
    },
    // 专属客户经理信息
    async getManagerCode() {
      // auth.userId
      let res = await this.$axiosApi(common.getEmployeeCode.url, common.getEmployeeCode.methods);
      if (res.code === 0) {
        this.managerCode = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.service {
  position: fixed;
  bottom: 100px;
  right: 0px;
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
    background: @primaryHover;
  }
  .box {
    width: 64px;
    height: 64px;
    background: @primaryColor;
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
    background: @primaryHover;
  }
  .box2:hover {
    background: @primaryHover;
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
.ksyrightpop {
  text-align: center;
  width: 240px !important;
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
    background: url("@/assets/images/guanjia.png") no-repeat #fafbfc;
    background-size: 325px 201px;
    // background: url("@/assets/images/guanjia.svg") no-repeat 0 0 / cover;
    height: 495px;
  }
  .top {
    height: 201px;
    padding: 20px;
    p {
      height: 22px;
      font-size: 14px;
      font-weight: bold;
      color: @textColorW6;
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
    width: 286px;
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
      color: @textColor;
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
      color: @textColor;
      line-height: 22px;
    }
    .text {
      font-size: 12px;
    }
    .code {
      .text {
        float: left;
        font-size: 12px;
        color: @textColor;
        width: 170px;
      }
      .wchat {
        float: left;
        width: 60px;
      }
    }
  }
}
.wgbox {
  .ant-popover-inner {
    background: url("@/assets/images/guanjiawg.png") no-repeat #fafbfc !important;
  }
}
.kqybox {
  display: none;
}
</style>
