<template>
  <a-form :form="form">
    <a-form-item>
      <a-input
        :placeholder="$t('batchEdit.stockEditValid1')"
        :suffix="$t('batchEdit.stockEditValid2')"
        v-decorator="[
          'stock',
          {
            rules: [{ required: true, message: $t('batchEdit.stockEditValid3') }]
          }
        ]"
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
    }
  }
}
</script>