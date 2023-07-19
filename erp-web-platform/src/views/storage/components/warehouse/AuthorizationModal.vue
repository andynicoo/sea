<template style="width: 900px">
  <a-modal
    :title="$t('packages.newAuthorization')"
    :visible="authorizationVisible"
    :confirm-loading="confirmLoading"
    width="700px"
    @cancel="close()"
  >
    <uni-form-model
      :form-model-data="getFormModelData"
      @selectChange="selectChange"
    ></uni-form-model>
    <template slot="footer">
      <a-button type="primary" @click="close">
        {{ $t('packages.cancel') }}</a-button
      >
      <a-button type="primary" @click="oldUsers">
        {{ $t('packages.oldUsers') }}</a-button
      >
      <a-button
        type="primary"
        @click="newUsers"
        v-if="
          authorizationList.length > 0 &&
            form.providerIndex != '' &&
            authorizationList[form.providerIndex].authorizationType == 1
        "
      >
        {{ $t('packages.newUsers') }}</a-button
      >
    </template>
  </a-modal>
</template>
<script>
import UniFormModel from './UniFormModel'

export default {
  components: {
    UniFormModel
  },
  props: {
    authorizationVisible: {
      type: Boolean,
      default: false
    },
    confirmLoading: {
      type: Boolean,
      default: true
    },
    authorizationList: {
      type: Array,
      default: () => []
    },
    serviceProvider: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        name: '',
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        providerIndex: ''
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

      formModelData.formItems = [
        {
          key: 'providerIndex',
          label: this.$t('packages.serviceProvider'),
          data: this.serviceProvider,
          default:
            this.serviceProvider[this.form.providerIndex] == undefined
              ? ''
              : this.serviceProvider[this.form.providerIndex].name,
          type: 'select'
        },
        {
          key: 'serviceProviderIntroduction',
          label: this.$t('packages.introduction'),
          data: this.authorizationList[this.form.providerIndex]
            ? this.authorizationList[this.form.providerIndex]
                .serviceProviderIntroduction
            : '',
          type: 'span',
          if: this.form.providerIndex === '' ? false : true
        },
        {
          key: 'serviceProviderContacts',
          label: this.$t('packages.contactPerson'),
          data: this.authorizationList[this.form.providerIndex]
            ? this.authorizationList[this.form.providerIndex]
                .serviceProviderContacts
            : '',
          type: 'span',
          if: this.form.providerIndex === '' ? false : true
        },
        {
          key: 'serviceProviderPhone',
          label: this.$t('packages.phone'),
          data: this.authorizationList[this.form.providerIndex]
            ? this.authorizationList[this.form.providerIndex]
                .serviceProviderPhone
            : '',
          type: 'span',
          if: this.form.providerIndex === '' ? false : true
        },
        {
          key: 'overseasSites',
          label: this.$t('packages.overseasWarehouse'),
          data: this.authorizationList[this.form.providerIndex]
            ? this.authorizationList[this.form.providerIndex].overSeasStores
            : [],
          type: 'checkbox',
          if: this.form.providerIndex === '' ? false : true,
          disabled: true
        }
      ]
      return formModelData
    }
  },
  methods: {
    selectChange(value) {
      this.form.providerIndex = value
    },
    selectProvider(value) {
      this.form['providerIndex'] = value
    },
    close() {
      this.$emit('cancel', false)
    },
    newUsers() {
      this.$emit('newUsers', 1) //++++++++++++++++++
    },
    oldUsers() {
      const params = {
        type: 2,
        provider: this.authorizationList[this.form.providerIndex]
      }
      // this.form.providerIndex=undefined;
      this.$emit('oldUsers', params)
    }
  }
}
</script>

<style scoped>
.base {
  background-color: #409eff;
}

.base .ant-modal-root .ant-modal {
  width: 900px;
}
</style>
