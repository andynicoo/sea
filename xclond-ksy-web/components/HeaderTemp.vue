<template>
  <div
    class="header"
    :class="{
      'header-kby': NODE_PLA === 'kby' || NODE_PLA === 'wg',
      'header-change': bgChange,
      blackKbyHead: blackKbyHead,
    }"
    id="trademark-nav"
  >
    <div :class="`msk ${maskShow? 'mask-show': ''}`"></div>
    <div class="nav ksy-w1320">
      <div class="ksy-ib logo">
        <nuxt-link to="/"
          ><img
            :src="logoChange ? webInfo.lightColourLogo || '' : webInfo.logo || ''"
            alt="logo"
            :title="webInfo.companyName"
        /></nuxt-link>
      </div>
      <ul class="ksy-ib menulist" v-if="showList.length">
        <li
          v-for="(item, index) in showList"
          :key="index"
          @mouseenter="() => navHover(item)"
          @mouseleave="() => navLeave(item)"
          :class="{ 'search-nav': item.route == '/search' }"
        >
          <nuxt-link
            :class="{
              active:
                item.route === navActive ||
                (item.route == '/search' &&
                  [
                    '/classificationquery',
                    '/classificationdetails',
                    '/trademarkquery',
                    '/trademarkdetails',
                    '/trademarkname',
                  ].includes(navActive)),
            }"
            class="linkA"
            :to="item.route != '/search' ? item.route : ''"
            v-if="item.route"
            v-sensorsDire="{
              type: 'ClickNavigationBar',
              event: 'click',
              getParams: () => ({
                navigation_bar_name: item.name,
              }),
            }"
            >{{ item.name }}&nbsp;<i v-if="item.name.indexOf('标查询') > -1" class="icon-down"
          /></nuxt-link>
          <a class="linkA" :href="item.link" :target="item.openType ? '_self' : '_blank'" v-else>{{ item.name }}</a>
          <template v-if="['产品服务', '优选服务'].includes(item.name) && item.sonNavs && item.sonNavs.length">
            <div :class="{ menucontent: true, 'ksy-w1320gd': true, 'menucontent-show': productNavShow }" v-if="getModulesStatus('productService_down')">
              <AlertWindow :list="item.sonNavs" :link="item.route" />
            </div>
          </template>
          <template v-if="['美标查询'].includes(item.name)">
            <div :class="`trademark-wrap ${trademarkNavShow ? 'trademark-wrap-show' : ''}`">
              <div class="trademark-nav">
                <div v-for="(trNav, trIndex) in trademarkNav" :key="trIndex" @click="fastClick(trNav)" class="item">
                  <img :src="trNav.icon" :alt="trNav.name" /><em class="shencea" :id="trNav.id">{{ trNav.name }}</em>
                </div>
              </div>
            </div>
          </template>
        </li>
      </ul>
      <div class="ksy-fr flex bar-right">
        <div class="change-language flex flex-c-c" ref="changeLanguage" v-if="NODE_PLA === 'ksy'">
          <a-dropdown placement="bottomLeft" :getPopupContainer="getPopupContainer">
            <div>
              <AliIcon type="yuyanqiehuan" class="icon-earth" :size="16" style="margin-right: 8px" />中文
              <AliIcon type="jiantou-xia1" :size="16" />
            </div>
            <a-menu slot="overlay">
              <a-menu-item key="1"> 中文 </a-menu-item>
              <a-menu-item key="2">
                <a href="https://ori.itaxs.com/en" target="_blank">英文</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <UserInfo :bgChange="bgChange" :blackKbyHead="blackKbyHead" />
      </div>
    </div>
  </div>
</template>

<script>
import UserInfo from "./common/UserInfo.vue";
import AlertWindow from "./AlertWindow.vue";
import common from "@/apis/common";
import { mapMutations } from "vuex";
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
import { customerFunc } from "@/utils/index";

export default {
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  components: {
    UserInfo,
    AlertWindow,
  },
  props: {
    blackKbyHead: {
      type: Boolean,
      default: false,
    },
    navList: {
      type: Array,
      default: () => [],
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
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
      navActive: "",
      bgChange: false,
      staticNav: [
        {
          path: "/",
          pageName: "首页",
        },
        {
          path: "/productservice",
          pageName: "产品服务",
        },
        {
          path: "/optimizationservice",
          pageName: "优选服务",
        },
        {
          path: "/search",
          pageName: "美标查询",
        },
        {
          path: "/depot/register",
          pageName: "注册商标库",
        },
        {
          path: "/depot/lawyer",
          pageName: "TOP律师库",
        },
        {
          path: "/trademarktransfer",
          pageName: "商标转让",
        },
        {
          path: "/news",
          pageName: "知产百科",
        },
        {
          path: "/news",
          pageName: "税务资讯",
        },
        {
          path: "/news",
          pageName: "工商百科",
        },
        {
          path: "/news",
          pageName: "出海百科",
        },
        {
          path: "/aboutcomputed",
          pageName: "一键算税",
        },
        {
          path: "/about",
          pageName: "关于我们",
        },
        {
          path: "/guide",
          pageName: "操作指引",
        },
        {
          path: "/user/route",
          pageName: "跨标云",
        },
      ],
      nav: [],
      trademarkNav: [
        {
          icon: require("@/assets/images/trademark/v230401/nav/1.png"),
          path: "/trademarkquery",
          name: "近似商标",
          id: "secondary_navigation_button001",
        },
        {
          icon: require("@/assets/images/trademark/v230401/nav/2.png"),
          path: "/trademarkTarget",
          name: "精准商标",
          id: "secondary_navigation_button002",
        },
        {
          icon: require("@/assets/images/trademark/v230401/nav/3.png"),
          path: "/classificationquery",
          name: "商标分类",
          id: "secondary_navigation_button003",
        },
        {
          icon: require("@/assets/images/trademark/v230401/nav/4.png"),
          path: "/riskReport",
          name: "近似风险报告",
          id: "secondary_navigation_button004",
        },
        {
          icon: require("@/assets/images/trademark/v230401/nav/5.png"),
          path: "/fastResult/brandLawyer",
          name: "律师代理商标",
          id: "secondary_navigation_button005",
        },
        {
          icon: require("@/assets/images/trademark/v230401/nav/6.png"),
          path: "/fastResult/brandPersonnel",
          name: "申请人持有商标",
          id: "secondary_navigation_button006",
        },
        {
          icon: require("@/assets/images/trademark/v230401/nav/7.png"),
          path: "/trademarkname",
          name: "AI智能商标取名",
          id: "secondary_navigation_button007",
        },
        {
          icon: require("@/assets/images/trademark/v230401/nav/8.png"),
          path: "",
          name: "深度核名报告",
          id: "secondary_navigation_button008",
          kf: true,
        },
      ],
      maskShow: false,
      trademarkNavShow: false,
      productNavShow: false
    };
  },
  computed: {
    logoChange() {
      if (this.bgChange || this.blackKbyHead) {
        return true;
      } else {
        return false;
      }
    },
    showList() {
      let arr = [];
      let { staticNav, navList } = this;
      if (navList.length) {
        let newArr = [];
        staticNav.forEach((i) => {
          navList = navList.map((v) => {
            if (v.name && v.name === i.pageName) {
              v.route = i.path;
            }
            return v;
          });
        });
        arr = navList.sort((a, b) => b.sort - a.sort);
      }
      arr = arr.filter((ele) => ele.status);
      return arr;
    },
  },
  watch: {
    "$route.path": {
      handler(v) {
        if (v) {
          const { navList, staticNav } = this;
          staticNav.forEach((i) => {
            navList.map((v) => {
              if (v.name === i.pageName) {
                v.route = i.path;
              }
              return v;
            });
          });
          let nav = navList.sort((a, b) => b.sort - a.sort);

          const item = nav.filter((i) => i.route === v);
          if (item.length) {
            this.navActive = item[0].route;
            this.setPageInfo({
              pageName: item[0].name,
            });
          } else {
            this.navActive = "";
          }
        }
        this.navActive = this.$route.path;
      },
      immediate: true,
    },
  },
  mounted() {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 1) {
          this.bgChange = true;
        } else {
          this.bgChange = false;
        }
      },
      {
        passive: true,
      }
    );
    // this.getNavList();
  },
  methods: {
    ...mapMutations(["setPageInfo"]),
    // 商标查询快捷导航跳转
    fastClick(item) {
      if (item.kf) {
        // 唤起客服
        customerFunc();
      } else {
        this.$router.push(item.path);
      }
    },
    async getNavList() {
      try {
        const { staticNav } = this;
        let { data: topNavInfo } = await this.$axiosApi(common.newslist.url, common.newslist.methods);
        staticNav.forEach((i) => {
          topNavInfo.map((v) => {
            if (v.name === i.pageName) {
              v.route = i.path;
            }
            return v;
          });
        });
        this.nav = topNavInfo.sort((a, b) => b.sort - a.sort);
        // this.navActive = this.$route.path
      } catch (err) {
        console.log(err);
      }
    },
    navHover(item) {
      if (["产品服务", "优选服务", "美标查询"].includes(item.name)) {
        if (this.getModulesStatus("productService_down")) {
          this.maskShow = true;
        } else {
          this.maskShow = false;
        }
      } else {
        this.maskShow = false;
      }
      if (item.name === "美标查询") {
        this.trademarkNavShow = true;
      }
      if (item.name === "产品服务") {
        this.productNavShow = true;
      }
    },
    navLeave(item) {
      this.trademarkNavShow = false;
      this.productNavShow = false;
      this.maskShow = false;
    },
    getPopupContainer() {
      return this.$refs.changeLanguage;
    },
  },
};
</script>

<style lang="less" scoped>
.msk {
  position: fixed;
  left: 0;
  right: 0;
  top: 64px;
  bottom: 0;
  height: calc(100vh - 64px);
  background: rgba(#000, 0.4);
  z-index: -1;
  visibility: hidden;
  opacity: 0;
  transition: all 0.5s ease-in-out;
}
.mask-show{
  visibility:visible;
  opacity: 1;
}

.header {
  width: 100%;
  height: 64px;
  // box-shadow: 0px 2px 12px 1px rgba(16, 68, 166, 0.07);
  border-radius: 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: rgba(#fff, 0.1);
  backdrop-filter: blur(12px);

  &-change {
    background: #fff;
  }

  &:hover {
    background: #fff;
  }

  .nav {
    margin: 0 auto;
    height: 64px;
    line-height: 64px;
    position: relative;
    font-size: 16px;

    .logo {
      img {
        width: 118px;
        height: 30px;
      }
    }

    .menulist {
      margin-left: 30px;
      margin-bottom: 0;
      display: inline-flex;
      vertical-align: middle;
      height: 100%;

      li {
        display: inline-flex;
        height: 100%;

        a {
          font-size: 16px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.9);
          line-height: 24px;
          padding: 0 12px;
          display: flex;
          align-items: center;

          &.active {
            color: @primaryColor;
          }
        }

        .menucontent {
          position: absolute;
          top: 64px;
          left: 0;
          background: #ffffff;
          box-shadow: 0 2px 12px 1px rgba(16, 68, 166, 0.07);
          border-radius: 0;
          z-index: -99999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.5s ease-in-out;
        }

        .menucontent-show{
          visibility: visible;
          opacity: 1;
          z-index: 99999;
        }
      }
    }

    .bar-right {
      height: 100%;

      .change-language {
        margin-right: 10px;

        .icon-earth {
          color: rgba(@textColor, 0.4);
        }

        &:hover {
          color: @primaryColor;

          .icon-earth {
            color: @primaryColor;
          }

          .ant-dropdown-trigger {
            color: @primaryColor;
          }
        }

        .ant-dropdown-trigger {
          cursor: pointer;
          margin-bottom: 0;
          line-height: 70px;
          color: rgba(@textColor, 0.9);
          font-size: 16px;
        }
      }
    }
  }

  &-kby {
    box-shadow: none;
    background: none;
    backdrop-filter: initial;

    &:hover {
      background: none;
    }

    .nav {
      .menulist {
        li {
          a {
            color: #fff;

            &.active,
            &:hover {
              position: relative;
              color: #fff !important;

              &::after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 50%;
                width: 30px;
                height: 2px;
                background: #ffffff;
                transform: translateX(-50%);
              }
            }
          }
        }
      }
    }

    &.header-change,
    &.blackKbyHead {
      background: #ffffff;

      // backdrop-filter: blur(12px);
      .nav .menulist li {
        a {
          color: @textColor !important;
        }

        a.active {
          color: @primaryColor !important;
        }

        a:hover {
          color: @primaryClick !important;
        }

        a {
          &.active {
            &::after {
              background: @primaryClick;
            }
          }
        }
      }

      /deep/ .p-kby {
        a {
          color: @textColor;
        }

        a:hover {
          color: @primaryClick !important;
        }

        button {
          background: @primaryColor;
          color: rgba(255, 255, 255, 0.9);
        }
      }
    }
  }
}

/deep/ .ant-dropdown {
  .ant-dropdown-menu {
    width: 125px;
    padding: 0;
    text-align: center;
    font-size: 14px;
    color: rgba(@textColor, 0.6);
    box-shadow: 0 2px 12px 0 rgba(16, 68, 166, 0.07);
    border-radius: 4px;

    li {
      &:hover {
        background: #fff;
        color: @primaryColor;
      }
    }
  }
}

.trademark-query-subnav {
  display: none;
  position: fixed;
  z-index: 100;
  left: 50%;
  top: 63px;
  width: 1200px;
  height: 129px;
  transform: translateX(-50%);
  background: #ffffff;
  border-radius: 0;

  a {
    height: 40px;
    line-height: 40px;
    color: #303132 !important;
    padding-left: 16px !important;

    &:hover {
      background: #f5f7fa;
    }
  }

  .subnav-active {
    background: #f5f7fa;
    color: #3370ff !important;
  }
}
#trademark-nav {
  .trademark {
    &-wrap {
      position: fixed;
      top: 64px;
      left: 50%;
      transform: translateX(-50%);
      width: 960px;
      height: 168px;
      padding: 24px;
      background: #ffffff;
      z-index: -99999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.5s ease-in-out;
    }
    &-wrap-show{
      visibility: visible;
      z-index: 99999;
      opacity: 1;
    }
    &-nav {
      display: grid;
      grid-row-gap: 24px;
      grid-template-columns: repeat(4, auto);
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #606266 !important;
      .item {
        display: flex;
        align-items: center;
        padding: 0 12px;
        width: 174px;
        height: 48px;
        box-sizing: border-box;
        img {
          width: 24px;
          height: 24px;
        }
        margin-right: 12px;
        cursor: pointer;
        &.active,
        &:hover {
          background: #f2f6ff !important;
        }
      }
    }
  }
}

.header-kby.header-change .nav .menulist li,
.header-kby.blackKbyHead .nav .menulist li {
  .subnav-active {
    color: #3370ff !important;
  }
}

.upDownIcon {
  position: absolute;
  right: 5px;
  top: 27px;
  font-size: 10px;
  margin-left: 12px;
  display: none;
}

.search-nav {
  position: relative;

  .linkA {
    padding-right: 25px !important;
  }

  .upDownIcon {
    display: inline-block;
  }

  &:hover {
    .icon-down {
      transform: rotate(180deg);
    }
    .upDownIcon {
      transform: rotate(180deg);
    }
  }
}

.search-nav:hover {
  .trademark-query-subnav {
    display: block;
  }
}

.header-kby .nav .menulist li .trademark-query-subnav a:hover {
  color: #3370ff !important;
}

.header-kby .nav .menulist li.search-nav a.active::after {
  left: 43%;
}

.shencea {
  font-size: 14px !important;
  width: 120px;
  padding: 0px !important;
}
</style>
