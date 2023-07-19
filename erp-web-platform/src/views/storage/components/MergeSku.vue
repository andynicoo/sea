<template>
  <a-form-model ref="ruleForm" :model="form">
    <a-form-model-item label="被合并的SKU">
      <a-input
        @keydown.enter="onPush"
        class="me-ib"
        style="width: 60%"
        ref="sku"
        v-model="skuText"
      />
      <a-button
        @click="onPush"
        type="primary"
        class="me-ib me-ml-2"
        style="width: calc(20% - 10px)"
      >
        添加
      </a-button>
      <a-button
        type="link"
        @click="onClear"
        class="me-ib me-ml-2"
        style="width: calc(20% - 10px)"
      >
        清空
      </a-button>
      <br />
      <a-tag
        closable
        @close="onClose(index)"
        v-for="(item, index) in form.skus"
        :key="index"
      >
        {{ item }}
      </a-tag>
    </a-form-model-item>

    <a-form-model-item label="目标本地SKU">
      <a-input v-model="form.sku" />
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import Product from '@/api/product'

export default {
  data() {
    return {
      skuText: '',
      form: {
        skus: [],
        sku: ''
      }
    }
  },
  methods: {
    onPush() {
      const { form, skuText } = this.$data
      if (!skuText) return this.$message.error('被合并的SKU不能为空！')
      const _skuText_ = skuText.split(',')
      this.$set(form, 'skus', [...form.skus, ..._skuText_])
      this.$data.skuText = ''
    },
    onClear() {
      this.$data.skuText = ''
      this.$data.form = {
        skus: [],
        sku: ''
      }
    },
    onClose(index) {
      const { form } = this.$data
      this.$delete(form.skus, index)
    },
    onSubmit() {
      const { sku, skus } = this.$data.form
      if (!sku || !skus.length) {
        this.$message.error('请输入合并参数！')
        return Promise.reject()
      }
      return Product.mergeProductVariationsSku(this.$data.form)
    }
  }
}
</script>

<style lang="less" scoped>
</style>