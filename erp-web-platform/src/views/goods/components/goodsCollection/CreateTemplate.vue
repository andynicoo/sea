<template>
  <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
    <a-form-item :label="$t('goodsCollection.templateName')">
      <a-input v-decorator="['name', { rules: [{ required: true, message: $t('goodsCollection.message1') }] }]"  />
    </a-form-item>
  </a-form>
</template>

<script>
import CrawlApi from '@/api/crawl'
export default {
  data() {
    return {
      form: this.$form.createForm(this)
    }
  },
  mounted() {},
  methods: {
    collectSubmit() {
      return new Promise((resolve, reject) => {
        const { form } = this.$data
        form
          .validateFields()
          .then(async ({ name = '' }) => {
            await CrawlApi.updateCrawlTemplate({templateName: name})
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    claimSubmit() {
      return new Promise((resolve, reject) => {
        const { form } = this.$data
        form
          .validateFields()
          .then(async ({ name = '' }) => {
            await CrawlApi.addClaimTemplate({templateName: name})
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
