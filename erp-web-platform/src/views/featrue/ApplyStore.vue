<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" title="一键开店"> </a-page-header>
    <div
      class="apply-store-page"
      style="background:#fff;height:calc(100vh - 70px);padding-top:20px"
    >
      <a-form-model
        ref="ruleForm"
        style="width:600px"
        :model="applyForm"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          :label="$t('overView.companyName')"
          prop="companyName"
        >
          <a-input
            :placeholder="$t('overView.applyStorePla')"
            v-model.trim="applyForm.companyName"
            autocomplete="off"
          ></a-input>
        </a-form-model-item>

        <a-form-model-item :label="$t('overView.callName')" prop="contacts">
          <a-input
            v-model.trim="applyForm.contacts"
            :placeholder="$t('overView.callName')"
          ></a-input>
        </a-form-model-item>

        <a-form-model-item
          :label="$t('overView.connectPhone')"
          prop="contactsMode"
        >
          <a-input
            :placeholder="$t('overView.connectPhonePla')"
            v-model.trim="applyForm.contactsMode"
            type="number"
            autocomplete="off"
          ></a-input>
        </a-form-model-item>

        <a-form-model-item :label="$t('overView.email')" prop="email">
          <a-input
            :placeholder="$t('overView.emailPla')"
            v-model.trim="applyForm.email"
            @blur="$v.applyForm.email.$touch()"
          ></a-input>
        </a-form-model-item>

        <a-form-model-item :label="$t('overView.firstStore')" prop="site">
          <a-select v-model="applyForm.site">
            <a-select-option
              v-for="item in siteList"
              :key="item.value"
              :value="item.value"
              >{{ item.text }}</a-select-option
            >
          </a-select>
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="handleApplyStore">
            提交
          </a-button>
          <a-button style="margin-left: 10px;" @click="resetForm">
            重置
          </a-button>
        </a-form-model-item>
      </a-form-model>
      <div class="me-pa-2 me-status-error">
        温馨提示:
        <p>1.只针对首次开通跨境shopee店铺的用户</p>
        <p>
          2.需要准备的资料：营业执照+法人名字+店铺流水+电话号码+邮箱（营业执照需要未使用过的，公司执照可以不用店铺流水）
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Store from '@/api/store'
import { mapState } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { MOBILE } from '@/util/regex'
const emailValid = (value) => /.+@.+\..+/.test(value) //验证邮箱有效性
const mobileValid = (value) => MOBILE.test(value)
export default {
  mixins: [validationMixin],
  validations: {
    applyForm: {
      companyName: { required },
      contacts: { required },
      contactsMode: { required, mobileValid },
      email: { required, emailValid }
    }
  },
  data() {
    return {
      applyForm: {
        companyName: '', //公司名称
        contacts: '',
        contactsMode: '',
        email: '',
        site: 1
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      rules: {
        companyName: [
          {
            required: true,
            message: this.$t('overView.validError1'),
            trigger: 'blur'
          }
        ],
        contactsMode: [
          {
            required: true,
            message: this.$t('overView.validError2'),
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: this.$t('overView.validError3'),
            trigger: 'blur'
          }
        ],
        site: [{ required: true, message: '请选择首开站点', trigger: 'change' }]
      },

      siteList: [
        { value: 1, text: this.$t('overView.malai2') },
        { value: 2, text: this.$t('overView.taiwan2') }
      ]
    }
  },

  watch: {},

  computed: {
    ...mapState({
      userInfo: (state) => state.auth.userInfo
    })
  },

  mounted() {
    this.applyForm.memberId = this.userInfo.memberNO
  },

  methods: {
    handleApplyStore() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          Store.handleApplyStore(this.applyForm).then((res) => {
            if (res.code == 0) {
              this.resetForm()
              this.applyForm['site'] = 1
              this.successAlert(this.$t('overView.validError7'))
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style lang="scss"></style>
