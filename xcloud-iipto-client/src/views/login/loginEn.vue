<template>
  <div class="container">
    <header>
      <div class="headerContent">
        <img src="@/assets/images/login/logo.svg" alt="" />
      </div>
    </header>
    <div class="content">
      <img src="@/assets/images/login/login.png" alt="" />
      <div class="loginContent">
        <p class="title flex-around">
          <span v-if="loginType === 1 || loginType === 2" :class="{ active: loginType === 1 }" @click="changeType(1, 'loginForm')">Login</span>
          <span v-if="loginType === 1 || loginType === 2" :class="{ active: loginType === 2 }" @click="changeType(2, 'loginForm')">Code login</span>
          <span v-if="loginType === 3" class="active">Sign up</span>
          <span v-if="loginType === 4" class="active">Forget password</span>
        </p>
        <div class="box">
          <Form ref="loginForm" :model="loginForm" :rules="loginRule" inline>
            <FormItem prop="mobile" v-if="loginType === 1">
              <Input type="text" v-model="loginForm.mobile" placeholder="Enter Phone number"></Input>
            </FormItem>
            <FormItem prop="mobile" v-else>
              <Input type="text" autocomplete="off" v-model="loginForm.mobile" placeholder="Enter Phone number"></Input>
            </FormItem>
            <FormItem prop="password" v-if="loginType === 1">
              <Input type="password" v-model="loginForm.password" placeholder="Enter password"></Input>
            </FormItem>
            <FormItem v-if="loginType === 1">
              <sliding-validation scene="nc_login" ref="alidationModal" @validationData="getValidationData"></sliding-validation>
            </FormItem>
            <FormItem prop="code" v-if="loginType === 2 || loginType === 4 || loginType === 3">
              <Input type="number" autocomplete="off" v-model="loginForm.code" placeholder="Enter a verification code"></Input>
              <Button class="login-btn" @click="getVerificationCode(loginType)">{{ btLogin }}
              </Button>
              <div v-if="smsValidation">
                <div class="ivu-poptip-popper" style="
                    position: absolute;
                    will-change: top, left;
                    top: 24px;
                    left: 0px;
                    width: 100%;
                  " x-placement="bottom-end">
                  <div class="ivu-poptip-content">
                    <div class="ivu-poptip-arrow"></div>
                    <div class="ivu-poptip-inner">
                      <div class="ivu-poptip-title">
                        <div class="ivu-poptip-title-inner">
                          The slider validation
                          <img src="@/assets/images/common/close.png" @click="smsValidation = false" style="
                              width: 10px;
                              height: 10px;
                              cursor: pointer;
                              float: right;
                              margin-right: 0px;
                              margin-top: 5px;
                            " alt="" />
                        </div>
                      </div>
                      <div class="ivu-poptip-body" style="padding: 20px 16px">
                        <div class="ivu-poptip-body-content" style="overflow: hidden">
                          <div class="ivu-poptip-body-content-inner">
                            <sliding-validation scene="nc_message" @validationData="getValidationData"></sliding-validation>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FormItem>
            <FormItem prop="password" v-if="loginType === 4 || loginType === 3">
              <Input type="password" autocomplete="new-password" v-model="loginForm.password" placeholder="Enter password"></Input>
            </FormItem>
            <Radio v-model="agreementRadio" v-if="loginType === 4 || loginType === 3">
              <span style="font-size: 12px">Agree terms
                <a style="color: #169fe9" href="https://pro.itaxs.com/agreement.html" target="_blank">《The terms of service》</a>
              </span>
            </Radio>
            <FormItem>
              <Button type="primary" @click="handleSubmit(loginType, 'loginForm')">{{ loginBtnText }}</Button>
            </FormItem>
            <p class="flex-between" v-if="loginType === 3 || loginType === 4">
              <span>
                An existing account?
                <span style="color: #169fe9; cursor: pointer" @click="changeType(1, 'loginForm')">Login</span>
              </span>
            </p>
            <p class="flex-between" v-else>
              <span>
                No account？
                <span style="color: #169fe9; cursor: pointer" @click="changeType(3, 'loginForm')">GO</span>
              </span>
              <span style="color: #999999; cursor: pointer" @click="changeType(4, 'loginForm')">
                Forget password
              </span>
            </p>
          </Form>
        </div>
      </div>
      <p class="bottomBox">
        <a href="https://www.itaxs.com/agreement.html" target="_blank">User Agreement
        </a>
        <a href="https://www.itaxs.com/privacy.html" target="_blank">Privacy Policy</a>
        ICP certificate:
        <a href="http://beian.miit.gov.cn/">Yue ICP B No. 20016192-1</a>
        Copyright @ 2020 Itaxs
      </p>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import slidingValidation from '../../components/login/slidingValidation'
import {
  // eslint-disable-next-line no-unused-vars
  getYzm,
  // eslint-disable-next-line no-unused-vars
  register,
  // eslint-disable-next-line no-unused-vars
  loginPass,
  // eslint-disable-next-line no-unused-vars
  loginClient,
  loginYzm,
  getPass,
  // bind
  // eslint-disable-next-line no-unused-vars
  callbackSellerOS,
  // eslint-disable-next-line no-unused-vars
  bindSellerOS,
  // eslint-disable-next-line no-unused-vars
  getSellerToken,
  inviteRegister,
  // eslint-disable-next-line no-unused-vars
  getImgCodeApi,
  getQRcode,
  estimateLogin,
  bindTel,
  slidingPWLogin,
  slidingSMSLogin
} from '@/api/login/login'
export default {
  data () {
    return {
      loginForm: {
        password: '',
        code: '',
        mobile: ''
      },
      imgCodeSrc: '',
      codeKey: '',
      loginType: 2,
      loginBtnText: 'Login',
      ifClick: false,
      smsValidation: false,
      btLogin: 'Click',
      validationDataObj: {},
      agreementRadio: '',
      loginRule: {
        user: [
          {
            required: true,
            message: 'Enter account name',
            trigger: 'blur',
            type: 'string'
          }
        ],
        mobile: [
          {
            required: true,
            message: 'Enter Phone number',
            trigger: 'blur',
            type: 'string'
          }
        ],
        password: [
          {
            required: true,
            message: 'Enter password',
            trigger: 'blur',
            type: 'string'
          }
        ],
        imgCode: [
          {
            required: true,
            message: 'Enter the graphic verification code',
            trigger: 'blur',
            type: 'string'
          }
        ],
        code: [
          {
            required: true,
            message: 'Enter a verification code',
            trigger: 'blur',
            type: 'string'
          }
        ],
        agreement: [
          {
            required: true,
            message: 'Please agree to the terms of service',
            trigger: 'blur',
            type: 'string'
          }
        ]
      },
      isQRLogin: false,
      wxQRcode: '',
      timer: 60,
      isStale: false,
      bindPhone: false,
      qrStatus: 0
    }
  },
  components: {
    slidingValidation: slidingValidation
  },
  methods: {
    toIndex () {
      let href = 'https://www.itaxs.com/'
      window.location.href = href
    },
    changeType (type, name) {
      this.loginType = type
      switch (type) {
        case 3:
          this.loginBtnText = 'Sign up'
          break
        case 4:
          this.loginBtnText = 'Enter'
          break
        default:
          this.loginBtnText = 'Login'
          break
      }
      this.validationDataObj = {}
      this.loginForm = {}
    },
    // 登录
    handleSubmit (type, name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (JSON.stringify(this.validationDataObj) === '{}') {
            this.$Message.error('Please swipe to verify first')
            return
          }
          switch (type) {
            case 1:
              this.passwordLogin()
              break
            case 2:
              this.changeLogin()
              break
            case 3:
              this.inviteReg()
              break
            case 4:
              this.handleForget()
              break
            case 5:
              this.QRLoginFun()
              break
          }
        }
      })
    },
    // 密码登录限注册成功后调用
    passwordLogin () {
      let obj = {
        mobile: this.loginForm.mobile,
        password: this.loginForm.password
      }
      obj = { ...obj, ...this.validationDataObj }
      slidingPWLogin(obj)
        .then((res) => {
          if (res.code === 0) {
            this.$Message.success('Login successful')
            localStorage.setItem('token', res.data.token) // save local
            localStorage.setItem('sessionId', res.data.sessionId)

            Cookies.set('token', res.data.token);
            Cookies.set('sessionId', res.data.sessionId);

            // window.location.href = "/myBrand";
            this.$store.commit('saveLogin', true)
            this.$router.push('/myBrand')
            location.reload()
          } else {
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          this.$refs.alidationModal.refresh()
          this.validationDataObj = {}
        })
        .finally(() => {})
    },
    // send code
    getGeetest (type) {
      let self = this
      if (self.ifClick) return
      self.verificationCodeCount = 120
      let params = {
        mobile: self.loginForm.mobile,
        signSource: 2,
        type: type
      }
      params = { ...params, ...this.validationDataObj }
      slidingSMSLogin(params)
        .then(
          (res) => {
            if (res.code === 0) {
              self.$Message.success('SMS sent successfully')
              self.verificationCodeTimer = setInterval(() => {
                if (self.verificationCodeCount === 0) {
                  self.btLogin = 'Click'
                  clearInterval(self.verificationCodeTimer)
                  self.ifClick = false
                } else {
                  self.ifClick = true
                  self.verificationCodeCount--
                  self.btLogin = `Click again (${self.verificationCodeCount})`
                }
              }, 1000)
            } else {
              self.ifClick = false
            }
          },
          // eslint-disable-next-line handle-callback-err
          (err) => {
            // eslint-disable-next-line no-unused-expressions
            self.$refs.alidationModal.validationFun
            // this.$Message.error(err.message);
            self.ifClick = false
          }
        )
        .finally(() => {
          self.ifClick = false
        })
    },
    // 发送验证码
    getVerificationCode (type) {
      if (this.ifClick) return
      this.smsValidation = !this.smsValidation
      this.loginType = type
    },
    // login
    changeLogin () {
      let obj = {}
      obj = {
        code: this.loginForm.code,
        mobile: this.loginForm.mobile
      }
      loginYzm(obj)
        .then(
          (res) => {
            if (res.code === 0) {
              this.$Message.success('Login successful')
              localStorage.setItem('token', res.data.token) // save local
              localStorage.setItem('sessionId', res.data.sessionId)
              this.$router.push('/myBrand')
              location.reload()
              this.$store.commit('saveLogin', true)
            } else {
              this.$Message.error(res.message)
            }
          },
          (err) => {
            this.$refs.alidationModal.refresh()
            this.$Message.error(err.message)
          }
        )
        .finally(() => {})
    },
    // 有邀请码的注册
    inviteReg () {
      if (this.agreementRadio === '') {
        this.$Message.error('Please select protocol')
        return
      }
      let invitedCode = localStorage.getItem('invitedCode')
      let promteCode = localStorage.getItem('promteCode')
      let obj = {}
      if (promteCode == null) {
        obj = {
          mobile: this.loginForm.mobile,
          password: this.loginForm.password,
          smsCode: this.loginForm.code,
          inviteCode: invitedCode
        }
      } else if (invitedCode == null) {
        obj = {
          mobile: this.loginForm.mobile,
          password: this.loginForm.password,
          smsCode: this.loginForm.code,
          promteCode: promteCode
        }
      }
      obj = { ...obj, ...this.validationDataObj }
      inviteRegister(obj)
        .then((res) => {
          if (res.code === 0) {
            this.$Message.success('注册成功')
            this.changeType(1, 'loginForm')
          } else {
            this.$Message.error(res.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          this.$refs.alidationModal.refresh()
        })
    },
    // 找回密码
    handleForget (name) {
      if (this.agreementRadio === '') {
        this.$Message.error('Please select protocol')
        return
      }
      // eslint-disable-next-line no-unused-vars
      let self = this
      let obj = {
        code: this.loginForm.code,
        mobile: this.loginForm.mobile,
        newPassword: this.loginForm.password
      }
      obj = { ...obj, ...this.validationDataObj }
      getPass(obj)
        .then(
          (res) => {
            // console.log(res);
            if (res.code === 0) {
              this.$Message.success(
                'The new password has been set successfully, please'
              )
              this.changeType(1, 'loginForm')
            } else {
              this.$Message.error(res.message)
            }
          },
          (err) => {
            this.$refs.alidationModal.refresh()
            this.$Message.error(err.message)
          }
        )
        .finally(() => {})
    },
    // 微信二维码绑定调用
    QRLoginFun () {
      let invitedCode = localStorage.getItem('invitedCode')
      let promteCode = localStorage.getItem('promteCode')
      let data = {
        mobile: this.loginForm.mobile,
        mobileCode: this.loginForm.code,
        password: this.loginForm.password,
        ticket: this.getUrlParam('ticket', this.wxQRcode)
      }
      if (promteCode == null) {
        data = {
          mobile: this.loginForm.mobile,
          mobileCode: this.loginForm.code,
          password: this.loginForm.password,
          ticket: this.getUrlParam('ticket', this.wxQRcode),
          inviteCode: invitedCode
        }
      } else if (invitedCode == null) {
        data = {
          mobile: this.loginForm.mobile,
          mobileCode: this.loginForm.code,
          password: this.loginForm.password,
          ticket: this.getUrlParam('ticket', this.wxQRcode),
          promteCode: promteCode
        }
      }

      bindTel(data).then((res) => {
        if (res.code === 0) {
          if (res.data.status === 1) {
            this.loginSuccess(res.data.loginTokenVo)
          }
        }
      })
    },
    // 登陆成功跳转
    loginSuccess (data) {
      localStorage.setItem('token', data.token) // save local
      localStorage.setItem('sessionId', data.sessionId)
      // window.location.href = "/myBrand";
      this.$store.commit('saveLogin', true)
      this.$router.push('/myBrand')
      location.reload()
    },
    // 获取url链接
    getQueryVariable (variable) {
      var query = window.location.search.substring(1)
      var vars = query.split('&')
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] === variable) {
          return decodeURIComponent(pair[1])
        }
      }
      return false
    },
    // 获取微信登录二维码
    getwxQRcodeFun () {
      // eslint-disable-next-line no-unused-vars
      const self = this
      getQRcode().then((res) => {
        if (res.code === 0) {
          this.wxQRcode = res.data
          this.countdown()
          this.officeAccountState()
        }
      })
    },
    // 二维码过期倒计时
    countdown () {
      const self = this
      self.clearTimer = setInterval(() => {
        if (self.timer === 0) {
          clearInterval(self.clearTimer)
          self.isStale = true
        } else {
          self.isStale = false
          self.timer--
        }
      }, 1000)

      self.AccountTimer = setInterval(() => {
        if (self.timer === 0) {
          clearInterval(self.AccountTimer)
        } else {
          if (self.qrStatus === 3 || self.qrStatus === 1 || !this.isQRLogin) {
            clearInterval(self.AccountTimer)
          } else {
            this.officeAccountState()
          }
        }
      }, 2000)
    },
    // 微信二维码登录并获取二维码
    changeLoginType () {
      this.isQRLogin = true
      this.getwxQRcodeFun()
      this.timer = 60
    },
    // 获取公众号登录接口
    officeAccountState () {
      let data = { ticket: this.getUrlParam('ticket', this.wxQRcode) }
      estimateLogin(data).then((res) => {
        if (res.code === 0) {
          this.qrStatus = res.data.status
          if (res.data.status === 3) {
            this.bindPhone = true
          } else if (res.data.status === 1) {
            this.loginSuccess(res.data.loginTokenVo)
          }
        }
      })
    },
    // 获得tiket
    getUrlParam (params, url) {
      // eslint-disable-next-line no-unused-vars
      let value = ''
      let a = url.split('?')
      return (value = a[1].substr(7))
    },
    // 刷新二维码
    refreshCode () {
      this.isStale = false
      this.timer = 60
      this.getwxQRcodeFun()
    },
    getValidationData (data) {
      console.log('data', data)
      this.smsValidation = false
      this.validationDataObj = data
      if (JSON.stringify(this.loginForm) === '{}') {
        this.$Message.error('Please enter your mobile phone number')
        return
      }
      if (
        this.validationDataObj.scene === 'nc_message' &&
        this.loginType !== 1
      ) {
        switch (this.loginType) {
          case 2:
            this.getGeetest(2)
            break
          case 3:
            this.getGeetest(1)
            break
          case 4:
            this.getGeetest(3)
            break
          case 5:
            this.getGeetest(4) // 微信绑定
            break
        }
      }
    }
  },
  created () {
    let tokenl = localStorage.getItem('token')
    let sid = localStorage.getItem('sessionId')
    if (tokenl && sid) {
      this.$router.push('/myBrand')
      return
    }
    if (window.location.href.indexOf('loginType') > 0) {
      this.loginType = Number(this.getQueryVariable('loginType'))
      switch (this.loginType) {
        case 3:
          this.loginBtnText = 'registered'
          break
        case 4:
          this.loginBtnText = 'complete'
          break
        default:
          this.loginBtnText = 'Login'
          break
      }
    }
  },
  mounted () {}
}
</script>

<style lang="less" scoped>
// /deep/ .ivu-radio-inner:after{
//     left: 4px;
//     top: 4px;
// }
/deep/ .ivu-radio-wrapper {
  margin-bottom: 5px;
}
.container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  left: 0px;
  top: 0px;
  header {
    height: 120px;
    background: #ffffff;
    display: flex;
    align-items: center;
    .headerContent {
      max-width: 1440px;
      width: 100%;
      margin: auto;
      display: flex;
      align-items: center;
      img {
        width: 182px;
        height: 50px;
        cursor: pointer;
      }
      span {
        font-size: 18px;
        font-weight: normal;
        color: #00a3ff;
        line-height: 14px;
        margin-top: 10px;
        margin-left: 25px;
      }
    }
  }
  .content {
    height: calc(100% - 120px);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: #eaf5f9;
    overflow: hidden;
    .bottomBox {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      color: #999999;
      a {
        color: #999999;
      }
    }
    img {
      width: 782px;
      height: 602px;
      margin-right: 100px;
    }
    .loginContent {
      width: 574px;
      min-width: 574px;
      height: 560px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      padding: 90px 67px 110px;
      position: relative;
      .login-logo {
        position: absolute;
        right: 10px;
        top: 10px;
        width: 70px;
        height: 70px;
        img {
          cursor: pointer;
          width: 100%;
          height: 100%;
        }
      }
      .title {
        margin-bottom: 30px;
        span {
          height: 20px;
          font-size: 20px;
          font-weight: 500;
          color: rgba(153, 153, 153, 1);
          line-height: 20px;
          cursor: pointer;
        }
        span.active {
          color: #333333;
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
            border-radius: 0px;
            border: none;
            border-bottom: 1px solid #dcdee2;
          }
          input.ivu-input:-internal-autofill-selected {
            background-color: white !important;
            background-image: none !important;
            color: rgb(0, 0, 0) !important;
            box-shadow: inset 0 0 0 1000px white !important;
          }
          .ivu-btn {
            width: 100%;
            height: 52px;
            background: #00a3ff;
            box-shadow: 0px 2px 12px 0px rgba(13, 107, 207, 0.3);
            border-radius: 4px;
          }
          .login-btn {
            width: 150px;
            height: 38px;
            background: #00a3ff;
            box-shadow: 0px 2px 4px 0px rgba(13, 107, 207, 0.16);
            border-radius: 4px;
            color: #ffffff;
            position: absolute;
            right: 0px;
            top: -14px;
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
      height: calc(100% - 100px);
      display: flex;
      justify-content: space-around;
      align-items: center;
      img {
        width: 617px;
        height: 492px;
        margin-right: 0px;
      }
      .loginContent {
        width: 474px;
        // height:460px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        // padding: 60px 57px 20px;
      }
    }
  }
}
</style>
