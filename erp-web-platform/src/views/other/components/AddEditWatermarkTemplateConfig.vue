<template>
  <a-form :form="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
    <a-form-item :label="$t('marketingWatermark.templatename')">
      <a-input
        :maxLength="20"
        v-decorator="['templateName', { rules: templateNameRules }]"
      />
    </a-form-item>
    <a-form-item :label="$t('marketingWatermark.templatescope')" required>
      <a-radio-group
        v-decorator="[
          'templateScope',
          { rules: templateScopeRules, initialValue: 1 }
        ]"
      >
        <a-radio
          v-for="option in scopedOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </a-radio>
      </a-radio-group>
    </a-form-item>
    <!-- <a-form-item :label="$t('marketingWatermark.starttime')">
      <a-date-picker
        inputReadOnly
        :showToday="false"
        style="width: 100%"
        show-time
        v-decorator="['startTime', { rules: startTimeRules }]"
      />
    </a-form-item>
    <a-form-item :label="$t('marketingWatermark.endtime')">
      <a-date-picker
        inputReadOnly
        :showToday="false"
        style="width: 100%"
        show-time
        v-decorator="['endTime', { rules: endTimeRules }]"
      />
    </a-form-item> -->
  </a-form>
</template>

<script>
import moment from 'moment'
import Goods from '@/api/goods'
import Basic from '@/api/basic'
import { base64ToFile } from '@/util/canvas'

export default {
  props: {
    currentId: Number,
    tmpObject: String,
    tmpDataUrl: String
  },
  data() {
    const scopedOptions = [
      { label: this.$t('marketingWatermark.optopns1'), value: 1 },
      { label: this.$t('marketingWatermark.optopns2'), value: 2 }
    ]
    return {
      form: this.$form.createForm(this),
      templateNameRules: [
        { required: true, message: this.$t('marketingWatermark.valid1') },
        { max: 20, message: this.$t('marketingWatermark.valid4') }
      ],
      templateScopeRules: [
        { required: true, message: this.$t('marketingWatermark.valid2') }
      ],
      startTimeRules: [],
      endTimeRules: [{ validator: this.validatorEndTimeRules }],
      scopedOptions,
      templateDetail: null
    }
  },
  mounted() {
    const { form } = this.$data
    const { currentId } = this.$props
    if (!currentId) return
    Goods.getWatermarkTemplateById(currentId).then(({ data }) => {
      this.$data.templateDetail = data
      let { templateName, templateScope, startTime, endTime } = data
      templateScope = JSON.parse(templateScope)
      form.setFieldsValue({ templateName, templateScope, startTime, endTime })
    })
  },
  methods: {
    validatorEndTimeRules(rule, value, callback) {
      const { form } = this.$data
      const startTime = form.getFieldValue('startTime')
      if (moment(startTime) > moment(value)) {
        callback(this.$t('marketingWatermark.valid3'))
        return
      }
      callback()
    },
    submit() {
      const { form, templateDetail } = this.$data
      const { tmpObject, tmpDataUrl } = this.$props
      return new Promise((resolve, reject) => {
        form
          .validateFields()
          .then(async (data) => {
            if (templateDetail) {
              data.templateId = templateDetail.templateId
            }
            if (tmpObject) {
              data.templateProperty = JSON.stringify(tmpObject)
            }
            if (tmpDataUrl) {
              const file = base64ToFile(tmpDataUrl)
              let formData = new FormData()
              formData.append('file', file)
              const imgRes = await Basic.handleUploadImages(formData)
              data.cover = imgRes.data[0]
            }
            data.templateScope = JSON.stringify(data.templateScope)
            /**0：自定义水印，1：系统水印 */
            data.templateType = 0
            if (templateDetail) {
              await Goods.setWatermarkTemplateById(data)
            } else {
              await Goods.addWatermarkTemplate(data)
            }
            resolve()
          })
          .catch((error) => {
            console.error(error)
            reject()
          })
          .finally(() => {})
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>