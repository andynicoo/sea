<template>
  <div>
    <a-form-model
      ref="storeCategoryForm"
      :model="product"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item prop="storeId" :label="$t('edit.chooseStore')">
        <a-select v-model="product.storeId" disabled>
          <a-select-option
            :key="store.storeId"
            :value="store.storeId"
            v-for="store in storeList"
          >
            {{ store.storeName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item
        prop="categoryIds"
        :label="$t('edit.chooseCategories')"
      >
        <a-cascader
          placeholder=""
          v-model="product.categoryIds"
          :options="categoryOptions"
          :load-data="loadData"
          @change="onCategoryIdsChange"
          :disabled="editType == 1"
          :fieldNames="{
            label: '_name',
            value: 'categoryId',
            children: 'children'
          }"
        />
      </a-form-model-item>
    </a-form-model>
    <a-form-model
      ref="categoryAttrForm"
      :model="attrCategory"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item
        v-for="attr in product.attribute"
        :key="attr.attributeId"
        :label="attr.cnName || '--'"
        :prop="'' + attr.attributeId"
      >
        <!-- {{attr}}--{{attr.attributeId}} -->
        <template v-if="attr.inputType !== 'TEXT_FILED'">
          <a-select
            :disabled="editType == 1"
            show-search
            @search="handleSearch($event, attr)"
            allowClear
            v-model="attrCategory[attr.attributeId]"
            @popupScroll="onPopupScroll($event, attr)"
            @focus="onFocus(attr)"
            @change="onAttrCategoryChange"
          >
            <a-select-option
              v-for="attr in getAttrCatchOptions(attr)"
              :key="attr"
              :value="attr"
            >
              {{ attr }}
            </a-select-option>
          </a-select>
        </template>
        <template v-else>
          <a-input
            :disabled="editType == 1"
            @blur="onAttrCategoryChange"
            v-model="attrCategory[attr.attributeId]"
          />
        </template>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Goods from '@/api/goods'
import { cloneDeep, compact } from 'lodash'
import { getMixinsOptions } from '@/util'
export default {
  name: 'StoreCategoryForm',
  data() {
    return {
      rules: {
        storeId: [{ required: true, message: this.$t('edit.storeIdValid') }],
        categoryIds: [
          { required: true, message: this.$t('edit.categoryIdsValid') }
        ]
      },
      categoryOptions: [] /**商品分类 */,
      attrCatchOptions: {} /**规格属性缓存 */,
      attrCategory: {} /**规格属性值 */,
      searchValue: undefined
    }
  },
  computed: {
    ...mapState({
      storeList: (state) => state.auth.storeList
    }),
    /**获取动态属性缓存*/
    getAttrCatchOptions() {
      return ({ attributeId }) => {
        const { attrCatchOptions } = this.$data
        return attrCatchOptions[attributeId] || []
      }
    },
    editType() {
      const { edit } = this.$route.query
      return edit
    }
  },
  model: {
    prop: 'product',
    event: 'input'
  },
  props: {
    product: Object,
    labelCol: {
      type: Object,
      default: () => ({ span: 3 })
    },
    wrapperCol: {
      type: Object,
      default: () => ({ span: 12 })
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    attrCategory: {
      handler: function(attrCategory) {
        const product = cloneDeep(this.$props.product)
        product.attribute = product.attribute.map((attribute) => {
          attribute.value = attrCategory[attribute.attributeId]
          return attribute
        })
        product.attribute.forEach((ele) => {
          if (ele.value) {
            ele.value = ele.value.split('--')[0]
          }
        })
        this.$emit('input', product)
      },
      deep: true
    }
  },
  methods: {
    init() {
      this.initCategoryAttr()
      this.initCategory()
    },
    /**初始化分类属性*/
    async initCategoryAttr() {
      const { categoryId, attribute, countryCode } = this.$props.product
      if (!categoryId) return
      const { attrCategory } = this.$data
      let { data } = await Goods.getShopeeCategoryAttribute(
        categoryId + '/' + countryCode
      )
      //categoryId +'/'+ countryCode  '4976' + '/' + 'MY'
      const find = (attrId) => {
        if (!attribute) return null
        return attribute.find((attr) => attr.attributeId === attrId)
      }

      data = data.map((attr) => {
        const current = find(attr.attributeId)
        if (current) {
          this.$set(attrCategory, attr.attributeId, current.value)
        }
        attr.options = JSON.parse(attr.options)
        // attr.originalValue = JSON.parse(attr.originalValue)
        try {
          attr.translateValue = JSON.parse(attr.translateValue)
        } catch (error) {
          attr.translateValue = attr.options
        }
        if (attr.isMandatory) {
          const { rules } = this.$data
          const require = [
            {
              required: true,
              message: `${attr.cnName}${this.$t('edit.isRequire')}`
            }
          ]
          this.$set(rules, attr.attributeId, require)
        }
        return attr
      })
      const product = cloneDeep(this.$props.product)
      data = data.sort((a, b) => b.isMandatory - a.isMandatory)
      product.attribute = data
      this.$emit('input', product)
    },
    /**初始化分类*/
    initCategory() {
      const ids = this.$props.product.categoryIds
      const { storeId } = this.$route.query
      const find = (options, id, callBack) => {
        if (!id || !options) return null
        options.forEach((ele) => {
          if (ele.categoryId == id) callBack(ele)
          else find(ele.children, id, callBack)
        })
      }
      let categoryIds
      if (ids && ids.length) {
        categoryIds = [null, ...ids]
      } else {
        categoryIds = [null, null]
      }
      categoryIds.reduce(async (prev, curr) => {
        prev = await prev
        let { data } = await Goods.getShopeeCategoryList({
          parentId: prev,
          storeId
        })

        data = this.handlerCategoryOptions(data)

        if (!prev) {
          this.$data.categoryOptions = data
        } else {
          const { categoryOptions } = this.$data
          find(categoryOptions, prev, (option) => {
            this.$set(option, 'children', data)
          })
        }
        return curr
      })
    },
    // 筛选brand
    handleSearch(value, { attributeId, options, translateValue }) {
      setTimeout(() => {
        const { attrCatchOptions } = this.$data
        let totalLength = options.length
        const attrOptions = [...options].slice(0, totalLength)
        const tranOptions = [...translateValue].slice(0, totalLength)
        var filtersOption = []
        for (var ind = 0; ind < totalLength; ind++) {
          var curOption = attrOptions[ind] + '--' + tranOptions[ind]
          if (curOption.indexOf(value) > -1) {
            filtersOption.push(curOption)
          }
        }
        this.$set(attrCatchOptions, attributeId, filtersOption)
      }, 300)
    },
    /**加载分类子级*/
    async loadData(selectedOptions) {
      const { storeId } = this.$route.query
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.$set(targetOption, 'loading', true)
      const { categoryId } = targetOption
      let { data } = await Goods.getShopeeCategoryList({
        parentId: categoryId,
        storeId
      })
      data = this.handlerCategoryOptions(data)
      this.$set(targetOption, 'loading', false)
      this.$set(targetOption, 'children', data)
      this.$data.categoryOptions = [...this.$data.categoryOptions]
    },
    /**处理分类数据*/
    handlerCategoryOptions(option) {
      return option.map((ele) => {
        ele._name = `${ele.enName}(${ele.cnName})`
        ele.isLeaf = !ele.hasChildren
        return ele
      })
    },
    /**处理选择后属性请求 */
    onCategoryIdsChange(value) {
      this.$data.attrCategory = {}
      const product = cloneDeep(this.$props.product)
      product.categoryId = value[value.length - 1]
      this.$emit('input', product)
      this.$nextTick(this.initCategoryAttr)
    },
    /**滚动事件*/
    onPopupScroll(event, { attributeId, options, translateValue }) {
      const { attrCatchOptions } = this.$data
      if (options.length <= 50 && attrCatchOptions.length > 0) {
        let totalLength = options.length
        this.$set(
          attrCatchOptions,
          attributeId,
          getMixinsOptions(options, translateValue, totalLength)
        )
        return
      }
      const { target } = event
      const scrollHeight = target.scrollHeight - target.scrollTop
      const clientHeight = target.clientHeight
      // console.log(scrollHeight - clientHeight)
      if (scrollHeight - clientHeight <= 50 && options.length > 50) {
        let attributeOptions = attrCatchOptions[attributeId]
        let totalLength = attributeOptions.length + 40
        this.$set(
          attrCatchOptions,
          attributeId,
          getMixinsOptions(options, translateValue, totalLength)
        )
        // [...options].slice(0, attributeOptions.length + 40)
      }
    },
    /**获取焦事件*/
    onFocus({ attributeId, options, translateValue }) {
      const { attrCatchOptions } = this.$data
      this.$set(
        attrCatchOptions,
        attributeId,
        getMixinsOptions(options, translateValue, 40)
      )
    },

    /**属性变化事件 */
    onAttrCategoryChange() {
      const { attrCategory } = this.$data
      let product = cloneDeep(this.$props.product)
      // console.log(product.attribute)
      const value = product.attribute.map((attribute) => {
        if (attrCategory[attribute.attributeId]) {
          attribute.value = attrCategory[attribute.attributeId].split('--')[0]
        } else {
          attribute.value = attrCategory[attribute.attributeId]
        }
        return attribute
      })
      product.attribute = value
      // console.log(product.attribute)
      this.$emit('input', product)
    },
    /**校验 */
    async validate() {
      try {
        /**
         * 动态属性校验有问题，先在这里加上手动校验
         */
        const { attribute } = this.$props.product
        const subValid = attribute.filter((attr) => {
          const { isMandatory, value } = attr
          if (isMandatory) {
            if (value === null || value === undefined || value === '') {
              return true
            }
          }
          return false
        })
        const valid1 = await this.$refs.storeCategoryForm.validate()
        const valid2 = await this.$refs.categoryAttrForm.validate()
        if (valid1 && valid2 && subValid.length === 0) {
          return Promise.resolve()
        }
        return Promise.reject(this.$t('edit.storesCategoriesValidError'))
      } catch (error) {
        return Promise.reject(this.$t('edit.storesCategoriesValidError'))
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
