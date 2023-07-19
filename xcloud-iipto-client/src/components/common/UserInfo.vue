<template>
  <p class="p-kby">
    <span v-if="!iflogin">
      <a class="ksy-ml-4" @click="handleClickLink()">登录</a>
      <button @click="handleClickLink('login?loginType=3')" type="primary" class="ksy-ml-4">注册</button>
    </span>
    <span v-if="iflogin">
      <a href="/client/shoppingCart">
        <a-button type="primary" class="usercar">
          <span class="red">{{ carNum }}</span>
          <img src="@/assets/images/common/usercar2.svg" />
          购物车
        </a-button>
      </a>

      <a-popover v-model="userMenu" :title="null" trigger="hover" placement="bottom" overlayClassName="usermenubox">
        <div class="usermenu" slot="content">
          <div>
            <div class="item">
              <img src="@/assets/images/common/user-order.svg" class="ksy-pb-1" /><a @click="checkPage('myOrder')"
                >我的订单</a
              >
            </div>
            <div class="item" v-if="PROCESS_ENV.NODE_PLA === 'kby'">
              <img src="@/assets/images/common/user-mark.svg" class="ksy-pb-1" /><a @click="checkPage('myBrand')"
                >我的商标</a
              >
            </div>
            <div class="item">
              <img src="@/assets/images/common/user-p.svg" class="ksy-pb-1" /><a @click="checkPage('myPatent')"
                >我的专利</a
              >
            </div>
            <div class="item">
              <img src="@/assets/images/common/user-coupon.svg" class="ksy-pb-1" /><a @click="checkPage('coupon')"
                >我的优惠券</a
              >
            </div>
            <div class="item">
              <img src="@/assets/images/common/user-info.svg" class="ksy-pb-1" /><a @click="checkPage('user')"
                >个人信息</a
              >
            </div>
          </div>

          <div class="out hand" @click="loginOut">
            <img src="@/assets/images/common/user-out.svg" class="ksy-pb-1 ksy-mt-1" />
            安全退出
          </div>
        </div>
        <img src="" />
        <img
          src="@/assets/images/common/user.png"
          class="ksy-mr-2 xxx"
          style="width: 34px"
          v-if="PROCESS_ENV.NODE_PLA === 'kby'"
        />
        <img
          src="@/assets/images/common/userwg.png"
          class="ksy-mr-2 xxx"
          style="width: 34px"
          v-if="PROCESS_ENV.NODE_PLA === 'wg'"
        />
        <span class="hand nickstyle nick" v-if="nickName !== ''">{{ nickName | stringSlice(5) }}</span>
        <span class="hand nickstyle acc" v-if="account !== ''">{{ account | hideNumber }}</span>
        <img src="@/assets/images/common/searchdown.svg" v-if="userMenu" class="ksy-pb-1" />
        <img src="@/assets/images/common/searchup.svg" v-else class="ksy-pb-1" />
      </a-popover>
    </span>
  </p>
</template>

<script>
import { logout } from '@/api/login/login.js';
import { getInfo1 } from '@/api/user/userModule';
import Cookies from 'js-cookie';
import { totalShoppingCart } from '@/api/shoppingCar/shoppingCar';
import { mapMutations } from 'vuex';

export default {
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
  filters: {
    hideNumber(str) {
      if (str) {
        return str.replace(str.substring(3, 7), '****');
      } else {
        return '';
      }
    },
    stringSlice(value, length) {
      value === undefined || value === null ? (value = '') : '';
      value.length > length ? (value = value.slice(0, length) + '...') : value;
      return value;
    },
  },
  data() {
    return {
      nickName: '', // 昵称
      account: '',
      userMenu: false,
    };
  },
  mounted() {
    // let tokenl = localStorage.getItem('token');
    // let sid = localStorage.getItem('sessionId');
    if (this.iflogin) {
      this.getUinfo();
      this.getShoppingCar();
    }
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    handleClickLink(link = 'login') {
      const host = `/client/${link}`;
      // window.open(host);
      location.href = host;
    },
    // 获取购物车数量
    getShoppingCar() {
      totalShoppingCart().then((res) => {
        this.$store.commit('saveCarNumStatue', res.data);
      });
    },
    // 用户中心获取用户信息
    getUinfo() {
      let self = this;
      getInfo1()
        .then(
          (res) => {
            if (res.code === 0) {
              const userInfo = res.data;
              this.setUserInfo(userInfo);
              localStorage.setItem('userInfo', JSON.stringify(userInfo));
              if (!sessionStorage.getItem('suspendAdvertisement')) {
                res.data.payFlag === 1
                  ? sessionStorage.setItem('suspendAdvertisement', false)
                  : sessionStorage.setItem('suspendAdvertisement', true);
                try {
                  this.$parent.$children[1].showSuspendAdvertisement();
                } catch (error) {
                  console.log(error);
                }
              }
              // this.infos = res.data;
              localStorage.setItem('objInfo', JSON.stringify(res.data)); // save local
              // 神策关联用户
              this.$sensors.login(res.data.userMobile, () => {
                this.$sensors.quick('autoTrack');
              });

              self.nickName = res.data.nickname;
              self.account = res.data.account;
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
    // 退出
    loginOut() {
      logout();
      localStorage.removeItem('token');
      localStorage.removeItem('sessionId');

      Cookies.remove('token');
      Cookies.remove('sessionId');
      this.$store.commit('saveLogin', false);
      this.$store.commit('saveLeft', false);

      // window.location.href = this.homePageUrl;
    },

    checkPage(page) {
      this.$store.commit('saveMenuName', '/' + page);

      this.$router.push({ path: '/' + page });
    },
  },
};
</script>

<style lang="less" scoped>
p {
  margin-bottom: 0;
}
a {
  color: rgba(0, 0, 0, 0.9);
}
button {
  width: 60px;
  height: 32px;
  line-height: 32px;
  border: 0;
  background: #3a7fff;
  border-radius: 2px 2px 2px 2px;
  text-align: center;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  &:hover {
    background: #549bff;
  }
}
.p-kby {
  a {
    color: #333333;
    &:hover {
      color: #333333 !important;
    }
  }
  button {
    background: #3370ff;
    color: rgba(255, 255, 255, 0.9);
    margin-left: 20px;
  }
}
.usercar {
  width: 94px;
  height: 32px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px 2px 2px 2px;
  opacity: 1;
  padding: 0px 10px;
  margin-right: 35px;
  position: relative;
  img {
    margin-right: 5px;
    margin-top: -3px;
  }
  .red {
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
    top: -6px;
    right: -6px;
  }
}
</style>
<style lang="less">
.usermenubox {
  border-radius: 2px;
  .ant-popover-inner-content {
    padding: 0px;
  }
  .ant-popover-arrow {
    display: none;
  }
  .ant-popover-inner {
    border-radius: 4px;
  }
}
.usermenu {
  width: 150px;
  // height: 245px;
  background: #ffffff;
  box-shadow: 0px 2px 12px 0px rgba(16, 68, 166, 0.07);
  opacity: 1;
  color: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  // padding: 16px 20px;
  padding-top: 5px;
  .item {
    height: 32px;
    line-height: 32px;
    margin-top: 6px;
    margin-bottom: 6px;
    padding-left: 20px;
    img {
      margin-right: 4px;
      margin-top: 4px;
    }
  }
  .out {
    height: 44px;
    line-height: 44px;
    background: #ffffff;
    box-shadow: 0px -1px 4px 0px rgba(16, 68, 166, 0.07);
    opacity: 1;
    padding-left: 20px;
    border-radius: 0px 0px 4px 4px;
  }
  a {
    color: rgba(0, 0, 0, 0.6);
  }
  a:hover {
    color: #1890ff;
  }
}
.nickstyle {
  font-size: 16px;
}
</style>
