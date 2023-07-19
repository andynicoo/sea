<template>
  <div>
    <a-modal title="登录" :visible="dialogVisible" :footer="null" :confirm-loading="confirmLoading" :maskClosable="false" :keyboard="false" :closable="false" :maskStyle="maskStyle" width="650px">
      <div class="headerContent">
        <img :src="configInfo[NODE_PLA].logo" />
        <span>{{ configInfo[NODE_PLA].slogan }}</span>
      </div>
      <div class="loginContent">
        <p class="title flex-around">
          <span class="active">验证码登录</span>
        </p>
        <div class="box">
          <a-form-model ref="loginForm" :model="loginForm" :rules="loginRule">
            <a-form-model-item prop="mobile">
              <a-input type="text" disabled autocomplete="off" v-model="loginForm.mobile" placeholder="请输入您的手机号" />
            </a-form-model-item>
            <a-form-model-item prop="code">
              <a-input type="number" autocomplete="off" v-model="loginForm.code" placeholder="请输入验证码" />
              <a-button class="login-btn" @click="getVerificationCode(loginType)">{{ btLogin }} </a-button>
              <div class="slidingValidation-popover" v-if="smsValidation">
                <div class="slidingValidation-popover-content">
                  <h3><a-icon type="close" @click="smsValidation = false" />滑块验证</h3>
                  <sliding-validation scene="nc_message" ref="alidationBindPhoneModal" @validationData="getValidationData" />
                </div>
              </div>
            </a-form-model-item>
            <a-form-model-item class="login-register-btn">
              <a-button key="btn2" :loading="loading" type="primary" @click="handleSubmit('loginForm')">{{ loginBtnText }}</a-button>
            </a-form-model-item>
          </a-form-model>
        </div>
        <p class="bottomBox">
          <a :href="configInfo[NODE_PLA].userAgreementUrl" target="_blank">{{ configInfo[NODE_PLA].userAgreementName }}</a>
          <a :href="configInfo[NODE_PLA].privacyPolicyUrl" target="_blank">{{ configInfo[NODE_PLA].privacyPolicyName }}</a>
        </p>
      </div>
    </a-modal>
  </div>
</template>

<script>
const configInfo = {
  kby: {
    siteName: '跨标云',
    userAgreementUrl: 'https://ori.iipto.com/agreement.html', //用户协议
    userAgreementName: '《跨标云用户协议》',
    privacyPolicyUrl: 'https://ori.iipto.com/privacy.html', //隐私政策
    privacyPolicyName: '《跨标云隐私策略》',
    logo: require('@/assets/images/login/logo.svg'),
    slogan: '助力跨境电商卖家开启全球品牌之路',
  },
  sellerGrowth: {
    siteName: '卖家成长',
    userAgreementUrl: 'https://tm.sellergrowth.com/agreement.html', //用户协议
    userAgreementName: '《卖家成长用户协议》',
    privacyPolicyUrl: 'https://tm.sellergrowth.com/privacy.html', //隐私政策
    privacyPolicyName: '《卖家成长隐私策略》',
    logo: require('@/assets/images/login/logo.svg'),
    slogan: '助力跨境电商卖家开启全球品牌之路',
  },
};
import Cookies from 'js-cookie';
import SlidingValidation from './slidingValidation.vue';
import { handleMobileCodeLogin, getSlidingSmscode, getUserInfo } from '../api/login';
export default {
  props: {
    visible: Boolean,
    userMobile: String,
    maskStyle: Object,
  },
  components: {
    SlidingValidation,
  },
  watch: {
    userMobile(val) {
      this.loginForm.mobile = val;
    },
  },
  data() {
    return {
      configInfo,
      NODE_PLA: this.enterpriseId === '30' ? 'kby' : 'sellerGrowth',
      confirmLoading: false,
      loading: false,
      loginType: 2,
      isQRLogin: false,
      btLogin: '获取验证码',
      loginBtnText: '登录',
      validationDataObj: {},
      smsValidation: false,
      ifClick: false,
      loginForm: {
        mobile: '',
        code: '',
      },
      loginRule: {
        mobile: [
          {
            required: true,
            message: '请输入您的手机号',
            trigger: 'blur',
            type: 'string',
          },
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur',
            type: 'string',
          },
        ],
      },
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  destroyed() {
    clearInterval(this.AccountTimer);
    this.AccountTimer = null;
    clearInterval(this.clearTimer);
    this.clearTimer = null;
  },
  methods: {
    // 发送验证码
    getVerificationCode(type) {
      if (this.ifClick) return;
      if (JSON.stringify(this.loginForm) === '{}') {
        this.$message.error('请输入手机号码');
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.loginForm.mobile)) {
        this.$message.error('请填写正确的手机号码');
        return false;
      }
      this.smsValidation = !this.smsValidation;
    },
    //滑块
    getValidationData(data) {
      this.smsValidation = false;
      this.validationDataObj = data;
      if (this.validationDataObj.scene === 'nc_message') {
        let self = this;
        if (self.ifClick) return;
        self.verificationCodeCount = 120;
        let params = {
          mobile: self.loginForm.mobile,
          signSource: 2,
          useType: this.loginType,
        };
        params = { ...params, ...this.validationDataObj };
        getSlidingSmscode(params)
          .then(
            (res) => {
              if (res.code === 0) {
                self.$message.success('短信发送成功');
                self.verificationCodeTimer = setInterval(() => {
                  if (self.verificationCodeCount === 0) {
                    self.btLogin = '获取验证码';
                    clearInterval(self.verificationCodeTimer);
                    self.ifClick = false;
                  } else {
                    self.ifClick = true;
                    self.verificationCodeCount--;
                    self.btLogin = `${self.verificationCodeCount}秒后重新获取`;
                  }
                }, 1000);
              } else {
                this.$message.error(res.message);
                self.ifClick = false;
              }
            },
            (err) => {
              self.$refs.alidationModal.validationFun;
              self.ifClick = false;
            }
          )
          .finally(() => {
            self.ifClick = false;
          });
      }
    },
    // 登录
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (JSON.stringify(this.validationDataObj) === '{}') {
            this.$message.error('请先滑动验证');
            return;
          }
          this.loading = true;
          handleMobileCodeLogin({
            code: this.loginForm.code,
            mobile: this.loginForm.mobile,
          })
            .then(
              (res) => {
                this.loginSuccess(res);
              },
              (err) => {
                this.$refs.alidationModal.refresh();
                this.$message.error(err.message);
              }
            )
            .finally(() => {});
        }
      });
    },
    //登录成功
    loginSuccess(res) {
      if (res.code === 0) {
        this.loading = false;
        this.$message.success('登录成功');

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('sessionId', res.data.sessionId);
        Cookies.set('token', res.data.token, { expires: 1 });
        Cookies.set('sessionId', res.data.sessionId, { expires: 1 });

        this.$store.commit('saveLogin', true);
        this.getUserInfo();

        this.visible = false;
      } else {
        this.loading = false;
        this.$refs.alidationModal.refresh();
        this.validationDataObj = {};
        this.$message.error(res.message);
      }
    },
    // 获取用户信息
    getUserInfo() {
      getUserInfo().then((res) => {
        if (res.code === 0) {
          localStorage.setItem('userInfo', JSON.stringify(res.data));
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.headerContent {
  width: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  img {
    width: 125px;
    cursor: pointer;
    margin-left: 40px;
  }
  span {
    font-size: 16px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #000000;
    margin-left: 36px;
  }
}
.loginContent {
  margin: 50px auto;
  width: 344px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  position: relative;
  .title {
    margin-bottom: 30px;
    span {
      height: 20px;
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.4);
      line-height: 20px;
      cursor: pointer;
    }
    span.active {
      color: #333333;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        width: 32px;
        height: 4px;
        background: #3a7fff;
        border-radius: 16px;
        margin-left: -16px;
      }
    }
  }
  /deep/ .box {
    .ant-form-item {
      display: block;
      margin-right: 0px;
      .ant-input {
        border-radius: 2px;
        border: 1px solid #dcdcdc;
        height: 44px;
      }
      input.ant-input:-internal-autofill-selected {
        background-color: white !important;
        background-image: none !important;
        color: rgb(0, 0, 0) !important;
        box-shadow: inset 0 0 0 1000px white !important;
      }
      .ant-btn {
        width: 100%;
        height: 44px;
        background: #3370ff !important;
        border-color: #3370ff !important;
        border-radius: 2px;
        font-size: 16px;
      }
      .login-btn {
        width: 150px;
        height: 44px;
        border-radius: 0;
        color: #ffffff;
        position: absolute;
        right: 0px;
        top: -14px;
        font-size: 14px;
        line-height: 44px;
      }
    }
    .nc_wrapper {
      width: 100% !important;
      .btn_slide {
        height: 34px;
      }
      .nc_scale span {
        height: 34px;
      }
    }
  }
}
.bottomBox {
  color: #999999;
  text-align: center;
  line-height: 20px;
  margin-top: 50px;
  a {
    color: #999999;
  }
}
.slidingValidation-popover {
  position: relative;
  z-index: 2;
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    right: 18px;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-bottom-color: #fff;
    z-index: 3;
  }
  .slidingValidation-popover-content {
    position: absolute;
    top: 0px;
    left: 0;
    width: 100%;
    background: #fff;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    h3 {
      border-bottom: 1px solid #e8eaec;
      margin: 0 8px;
      padding: 8px;
      color: #17233d;
      font-size: 14px;
      line-height: 14px;
      .anticon-close {
        float: right;
        cursor: pointer;
      }
    }
    /deep/.ncLogin {
      margin: 20px 16px;
    }
  }
}
</style>
