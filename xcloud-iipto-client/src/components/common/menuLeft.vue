<template>
  <div class="layout" ref="menuLeft">
    <div class="side_menu">
      <Sider hide-trigger :style="contentStyleObj">
        <Menu
          theme="light"
          ref="menu"
          :active-name="activeName"
          :open-names="['1', '2', '3', '4', '5']"
          @on-select="changeMenu"
        >
          <div
            @click="goWork()"
            :class="{ lefttit: true, 'lefttit-active': path == '/work' }"
            v-show="PROCESS_ENV.NODE_PLA !== 'wg'"
          >
            <img src="@/assets/images/common/workActive.svg" alt="" v-if="path == '/work'" />
            <img src="@/assets/images/common/work.svg" alt="" v-else /> 工作台
          </div>
          <div @click="goHome()" class="lefttit">
            <img src="@/assets/images/common/icon-chanpin.svg" alt="" /> 产品服务
          </div>
          <Submenu name="1" v-show="PROCESS_ENV.NODE_PLA !== 'wg'">
            <template slot="title"> <img src="@/assets/images/common/icon-shangbiao.svg" alt="" /> 商标服务 </template>
            <MenuItem name="/myBrand">商标注册</MenuItem>
          </Submenu>
          <Submenu name="2">
            <template slot="title"> <img src="@/assets/images/common/icon-zhuanli.svg" alt="" />专利服务 </template>
            <MenuItem name="/myPatent">外观专利</MenuItem>
          </Submenu>
          <Submenu name="3" v-show="PROCESS_ENV.NODE_PLA !== 'wg'">
            <template slot="title"> <img src="@/assets/images/common/icon-gongju.svg" alt="" />工具箱 </template>
            <MenuItem name="/monitor">跟卖监控管理</MenuItem>
            <!-- <MenuItem name="/trademarkName">商标核名</MenuItem> -->
            <MenuItem name="/trademarkMonitoring">商标监测</MenuItem>
            <MenuItem name="/trademarkCollect">我的收藏</MenuItem>
          </Submenu>
          <Submenu name="4">
            <template slot="title"> <img src="@/assets/images/common/icon-dingdan.svg" alt="" />订单管理 </template>
            <MenuItem name="/myOrder">我的订单</MenuItem>
            <MenuItem name="/coupon">我的优惠券</MenuItem>
            <MenuItem name="/integralMal">积分商城</MenuItem>
          </Submenu>
          <Submenu name="5">
            <template slot="title"> <img src="@/assets/images/common/icon-zhanghu.svg" alt="" />账户管理 </template>
            <MenuItem name="/user">个人信息</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
    </div>
  </div>
</template>
<script>
import '@/assets/style/common.less';
export default {
  components: {},
  props: {},
  data() {
    return {
      contentStyleObj: {
        height: '',
      },
      resNum: 0,
      tarNum: 0,
      suspendAdvertisement: false,
      GBchecked: false,
      DEchecked: false,
      activeOpen: [],
      userInfo: {},
      path: location.href.substr(-5, 5),
    };
  },
  computed: {
    activeName() {
      return this.$store.state.login.menuName;
    },
    inviteBox() {
      return this.$store.state.login.isShowActiveImg;
    },
    carNum() {
      return this.$store.state.breadcrumb.carNum;
    },
  },
  watch: {
    $route(to, from) {
      if (
        to.path === '/myOrder' ||
        to.path === '/myPatent' ||
        to.path === '/myBrand' ||
        to.path === '/trademarkDeal' ||
        to.path === '/coupon'
      ) {
        sessionStorage.setItem('leftPath', to.path);
        this.$store.commit('saveMenuName', to.path);
        this.$store.commit('activeOpen', ['1']);
        this.activeOpen = ['1'];
        sessionStorage.setItem('activeOpen', JSON.stringify(['1']));
        this.$refs.menu.updateActiveName();
      } else if (to.path === '/securitySetting') {
        sessionStorage.setItem('leftPath', to.path);
        this.$store.commit('saveMenuName', to.path);
        this.$store.commit('activeOpen', ['2']);
        this.activeOpen = ['2'];
        sessionStorage.setItem('activeOpen', JSON.stringify(['2']));
        this.$refs.menu.updateActiveName();
      } else if (to.path === '/trademarkName') {
        sessionStorage.setItem('leftPath', to.path);
        this.$store.commit('saveMenuName', to.path);
        this.$store.commit('activeOpen', ['4']);
        this.activeOpen = ['4'];
        sessionStorage.setItem('activeOpen', JSON.stringify(['4']));
        this.$refs.menu.updateActiveName();
      } else if (to.path === '/user') {
        sessionStorage.setItem('leftPath', to.path);
        this.$store.commit('saveMenuName', to.path);
        this.$store.commit('activeOpen', ['5']);
        this.activeOpen = ['5'];
        sessionStorage.setItem('activeOpen', JSON.stringify(['5']));
        this.$refs.menu.updateActiveName();
      } else {
        sessionStorage.setItem('leftPath', to.path);
        this.$store.commit('saveMenuName', to.path);
        this.$store.commit('activeOpen', ['3']);
        this.activeOpen = ['3'];
      }
      this.path = location.href.substr(-5, 5);
    },
  },
  methods: {
    // 屏幕高度
    getHeight() {
      // console.log(window.innerHeight)
      this.contentStyleObj.height = window.screen.height - 1600 + 'px';
      // console.log(this.contentStyleObj.height)
    },
    changeMenu(name) {
      let url = window.location.pathname;
      sessionStorage.setItem('leftPath', name);
      this.$store.commit('saveMenuName', name);
      // if (name == "/myBrand"||name=='/coupon'||name=='/myOrder') {
      //   this.$store.dispatch("changeStatus", true);
      // } else {
      //   this.$store.dispatch("changeStatus", false);
      // }
      let worMenukList = ['/myBrand', '/myOrder', '/trademarkDeal', '/coupon'];
      let userMenuList = ['/user', '/securitySetting'];
      let trademarkNameList = ['/trademarkName'];
      var menuType = [];
      if (worMenukList.includes(name)) {
        menuType = ['1'];
      } else if (userMenuList.includes(name)) {
        menuType = ['2'];
      } else if (trademarkNameList.includes(name)) {
        menuType = ['4'];
      } else {
        menuType = ['3'];
      }
      this.$store.commit('activeOpen', menuType);
      this.activeOpen = menuType;
      sessionStorage.setItem('activeOpen', JSON.stringify(menuType));
      let status = localStorage.getItem('orderStatus');
      // if ((url.indexOf('/infoDetail') > -1 ) && (status == 28 || status == 32 || status == 0 || status == 8)) {
      // if (url.indexOf('/infoDetail') > -1 && status != 3) {
      //   this.$Modal.confirm({
      //     title: '温馨提示',
      //     content: '本页面如有填写资料，请先点击页面底部的保存按钮保存资料，再离开',
      //     okText: '我已点保存按钮',
      //     cancelText: '还没点保存按钮',
      //     onOk: () => {
      //       this.updataMenu();
      //       this.$router.push({ path: name });
      //     },
      //   });
      //   return;
      // }
      this.updataMenu();
      this.$router.push({ path: name });
    },
    closeBtn() {
      this.suspendAdvertisement = false;
      sessionStorage.setItem('suspendAdvertisement', false);
    },
    updataMenu() {
      this.activeOpen = this.$store.state.login.menuOpen;
      this.$nextTick(() => {
        this.$refs.menu.updateActiveName();
        this.$refs.menu.updateOpened();
      });
    },
    showSuspendAdvertisement() {
      if (sessionStorage.getItem('suspendAdvertisement')) {
        this.$nextTick(() => {
          this.suspendAdvertisement = sessionStorage.getItem('suspendAdvertisement') != 'false';
        });
      }
    },
    changeState(val) {
      this.$store.commit('saveActiveStatus', val);
    },
    goHome() {
      // window.open(this.homePageUrl+'/productservice');
      // console.log(this.homePageUrl+'productservice')
      window.location.href = this.homePageUrl + 'productservice';
    },
    goWork() {
      this.$router.push({ path: '/work' });
    },
  },
  created() {
    this.getHeight();
    this.userInfo = JSON.parse(localStorage.getItem('objInfo'));
    try {
      let leftPath = window.sessionStorage.leftPath;
      if (leftPath) {
        this.$store.commit('saveMenuName', leftPath);
      }
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {
    try {
      let activeOpen = JSON.parse(window.sessionStorage.activeOpen);
      if (activeOpen) {
        this.$store.commit('activeOpen', activeOpen);
        this.activeOpen = activeOpen;
        this.updataMenu();
      }
    } catch (error) {
      let activeOpen = ['1'];
      this.$store.commit('activeOpen', activeOpen);
      this.activeOpen = activeOpen;
      this.updataMenu();
    }
  },
};
</script>
<style lang="less" scoped>
.layout {
  width: 208px;
  display: inline-block;
  margin-right: 24px;
  background-color: #fff;
  .top-info {
    margin-top: 14px;
    text-align: center;
    img {
      width: 78px;
      height: 78px;
      border-radius: 50%;
    }
    .nickname {
      color: #333333;
      margin-top: 4px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }
    .account-info {
      font-family: PingFangSC;
      color: #333333;
      margin-top: 6px;
      font-size: 12px;
    }
  }
  .side_menu {
    background-color: #fff;
    width: 208px;
    box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
    padding-bottom: 102px;
  }
  &/deep/ .ivu-layout-sider {
    min-height: 70vh;
    max-height: 1300px;
    width: 208px;
  }
  &/deep/ .ivu-layout-sider-children {
    background-color: #fff;
    .ivu-menu-item-group {
      background-color: #fff;
      color: #333333;
      .ivu-menu-item-selected span {
        color: #00a3ff;
      }
      .ivu-menu-vertical .ivu-menu-item:hover,
      .ivu-menu-vertical .ivu-menu-submenu-title:hover {
        color: #00a3ff;
      }
    }
  }
}
.ivu-menu-vertical .ivu-menu-item:hover,
.ivu-menu-vertical .ivu-menu-submenu-title:hover {
  color: #00a3ff;
}
.redNum {
  color: #ff6600;
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  // box-shadow: 0px 8px 38px 0px #019DFA;
  color: #ffffff;
  border: none;
  font-weight: bold;
  background: #00a3ff;
  width: 208px;
  border-radius: 0;
  .redNum {
    color: #ffffff;
  }
}
.ivu-menu-vertical.ivu-menu-light:after {
  width: 0px;
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after {
  width: 0;
}

&/deep/.ivu-menu-item {
  // height: 42px;
  width: 192px;
  border-radius: 4px;
  // margin-left: 4px;
  line-height: 15px;
  font-size: 14px;
  padding: 11px 24px;
  img {
    margin-right: 20px;
    float: left;
    margin-top: -5px;
  }
  .ivu-badge {
    text-indent: 0px;
  }
}
&/deep/.ivu-menu-submenu-title {
  font-size: 16px;
  font-weight: 400;
  color: #333;
  padding-left: 16px;
  img {
    margin-right: 10px;
    float: left;
  }
}

&/deep/.ivu-menu-vertical .ivu-menu-item-group-title {
  height: 0px;
}

&/deep/.ivu-menu-vertical .ivu-menu-submenu-title:hover {
  color: #00a3ff;
}

&/deep/.ivu-menu.ivu-menu-light.ivu-menu-vertical {
  margin-top: 10px;
}

/deep/ .ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item {
  padding-left: 49px !important;
  color: #666666;
}
/deep/ .ivu-menu-vertical .ivu-menu-submenu-title-icon {
  right: 0px;
  color: #666666;
}
/deep/ .ivu-layout-sider {
  background: #fff;
}
/deep/ .ivu-menu-vertical .ivu-menu-item,
.ivu-menu-vertical .ivu-menu-submenu-title {
  padding: 14px 18px;
}
/deep/ .ivu-menu {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #666666;
}

.lefttit {
  font-size: 16px;
  font-weight: 400;
  color: #333;
  padding: 14px 16px;
  cursor: pointer;
  height: 50px;
  img {
    vertical-align: middle;
    margin-right: 5px;
    margin-bottom: 3px;
  }
}
.lefttit:hover {
  color: #00a3ff;
}
.lefttit-active {
  background-color: #00a3ff;
  color: #fff;
  margin-right: -8px;
}
.lefttit-active:hover {
  color: #fff;
}
.img-active {
  transform: translateX(-move);
  filter: drop-shadow(color, move, 0);
}
</style>
