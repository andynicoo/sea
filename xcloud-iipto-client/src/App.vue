<template>
  <a-locale-provider :locale="zh_CN">
    <div id="app" v-if="$route.path === '/trademarkNameReviewReport'">
      <router-view />
    </div>
    <div
      v-else
      id="app"
      :class="{
        kbyclient: PROCESS_ENV.NODE_PLA === 'kby',
        wgclient: PROCESS_ENV.NODE_PLA === 'wg',
        'login-container': curUrl == '/login' || $route.path == '/',
      }"
    >
      <HeaderNew v-if="((ishfShow && ifLogin) || curUrl) && curUrl !== '/login'" />
      <div :class="appClass ? 'app-container' : ''">
        <MenuLeft v-if="leftShow && !['/payment', '/paymentSuccess'].includes(curUrl)"></MenuLeft>
        <router-view />

        <SideService />
      </div>
      <Footer v-if="ifLogin && ishfShow && !['/payment', '/paymentSuccess'].includes(curUrl)"></Footer>
      <Modal
        v-model="sfcVisible"
        width="416px"
        :closable="false"
        @on-ok="sfcVisible = false"
        @on-cancel="sfcVisible = false"
      >
        <div v-for="(item, index) in sfc" :key="index">
          <img v-if="item.value.includes('http')" class="sfc-img" :src="item.value" />
          <p v-else>{{ item.value }}</p>
        </div>
        <div slot="footer" class="sfc-mt10">
          <Button @click="sfcVisible = false" type="primary">关闭</Button>
        </div>
      </Modal>
      <div id="box"></div>
    </div>
  </a-locale-provider>
</template>

<script>
import Header from '@/components/common/header';
import HeaderNew from '@/components/common/HeaderNew';
import MenuLeft from '@/components/common/menuLeft';
import Footer from '@/views/common/otherFooter';
import SideService from '@/components/common/SideService';
import { visitStatic } from '@/api/user/userModule';
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default {
  name: 'App',
  components: {
    Header,
    HeaderNew,
    MenuLeft,
    Footer,
    SideService,
  },
  data() {
    return {
      zh_CN,
      nowPath: this.$route.path,
      sfc: [],
      sfcVisible: false,
      appClass: true,
      curUrl: '',
    };
  },
  created() {
    // this.init();
    console.log(this.$route.path, '$route.path');
    if (this.PROCESS_ENV.NODE_PLA === 'kby') {
      import('@/assets/style/mixin.less');
      document.title = '跨标云';
    }
    if (this.PROCESS_ENV.NODE_PLA === 'wg') {
      import('@/assets/style/mixinwg.less');
      document.title = '外观专利';
    }
  },
  methods: {
    init() {
      this.$sensors.use('WebPopup', {
        api_base_url: 'https://chenhaijituan.sfn-tx-guangzhou-01.saas.sensorsdata.cn/api/v2',
        popup_campaign_listener: {
          shouldStart: function(SFCampaign) {
            // ...
            return true;
          },
          onStart: (SFCampaign) => {
            this.$Modal.remove();
            this.sfc = JSON.parse(SFCampaign.content);
            this.sfcVisible = true;
          },
          onFailed: function(SFCampaign, errorCode, errorMessage) {},
          onEnd: function(SFCampaign) {},
        },
      });
      this.setUserId();
      // 浏览器判断
      var browser = {
        versions: (function() {
          let u = navigator.userAgent;
          return {
            // 移动终端浏览器版本信息
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
          };
        })(),
      };
      if (browser.versions.mobile) {
        // hk域名不跳转移动端
        if (location.origin.includes('hk')) return;
        // 商标核名报告页不跳转移动端;
        if (location.href.indexOf('/trademarkNameReviewReport') !== -1) return;
        if (location.href.indexOf('/payment') != -1) {
          location.href = 'https://m.itaxs.com' + location.pathname.replace('/client', '') + location.search;
          return;
        }
        // 判断是否是移动设备打开。browser代码在下面
        let url = this.shareUrl;
        let invitedCode = localStorage.getItem('invitedCode');
        let promteCode = localStorage.getItem('promteCode');
        if (invitedCode != null) {
          url += '?invitedCode=' + invitedCode;
        } else if (promteCode != null) {
          url += '?promteCode=' + promteCode;
        }
        window.location.href = url;
      }
      let tokenl = localStorage.getItem('token');
      let sid = localStorage.getItem('sessionId');

      let url = window.location.href;
      const hrefArr = url.split('/');
      // eslint-disable-next-line no-unused-vars
      const path = hrefArr[hrefArr.length - 1];
      const pathname = window.location.pathname;

      if (tokenl && sid) {
        console.log('执行了app的created');
        this.$store.commit('saveLogin', true);
        if (
          pathname.indexOf('/activity') !== -1 ||
          pathname.indexOf('/prizePage') !== -1 ||
          pathname.indexOf('/lottery') !== -1
        ) {
          this.$store.commit('setHfShow', false);
          this.appClass = false;
        } else {
          this.$store.commit('setHfShow', true);
          this.appClass = true;
        }

        let url = window.location.href;
        const hrefArr = url.split('/');
        const path = hrefArr[hrefArr.length - 1];
        // 授权
        if (path.indexOf('state') > 0 && path.indexOf('code') > 0) {
          this.$router.push({ path: path });
          this.$store.commit('saveLeft', true);
          return;
        }
        if (
          pathname !== '/' &&
          pathname.indexOf('login') === -1 &&
          pathname.indexOf('productDetail') === -1 &&
          pathname.indexOf('sureOrder') === -1 &&
          pathname.indexOf('oaPaid') === -1 &&
          pathname.indexOf('activity') === -1 &&
          pathname.indexOf('crazyThursday') === -1 &&
          pathname.indexOf('shoppingCart') === -1 &&
          pathname.indexOf('prizePage') === -1 &&
          pathname.indexOf('lottery') === -1
        ) {
          this.$store.commit('saveLeft', true);
        } else {
          this.$store.commit('saveLeft', false);
        }
      } else {
        this.$store.commit('saveLeft', false);

        if (window.location.href.indexOf('/activity618') > -1) {
          this.$router.push({ path: `/activity618${window.location.search}` });

          this.appClass = false;
          return;
        }
        if (window.location.href.indexOf('/paymentSuccess') > -1) {
          this.$router.push({ path: `/paymentSuccess${window.location.search}` });
          this.appClass = false;
          return;
        }
        if (window.location.href.indexOf('/payment') > -1) {
          this.$router.push({ path: `/payment${window.location.search}` });
          this.appClass = false;
          return;
        }
        if (window.location.href.indexOf('/trademarkNameReviewReport') > -1) {
          this.$router.push({ path: `/trademarkNameReviewReport${window.location.search}` });
          this.appClass = false;
          return;
        }
        if (window.location.href.indexOf('/activity') > -1) {
          this.appClass = false;
          return;
        }
        if (window.location.href.indexOf('/en/login') > -1) {
          this.$router.push({ path: `/en/login${window.location.search}` });
        } else if (window.location.href.indexOf('/productDetail') > -1) {
          console.log(window.location.href);
        } else {
          this.$router.push({ path: `/login${window.location.search}` });
        }
      }
    },
    setUserId() {
      let url = window.location.href;
      if (url.indexOf('invitedCode') !== -1) {
        localStorage.removeItem('invitedCode');
        localStorage.removeItem('promteCode');
        let url1 = url.split('?')[1];
        let params = new URLSearchParams('?' + url1);
        let invitedCode = params.get('invitedCode');
        this.staticVisit(invitedCode, 1);
        localStorage.setItem('invitedCode', invitedCode);
        this.invitedCode = invitedCode;
      } else if (url.indexOf('promteCode') !== -1) {
        localStorage.removeItem('invitedCode');
        localStorage.removeItem('promteCode');
        let url1 = url.split('?')[1];
        let params = new URLSearchParams('?' + url1);
        let promteCode = params.get('promteCode');
        this.staticVisit(promteCode, 2);
        localStorage.setItem('promteCode', promteCode);
        sessionStorage.setItem('promteCode', promteCode);
        this.promteCode = promteCode;
      }
    },
    // 统计访客的接口
    staticVisit(code, type) {
      console.log(1);
      let data = {};
      if (type === 2) {
        data = { promteCode: code };
      }
      visitStatic(data).then((res) => {
        // console.log(res)
      });
    },
    closeActive() {
      this.$store.commit('saveActiveStatus', false);
      localStorage.setItem('iscloseActive', true);
    },
    goActivePage() {
      this.$router.push({
        path: 'activityPage',
      });
    },
  },

  computed: {
    leftShow() {
      return this.$store.state.login.leftShow;
    },
    showActive() {
      return this.$store.state.login.isShowActiveImg;
    },
    ifLogin() {
      return this.$store.state.login.isLogin;
    },
    ishfShow() {
      return this.$store.state.login.hfShow;
    },
  },
  watch: {
    '$route.path': {
      handler(newVal) {
        this.init();
        this.curUrl = newVal;
      },
    },
  },
};
</script>

<style>
#app {
  font-family: 'Microsoft YaHe', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 12px;
  line-height: initial;
  background-color: #f7f8fa;
}
.ivu-btn-primary {
  background-color: #00a3ff;
  border-color: #00a3ff;
  color: #fff;
  /* border-radius: 4px; */
}
/* 分页组件公用样式 */
.ivu-page-item:hover,
.ivu-page-item-active {
  background: #00a3ff !important;
  color: #ffffff !important;
  font-size: 14px;
  border: 1px solid #d9d9d9 !important;
}
.ivu-page-item:hover a,
.ivu-page-item-active a {
  color: #ffffff !important;
}
.ivu-page-prev:hover,
.ivu-page-next:hover {
  color: #00a3ff !important;
  font-size: 14px;
  border-color: #00a3ff !important;
}
.ivu-page-prev:hover a,
.ivu-page-next:hover a {
  color: #00a3ff !important;
}
.ivu-page-item-active:hover a,
.ivu-page-item-active a {
  color: #ffffff !important;
}
.ivu-page-item-jump-prev a i::after,
.ivu-page-item-jump-prev a i::before,
.ivu-page-item-jump-next a i::after,
.ivu-page-item-jump-next a i::before {
  color: #00a3ff !important;
}

.ivu-menu {
  color: #333333 !important;
}
.ivu-menu-item-group-title {
  height: 15px;
}
.ivu-btn:active,
.ivu-btn:focus {
  box-shadow: none !important;
}
.ivu-divider-horizontal {
  display: inline-block;
}
tr.ivu-table-row-hover td {
  background: rgba(153, 153, 153, 0.06) !important;
}
/*复选框选中  */
.ivu-checkbox-checked .ivu-checkbox-inner,
.ivu-checkbox-checked .ivu-checkbox-inner:hover,
.ivu-checkbox-checked .ivu-checkbox-inner:focus {
  background: #00a3ff !important;
  border-color: #00a3ff !important;
  box-shadow: none;
}
/* 输入框 */
.ivu-input-wrapper input:hover,
.ivu-input-wrapper input:focus {
  border-color: #00a3ff !important;
  box-shadow: none !important;
}
/* 下拉框的下拉列表*/
.ivu-select-visible .ivu-select-selection,
.ivu-select-selection-focused,
.ivu-select-selection:hover {
  border-color: #00a3ff !important;
  box-shadow: none !important;
}
.ivu-select-dropdown {
  padding-bottom: 0 !important;
  padding-top: 0 !important;
}
.ivu-select-dropdown-list .ivu-select-item:hover {
  background: #00a3ff !important;
  color: #313233 !important;
}
.ivu-select-dropdown-list .ivu-select-item-selected {
  background: #fff !important;
  color: #00a3ff !important;
}
/* 弹窗头部 */
.ivu-modal-header {
  background: #f8f8f8 !important;
}
/* input */
.ivu-input-large {
  font-size: 12px;
}
/* 时间选择器 点击后的时间列表 */
.ivu-date-picker-cells-cell-today em:after {
  background: #00a3ff !important;
}
.ivu-date-picker-cells-cell:hover em {
  background: #00a3ff !important;
  box-shadow: none !important;
}
.ivu-date-picker-cells-focused em {
  box-shadow: none !important;
}
.ivu-date-picker-cells-cell-selected em,
.ivu-date-picker-cells-cell-selected:hover em {
  background: #00a3ff !important;
}
/* 复选下拉框的右边那个勾 */
.ivu-select-multiple .ivu-select-item-selected:after {
  color: #00a3ff !important;
}
/* tabs */
.ivu-tabs-nav .ivu-tabs-tab:hover {
  color: #00a3ff !important;
}
/* 面包屑hover */
.ivu-breadcrumb a:hover {
  color: #00a3ff !important;
}
.ivu-breadcrumb {
  font-size: 12px !important;
}
.ivu-table td,
.ivu-table th {
  font-weight: inherit;
}
.ivu-tabs-nav .ivu-tabs-tab-active {
  font-weight: inherit;
}
.ivu-radio-checked .ivu-radio-inner {
  border-color: #00a3ff !important;
  background-color: #fff !important;
}
.ivu-radio-focus {
  box-shadow: none;
}
.ivu-radio-inner:after {
  /* background-color: #fff !important; */
  /* width: 6px;
  height: 6px; */
  /* left: 3px;
  top: 3px; */
}
.ivu-table-cell {
  padding-left: 10px !important;
  padding-right: 10px !important;
}
.ivu-input-disabled {
  border: none !important;
}
.ivu-input-disabled:hover {
  border: none !important;
}
.ivu-modal-header-inner {
  color: #333333 !important;
}
.ivu-input[disabled],
fieldset[disabled] .ivu-input {
  background-color: #f5f5f5 !important;
  color: #626466 !important;
}
.ivu-select-disabled .ivu-select-selection {
  background-color: #f5f5f5 !important;
  color: #626466 !important;
}
.ivu-table-tip {
  overflow: hidden !important;
}
.ive-table-overflowX {
  overflow-x: hidden !important;
}
.ivu-modal-content {
  border-radius: 4px !important;
  box-shadow: 2px 2px 2px #cccccc;
}
.ivu-input {
  font-size: 14px !important;
}
.app-container {
  box-sizing: border-box;
  background: #f7f8fa;
  width: 1200px;
  margin: auto;
  padding-top: 80px;
}
</style>

<style lang="less" scoped>
.login-container {
  .app-container {
    width: 100%;
    padding: 0;
  }
}
.currentPage {
  padding: 0px;
}

.bottom-adBox {
  min-width: 1200px;
  img.bottomA {
    width: 100%;
    z-index: 99;
    position: fixed;
    bottom: -3px;
  }
  .close-box {
    z-index: 99;
    position: fixed;
    bottom: 20px;
    right: 12%;
    .close-btn {
      cursor: pointer;
    }
  }
}
</style>
<style lang="less">
.ivu-layout-header {
  background-color: #fff;
}
.my-card {
  background-color: #fff;
  padding: 24px;
}
</style>
