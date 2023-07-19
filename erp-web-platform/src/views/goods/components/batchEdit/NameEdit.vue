<template>
  <a-form :form="form">
    <a-form-item>
      <a-textarea
        :autosize="{ minRows: 6 }"
        v-decorator="[
          'name',
          {
            rules: [
              { required: true, message: $t('batchEdit.titleRules') },
              {
                max: titleCount,
                message: $t('batchEdit.titleRules2', { titlecount })
              }
            ]
          }
        ]"
      />
      <span class="text-count">
        {{ nameCount() }}
      </span>
    </a-form-item>

    <a-form-item>
      <a-radio-group v-decorator="['type', { initialValue: 0 }]">
        <a-radio :value="0">{{$t('batchEdit.replaceAll')}}</a-radio>
        <a-radio :value="1">{{$t('batchEdit.appendBefore')}}</a-radio>
        <a-radio :value="2">{{$t('batchEdit.appendAfter')}}</a-radio>
        <a-radio :value="3">{{$t('batchEdit.deleteKeyword')}}</a-radio>
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
      titleCount: 0
    }
  },
  mounted() {
    const { storeId } = this.$route.query
    Store.getStoreInfoLimit(storeId).then(({ data }) => {
      const { title } = data
      this.$data.titleCount = title
    })
  },
  methods: {
    nameCount() {
      const { form, titleCount } = this.$data
      let name = form.getFieldValue('name')
      return `${name ? name.length : 0}/${titleCount}`
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