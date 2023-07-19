<template>
  <div class="me-pa-2 user-password">
    <a-page-header
      class="me-page-header"
      :title="$t('member.xiugaimima')"
    ></a-page-header>
    <div class="custom-form">
      <a-row class="form-item">
        <a-col span="12">
          <input
            :value="userInfo.maAccount"
            disabled
            type="text"
            class="form-input"
          />
        </a-col>
      </a-row>

      <a-row class="form-item">
        <a-col span="12">
          <input
            v-model="forms.code"
            :placeholder="$t('member.inputcode')"
            autocomplete="new-password"
            @change="checkedCode"
            type="text"
            class="form-input"
          />
        </a-col>
        <a-col span="3" offset="1">
          <a-button @click="getCode" class="get-code" :loading="codeLoading">
            {{
              codeText
                ? $t('member.reget') + `(${codeText})`
                : $t('member.getcode')
            }}
          </a-button>
        </a-col>
        <a-col span="10" class="pa-0 pl-3 error-message">
          {{ errorMessage.code }}
        </a-col>
        <template v-show="humanVerifyVisible">
          <a-col span="4"></a-col>
          <a-col span="8">
            <HumanVerify
              :visible="humanVerifyVisible"
              ref="Human"
              @onSuccess="humanVerifySuccess"
            ></HumanVerify>
          </a-col>
        </template>
      </a-row>

      <a-row class="form-item">
        <a-col span="12">
          <input
            v-model="forms.password"
            :placeholder="$t('login.passwordMustBeValid')"
            autocomplete="new-password"
            @change="checkedPassword"
            :type="passwordVisible ? 'text' : 'password'"
            class="form-input"
          />
          <i
            class="iconfont eye-icon"
            :class="passwordVisible ? 'iconzhengyan' : 'iconbiyan'"
            @click="passwordVisible = !passwordVisible"
          ></i>
        </a-col>
        <a-col span="10" class="pa-0 pl-3 error-message">
          {{ errorMessage.password }}
        </a-col>
      </a-row>

      <a-row class="form-item">
        <a-col span="12">
          <input
            v-model="forms.newPassword"
            :placeholder="$t('member.string2')"
            autocomplete="new-password"
            @change="checkedNewPassword"
            :type="passwordVisible ? 'text' : 'password'"
            class="form-input"
          />
          <i
            class="iconfont eye-icon"
            :class="passwordVisible ? 'iconzhengyan' : 'iconbiyan'"
            @click="passwordVisible = !passwordVisible"
          ></i>
        </a-col>
        <a-col span="10" class="pa-0 pl-3 error-message">
          {{ errorMessage.newPassword }}
        </a-col>
      </a-row>

      <a-row class="form-item">
        <a-col>
          <a-button @click="onSubmit" type="primary">{{
            $t('member.sureEdit')
          }}</a-button>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Basic from '@/api/basic'
import HumanVerify from '@/components/HumanVerify'
import { PASSWORD } from '@/util/regex'
export default {
  components: {
    HumanVerify
  },
  data() {
    return {
      passwordVisible: false,
      humanVerifyVisible: false,
      items: [
        {
          text: this.$t('member.shouye'),
          disabled: true
        },
        {
          text: this.$t('member.geren'),
          disabled: true
        },
        {
          text: this.$t('member.xiugaimima'),
          disabled: false
        }
      ],
      codeText: 0,
      forms: {
        code: '',
        newPassword: '',
        password: ''
      },
      errorMessage: {
        code: '',
        newPassword: '',
        password: ''
      },
      codeLoading: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.$data.forms = {
        code: '',
        newPassword: '',
        password: ''
      }
      this.$data.errorMessage = {
        code: '',
        newPassword: '',
        password: ''
      }
    }, 100)
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.auth.userInfo
    })
  },
  methods: {
    /**
     * 校验验证码
     */
    checkedCode() {
      return new Promise((resolve, reject) => {
        const { code } = this.$data.forms
        if (code && code.length === 6) {
          this.$set(this.$data.errorMessage, 'code', '')
          resolve()
        } else {
          this.$set(this.$data.errorMessage, 'code', this.$t('member.string3'))
          reject(this.$t('member.string3'))
        }
      })
    },
    /**
     * 密码校验
     */
    checkedPassword() {
      return new Promise((resolve, reject) => {
        const { password } = this.$data.forms
        if (PASSWORD.test(password)) {
          this.$set(this.$data.errorMessage, 'password', '')
          resolve()
        } else {
          this.$set(
            this.$data.errorMessage,
            'password',
            this.$t('login.passwordMustBeValid')
          )
          reject(this.$t('login.passwordMustBeValid'))
        }
      })
    },
    /**
     * 确认密码校验
     */
    checkedNewPassword() {
      return new Promise((resolve, reject) => {
        const { newPassword, password } = this.$data.forms
        if (!newPassword) {
          this.$set(
            this.$data.errorMessage,
            'newPassword',
            this.$t('member.string5')
          )
          reject(this.$t('member.string5'))
        } else if (newPassword === password) {
          this.$set(this.$data.errorMessage, 'newPassword', '')
          resolve()
        } else {
          this.$set(
            this.$data.errorMessage,
            'newPassword',
            this.$t('member.string6')
          )
          reject(this.$t('member.string6'))
        }
      })
    },
    /**
     * 获取验证码
     */
    getCode() {
      if (this.$data.codeText !== 0) return
      this.$data.humanVerifyVisible = true
      this.codeLoading = true
      setTimeout(() => {
        this.$refs.Human.getAliValid()
      }, 500)
    },
    /**
     * 设置验证码倒计时
     */
    handleCodeText() {
      let time = 60
      let i = setInterval(() => {
        this.$data.codeText = time
        time--
        if (time === -1) {
          clearInterval(i)
        }
      }, 1000)
    },
    /**
     * 云片验证
     */
    humanVerifySuccess(validInfo) {
      this.$data.humanVerifyVisible = false
      let params = {
        data: validInfo.data,
        mobile: this.userInfo.maAccount,
        type: 3
      }
      if (validInfo.type == 'nc') {
        params = Object.assign(params, {
          sessionId: validInfo.sessionId,
          sig: validInfo.sig,
          token: validInfo.token,
          scene: validInfo.scene
        })
      }
      Basic.getSMSCode(params)
        .then(() => {
          this.$Message({
            type: 'success',
            content: this.$t('member.string7')
          })
          this.handleCodeText()
        })
        .finally(() => {
          this.codeLoading = false
        })
    },
    onSubmit() {
      Promise.all([
        this.checkedCode(),
        this.checkedPassword(),
        this.checkedNewPassword()
      ])
        .then(() => {
          Basic.changePassWord({
            ...this.$data.forms,
            account: this.userInfo.maAccount
          }).then(() => {
            this.$Message({
              type: 'success',
              content: this.$t('member.string8')
            })
            window._VV.$emit('SHOW_SNACKBAR', {
              text: window._VV.getLocalLang('prompt', 'logoutSuccess'),
              color: 'success'
            })
            window._VV.$store.commit('SET_ACCESS_TOKEN', null)
            window.location.reload('/auth')
          })
        })
        .catch(() => {
          console.log('error')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-password {
  background: #fff;
  height: calc(100vh - 80px);
  .custom-form {
    max-width: 850px;
    .form-item {
      width: 100%;
      .ant-col {
      }
    }
  }

  .get-code {
    height: 40px;
  }
}
.eye-icon {
  position: absolute;
  right: 8px;
  top: 8px;
}
</style>

<style lang="scss">
.user-password {
  #wrap {
    position: relative;
    transform: none;
    left: 0;
  }
}
</style>
