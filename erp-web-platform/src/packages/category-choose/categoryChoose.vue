<template>
  <a-modal
    :visible="visible"
    title="类目选择"
    @ok="onOk"
    @cancel="onCancel"
    :width="800"
  >
    <a-form-model
      :model="formModel"
      ref="ruleForm"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-model-item
        label="选择类目"
        :rules="[{ required: true, message: '请选择类目' }]"
        prop="categoryIds"
      >
        <a-cascader
          allowClear
          placeholder="请选择"
          :show-search="{ filter }"
          v-model="formModel.categoryIds"
          :options="categoryOptions"
          @change="onCategoryChange"
          :getPopupContainer="(target) => target.parentNode"
          :fieldNames="{
            label: 'cnName',
            value: 'categoryId',
            children: 'children'
          }"
        />
      </a-form-model-item>

      <a-form-model-item
        v-if="countryCode !== 'CNSC' && brandList.length"
        label="品牌"
        prop="brandId"
        :rules="[{ required: true, message: '请选择' }]"
      >
        <BrandSelect v-model="formModel.brandId" :brandList.sync="brandList" />
      </a-form-model-item>

      <FormItem
        v-for="item in categoryAttribute"
        :key="item.key"
        :item="item"
        :item-data="item.itemData || []"
        :itemInfo="item.attribute_info || {}"
        :form-model="formModel"
      >
        <template :slot="item.slotName">
          <slot :name="item.slotName" />
        </template>
      </FormItem>
    </a-form-model>
  </a-modal>
</template>

<script>
import Goods from '@/api/goods'
import Product from '@/api/product'
import Cnsc from '@/api/cnsc'
import { initFormItem } from '@/components/ShopeeTypeForm/common'
import { createTree } from '@/util'
import FormItem from '@/components/ShopeeTypeForm/FormItem'
import { find } from 'lodash'
import moment from 'moment'
import BrandSelect from '@/components/ShopeeTypeForm/BrandSelect'
import i18n from '@/lang'
export default {
  components: {
    FormItem,
    BrandSelect
  },
  data() {
    return {
      i18n,
      categoryOptions: [],
      visible: true,
      formModel: {},
      categoryAttribute: [],
      brandList: [],
      countryCode: null
    }
  },
  mounted() {
    const { countryCode } = this.$data
    if (countryCode === 'CNSC') {
      /**CNSC商品 */
      Cnsc.getCnscCateAllList().then((res) => {
        this.$data.categoryOptions = createTree(res.data, 'categoryId')
      })
    } else {
      /**非CNSC商品 */
      Goods.getCategoryListV2({ countryCode }).then((res) => {
        this.$data.categoryOptions = createTree(res.data, 'categoryId')
      })
    }
  },
  methods: {
    onCancel() {
      this.reject()
      this.destroy()
    },
    onOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        const {
          categoryIds,
          categoryNames,
          brandId,
          ...args
        } = this.$data.formModel
        const categoryId = categoryIds[categoryIds.length - 1]
        const attribute = Object.keys(args).map((key) => {
          const cur = find(this.categoryAttribute, (attr) => attr.key === key)
          const { attributeType, cnName, attributeId } = cur
          const attributeValueList = args[key].map((params) => {
            let { valueId, originalValueName, valueUnit } = params
            if (attributeType === 'DATE_TYPE') {
              originalValueName = moment(originalValueName).valueOf()
            }
            return {
              valueId,
              originalValueName,
              valueUnit
            }
          })
          return {
            attributeValueList,
            attributeName: cnName,
            attributeId
          }
        })

        this.resolve({
          brandId,
          categoryId,
          categoryIds,
          categoryNames,
          attribute
        })
        this.destroy()
      })
    },
    destroy() {
      this.$destroy()
      if (document.body.contains(this.$el)) {
        document.body.removeChild(this.$el)
      }
    },
    filter(inputValue, path) {
      return path.some((option) => {
        return (
          option.cnName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
        )
      })
    },
    /**分类改变 */
    async onCategoryChange(value, selectedOptions) {
      const { countryCode } = this.$data
      // 分类改变，清空已选
      this.formItem = []
      this.$data.formModel.categoryNames = selectedOptions.map(({ cnName }) => {
        return cnName
      })
      const id = value[value.length - 1]
      let res
      if (countryCode == 'CNSC') {
        res = await Product.getCnscAttributeV2(id, countryCode)
      } else {
        res = await Product.getAttributeV2(id, countryCode)
        this.getBrandList(id, countryCode)
      }
      this.categoryAttribute = initFormItem(res.data, false)
      this.$data.formLoading = false
    },
    /**品牌下拉数据 */
    getBrandList(id, countryCode) {
      Goods.getBrandV2(id, countryCode).then(({ data }) => {
        this.brandList = data?.map((item) => ({
          ...item,
          display_name: item.display_brand_name,
          original_name: item.original_brand_name
        }))
      })
    }
  }
}
</script>

<style></style>
