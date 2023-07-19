<template>
  <div>
    <a-modal
      title="登录/注册"
      :visible="visible"
      :footer="null"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="false"
      :keyboard="false"
      width="650px"
    >
      <div class="headerContent">
        <img :src="configInfo[NODE_PLA].logo" />
        <span>{{ configInfo[NODE_PLA].slogan }}</span>
      </div>
      <div class="loginContent">
        <div v-if="!isQRLogin">
          <p class="title flex-around">
            <span
              v-if="loginType === 1 || loginType === 2"
              :class="{ active: loginType === 1 }"
              @click="changeType(1, 'loginForm')"
              >账号登录</span
            >
            <span
              v-if="loginType === 1 || loginType === 2"
              :class="{ active: loginType === 2 }"
              @click="changeType(2, 'loginForm')"
              >验证码登录</span
            >
            <span v-if="loginType === 3" class="active">注册账号</span>
            <span v-if="loginType === 4" class="active">修改密码</span>
          </p>
          <div class="box">
            <a-form-model ref="loginForm" :model="loginForm" :rules="loginRule">
              <a-form-model-item prop="mobile" v-if="loginType === 1">
                <a-input type="text" v-model="loginForm.mobile" placeholder="请输入您的手机号" />
              </a-form-model-item>
              <a-form-model-item prop="mobile" v-else>
                <a-input type="text" autocomplete="off" v-model="loginForm.mobile" placeholder="请输入您的手机号" />
              </a-form-model-item>
              <a-form-model-item prop="password" v-if="loginType === 1">
                <a-input type="password" v-model="loginForm.password" placeholder="请输入你的密码" />
              </a-form-model-item>
              <a-form-model-item v-if="loginType === 1">
                <SlidingValidation scene="nc_login" ref="alidationModal" @validationData="getValidationData" />
              </a-form-model-item>
              <a-form-model-item prop="code" v-if="loginType === 2 || loginType === 4 || loginType === 3">
                <a-input type="number" autocomplete="off" v-model="loginForm.code" placeholder="请输入验证码" />
                <a-button class="login-btn" @click="getVerificationCode(loginType)">{{ btLogin }} </a-button>
                <div class="slidingValidation-popover" v-if="smsValidation">
                  <div class="slidingValidation-popover-content">
                    <h3><a-icon type="close" @click="smsValidation = false" />滑块验证</h3>
                    <SlidingValidation
                      scene="nc_message"
                      ref="alidationBindPhoneModal"
                      @validationData="getValidationData"
                    />
                  </div>
                </div>
              </a-form-model-item>
              <a-form-model-item prop="password" v-if="loginType === 4 || loginType === 3">
                <a-input
                  type="password"
                  autocomplete="new-password"
                  v-model="loginForm.password"
                  placeholder="请输入你的密码"
                />
              </a-form-model-item>
              <a-radio
                class="ksy-mb-2"
                @change="agreementRadioChage"
                :value="agreementRadio"
                v-if="loginType === 4 || loginType === 3"
              >
                <span style="font-size: 12px"
                  >同意并遵守
                  <a style="color: #00a3ff" :href="configInfo[NODE_PLA].userAgreementUrl" target="_blank"
                    >《服务条款》</a
                  >
                </span>
              </a-radio>
              <a-form-model-item class="login-register-btn">
                <a-button
                  key="btn1"
                  v-if="loginBtnText == '注册'"
                  type="primary"
                  @click="handleSubmit(loginType, 'loginForm')"
                  >{{ loginBtnText }}</a-button
                >
                <a-button
                  key="btn2"
                  :loading="loading"
                  v-else-if="loginBtnText == '登录'"
                  type="primary"
                  @click="handleSubmit(loginType, 'loginForm')"
                  >{{ loginBtnText }}</a-button
                >
                <a-button key="btn3" v-else type="primary" @click="handleSubmit(loginType, 'loginForm')">{{
                  loginBtnText
                }}</a-button>
              </a-form-model-item>
              <p class="flex-between" v-if="loginType === 3 || loginType === 4">
                <span>
                  <span @click="changeType(1, 'loginForm')">去登录</span>
                </span>
              </p>
              <p class="flex-between" v-else>
                <span>
                  <span @click="changeType(3, 'loginForm')">立即注册</span>
                </span>
                <span @click="changeType(4, 'loginForm')"> 忘记密码 </span>
              </p>
            </a-form-model>
          </div>
        </div>
        <div v-if="isQRLogin" class="qr-login">
          <p class="title">微信二维码登录</p>
          <div class="QRimg">
            <a-spin v-if="isImg"></a-spin>
            <img :src="wxQRcode" alt="正在加载.." v-else />
            <div class="stale-box" v-if="isStale" @click="refreshCode">
              <P>二维码已过期</P>
              <a-button type="error">请刷新二维码</a-button>
            </div>
          </div>
          <div class="tips">请使用微信扫描二维码登录“{{ configInfo[NODE_PLA].siteName }}”</div>
          <div class="other-login">
            <span
              @click="
                isQRLogin = false;
                loginType = 1;
              "
            >
              密码登录
            </span>
            |
            <span
              @click="
                isQRLogin = false;
                loginType = 3;
              "
            >
              注册新账号
            </span>
          </div>
        </div>
        <div class="login-logo" v-if="NODE_PLA != 'wg'">
          <span v-if="!isQRLogin" @click="changeLoginType">扫码登录</span>
          <span v-if="isQRLogin" @click="isQRLogin = false">其他登录</span>
        </div>
        <p class="bottomBox">
          <a :href="configInfo[NODE_PLA].userAgreementUrl" target="_blank">{{
            configInfo[NODE_PLA].userAgreementName
          }}</a>
          <a :href="configInfo[NODE_PLA].privacyPolicyUrl" target="_blank">{{
            configInfo[NODE_PLA].privacyPolicyName
          }}</a>
        </p>
      </div>
    </a-modal>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import login from "@/apis/login";
import { configInfo } from "@/utils/index";
export default {
  data() {
    return {
      configInfo,
      NODE_PLA: process.env.NODE_PLA,
      visible: true,
      confirmLoading: false,
      agreementRadio: false,
      loading: false,
      loginType: 2,
      isQRLogin: false,
      btLogin: "获取验证码",
      loginBtnText: "登录",
      validationDataObj: {},
      smsValidation: false,
      ifClick: false,
      isImg: false,
      loginForm: {
        password: "",
        code: "",
        mobile: "",
      },
      loginRule: {
        user: [
          {
            required: true,
            message: "请输入您的账户名",
            trigger: "blur",
            type: "string",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入您的手机号",
            trigger: "blur",
            type: "string",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入你的密码",
            trigger: "blur",
            type: "string",
          },
        ],
        imgCode: [
          {
            required: true,
            message: "请输入图形验证码",
            trigger: "blur",
            type: "string",
          },
        ],
        code: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur",
            type: "string",
          },
        ],
        agreement: [
          {
            required: true,
            message: "请同意服务条款",
            trigger: "blur",
            type: "string",
          },
        ],
      },
      //二维码登入
      wxQRcode: "",
      timer: 60,
      isStale: false,
      qrStatus: 0,
      uuid: "",
    };
  },
  mounted() {
    this.$bus.$on("loginVisiable", (data) => {
      let { type } = data;
      if (type == 3) {
        this.changeType(3, "loginForm");
      } else if (type == 2) {
        this.changeType(2, "loginForm");
      } else if (type == 1) {
        this.chantgeType(1, "loginForm");
      } else {
        this.changeLoginType();
      }
    });
  },
  destroyed() {
    this.$bus.$off("loginVisiable");

    clearInterval(this.AccountTimer);
    this.AccountTimer = null;
    clearInterval(this.clearTimer);
    this.clearTimer = null;
  },
  methods: {
    handleOk() {
      this.$store.commit("setLoginPopData", { show: false });
    },
    handleCancel() {
      this.$store.commit("setLoginPopData", { show: false });
    },
    //切换登录注册类型
    changeType(type, name) {
      this.loginType = type;
      switch (type) {
        case 3:
          this.loginBtnText = "注册";
          break;
        case 4:
          this.loginBtnText = "完成";
          break;
        default:
          this.loginBtnText = "登录";
          break;
      }
      this.validationDataObj = {};
      this.loginForm = {};
    },
    // 发送验证码
    getVerificationCode(type) {
      if (this.ifClick) return;
      if (JSON.stringify(this.loginForm) === "{}") {
        this.$message.error("请输入手机号码");
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.loginForm.mobile)) {
        this.$message.error("请填写正确的手机号码");
        return false;
      }
      this.smsValidation = !this.smsValidation;
      this.loginType = type;
    },
    //滑块
    getValidationData(data) {
      this.smsValidation = false;
      this.validationDataObj = data;
      if (this.validationDataObj.scene === "nc_message" && this.loginType !== 1) {
        switch (this.loginType) {
          case 2:
            this.getGeetest(2);
            break;
          case 3:
            this.getGeetest(1);
            break;
          case 4:
            this.getGeetest(3);
            break;
          case 5:
            this.getGeetest(4); // 微信绑定
            break;
        }
      }
    },
    // 滑块通过调用
    getGeetest(type) {
      let self = this;
      if (self.ifClick) return;
      self.verificationCodeCount = 120;
      let params = {
        mobile: self.loginForm.mobile,
        signSource: 2,
        useType: type,
      };
      params = { ...params, ...this.validationDataObj };
      this.$axiosApi(login.slidingSMSLogin.url, login.slidingSMSLogin.methods, params, true)
        .then(
          (res) => {
            if (res.code === 0) {
              self.$message.success("短信发送成功");
              self.verificationCodeTimer = setInterval(() => {
                if (self.verificationCodeCount === 0) {
                  self.btLogin = "获取验证码";
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
          // eslint-disable-next-line handle-callback-err
          (err) => {
            // eslint-disable-next-line no-unused-expressions
            self.$refs.alidationModal.validationFun;
            // this.$message.error(err.message);
            self.ifClick = false;
          }
        )
        .finally(() => {
          self.ifClick = false;
        });
    },
    // 登录
    handleSubmit(type, name) {
      console.log(type, name, "type, name");
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (JSON.stringify(this.validationDataObj) === "{}") {
            this.$message.error("请先滑动验证");
            return;
          }
          switch (type) {
            case 1:
              this.passwordLogin();
              break;
            case 2:
              this.changeLogin();
              break;
            case 3:
              this.inviteReg();
              break;
            case 4:
              this.handleForget();
              break;
            case 5:
              this.QRLoginFun();
              break;
          }
        }
      });
    },
    //登录成功
    loginSuccess(res) {
      if (res.code === 0) {
        this.loading = false;
        this.$message.success("登录成功");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("sessionId", res.data.sessionId);

        Cookies.set("token", res.data.token, { expires: 1 });
        Cookies.set("sessionId", res.data.sessionId, { expires: 1 });
        this.visible = false;
        this.$store.commit("setLoginPopData", { show: false });
        this.$store.commit("setIsLogined", { isLogined: true });
        this.$nextTick(() => {
          this.$bus.$emit("inintLoginBus");
        });
      } else {
        this.loading = false;
        this.$refs.alidationModal.refresh();
        this.validationDataObj = {};
        this.$message.error(res.message);
      }
    },
    // 密码登录限注册成功后调用
    passwordLogin() {
      this.loading = true;
      let obj = {
        mobile: this.loginForm.mobile,
        password: this.loginForm.password,
      };
      obj = { ...obj, ...this.validationDataObj };
      this.$axiosApi(login.slidingPWLogin.url, login.slidingPWLogin.methods, obj, true)
        .then((res) => {
          this.loginSuccess(res);
        })
        .catch(() => {
          this.loading = false;
          this.$refs.alidationModal.refresh();
          this.validationDataObj = {};
        })
        .finally(() => {});
    },
    // 验证码登录
    changeLogin() {
      this.loading = true;
      let obj = {};
      obj = {
        code: this.loginForm.code,
        mobile: this.loginForm.mobile,
      };
      this.$axiosApi(login.loginYzm.url, login.loginYzm.methods, obj, true)
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
    },
    // 注册账号
    inviteReg() {
      if (!this.agreementRadio) {
        this.$message.error("请选择协议");
        return;
      }
      let invitedCode = localStorage.getItem("invitedCode"); // 邀请码
      let promteCode = localStorage.getItem("promteCode");
      let promteName= Cookies.get("channelQuery"); // 第三方页面跳转过来的页面，注册用户统计
      let obj = {};
      if (promteCode == null) {
        obj = {
          code: this.loginForm.code,
          enterpriseId: 1,
          mobile: this.loginForm.mobile,
          password: this.loginForm.password,
          source: 0, // pc
        };
      } else if (invitedCode == null) {
        obj = {
          promteCode: promteCode,
          code: this.loginForm.code,
          enterpriseId: 1,
          mobile: this.loginForm.mobile,
          password: this.loginForm.password,
          source: 0, // pc
        };
      }
      obj = { ...obj, ...this.validationDataObj };
      if(promteName){
        obj.promteName= promteName;
      }
      this.$axiosApi(login.inviteRegister.url, login.inviteRegister.methods, obj, true)
        .then((res) => {
          if (res.code === 0) {
            this.$message.success("注册成功");
            this.changeType(1, "loginForm");
            Cookies.remove('channelQuery')
          } else {
            this.$message.error(res.message);
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          this.$refs.alidationModal.refresh();
        });
    },
    // 找回密码
    handleForget(name) {
      if (!this.agreementRadio) {
        this.$message.error("请选择协议");
        return;
      }

      let obj = {
        code: this.loginForm.code,
        mobile: this.loginForm.mobile,
        newPassword: this.loginForm.password,
        enterpriseId: 1,
      };
      obj = { ...obj, ...this.validationDataObj };
      this.$axiosApi(login.getPass.url, login.getPass.methods, obj, true)
        .then(
          (res) => {
            if (res.code === 0) {
              this.$message.success("新密码设置成功，请登录");
              this.changeType(1, "loginForm");
            } else {
              this.$message.error(res.message);
            }
          },
          (err) => {
            this.$refs.alidationModal.refresh();
            this.$message.error(err.message);
          }
        )
        .finally(() => {});
    },
    // 微信二维码绑定调用
    QRLoginFun() {
      let invitedCode = localStorage.getItem("invitedCode");
      let promteCode = localStorage.getItem("promteCode");
      let data = {
        mobile: this.loginForm.mobile,
        mobileCode: this.loginForm.code,
        password: this.loginForm.password,
        ticket: this.getUrlParam("ticket", this.wxQRcode),
        platform: this.platform,
      };
      if (promteCode != null) {
        data.promteCode = promteCode;
      } else if (invitedCode != null) {
        data.inviteCode = invitedCode;
      }
      bindTel(data)
        .then((res) => {
          if (res.code === 0) {
            if (res.data.status === 1) {
              this.loginSuccess(res.data.loginTokenVo);
            }
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          this.$refs.alidationBindPhoneModal.refresh();
        });
    },
    //同意条款
    agreementRadioChage(e) {
      this.agreementRadio = e.target.checked;
    },
    // 获取url链接
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === variable) {
          return decodeURIComponent(pair[1]);
        }
      }
      return false;
    },
    // 获取微信登录二维码
    getwxQRcodeFun() {
      this.isImg = true;
      let obj = {
        path: "pages/login/index",
        envVersion: process.env.NODE_ENV === "prod" ? "release" : "trial",
        type: "sign",
      };
      this.$axiosApi(login.getQRcode.url, login.getQRcode.methods, obj, true).then((res) => {
        if (res.code == 0) {
          this.isImg = false;
          this.wxQRcode = res.data.img;
          this.uuid = res.data.uuid;
          this.countdown();
          this.officeAccountState();
        }
      });
    },
    // 二维码过期倒计时
    countdown() {
      const self = this;
      self.clearTimer = setInterval(() => {
        if (self.timer === 0) {
          clearInterval(self.clearTimer);
          self.isStale = true;
        } else {
          self.isStale = false;
          self.timer--;
        }
      }, 1000);

      self.AccountTimer = setInterval(() => {
        if (self.timer === 0) {
          clearInterval(self.AccountTimer);
        } else {
          if (self.qrStatus === 3 || self.qrStatus === 1 || !this.isQRLogin) {
            clearInterval(self.AccountTimer);
          } else {
            this.officeAccountState();
          }
        }
      }, 2000);
    },
    // 微信二维码登录并获取二维码
    changeLoginType() {
      this.isQRLogin = true;
      this.getwxQRcodeFun();
      this.timer = 60;
    },
    // 获取公众号登录接口
    officeAccountState() {
      this.$axiosApi(login.getQRStatus.url + this.uuid, login.getQRStatus.methods)
        .then((res) => {
          if (res.code == 0) {
            if (JSON.stringify(res.data) !== "{}") {
              this.qrStatus = 1;
              res.data = JSON.parse(res.data);
              this.loginSuccess(res);
            }
          }
        })
        .catch((error) => {
          this.$refs.alidationBindPhoneModal.refresh();
        });
    },
    // 获得tiket
    getUrlParam(params, url) {
      // eslint-disable-next-line no-unused-vars
      let value = "";
      let a = url.split("?");
      return (value = a[1].substr(7));
    },
    // 刷新二维码
    refreshCode() {
      this.isStale = false;
      this.timer = 60;
      this.getwxQRcodeFun();
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

  .flex-between span {
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;

    &:hover {
      color: #3a7fff;
    }
  }

  .login-logo {
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #3a7fff;
    line-height: 22px;
    margin-top: 24px;
    text-align: center;
    cursor: pointer;
    // img {
    //   cursor: pointer;
    //   width: 100%;
    //   height: 100%;
    // }
  }

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
        content: "";
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

  .imgCode {
    width: 109px;
    height: 44px;
    position: absolute;
    right: 0px;
    margin-right: 0px;
    top: -17px;
  }

  /deep/ .box {
    .ant-form-item {
      display: block;
      margin-right: 0px;

      // margin-bottom: 10px;
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

  .qr-login {
    text-align: center;
    color: #333333;
    margin-bottom: 24px;

    .title {
      font-size: 20px;
    }

    .QRimg {
      width: 246px;
      height: 236px;
      margin: auto;
      position: relative;

      /deep/.ant-spin {
        margin-top: 100px;
      }

      img {
        width: 100%;
        height: 100%;
      }

      .stale-box {
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 2555, 0.91);
        position: absolute;
        top: 0;
        text-align: center;
        cursor: pointer;

        p {
          margin-top: 90px;
          color: #000;
          font-size: 14px;
        }

        button {
          margin-top: 10px;
          background-color: #00a3ff;
          border-color: #00a3ff;
          color: #fff;
        }
      }
    }

    .tips {
      text-align: center;
      font-size: 16px;
      font-family: PingFangSC;
      color: #333333;
      line-height: 22px;
      width: 212px;
      margin: 14px auto 0;

      img {
        width: 25px;
        height: 25px;
        margin-right: 5px;
        vertical-align: -webkit-baseline-middle;
      }

      .tip1 {
        margin-left: 48px;
        margin-top: -5px;
      }
    }

    .other-login {
      font-size: 12px;
      color: #999;
      margin-top: 55px;

      span {
        cursor: pointer;
      }

      span:nth-child(1) {
        margin-right: 12px;
      }

      span:nth-child(2) {
        margin-left: 12px;
        color: #333;
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
    content: "";
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
