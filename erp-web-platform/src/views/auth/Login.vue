<template>
  <div class="auth-form-content">
    <a-spin :spinning="loading">
      <div class="header-title-wrap" style="margin-top: 70px">
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
                v-model.trim="accountForm.account"
                class="left-140"
                name="account"
                autocomplete="off"
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
              v-model.trim="accountForm.password"
              @keyup.enter="handleSubmit()"
              @input="inputValid"
              name="password"
              autocomplete="new-password"
            />
            <i
              class="iconfont eye-icon"
              :class="passwordVisible ? 'iconzhengyan' : 'iconbiyan'"
              @click="passwordVisible = !passwordVisible"
            ></i>
            <span class="error-msg" v-if="error.password">{{
              $t('login.passwordMustBeValid')
            }}</span>
          </div>
          <div class="form-control-item" v-show="humanVerifyVisible">
            <HumanVerify
              ref="Human"
              :visible="humanVerifyVisible"
              @onSuccess="humanVerifySuccess"
            />
          </div>
        </template>
        <!-- 短信验证码 -->
        <template v-if="loginType == 2">
          <div class="form-control-item">
            <input
              :placeholder="$t('login.phoneNumber')"
              v-model.trim="mobileCodeForm.mobile"
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
              v-model.trim="mobileCodeForm.mobileValidCode"
              autoComplete="off"
              @keyup.enter="handleSubmit()"
              name="mobileCode"
            />
            <span class="error-msg" v-if="error.code">{{
              $t('login.mobileCodeMustBeValid')
            }}</span>
            <a-button
              class="send-message-button"
              @click="sendMobileCode()"
              :disabled="sendCodeDisable"
              :loading="codeLoading"
              :class="{ outline: isToResend }"
            >
              {{ sendCodeText }}
            </a-button>
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
        <div class="agreement me-mt-5">
          <a-checkbox v-model="agreement"> </a-checkbox>
          我已阅读并同意
          <a href="/privacyagreement.html" target="_blank">
            《马六甲ERP隐私协议》
          </a>
          及
          <a href="/serviceagreement.html" target="_blank">
            《马六甲ERP服务协议》
          </a>
        </div>
        <div class="footer-label">
          <a
            @click="openPage('/auth/find-password')"
            style="margin-right: 12px"
            v-show="loginType == 1"
            >{{ $t('login.forgetPass') }}</a
          >
          <a @click="openPage('/auth/register')">{{ $t('login.register') }}</a>
        </div>
      </div>
    </a-spin>
    <a-modal
      title="提示"
      :visible="riskVisible"
      :maskClosable="false"
      @cancel="
        $store.commit('RISK_VISIBLE', false)
        loading = false
        resetCode()
      "
    >
      <h2 class="me-risk-title">系统检测您的账号存在风险,请进行二次验证</h2>
      <p class="me-risk-tips">
        已向你的手机{{ riskAccount && riskAccount.slice(0, 3) }}****{{
          riskAccount && riskAccount.substring(7)
        }}的手机发送一条验证码
      </p>
      <div class="me-riskCode">
        <a-input
          v-for="(item, index) in riskCodeList"
          :key="index"
          v-model="item.value"
          :maxLength="1"
          @change="(e) => riskChange(e, index)"
          :ref="'riskInput' + index"
        />
      </div>
      <template slot="footer">
        <a-button type="primary" @click="riskOk"> 确定 </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import authMixin from './mixins'
import CountrySelect from './CountrySelect'
import HumanVerify from '@/components/HumanVerify'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { PASSWORD, MOBILE } from '@/util/regex'
import { isDev } from '@/util'
import { mapState } from 'vuex'
const mobileValid = (value) => {
  let reg = MOBILE
  return reg.test(value)
}
// const passwordValid = (value) => PASSWORD.test(value)
const passwordValid = (value) =>
  /(?=.*[0-9])(?=.*[a-zA-Z])(?![^a-zA-Z0-9]).{6,30}/.test(value)
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
  computed: {
    ...mapState({
      riskVisible: (state) => state.auth.riskVisible
    })
  },
  created() {
    this.$store.commit('RISK_VISIBLE', false)
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
      },
      //风险账号
      riskAccount: '',
      //风险验证码
      riskCodeList: [
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' }
      ],
      agreement: false
    }
  },

  watch: {
    'mobileCodeForm.mobile': {
      handler(newVal) {
        this.sendCodeDisable = newVal ? false : true
      },
      immediate: true
    },
    '$store.state.auth.riskVisible'(newval, olval) {
      this.mobileCodeForm.mobile = this.riskAccount
      if (newval) {
        setTimeout(() => {
          this.sendMobileCode()
        }, 600)
      }
    }
  },

  mounted() {
    this.$store.commit('clearVars')
  },
  methods: {
    resetCode() {
      this.riskCodeList = [
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' }
      ]
    },
    //风险验证码填写
    riskChange(e, index) {
      if (this.riskCodeList[index].value == '' && index > 0) {
        this.$refs['riskInput' + (index - 1)][0].focus()
      } else if (!/\d/.test(this.riskCodeList[index].value)) {
        this.riskCodeList[index].value = ''
      } else if (/\d/.test(this.riskCodeList[index].value) && index < 5) {
        this.$refs['riskInput' + (index + 1)][0].focus()
      }
    },
    //风险验证确定
    riskOk() {
      let nullData = this.riskCodeList.filter((item) => item.value === '')
      if (nullData.length > 0) {
        this.$message.warning('请输入完整的验证码!')
      } else {
        let code = []
        this.riskCodeList.forEach((item) => {
          code += item.value
        })

        let formData = {
          account: this.riskAccount,
          mobileValidCode: code,
          type: 1,
          riskCertification: 'riskCertification'
        }

        // this.mobileCodeForm.mobileValidCode = this.code
        this.$store
          .dispatch('login', formData)
          .then(() => {
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    inputValid() {
      if (this.accountForm.password.length > 5) {
        this.handleValid()
      }
    },
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
          this.riskAccount = this.mobileCodeForm.mobile
        } else {
          this.riskAccount = this.accountForm.account
        }
        this.loading = true
        try {
          this.$store
            .dispatch('login', formData)
            .then(() => {
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } catch (error) {
          this.loading = false
        }
      }
    },

    changeLoginType(type) {
      this.loginType = type
      this.humanVerifyVisible = false
      this.resetErrorFlag()
    }
  }
}
</script>

<style lang="scss" scoped>
@import './auth-style.scss';

.me-riskCode {
  position: relative;
  min-height: 50px;

  input {
    float: left;
    width: 35px;
    height: 40px;
    border: 1px solid #ccc;
    margin-right: 10px;
    font-size: 16px;
    text-align: center;
  }
}

.me-risk-title {
  font-size: 16px;
}

.me-risk-tips {
  font-size: 12px;
  margin-bottom: 15px;
}

.agreement {
  a {
    color: #ff6b38;
  }
}
</style>
