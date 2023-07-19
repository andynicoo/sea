<template>
  <div class="auth-form-content">
    <a-spin :spinning="loading">
      <div class="header-title-wrap">
        <p class="underline">{{ $t('login.register') }}</p>
      </div>
      <div class="form-control-content">
        <div class="form-control-item">
          <input
            :placeholder="$t('login.phoneNumber')"
            class="left-140"
            v-model.trim="mobile"
            name="account"
            type="number"
          />
          <span class="error-msg" v-if="containsPaasowrdError.mobile">{{
            $t('login.enterPhoneNumber')
          }}</span>
          <CountrySelect v-model="checkedCountry" />
        </div>
        <div class="form-control-item">
          <input
            type="text"
            style="position:fixed;bottom:-99999px"
            name="mobileCode"
          />
          <input
            :placeholder="$t('login.enterMobileCode')"
            v-model.trim="mobileValidCode"
            autocomplete="off"
            name="registerSmsCode"
          />
          <span class="error-msg" v-if="containsPaasowrdError.code">{{
            $t('login.mobileCodeMustBeValid')
          }}</span>
          <a-button
            class="send-message-button"
            @click="sendMobileCode()"
            :loading="codeLoading"
            :disabled="sendCodeDisable"
            :class="{ outline: isToResend }"
          >
            {{ sendCodeText }}
          </a-button>
        </div>
        <div class="form-control-item">
          <input
            type="password"
            style="position:fixed;bottom:-99999px"
            name="password"
          />

          <a-popover placement="right">
            <template slot="content">
              <p>特殊符号为以下几种：. @$!%*#_~?&^{}【】\-+/|':;</p>
            </template>
            <input
              :type="passwordVisible ? 'text' : 'password'"
              :placeholder="$t('login.passwordSetting')"
              autocomplete="new-password"
              v-model.trim="password"
              @input="inputValid"
              name="password"
            />
          </a-popover>
          <i
            class="iconfont  eye-icon"
            :class="passwordVisible ? 'iconzhengyan' : 'iconbiyan'"
            @click="passwordVisible = !passwordVisible"
          ></i>
          <span class="error-msg" v-if="containsPaasowrdError.password">{{
            $t('login.passwordMustBeValid')
          }}</span>
        </div>
        <div class="form-control-item">
          <input
            type="tel"
            :placeholder="$t('login.invitationCode')"
            v-model.trim="invitationCode"
            :disabled="invitationCodeFlag"
          />
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
            @click="handleRegister()"
            :disabled="availableSubmit"
          >
            {{ $t('login.register') }}
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
          {{ $t('login.existAccount')
          }}<a @click="openPage('/auth/login')">{{ $t('login.goLogin') }}</a>
        </div>
      </div>
    </a-spin>
    <!-- 欢迎弹框 -->
    <div class="register-welcome-modal" v-show="welcomeVisible">
      <div class="mask"></div>
      <transition name="slide">
        <div class="modal-content" v-show="welcomeVisible">
          <div class="large-title">欢迎注册马六甲账号</div>
          <div class="desc-title"><a-icon type="check-circle" />注册成功</div>
          <div class="qr-code-wrap">
            <img src="@/assets/images/wechat-code-4.png" alt="" />
          </div>
          <p>
            微信扫描以上二维码，免费获得店铺运营资料包及大卖交流机会
          </p>
          <button @click="$router.push('/overview')">进入马六甲ERP</button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import authMixin from './mixins'
import CountrySelect from './CountrySelect'
import HumanVerify from '@/components/HumanVerify'
import { mapState } from 'vuex'
export default {
  mixins: [authMixin],
  components: {
    CountrySelect,
    HumanVerify
  },
  data() {
    return {
      mobile: '',
      password: '',
      mobileValidCode: '',
      invitationCode: '', //邀请码
      authType: 2,
      welcomeVisible: false,
      invitationCodeFlag: false,
      agreement: false
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
  computed: {
    ...mapState({
      erpToken: (state) => state.auth.access_token
    })
  },
  mounted() {
    this.$data.invitationCode = this.$route.query.invitationCode
    if (this.$route.query.invitationCode) {
      this.invitationCodeFlag = true
    }
    // 从sessionStorage拿邀请码
    if (sessionStorage.getItem('invitationCode')) {
      this.invitationCodeFlag = true
      this.invitationCode = sessionStorage.getItem('invitationCode')
    }
    // 如果是从官网来的且token存在就重定向到首页
    if (this.erpToken && this.invitationCode == 'emalacca') {
      this.$router.push('/overview')
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
    async handleRegister() {
      let isValid = await this.handleSubmitOfPassword()
      //验证通过
      if (isValid) {
        this.loading = true
        let params = {
          mobile: this.mobile,
          mobileCode: this.mobileValidCode,
          password: this.password,
          invitationCode: this.invitationCode,
          prefixCode: this.prefixCode,
          needWelcome: !this.invitationCode && this.invitationCode != 'emalacca' //自然注册的需要欢迎一下,官网来的也要欢迎
        }

        this.$store
          .dispatch('register', params)
          .then(() => {
            this.loading = false
            if (params.needWelcome) {
              this.welcomeVisible = true
            }
          })
          .catch(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scope>
@import './auth-style.scss';

.slide-enter-active {
  animation-name: slideShow;
  animation-duration: 0.4s;
  animation-fill-mode: both;
}

.slide-leave-active {
  animation-name: slideOutDown;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}

@keyframes slideShow {
  0% {
    transform: translate3d(0, -50%, 0) scale(0.5);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@keyframes slideOutDown {
  0% {
    transform: translateZ(0);
  }

  to {
    visibility: hidden;
    transform: translate3d(0, 100%, 0);
  }
}

.delay-leave-active {
  -webkit-animation-delay: 0.2s;
  -moz-animation-delay: 0.2s;
  -o-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.agreement {
  a {
    color: #ff6b38;
  }
}
</style>
