<template>
  <a-form :form="form">
    <a-form-item>
      <a-input
        :prefix="$t('batchEdit.length')"
        suffix="CM"
        v-decorator="['packageLength', { rules: [{ validator: validNumber }] }]"
      />
    </a-form-item>
    <a-form-item>
      <a-input
        :prefix="$t('batchEdit.width')"
        suffix="CM"
        v-decorator="['packageWidth', { rules: [{ validator: validNumber }] }]"
      />
    </a-form-item>
    <a-form-item>
      <a-input
        :prefix="$t('batchEdit.height')"
        suffix="CM"
        v-decorator="['packageHeight', { rules: [{ validator: validNumber }] }]"
      />
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    onSubmit() {
      this.$data.form.validateFields().then((data) => {
        this.$emit('submit', data)
      })
    },
    validNumber(rule, value, callback) {
      if (Number.isNaN(Number(value))) {
        callback(this.$t('batchEdit.numberValid'))
      } else {
        callback()
      }
    }
  }
}
</script>