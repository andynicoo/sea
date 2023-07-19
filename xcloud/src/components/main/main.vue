<template>
  <Layout style="height: 100%" class="skin-blue">
    <Layout v-if="layout === 'toptest'" style="height: 100%" class="main-layout-top">
      <Header class="main-layout-header">
        <side-menu accordion ref="sideMenu" mode="horizontal" :active-name="$route.name" @on-select="turnToPage" :menu-list="menuList"></side-menu>
      </Header>
      <Content
        :class="mainClass"
        :style="{
          margin: '70px 20px',
          background: '#fff',
          minHeight: '500px',
        }"
      >
        <Layout class="main-layout-content-wrapper">
          <custom-bread-crumb class="main-layout-bread-crumb" v-show="screenWidth > 768" show-icon :list="breadCrumbList"></custom-bread-crumb>
          <div class="main-layout-tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag" />
          </div>

          <Content class="main-layout-view-wrapper" v-if="qianKunConfigApps.map((v) => v.activeRule).some((v) => this.$route.path.indexOf(v) !== -1)">
            <div id="qiankunDomWrap" class="content-main-wrap"></div>
          </Content>
          <Content class="main-layout-view-wrapper" v-else>
            <keep-alive :include="cacheList">
              <router-view />
            </keep-alive>
            <ABackTop :height="100" :bottom="40" :right="50" container=".main-layout-view-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>

    <Layout v-else style="height: 100%" class="main-layout-left">
      <Sider hide-trigger collapsible :width="210" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{ 'overflow-y': 'scroll', 'overflow-x': 'hidden' }">
        <div class="slider-top">
          <img v-show="!collapsed" class="max-logo" src="@/assets/images/common/icon_logo.svg" key="max-logo" />
          <img v-show="collapsed" class="min-logo" :src="minLogo" key="min-logo" />
        </div>
        <side-menu class="side-menu-container" accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList"> </side-menu>
      </Sider>
      <Layout>
        <Header class="main-layout-header">
          <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollapsedChange"></sider-trigger>
          <custom-bread-crumb class="main-layout-bread-crumb" v-show="screenWidth > 768" show-icon :list="breadCrumbList"></custom-bread-crumb>
          <ul class="main-layout-header-bar">
            <li v-if="showCheck">
              <Check />
            </li>
            <li>
              <Message />
            </li>
            <li>
              <i class="el-icon-bell system-notice-bell" @click="showSystemNotice"></i>
            </li>
            <li>
              <Dropdown @on-click="getFirmData">
                <el-button class="svgImg" style="border: none !important; margin-top: 15px">
                  <div class="frimBox">
                    <img src="@/assets/icons/icon_changeCompany.svg" alt="" />
                    <div class="frimName">{{ currentFrim }}</div>
                  </div>
                </el-button>
                <DropdownMenu slot="list" style="z-index: 1000">
                  <DropdownItem v-for="(item, index) in firmList" :key="index" :name="item.id">
                    {{ item.name }}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </li>
            <li @click="handleClickSetting">
              <el-button class="svgImg" style="border: none !important">
                <img src="@/assets/icons/icon_userCenter.svg" alt="" />
              </el-button>
            </li>
            <li @click="handleClicklogout">
              <el-button class="svgImg" style="border: none !important">
                <img src="@/assets/icons/icon_exit.svg" alt="" />
              </el-button>
            </li>
            <li>
              <fullscreen :screenWidth="screenWidth" v-model="isFullscreen" />
            </li>
          </ul>
        </Header>
        <Content :class="mainClass">
          <Layout class="main-layout-content-wrapper">
            <div class="main-layout-tag-nav-wrapper">
              <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag" />
            </div>

            <!-- <Content class="main-layout-view-wrapper" >
              <div id="qiankunDomWrap" class="content-main-wrap"></div>
            </Content> -->
            <Content class="main-layout-view-wrapper">
              <div id="qiankunDomWrap" class="content-main-wrap" v-if="qianKunConfigApps.map((v) => v.activeRule).some((v) => this.$route.path.includes(v))"></div>
              <keep-alive v-else :include="cacheList">
                <router-view />
              </keep-alive>

              <ABackTop :height="100" :bottom="35" :right="50" container=".main-layout-view-wrapper"></ABackTop>
            </Content>
          </Layout>
        </Content>
      </Layout>
    </Layout>
    <SystemNoticeDialog :systemNoticeDialog.sync="systemNoticeDialog" ref="systemNoticeDialog" v-if="firmList && firmList.length" />
  </Layout>
</template>

<script>
import Theme from './components/theme';
import SideMenu from './components/side-menu';
import HeaderBar from './components/header-bar';
import TagsNav from './components/tags-nav';
import ABackTop from './components/a-back-top';
import Fullscreen from './components/fullscreen';
import ErrorStore from './components/error-store';
import siderTrigger from './components/header-bar/sider-trigger';
import customBreadCrumb from './components/header-bar/custom-bread-crumb';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import { getNewTagList, getNextRoute, routeEqual, getToken } from '@/libs/util';
import minLogo from '@/assets/images/logo-min.svg';
import maxLogo from '@/assets/images/common/icon_logo.svg';
import './main.less';
import Layout from '../../../node_modules/iview/src/components/layout/layout';
import { getFirm, getCountrySelectList, saveNavLately } from '@/api/newApi/common.js';
import { registerMicroApps, start, initGlobalState } from 'qiankun';
import { qianKunConfigApps } from '@/config/index.js';

import SystemNoticeDialog from '@/view/module/consultingManage/systemNotice/components/systemNoticeDialog.vue';
import Message from './components/message/Message.vue';
import Check from '@/view/module/check/index.vue';
export default {
  name: 'Main',
  components: {
    Theme, // 切换主题
    Layout,
    SideMenu,
    HeaderBar,
    TagsNav,
    Fullscreen,
    ErrorStore,
    ABackTop,
    customBreadCrumb,
    siderTrigger,
    SystemNoticeDialog,
    Message,
    Check,
  },
  data() {
    return {
      collapsed: false,
      layout: '',
      minLogo,
      maxLogo,
      isFullscreen: false,
      screenWidth: 0,
      firmList: [],
      currentFrim: '企业',
      qianKunConfigApps: qianKunConfigApps,
      // 系统公告弹窗
      systemNoticeDialog: false,
    };
  },
  computed: {
    ...mapGetters(['errorCount']),
    breadCrumbList() {
      return this.$store.state.app.breadCrumbList;
    },
    headerLogoClass() {
      return ['main-layout-header-logo', this.collapsed ? 'main-layout-header-logo-collapsed' : ''];
    },
    mainClass() {
      return ['main-layout-content', this.collapsed ? 'main-layout-content-collapsed' : ''];
    },
    tagNavList() {
      return this.$store.state.app.tagNavList;
    },
    tagRouter() {
      return this.$store.state.app.tagRouter;
    },
    userAvatar() {
      return this.$store.state.user.avatarImgPath;
    },
    userName() {
      return this.$store.state.user.userName;
    },
    nickName() {
      return this.$store.state.user.nickName;
    },

    cacheList() {
      return this.tagNavList.length ? this.tagNavList.filter((item) => !(item.meta && item.meta.notCache)).map((item) => item.name) : [];
    },
    menuList() {
      return this.$store.getters.menuList;
    },
    local() {
      return this.$store.state.app.local;
    },
    hasReadErrorPage() {
      return this.$store.state.app.hasReadErrorPage;
    },
    showCheck() {
      return this.$store.state.user.menus.map((item) => item.path).includes('check/checkResult');
    },
  },
  created() {
    this.getfirmList();
    //获取国家列表
    getCountrySelectList().then((res) => {
      localStorage.setItem('countryList', JSON.stringify(res.data));
    });
  },
  methods: {
    showSystemNotice() {
      if (this.$refs.systemNoticeDialog) {
        this.$refs.systemNoticeDialog.getSystemNoticeInfo();
      }
    },
    /**
     * 获取企业列表
     */
    getfirmList() {
      getFirm().then((res) => {
        if (res.code == 0) {
          this.firmList = res.data.reverse();
          localStorage.setItem('enterpriseList', JSON.stringify(this.firmList));
          if (localStorage.getItem('enterpriseId') == null) {
            window.localStorage.setItem('enterpriseId', res.data[0].id);
            window.localStorage.setItem('enterpriseCode', res.data[0].code);
          }
          window.localStorage.setItem('enterpriseList', JSON.stringify(res.data));
          const id = localStorage.getItem('enterpriseId');
          let enterpriseRecord = {
            id: Number(id),
          };
          this.firmList.some((res) => {
            if (res.id == id) {
              enterpriseRecord = res || {};
              this.currentFrim = res.name;
              localStorage.setItem('enterpriseName', res.name);
            }
          });
          //乾坤设置
          this.setQianKun(enterpriseRecord);
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    ...mapActions(['handleLogout']),
    /**
     * 退出登录
     */
    handleClicklogout() {
      this.$Modal.confirm({
        title: '确是否确认退出系统！',
        onOk: () => {
          this.handleLogout().then(() => {
            // 清空路由
            this.$router.options.routes = [];
            this.$router.push({
              name: 'login',
            });
          });
        },
      });
    },
    /**
     * 跳转个人设置
     */
    handleClickSetting() {
      this.$router.push({
        path: '/personal/index',
      });
    },
    /**
     * 切换企业
     */
    getFirmData(id) {
      window.localStorage.setItem('enterpriseId', id);
      let item = this.firmList.find((item) => item.id === id);
      window.localStorage.setItem('enterpriseCode', item.code);
      // let res = this.tagNavList.filter((item) => item.name === this.$config.homeName);
      // this.handleCloseTag(res, 'all');
      window.location.reload();
    },
    ...mapMutations(['setBreadCrumb', 'setTagNavList', 'addTag', 'setLocal']),
    ...mapActions(['handleLogin']),
    // 移除页面非白名单搜素缓存
    removeCacheQuery() {
      // 取消白名单的限制，所有页面都进行搜索条件缓存
      // let whiteList = ['/intellectualProperty/amazonFiling/index'];
      let cache = JSON.parse(sessionStorage.getItem('cacheQuery') || '{}');
      let whiteCache = {};
      for (let path in cache) {
        // if (whiteList.includes(path)) {
        whiteCache[path] = cache[path];
        // }
      }
      sessionStorage.setItem('cacheQuery', JSON.stringify(whiteCache));
    },
    turnToPage(route) {
      this.removeCacheQuery();
      let { name, params, query } = {};
      if (typeof route === 'string') name = route;
      else {
        name = route.name;
        params = route.params;
        query = route.query;
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1]);
        return;
      }
      this.$router.push({
        name,
        params,
        query,
      });

      const menuRecord = (this.$store.state.user.menus || []).find((item) => item.authority === 'MENU_' + name) || {};
      if (this.$qkActions) {
        this.$qkActions.setGlobalState({
          menuRecord: menuRecord,
        });
      }
      const { menuName: nav, path: url } = menuRecord;
      nav && url && saveNavLately({ nav, url });
    },
    handleCollapsedChange(state) {
      this.collapsed = state;
    },
    handleCloseTag(res, type, route) {
      if (type === 'all') {
        this.turnToPage(this.$config.homeName);
      } else if (routeEqual(this.$route, route)) {
        if (type !== 'others') {
          const nextRoute = getNextRoute(this.tagNavList, route);
          this.$router.push(nextRoute);
        }
      }
      this.setTagNavList(res);
    },
    handleClick(item) {
      this.turnToPage(item);
    },
    setLayout() {
      let layout = localStorage.getItem('layout');
      if (!layout) {
        layout = 'left';
        localStorage.setItem('layout', layout);
      }
      this.layout = layout;
    },
    //乾坤设置
    setQianKun(enterpriseRecord) {
      const menuRecord = (this.$store.state.user.menus || []).find((item) => item.path === location.pathname.substring(1)) || {};
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const appsArr = [];
      for (const app of qianKunConfigApps) {
        const appParams = {
          name: app.name,
          entry: app.entry,
          container: '#qiankunDomWrap',
          activeRule: app.activeRule,
          props: {
            token: getToken(), //token
            enterpriseRecord: enterpriseRecord, // 当前企业主体信息
            authoritiesList: userInfo ? userInfo.authorities : [],
            menuId: menuRecord.menuId || '', //菜单id,  后面会弃用
          },
        };
        appsArr.push(appParams);
      }
      registerMicroApps(appsArr);
      start();
      this.__proto__.__proto__.$qkActions = initGlobalState({ menuRecord: menuRecord, $router: () => this.$router });
    },
  },
  watch: {
    screenWidth(val) {
      const that = this;
      if (val < 768) {
        // 小于768强制折叠
        that.handleCollapsedChange(true);
      } else {
        that.handleCollapsedChange(false);
      }
    },
    $route(newRoute) {
      console.log('newRoute :>> ', newRoute);
      const { name, query, params, meta } = newRoute;
      this.addTag({
        route: { name, query, params, meta },
        type: 'push',
      });
      this.setBreadCrumb(newRoute);
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
      this.$refs['sideMenu'].updateOpenName(newRoute.name);
    },
  },
  mounted() {
    const that = this;
    // 宽度适应
    that.screenWidth = document.body.clientWidth;
    window.onresize = () => {
      return (() => {
        that.screenWidth = document.body.clientWidth;
      })();
    };
    // 设置布局
    this.setLayout();
    // 初始化设置面包屑导航和标签导航
    this.setTagNavList();
    this.addTag({
      route: this.$store.state.app.homeRoute,
    });
    this.setBreadCrumb(this.$route);
    // 设置初始语言
    this.setLocal(this.$i18n.locale);
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find((item) => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName,
      });
    }
  },
};
</script>
<style scoped lang="scss">
::v-deep .ivu-select-dropdown {
  z-index: 1000;
}
::v-deep .left-sider.ivu-layout-sider {
  overflow: inherit !important;
  height: 100%;
}
.slider-top {
  height: 60px;
  background-color: #fff;
  width: 100%;
  text-align: center;
  padding-top: 14px;
}
.side-menu-container {
  overflow-y: scroll;
  height: calc(100vh - 60px);
}
.frimBox {
  display: flex;
  justify-content: center;
  align-items: center;
}
.frimName {
  margin-left: 3px;
}
.system-notice-bell {
  font-size: 16px;
  margin-top: 2px;
  line-height: 62px;
}
.content-main-wrap {
  height: calc(100vh - 110px);
}
</style>
