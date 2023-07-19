<template>
  <a-form-model
    ref="basicForm"
    :model="product"
    :rules="rules"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 10 }"
  >
    <a-form-model-item
      required
      label="商品来源"
      :wrapper-col="{ span: 20 }"
      class="me-mb-0"
    >
      <a-form-model-item
        prop="source"
        class="me-ib me-mr-2"
        style="width: 400px"
      >
        <a-input disabled v-model="product.sourceName" />
      </a-form-model-item>
      <a-form-model-item class="me-ib me-ml-2">
        最近修改时间：
      </a-form-model-item>
      <a-form-model-item prop="updateTime" class="me-ib">
        <a-input disabled v-model="product.updateTime" />
      </a-form-model-item>
    </a-form-model-item>

    <a-form-model-item required label="选择店铺">
      <a-select disabled v-model="product.storeId">
        <a-select-option
          v-for="store in stores"
          :value="store.storeId"
          :key="store.storeId"
        >
          {{ store.storeName }} {{ store.storeAlias && store.storeAlias }}
        </a-select-option>
      </a-select>
    </a-form-model-item>

    <a-form-model-item
      label="选择分类"
      required
      :wrapper-col="{ span: 20 }"
      class="me-mb-0"
    >
      <a-form-model-item prop="categoryIds" class="me-ib" style="width: 400px">
        <a-cascader
          :disabled="$route.query.edit == 2"
          v-model="product.categoryIds"
          @change="onCategoryChange"
          :options="categoryTree"
          :show-search="{}"
          :fieldNames="{
            label: 'categoryCnName',
            value: 'categoryId',
            children: 'children'
          }"
        />
      </a-form-model-item>
      <a-form-model-item class="me-ib me-ml-2">
        <a-button type="link" @click="onSuggestion">推荐类目</a-button>
      </a-form-model-item>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import Lazada from '@/api/lazada'
import Store from '@/api/store'
import bus from '@/bus'
import { cloneDeep } from 'lodash'

export default {
  props: {
    product: Object
  },
  model: {
    prop: 'product',
    event: 'input'
  },
  computed: {
    rules() {
      return {
        categoryIds: [{ required: true, message: '分类不能为空' }]
      }
    }
  },
  data() {
    return {
      categoryTree: [],
      stores: []
    }
  },
  mounted() {
    const product = this.$props.product
    Lazada.getLazadaCategoryTree({
      site: product.countryCode,
      storeId: product.storeId
    }).then((res) => {
      this.$data.categoryTree = res.data
    })
    Store.getAllStore().then((res) => {
      this.$data.stores = res.data.filter(({ platform }) => {
        return platform === 2
      })
    })
  },
  methods: {
    validate() {
      return this.$refs.basicForm.validate()
    },
    /**类目选择事件 */
    onCategoryChange(value) {
      const categoryId = value[value.length - 1]
      const product = this.$props.product
      product.categoryId = categoryId
      this.$emit('input', product)
      Lazada.getLazadaCategoryAttribute({
        site: product.countryCode,
        categoryId,
        storeId: product.storeId
      }).then((res) => {
        res.data = res.data.map((ele) => {
          if (ele.options) ele.options = JSON.parse(ele.options)
          return ele
        })
        bus.$emit('lazadaEditBasicInfoCategoryChange', res.data)
      })
    },
    /**推荐类目 */
    onSuggestion() {
      const { storeId, name } = this.$props.product
      Lazada.lazadaCategoryAttrSuggestion(storeId, name).then((res) => {
        const value = res.data.categoryIds.reverse()
        const categoryId = value[value.length - 1]
        const product = cloneDeep(this.$props.product)
        product.categoryId = categoryId
        product.categoryIds = value
        this.$emit('input', product)

        Lazada.getLazadaCategoryAttribute({
          site: product.countryCode,
          categoryId,
          storeId
        }).then((res) => {
          res.data = res.data.map((ele) => {
            if (ele.options) ele.options = JSON.parse(ele.options)
            return ele
          })
          bus.$emit('lazadaEditBasicInfoCategoryChange', res.data)
        })
      })
    }
  }
}
</script>
