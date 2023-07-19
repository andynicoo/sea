<template>
  <div>
    <ProductInfoForm
      ref="productInfoForm"
      v-model="product"
      :isCnscStore="!!$route.query.merchantId"
      :wrapperCol="wrapperCol"
      :labelCol="labelCol"
    ></ProductInfoForm>
    <!-- 动态类目 -->
    <ShopeeTypeForm
      v-if="editType != 0"
      ref="shopeeTypeFrom"
      v-model="product"
      :isCnscStore="!!$route.query.merchantId"
      :wrapperCol="wrapperCol"
      :labelCol="labelCol"
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
    labelCol: {
      type: Object,
      default: () => ({ span: 3 })
    },
    wrapperCol: {
      type: Object,
      default: () => ({ span: 13 })
    }
  },
  data() {
    return {
      editType: this.$route.query.edit
    }
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
    async save() {
      const params = await this.$refs.shopeeTypeFrom?.save()
      return Promise.resolve(params)
    },
    submit(val) {
      this.$emit('submit', val)
    }
  }
}
</script>

<style></style>
