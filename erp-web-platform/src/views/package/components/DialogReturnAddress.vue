<template>
  <a-modal
    :title="$t('packages.returnsTitle')"
    :visible="dialogShow"
    @ok="handleOk('formRef')"
    @cancel="handleCancel"
    width="800px"
    :cancelText="$t('packages.cancelText')"
    :okText="$t('packages.okText')"
    :confirmLoading="confirmLoading"
  >
    <a-form-model
      :model="form"
      ref="formRef"
      :rules="rules"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-form-model-item :label="$t('packages.recipient')" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item :label="$t('packages.recipientTel')" prop="phone">
        <a-input v-model="form.phone" />
      </a-form-model-item>
      <a-form-model-item
        :label="$t('packages.recipientAddress')"
        prop="fullAddress"
      >
        <a-cascader
          :options="caseOptions"
          ref="cascader"
          :placeholder="$t('packages.pleaseChoose')"
          @change="onChange"
          :fieldNames="{
            children: 'children',
            label: 'name',
            value: 'name'
          }"
          v-model="form.codeAddress"
        />
        <a-textarea
          v-model="form.fullAddress"
          :placeholder="$t('packages.fullAddress')"
        />
      </a-form-model-item>
      <a-form-model-item :label="$t('packages.returnRemake')">
        <a-textarea v-model="form.remarks" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import Basic from '@/api/basic.js'
import Package from '@/api/package.js'
export default {
  props: {
    dialogShow: Boolean,
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        name: '',
        phone: '',
        fullAddress: '',
        codeAddress: [],
        remarks: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('packages.pleaseInputRecipient'),
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: this.$t('packages.pleaseInputRecipientTel'),
            trigger: 'blur'
          },
          {
            pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            message: this.$t('packages.pleaseInputSuccessTel'),
            trigger: 'change'
          }
        ],
        fullAddress: [
          {
            required: true,
            message: this.$t('packages.pleaseChooseAddress'),
            trigger: 'blur'
          }
        ]
      },
      caseOptions: [],
      confirmLoading: false
    }
  },
  methods: {
    handleOk(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.codeAddress.length === 0) {
            return this.errorAlert(this.$t('packages.pleaseChooseAddress'))
          } else if (this.form.fullAddress === '') {
            return this.errorAlert(this.$t('packages.pleaseChooseAddress'))
          } else {
            console.log(this.form)
            this.$data.confirmLoading = true
            const codeAddress = this.form.codeAddress.join('')
            const params = {
              ...this.info,
              returnGoodsReceivName: this.form.name,
              returnGoodsReceivTel: this.form.phone,
              retuenGoodsErpRemaks: this.form.remarks,
              returnGoodsReceivFullAddress: codeAddress + this.form.fullAddress
            }
            Package.returnGoods(params)
              .then((res) => {
                this
                if (res) {
                  this.successAlert(this.$t('packages.succeAlert'))
                  this.$emit('update:dialogShow', false)
                  this.$emit('success')
                }
              })
              .finally(() => {
                this.$data.confirmLoading = false
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      this.$emit('update:dialogShow', false)
    },
    onChange() {}
  },
  async mounted() {
    const res = await Basic.getArea()
    this.caseOptions = res ? res : []
  }
}
</script>
