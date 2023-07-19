<template>
  <!-- 绑定货代商账号的弹窗 -->
  <a-modal
    v-model="visible"
    max-width="500px"
    :title="$t('packages.bingdingHuodai')"
    @ok="handleSave"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item
        :label="$t('packages.huodaiMiyao')"
        prop="forwarderKey"
        v-if="params.thirdPartyCode == null"
      >
        <a-input v-model="form.forwarderKey" />
      </a-form-model-item>
      <a-form-model-item
        :label="$t('packages.account')"
        prop="account"
        v-if="params.thirdPartyCode != null"
      >
        <a-input v-model="form.account" />
      </a-form-model-item>
      <a-form-model-item
        :label="$t('packages.password')"
        prop="password"
        v-if="params.thirdPartyCode != null"
      >
        <a-input v-model="form.password" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import Package from '@/api/package'
export default {
  props: {
    params: {
      type: Object,
      default: () => {
        return {
          thirdPartyCode: null
        }
      }
    }
  },
  data() {
    return {
      visible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        forwarderKey: null,
        password: null,
        account: null
      },
      rules: {
        account: [
          {
            required: true,
            message: '请输入账号'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码'
          }
        ],
        forwarderKey: [
          {
            required: true,
            message: '请输入密钥'
          }
        ]
      }
    }
  },
  watch: {
    params: {
      handler(payload) {
        let { visible } = payload
        this.visible = visible
        this.form.forwarderKey = null
      }
    }
  },

  methods: {
    handleSave() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(valid)
          let { thirdPartyCode } = this.params
          if (!thirdPartyCode) {
            this.bindForwarder()
          } else {
            this.loginPackage()
          }
        } else {
          console.error('error submit!!')
          return false
        }
      })
    },
    loginPackage() {
      let { account, password } = this.form
      let params = {
        loginType: this.params.thirdPartyCode,
        userName: account,
        userPwd: password,
        id: this.params.forwarderId
      }

      Package.loginPackage(params).then((res) => {
        if (res.code == 0) {
          this.successAlert(this.$t('packages.succeAlert'))
          this.visible = false
          this.form.forwarderKey = ''
          this.$emit('finish')
        }
      })
    },
    bindForwarder() {
      let params = {
        forwarderKey: this.form.forwarderKey,
        id: this.params.forwarderId
      }
      Package.bindForwarder(params).then((res) => {
        if (res.code == 0) {
          this.successAlert(this.$t('packages.succeAlert'))
          this.visible = false
          this.$emit('finish')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
