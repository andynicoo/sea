<template>
  <div class="auth-form-content">
    <a-spin :spinning="loading">
      <div class="header-title-wrap" style="margin-top:70px">
        <span
          class="tab-item"
          :class="{ underline: loginType == 1 }"
          @click="changeLoginType(1)"
          >{{ $t('login.userPass') }}</span
        >
        <span
          class="tab-item"
          :class="{ underline: loginType == 2 }"
          @click="changeLoginType(2)"
          >{{ $t('login.mobileCode') }}</span
        >
      </div>
      <div class="form-control-content">
        <!-- 账号密码 -->
        <template v-if="loginType == 1">
          <div class="form-control-content">
            <div class="form-control-item">
              <input
                :placeholder="$t('login.username')"
                v-model="accountForm.account"
                class="left-140"
                name="account"
              />
              <CountrySelect v-model="checkedCountry" />
              <span class="error-msg" v-if="error.account">{{
                $t('login.enterPhoneNumber')
              }}</span>
            </div>
          </div>
          <div class="form-control-item">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              :placeholder="$t('login.enterLoginPassword')"
              v-model="accountForm.password"
              @keyup.enter="handleSubmit()"
              name="password"
            />
            <i
              class="iconfont  eye-icon"
              :class="passwordVisible ? 'iconzhengyan' : 'iconbiyan'"
              @click="passwordVisible = !passwordVisible"
            ></i>
            <span class="error-msg" v-if="error.password">{{
              $t('login.passwordMustBeValid')
            }}</span>
          </div>
        </template>
        <!-- 短信验证码 -->
        <template v-if="loginType == 2">
          <div class="form-control-item">
            <input
              :placeholder="$t('login.phoneNumber')"
              v-model="mobileCodeForm.mobile"
              class="left-140"
              name="account"
            />
            <span class="error-msg" v-if="error.mobile">{{
              $t('login.enterPhoneNumber')
            }}</span>
            <CountrySelect v-model="checkedCountry" />
          </div>
          <div class="form-control-item">
            <input
              :placeholder="$t('login.enterMobileCode')"
              v-model="mobileCodeForm.mobileValidCode"
              autoComplete="off"
              @keyup.enter="handleSubmit()"
              name="mobileCode"
            />
            <span class="error-msg" v-if="error.code">{{
              $t('login.mobileCodeMustBeValid')
            }}</span>
            <button
              class="send-message-button"
              @click="sendMobileCode()"
              :disabled="sendCodeDisable"
              :class="{ outline: isToResend }"
            >
              {{ sendCodeText }}
            </button>
          </div>

          <div class="form-control-item" v-show="humanVerifyVisible">
            <HumanVerify
              ref="Human"
              :visible="humanVerifyVisible"
              @onSuccess="humanVerifySuccess"
            />
          </div>
        </template>

        <div class="form-control-item button">
          <button
            class="submit-button"
            @click="handleSubmit()"
            :disabled="availableSubmit"
          >
            {{ $t('login.login') }}
          </button>
        </div>
        <!-- <div class="footer-label">
          <a
            href="/auth/find-password"
            style="margin-right:12px;color:#606166"
            v-show="loginType == 1"
            >{{ $t('login.forgetPass') }}</a
          >
          <a href="/auth/register">{{ $t('login.register') }}</a>
        </div> -->
      </div>
    </a-spin>
  </div>
</template>

<script>
import authMixin from '../auth/mixins'
import CountrySelect from './CountrySelect'
import HumanVerify from '@/components/HumanVerify'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { PASSWORD, MOBILE } from '@/util/regex'
import { isDev } from '@/util'
const mobileValid = (value) => {
  let reg = MOBILE
  return reg.test(value)
}
const passwordValid = (value) => PASSWORD.test(value)
export default {
  mixins: [authMixin, validationMixin],
  validations: {
    // email: { required, emailValid },
    accountForm: {
      account: {
        required,
        mobileValid
      },
      password: {
        required,
        passwordValid
      }
    },
    mobileCodeForm: {
      mobile: {
        required,
        mobileValid
      },
      mobileValidCode: {
        required
      }
    }
  },
  components: {
    CountrySelect,
    HumanVerify
  },
  data() {
    return {
      loginType: 1, //登录类型
      authType: 1, //用于标识发送验证码类型
      accountForm: {
        account: isDev ? window.atob('MTc3ODI1MjQ4NjI=') : '',
        password: isDev ? window.atob('ZXJwMTIzNDU2') : '',
        type: 2
      },
      mobileCodeForm: {
        mobile: null,
        mobileValidCode: null,
        type: 1
      },
      error: {
        account: false,
        password: false,
        mobile: false,
        code: false
      }
    }
  },

  watch: {
    'mobileCodeForm.mobile': {
      handler(newVal) {
        this.sendCodeDisable = newVal ? false : true
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    handleValid() {
      return new Promise((resolve) => {
        this.resetErrorFlag()
        // 产品要求一次只能弹一个错
        const passwordLogin = {
          account: this.$v.accountForm.account.required,
          password:
            this.$v.accountForm.password.required &&
            this.$v.accountForm.password.passwordValid
        }
        const mobileLogin = {
          mobile:
            this.$v.mobileCodeForm.mobile.required &&
            this.$v.mobileCodeForm.mobile.mobileValid,
          code: this.$v.mobileCodeForm.mobileValidCode.required
        }
        try {
          if (this.loginType == 1) {
            Object.keys(passwordLogin).forEach((key) => {
              if (!passwordLogin[key]) {
                this.error[key] = true
                throw Error(`${[key]}错误`)
              }
            })
            console.log('表单校验成功')
            resolve(true)
          } else {
            Object.keys(mobileLogin).forEach((key) => {
              if (!mobileLogin[key]) {
                this.error[key] = true
                throw Error(`${[key]}错误`)
              }
            })
            console.log('表单校验成功')
            resolve(true)
          }
        } catch (error) {
          console.warn('表单校验失败', error)
          resolve(false)
        }
      })
    },

    async handleSubmit() {
      let isValid = await this.handleValid()
      if (isValid) {
        let formData =
          this.loginType == 1 ? this.accountForm : this.mobileCodeForm
        if (this.loginType == 2) {
          formData.account = formData.mobile
          formData.code = formData.mobileValidCode
        }
        this.getOauth(formData)
      }
    },

    changeLoginType(type) {
      this.loginType = type
      this.humanVerifyVisible = false
      this.resetErrorFlag()
    },
    async getOauth(obj) {
      let { redirect_url } = this.$route.query
      this.loading = true
      const params = Object.assign({ redirect_url: redirect_url }, obj)
      this.$store
        .dispatch('login', params)
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './auth-style.scss';
</style>
