<template>
  <div class="layout" :class="{ layoutLogin: !headerShow }">
    <Layout>
      <Header v-if="headerShow">
        <div class="loginHead haveLoggedIn">
          <div class="loginImg clearfix">
            <div class="layout-logo">
              <img src="@/assets/images/login/logo.svg" @click="toHomePage" alt />
              <a
                @click="toHomePage"
                v-sensors="{
                  type: 'ClickNavigationBar',
                  event: 'click',
                  getParams: () => {
                    return { navigation_bar_name: '首页' };
                  },
                }"
                >首页</a
              >
              <a
                @click="goSearch"
                v-sensors="{
                  type: 'ClickNavigationBar',
                  event: 'click',
                  getParams: () => {
                    return { navigation_bar_name: '商标查询' };
                  },
                }"
                >商标查询</a
              >
              <a @mouseover="isHoverProduct = true" @mouseout="isHoverProduct = false" :class="isHoverProduct ? 'active' : isInfoDetail ? 'active' : ''" class="go-bread" @click="$router.push({ path: '/productDetail' })"
                >商标服务
                <img src="@/assets/images/header/hot.svg" alt="" class="hot"/>
                <img src="@/assets/images/header/gray-close.svg" alt="" v-show="!isHoverProduct"/>
                <img
                  src="@/assets/images/header/blue-open.svg"
                  alt=""
                  v-show="isHoverProduct"
                  v-sensors="{
                    type: 'ClickNavigationBar',
                    event: 'click',
                    getParams: () => {
                      return { navigation_bar_name: '商标服务' };
                    },
                  }"
              /></a>
              <a @mouseover="isHoverPatent = true" @mouseout="isHoverPatent = false" :class="isHoverPatent ? 'active' : isInfoPatent ? 'active' : ''" class="go-bread"
                >国际外观专利
                <img src="@/assets/images/header/hot.svg" alt="" class="hot"/>
                <img src="@/assets/images/header/gray-close.svg" alt="" v-show="!isHoverPatent"/>
                <img
                  src="@/assets/images/header/blue-open.svg"
                  alt=""
                  v-show="isHoverPatent"
                  v-sensors="{
                    type: 'ClickNavigationBar',
                    event: 'click',
                    getParams: () => {
                      return { navigation_bar_name: '国际外观专利' };
                    },
                  }"
              /></a>

              <!-- <a @click="goHomePage('r')">商标交易</a> -->
              <a
                @click="goHomePage('news')"
                v-sensors="{
                  type: 'ClickNavigationBar',
                  event: 'click',
                  getParams: () => {
                    return { navigation_bar_name: '知产百科' };
                  },
                }"
                >知产百科</a
              >
              <a
                @click="goHomePage('guide')"
                v-sensors="{
                  type: 'ClickNavigationBar',
                  event: 'click',
                  getParams: () => {
                    return { navigation_bar_name: '操作指引' };
                  },
                }"
                >操作指引</a
              >
              <a
                @click="goHomePage('about')"
                v-sensors="{
                  type: 'ClickNavigationBar',
                  event: 'click',
                  getParams: () => {
                    return { navigation_bar_name: '关于我们' };
                  },
                }"
                >关于我们</a
              >
            </div>
            <Menu mode="horizontal" active-name="1" v-if="iflogin">
              <div class="car" @click="goShopingCar">
                <img src="@/assets/images/common/gouwuche.svg" alt="" style="vertical-align: middle;" />
                <span>购物车</span>
                <span class="red">{{ carNum }}</span>
              </div>
              <div class="photoAva">
                <div class="nickname">
                  <Submenu name="3">
                    <template slot="title">{{ nickName }}</template>
                    <CompInfo @out="loout" :info="infos" />
                  </Submenu>
                </div>
                <Dropdown class="ava-box">
                  <img class="avaImg" v-if="isDefault" src="@/assets/images/common/defaultImg.png" alt />
                  <img class="avaImg" v-if="!isDefault" :src="photoImg" alt />
                  <DropdownMenu slot="list">
                    <DropdownItem @click.native="checkPage(2, 'myOrder')">购买记录</DropdownItem>
                    <DropdownItem @click.native="checkPage(2, 'myPatent')">我的专利</DropdownItem>
                    <DropdownItem @click.native="checkPage(2, 'myBrand')">商标注册</DropdownItem>
                    <!-- <DropdownItem @click.native="checkPage(2,'trademarkDeal')">商标交易</DropdownItem> -->
                    <DropdownItem @click.native="checkPage(2, 'coupon')">优惠券</DropdownItem>
                    <DropdownItem @click.native="checkPage(2, 'user')">个人信息</DropdownItem>
                    <!-- <DropdownItem @click.native="checkPage(2,'securitySetting')">安全设置</DropdownItem> -->
                  </DropdownMenu>
                </Dropdown>
                <div style="clear:both;"></div>
              </div>
            </Menu>
            <div v-else class="loginbtn">
              <Button type="primary" @click="goLogin">登录</Button>
            </div>
          </div>
        </div>
        <div class="auto-box">
          <div class="service-box" @mouseover="isHoverProduct = true" @mouseout="isHoverProduct = false" v-show="isHoverProduct">
            <div
              v-for="(item, index) in serviceList"
              :key="index"
              class="item-boxs"
              v-sensors="{
                type: 'BrandServeView',
                event: 'click',
                getParams: () => brandServeView(item),
              }"
            >
              <a @click="handleHeadNavClick(item)">
                <img :src="item.img" />
                <img :src="item.labelImg" class="label-img" v-if="item.labelImg" />
                <p :class="item.isSell ? '' : 'underline'">
                  {{ item.country }}
                </p>
              </a>
            </div>
          </div>

          <div class="service-box" @mouseover="isHoverPatent = true" @mouseout="isHoverPatent = false" v-show="isHoverPatent">
            <div v-for="(item, index) in patentList" :key="index" class="item-boxs">
              <a @click="handleHeadNavClick(item, 'patent')">
                <img :src="item.img" />
                <img :src="item.labelImg" class="label-img" v-if="item.labelImg" />
                <p :class="item.isSell ? '' : 'underline'">
                  {{ item.country }}
                </p>
              </a>
            </div>
          </div>
        </div>
      </Header>
    </Layout>
  </div>
</template>
<script>
import Cookies from 'js-cookie';
import '@/assets/style/common.less';
// import BreadCrumb from "@/components/common/breadcrumb";
import { getProductInfoAPI } from '@/api/product/index';
import { totalShoppingCart } from '@/api/shoppingCar/shoppingCar';
import { logout } from '@/api/login/login.js';
import { getInfo1, getMembershipCardById } from '@/api/user/userModule';
import { apiUrl } from '@/config/index';
import CompInfo from '@/components/common/compInfo';
export default {
  name: 'HeaderPage',
  // props: ['isWork'],
  components: {
    CompInfo,
  },
  data() {
    return {
      dataArea: this.AREA1, // 省市数据，和客户管理系统一致
      shopCarNum: 0, // 购物车数量
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
      isHoverProduct: false,
      isHoverPatent: false,
      serviceList: [
        {
          country: '美国商标注册',
          img: require('@/assets/images/header/usFlag.svg'),
          isSell: true,
          labelImg: require('@/assets/images/header/youhui.svg'),
          // id:53
          id: 100724,
          countryNameZh: '美国',
        },
        {
          country: '美国商标注册(意向)',
          img: require('@/assets/images/header/usFlag.svg'),
          isSell: true,
          // labelImg: require('@/assets/images/header/youhui.svg'),
          // id:53
          id: 100845,
        },

        {
          country: '欧盟商标注册',
          img: require('@/assets/images/header/euFlag.svg'),
          isSell: true,

          id: 100726,
          countryNameZh: '欧盟',
        },
        {
          country: '英国商标注册',
          img: require('@/assets/images/header/gbFlag.svg'),
          isSell: true,

          id: 100730,
          countryNameZh: '英国',
        },
        {
          country: '日本商标注册',
          img: require('@/assets/images/header/jpFlag.svg'),
          isSell: true,

          id: 100728,
          countryNameZh: '日本',
        },
      ],
      patentList: [
        {
          country: '美国外观专利',
          img: require('@/assets/images/header/usFlag.svg'),
          isSell: true,
          labelImg: require('@/assets/images/header/tuijian.svg'),
          id: 101531,
          countryNameZh: '美国',
        },
        {
          country: '欧盟外观专利',
          img: require('@/assets/images/header/euFlag.svg'),
          isSell: true,
          labelImg: require('@/assets/images/header/tuijian.svg'),
          id: 101532,
          countryNameZh: '欧盟',
        },
        {
          country: '英国外观专利',
          img: require('@/assets/images/header/gbFlag.svg'),
          isSell: true,
          id: 101533,
          countryNameZh: '英国',
        },
        {
          country: '加拿大外观专利',
          img: require('@/assets/images/header/caFlag.png'),
          isSell: true,
          id: 101534,
          countryNameZh: '加拿大',
        },
        {
          country: '日本外观专利',
          img: require('@/assets/images/header/jpFlag.svg'),
          isSell: true,
          id: 101535,
          countryNameZh: '日本',
        },
        {
          country: '韩国外观专利',
          img: require('@/assets/images/header/krFlag.svg'),
          isSell: true,
          id: 101536,
          countryNameZh: '韩国',
        },
      ],
      vLength: 0,
      isInfoDetail: false,
      isInfoPatent: false,
      infos: {},
    };
  },
  methods: {
    handleHeadNavClick(item, type) {
      if (!item.isSell) {
        return;
      } else {
        this.$router.push({
          path: '/productDetail',
          query: {
            id: item.id,
            type,
          },
        });
      }
    },
    goLogin() {
      this.$router.push({ path: `/login` });
    },
    // 神策商标服务详情页浏览
    brandServeView(item) {
      return {
        product_affilation_country: item.countryNameZh,
        brand_serve_page_source: 'tab栏点击',
        brand_kind: item.country,
        brand_serve_project: '一标一类',
        brand_original_price: item.oldPrice,
        brand_current_price: item.price,
        quantity_unit: item.unit === 1 ? '类' : '次',
      };
    },
    // 展开菜单
    openMenu() {
      if (this.$store.getters.getlogin === false) {
        this.$store.dispatch('changeHead', false);
      }
    },
    // 退出
    loout() {
      logout();
      localStorage.removeItem('token');
      localStorage.removeItem('sessionId');

      Cookies.remove('token');
      Cookies.remove('sessionId');
      window.location.href = apiUrl.homePageUrl;
      this.$store.commit('saveLogin', false);
      this.$store.commit('saveLeft', false);
    },
    // 用户中心获取用户信息
    getUinfo() {
      let self = this;
      getInfo1()
        .then(
          (res) => {
            // console.log(res);
            if (res.code === 0) {
              if (!sessionStorage.getItem('suspendAdvertisement')) {
                res.data.payFlag === 1 ? sessionStorage.setItem('suspendAdvertisement', false) : sessionStorage.setItem('suspendAdvertisement', true);
                this.$parent.$children[1].showSuspendAdvertisement();
              }
              this.infos = res.data;
              localStorage.setItem('objInfo', JSON.stringify(res.data)); // save local
              // 神策关联用户
              this.$sensors.login(res.data.userMobile, () => {
                this.$sensors.quick('autoTrack');
              });
              if (res.data.nickname) {
                self.nickName = res.data.nickname;
              } else {
                self.nickName = res.data.mobile;
              }
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
    goShopingCar() {
      this.$router.push({ path: '/shoppingCart' });
    },
    checkPage(type, page) {
      this.$store.commit('saveMenuName', '/' + page);

      this.$router.push({ path: '/' + page });
    },
    listenerFunction(e) {
      if (window.location.pathname === '/') {
        document.addEventListener('scroll', this.handleScroll, true);
      }
    },
    handleScroll() {},
    // 获取购物车数量
    getShoppingCar() {
      if (this.iflogin === true) {
        totalShoppingCart().then((res) => {
          this.$store.commit('saveCarNumStatue', res.data);
        });
      }
    },
    getPath() {
      if (window.location.pathname === '/client/login' || window.location.pathname === '/client/en/login') {
        this.headerShow = false;
      } else {
        this.headerShow = true;
      }
      if (this.$route.path.indexOf('productDetail') !== -1) {
        if (this.$route.query.type === 'patent') {
          this.isInfoPatent = true;
          return;
        }
        this.isInfoDetail = true;
      } else {
        this.isInfoDetail = false;
        this.isInfoPatent = false;
      }
    },
    toHomePage() {
      let url = '';
      if (this.invitedCode != null) {
        url = this.homePageUrl + '?invitedCode=' + this.invitedCode;
      } else if (this.promteCode != null) {
        url = this.homePageUrl + '?promteCode=' + this.promteCode;
      } else {
        url = this.homePageUrl;
      }
      window.location.href = url;
    },
    goSearch() {
      let url = '';
      if (this.invitedCode != null) {
        url = this.homePageUrl + 'search?text=&invitedCode=' + this.invitedCode;
      } else if (this.promteCode != null) {
        url = this.homePageUrl + 'search?text=&promteCode=' + this.promteCode;
      } else {
        url = this.homePageUrl + 'search?text=';
      }
      window.location.href = url;
    },
    goHomePage(page) {
      let url = '';
      if (this.invitedCode != null) {
        url = this.homePageUrl + page + '?invitedCode = ' + this.invitedCode;
      } else if (this.promteCode != null) {
        url = this.homePageUrl + page + '?promteCode = ' + this.promteCode;
      } else {
        url = this.homePageUrl + page;
      }
      window.location.href = url;
    },
  },
  created() {
    let tokenl = localStorage.getItem('token');
    let sid = localStorage.getItem('sessionId');
    console.log('45311');
    if (tokenl && sid) {
      this.getUinfo();
    }
  },
  watch: {
    $route: 'getPath',
  },
  mounted() {
    this.getShoppingCar();
    this.vLength = this.$parent.$children.length;
    // getProductInfoAPI().then((res) => {
    //   if (res.code === 0 && res.data.length > 0) {
    //     res.data.forEach((product) => {
    //       this.serviceList.forEach((item) => {
    //         if (product.id === item.id) {
    //           this.$set(item, 'price', product.basePrice);
    //           this.$set(item, 'oldPrice', product.baseStandardPrice);
    //           this.$set(item, 'unit', product.unit);
    //         }
    //       });
    //     });
    //   }
    // });
  },
  computed: {
    carNum() {
      return this.$store.state.breadcrumb.carNum;
    },
    isWork() {
      return this.$store.state.login.leftShow;
    },
    iflogin() {
      return this.$store.state.login.isLogin;
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
  left: 0px;
  right: 0px;
  height: 70px;
  z-index: 999;
  .loginHead {
    height: 70px;
    width: 100%;
    .loginImg {
      // max-width: 1200px;
      height: 70px;
      margin: 0px 50px;
    }
  }
  .haveLoggedIn {
    background-color: #ffffff;
    .loginImg {
      display: flex;
      max-width: 1200px;
      margin: auto;
      .ivu-menu {
        background: #ffffff;
        display: flex;
        justify-content: flex-start;
        height: 70px;
        line-height: 70px;
      }
      .car {
        color: #fff;
        font-size: 14px;
        margin-top: 20px;
        line-height: 36px;
        cursor: pointer;
        width: 95px;
        height: 36px;
        background: #00a4ff;
        border-radius: 5px;
        text-align: center;
        span {
          display: inline-block;
          color: #ffffff;
          text-align: center;
        }
      }
      .car {
        span.red {
          line-height: 18px;
          display: inline-block;
          width: 18px;
          height: 18px;
          background-color: #ff6600;
          border-radius: 50%;
          text-align: center;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          position: absolute;
          top: 12px;
        }
      }
      .layout-logo {
        height: 100%;
        min-width: 70%;
        line-height: 70px;
        .go-bread {
          position: relative;
          .hot {
            position: absolute;
            left: 14px;
            top: 6px;
            animation: myfirst 1s infinite;
          }
          @keyframes myfirst {
            0% {
              transform: translate(0px, 0px);
            }
            50% {
              transform: translate(0px, -6px);
            }
            100% {
              transform: translate(0px, 0px);
            }
          }
        }
        .go-bread.active {
          color: #00a3ff;
          border-bottom: 2px solid #00a3ff;
        }
        img {
          vertical-align: middle;
          cursor: pointer;
        }
        a {
          color: #666;
          font-size: 16px;
          margin-left: 32px;
          height: 70px;
          display: inline-block;
        }
        a.active {
          color: #2d8cf0;
        }
      }
      .layout-logo > a:hover {
        color: #2d8cf0;
        border-bottom: 2px solid #00a3ff;
      }
      .ivu-menu {
        justify-content: flex-end;
      }
    }
  }
  .loginbtn {
    display: flex;
    width: 30%;
    align-items: center;
    justify-content: flex-end;
  }
}
.auto-box {
  width: 1200px;
  margin: auto;
}
.service-box {
  width: 628px;
  height: 84px;
  background: #ffffff;
  box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.08);
  margin-left: 22px;
  padding: 14px 24px;
  display: flex;
  justify-content: space-around;
  text-align: center;
  .item-boxs {
    position: relative;
    .label-img {
      position: absolute;
      top: -20px;
      left: 54%;
    }
  }
  a {
    p {
      line-height: 0;
      margin-top: -12px;
      font-size: 12px;
      font-family: PingFangSC;
      color: #333333;
    }
    p.underline {
      color: #999;
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
  height: 70px;
  padding: 0px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
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
  .avaImg {
    height: 42px;
    width: 42px;
    border-radius: 100%;
    margin-top: 15px;
    float: right;
    margin-right: 8px;
    /deep/ i {
      display: none;
    }
  }
  .nickname {
    float: right;
    position: relative;
    /deep/ .ivu-select-dropdown {
      padding-top: 10px !important;
      box-sizing: content-box;
      width: 350px !important;
      height: 98px !important;
      max-height: initial !important;
      background: none !important;
      box-shadow: none !important;
    }
    /deep/ .ivu-select-dropdown {
      left: initial !important;
      right: 0;
    }
  }
}
.nickname {
  .title {
    max-width: 175px;
    overflow: hidden;
    white-space: nowrap; /*不换行*/
  }
  .ivu-menu-submenu {
    max-width: 175px;
  }
  .ivu-menu-submenu:hover {
    border-bottom: none !important;
    color: rgba(102, 102, 102, 1) !important;
  }
  .ivu-menu-child-item-active {
    border-bottom: none !important;
    color: rgba(102, 102, 102, 1) !important;
  }
  /deep/.ivu-menu-submenu-title {
    max-width: 170px;
    height: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.ava-box {
  /deep/ .ivu-dropdown-item:hover {
    color: #00a3ff;
  }
  /deep/ .ivu-select-dropdown {
    margin-top: 78px;
    text-align: center;
    text-align: -webkit-center;
    position: relative;
    left: 32px;
  }
  /deep/ .ivu-select-dropdown:after {
    content: '';
    position: absolute;
    left: 59px;
    top: -12px;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #fff;
  }
  /deep/ .ivu-select-dropdown::before {
    content: '';
    position: absolute;
    left: 57px;
    top: -16px;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #e2e3e4;
  }
  /deep/ .ivu-dropdown-item {
    color: #999;
    padding: 7px 34px;
  }
}
.ivu-menu-horizontal .ivu-menu-submenu .ivu-select-dropdown .ivu-menu-drop-list .ivu-menu-item:hover {
  background-color: #fff;
}
/deep/ .ivu-dropdown-menu {
  padding: 10px 0;
}
</style>
