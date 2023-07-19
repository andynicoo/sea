<template>
  <div
    class="layout"
    :class="{ layoutLogin: !headerShow }"
    :style="showSidebar ? { left: isCollapsed ? '64px' : '256px' } : { left: 0 }"
  >
    <Layout>
      <Header>
        <div v-if="onlyShowNavbar" class="loginHead notLoggedIn whiteBg">
          <div class="loginImg clearfix">
            <img src="@/assets/images/login/LOGO.svg" alt="" style="display: inline-block" />
            <Menu mode="horizontal" active-name="1" class="clearfix">
              <div class="layout-nav">
                <Badge>
                  <span @click="goHome" style="cursor: pointer">{{ $t('navbar.home') }}</span>
                  <div class="bottom-line"></div>
                </Badge>
              </div>
              <div class="fr login-right-box" v-if="iflogin">
                <!-- <Button  @click="changeLang" class="transBtn">{{isActive?'English':'中文'}}</Button> -->
                <Button @click="chagePage('work')" class="workBtn">报税工作台</Button>
                <div class="photoAva">
                  <div class="nickname">
                    <Submenu name="3">
                      <template slot="title">{{ nickName }}</template>
                      <CompInfo @out="loout" />
                    </Submenu>
                  </div>
                  <img class="avaImg" v-if="isDefault" src="@/assets/images/common/defaultImg.png" alt />
                  <img class="avaImg" v-if="!isDefault" :src="photoImg" alt />

                  <div style="clear: both"></div>
                </div>
              </div>
              <div class="fr nologin-right-box loginBtn flex" v-if="!iflogin">
                <div class="flex">
                  <img style="margin-right: 5px" src="https://pre-www.itaxs.com/images/header/intel.svg" alt="" />
                  <div style="cursor: pointer" @click="changeLang">
                    {{ isActive ? 'intl-English' : 'intl-Chinese' }}
                  </div>
                </div>
                <div class="loginBox">
                  <span @click="toLogin()" class="log">{{ $t('login.login') }}</span>
                  <span @click="toLogin(3)" class="reg">{{ $t('login.register') }}</span>
                </div>
              </div>
            </Menu>
          </div>
        </div>
        <div v-else class="loginHead haveLoggedIn">
          <div class="loginImg clearfix">
            <div class="side_menu_collapsible_button" :class="{ side_menu_collapsible_button_active: isCollapsed }">
              <img src="@/assets/images/common/outdent_left.svg" v-if="!isCollapsed" @click="swithSide(false)" />
              <img src="@/assets/images/common/outdent_right.svg" v-if="isCollapsed" @click="swithSide(true)" />
            </div>
            <Menu mode="horizontal" active-name="1">
              <div class="layout-nav">
                <!-- 积分商城 -->
                <span class="message" @click="$router.push('/integralMal')" v-if="envpla === 'ksy'">
                  <img
                    style="margin: 0 10px 2px 0; vertical-align: middle"
                    src="@/assets/images/common/nav-jf-cur.svg"
                    alt=""
                  />
                  积分商城
                </span>
                <!-- 绑定店铺 -->
                <span class="message" @click="bindStore" v-if="envpla === 'ksy'">
                  <img class="navimg" src="@/assets/images/common/nav-dp-cur.svg" alt="" />
                  绑定店铺
                </span>
                <!-- 消息 -->
                <span class="message" @click="goStationLetter">
                  <img
                    src="@/assets/images/common/nav-xx-cur.svg"
                    alt=""
                    :style="{
                      left: letterList > 0 ? '9px' : '2px',
                      top: '3px',
                    }"
                  />
                  <span class="huibiao" v-if="letterList > 0">{{ letterList > 99 ? '99+' : letterList }}</span>
                  消息
                </span>
                <!-- 购物车 -->
                <span class="car" @click="goShopingCar">
                  <img
                    src="@/assets/images/common/nav-car-cur.svg"
                    alt=""
                    :style="{
                      width: '20px',
                      verticalAlign: 'sub',
                      left: carNum > 0 ? '' : '2px',
                    }"
                  />
                  <span class="huibiao" v-if="carNum > 0">{{ carNum > 99 ? '99+' : carNum }}</span>
                  购物车
                </span>
                <div class="photoAva">
                  <div class="nickname">
                    <a-popover v-model="userCardVisible" :title="null" trigger="hover" overlayClassName="usercard">
                      <div slot="content">
                        <UserPop @out="loout" :infos="infos" />
                      </div>
                      {{ nickName }}
                    </a-popover>

                    <!-- <Submenu name="3">
                      <template slot="title">{{ nickName }}</template>
                      <CompInfo @out="loout" :info="infos" />
                    </Submenu> -->
                  </div>
                  <!-- <span></span> -->
                  <!-- <img class="avaImg" src="@/assets/images/user/head.png" alt /> -->
                  <UserAvatar :avatar="infos.avatar" style="margin-top: 13px" />
                  <div style="clear: both"></div>
                </div>
              </div>
            </Menu>
          </div>
        </div>
      </Header>
    </Layout>
    <computed v-if="showComputed" @changeState="closeComputed"></computed>
    <!-- 公告弹窗 -->
    <Modal
      v-model="showNotice"
      min-width="650"
      @on-cancel="
        showNotice = false;
        content = '';
        file = '';
      "
    >
      <p slot="header" class="modalHeader">
        <span class="headerLine"></span>
        <span>公告详情</span>
      </p>
      <div
        class="content"
        style="padding-bottom: 15px; word-wrap: break-word; max-height: 600px; min-height: 200px; overflow: auto"
      >
        <div v-html="content"></div>
        <a class="link" v-if="file" :href="file" target="_blank">
          <Icon type="ios-link" />
          {{ fileNames }}
        </a>
      </div>
    </Modal>

    <!-- 主动公告弹窗 -->
    <Modal v-model="selfShowNotice" min-width="650" :closable="false" :mask-closable="false">
      <p slot="header" class="modalHeader">
        <span class="headerLine"></span>
        <span>英国VAT注册资料更新通知</span>
      </p>
      <div
        class="content"
        style="padding-bottom: 15px; word-wrap: break-word; max-height: 600px; min-height: 200px; overflow: auto"
      >
        <!-- <div v-html="content"></div> -->
        <div>英国VAT注册的客户请注意：</div>
        <div style="text-indent: 2em; margin-bottom: 20px">
          请务必点击下载英国VAT注册页面最新的示例图和模板，并按图示标准上传符合要求的文件资料，以便快速下号。如未按图示标准提交，注册时效将相应延长。如有疑问，可联系官网在线客服获取帮助。
        </div>
        <a class="link" href="https://file.itaxs.com/pro/20220414/1f10dcd093d34a779a6efb9399b9ffc1.pdf" target="_blank">
          <Icon type="ios-link" />
          点击查看详情
        </a>
      </div>
      <div slot="footer" style="margin-top: 30px">
        <Checkbox v-model="checked">以后不再显示</Checkbox>
        <Button type="info" :disabled="!!countDownTime" @click="closeSelfShowNotice">
          <span v-if="countDownTime > 0">{{ countDownTime }}s后</span>关闭
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import '@/styles/common.less';
import { totalShoppingCart } from '@/api/shoppingCar/shoppingCar';
import { renewalStatus } from '@/api/renewal/index.js';
import { getInfo, logout } from '@/api/login/login';
import { getCarNum } from '@/api/user/myCar';
import { updateInfo, getInfo1, getMembershipCardById } from '@/api/user/userModule';
import { stationLetterCount } from '@/api/stationLetter/stationLetter';
import Bus from '@/api/Bus';
import computed from '@/views/common/computed';
import { mapGetters } from 'vuex';
// import { apiUrl } from "@/config/index";
import { whiteList, onlyNavbarList } from '@/permission';
import { stationLetterList, stationLetterDetail } from '@/api/stationLetter/stationLetter.js';
import { selectGbRegWordOrderToUpload } from '@/api/home/home.js';
import { Base64 } from 'js-base64';
import Cookie from 'js-cookie';
import CompInfo from './compInfo';
import UserAvatar from '@/components/Common/UserAvatar';
import UserPop from '@/components/Common/UserPop';
import { unMessage } from '@/api/home/home';

export default {
  components: {
    computed,
    CompInfo,
    UserAvatar,
    UserPop,
  },
  data() {
    return {
      // 图片公告
      showNoticeImg: false,
      showNotice: false, //公告
      ccc: '',
      ddd: '',
      loadEdit: false,
      modalAdress: false,
      renewalStatus: false, // 续费管理优惠中
      dataArea: this.AREA1, // 省市数据，和客户管理系统一致
      shopCarNum: 0, // 购物车数量
      modal8: false, // 联系
      breadlist: [], // 路由集合
      photoImg: '', // 头像
      nickName: '', // 昵称
      isDefault: true, // 默认头像
      isbigH: '0',
      nowPath: this.$route.path,
      province: '',
      city: '',
      showComputed: false,
      isActive: true,
      headerShow: true,
      letterList: 0,
      homePageUrl: process.env.VUE_APP_HOME_URL,
      searchForm: {
        title: '',
        type: 2,
      },
      pageInfo: {
        limit: 10,
        page: 1,
      },
      content: '',
      file: '',
      fileNames: '',
      countdownText: '关闭',
      selfShowNotice: false,
      countDownTime: 5,
      checked: false,
      neverShowNotice: Cookie.get('neverShowNotice'),
      hasShowNotice: Cookie.get('hasShowNotice'),
      infos: {}, // 用户信息
      userCardVisible: false,
    };
  },
  created() {
    let tokenl = localStorage.getItem('token');
    let sid = localStorage.getItem('sessionId');
    if (tokenl && sid) {
      this.getUinfo();
    }
    let lang = 'zh';
    let url = window.location.href.replace(/\/client/g, '');
    if (url.indexOf('en') != -1 && url.indexOf('seven') == -1) {
      lang = 'en';
      this.$i18n.locale = 'en';
    }
    localStorage.setItem('lang', lang);
    this.toActive(lang);
  },
  watch: {},
  computed: {
    carNum() {
      return this.$store.state.breadcrumb.carNum;
    },
    iflogin() {
      return this.$store.getters.token ? true : false;
    },
    /**
     * 是否显示navbar，白名单中的路由默认不显示。
     * 但是如果同时配置了onlyNavbarList，则对应的路由会显示navbar
     */
    onlyShowNavbar() {
      let path = this.$route.path;
      path = path.replace(/\/$/g, '');
      if (whiteList.includes(path)) {
        return onlyNavbarList.includes(path);
      } else {
        return false;
      }
    },
    // 菜单收缩标识
    isCollapsed: {
      get() {
        return this.$store.getters.sidebar.opened;
      },
      set() {},
    },
    /**
     * 是否显示sidebar，白名单中的路由不显示
     */
    showSidebar() {
      let path = this.$route.path;
      path = path.replace(/\/$/g, '');
      return !whiteList.includes(path);
    },
  },
  mounted() {
    // 登录后在调用
    if (this.$store.getters.token) {
      this.getShoppingCar();
      this.getStationLetter();
      // this.queryRenewalStatus();//暂时没出接口
      this.ifShowNotice();
    }
  },
  methods: {
    swithSide(val) {
      if (val) {
        this.$store.dispatch('app/openSidebar');
      } else {
        this.$store.dispatch('app/closeSidebar');
      }
    },
    async ifShowNotice() {
      let show = await this.isShowNotice();
      if (show && this.isInTime() && !this.neverShowNotice && !this.hasShowNotice) {
        this.selfShowNoticeModal();
      }
    },
    // 是否属于展示公告弹框的用户
    isShowNotice() {
      return new Promise((resolve) => {
        selectGbRegWordOrderToUpload().then((res) => {
          resolve(res.data);
        });
      });
    },
    // 是否在时间范围内
    isInTime() {
      let startTime = +new Date('2022-04-14 00:00:00');
      let endTime = +new Date('2022-05-15 23:59:59');
      let d = +new Date();
      console.log(d >= startTime && d <= endTime);
      return d >= startTime && d <= endTime;
    },
    /**
     * 倒计时
     */
    countDown() {
      this.countDownTime = 5;
      console.log(this.countDownTime);
      this.clearTimer();
      this.timer = setInterval(() => {
        this.countDownTime -= 1;
        if (this.countDownTime <= 0) {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    /**
     * 清除计时器
     */
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    selfShowNoticeModal() {
      this.setExpireTime();
      this.countDown();
      this.selfShowNotice = true;
    },
    setExpireTime() {
      let d = new Date();
      d.setHours(23);
      d.setMinutes(59);
      d.setSeconds(59);
      let expires = 'expires=' + d.toUTCString();
      document.cookie = 'hasShowNotice=true;' + expires;
    },
    closeSelfShowNotice() {
      this.selfShowNotice = false;
      if (this.checked) {
        Cookie.set('neverShowNotice', true);
      }
    },
    // 展开菜单
    openMenu() {
      if (this.$store.getters.getlogin == false) {
        this.$store.dispatch('changeHead', false);
        // console.log(this.$store.getters.gethead)
      } else {
      }
    },
    // 退出
    loout() {
      this.$Modal.confirm({
        title: '提示',
        content: '确定退出登录吗？',
        onOk: () => {
          localStorage.removeItem('token');
          localStorage.removeItem('sessionId');
          localStorage.removeItem('sidebarStatus');

          Cookie.remove('token');
          Cookie.remove('sessionId');
          this.$store.commit('saveLogin', false);
          this.$store.commit('saveLeft', false);
          sessionStorage.removeItem('showGuideFromLogin');
          window.location.href = this.homePageUrl;
          logout()
            .then((res) => {})
            .catch(() => {
              // do cancel
            });
        },
      });
    },
    // 联系人
    contactModal() {
      this.modal8 = true;
    },
    queryRenewalStatus() {
      renewalStatus().then((res) => {
        if (res.code == 0) {
          this.renewalStatus = res.data;
        }
      });
    },
    // 用户中心获取用户信息
    getUinfo() {
      let self = this;
      console.log('用户中心获取用户信息');
      getInfo1()
        .then(
          (res) => {
            // console.log(res);
            if (res.code == 0) {
              if (!sessionStorage.getItem('suspendAdvertisement')) {
                res.data.payFlag === 1
                  ? sessionStorage.setItem('suspendAdvertisement', false)
                  : sessionStorage.setItem('suspendAdvertisement', true);
                // this.$parent.$children[1] && this.$parent.$children[1].showSuspendAdvertisement();
              }
              res.data.account ? this.$store.commit('saveLogin', true) : '';

              this.infos = res.data;
              localStorage.setItem('objInfo', JSON.stringify(res.data)); // save local
              res.data.account ? this.$store.commit('saveLogin', true) : '';
              if (res.data.nickname) {
                self.nickName = res.data.nickname;
              } else {
                self.nickName = res.data.userMobile;
              }
              // 判断是否有省市地址
              // if (res.data.userInfo.province) {
              //   self.modalAdress = false;
              // } else {
              //   self.modalAdress = true;
              // }
              // 判断会员卡是否有效
              if (res.data.userDetail.vipEndTime) {
                const endTime = new Date(res.data.userDetail.vipEndTime).getTime();
                const nowTime = new Date().getTime();
                if (endTime > nowTime) {
                  getMembershipCardById(res.data.userDetail.membershipCardId).then((res) => {
                    if (res.code === 0) {
                      const detail = res.data;
                      if (detail) {
                        localStorage.setItem('vipInfo', JSON.stringify(detail));
                        localStorage.setItem('vipName', detail.membershipCardName);
                      }
                    }
                  });
                } else {
                  localStorage.setItem('vipName', '未开通会员');
                  localStorage.setItem('vipInfo', null);
                }
              } else {
                localStorage.setItem('vipName', '未开通会员');
                localStorage.setItem('vipInfo', null);
              }
            } else {
              this.$Message.error(res.message);
            }
          },
          (err) => {
            this.$Message.error(err.message);
          }
        )
        .finally(() => {});
    },
    closeComputed(val) {
      this.showComputed = val;
    },
    chagePage(type) {
      let invitedCode = localStorage.getItem('invitedCode');
      let promteCode = localStorage.getItem('promteCode');
      const thatUrl = '/';
      if (type == 'aboutComputed') {
        const { href } = this.$router.resolve({
          path: '/' + type,
        });
        window.open(href, '_blank');
      } else if (type == 'work') {
        const { href } = this.$router.resolve({
          path: '/' + type,
        });
        window.location.href = href;
      } else {
        let href = '';
        if (promteCode != null) {
          href = thatUrl + type + '?promteCode=' + promteCode;
        } else if (invitedCode != null) {
          href = thatUrl + type + '?invitedCode=' + invitedCode;
        } else {
          href = thatUrl;
        }
        window.open(href, '_blank');
      }
    },
    goHome() {
      if (this.isActive) {
        window.location.href = process.env.VUE_APP_HOME_URL;
      } else {
        window.location.href = process.env.VUE_APP_HOME_URL + '/en';
      }
    },
    notify() {
      var href = this.homePageUrl + '/helpCenter';
      window.open(href, '_blank');
    },
    goShopingCar() {
      this.$router.push({ path: '/shoppingCart' });
    },
    goStationLetter() {
      this.$router.push({ path: '/stationLetter' });
    },
    //绑定店铺
    bindStore() {
      this.$router.push({ path: '/storeManage/storeList' });
    },
    toRenewalPage() {
      this.$router.push({ path: '/renewal' });
    },
    listenerFunction(e) {
      if (window.location.pathname == '/') {
        document.addEventListener('scroll', this.handleScroll, true);
      }
    },
    handleScroll() {
      // if (window.pageYOffset > 600) {
      //   this.showBgWhite = true;
      // }
      // if (window.pageYOffset < 600) {
      //   this.showBgWhite = false;
      // }
    },
    // 获取购物车数量
    getShoppingCar() {
      if (this.iflogin == true) {
        totalShoppingCart().then((res) => {
          this.$store.commit('saveCarNumStatue', res.data);
        });
      }
    },
    changeLang(e) {
      this.isActive = !this.isActive;
      let lang = this.isActive ? 'zh' : 'en';
      this.$i18n.locale = lang;
      this.toActive(lang);
      if (this.isActive) {
        this.$router.push('/aboutComputed');
      } else {
        this.$router.push('/en/aboutComputed');
      }
    },
    toActive(lang) {
      this.isActive = lang == 'zh' ? true : false;
    },
    toLogin(params) {
      this.$router.push({ path: `/login`, query: { loginType: params } });
    },
    getStationLetter() {
      // console.log("查询消息数字");
      //   stationLetterCount()
      //     .then((res) => {
      //       if (res.code == 0) {
      //         this.tableLoading = false;
      //         this.letterList = res.data;
      //       } else {
      //         this.$Message.warning(res.message);
      //         this.tableLoading = false;
      //       }
      //     })
      //     .catch((err) => console.log(err));
      // },
      unMessage({})
        .then((res) => {
          if (res.code == 0) {
            this.letterList = Number(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  beforeDestroy() {
    document.removeEventListener('scroll', this.listenerFunction);
  },
};
</script>
<style lang="less" scoped>
.layout {
  // border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  position: fixed;
  top: 0px;
  left: 256px;
  right: 0px;
  height: 60px;
  z-index: 999;
  .loginHead {
    height: 60px;
    width: 100%;
    .loginImg {
      // max-width: 1200px;
      height: 60px;
      margin: 0px 10px;
    }
  }
  .notLoggedIn {
    background: #333644;
    .loginImg {
      display: flex;
      align-items: center;
      .ivu-menu {
        background: #333644;
        // display: flex;
      }
      .layout-logo {
        display: flex;
        align-items: center;
        height: 100%;
        cursor: pointer;
        img {
          width: 111px;
        }
      }
      .ivu-badge {
        color: #666666;
        font-size: 16px;
        float: left;
        margin-top: 0px;
        text-align: center;
        // margin-left: 40px;
        position: relative;
        min-width: 90px;
        cursor: pointer;
        .bottom-line {
          display: none;
          position: absolute;
          bottom: 3px;
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, #16ade9, #5d62d9);
          left: 50%;
          margin-left: -30px;
        }
        & span:hover + .bottom-line {
          display: block;
        }
        &:nth-child(5) {
          margin-right: -20px;
        }
      }
    }
  }
  .haveLoggedIn {
    background-color: #ffffff;
    .loginImg {
      display: flex;
      max-width: initial;
      padding: 0 10px 0 13px;
      .ivu-menu {
        min-width: 800px;
        background: #ffffff;
        display: flex;
        justify-content: flex-start;
      }
      .layout-nav {
        .huibiao {
          left: 3px;
          display: inline-block;
          background-color: #ff5050;
          color: #fff;
          font-size: 10px;
          text-align: center;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          // width: 25px;
          // margin-left: 4px;
          // height: 20px;
          padding: 0 5px;
          line-height: 16px;
          text-align: center;
          position: relative;
          bottom: 5px;
        }
        .car,
        .message {
          font-weight: 400;
          color: #606266;
          cursor: pointer;
          font-size: 14px;
          margin-right: 20px;
          padding: 10px 10px;
          img {
            width: 18px;
            position: relative;
            left: 7px;
          }
        }
        .car,
        .message {
          img {
            width: 18px;
            margin-top: 21px;
            filter: grayscale(100%);
            opacity: 0.6;
          }
        }
        .car:hover,
        .message:hover {
          color: #3a7fff;

          height: 38px;
          background: rgba(0, 0, 0, 0.03);
          border-radius: 26px 26px 26px 26px;
          opacity: 1;
          img {
            filter: none;
            opacity: 1;
          }
        }
        .guide {
          font-size: 14px;
          font-weight: 400;
          // color: rgba(153, 153, 153, 1);
          color: #333;
          line-height: 65px;
          padding-right: 35px;
        }
        .guide:hover {
          color: #2d8cf0;
          border-color: #2d8cf0;
        }
      }
      .layout-logo {
        height: 100%;
        img {
          width: 123px;
          margin-top: 11px;
        }
      }
      .ivu-menu {
        flex: 1;
        justify-content: flex-end;
      }
    }
  }
  .whiteBg {
    background: #ffffff;
    box-shadow: 0px 0px 27px 2px rgba(0, 0, 0, 0.06);
    .loginImg {
      .ivu-menu {
        background: #ffffff;
        justify-content: flex-start;
      }
      .ivu-badge {
        color: #666666;
        font-size: 16px;
        padding: 0 20px;
      }
    }
  }
}
.layoutLogin {
  display: none;
}
.layout-bread {
  width: 30%;
  float: left;
  margin-left: 54px;
}
/deep/ .ivu-layout-header {
  width: 100%;
  height: 60px;
  padding: 0px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
}
.layout-nav {
  .contact,
  .ivu-badge {
    float: right;
    position: relative;
    margin-left: 29px;
    img {
      position: absolute;
      top: 34%;
      width: 20px;
      width: 20px;
    }
    .guideImg {
      left: -21px;
      width: 18px;
      height: 18px;
      margin-top: 3px;
    }
    .cImg {
      top: 35%;
      left: -15%;
      z-index: 999;
    }
    span {
      font-size: 16px;
    }
    span:hover {
      color: #019dfa;
    }
    .ivu-tooltip {
      .ivu-btn {
        border: none;
        color: #313233;
        font-size: 14px;
        padding-right: 0;
      }
    }
  }
}
.loginBtn {
  margin-left: 20px;
  .loginBox {
    // display: flex;
    // align-items: center;
    // justify-content: flex-end;
    display: inline-block;
    .log,
    .reg {
      color: #666666;
      font-size: 14px;
      padding: 0 20px;
      cursor: pointer;
    }
    .log {
      color: #666666;
    }
    .reg {
      height: 30px;
      background: rgba(22, 173, 233, 1);
      color: #fff;
      line-height: 30px;
      display: inline-block;
      text-align: center;
      border-radius: 4px;
      font-size: 14px;
    }
  }
}
&/deep/.ivu-tooltip-inner {
  background-color: #ffff;
  color: #666666;
  height: 70px;
  width: 239px;
  font-size: 16px;
  line-height: 50px;
  background: url('../../../src/assets/images/common/kf.png') no-repeat;
  background-position: 18px center;
  background-color: #fff;
  padding-left: 45px;
  padding-top: 10px;
}
&/deep/.ivu-tooltip-popper[x-placement^='bottom'] .ivu-tooltip-arrow {
  border-bottom-color: #ffff;
}
.contact_phone {
  font-size: 18px;
  text-align: center;
  padding-bottom: 20px;
}
.line {
  border: 1px solid #ededed;
  margin-left: 16px;
}
&/deep/.ivu-menu-submenu {
  padding-right: 0 !important;
  padding-left: 10px !important;
}
.ivu-menu-horizontal.ivu-menu-light:after {
  width: 0;
}
.ivu-modal-footer {
  .footerBt1 {
    width: 90px;
    margin-top: 20px;
  }
}
.ivu-modal-body {
  .title {
    text-align: center;
    font-size: 16px;
    margin-bottom: 20px;
  }
}
.photoAva {
  float: right;
  margin-left: 28px;
  cursor: pointer;
  .avaImg {
    height: 32px;
    width: 32px;
    border-radius: 100%;
    margin-top: 15px;
    float: right;
  }
  .nickname {
    float: right;
    margin-left: 10px;
    /deep/ .ivu-select-dropdown {
      padding-top: 10px !important;
      box-sizing: content-box;
      width: 350px !important;
      height: 98px !important;
      max-height: initial !important;
      background: none !important;
      box-shadow: none !important;
    }
  }
}
.login-right-box {
  // margin-left: 750px;
  .transBtn {
    margin-right: 18px;
    border: 1px solid #16ade9;
    color: #16ade9;
  }
  .workBtn {
    background-color: #16ade9;
    color: #fff;
    border: 1px solid #16ade9;
  }
}
/deep/ .nologin-right-box {
  // width: 100%;
  // .ivu-btn {
  //   float: right;
  //   margin-top: 14px;
  // }
  // .ivu-btn:nth-child(1) {
  //   margin-left: 15px;
  // }
  // margin-left: 800px;
}
.nickname {
  .ivu-menu-submenu:hover {
    border-bottom: none !important;
    color: rgba(102, 102, 102, 1) !important;
  }
  .ivu-menu-child-item-active {
    border-bottom: none !important;
    color: rgba(102, 102, 102, 1) !important;
  }
}
.ivu-menu-horizontal .ivu-menu-submenu .ivu-select-dropdown .ivu-menu-drop-list .ivu-menu-item:hover {
  background-color: #fff;
}
//新加公告
.notice {
  p {
    margin: 10px 0;
    font-size: 16px;
  }
}
.notice-title {
  float: left;
  color: #d9001b;
  width: 400px;
  display: flex;
  align-items: center;
  &-block {
    line-height: 24px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.navimg {
  margin: 0 10px 2px 0 !important;
  vertical-align: middle;
}
</style>
<style lang="less">
.usercard {
  .ant-popover-inner-content {
    padding: 0px;
  }
  .ant-popover-arrow {
    display: none;
  }
}
</style>
