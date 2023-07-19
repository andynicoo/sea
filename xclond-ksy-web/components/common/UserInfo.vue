<template>
  <p :class="{ 'p-kby': NODE_PLA === 'kby' || NODE_PLA === 'wg', 'p-ksy': NODE_PLA === 'ksy' || NODE_PLA === 'kqy' }">
    <span v-if="!isLogin">
      <!-- <span class="login-btn ksy-ml-4" @click="handleClickLink(2)">登录</span>
      <button @click="handleClickLink(3)" type="primary" class="ksy-ml-4">注册</button> -->
      <a class="ksy-ml-4" @click="handleClickLink()">登录</a>
      <button @click="handleClickLink('login?loginType=3')" type="primary" class="ksy-ml-4">注册</button>
    </span>
    <span v-if="isLogin">
      <a href="/client/shoppingCart">
        <a-button type="primary" class="usercar">
          <span class="red">{{ carNum }}</span>
          <!-- 资讯中心保持白色图标 -->
          <!-- 跨标 跨税 顶部滑动样式不通 -->
          <template v-if="NODE_PLA === 'kby' || NODE_PLA === 'wg'">
            <img src="~/assets/images/usercar2.svg" v-if="blackKbyHead" />
            <span v-else>
              <img src="~/assets/images/usercar2.svg" v-if="bgChange" class="1" />
              <img src="~/assets/images/usercar.svg" v-else class="2" />
            </span>
          </template>
          <template v-if="NODE_PLA === 'ksy' || NODE_PLA === 'kqy'">
            <img src="~/assets/images/usercar2.svg" />
          </template>
          购物车
        </a-button>
      </a>

      <a-popover v-model="userMenu" :title="null" trigger="hover" placement="bottom" overlayClassName="usermenubox">
        <div class="usermenu" slot="content">
          <div v-if="NODE_PLA === 'kby'">
            <div class="item">
              <img src="~/assets/images/user-order.svg" class="ksy-pb-1" /><a href="/client/myOrder">我的订单</a>
            </div>
            <div class="item">
              <img src="~/assets/images/user-mark.svg" class="ksy-pb-1" /><a href="/client/myBrand">我的商标</a>
            </div>
            <div class="item">
              <img src="~/assets/images/user-p.svg" class="ksy-pb-1" /><a href="/client/myPatent">我的专利</a>
            </div>
            <div class="item">
              <img src="~/assets/images/user-coupon.svg" class="ksy-pb-1" /><a href="/client/coupon">我的优惠券</a>
            </div>
            <div class="item">
              <img src="~/assets/images/user-info.svg" class="ksy-pb-1" /><a href="/client/user">个人信息</a>
            </div>
          </div>
          <div v-if="NODE_PLA === 'wg'">
            <div class="item">
              <img src="~/assets/images/user-order.svg" class="ksy-pb-1" /><a href="/client/myOrder">我的订单</a>
            </div>
            <div class="item">
              <img src="~/assets/images/user-p.svg" class="ksy-pb-1" /><a href="/client/myPatent">我的专利</a>
            </div>
            <div class="item">
              <img src="~/assets/images/user-coupon.svg" class="ksy-pb-1" /><a href="/client/coupon">我的优惠券</a>
            </div>
            <div class="item">
              <img src="~/assets/images/user-info.svg" class="ksy-pb-1" /><a href="/client/user">个人信息</a>
            </div>
          </div>
          <div v-if="NODE_PLA === 'ksy' || NODE_PLA === 'kqy'">
            <div class="item">
              <img src="~/assets/images/user-order.svg" class="ksy-pb-1" /><a href="/client/orderlist">我的订单</a>
            </div>
            <div class="item">
              <img src="~/assets/images/user-coupon.svg" class="ksy-pb-1" /><a href="/client/coupon">我的优惠券</a>
            </div>
            <div class="item">
              <img src="~/assets/images/user-info.svg" class="ksy-pb-1" /><a href="/client/user">个人信息</a>
            </div>
          </div>
          <div class="out hand" @click="loginOut">
            <img src="~/assets/images/user-out.svg" class="ksy-pb-1 ksy-mt-1" />
            安全退出
          </div>
        </div>
        <template v-if="avatar === ''">
          <img src="~/assets/images/userwg.png" style="width: 34px" class="ksy-mr-2" v-if="NODE_PLA === 'wg'" />
          <img src="~/assets/images/user.png" style="width: 34px" class="ksy-mr-2" v-else />
        </template>
        <img :src="avatar" style="width: 34px" class="ksy-mr-2" v-else />

        <!-- 跨标 跨税 顶部滑动样式不通 -->
        <template v-if="NODE_PLA === 'kby' || NODE_PLA === 'wg'">
          <span class="hand nickstyle" :class="{ black: bgChange }" v-if="nickName">{{
            nickName | stringSlice(5)
          }}</span>
          <span class="hand nickstyle" :class="{ black: bgChange }" v-else>{{ account | hideNumber }}</span>
          <!-- 资讯页面 下拉图标一直黑色，否则变换 -->
          <template v-if="blackKbyHead">
            <img src="~/assets/images/searchdown.svg" v-if="userMenu" class="ksy-pb-1" />
            <img src="~/assets/images/searchup.svg" v-else class="ksy-pb-1" />
          </template>
          <template v-else>
            <span v-if="bgChange">
              <img src="~/assets/images/searchdown.svg" v-if="userMenu" class="ksy-pb-1" />
              <img src="~/assets/images/searchup.svg" v-else class="ksy-pb-1" />
            </span>
            <span v-else>
              <img src="~/assets/images/searchdownw.svg" v-if="userMenu" class="ksy-pb-1" />
              <img src="~/assets/images/searchupw.svg" v-else class="ksy-pb-1" />
            </span>
          </template>
        </template>

        <template v-if="NODE_PLA === 'ksy' || NODE_PLA === 'kqy'">
          <img src="~/assets/images/searchdown.png" v-if="userMenu" class="ksy-pb-1" />
          <img src="~/assets/images/searchup.png" v-else class="ksy-pb-1" />
        </template>
      </a-popover>
    </span>
  </p>
</template>

<script>
import common from "@/apis/common";
import { mapState, mapMutations } from "vuex";
import Cookies from "js-cookie";

export default {
  name: "UserInfo",
  computed: {
    ...mapState({
      isLogined: (state) => state.isLogined,
      carNum: (state) => state.carNum,
    }),
  },
  props: {
    bgChange: {
      type: Boolean,
      default: false,
    },
    blackKbyHead: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    hideNumber(str) {
      if (str) {
        return str.replace(str.substring(3, 7), "****");
      } else {
        return "";
      }
    },
    stringSlice(value, length) {
      value === undefined || value === null ? (value = "") : "";
      value.length > length ? (value = value.slice(0, length) + "...") : value;
      return value;
    },
  },
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
      isLogin: false,
      nickName: "", // 昵称
      account: "",
      avatar: "", // 用户头像
      userMenu: false,
    };
  },
  mounted() {
    const token = Cookies.get("token");
    const sid = Cookies.get("sessionId");
    if (token && sid) {
      this.inintLogin();
      this.$store.commit("setIsLogined", { isLogined: true });
    } else {
      let curPath = this.$route.path;
      if (curPath === "/feedback") {
        this.$router.push("/");
      }
    }
    this.$bus.$on("inintLoginBus", (data) => {
      this.inintLogin();
    });
  },
  methods: {
    //初始化登录
    inintLogin() {
      this.isLogin = true;
      this.getUserInfo();
      this.getCarNum();
    },
    ...mapMutations("userInfo", ["setUserInfo"]),
    handleClickLink(link = "login") {
      // 跨标云登录是本域名加/client,跨税是跳出去其他域名
      const host = `${this.$store.state.host.server_url}/${link}`;
      window.open(host, '_blank');
      // this.$bus.$emit("loginVisiable", { show: true, type: type });
    },

    async getUserInfo() {
      let { code, data } = await this.$axiosApi(common.getUserInfo.url, common.getUserInfo.methods);
      this.setUserInfo(data);
      if (code === 0) {
        this.nickName = data.nickname;
        this.account = data.account;
        this.avatar = data.avatar;

        Cookies.set("nickName", this.nickName);
        this.$store.commit("setUserData", data);
      } else {
        this.loginOut();
      }
    },

    async getCarNum() {
      let { code, data } = await this.$axiosApi(common.getCarNum.url, common.getCarNum.methods);
      if (code === 0) {
        this.$store.commit("setCarNum", { carNum: data });
      }
    },
    loginOut() {
      localStorage.removeItem("token");
      localStorage.removeItem("sessionId");

      Cookies.remove("token");
      Cookies.remove("sessionId");
      Cookies.remove("nickName");
      this.$store.commit("setUserData", {});

      location.reload();
    },
  },
};
</script>
<style lang="less" scoped>
p {
  margin-bottom: 0;
}

a {
  color: @textColor;
}

button {
  width: 60px;
  height: 32px;
  line-height: 32px;
  border: 0;
  background: @primaryColor;
  border-radius: 2px 2px 2px 2px;
  text-align: center;
  font-size: 16px;
  color: #fff;
  cursor: pointer;

  &:hover {
    background: @primaryHover;
  }
}

.p-kby {
  a {
    color: #fff;

    &:hover {
      color: #fff !important;
    }
  }

  button {
    background: rgba(255, 255, 255, 0.8);
    color: @primaryColor;
  }

  .nickstyle {
    font-size: 16px;
    color: #ffffff;
  }
}

.p-ksy {
  a {
    color: @primaryColor;

    &:hover {
      color: @primaryColor !important;
    }
  }

  button {
    background: @primaryColor;
    color: #ffffff;
  }

  .nickstyle {
    font-size: 16px;
    color: #000000;
  }
}

.blackKbyHead {
  .nickstyle {
    font-size: 16px;
    color: #000000 !important;
  }
}

.usercar {
  width: 94px;
  height: 32px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px 2px 2px 2px;
  opacity: 1;
  padding: 0px 10px;
  margin-right: 16px;
  position: relative;

  img {
    margin-right: 5px;
    margin-top: -3px;
  }

  .num {
    position: absolute;
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
    top: -7px;
    right: -8px;
  }
}

.usercarksy {
  background: @primaryClick;
}
</style>
<style lang="less">
.usermenubox {
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
  max-height: 245px;
  background: #ffffff;
  box-shadow: 0px 2px 12px 0px rgba(16, 68, 166, 0.07);
  opacity: 1;
  color: @textColor6;
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
    color: @textColor6;
  }

  a:hover {
    color: @primaryHover;
  }
}

.black {
  color: #000000 !important;
}

.login-btn {
  color: #fff;
  cursor: pointer;
}

.p-ksy {
  .login-btn {
    color: #004cff;
  }
}

.header-change,
.blackKbyHead {
  .login-btn {
    color: rgba(0, 0, 0, 0.9);

    &:hover {
      color: #004cff;
    }
  }

  .p-ksy {
    .login-btn {
      color: #004cff;
    }
  }
}
</style>
