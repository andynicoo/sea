<template>
  <a-modal
    :title="title"
    :visible="visible"
    :confirm-loading="confirmLoading"
    width="700px"
    @cancel="cancel"
  >
    <uni-form-model
      ref="formModel"
      :form-model-data="getFormModelData"
    ></uni-form-model>

    <!--      <template v-if='!showAPP'>-->
    <!--        <a-form-model-item :label="$t('packages.phoneNumber')">-->
    <!--          <a-input v-model='form.name' />-->
    <!--        </a-form-model-item>-->
    <!--        <a-form-model-item :label="$t('packages.phoneNumber')">-->
    <!--          <a-input v-model='form.name' />-->
    <!--        </a-form-model-item>-->
    <!--        <a-form-model-item :label="$t('packages.password')">-->
    <!--          <a-input v-model='form.name' />-->
    <!--        </a-form-model-item>-->
    <!--        <a-form-model-item :label="$t('packages.phone_verification')">-->
    <!--          <a-input-search placeholder='input search text' size='large' @search='sendcode'>-->
    <!--            <a-button type='primary' v-if='issend' slot='enterButton'>-->
    <!--              {{ $t('packages.get_verification_code') }}-->
    <!--            </a-button>-->
    <!--            <a-button v-if='!issend' disabled type='primary' slot='enterButton'>{{ count }}-->
    <!--              {{ $t('packages.again_after') }}-->
    <!--            </a-button>-->
    <!--          </a-input-search>-->
    <!--        </a-form-model-item>-->
    <!--      </template>-->

    <!--    </a-form-model>-->
    <template slot="footer">
      <a-button type="primary" @click="selectProvider" v-if="editType === 1">
        {{ $t('packages.Choose_service_provider') }}
      </a-button>
      <a-button type="primary" @click="cancel">
        {{ $t('packages.cancel') }}</a-button
      >
      <a-button type="primary" :loading="loading" @click="submit">
        {{ $t('packages.submit') }}</a-button
      >
    </template>
  </a-modal>
</template>

<script>
import UniFormModel from './UniFormModel'

const EDIT_TYPE = {
  ADD: 1,
  EDIT: 2
}
export default {
  components: { UniFormModel },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    confirmLoading: {
      type: Boolean,
      default: false
    },
    provider: {
      type: Object,
      default: null
    },
    editType: {
      type: Number,
      default: null
    }
  },
  watch: {
    provider(newVal, oldVal) {
      if (newVal['apiInfo'] != null) {
        console.log(newVal)
        this.form['apiInfo'] = newVal['apiInfo']
      } else {
        this.form['apiInfo'] = {}
      }
      this.form['customName'] = newVal['customName']
      // if (newVal['customName']= null) {
      //   this.form['customName'] = newVal['customName']
      //
      // }
    },
    editType(newVal, oldVal) {
      if (newVal == EDIT_TYPE.ADD) {
        this.title = this.$t('packages.authorizationAdd')
        // this.title = this.$t('packages.authorizationAdd')
      } else {
        this.title = this.$t('packages.authorizationEdit')
      }
    }
  },
  computed: {
    getFormModelData() {
      const formModelData = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        formItems: []
      }

      formModelData.formItems.push({
        key: 'serviceProviderName',
        label: this.$t('packages.serviceProvider'),
        data: this.provider === null ? '' : this.provider.serviceProviderName,
        type: 'input',
        disabled: true
      })
      formModelData.formItems.push({
        key: 'customName',
        label: this.$t('packages.customName'),
        data: this.provider.customName,
        type: 'input',
        disabled: false,
        rules: [{ required: true, message: 'Please input your note!' }]
      })

      // formModelData.formItems.push()
      if (this.provider.seaReqAuths != undefined) {
        var temp
        if (this.provider.apiInfo != undefined) {
          temp = this.provider.seaReqAuths.map((item) => {
            return {
              key: item.reqAuthCode,
              label: item.reqAuthCode,
              data: this.provider.apiInfo[item.reqAuthCode],
              type: 'input',
              disabled: this.editType == EDIT_TYPE.ADD ? false : true,
              isSlot: true
            }
          })
        } else {
          temp = this.provider.seaReqAuths.map((item) => {
            return {
              key: item.reqAuthCode,
              label: item.reqAuthCode,
              data: {},
              type: 'input',
              disabled: this.editType == EDIT_TYPE.ADD ? false : true,
              isSlot: true
            }
          })
        }
        formModelData.formItems.push(...temp)
      }
      formModelData.formItems.push({
        key: 'overseasSites',
        label: this.$t('packages.overseasWarehouse'),
        data: this.provider.overSeasStores,
        type: 'checkbox',
        disabled: true
      })
      console.log(formModelData)
      return formModelData
    }
  },
  data() {
    return {
      title: '',
      count: 30,
      time: false,
      issend: true,
      loading: false,
      showAPP: true,

      form: {
        apiInfo: {},
        authType: 2, // 授权类型 1:新账号注册开通,2:旧帐号授权开通
        seaSystemId: undefined
      },
      rules: {
        // name: [
        //   { required: true, message: 'Please input Activity name', trigger: 'blur' },
        //   { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
        // ],
        // region: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
        // date1: [{ required: true, message: 'Please pick a date', trigger: 'change' }],
        // type: [
        //   {
        //     type: 'array',
        //     required: true,
        //     message: 'Please select at least one activity type',
        //     trigger: 'change'
        //   }
        // ],
        // resource: [
        //   { required: true, message: 'Please select activity resource', trigger: 'change' }
        // ],
        // desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }]
      }
    }
  },
  methods: {
    clear() {
      this.form = {}
    },
    selectProvider() {
      this.$emit('selectProvider')
    },
    onSearch() {
      console.log(12321)
    },
    cancel() {
      // this.visible = false
      // this.clear()
      this.$emit('cancel', false)
    },
    submit() {
      const uniForm = this.$refs.formModel.uniForm
      this.form = uniForm
      if (this.editType == EDIT_TYPE.ADD) {
        this.form.seaSystemId = this.provider.seaSystemId
        this.form['authType'] = 2
      } else if (this.editType == EDIT_TYPE.EDIT) {
        this.form.empowerId = this.provider.empowerId
        this.form['authType'] = 1
      }

      const apiInfo = {}
      for (let key in uniForm) {
        this.provider.seaReqAuths.map((item) => {
          if (item.reqAuthCode == key) {
            apiInfo[key] = uniForm[key]
          }
        })
      }
      this.form.apiInfo = apiInfo

      const info = {
        type: this.editType,
        params: this.form
      }
      this.$emit('submit', info)
      // this.clear()
    },
    sendcode() {
      const TIME_COUNT = 30
      if (!this.timer) {
        this.count = TIME_COUNT
        this.issend = false
        //这里可以插入$axios调用后台接口
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.issend = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    }
  }
}
</script>

<style scoped></style>
