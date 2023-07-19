<template>
  <div class="container" :class="{ wglogin: PROCESS_ENV.NODE_PLA === 'wg' }">
    <div class="leftbox">
      <IndexBanner ref="leftbox" :adKey="'LoginPage_BackgroundImage'" :height="1100" />
    </div>
    <div class="content rightbox">
      <header>
        <div class="headerContent">
          <img v-if="PROCESS_ENV.NODE_PLA === 'kby'" src="@/assets/images/login/logo.svg" alt="" @click="toIndex" />
          <img v-if="PROCESS_ENV.NODE_PLA === 'wg'" src="@/assets/images/login/wglogo.svg" alt="" @click="toIndex" />
          <span v-if="PROCESS_ENV.NODE_PLA === 'kby'">助力跨境电商卖家开启全球品牌之路</span>
        </div>
      </header>
      <div class="loginContent">
        <div v-if="!isQRLogin && !bindPhone">
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
            <Form ref="loginForm" :model="loginForm" :rules="loginRule" inline>
              <FormItem prop="mobile" v-if="loginType === 1">
                <Input type="text" v-model="loginForm.mobile" placeholder="请输入您的手机号"></Input>
              </FormItem>
              <FormItem prop="mobile" v-else>
                <Input type="text" autocomplete="off" v-model="loginForm.mobile" placeholder="请输入您的手机号"></Input>
              </FormItem>
              <FormItem prop="password" v-if="loginType === 1">
                <Input type="password" v-model="loginForm.password" placeholder="请输入你的密码"></Input>
              </FormItem>
              <FormItem v-if="loginType === 1">
                <sliding-validation
                  scene="nc_login"
                  ref="alidationModal"
                  @validationData="getValidationData"
                ></sliding-validation>
              </FormItem>
              <FormItem prop="code" v-if="loginType === 2 || loginType === 4 || loginType === 3">
                <Input type="number" autocomplete="off" v-model="loginForm.code" placeholder="请输入验证码"></Input>
                <Button class="login-btn" @click="getVerificationCode(loginType)">{{ btLogin }} </Button>
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
                              <sliding-validation
                                scene="nc_message"
                                ref="alidationBindPhoneModal"
                                @validationData="getValidationData"
                              ></sliding-validation>
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
                <span style="font-size: 12px"
                  >同意并遵守
                  <a style="color: #00a3ff" href="https://ori.iipto.com/agreement.html" target="_blank">《服务条款》</a>
                </span>
              </Radio>
              <FormItem class="login-register-btn">
                <Button
                  key="btn1"
                  v-if="loginBtnText == '注册'"
                  type="primary"
                  @click="handleSubmit(loginType, 'loginForm')"
                  v-sensors="{ type: 'RegisterButtonClick', event: 'click' }"
                  >{{ loginBtnText }}</Button
                >
                <Button
                  key="btn2"
                  v-else-if="loginBtnText == '登录'"
                  type="primary"
                  @click="handleSubmit(loginType, 'loginForm')"
                  v-sensors="{ type: 'RoginButtonClick', event: 'click' }"
                  >{{ loginBtnText }}</Button
                >
                <Button key="btn3" v-else type="primary" @click="handleSubmit(loginType, 'loginForm')">{{
                  loginBtnText
                }}</Button>
              </FormItem>
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
            </Form>
          </div>
        </div>
        <div v-if="isQRLogin && !bindPhone" class="qr-login">
          <p class="title">微信二维码登录</p>
          <div class="QRimg">
            <a-spin :spinning="wxQRcodeLoading">
              <div style="height: 236px;">
                <img v-if="!wxQRcodeLoading" :src="wxQRcode" alt="正在加载.." height="236" />
              </div>
            </a-spin>
            <div class="stale-box" v-if="isStale" @click="refreshCode">
              <P>二维码已过期</P>
              <Button type="error">请刷新二维码</Button>
            </div>
          </div>
          <div class="tips">请使用微信扫描二维码登录“跨标云”</div>
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
          <div class="title flex-around">
            <span class="active">绑定手机</span>
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
                  <Button class="login-btn" @click="getVerificationCode(5)">{{ btLogin }} </Button>
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
                                <sliding-validation
                                  scene="nc_message"
                                  @validationData="getValidationData"
                                ></sliding-validation>
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
                  <img src="@/assets/images/login/reback.png" alt="" />返回登录
                </p>
              </Form>
            </div>
          </div>
        </div>
        <div class="login-logo" v-if="!bindPhone && PROCESS_ENV.NODE_PLA === 'kby'">
          <!-- <img src="@/assets/images/login/qrLogin.png" alt="" v-if="!isQRLogin" @click="changeLoginType" />
            <img src="@/assets/images/login/otherLogin.png" alt="" v-if="isQRLogin" @click="isQRLogin = false" /> -->
          <span v-if="!isQRLogin" @click="changeLoginType">扫码登录</span>
          <span v-if="isQRLogin" @click="isQRLogin = false">其他登录</span>
        </div>
      </div>
      <p class="bottomBox" v-if="PROCESS_ENV.NODE_PLA === 'kby'">
        <a href="https://ori.iipto.com/agreement.html" target="_blank">《跨标云用户协议》</a>
        <a href="https://ori.iipto.com/privacy.html" target="_blank">《跨标云隐私策略》</a> <br />ICP证:
        <a href="http://beian.miit.gov.cn/" target="_blank">粤ICP备2020133509号</a> Copyright @ 2020 跨标云
      </p>
      <p class="bottomBox" v-if="PROCESS_ENV.NODE_PLA === 'wg'">
        <a :href="htmlUrl + 'agreementwg.html'" target="_blank">《盛骁科技用户协议》</a>
        <a :href="htmlUrl + 'privacyagreementwg.html'" target="_blank">《盛骁科技隐私政策》</a>
      </p>
    </div>
  </div>
</template>

<script>
const VUE_APP_APPLET_ENV = process.env.VUE_APP_APPLET_ENV;
import Cookies from 'js-cookie';
import slidingValidation from '../../components/login/slidingValidation';
import {
  loginYzm,
  getPass,
  inviteRegister,
  estimateLogin,
  bindTel,
  slidingPWLogin,
  slidingSMSLogin,
  crossStationLogin,
} from '@/api/login/login';
import { getInfo1 } from '@/api/user/userModule';
import { getQRcode, getQRStatus } from '@/api/applet/index';
import IndexBanner from '@/components/IndexBanner/index';
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
      wxQRcodeLoading: false,
      timer: 60,
      isStale: false,
      bindPhone: false,
      qrStatus: 0,
      registeredsuccess: true,

      uuid: '',
      leftBox: {
        width: 0,
        height: 0,
      },
    };
  },
  components: {
    slidingValidation: slidingValidation,
    IndexBanner,
  },
  computed: {
    htmlUrl() {
      let url = this.wgUrl;
      url = url.replace('/client/', '/');
      return url;
    },
  },
  methods: {
    toIndex() {
      let url = '';
      if (this.invitedCode != null) {
        url = this.homePageUrl + '?invitedCode=' + this.invitedCode;
      } else if (this.promteCode != null) {
        url = this.homePageUrl + '?promteCode=' + this.promteCode;
      } else {
        url = this.homePageUrl;
      }
      window.open(url);
    },
    getUinfo() {
      // eslint-disable-next-line no-unused-vars
      let self = this;
      getInfo1()
        .then(
          (res) => {
            if (res.code === 0) {
              localStorage.setItem('objInfo', JSON.stringify(res.data));
              // 神策关联用户
              this.$sensors.login(res.data.userMobile, () => {
                this.$sensors.quick('autoTrack');
              });
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
    // 登录
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
    // 密码登录限注册成功后调用
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
          if (res.code === 0) {
            this.$Message.success('登录成功');
            localStorage.setItem('token', res.data.token); // save local
            localStorage.setItem('sessionId', res.data.sessionId);

            Cookies.set('token', res.data.token);
            Cookies.set('sessionId', res.data.sessionId);

            this.getUinfo();
            // window.location.href = "/myBrand";
            this.$store.commit('saveLogin', true);
            this.$util.getUserInegralMessage(this, '登录');
            location.reload();
          } else {
          }
        })
        .catch(() => {
          this.$refs.alidationModal.refresh();
          this.validationDataObj = {};
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
        signSource: 2,
        useType: type,
      };
      params = { ...params, ...this.validationDataObj };
      slidingSMSLogin(params)
        .then(
          (res) => {
            if (res.code === 0) {
              self.$Message.success('短信发送成功');
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
              self.ifClick = false;
            }
          },
          // eslint-disable-next-line handle-callback-err
          (err) => {
            // eslint-disable-next-line no-unused-expressions
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
            if (res.code === 0) {
              this.$Message.success('登录成功');
              this.$util.getUserInegralMessage(this, '登录');
              localStorage.setItem('token', res.data.token); // save local
              localStorage.setItem('sessionId', res.data.sessionId);

              Cookies.set('token', res.data.token);
              Cookies.set('sessionId', res.data.sessionId);
              this.getUinfo();
              localStorage.setItem('iscloseActive', false);
              this.$store.commit('saveLogin', true);
              // this.$router.push("/myBrand");
              location.reload();
            } else {
              this.$Message.error(res.message);
            }
          },
          (err) => {
            this.$refs.alidationModal.refresh();
            this.$Message.error(err.message);
          }
        )
        .finally(() => {});
    },
    // 有邀请码的注册
    inviteReg() {
      if (this.agreementRadio === '') {
        this.$Message.error('请选择协议');
        return;
      }
      let invitedCode = localStorage.getItem('invitedCode'); // 邀请码
      let promteCode = localStorage.getItem('promteCode');
      let promteName= Cookies.get("channelQuery"); // 第三方页面跳转过来的页面，注册用户统计
      // eslint-disable-next-line no-unused-vars
      let enterpriseId = localStorage.getItem('enterpriseId'); // 企业ID
      // eslint-disable-next-line no-unused-vars
      let source = localStorage.getItem('source'); // 来源
      let obj = {};
      if (promteCode == null) {
        obj = {
          // mobile: this.loginForm.mobile,
          // password: this.loginForm.password,
          // smsCode: this.loginForm.code,
          // inviteCode: invitedCode,
          code: this.loginForm.code,
          enterpriseId: 1,
          mobile: this.loginForm.mobile,
          password: this.loginForm.password,
          source: 0, // pc
        };
      } else if (invitedCode == null) {
        obj = {
          // mobile: this.loginForm.mobile,
          // password: this.loginForm.password,
          // smsCode: this.loginForm.code,
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
      inviteRegister(obj)
        .then((res) => {
          if (res.code === 0) {
            this.$Message.success('注册成功');
            this.changeType(1, 'loginForm');
            Cookies.remove('channelQuery')
          } else {
            this.$Message.error(res.message);
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          this.$refs.alidationModal.refresh();
        });
    },
    // 找回密码
    handleForget(name) {
      if (this.agreementRadio === '') {
        this.$Message.error('请选择协议');
        return;
      }
      // eslint-disable-next-line no-unused-vars
      let self = this;
      // eslint-disable-next-line no-unused-vars
      let enterpriseId = localStorage.getItem('enterpriseId'); // 企业ID
      let obj = {
        code: this.loginForm.code,
        mobile: this.loginForm.mobile,
        newPassword: this.loginForm.password,
        enterpriseId: 1,
      };
      obj = { ...obj, ...this.validationDataObj };
      getPass(obj)
        .then(
          (res) => {
            // console.log(res);
            if (res.code === 0) {
              this.$Message.success('新密码设置成功，请登录');
              this.changeType(1, 'loginForm');
            } else {
              this.$Message.error(res.message);
            }
          },
          (err) => {
            this.$refs.alidationModal.refresh();
            this.$Message.error(err.message);
          }
        )
        .finally(() => {});
    },
    // 微信二维码绑定调用
    QRLoginFun() {
      let invitedCode = localStorage.getItem('invitedCode');
      let promteCode = localStorage.getItem('promteCode');
      let data = {
        mobile: this.loginForm.mobile,
        mobileCode: this.loginForm.code,
        password: this.loginForm.password,
        ticket: this.getUrlParam('ticket', this.wxQRcode),
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
    // 登陆成功跳转
    loginSuccess(data) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('sessionId', data.sessionId);

      Cookies.set('token', data.token);
      Cookies.set('sessionId', data.sessionId);

      this.getUinfo();
      this.$router.push('/work');
      // window.location.href = "/myBrand";
      this.$store.commit('saveLogin', true);
      // this.$router.push("/myBrand");
      location.reload();
    },
    // 获取url链接
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] === variable) {
          return decodeURIComponent(pair[1]);
        }
      }
      return false;
    },
    // 获取微信登录二维码
    getwxQRcodeFun() {
      // eslint-disable-next-line no-unused-vars
      const self = this;
      // getQRcode({ platform: this.platform }).then((res) => {
      //   if (res.code === 0) {
      //     this.wxQRcode = res.data;
      //     this.countdown();
      //     this.officeAccountState();
      //   }
      // });
      this.wxQRcodeLoading = true
      getQRcode({
        path: 'pages/login/index',
        envVersion: process.env.NODE_ENV == 'production' ? 'release' : 'trial',
        type: 'sign',
      }).then((res) => {
        if (res.code == 0) {
          this.wxQRcode = res.data.img;
          this.uuid = res.data.uuid;
          this.wxQRcodeLoading = false
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
      getQRStatus({ uuid: this.uuid })
        .then((res) => {
          if (res.code == 0) {
            if (JSON.stringify(res.data) !== '{}') {
              this.qrStatus = 1;
              this.loginSuccess(JSON.parse(res.data));
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
      let value = '';
      let a = url.split('?');
      return (value = a[1].substr(7));
    },
    // 刷新二维码
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
            this.getGeetest(4); // 微信绑定
            break;
        }
      }
    },
    crossLogin(crossSessionId) {
      var enterpriseId = '';
      if (process.env.NODE_PLA === 'kby') {
        enterpriseId = '30';
      }
      if (process.env.NODE_PLA === 'wg') {
        enterpriseId = '49';
      }
      localStorage.removeItem('token');
      localStorage.removeItem('sessionId');

      Cookies.remove('token');
      Cookies.remove('sessionId');
      let obj = {
        enterpriseId: enterpriseId,
        sessionid: crossSessionId,
      };
      this.$Message.info('自动登录中,请勿操作');
      crossStationLogin(obj).then(async (res) => {
        if (res.code === 0) {
          this.$Message.success('登录成功');
          localStorage.setItem('token', res.data.token); // save local
          localStorage.setItem('sessionId', res.data.sessionId);

          Cookies.set('token', res.data.token);
          Cookies.set('sessionId', res.data.sessionId);

          await this.getUinfo();
          // window.location.href = "/myBrand";
          this.$store.commit('saveLogin', true);
          this.$util.getUserInegralMessage(this, '登录');
          window.location.href = location.origin + '/client/work';
        } else {
          this.$Message.error(res.message);
        }
      });
    },
  },
  created() {
    let tokenl = localStorage.getItem('token');
    let sid = localStorage.getItem('sessionId');
    if (tokenl && sid) {
      this.$router.push('/work');
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

    // 单点登录，检查到 crossSessionId，自动退出，带crossSessionId到login页面重新登录
    let query = this.$route.query;
    if (query.crossSessionId) {
      this.crossLogin(query.crossSessionId);
    }
  },
  mounted() {},
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
.wglogin {
  background: url('~@/assets/images/common/wglogin.png') no-repeat center #edf1fb !important;
}
.container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  .logo {
    position: absolute;
    left: 50px;
    top: 45px;
    z-index: 999;
  }
  .content {
    // height: calc(100% - 0px);
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // position: relative;
    // overflow: hidden;
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
    .bottomBox {
      position: absolute;
      bottom: 0px;
      left: 50%;
      color: #999999;
      text-align: center;
      width: 301px;
      margin-left: -150px;
      line-height: 20px;
      a {
        color: #999999;
      }
    }
    // img {
    //   width: 782px;
    //   height: 602px;
    //   margin-right: 100px;
    // }
    .loginContent {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -260px 0 0 -172px;
      width: 344px;
      height: 520px;
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
            border-radius: 2px;
            border: 1px solid #dcdcdc;
            height: 44px;
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
            top: 0;
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
        color: #00a3ff;
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

// .login-register-btn {
//   margin: 32px 0 10px !important;
// }

@media screen and (max-width: 1440px) {
  .container {
    // header {
    //   height: 70px;
    // }
    .content {
      // height: calc(100% - 100px);
      // display: flex;
      // justify-content: space-around;
      // align-items: center;
      // img {
      //   width: 617px;
      //   height: 492px;
      //   margin-right: 0px;
      // }
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
  position: relative;
  height: 100vh;
  // max-width: 820px;
  width: 820px;
  background: #fff;
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
    }
  }
}
</style>
