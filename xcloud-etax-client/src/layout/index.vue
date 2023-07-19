<template>
  <div class="app-wrapper">
    <!-- 顶部导航栏 -->
    <Navbar
      class="navbar-container"
      ref="navbarRef"
      v-if="showNavbar"
      :style="{ display: showNavbar ? 'block' : 'none' }"
    />
    <div class="main-container" ref="mainContainer" :class="{ hiddenSidebar: !showSidebar, isCollapsed: isCollapsed }">
      <!-- 左侧菜单栏 -->
      <Sidebar
        class="sidebar-container"
        ref="sidebarRef"
        v-if="showSidebar"
        :style="{ display: showSidebar ? 'block' : 'none' }"
      />
      <!-- 主要页面显示 -->
      <section class="app-main" :class="{ hideNavbar: !showNavbar }">
        <Breadcrumb />
        <keep-alive>
          <router-view :key="key" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <router-view :key="key" v-if="!$route.meta.keepAlive" />
      </section>
    </div>

    <!-- 在线客服 -->
    <SideService :showToTop="showToTop" @handleBackTop="handleBackTop(40)" />
  </div>
</template>
<script>
import { Navbar, Sidebar, SideService } from './components';
import { exitCustomerList, onlyNavbarList, whiteList } from '@/permission';
import { isMobile } from '@/utils/validate';
import { personalCenterIndex, visitStatic } from '@/api/user/userModule';
import Breadcrumb from '@/components/Breadcrumb';

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    SideService,
    showToTop: false,
    Breadcrumb,
  },
  data() {
    return {
      showToTop: false,
    };
  },
  computed: {
    key() {
      return this.$route.path;
    },
    /**
     * 是否显示navbar，白名单中的路由默认不显示。
     * 但是如果同时配置了onlyNavbarList，则对应的路由会显示navbar
     */
    showKright() {
      let path = this.$route.path;
      path = path.replace(/\/$/g, '');
      if (exitCustomerList.includes(path)) {
        return false;
      }
      return true;
    },
    /**
     * 是否显示navbar，白名单中的路由默认不显示。
     * 但是如果同时配置了onlyNavbarList，则对应的路由会显示navbar
     */
    showNavbar() {
      let path = this.$route.path;
      path = path.replace(/\/$/g, '');
      if (onlyNavbarList.includes(path)) {
        return true;
      }
      return !whiteList.includes(path);
    },
    /**
     * 是否显示sidebar，白名单中的路由不显示
     */
    showSidebar() {
      let path = this.$route.path;
      path = path.replace(/\/$/g, '');
      return !whiteList.includes(path);
    },
    // 菜单收缩标识
    isCollapsed() {
      return this.$store.getters.sidebar.opened;
    },
  },
  created() {
    // 如果是用手机打开pc端，会跳转到H5端
    if (isMobile() && location.href.indexOf('/payment') === -1) {
      location.href = this.shareUrl + location.search;
    }
    if (isMobile() && location.href.indexOf('/payment') != -1 && !location.origin.includes('hk')) {
      location.href = this.shareUrl + location.pathname.replace('/client', '') + location.search;
    }
    // 统计访客
    this.setUserId();
  },
  mounted() {
    // 返回顶部设置监听
    let div = this.$refs.mainContainer;
    div.addEventListener('scroll', this.onDivScroll);
  },
  methods: {
    onDivScroll(e) {
      let div = this.$refs.mainContainer;
      // main div scrollnum 用于某些页面 元素置顶定位等
      this.$store.dispatch('app/setScrullNum', div.scrollTop);

      if (div.scrollTop > 100) {
        //大于滚动距离显示返回顶部图标
        this.showToTop = true;
      } else {
        this.showToTop = false;
      }
    },
    /**
     * 点击返回顶部
     * @param step 参数step表示时间间隔的幅度大小，以此来控制速度
     */
    handleBackTop(step = 40) {
      let div = this.$refs.mainContainer;
      div.scrollTop -= step;
      if (div.scrollTop > 0) {
        var time = setTimeout(() => this.handleBackTop(step), 15);
      } else {
        clearTimeout(time);
      }
    },
    /**
     * 统计访客
     */
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
      } else if (url.indexOf('promteCode') !== -1) {
        localStorage.removeItem('invitedCode');
        localStorage.removeItem('promteCode');
        let url1 = url.split('?')[1];
        let params = new URLSearchParams('?' + url1);
        let promteCode = params.get('promteCode');
        this.staticVisit(promteCode, 2);
        localStorage.setItem('promteCode', promteCode);
        sessionStorage.setItem('promteCode', promteCode);
      }
    },
    /**
     * 统计访客的接口
     */
    staticVisit(code, type) {
      let data = {};
      if (type === 1) {
        data = { promteCode: code };
      } else if (type == 2) {
        data = { promteCode: code };
      }
      visitStatic(data).then((res) => {
        // console.log(res)
      });
    },
    // 区分售前和售后客服
    customerService() {
      let configId = '9ee67f6c-c422-4ddf-9a63-dcc7e76e0d4c'; // 售后
      if (location.href.indexOf('productDetail') !== -1) {
        configId = 'f69a32e9-64dd-4d7d-b787-9b2753de99d0'; // 售前
      }
      easemobim.bind({ configId });
    },
  },
};
</script>
<style lang="less" scoped>
.back-top {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  background: #1890ff;
  position: fixed;
  right: 0px;
  bottom: 128px;
  width: 42px;
  height: 58px;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 7px;
  // position: fixed;
  // bottom: 110px;
  // right: 0px;
  // color: #fff;
  // border-bottom-left-radius: 4px;
  // border-top-left-radius: 4px;
  // width: 42px;
  // background: #1890ff;
  // text-align: center;
  // cursor: pointer;
  // display: none;
  // padding: 3px 0;
  /deep/ .ivu-tooltip-popper {
    top: 12px !important;
    left: -93px !important;
  }
  /deep/ .ivu-tooltip-rel {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  span {
    font-size: 14px;
    color: #ffffff;
  }
  img {
    width: 20px;
    height: 20px;
    margin-bottom: 3px;
  }
}
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.navbar-container {
  box-sizing: border-box;
}
.main-container {
  min-height: calc(100vh - 60px);
  transition: padding-left 0.28s;
  padding-left: 256px;
  position: relative;
  background: #f5f5f5;
  height: 100%;
  overflow: auto;
  &.isCollapsed {
    padding-left: 64px;
  }
  &.hiddenSidebar {
    transition: none;
    padding-left: 0px;
  }
}
.app-main {
  min-height: calc(100vh - 60px);
  width: 100%;
  position: relative;
  padding-top: 60px;
  height: 100%;
}
::v-deep .app-main.hideNavbar {
  padding-top: 0px;
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
/deep/ .ivu-layout {
  // display: flex;
  // flex-direction: row !important;
  // height: 100%;
  // overflow: hidden;
  // background: #f5f7f9;
}
.ivu-layout-header {
  background-color: #fff;
}
.my-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 24px;
}
</style>
<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 12px;
  line-height: initial;
}
.ivu-btn-primary {
  background-color: #16ade9;
  border-color: #16ade9;
  color: #fff;
  /* border-radius: 4px; */
}
/* 分页组件公用样式 */
.ivu-page-item:hover,
.ivu-page-item-active {
  background: #16ade9 !important;
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
  color: #16ade9 !important;
  font-size: 14px;
  border-color: #16ade9 !important;
}
.ivu-page-prev:hover a,
.ivu-page-next:hover a {
  color: #16ade9 !important;
}
.ivu-page-item-active:hover a,
.ivu-page-item-active a {
  color: #ffffff !important;
}
.ivu-page-item-jump-prev a i::after,
.ivu-page-item-jump-prev a i::before,
.ivu-page-item-jump-next a i::after,
.ivu-page-item-jump-next a i::before {
  color: #16ade9 !important;
}

.ivu-menu {
  color: #333333 !important;
}
iframe {
  margin-bottom: 10px;
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

.annalsDe-table tr.ivu-table-row-hover td {
  background: #ebf7ff !important;
}
/*复选框选中  */
.ivu-checkbox-checked .ivu-checkbox-inner,
.ivu-checkbox-checked .ivu-checkbox-inner:hover,
.ivu-checkbox-checked .ivu-checkbox-inner:focus {
  background: #16ade9 !important;
  border-color: #16ade9 !important;
  box-shadow: none;
}
/* 输入框 */
.ivu-input-wrapper input:hover,
.ivu-input-wrapper input:focus {
  border-color: #16ade9 !important;
  box-shadow: none !important;
}
/* 下拉框的下拉列表*/
.ivu-select-visible .ivu-select-selection,
.ivu-select-selection-focused,
.ivu-select-selection:hover {
  border-color: #16ade9 !important;
  box-shadow: none !important;
}
.ivu-select-dropdown {
  max-height: 236px !important;
  padding-bottom: 0 !important;
  padding-top: 0 !important;
}
.ivu-select-dropdown-list .ivu-select-item:hover {
  background: #16ade9 !important;
  color: #313233 !important;
}
.ivu-select-dropdown-list .ivu-select-item-selected {
  background: #fff !important;
  color: #16ade9 !important;
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
  background: #16ade9 !important;
}
.ivu-date-picker-cells-cell:hover em {
  background: #16ade9 !important;
  box-shadow: none !important;
}
.ivu-date-picker-cells-focused em {
  box-shadow: none !important;
}
.ivu-date-picker-cells-cell-selected em,
.ivu-date-picker-cells-cell-selected:hover em {
  background: #16ade9 !important;
}
/* 复选下拉框的右边那个勾 */
.ivu-select-multiple .ivu-select-item-selected:after {
  color: #16ade9 !important;
}
/* tabs */
.ivu-tabs-nav .ivu-tabs-tab:hover {
  color: #16ade9 !important;
}
/* 面包屑hover */
.ivu-breadcrumb a:hover {
  color: #16ade9 !important;
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
  border-color: #16ade9 !important;
  background-color: #fff !important;
}
.ivu-radio-focus {
  box-shadow: none;
}
.ivu-radio-inner:after {
  background-color: #16ade9 !important;
  width: 8px;
  height: 8px;
  left: 3px;
  top: 3px;
  /* left: 3px;
  top: 3px; */
}
.ivu-table-cell {
  padding-left: 10px !important;
  padding-right: 10px !important;
  /* text-overflow: unset; */
  /* white-space: nowrap; */
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
  overflow: hidden;
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
</style>
