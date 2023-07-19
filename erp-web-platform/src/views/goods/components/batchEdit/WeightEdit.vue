<template>
  <a-form :form="form">
    <a-form-item>
      <a-input
        suffix="KG"
        v-decorator="['weight', { rules: [{ validator: validNumber }] }]"
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
        callback(this.$T('batchEdit.numberValid'))
      } else {
        callback()
      }
    }
  }
}
</script>