<template>
  <a-modal
    :title="$t('collect.claimToShop')"
    :visible="value"
    :width="900"
    :confirm-loading="confirmLoading"
    :afterClose="reset"
    @cancel="cancel"
    @ok="ok"
  >
    <SearchFrom
      ref="form"
      :formItem="formItem"
      :formModel="formModel"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      layout="vertical"
      @submit="submit"
    >
      <!-- 店铺 -->
      <template #store>
        <a-cascader
          v-model="formModel.storeId"
          :options="basicStoreListSize"
          :show-search="{ filter }"
          :placeholder="$t('store.choseStore')"
          @change="handleSelectChange"
        />
      </template>
      <!-- 类目 -->
      <template #categoryIds>
        <a-cascader
          placeholder="请选择"
          :show-search="{ categoryFilter }"
          v-model="formModel.categoryIds"
          :options="categoryOptions"
          @change="onCategoryIdsChange"
          :fieldNames="{
            label: 'cnName',
            value: 'categoryId',
            children: 'children'
          }"
        />
      </template>
      <!-- 品牌 -->
      <template #brand>
        <BrandSelect
          v-model="formModel.brandId"
          :brandList="brandList"
        ></BrandSelect>
      </template>
      <template :slot="item.slot" v-for="item in attributeList">
        <Form-item
          :key="item.key"
          :item="item"
          :item-data="item.itemData || []"
          :itemInfo="item.attribute_info || {}"
          :form-model="formModel"
          layout="vertical"
        />
      </template>
    </SearchFrom>
  </a-modal>
</template>

<script>
import FormItem from '@/components/ShopeeTypeForm/FormItem'
import SearchFrom from '@/components/searchForm'
import BrandSelect from '@/components/ShopeeTypeForm/BrandSelect.vue'
import Product from '@/api/product'
import Goods from '@/api/goods'
import { mapState } from 'vuex'
import { createTree } from '@/util/index'
import { initFormItem } from '@/components/ShopeeTypeForm/common'
const initFoemModel = {
  categoryIds: undefined,
  storeId: undefined,
  brandId: undefined
}
export default {
  components: {
    FormItem,
    SearchFrom,
    BrandSelect
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    confirmLoading: {
      type: Boolean,
      default: false
    },
    selectedRows: {
      tyep: Array,
      default: () => []
    }
  },
  data() {
    return {
      formModel: { ...initFoemModel },
      product: {},
      categoryOptions: [],
      countryCode: '',
      attributeList: [],
      brandList: [],
      labelCol: {},
      wrapperCol: {},
      shopId: ''
    }
  },
  computed: {
    ...mapState({
      basicStoreListSize: (state) => state.auth.basicStoreListSize
    }),
    formItem({ attributeList, categoryOptions, brandList }) {
      return [
        {
          label: this.$t('collect.store'),
          required: true,
          key: 'storeId',
          slotName: 'store',
          span: 24
        },
        {
          label: this.$t('edit.chooseCategories'),
          // required: true,
          isHide: !categoryOptions.length,
          key: 'categoryIds',
          slotName: 'categoryIds',
          span: 24
        },
        {
          label: this.$t('edit.brand'),
          // required: true,
          key: 'brandId',
          isHide: !brandList.length,
          slotName: 'brand',
          span: 24
        },
        ...attributeList
      ]
    }
  },

  methods: {
    async submit(val) {
      try {
        const { storeId, categoryIds, brandId } = this.formModel
        const categoryId = categoryIds
          ? categoryIds[categoryIds?.length - 1]
          : undefined
        const arr = this.formatParams(val)
        const params = {
          attribute: arr,
          storeId: storeId[storeId.length - 1],
          categoryId,
          brandId
        }
        this.$emit('submit', params)
      } catch (error) {
        console.error(error)
      }
    },
    // 格式化出参
    formatParams(val) {
      return this.attributeList
        .filter((item) => {
          const value = val[item.attributeId]
          return value?.some((it) => it.originalValueName)
        })
        .map((item) => {
          const value = val[item.attributeId]
          return {
            attributeId: item.attributeId,
            attrbuteName: item.cnName,
            attributeValueList: value
          }
        })
    },
    cancel() {
      this.$emit('input', false)
    },
    filter(inputValue, path) {
      return path.some(
        (option) =>
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      )
    },

    handleSelectChange(val, selectedOptions) {
      if (!val.length) {
        this.reset()
        return
      }
      const [countryCode] = val
      const [, shopObj] = selectedOptions
      this.countryCode = countryCode
      if (countryCode) {
        this.shopId = shopObj?.platformId
        this.getCategortList(countryCode)
        this.getCategoryRecommend(countryCode)
      }
    },
    // 获取类目
    async getCategortList(countryCode) {
      try {
        const { data } = await Product.getCategorySelectV2({
          countryCode
        })
        this.categoryOptions = createTree(data || [], 'categoryId')
      } catch (error) {
        console.error(error)
      }
    },
    // 获取类目推荐
    async getCategoryRecommend(countryCode) {
      if (this.selectedRows?.length !== 1) return
      const [curProduct] = this.selectedRows
      const { name } = curProduct
      try {
        const { data } = await Product.getCategoryRecommend({
          countryCode,
          name,
          shopId: this.shopId
        })
        if (data?.length) {
          // const [first = {}] = data
          // let value = first?.id.split(',') || []
          // value = value.map((item) => Number(item))
          // type2==推荐类目，type1==常用类目
          let type1 = [],
            type2 = []
          data.map((item) => {
            if (!type1.length && item.type === 1) {
              type1 = item.id.split(',') || []
              type1 = type1.map((it) => Number(it))
            }
            if (!type2.length && item.type === 2) {
              type2 = item.id.split(',') || []
              type2 = type2.map((it) => Number(it))
            }
          })
          let finishType = type2.length ? type2 : type1
          this.formModel.categoryIds = finishType
          this.onCategoryIdsChange(finishType)
        }
      } catch (error) {
        console.error(error)
      }
    },
    // 获取品牌
    async getBrandList(id) {
      try {
        const { data } = await Goods.getBrandV2(id, this.countryCode)
        this.brandList =
          data &&
          data.map((item) => ({
            ...item,
            display_name: item.display_brand_name,
            original_name: item.original_brand_name
          }))
      } catch (error) {
        console.error(error)
      }
    },
    onCategoryIdsChange(val) {
      this.$set(this.formModel, 'categoryIds', val)
      if (!val.length) {
        this.attributeList = []
        this.formModel = { storeId: this.formModel.storeId }
        this.brandList = []
        return
      }
      const id = val[val.length - 1]
      this.getBrandList(id)
      this.getAttrbuteList(id)

      const params = {
        shopId: this.formModel.storeId[this.formModel.storeId.length - 1],
        categoryIds: val
      }
      Goods.chooseCategory(params).then((res) => {
        console.log(res)
      })
    },
    // 获取类目的属性
    async getAttrbuteList(categoryId) {
      try {
        const { data } = await Product.getAttributeV2(
          categoryId,
          this.countryCode
        )
        let isCnscDisabled = this.editType == 1 || this.isCnscDisabled
        data &&
          data.map((item) => {
            item.isMandatory = false // 不校验
            item.span = 24
            item.slot = String(item.attributeId)
          })
        this.attributeList = initFormItem(data, isCnscDisabled)
      } catch (error) {
        console.error(error)
      }
    },
    ok() {
      this.$refs.form.validate()
    },
    reset() {
      this.attributeList = []
      this.formModel = {}
      this.attributeList = []
      this.categoryOptions = []
      this.brandList = []
      this.countryCode = ''
      this.shopId = ''
      this.$refs.form.resetForm()
    },
    categoryFilter(inputValue, path) {
      return path.some(
        (option) =>
          option.cnName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      )
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ant-modal-body {
  max-height: 500px;
  min-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
