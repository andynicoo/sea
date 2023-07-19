//认领到商户
<template>
  <a-spin :spinning="loading">
    <a-form-model
      :model="formModel"
      ref="merchantFormNode"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-model-item :label="$t('collect.merchant')" prop="merchantId">
        <a-select @change="handleSelectChange" v-model="formModel.merchantId">
          <a-select-option
            v-for="item in merchantList"
            :key="item.merchant_id"
            :value="item.merchant_id"
          >
            {{ item.merchant_name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <template v-if="categoryList">
        <a-form-model-item :label="$t('collect.productType')">
          <a-cascader
            @change="onChange"
            :options="categoryList"
            :show-search="{ filter }"
            :load-data="loadData"
            :placeholder="$t('collect.pselectedType')"
            v-model="formModel.categoryIds"
            :fieldNames="{
              label: 'cnName',
              value: 'categoryId',
              children: 'children'
            }"
          />
        </a-form-model-item>
      </template>
      <template v-for="item in categoryAttribute">
        <slot v-if="!item.renderFormItem" :name="item.slot">
          <form-item
            :key="item.key"
            :item="item"
            :item-data="item.itemData || []"
            :itemInfo="item.attribute_info || {}"
            :form-model="formModel"
          >
            <template :slot="item.slotName">
              <slot :name="item.slotName" />
            </template>
          </form-item>
        </slot>
      </template>
    </a-form-model>
  </a-spin>
</template>

<script>
import Cnsc from '@/api/cnsc'
import FormItem from '@/components/ShopeeTypeForm/FormItem'
import { initFormItem } from '@/components/ShopeeTypeForm/common'
export default {
  components: { FormItem },
  data() {
    return {
      loading: false,
      merchantId: null, //商户id
      categoryAttribute: [], //属性列表
      formModel: {},
      rules: {
        merchantId: [{ required: true, message: this.$t('edit.merchantValid') }]
      },
      categoryList: null, // 类目列表
      merchantList: [] //商户列表
    }
  },

  async mounted() {
    Cnsc.getMerchantPublishable().then(({ data }) => {
      this.merchantList = data
      if (this.merchantList.length > 0) {
        // 如果已过期得让用户知道
        this.merchantList.map((el) => {
          el.merchant_name = el.expire
            ? `${el.merchant_name}(已过期请重新授权)`
            : el.merchant_name
        })
      }
    })
  },

  methods: {
    handleSelectChange() {
      Cnsc.getCnscCateList().then(({ data }) => {
        this.categoryList = this.handlerData(data)
      })
    },

    //把数据处理一下
    handlerData(data) {
      return data.map((e) => {
        e.label = `${e.categoryName}(${e.cnName})`
        e.isLeaf = !e.hasChildren
        return e
      })
    },

    /**
     * 商品分类选择事件
     */
    async loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.$set(targetOption, 'loading', true)
      const params = { parentId: targetOption.categoryId }
      this.$data.loading = true
      let { data } = await Cnsc.getCnscCateList(params)
      this.$data.loading = false
      data = this.handlerData(data)
      this.$set(targetOption, 'loading', false)
      this.$set(targetOption, 'children', data)
    },
    /**
     * 商品分类改变事件
     */
    async onChange(selectedOptions) {
      if (!selectedOptions.length) return (this.$data.categoryAttribute = null)
      // 重置数据
      this.formModel = Object.assign(
        { categoryIds: selectedOptions },
        { merchantId: this.formModel.merchantId }
      )
      this.categoryAttribute = []
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.$data.loading = true
      let { data } = await Cnsc.getAttribute(targetOption)
      data &&
        data.map((item) => {
          item.isMandatory = false // 不校验
        })
      this.categoryAttribute = await initFormItem(data, false)
      this.$data.loading = false
    },

    submit() {
      return new Promise((resolove, reject) => {
        this.$refs.merchantFormNode.validate((valid) => {
          if (valid) {
            const { categoryIds = [], merchantId } = this.formModel
            let brandId = null
            let originalBrandName = null
            const attribute = this.categoryAttribute
              .filter((item) => this.formModel[item.key])
              .map((item) => {
                const val = this.formModel[item.attributeId]
                if (item.attributeId === 1000 && val.length > 0) {
                  brandId = val[0].valueId
                  originalBrandName = val[0].originalValueName
                }
                return {
                  attributeId: item.attributeId,
                  attributeName: item.cnName,
                  attributeValueList: val
                }
              })
            const obj = {
              attribute,
              categoryIds,
              merchantId,
              brandId,
              originalBrandName,
              categoryId: categoryIds[categoryIds.length - 1]
            }
            this.$emit('submit', obj)
            resolove(obj)
          } else {
            reject()
          }
        })
      })
    },
    filter(inputValue, path) {
      return path.some(
        (option) =>
          option.cnName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
