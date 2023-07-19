<template>
  <div>
    <div class="footer" :class="NODE_PLA === 'kby' ? 'footerkby' : ''" v-if="NODE_PLA === 'kby' || NODE_PLA === 'ksy'">
      <template v-if="showBanner">
        <AdvTempKsy v-if="NODE_PLA === 'ksy'" />
        <AdvTemp v-if="NODE_PLA === 'kby'" />
      </template>
      <div class="content ksy-w1320">
        <div class="hzhb">
          <h3>合作伙伴</h3>
          <a-row class="item">
            <ul>
              <li v-for="(item, index) in list" :key="index" class="ellipsis">
                <a v-if="item.link" :href="item.link" target="_blank">{{ item.name }}</a>
                <span v-else>{{ item.name }}</span>
              </li>
            </ul>
          </a-row>
        </div>
        <div class="lxwm">
          <h3>关注或联系我们</h3>
          <div class="phone">
            <img src="~/assets/images/phone2.png" alt="电话" v-if="NODE_PLA === 'kby'" />
            <img src="~/assets/images/phone.png" alt="电话" v-else />
            {{ webInfo.serviceHotline }}
          </div>
          <p>邮箱地址：{{ webInfo.email }}</p>
          <p>详细地址：{{ webInfo.companyAddress }}</p>
          <div class="code">
            <div class="box" v-show="webInfo.gzhQrCode">
              <img :src="webInfo.gzhQrCode" alt="公众号" />
              <p>关注公众号</p>
            </div>
            <div class="box" v-show="webInfo.communityQrCode">
              <img :src="webInfo.communityQrCode" alt="社群" />
              <p>关注社群</p>
            </div>
          </div>
        </div>
      </div>
      <FootBottom :webInfo="webInfo" />
    </div>

    <div
      class="footer footerkby"
      :class="NODE_PLA === 'wg' ? 'footerkby' : ''"
      v-if="NODE_PLA === 'wg' || NODE_PLA === 'kqy'"
    >
      <template v-if="showBanner">
        <AdvTemp />
      </template>
      <div class="ksy-w1320 cpxx">
        <h2>产品信息</h2>
        <div>
          <ul>
            <li v-for="(item, index) in list" :key="index" class="">
              <a v-if="item.link" :href="item.link" target="_blank">{{ item.name }}</a>
              <span v-else>{{ item.name }}</span>
            </li>
          </ul>
        </div>
      </div>
      <FootBottom :webInfo="webInfo" />
    </div>
    <!-- 放在default.vue中莫名不显示 -->
    <SideService v-if="getModulesStatus('public_middle_navigation')" />
    <LoadingSearching />

    <!-- 全局登录框 -->
    <LoginPop v-if="showLoginPop" />

    <!-- 全局消息提示 -->
    <MessageBox />

  </div>
</template>

<script>
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
import LoadingSearching from "./common/LoadingSearching.vue";
import { mapState } from "vuex";

export default {
  name: "FooterTemp",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    showBanner: {
      type: Boolean,
      default: true,
    },
    webInfo: {
      type: Object,
      default: {
        bottomLogo: "",
        browserIco: "",
        code: "",
        communityQrCode: "",
        companyAddress: "",
        companyName: "",
        contactPerson: "",
        copyrightInfo: "",
        createName: "",
        email: "",
        gzhQrCode: "",
        icpRecordNo: "",
        id: 30,
        legalPerson: "",
        logo: "",
        mobile: "",
        name: "",
        privacyPolicyLik: "",
        productName: "",
        publicIdNumber: "",
        recordLink: "",
        remark: "",
        serviceAgreementLink: "",
        serviceHotline: "",
        smsSigName: "",
      },
    },
  },
  mixins: [modulesAuth],
  computed: {
    ...mapState({
      showLoginPop: (state) => state.showLoginPop,
    }),
  },
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
    };
  },
  components: { LoadingSearching },
};
</script>

<style lang="less" scoped>
.footerkby {
  background: #001428 !important;
  .content {
    h3 {
      color: @textColorW !important;
    }
    .hzhb {
      li {
        a {
          color: @textColorW6 !important;
        }
        a:hover {
          color: @primaryColor !important;
        }
        span {
          color: @textColorW6 !important;
        }
      }
    }
    .lxwm {
      .phone {
        color: @textColorW !important;
      }
      p {
        color: @textColorW6 !important;
      }
    }
  }
}
.footer {
  background: #f5f7fa;
  width: 100%;
  .content {
    margin: 0 auto;
    display: flex;
    padding: 36px 0px 25px 0px;
    border-bottom: 1px solid #e3e3e359;
    h3 {
      font-size: 16px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: bold;
      color: @textColor;
    }
    .hzhb {
      width: 70%;
      border-right: 1px solid #e3e3e359;
      font-size: 14px;
      .item {
        margin-top: 18px;
        ul {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          li {
            margin-bottom: 8px;
            line-height: 22px;
            a {
              color: @textColor6;
            }
          }
        }
      }
    }
    .lxwm {
      padding-left: 100px;
      .phone {
        height: 30px;
        line-height: 30px;
        margin-top: 8px;
        font-size: 20px;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: bold;
        margin-bottom: 10px;
        color: @textColor;
      }
      p {
        line-height: 22px;
        font-size: 14px;
        color: @textColor6;
      }
      .code {
        margin-top: 15px;
        display: flex;
        height: 104px;
        .box {
          margin-right: 18px;
          &:last-child {
            margin-right: 0;
          }
          display: flex;
          p {
            font-size: 12px;
            color: @textColor6;
            width: 16px;
            margin: 0 0 0 6px;
            display: flex;
            align-items: center;
          }
          img {
            width: 104px;
            height: 104px;
          }
        }
      }
    }
  }
  .cpxx {
    margin: 0 auto;
    padding: 36px 0px 55px 0px;
    border-bottom: 1px solid rgba(227, 227, 227, 0.34902);
    h2 {
      color: @textColorW6;
      font-size: 16px;
      font-weight: 400;
    }
    ul {
      li {
        float: left;
        margin-right: 40px;
      }
    }
    a {
      color: @textColorW6;
    }
  }
}
</style>
