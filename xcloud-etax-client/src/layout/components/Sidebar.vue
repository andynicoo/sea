<template>
  <div class="sidebar-container" :class="{ isCollapsed: isCollapsed }">
    <div class="sidebar-inner">
      <div class="layout-logo">
        <span v-show="false">{{ envpla }}</span>
        <a :href="homePageUrl" target="_blank" v-if="envpla === 'ksy'">
          <img src="@/assets/images/login/LOGO.svg" alt="logo" v-if="!isCollapsed" />
          <img src="@/assets/images/login/tinylogo.svg" alt="logo" :class="{ tinylogo: isCollapsed }" v-else />
        </a>
        <a :href="homePageUrl" target="_blank" v-if="envpla === 'kqy'">
          <img src="@/assets/images/login/LOGO77.svg" alt="logo" v-if="!isCollapsed" />
          <img src="@/assets/images/login/tinylogo77.svg" alt="logo" :class="{ tinylogo: isCollapsed }" v-else />
        </a>
      </div>
      <Sider
        ref="siderRef"
        collapsible
        hide-trigger
        :collapsed-width="64"
        v-model="isCollapsed"
        :style="{ 'max-width': isCollapsed ? '64px' : '256px', width: isCollapsed ? '64px' : '256px' }"
      >
        <!-- style="max-width:256px; width:256px; height: 100vh;" -->
        <Menu
          theme="light"
          ref="menuRef"
          v-show="!isCollapsed"
          :active-name="activeName"
          :open-names="defaultOpenMenu"
          @on-select="handleChangeMenu"
          :accordion="false"
        >
          <MenuGroup>
            <MenuItem name="/serviceList">
              <img src="@/assets/images/common/icon-gm-cur.svg" v-if="activeName == '/serviceList'" class="menu-icon" />
              <img src="@/assets/images/common/icon-gm.svg" v-else class="menu-icon" />
              <span class="workbench">购买服务</span>
            </MenuItem>
            <MenuItem name="/renewal" v-if="envpla === 'ksy'">
              <img src="@/assets/images/common/icon-xf-cur.svg" v-if="activeName == '/renewal'" class="menu-icon" />
              <img src="@/assets/images/common/icon-xf.svg" v-else class="menu-icon" />
              <span class="workbench">续费管理</span>
            </MenuItem>
            <MenuItem name="/work" v-if="envpla === 'ksy'">
              <img src="@/assets/images/common/icon-gzt-cur.svg" v-if="activeName == '/work'" class="menu-icon" />
              <img src="@/assets/images/common/icon-gzt.svg" v-else class="menu-icon" />
              <span class="workbench">工作台</span>
            </MenuItem>
          </MenuGroup>
          <div class="jiange"></div>
          <template v-if="envpla === 'ksy'">
            <Submenu name="/taxation" style="margin-bottom: 5px">
              <template slot="title">
                <img
                  v-if="activeOpenMenu === '/taxation'"
                  src="@/assets/images/common/icon-vat-cur.svg"
                  class="menu-icon"
                />
                <img v-else src="@/assets/images/common/icon-vat.svg" class="menu-icon" />
                VAT服务
              </template>
              <MenuItem name="/myVantService">VAT税号</MenuItem>
              <MenuItem name="/filingManagement">
                VAT申报
                <span class="huibiao" v-if="declareNum > 0">
                  {{ declareNum }}
                </span>
              </MenuItem>
              <MenuItem name="/annalsDeList">年报管理</MenuItem>
              <MenuItem name="/varletters">
                VAT信件
                <span class="huibiao" v-if="$store.state.login.xinjianCount > 0">
                  {{ $store.state.login.xinjianCount }}
                </span>
              </MenuItem>
              <MenuItem name="/computedTax">一键算税</MenuItem>
              <MenuItem name="/addedServices">增值服务申请</MenuItem>
            </Submenu>
            <Submenu name="/EPRList">
              <template slot="title">
                <img
                  v-if="activeOpenMenu === '/EPRList'"
                  src="@/assets/images/common/icon-erp-cur.svg"
                  class="menu-icon"
                />
                <img v-else src="@/assets/images/common/icon-erp.svg" class="menu-icon" />
                EPR服务
              </template>
              <MenuItem name="/complianceBusiness/EPRList">EPR注册</MenuItem>

              <MenuItem name="/complianceBusiness/addCategoryBrandList">EPR加类加品牌</MenuItem>
              <MenuItem name="/complianceBusiness/preDeclareList">EPR预申报</MenuItem>
              <MenuItem name="/complianceBusiness/EPRDeclareList">EPR申报</MenuItem>
              <MenuItem name="/complianceBusiness/EPRRenewalList">EPR续费</MenuItem>
            </Submenu>
            <Submenu name="/manageList">
              <template slot="title">
                <img
                  v-if="activeOpenMenu === '/manageList'"
                  src="@/assets/images/common/icon-hg-cur.svg"
                  class="menu-icon"
                />
                <img v-else src="@/assets/images/common/icon-hg.svg" class="menu-icon" />
                合规服务
              </template>
              <MenuItem name="/complianceBusiness/manageList">欧代/英代/美代</MenuItem>
              <MenuItem name="/complianceBusiness/filingList">合规备案</MenuItem>
            </Submenu>
            <Submenu name="/storeList">
              <template slot="title">
                <img
                  v-if="activeOpenMenu === '/storeList'"
                  src="@/assets/images/common/icon-dp-cur.svg"
                  class="menu-icon"
                />
                <img v-else src="@/assets/images/common/icon-dp.svg" class="menu-icon" />
                店铺管理
              </template>
              <MenuItem name="/storeManage/storeList">店铺列表</MenuItem>
              <MenuItem name="/storeManage/salesReport">销售报告管理</MenuItem>
            </Submenu>
          </template>
          <Submenu name="/userCenter">
            <template slot="title">
              <img
                v-if="activeOpenMenu == '/userCenter'"
                src="@/assets/images/common/icon-user-cur.svg"
                class="menu-icon"
              />
              <img v-else src="@/assets/images/common/icon-user.svg" class="menu-icon" />
              个人中心
            </template>
            <MenuItem name="/orderList">我的订单</MenuItem>
            <MenuItem name="/user">我的信息</MenuItem>
            <MenuItem name="/coupon">优惠券</MenuItem>
            <MenuItem name="/otherService">其他服务</MenuItem>
            <MenuItem name="/integralMal">我的积分</MenuItem>
          </Submenu>
        </Menu>

        <div class="side_menu_collapsible_button" :class="{ side_menu_collapsible_button_active: isCollapsed }">
          <Tooltip placement="right" content="展开/收起">
            <img src="@/assets/images/common/outdent_left.svg" v-if="!isCollapsed" @click="handleToggleSidebar" />
            <img src="@/assets/images/common/outdent_right.svg" v-if="isCollapsed" @click="handleToggleSidebar" />
          </Tooltip>
        </div>

        <!-- 收缩之后的菜单样式 -->
        <ShrinkBar
          :activeName="activeName"
          :activeOpenMenu="activeOpenMenu"
          :declareNum="declareNum"
          @handClick="handClick"
          v-if="isCollapsed"
        />
      </Sider>
    </div>

    <!-- 弹框 -->
    <Modal
      v-model="inviteBox"
      title="Common Modal dialog box title"
      :width="635"
      class-name="activity-rule"
      :styles="{ top: '50px' }"
    >
      <p class="sub-title" slot="header">英德VAT申报免费送</p>
      <div class="rule-box">
        <div class="rules clearfix">
          <p>活动规则：</p>
          <p>1、活动产品：英国、德国VAT转代理+申报；</p>
          <p>2、体验时长：3个月时间，任意多次申报；</p>
          <p>3、百万补贴：已有英国、德国VAT税号卖家均可参与；</p>
          <p>4、自由选择：体验时间结束，卖家可自由选择续费申报；</p>
        </div>
        <img class="follow" src="@/assets/images/survey/fllow.png" alt="" />
        <div class="choice-country">
          <p class="title">税局官方认证软件平台</p>
          <p class="sub-title">请选择需要免费体验报税的国家（可多选）</p>
          <div class="country-list clearfix">
            <div class="fl" @click="GBchecked = !GBchecked">
              <img src="@/assets/images/survey/unCheck.png" alt="" v-show="!GBchecked" />
              <img src="@/assets/images/survey/checkedIcon.png" alt="" v-show="GBchecked" />
              <img src="@/assets/images/survey/GB.png" alt="" />
              <span class="country">英国</span>
            </div>
            <div class="fl" @click="DEchecked = !DEchecked">
              <img src="@/assets/images/survey/unCheck.png" alt="" v-show="!DEchecked" />
              <img src="@/assets/images/survey/checkedIcon.png" alt="" v-show="DEchecked" />
              <img src="@/assets/images/survey/DE.png" alt="" />
              <span class="country">德国</span>
            </div>
          </div>
        </div>
        <div class="sure-btn" slot="footer">
          <Button @click="sureExperience" type="primary" size="large">免费领取</Button>
        </div>
      </div>
      <div class="sure-btn" slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import '@/styles/common.less';
import { freeDeclare, declareManagerCount } from '@/api/taxModule';
import { letterList, letterCount } from '@/api/user/letters';
import ShrinkBar from './ShrinkBar.vue';
export default {
  components: {
    ShrinkBar,
  },
  props: {},
  data() {
    return {
      // 菜单
      activeOpenMenu: '/work', // 当前打开的菜单名称，默认是首页
      defaultOpenMenu: ['/work', '/taxation', '/serviceList', '/compliance', '/storeManage', '/userCenter'], // 默认打开的菜单

      // VAT申报的数量显示
      declareNum: 0,

      // 英德VAT申报免费送
      GBchecked: false,
      DEchecked: false,
      inviteBox: false,

      // 未知变量名，待补充
      letterListTotal: 0,
    };
  },
  watch: {
    $route: function(newRouter) {
      console.log(newRouter);
      if (['/registrationInformation'].includes(newRouter.path)) {
        this.$store.dispatch('app/closeSidebar');
      } else {
        this.$store.dispatch('app/openSidebar');
      }
    },
  },
  computed: {
    ...mapGetters(['sidebar', 'token']),

    // 当前点击的菜单名称，刷新页面后会也会默认对应的菜单选中
    activeName() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.activePath) {
        return meta.activePath;
      }
      return path;
    },
    // 菜单收缩标识
    isCollapsed: {
      get() {
        return this.$store.getters.sidebar.opened;
      },
      set() {},
    },
    // 未知的变量，待补充
    carNum() {
      return this.$store.state.breadcrumb.carNum;
    },
  },
  created() {
    // 当前打开的菜单，默认从缓存中取
    if (localStorage.getItem('activeOpenMenu')) {
      this.activeOpenMenu = localStorage.getItem('activeOpenMenu');
    }
    // 查询
    if (this.token) {
      // this.$store.dispatch("changxinjianCount");
      // this.getDeclareManagerCount();
      this.getLetterList();
    }
  },
  methods: {
    /**
     * 切换左侧菜单的显示隐藏
     */
    handleToggleSidebar() {
      if (this.isCollapsed) {
        this.$store.dispatch('app/openSidebar');
      } else {
        this.$store.dispatch('app/closeSidebar');
      }
      this.$refs.siderRef.toggleCollapse();
    },
    /**
     * 菜单点击，路由跳转
     */
    handleChangeMenu(name) {
      console.log(name, name === '/work');
      // 对一些菜单进行拦截，设置打开的菜单名称
      if (name === '/work' || name === '/serviceList' || name === '/renewal') {
        this.activeOpenMenu = '/';
      }

      // 是vat服务的菜单
      if (
        name === '/filingManagement' ||
        name === '/annalsDeList' ||
        name === '/varletters' ||
        name === '/computedTax' ||
        name === '/addedServices'
      ) {
        this.activeOpenMenu = '/taxation';
      }
      // 是ERP服务的菜单
      if (
        name === '/complianceBusiness/addCategoryBrandList' ||
        name === '/complianceBusiness/EPRList' ||
        name === '/complianceBusiness/EPRDeclareList'
      ) {
        this.activeOpenMenu = '/EPRList';
      }
      // 是合规服务的菜单
      if (name === '/complianceBusiness/manageList' || name === '/complianceBusiness/filingList') {
        this.activeOpenMenu = '/manageList';
      }
      // 是合规服务的菜单
      if (name === '/storeManage/storeList' || name === '/storeManage/salesReport') {
        this.activeOpenMenu = '/storeList';
      }
      // 是个人中心的菜单
      if (
        name === '/orderList' ||
        name === '/user' ||
        name === '/coupon' ||
        name === '/otherService' ||
        name === '/integralMal'
      ) {
        this.activeOpenMenu = '/userCenter';
      }
      // 判断一些编辑未保存的页面如果离开，则会有操作提示
      let status = this.$route.query.status;
      let progressBar = this.$route.query.progressBar;
      let path = this.$route.path;
      if (
        [
          '/registerInfo',
          '/turnToAgent',
          '/complianceBusiness/register',
          '/taxRefund',
          '/hagueInformation',
          '/otherServicesDetail',
        ].includes(path) &&
        (['63', '60', '28', '32', '0', '8', '80', '39'].includes(status) || ['5'].includes(progressBar))
      ) {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '本页面如有填写资料，请先点击页面底部的保存按钮保存资料，再离开',
          okText: '我已点保存按钮',
          cancelText: '还没点保存按钮',
          onOk: () => {
            localStorage.setItem('activeOpenMenu', this.activeOpenMenu);
            this.$router.push({ path: name });
          },
        });
        return;
      }
      // 缓存点击的菜单，以及路由跳转
      localStorage.setItem('activeOpenMenu', this.activeOpenMenu);
      this.$router.push({
        path: name,
      });
    },

    /**
     * 收缩的菜单点击
     */
    handleCollapseMenuClick(path, activeOpenMenu) {
      this.activeName = path;
      this.activeOpenMenu = activeOpenMenu;
      localStorage.setItem('activeOpenMenu', this.activeOpenMenu);
    },
    handClick(data) {
      this.activeOpenMenu = data.activeOpenMenu;
      localStorage.setItem('activeOpenMenu', this.activeOpenMenu);
    },

    /**
     * 获得VAT申报的数量
     */
    getDeclareManagerCount() {
      declareManagerCount({ id: 1 }).then((res) => {
        if (res.code == 0) {
          this.declareNum = res.data;
          this.$store.commit('saveDeclareNumbuer', this.declareNum);
        }
      });
    },

    /**
     * 英德VAT申报免费送提交表单
     */
    sureExperience() {
      let data = {};
      if (this.GBchecked) data.countryCodeByGB = 'GB';
      if (this.DEchecked) data.countryCodeByDE = 'DE';
      if (JSON.stringify(data) === '{}') {
        this.$Message.error('请选择国家');
        return;
      }
      freeDeclare(data).then((res) => {
        if (res.code == 0) {
          this.$Message.success('领取成功,请在工作台的税务管理页面查看');
          this.$parent.$children[2].$children[0].getTaxManageList();
          this.inviteBox = false;
        }
      });
    },

    /**
     * 查询xx列表
     */
    getLetterList() {
      letterList({
        limit: 10,
        page: 1,
      })
        .then((res) => {
          if (res.code == 0) {
            this.letterListTotal = Number(res.data.total);
          }
        })
        .catch((err) => console.log(err));
    },
  },

  destroyed() {},
};
</script>
<style lang="less" scoped>
@import './siderbar.less';
</style>
