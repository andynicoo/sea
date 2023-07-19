import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { PASSWORD, MOBILE, CHINA_MOBILE } from '@/util/regex'

const mobileValid = (value) => MOBILE.test(value)
const passwordValid = (value) => PASSWORD.test(value)
export default {
  mixins: [validationMixin],
  validations: {
    mobile: { required, mobileValid },
    password: { required, passwordValid },
    mobileValidCode: { required }
  },
  data() {
    return {
      checkedCountry: {
        label: this.$t('common.CN'),
        code: '86'
      },
      loading: false,
      countNum: 60, //倒计时标记
      sendCodeText: this.$t('login.sendCode'),
      sendCodeDisable: false, //禁用发送验证码
      isToResend: false, //是否重新获取验证码
      humanVerifyVisible: false, //人机验证可见
      // 找回密码和注册表单校验适用
      containsPaasowrdError: {
        mobile: false,
        code: false,
        password: false
      },
      passwordVisible: false,
      codeLoading: false
    }
  },
  computed: {
    //主按钮是否可点击
    availableSubmit() {
      if (this.authType == 1) {
        if (this.loginType == 1) {
          return !(
            this.accountForm.account &&
            this.accountForm.password &&
            this.agreement
          )
        } else {
          return !(
            this.mobileCodeForm.mobile &&
            this.mobileCodeForm.mobileValidCode &&
            this.agreement
          )
        }
      } else {
        return !(
          this.mobile &&
          this.password &&
          this.mobileValidCode &&
          this.agreement
        )
      }
    }
  },

  mounted() {},

  methods: {
    //发送验证码操作
    sendMobileCode() {
      // 找回密码和注册验证手机号逻辑  如果是中国手机号就走下验证
      this.resetErrorFlag()
      // 需要验证中国手机号码的条件
      let needValidChinaMobile = this.checkedCountry.code == '86'
      // 当前页面的手机号字段
      const currentMobile =
        this.$data.mobile || this.$data.mobileCodeForm.mobile
      if (needValidChinaMobile && !CHINA_MOBILE.test(currentMobile)) {
        this.$data.containsPaasowrdError.mobile = true
        this.$data.error.mobile = true
        return false
      }
      // 非国内手机号只需要验证是否纯数字即可
      if (!needValidChinaMobile && !/^[0-9]*$/.test(Number(currentMobile))) {
        console.log('非国内手机号')
        this.$data.containsPaasowrdError.mobile = true
        this.$data.error.mobile = true
        return false
      }

      // 如果人机验证已打开 就不重复打开了
      if (this.humanVerifyVisible) {
        this.errorAlert(this.$t('login.completeVerification'))
        return false
      }
      this.$data.codeLoading = true
      this.initHumanVerify()
    },
    //开始计时
    setTimewait() {
      if (!this.$store.getters.getRiskVisible) {
        this.sendCodeDisable = true
        let txt = this.$t('login.resendAfter')
        let timer = setInterval(() => {
          this.countNum--
          this.sendCodeText = this.countNum + txt
          if (this.countNum == 0) {
            this.countNum = 60
            this.sendCodeText = this.$t('login.toResend')
            this.isToResend = true //重新发送
            this.sendCodeDisable = false
            clearInterval(timer)
          }
        }, 1000)
      }
    },
    //人机验证成功
    humanVerifySuccess(validInfo) {
      // 成功之后的回调
      this.humanVerifyVisible = false
      let mobile = this.authType == 1 ? this.mobileCodeForm.mobile : this.mobile
      let params = {
        data: validInfo.data,
        mobile: mobile,
        type: this.$store.getters.getRiskVisible ? 4 : this.authType,
        prefixCode: this.checkedCountry.code
      }
      if (validInfo.type == 'nc') {
        params = Object.assign(params, {
          sessionId: validInfo.sessionId,
          sig: validInfo.sig,
          token: validInfo.token,
          scene: validInfo.scene
        })
      }

      this.$store
        .dispatch('getSMSCode', params)
        .then((res) => {
          if (res.code == 0) {
            window._VV.successAlert(window._VV.$t('login.fiveMinutes'))
            this.setTimewait()
          } else {
            //开启滑块验证
            this.humanVerifyVisible = true
            setTimeout(() => {
              this.$refs.Human.getASlidliValid()
            }, 500)
          }
        })
        .finally(() => {
          this.codeLoading = false
        })
    },

    //初始化人机验证 无痕
    initHumanVerify() {
      setTimeout(() => {
        this.$refs.Human.getAliValid()
      }, 500)
    },

    // 找回密码和注册表单校验是一样的
    handleSubmitOfPassword() {
      return new Promise((resolve) => {
        this.resetErrorFlag()
        const validOptions = {
          mobile: this.$v.mobile.required && this.$v.mobile.mobileValid,
          code: this.$v.mobileValidCode.required,
          password: this.$v.password.required && this.$v.password.passwordValid
        }
        try {
          Object.keys(validOptions).forEach((key) => {
            if (!validOptions[key]) {
              this.containsPaasowrdError[key] = true
              throw Error(`${[key]}错误`)
            }
          })
          console.log('表单校验成功') // 走这里
          resolve(true)
        } catch (error) {
          console.warn(error, '表单校验失败')
          resolve(false)
        }
      })
    },
    handleSubmitOfSingle(validOptions) {
      return new Promise((resolve) => {
        this.resetErrorFlag()
        try {
          Object.keys(validOptions).forEach((key) => {
            if (!validOptions[key]) {
              this.containsPaasowrdError[key] = true
              throw Error(`${[key]}错误`)
            }
          })
          console.log('表单校验成功') // 走这里
          resolve(true)
        } catch (error) {
          console.warn(error, '表单校验失败')
          resolve(false)
        }
      })
    },

    //重置所有报错标记
    resetErrorFlag() {
      this.$data.error = {
        account: false,
        mobile: false,
        code: false,
        password: false
      }
      this.$data.containsPaasowrdError = {
        mobile: false,
        code: false,
        password: false
      }
    }
  }
}
