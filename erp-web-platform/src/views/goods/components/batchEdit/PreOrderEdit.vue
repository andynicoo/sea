<template>
  <a-form :form="form">
    <a-form-item>
      <a-checkbox v-decorator="['isPreOrder', { initialValue: false }]">
        {{ $t('batchEdit.isPreOrder') }}
      </a-checkbox>
    </a-form-item>
    <template v-if="form.getFieldValue('isPreOrder')">
      <a-form-item>
        <a-input
          class="custom-input"
          :prefix="$t('batchEdit.ineed')"
          :suffix="`${$t('batchEdit.daysMessage')}${preStart}~${preEnd}`"
          type="number"
          v-decorator="[
            'daysToShip',
            {
              rules: [
                { required: true, message: $t('batchEdit.daysToShipRules') },
                { validator: onValidator }
              ]
            }
          ]"
        />
      </a-form-item>
    </template>
  </a-form>
</template>

<script>
import Store from '@/api/store'

export default {
  data() {
    return {
      preEnd: null,
      preStart: null,
      form: this.$form.createForm(this)
    }
  },
  mounted() {
    const { storeId } = this.$route.query
    Store.getStoreInfoLimit(storeId).then(({ data }) => {
      let { preEnd, preStart } = data
      preEnd = Number(preEnd)
      preStart = Number(preStart)
      this.$data.preEnd = preEnd
      this.$data.preStart = preStart
    })
  },
  methods: {
    onSubmit() {
      this.$data.form.validateFields().then((data) => {
        this.$emit('submit', data)
      })
    },
    onValidator(rule, value, callback) {
      const { preEnd, preStart } = this.$data
      if (value < preStart || value > preEnd) {
        callback(this.$t('batchEdit.daysToShipRules2', { prestart, preend }))
      }

      callback()
    }
  }
}
</script>

<style lang="scss">
.custom-input {
  &.ant-input-affix-wrapper.custom-input .ant-input {
    padding-left: 60px !important;
    padding-right: 180px !important;
  }
}
</style>