<template>
  <div class="container">
    <div class="headContent">
      <div class="top">
        <!-- <Breadcrumb>
          <BreadcrumbItem>
            <span class="flink">个人中心</span>
          </BreadcrumbItem>
          <BreadcrumbItem to="/customerManager">
            <span class="clink">客户经理</span>
          </BreadcrumbItem>
        </Breadcrumb> -->
      </div>
      <div class="bottom">
        我的专属客户经理
      </div>
    </div>
    <div class="subInfo">
      卖家，您好！在使用跨税云VAT系统的过程中，如有任何税务/系统使用问题，您可以随时联系您的专属客户经理为您答疑；
    </div>
    <div class="content">
      <div class="customerManager"
           v-if="inviteUserName != '' && inviteUserMobile != ''">
        <p>
          <span style="margin-right:20px;">客户经理：</span>
          <span>{{inviteUserName}}</span>
        </p>
        <p>
          <span style="margin-right:20px;">联系电话：</span>
          <span>{{inviteUserMobile}}</span>
        </p>
        <p>
          <span style="margin-right:30px;">微信号：</span>
          <span>
            <img :src="followUserQrCode"
                 alt="">
          </span>
        </p>
      </div>
      <div v-else
           style="text-align: center;padding: 100px;">
        <img src="@/assets/images/common/vatManager.svg"
             alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { personalCenterIndex } from "@/api/user/userModule";
export default {
  data() {
    return {
      inviteUserName: '',
      inviteUserMobile: '',
      followUserQrCode: ''
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    // 客户端资讯列表
    getUserInfo() {
      personalCenterIndex().then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.inviteUserName = res.data.followUserName
          this.inviteUserMobile = res.data.followUserMobile
          this.followUserQrCode = res.data.followUserQrCode
        }
      })
    },

  }
}
</script>

<style lang="less" scoped>
.container {
  height: calc(100vh - 60px);
  .headContent {
    height: 78px;
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 20px 32px;
    .top {
      margin-bottom: 14px;
      .flink,
      .clink {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
      }
      .clink {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .bottom {
      font-size: 20px;
      font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
    }
  }
  .subInfo {
    margin: 24px;
    margin-bottom: 0px;
    background: #d7eefa;
    border-radius: 4px 4px 0px 0px;
    font-size: 14px;
    font-family: "Microsoft Yahei", PingFangSC;
    color: #1890ff;
    line-height: 26px;
    padding: 7px 24px;
  }
  .content {
    margin: 24px;
    margin-top: 0px;
    background: #ffffff;
    height: calc(100vh - 160px);
    .customerManager {
      padding: 24px;
      p {
        margin-bottom: 20px;
      }
      span {
        position: relative;
        font-size: 16px;
        font-family: "Microsoft Yahei", PingFangSC;
        color: #333333;
        line-height: 16px;
        img {
          position: absolute;
          left: -6px;
          top: 0px;
        }
      }
    }
  }
}
</style>