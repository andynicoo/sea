<template>
  <div>
    <ProductInfoForm
      ref="productInfoForm"
      v-model="product"
      :isEdit="isEdit"
      :itemLimits="itemLimits"
    ></ProductInfoForm>
    <!-- 动态类目 -->
    <ShopeeTypeForm
      ref="shopeeTypeFrom"
      v-model="product"
      :isCnscStore="true"
      :isCnscDisabled="!isEdit"
      @submit="submit"
    ></ShopeeTypeForm>
  </div>
</template>

<script>
import ProductInfoForm from './ProductInfoForm'
import ShopeeTypeForm from '@/components/ShopeeTypeForm'
export default {
  components: {
    ProductInfoForm,
    ShopeeTypeForm
  },
  model: {
    prop: 'product',
    event: 'input'
  },
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    itemLimits: {
      type: Object,
      default: () => ({})
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    async validate() {
      const arr = ['shopeeTypeFrom', 'productInfoForm']
      const promises = []
      for (const item of arr) {
        if (this.$refs[item]?.validate)
          promises.push(this.$refs[item].validate())
      }
      try {
        const result = await Promise.all(promises)
        return Promise.resolve(result)
      } catch (error) {
        console.error(error)
        return Promise.reject('基础信息校验失败,请检查')
      }
    },
    submit(val) {
      this.$emit('submit', val)
    }
  }
}
</script>

<style></style>
