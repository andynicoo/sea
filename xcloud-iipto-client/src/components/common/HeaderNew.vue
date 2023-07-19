<template>
  <div class="header header-kby" v-if="isShow">
    <div class="msk" v-show="maskShow"></div>
    <div class="nav ksy-w1320">
      <div class="ksy-ib logo" @click="goIndex">
        <a v-if="PROCESS_ENV.NODE_PLA === 'kby'"><img src="@/assets/images/login/logo.svg" alt="logo"/></a>
        <a v-if="PROCESS_ENV.NODE_PLA === 'wg'"><img src="@/assets/images/login/wglogo.svg" alt="logo"/></a>
      </div>
      <span class="goback hand" @click="goIndex" v-if="curUrl !== '/productDetail'">
        <img src="@/assets/images/common/toleft.svg" alt="意见反馈" />
        返回首页
      </span>

      <ul class="ksy-ib menulist" v-if="curUrl === '/productDetail'">
        <li
          v-for="item in navList"
          :key="item.navId"
          @mouseenter="() => navHover(item)"
          @mouseleave="() => (maskShow = false)"
          v-sensors="{
            type: 'ClickNavigationBar',
            event: 'click',
            getParams: () => {
              return { navigation_bar_name: item.name };
            },
          }"
        >
          <a :href="item.link">{{ item.name }}</a>

          <template v-if="['产品服务'].includes(item.name) && item.sonNavs && item.sonNavs.length">
            <div class="menucontent ksy-w1320gd">
              <AlertWindow :list="item.sonNavs" :link="item.route" />
            </div>
          </template>
        </li>
      </ul>

      <div class="ksy-fr flex bar-right">
        <UserInfo />
      </div>
    </div>
  </div>
</template>

<script>
import UserInfo from '@/components/common/UserInfo';
import AlertWindow from '@/components/common/AlertWindow';
import { getNav } from '@/api/myOrder.js';
export default {
  components: {
    UserInfo,
    AlertWindow,
  },
  watch: {
    '$route.path': {
      handler(newVal) {
        console.log(newVal);
        this.curUrl = newVal;

        this.maskShow = false;
      },
    },
  },
  data() {
    return {
      maskShow: false,
      navList: [],
      curUrl: '',
    };
  },
  mounted() {
    this.getNav();
    console.log(this.$route);
    this.curUrl = this.$route.path;
  },
  computed: {
    // 是否显示
    isShow() {
      return !['/paymentSuccess','/payment','/trademarkNameReviewReport'].includes(this.$route.path);
    },
  },
  methods: {
    goIndex() {
      window.location.href = location.origin;
    },
    getNav() {
      let that = this;
      getNav().then(
        (res) => {
          if (res.code === 0) {
            that.navList = res.data;
          } else {
            that.$Message.error(res.message);
          }
        },
        (err) => {
          that.$Message.error(err.message);
        }
      );
    },
    navHover(item) {
      if (['产品服务'].includes(item.name)) {
        this.maskShow = true;
      } else {
        this.maskShow = false;
      }
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
}
.goback {
  color: rgba(0, 0, 0, 0.9);
  margin-left: 56px;
  font-size: 14px;
}
.header {
  width: 100%;
  height: 64px;
  border-radius: 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: #ffffff;
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
      }
    }
    .menulist {
      margin-left: 50px;
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
          padding: 0 15px;
          display: flex;
          align-items: center;
          &.active {
            color: #3a7fff;
          }
          &:hover {
            color: #3a7fff;
          }
        }
        .menucontent {
          position: absolute;
          top: 64px;
          left: 0;
          display: none;
          background: #ffffff;
          box-shadow: 0 2px 12px 1px rgba(16, 68, 166, 0.07);
          border-radius: 0;
          z-index: 99999;
        }
        &:hover .menucontent {
          display: block;
        }
      }
    }
    .bar-right {
      height: 100%;
      .change-language {
        margin-right: 10px;
        .icon-earth {
          color: rgba(rgba(0, 0, 0, 0.9), 0.4);
        }
        &:hover {
          color: #3a7fff;
          .icon-earth {
            color: #3a7fff;
          }
          .ant-dropdown-trigger {
            color: #3a7fff;
          }
        }
        .ant-dropdown-trigger {
          cursor: pointer;
          margin-bottom: 0;
          line-height: 70px;
          color: rgba(rgba(0, 0, 0, 0.9), 0.9);
          font-size: 16px;
        }
      }
    }
  }
  &-kby {
  }
}
/deep/ .ant-dropdown {
  .ant-dropdown-menu {
    width: 125px;
    padding: 0;
    text-align: center;
    font-size: 14px;
    color: rgba(rgba(0, 0, 0, 0.9), 0.6);
    box-shadow: 0 2px 12px 0 rgba(16, 68, 166, 0.07);
    border-radius: 4px;
    li {
      &:hover {
        background: #fff;
        color: #3a7fff;
      }
    }
  }
}
</style>
