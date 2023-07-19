<template>
  <div class="container">
    <div class="leftbox">
      <IndexBanner :adKey="'ksy_client_login'" :height="1100" />
    </div>
    <div class="wbg rightbox">
      <header>
        <div class="headerContent" v-if="envpla === 'ksy'">
          <img src="@/assets/images/login/logo7.png" alt="" @click="toIndex" />
          <span>推动跨境电商税务合规化、标准化、智能化</span>
        </div>
        <div class="headerContent" v-if="envpla === 'kqy'">
          <img src="@/assets/images/login/logo77.png" alt="" @click="toIndex" />
          <span>国际工商SaaS平台</span>
        </div>
      </header>
      <div class="content">
        <div class="loginContent">
          <div v-if="!isQRLogin && !bindPhone">
            <p class="title flex-around">
              <span
                v-if="loginType === 1 || loginType === 2"
                :class="{ active: loginType === 1 }"
                @click="changeType(1, 'loginForm')"
              >
                账号登录
                <span class="bottomtip"></span>
              </span>
              <span
                v-if="loginType === 1 || loginType === 2"
                :class="{ active: loginType === 2 }"
                @click="changeType(2, 'loginForm')"
              >
                验证码登录
                <span class="bottomtip"></span>
              </span>
              <span v-if="loginType === 3" class="active">注册账号</span>
              <span v-if="loginType === 4" class="active">修改密码</span>
            </p>
            <div class="box">
              <Form ref="loginForm" :model="loginForm" :rules="loginRule" inline>
                <FormItem prop="mobile" v-if="loginType === 1">
                  <Input type="text" v-model="loginForm.mobile" placeholder="请输入您的手机号"></Input>
                </FormItem>
                <FormItem prop="mobile" v-else>
                  <Input
                    type="text"
                    autocomplete="off"
                    v-model="loginForm.mobile"
                    placeholder="请输入您的手机号"
                  ></Input>
                </FormItem>
                <FormItem prop="password" v-if="loginType === 1">
                  <Input type="password" v-model="loginForm.password" placeholder="请输入你的密码"></Input>
                </FormItem>
                <FormItem v-if="loginType === 1">
                  <!-- 阿里云滑动验证 -->
                  <AliSlideValidation scene="nc_login" ref="alidationModal" @validationData="getValidationData" />
                </FormItem>
                <FormItem prop="code" v-if="loginType === 2 || loginType === 4 || loginType === 3">
                  <Input type="number" autocomplete="off" v-model="loginForm.code" placeholder="请输入验证码"></Input>
                  <Button class="login-btn" @click="getVerificationCode(loginType)">{{ btLogin }}</Button>
                  <div v-if="smsValidation">
                    <div
                      class="ivu-poptip-popper"
                      style="position: absolute; will-change: top, left; top: 24px; left: 0px; width: 100%"
                      x-placement="bottom-end"
                    >
                      <div class="ivu-poptip-content">
                        <div class="ivu-poptip-arrow"></div>
                        <div class="ivu-poptip-inner">
                          <div class="ivu-poptip-title">
                            <div class="ivu-poptip-title-inner">
                              滑块验证
                              <img
                                src="@/assets/images/common/close.png"
                                @click="smsValidation = false"
                                style="
                                  width: 10px;
                                  height: 10px;
                                  cursor: pointer;
                                  float: right;
                                  margin-right: 0px;
                                  margin-top: 5px;
                                "
                                alt=""
                              />
                            </div>
                          </div>
                          <div class="ivu-poptip-body" style="padding: 20px 16px">
                            <div class="ivu-poptip-body-content" style="overflow: hidden">
                              <div class="ivu-poptip-body-content-inner">
                                <!-- 阿里云滑动验证 -->
                                <AliSlideValidation
                                  scene="nc_message"
                                  ref="alidationBindPhoneModal"
                                  @validationData="getValidationData"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </FormItem>
                <FormItem prop="password" v-if="loginType === 4 || loginType === 3">
                  <Input
                    type="password"
                    autocomplete="new-password"
                    v-model="loginForm.password"
                    placeholder="请输入你的密码"
                  ></Input>
                </FormItem>
                <Radio v-model="agreementRadio" v-if="loginType === 4 || loginType === 3">
                  <span style="font-size: 12px">
                    同意并遵守
                    <a
                      v-if="envpla === 'ksy'"
                      style="color: #169fe9"
                      href="https://ori.itaxs.com/agreement.html"
                      target="_blank"
                      >《服务条款》</a
                    >
                    <a
                      v-if="envpla === 'kqy'"
                      style="color: #169fe9"
                      href="https://www.iebsvip.com/privacyagreementkqy.html"
                      target="_blank"
                      >《服务条款》</a
                    >
                  </span>
                </Radio>
                <FormItem>
                  <template v-if="loginBtnText === '登录'">
                    <!-- 登录按钮 -->
                    <Button
                      key="RoginButtonClick"
                      v-sensors="{ type: 'RoginButtonClick', event: 'click' }"
                      type="primary"
                      @click="handleSubmit(loginType, 'loginForm')"
                    >
                      {{ loginBtnText }}
                    </Button>
                  </template>
                  <template v-else>
                    <!-- 注册按钮 -->
                    <Button
                      key="RegisterButtonClick"
                      v-sensors="{ type: 'RegisterButtonClick', event: 'click' }"
                      type="primary"
                      @click="handleSubmit(loginType, 'loginForm')"
                    >
                      {{ loginBtnText }}
                    </Button>
                  </template>
                </FormItem>
                <p class="flex-between" v-if="loginType === 3 || loginType === 4">
                  <span>
                    <span class="loglink" @click="changeType(1, 'loginForm')">去登录</span>
                  </span>
                </p>
                <p class="flex-between" v-else>
                  <span>
                    <span class="loglink" @click="changeType(3, 'loginForm')">立即注册</span>
                  </span>
                  <span class="loglink" @click="changeType(4, 'loginForm')">忘记密码</span>
                </p>
              </Form>
            </div>
          </div>
          <div v-if="isQRLogin && !bindPhone" class="qr-login">
            <p class="title">微信二维码登录</p>
            <div class="QRimg">
              <img :src="wxQRcode" alt="正在加载.." />
              <div class="stale-box" v-if="isStale" @click="refreshCode">
                <P>二维码已过期</P>
                <Button type="error">请刷新二维码</Button>
              </div>
            </div>
            <p class="tips" v-show="envpla === 'ksy'">请使用微信扫描二维码登录“跨税云”</p>
            <p class="tips" v-show="envpla === 'kqy'">请使用微信扫描二维码登录“跨企云”</p>
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
          <div class="bind-box" v-if="bindPhone">
            <p class="title flex-around">
              <span class="active">绑定手机</span>
            </p>

            <div class="box">
              <Form ref="loginForm" :model="loginForm" :rules="loginRule" inline>
                <FormItem prop="mobile">
                  <Input type="text" v-model="loginForm.mobile" placeholder="请输入您的手机号"></Input>
                </FormItem>
                <FormItem prop="password">
                  <Input type="password" v-model="loginForm.password" placeholder="请输入你的密码"></Input>
                </FormItem>
                <FormItem prop="code">
                  <Input type="number" autocomplete="off" v-model="loginForm.code" placeholder="请输入验证码"></Input>
                  <Button class="login-btn" @click="getVerificationCode(5)">{{ btLogin }}</Button>
                  <div v-if="smsValidation">
                    <div
                      class="ivu-poptip-popper"
                      style="position: absolute; will-change: top, left; top: 24px; left: 0px; width: 100%"
                      x-placement="bottom-end"
                    >
                      <div class="ivu-poptip-content">
                        <div class="ivu-poptip-arrow"></div>
                        <div class="ivu-poptip-inner">
                          <div class="ivu-poptip-title">
                            <div class="ivu-poptip-title-inner">
                              滑块验证
                              <img
                                src="@/assets/images/common/close.png"
                                @click="smsValidation = false"
                                style="
                                  width: 10px;
                                  height: 10px;
                                  cursor: pointer;
                                  float: right;
                                  margin-right: 0px;
                                  margin-top: 5px;
                                "
                                alt=""
                              />
                            </div>
                          </div>
                          <div class="ivu-poptip-body" style="padding: 20px 16px">
                            <div class="ivu-poptip-body-content" style="overflow: hidden">
                              <div class="ivu-poptip-body-content-inner">
                                <AliSlideValidation scene="nc_message" @validationData="getValidationData" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="handleSubmit(5, 'loginForm')">确定绑定</Button>
                </FormItem>
                <p class="back-login" @click="bindPhone = false">
                  <img src="@/assets/images/login/reback.png" alt="" />
                  返回登录
                </p>
              </Form>
            </div>
          </div>
          <div class="login-logo" v-if="!bindPhone">
            <!-- <img src="@/assets/images/login/qrLogin.png" alt="" v-if="!isQRLogin" @click="changeLoginType" />
            <img src="@/assets/images/login/otherLogin.png" alt="" v-if="isQRLogin" @click="isQRLogin = false" /> -->
            <span v-if="!isQRLogin" @click="changeLoginType">扫码登录</span>
            <span v-if="isQRLogin" @click="isQRLogin = false">其他登录</span>
          </div>
        </div>
      </div>
      <footer class="bottomBox" v-if="envpla === 'ksy'">
        <a href="https://ori.itaxs.com/agreement.html" target="_blank">《跨税云用户协议》</a>
        <a href="https://ori.itaxs.com/privacy.html" target="_blank">《跨税云隐私策略》</a>
        ICP证:
        <a href="http://beian.miit.gov.cn/">粤ICP备20016192号</a>
        Copyright @ 2022 跨税云
      </footer>
      <footer class="bottomBox" v-if="envpla === 'kqy'">
        <a href="https://www.iebsvip.com/privacyagreementkqy.html" target="_blank">《跨企云用户协议》</a>
        <a href="https://www.iebsvip.com/agreementkqy.html" target="_blank">《跨企云隐私策略》</a>
        ICP证:
        <a href="http://beian.miit.gov.cn/">粤ICP备17020240号</a>
        Copyright @ 2022 跨企云
      </footer>
    </div>
  </div>
</template>

<script>
const VUE_APP_APPLET_ENV = process.env.VUE_APP_APPLET_ENV;
import AliSlideValidation from '@/components/AliSlideValidation';
import IndexBanner from '@/components/IndexBanner/index';
import {
  getYzm,
  loginPass,
  loginClient,
  loginYzm,
  getPass,
  // bind
  callbackSellerOS,
  bindSellerOS,
  getSellerToken,
  inviteRegister,
  getImgCodeApi,
  estimateLogin,
  bindTel,
  slidingPWLogin,
  slidingSMSLogin,
} from '@/api/login/login';
import { getQRcode, getQRStatus } from '@/api/applet/index';
import Cookies from 'js-cookie';
export default {
  data() {
    return {
      loginForm: {
        password: '',
        code: '',
        mobile: '',
      },
      imgCodeSrc: '',
      codeKey: '',
      loginType: 2,
      loginBtnText: '登录',
      ifClick: false,
      smsValidation: false,
      btLogin: '获取验证码',
      validationDataObj: {},
      agreementRadio: '',
      loginRule: {
        user: [
          {
            required: true,
            message: '请输入您的账户名',
            trigger: 'blur',
            type: 'string',
          },
        ],
        mobile: [
          {
            required: true,
            message: '请输入您的手机号',
            trigger: 'blur',
            type: 'string',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入你的密码',
            trigger: 'blur',
            type: 'string',
          },
        ],
        imgCode: [
          {
            required: true,
            message: '请输入图形验证码',
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
        agreement: [
          {
            required: true,
            message: '请同意服务条款',
            trigger: 'blur',
            type: 'string',
          },
        ],
      },
      isQRLogin: false,
      wxQRcode: '',
      timer: 60,
      isStale: false,
      bindPhone: false,
      qrStatus: 0,
      registeredsuccess: true,
      uuid: '',
    };
  },
  components: {
    AliSlideValidation,
    IndexBanner,
  },
  methods: {
    toIndex() {
      let href = process.env.VUE_APP_HOME_URL;
      window.location.href = href;
    },
    changeType(type, name) {
      this.loginType = type;
      switch (type) {
        case 3:
          this.loginBtnText = '注册';
          break;
        case 4:
          this.loginBtnText = '完成';
          break;
        default:
          this.loginBtnText = '登录';
          break;
      }
      this.validationDataObj = {};
      this.loginForm = {};
    },
    //  登录
    handleSubmit(type, name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (JSON.stringify(this.validationDataObj) === '{}') {
            this.$Message.error('请先滑动验证');
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
    //密码登录限注册成功后调用
    passwordLogin() {
      let promteCode = localStorage.getItem('promteCode');
      let obj = {
        mobile: this.loginForm.mobile,
        password: this.loginForm.password,
        promteCode,
      };
      obj = { ...obj, ...this.validationDataObj };
      slidingPWLogin(obj)
        .then((res) => {
          if (res.code == 0) {
            this.$Message.success('登录成功');
            this.$util.getUserInegralMessage(this, '登录');
            this.$store.commit('saveToken', res.data.token);
            this.$store.commit('saveSessionId', res.data.sessionId);
            localStorage.setItem('token', res.data.token); // save local
            localStorage.setItem('sessionId', res.data.sessionId);

            Cookies.set('token', res.data.token);
            Cookies.set('sessionId', res.data.sessionId);
            // window.location.href = "/work";
            this.$store.commit('saveLogin', true);
            if (this.envpla === 'ksy') {
              this.$router.push('/work');
            } else {
              this.$router.push('/orderList');
            }
            sessionStorage.setItem('showGuideFromLogin', JSON.stringify(true));
            // location.reload();
          } else {
            this.validationDataObj = {};
            // 登陆异常，则重置验证码滑块1
            if (this.$refs.alidationModal) {
              this.$refs.alidationModal.reset();
              this.$refs.alidationModal.refresh();
            }
          }
        })
        .catch((error) => {
          this.validationDataObj = {};
          // 登陆异常，则重置验证码滑块2
          if (this.$refs.alidationModal) {
            this.$refs.alidationModal.reset();
            this.$refs.alidationModal.refresh();
          }
        })
        .finally(() => {});
    },
    // send code
    getGeetest(type) {
      let self = this;
      if (self.ifClick) return;
      self.verificationCodeCount = 120;
      let params = {
        mobile: self.loginForm.mobile,
        useType: type, // 使用类型,1-注册验证码 2-登录验证码 3-忘记密码 4-微信绑定 5-修改手机账号验证 6-新手机账号验证
      };
      params = { ...params, ...this.validationDataObj };
      slidingSMSLogin(params)
        .then(
          (res) => {
            if (res.code == 0) {
              self.$Message.success('短信发送成功');
              self.verificationCodeTimer = setInterval(() => {
                if (self.verificationCodeCount == 0) {
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
              self.ifClick = false;
            }
          },
          (err) => {
            self.$refs.alidationModal.validationFun;
            // this.$Message.error(err.message);
            self.ifClick = false;
          }
        )
        .finally(() => {
          self.ifClick = false;
        });
    },
    // 发送验证码
    getVerificationCode(type) {
      if (this.ifClick) return;
      if (JSON.stringify(this.loginForm) === '{}') {
        this.$Message.error('请输入手机号码');
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.loginForm.mobile)) {
        this.$Message.error('请填写正确的手机号码');
        return false;
      }
      this.smsValidation = !this.smsValidation;
      this.loginType = type;
    },
    // login
    changeLogin() {
      let obj = {};
      let promteCode = localStorage.getItem('promteCode');
      obj = {
        code: this.loginForm.code,
        mobile: this.loginForm.mobile,
        promteCode,
      };
      loginYzm(obj)
        .then(
          (res) => {
            if (res.code == 0) {
              this.$Message.success('登录成功');
              this.$util.getUserInegralMessage(this, '登录');
              localStorage.setItem('token', res.data.token); // save local
              localStorage.setItem('sessionId', res.data.sessionId);

              Cookies.set('token', res.data.token);
              Cookies.set('sessionId', res.data.sessionId);
              sessionStorage.setItem('showGuideFromLogin', JSON.stringify(true));
              this.$store.commit('saveLogin', true);
              if (this.envpla === 'ksy') {
                this.$router.push('/work');
              } else {
                this.$router.push('/orderList');
              }
              location.reload();
            } else {
              // 登陆异常，则重置验证码滑块
              if (this.$refs.alidationModal) {
                this.$refs.alidationModal.reset();
                this.$refs.alidationModal.refresh();
              }
              this.$Message.error(res.message);
            }
          },
          (err) => {
            // 登陆异常，则重置验证码滑块
            if (this.$refs.alidationModal) {
              this.$refs.alidationModal.reset();
              this.$refs.alidationModal.refresh();
            }
            this.$Message.error(err.message);
          }
        )
        .finally(() => {});
    },
    //有邀请码的注册
    inviteReg() {
      if (this.agreementRadio === '') {
        this.$Message.error('请选择协议');
        return;
      }
      let invitedCode = localStorage.getItem('invitedCode');
      let promteCode = localStorage.getItem('promteCode');
      let obj = {};
      if (promteCode == null) {
        obj = {
          mobile: this.loginForm.mobile,
          password: this.loginForm.password,
          code: this.loginForm.code,
          invitedCode: invitedCode,
          source: 0,
        };
      } else if (invitedCode == null) {
        obj = {
          mobile: this.loginForm.mobile,
          password: this.loginForm.password,
          code: this.loginForm.code,
          promteCode: promteCode,
          source: 0,
        };
      }
      obj = { ...obj, ...this.validationDataObj };
      inviteRegister(obj)
        .then((res) => {
          if (res.code == 0) {
            this.$Message.success('注册成功');
            this.$util.getUserInegralMessage(this, '注册');
            this.changeType(1, 'loginForm');
          } else {
            // 登陆异常，则重置验证码滑块
            if (this.$refs.alidationModal) {
              this.$refs.alidationModal.reset();
              this.$refs.alidationModal.refresh();
            }
          }
        })
        .catch((error) => {
          // 登陆异常，则重置验证码滑块
          if (this.$refs.alidationModal) {
            this.$refs.alidationModal.reset();
            this.$refs.alidationModal.refresh();
          }
        });
    },
    // 找回密码
    handleForget(name) {
      if (this.agreementRadio === '') {
        this.$Message.error('请选择协议');
        return;
      }
      let self = this;
      let obj = {
        code: this.loginForm.code,
        mobile: this.loginForm.mobile,
        newPassword: this.loginForm.password,
      };
      obj = { ...obj, ...this.validationDataObj };
      getPass(obj)
        .then(
          (res) => {
            // console.log(res);
            if (res.code == 0) {
              this.$Message.success('新密码设置成功，请登录');
              this.changeType(1, 'loginForm');
            } else {
              // 登陆异常，则重置验证码滑块
              if (this.$refs.alidationModal) {
                this.$refs.alidationModal.reset();
                this.$refs.alidationModal.refresh();
              }
              this.$Message.error(res.message);
            }
          },
          (err) => {
            // 登陆异常，则重置验证码滑块
            if (this.$refs.alidationModal) {
              this.$refs.alidationModal.reset();
              this.$refs.alidationModal.refresh();
            }
            this.$Message.error(err.message);
          }
        )
        .finally(() => {});
    },
    //微信二维码绑定调用
    QRLoginFun() {
      let invitedCode = localStorage.getItem('invitedCode');
      let promteCode = localStorage.getItem('promteCode');
      let data = {
        mobile: this.loginForm.mobile,
        mobileCode: this.loginForm.code,
        password: this.loginForm.password,
        ticket: this.getUrlParam('ticket', this.wxQRcode),
      };
      if (promteCode == null) {
        data = {
          mobile: this.loginForm.mobile,
          mobileCode: this.loginForm.code,
          password: this.loginForm.password,
          ticket: this.getUrlParam('ticket', this.wxQRcode),
          inviteCode: invitedCode,
        };
      } else if (invitedCode == null) {
        data = {
          mobile: this.loginForm.mobile,
          mobileCode: this.loginForm.code,
          password: this.loginForm.password,
          ticket: this.getUrlParam('ticket', this.wxQRcode),
          promteCode: promteCode,
        };
      }

      bindTel(data)
        .then((res) => {
          if (res.code === 0) {
            if (res.data.status == 1) {
              this.loginSuccess(res.data.loginTokenVo);
            }
          }
        })
        .catch((error) => {
          this.$refs.alidationBindPhoneModal.refresh();
        });
    },
    //登陆成功跳转
    loginSuccess(data) {
      localStorage.setItem('token', data.token); // save local
      localStorage.setItem('sessionId', data.sessionId);
      // window.location.href = "/work";
      this.$store.commit('saveLogin', true);
      sessionStorage.setItem('showGuideFromLogin', JSON.stringify(true));
      if (this.envpla === 'ksy') {
        this.$router.push('/work');
      } else {
        this.$router.push('/orderList');
      }
      this.$util.getUserInegralMessage(this, '登录');
      location.reload();
    },
    // 获取url链接
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == variable) {
          return decodeURIComponent(pair[1]);
        }
      }
      return false;
    },
    //获取微信小程序登录二维码
    getwxQRcodeFun() {
      const self = this;
      getQRcode({
        path: 'pages/login/index',
        envVersion: VUE_APP_APPLET_ENV,
        type: 'sign',
      }).then((res) => {
        if (res.code == 0) {
          this.wxQRcode = res.data.img;
          this.uuid = res.data.uuid;
          this.countdown();
          this.officeAccountState();
        }
      });
    },
    //二维码过期倒计时
    countdown() {
      const self = this;
      self.clearTimer = setInterval(() => {
        if (self.timer == 0) {
          clearInterval(self.clearTimer);
          self.isStale = true;
        } else {
          self.isStale = false;
          self.timer--;
        }
      }, 1000);

      self.AccountTimer = setInterval(() => {
        if (self.timer == 0) {
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
    //微信二维码登录并获取二维码
    changeLoginType() {
      this.isQRLogin = true;
      this.getwxQRcodeFun();
      this.timer = 60;
    },
    //获取公众号登录接口
    officeAccountState() {
      getQRStatus({ uuid: this.uuid })
        .then((res) => {
          if (res.code == 0) {
            if (JSON.stringify(res.data) !== '{}') {
              this.qrStatus = 1;
              const data = JSON.parse(res.data);
              this.$store.commit('saveToken', data.token);
              this.$store.commit('saveSessionId', data.sessionId);
              localStorage.setItem('token', data.token); // save local
              localStorage.setItem('sessionId', data.sessionId);
              this.$store.commit('saveLogin', true);
              if (this.envpla === 'ksy') {
                this.$router.push('/work');
              } else {
                this.$router.push('/orderList');
              }
              sessionStorage.setItem('showGuideFromLogin', JSON.stringify(true));
            }
          }
        })
        .catch((error) => {
          this.$refs.alidationBindPhoneModal.refresh();
        });
    },
    //获得tiket
    getUrlParam(params, url) {
      let value = '';
      let a = url.split('?');
      return (value = a[1].substr(7));
    },
    //刷新二维码
    refreshCode() {
      this.isStale = false;
      this.timer = 60;
      this.getwxQRcodeFun();
    },
    getValidationData(data) {
      this.smsValidation = false;
      this.validationDataObj = data;
      if (this.validationDataObj.scene === 'nc_message' && this.loginType !== 1) {
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
            this.getGeetest(4); //微信绑定
            break;
        }
      }
    },
  },
  created() {
    let tokenl = localStorage.getItem('token');
    let sid = localStorage.getItem('sessionId');
    if (tokenl && sid) {
      if (this.envpla === 'ksy') {
        this.$router.push('/work');
      } else {
        this.$router.push('/orderList');
      }
      return;
    }
    if (window.location.href.indexOf('loginType') > 0) {
      this.loginType = Number(this.getQueryVariable('loginType'));
      switch (this.loginType) {
        case 3:
          this.loginBtnText = '注册';
          break;
        case 4:
          this.loginBtnText = '完成';
          break;
        default:
          this.loginBtnText = '登录';
          break;
      }
    }
  },
  mounted() {
    console.log('process', process.env.VUE_APP_APPLET_ENV);
  },
};
</script>

<style lang="less" scoped>
// /deep/ .ivu-radio-inner:after{
//     left: 4px;
//     top: 4px;
// }
/deep/ .ivu-radio-wrapper {
  margin-bottom: 5px;
}

@media screen and (max-width: 1440px) {
  .container {
    .leftbox {
      width: calc(100% - 524px) !important;
    }
    .rightbox {
      width: 524px !important;
      .headerContent {
        span {
          margin-left: 28px;
        }
      }
      .bottomBox {
        line-height: 32px;
      }
    }
  }
}
.container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  // position: fixed;
  // left: 0px;
  // top: 0px;
  // background: #dcdcdc !important;
  // background: url(../../assets/images/login/loginbg.png) no-repeat;
  // background-size: cover;
  // background-position: center;
  header {
    height: 80px;
    display: flex;
    align-items: center;
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
  }
  .wbg {
    background: #ffffff;
  }
  .leftbox {
    height: 100vh;
    width: calc(100% - 820px);
    // width: 500px;
    flex: 1;
    /deep/ .ant-carousel {
      .slick-dots-bottom {
        bottom: 200px;
        height: 30px;
      }
      .slick-dots li.slick-active button {
        background: #3a7fff;
      }
      .slick-dots li button {
        background: rgba(0, 0, 0, 0.16);
      }
    }
  }
  .rightbox {
    height: 100vh;
    // max-width: 820px;
    width: 820px;
  }
  .loglink {
    color: #00000060;
    cursor: pointer;
    font-size: 14px;
  }
  .bottomBox {
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #919498;
    height: 70px;
    line-height: 70px;
    padding: 0px 105px;
    a {
      color: #919498;
    }
  }
  .content {
    height: calc(100vh - 150px);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .img {
      width: 782px;
      height: 602px;
      margin-right: 100px;
    }
    .loginContent {
      width: 342px;
      height: 520px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      padding: 90px 0px 110px;
      position: relative;
      .login-logo {
        font-size: 14px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #3a7fff;
        line-height: 22px;
        margin-top: 24px;
        text-align: center;
        cursor: pointer;
      }
      .title {
        margin-bottom: 30px;
        span {
          height: 20px;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(153, 153, 153, 1);
          line-height: 20px;
          cursor: pointer;

          font-size: 18px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.4);
        }
        span.active {
          font-size: 20px;
          color: rgba(0, 0, 0, 0.9);
          position: relative;
          .bottomtip {
            position: absolute;
            bottom: -9px;
            width: 32px;
            height: 4px;
            background: #3a7fff;
            border-radius: 16px 16px 16px 16px;
            left: 31%;
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
        .ivu-form-item {
          display: block;
          margin-right: 0px;
          // margin-bottom: 10px;
          .ivu-input {
            height: 44px;
            background: #f2f3f9;
            border-radius: 2px 2px 2px 2px;
          }
          input.ivu-input:-internal-autofill-selected {
            background-color: white !important;
            background-image: none !important;
            color: rgb(0, 0, 0) !important;
            box-shadow: inset 0 0 0 1000px white !important;
          }
          .ivu-btn {
            width: 100%;
            height: 44px;
            background: #3a7fff;
            border-radius: 2px;
          }
          .login-btn {
            width: 150px;
            height: 44px;
            background: #3a7fff;
            border-radius: 2px;
            color: #ffffff;
            position: absolute;
            right: 0px;
            top: -0px;
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
          img {
            width: 100%;
            height: 100%;
          }
          .stale-box {
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 2555, 0.8);
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
            }
          }
        }
        .tips {
          font-size: 16px;
          line-height: 21px;
          margin-top: 13px;
          width: 212px;
          margin: auto;
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
    .registeredsuccess {
      display: flex;
      flex-direction: column;
      align-items: center;
      .top {
        font-size: 20px;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
      }
      .bottom {
        font-size: 16px;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        font-weight: 500;
        color: #333333;
        line-height: 16px;
        margin-bottom: 24px;
      }
      .tologin {
        font-size: 16px;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #3a7fff;
        line-height: 16px;
        cursor: pointer;
      }
      img {
        width: 246px;
        height: 236px;
        margin: 24px 0px;
      }
    }
  }
  .bind-box {
    .back-login {
      color: #169fe9;
      text-align: right;
      cursor: pointer;
      img {
        width: 10px;
        height: 10px;
        margin-right: 2px;
        vertical-align: middle;
      }
    }
  }
}
@media screen and (max-width: 1440px) {
  .container {
    header {
      height: 100px;
      .headerContent {
        max-width: 1200px;
        img {
          width: 150px;
          height: 37px;
        }
      }
    }
    .content {
      height: calc(91% - 100px);
      display: flex;
      justify-content: space-around;
      align-items: center;
      img {
        width: 617px;
        height: 492px;
        margin-right: 0px;
      }
      .loginContent {
        // width: 474px;
        // height:460px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        // padding: 60px 57px 20px;
      }
    }
  }
}
</style>
