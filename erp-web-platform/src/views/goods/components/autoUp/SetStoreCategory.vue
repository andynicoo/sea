<template>
  <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 16 }">
    <a-form-item :label="$t('autoUp.productRangeBtn1')">
      <a-cascader
        v-decorator="[
          'categoryIds',
          { rules: [{ required: true, message: $t('autoUp.categoryRules') }] }
        ]"
        :options="category"
        :fieldNames="{
          label: 'cnName',
          value: 'categoryId',
          children: 'children'
        }"
        @change="onChange"
      />
      <!-- :show-search="{ filter }" -->
    </a-form-item>
  </a-form>
</template>

<script>
import goods from '@/api/goods'
import Product from '@/api/product'
import { createTree } from '@/util'
export default {
  props: {
    storeId: Number,
    countryCode: String
  },
  data() {
    return {
      form: this.$form.createForm(this),
      category: [],
      names: []
    }
  },
  async mounted() {
    const { data } = await Product.getCategorySelectV2({
      countryCode: this.$props.countryCode
    })
    console.log(createTree(data || [], 'categoryId'))
    this.$data.category = createTree(data || [], 'categoryId')
  },
  methods: {
    onChange(value, selectedOptions) {
      const names = selectedOptions.map(({ categoryDisplayName, cnName }) => {
        if (cnName) return `${categoryDisplayName}(${cnName})`
        return categoryDisplayName
      })
      this.$data.names = names
    },
    filter(inputValue, path) {
      console.log(path)
      return path.some(
        (option) =>
          option.cnName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      )
    },
    async validateFields() {
      const valid = await this.$data.form.validateFields()
      const { categoryIds } = valid
      const categoryId = categoryIds[categoryIds.length - 1]
      const names = this.$data.names
      return {
        categoryIds,
        categoryId,
        names
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
