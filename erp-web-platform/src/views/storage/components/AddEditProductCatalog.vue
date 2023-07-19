<template>
  <a-form :form="form">
    <template v-if="type === 'append' && !!catalog">
      <a-form-item :label="$t('productCatalog.parentName')">
        <a-input
          disabled
          v-decorator="[
            'parentName',
            {
              rules: [{ required: true }],
              initialValue: `${catalog.cnName}(${catalog.enName})`
            }
          ]"
        />
      </a-form-item>
    </template>
    <a-form-item :label="$t('productCatalog.cnName')">
      <a-input
        v-decorator="[
          'cnName',
          {
            rules: [
              cnNameRules,
              { pattern: /^.{1,60}$/, message: '不能超过60位字符' }
            ]
          }
        ]"
      />
    </a-form-item>
    <a-form-item :label="$t('productCatalog.enName')">
      <a-input
        v-decorator="[
          'enName',
          {
            rules: [
              enNameRules,
              { pattern: /^.{1,60}$/, message: '不能超过60位字符' }
            ]
          }
        ]"
      />
    </a-form-item>
    <a-form-item :label="$t('productCatalog.description')">
      <a-textarea
        :rows="8"
        v-decorator="[
          'des',
          {
            rules: [
              desRules,
              { pattern: /^.{1,500}$/, message: '不能超过500位字符' }
            ]
          }
        ]"
      />
    </a-form-item>
    <a-form-item :label="$t('productCatalog.code')">
      <a-input v-decorator="['code', { rules: codeRules }]" />
    </a-form-item>
  </a-form>
</template>

<script>
/**
 * 新增/编辑商品类目
 */
import Product from '@/api/product'
export default {
  props: {
    catalog: Object,
    type: {
      type: String,
      default: 'append'
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      cnNameRules: [
        { required: true, message: this.$t('productCatalog.requiredCnName') }
      ],
      enNameRules: [
        { required: true, message: this.$t('productCatalog.requiredEnName') }
      ],
      desRules: [
        {
          validator: (rule, value, callback) => {
            if (value !== undefined && value.length > 500) {
              return callback('描述不能超过500个字符')
            }
            callback()
          }
        }
      ],
      codeRules: []
    }
  },
  mounted() {
    let catalogId
    const { catalog, type } = this.$props
    const { form } = this.$data
    if (catalog) {
      catalogId = catalog.catalogId
    }
    if (type === 'edit' && !!catalog) {
      Product.getProductCatalogDesc({ catalogId }).then(({ data }) => {
        const { cnName, enName, des, code } = data
        form.setFieldsValue({ cnName, enName, des, code })
      })
    }
  },
  methods: {
    async submit() {
      const { form } = this.$data
      const { type, catalog } = this.$props
      let validData = await form.validateFields()
      /**
       * 新增二级目录
       */
      if (type === 'append') {
        if (catalog) {
          validData.parentId = catalog.catalogId
        }
        return Product.addProductCatalog(validData)
      }
      if (type === 'edit') {
        validData.catalogId = catalog.catalogId
        return Product.editProductCatalog(validData)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
