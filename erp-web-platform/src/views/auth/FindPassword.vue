<template>
  <div class="auth-form-content">
    <a-spin :spinning="loading">
      <div class="header-title-wrap">
        <p class="underline">
          {{ $route.query.reset == 1 ? '重置密码' : $t('login.findPassword') }}
        </p>
      </div>
      <div class="form-control-content">
        <div class="form-control-item">
          <input
            type="number"
            :placeholder="$t('login.phoneNumber')"
            class="left-140"
            v-model.trim="mobile"
            name="account"
          />
          <span class="error-msg" v-if="containsPaasowrdError.mobile">{{
            $t('login.enterPhoneNumber')
          }}</span>
          <CountrySelect v-model="checkedCountry" />
        </div>
        <div class="form-control-item">
          <input
            :placeholder="$t('login.enterMobileCode')"
            v-model.trim="mobileValidCode"
            autocomplete="off"
            name="registerSmsCode"
          />
          <span class="error-msg" v-if="containsPaasowrdError.code">{{
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
        <div class="form-control-item">
          <input
            type="password"
            style="position:fixed;bottom:-99999px"
            name="password"
          />
          <input
            :type="passwordVisible ? 'text' : 'password'"
            :placeholder="$t('login.setNewPassword')"
            v-model.trim="password"
            @input="inputValid"
            name="password"
          />
          <i
            class="iconfont  eye-icon"
            :class="passwordVisible ? 'iconzhengyan' : 'iconbiyan'"
            @click="passwordVisible = !passwordVisible"
          ></i>
          <span class="error-msg" v-if="containsPaasowrdError.password">{{
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
        <div class="form-control-item button">
          <button
            class="submit-button"
            @click="handleConfirm()"
            :disabled="availableSubmit2"
          >
            {{ $t('login.confirmLogin') }}
          </button>
        </div>
        <div class="footer-label">
          {{ $t('login.existAccount')
          }}<a @click="openPage('/auth/login')">{{ $t('login.goLogin') }}</a>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import authMixin from './mixins'
import CountrySelect from './CountrySelect'
import HumanVerify from '@/components/HumanVerify'
export default {
  mixins: [authMixin],
  components: {
    CountrySelect,
    HumanVerify
  },

  data() {
    return {
      authType: 3,
      mobile: '',
      password: '',
      mobileValidCode: ''
    }
  },
  computed: {
    //主按钮是否可点击
    availableSubmit2() {
      if (this.authType == 1) {
        if (this.loginType == 1) {
          return !(this.accountForm.account && this.accountForm.password)
        } else {
          return !(
            this.mobileCodeForm.mobile && this.mobileCodeForm.mobileValidCode
          )
        }
      } else {
        return !(this.mobile && this.password && this.mobileValidCode)
      }
    }
  },
  watch: {
    mobile: {
      handler(newVal) {
        this.sendCodeDisable = newVal ? false : true
      },
      immediate: true
    }
  },
  mounted() {
    if (this.$route.query.reset == 1) {
      this.$message.warning('密码已过期，请重置密码!')
    }
  },
  methods: {
    inputValid() {
      // if (this.password.length > 7) {
      this.handleSubmitOfSingle({
        password: this.$v.password.required && this.$v.password.passwordValid
      })
      // }
    },
    async handleConfirm() {
      let isValid = await this.handleSubmitOfPassword()
      if (isValid) {
        this.loading = true
        let params = {
          account: this.mobile,
          code: this.mobileValidCode,
          password: this.password
        }
        this.$store
          .dispatch('findPwd', params)
          .then(() => {
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './auth-style.scss';
</style>
