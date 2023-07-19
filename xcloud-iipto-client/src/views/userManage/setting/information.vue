<template>
  <div class="userInfo mainContent" :style="contentStyleObj">
    <!-- <Card> -->
    <p class="title">
      <img src="@/assets/images/setting/settingIcon.svg" alt="" v-if="PROCESS_ENV.NODE_PLA === 'kby'" />
      <img src="@/assets/images/setting/settingIconwg.svg" alt="" v-if="PROCESS_ENV.NODE_PLA === 'wg'" />
      个人信息
    </p>
    <Tabs value="name1">
      <TabPane label="基本信息" name="name1">
        <UserInfo />
      </TabPane>
      <TabPane label="修改密码" name="name2">
        <ChangePassword />
      </TabPane>
      <!-- <TabPane label="更换手机号" name="name3">
        <ChangePhone />
      </TabPane> -->
      <Button @click="modalDestory = true" type="text" slot="extra" class="extra">
        <img :src="require('../../../assets/images/common/yellowTip.svg')" />注销账号
      </Button>
    </Tabs>
    <!-- </Card> -->
    <div class="destory-error" v-if="modalDestory">
      <div class="error">
        <Alert type="error" show-icon closable @on-close="modalDestory = false">
          预警提示！
          <span slot="desc">
            注销账户后手机号账户不可登录，同时清空帐号下所有数据，请谨慎操作！
            <p class="tips">
              <strong>请问是否确认注销帐号！</strong>
              <a @click="handleDestroyAccount">确认</a>
              <a @click="modalDestory = false">取消</a>
            </p>
          </span>
        </Alert>
      </div>
    </div>
  </div>
</template>
<script>
import UserInfo from './components/UserInfo.vue'; // 基本信息
import Password from './components/Password.vue'; // 修改密码
import VeriCode from './components/VeriCode.vue'; // 验证码修改密码
import ChangePassword from './components/changePassword.vue';
import ChangePhone from './components/ChangePhone.vue'; // 修改密码
import { destroyAccount } from '@/api/login/login';
export default {
  components: {
    UserInfo,
    Password,
    ChangePhone,
    ChangePassword,
  },
  data() {
    return {
      contentStyleObj: {
        'min-height': '',
      },
      modalDestory: false,
    };
  },
  methods: {
    getHeight() {
      this.contentStyleObj['min-height'] = window.screen.height - 300 + 'px';
    },
    // 注销账号
    handleDestroyAccount() {
      destroyAccount().then((res) => {
        if (res.code === 0) {
          localStorage.removeItem('token');
          localStorage.removeItem('sessionId');
          Cookies.remove('token');
          Cookies.remove('sessionId');
          this.$store.commit('saveLogin', false);
          this.$store.commit('saveLeft', false);
          this.$router.push('/');
        }
      });
    },
  },
  mounted() {
    this.getHeight();

    let productDeailId = localStorage.getItem('productDeailId');
    let pageParams = JSON.parse(localStorage.getItem('pageParams'));
    let searchFlag = localStorage.getItem('searchFlag');
    //返回商标搜索页
    if (searchFlag == 'trademarkquery') {
      localStorage.removeItem('searchFlag');
      window.location.href = location.origin + '/trademarkquery';
    } else if (searchFlag == 'classificationquery') {
      localStorage.removeItem('searchFlag');
      window.location.href = location.origin + '/classificationquery';
    }
    // 返回商标详情页继续购买
    if (productDeailId && productDeailId.length) {
      console.log(pageParams, 888);
      let { catStust, id, count, status618, skuId, type } = pageParams;
      if (catStust) {
        // 315活动
        this.$router.push({
          path: '/sureOrder',
          query: {
            id: id,
            from: 'buyNow',
            count: count,
            skuId: skuId,
            catStus: catStust,
            type: type,
          },
        });
      } else if ((status618 && status618 == 4) || !status618) {
        this.$router.push({
          path: '/sureOrder',
          query: {
            id: id,
            from: 'buyNow',
            count: count,
            skuId: skuId,
            type: type,
          },
        });
      }

      localStorage.removeItem('productDeailId');
      localStorage.removeItem('pageParams');
    }
  },
};
</script>
<style lang="less" scoped>
.userInfo {
  padding: 24px;
  .title {
    padding-bottom: 22px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-size: 20px;
    font-weight: 500;
  }
  .extra {
    img {
      width: 16px;
      vertical-align: middle;
      margin-right: 3px;
      position: relative;
      top: -1px;
    }
  }
  .destory-error {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(55, 55, 55, 0.6);
    .error {
      position: absolute;
      width: 600px;
      top: 30%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .tips {
      padding: 15px 30px 0 0;
      display: flex;
      strong {
        flex: 1;
      }
      a {
        color: #16ade9;
        margin-left: 15px;
      }
    }
    /deep/ .ivu-alert-with-desc .ivu-alert-icon {
      top: 30px;
    }
  }
}
</style>

<style lang="less">
.ivu-tabs-nav .ivu-tabs-tab {
  padding: 6px 11px;
  font-size: 16px;
}
</style>
