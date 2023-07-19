<template>
  <a-form :form="form">
    <a-form-item>
      <a-textarea
        :autosize="{ minRows: 6 }"
        v-decorator="[
          'description',
          {
            rules: [
              { required: true, message: $t('batchEdit.descriptionValid') },
              {
                max: descriptionCount,
                message: `${$t('batchEdit.descriptionValid2', {
                  descriptioncount
                })}`
              }
            ]
          }
        ]"
      />
      <span class="text-count">
        {{ DescriptionCount() }}
      </span>
    </a-form-item>
    <a-form-item>
      <a-radio-group v-decorator="['type', { initialValue: 0 }]">
        <a-radio :value="0">{{ $t('batchEdit.replaceAll') }}</a-radio>
        <a-radio :value="1">{{ $t('batchEdit.appendBefore') }}</a-radio>
        <a-radio :value="2">{{ $t('batchEdit.appendAfter') }}</a-radio>
        <a-radio :value="3">{{ $t('batchEdit.deleteKeyword') }}</a-radio>
      </a-radio-group>
    </a-form-item>
  </a-form>
</template>

<script>
import Store from '@/api/store'
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      descriptionCount: 0
    }
  },
  mounted() {
    const { storeId } = this.$route.query
    Store.getStoreInfoLimit(storeId).then(({ data }) => {
      const { dec } = data
      this.$data.descriptionCount = dec
    })
  },
  methods: {
    DescriptionCount() {
      const { form, descriptionCount } = this.$data
      let description = form.getFieldValue('description')
      return `${description ? description.length : 0}/${descriptionCount}`
    },
    onSubmit() {
      this.$data.form.validateFields().then((data) => {
        this.$emit('submit', data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.text-count {
  display: block;
  position: absolute;
  right: 0;
  top: 15px;
}
</style>