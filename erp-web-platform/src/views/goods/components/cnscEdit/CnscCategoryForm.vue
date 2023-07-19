<template>
  <div>
    <a-form-model
      ref="storeCategoryForm"
      :model="product"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <!-- cnsc商户 -->
      <a-form-model-item
        prop="merchantId"
        :label="$t('edit.chooseMerchant')"
        v-if="product.merchantId"
      >
        <a-select v-model="product.merchantId" disabled>
          <a-select-option
            :key="item.merchant_id"
            :value="item.merchant_id"
            v-for="item in merchantList"
          >
            {{ item.merchant_name }}
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
          :disabled="!isEdit"
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
      :rules="isEdit ? rules : {}"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item
        v-for="attr in product.attribute"
        :key="attr.attributeId"
        :label="attr.cnName || '--'"
        :prop="attr.attributeName"
      >
        <!-- 单选下拉 -->
        <template
          v-if="attr.inputType == 'COMBO_BOX' || attr.inputType == 'DROP_DOWN'"
        >
          <a-row>
            <a-select
              :disabled="!isEdit"
              show-search
              @search="handleSearch($event, attr)"
              allowClear
              v-model="attrCategory[attr.attributeName]"
              @popupScroll="onPopupScroll($event, attr)"
              @focus="onFocus(attr)"
              @change="onAttrCategoryChange"
              :style="{
                width: getAttrUnitList(attr.attributeUnit) ? '80%' : '100%'
              }"
            >
              <a-select-option
                v-for="attr in getAttrCatchOptions(attr)"
                :key="attr.value_id"
                :value="attr.display_value_name"
              >
                {{ attr.display_value_name }}
              </a-select-option>
            </a-select>
            <!-- 如果有单位 -->
            <template v-if="getAttrUnitList(attr.attributeUnit)">
              单位:
              <a-select
                style="width:14%"
                v-model="attrCateUnit[attr.attributeName]"
                @change="onUnitChange"
              >
                <a-select-option
                  v-for="unit in getAttrUnitList(attr.attributeUnit)"
                  :key="unit"
                >
                  {{ unit }}
                </a-select-option>
              </a-select>
            </template>
          </a-row>
        </template>

        <!-- 文本框 除了attributeType为DATE_TYPE之外-->
        <template
          v-if="
            attr.inputType == 'TEXT_FILED' && attr.attributeType != 'DATE_TYPE'
          "
        >
          <a-row>
            <a-input
              :disabled="!isEdit"
              @blur="onAttrCategoryChange"
              v-model="attrCategory[attr.attributeName]"
              :style="{
                width: getAttrUnitList(attr.attributeUnit) ? '80%' : '100%'
              }"
            />
            <!-- 如果有单位 -->
            <template v-if="getAttrUnitList(attr.attributeUnit)">
              单位:
              <a-select
                style="width:14%"
                :disabled="!isEdit"
                v-model="attrCateUnit[attr.attributeName]"
                @change="onUnitChange"
              >
                <a-select-option
                  v-for="unit in getAttrUnitList(attr.attributeUnit)"
                  :key="unit"
                >
                  {{ unit }}
                </a-select-option>
              </a-select>
            </template>
          </a-row>
        </template>
        <!-- 多选下拉 -->
        <template v-if="attr.inputType == 'MULTIPLE_SELECT_COMBO_BOX'">
          <a-row>
            <a-select
              mode="tags"
              :style="{
                width: getAttrUnitList(attr.attributeUnit) ? '80%' : '100%'
              }"
              :disabled="!isEdit"
              v-model="attrCategory[attr.attributeName]"
              @change="onAttrCategoryChange"
            >
              <a-select-option
                v-for="attr in attr.optionsList"
                :key="attr.value_id"
                :value="attr.display_value_name"
                :disabled="!isEdit"
              >
                {{ attr.display_value_name }}
              </a-select-option>
            </a-select>
            <!-- 如果有单位 -->
            <template v-if="getAttrUnitList(attr.attributeUnit)">
              单位:
              <a-select
                style="width:14%"
                v-model="attrCateUnit[attr.attributeName]"
                @change="onUnitChange"
              >
                <a-select-option
                  v-for="unit in getAttrUnitList(attr.attributeUnit)"
                  :key="unit"
                >
                  {{ unit }}
                </a-select-option>
              </a-select>
            </template>
          </a-row>
        </template>
        <!-- 日期 -->
        <template
          v-if="
            attr.inputType == 'TEXT_FILED' && attr.attributeType == 'DATE_TYPE'
          "
        >
          <a-date-picker
            v-model="attrCategory[attr.attributeName]"
            @change="onAttrCategoryChange"
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
            :disabled="!isEdit"
          />
        </template>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Cnsc from '@/api/cnsc'
import { cloneDeep, isArray, isEmpty } from 'lodash'
export default {
  name: 'StoreCategoryForm',
  data() {
    return {
      rules: {
        merchantId: [
          { required: true, message: this.$t('edit.merchantValid') }
        ],
        categoryIds: [
          { required: true, message: this.$t('edit.categoryIdsValid') }
        ]
      },
      categoryOptions: [] /**商品分类 */,
      attrCatchOptions: {} /**规格属性缓存 */,
      attrCategory: {} /**规格属性值 */,
      attrCateUnit: {}, // 属性单位值
      searchValue: undefined
    }
  },
  computed: {
    ...mapState({
      merchantList: (state) => state.product.merchantList
    }),
    /**获取动态属性缓存*/
    getAttrCatchOptions() {
      return ({ attributeId }) => {
        const { attrCatchOptions } = this.$data
        return attrCatchOptions[attributeId] || []
      }
    },

    // 获取属性单位值
    getAttrUnitList() {
      return (unitStr) => {
        return unitStr == '[]' ? null : JSON.parse(unitStr)
      }
    }
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
    isEdit: {
      type: Boolean,
      default: false
    },
    labelCol: {
      type: Object,
      default: () => ({ span: 3 })
    },
    wrapperCol: {
      type: Object,
      default: () => ({ span: 12 })
    }
  },

  watch: {
    attrCategory: {
      handler: function(attrCategory) {
        this.attributeCateHandler(attrCategory)
      },
      deep: true
    },
    attrCateUnit: {
      handler(attrUnit) {
        this.unitHandler(attrUnit)
      },
      deep: true
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    // watch监听
    attributeCateHandler(attrCategory) {
      const product = cloneDeep(this.$props.product)
      product.attribute.map((item) => {
        let currText = attrCategory[item.attributeName] || ''
        // 单选下拉
        let matchEl = {}
        let target = null
        if (['DROP_DOWN', 'COMBO_BOX'].includes(item.inputType)) {
          target = item.optionsList.find(
            (el) => el.display_value_name == currText
          )
        }
        // 多选下拉
        if (item.inputType == 'MULTIPLE_SELECT_COMBO_BOX') {
          target = item.optionsList.filter((item) =>
            currText.includes(item.display_value_name)
          )
        }
        // 普通文本框
        if (
          item.inputType == 'TEXT_FILED' &&
          item.attributeType != 'DATE_TYPE'
        ) {
          target = {
            display_value_name: currText,
            original_value_name: currText
          }
        }

        // 日期
        if (
          item.inputType == 'TEXT_FILED' &&
          item.attributeType == 'DATE_TYPE'
        ) {
          target = {
            value_id: 0,
            display_value_name: currText,
            original_value_name: currText
          }
        }
        // 如果有单位,并且单位选了的话
        if (item.attributeUnit != '[]') {
          matchEl = item.value
            ? Object.assign(JSON.parse(item.value), target)
            : target
          if (matchEl) {
            matchEl['value_id'] = 0
          }
        } else {
          matchEl = target
        }

        item.value = JSON.stringify(matchEl)
        // console.log('属性值变化:', item.attributeName, item.value)
      })
      // console.table(product.attribute.filter((item) => item.value))
      this.$emit('input', product)
    },
    // 单位监听
    unitHandler(attrUnit) {
      const product = cloneDeep(this.$props.product)
      product.attribute.map((item) => {
        let currUnit = attrUnit[item.attributeName]
        let matchEl = null
        if (currUnit) {
          let target = {
            value_unit: currUnit,
            value_id: 0
          }
          matchEl = item.value
            ? Object.assign(JSON.parse(item.value), target)
            : target
          item.value = JSON.stringify(matchEl)
          console.log('单位变化：', item.attributeName, item.value)
        }
      })
      // console.table(product.attribute.filter((item) => item.value))
      this.$emit('input', product)
    },
    init() {
      this.initCategoryAttr(true)
      this.initCategory()
    },
    /**初始化分类属性*/
    async initCategoryAttr(isInit = false) {
      const { categoryId, attribute } = this.$props.product
      if (!categoryId) return
      const { attrCategory, attrCateUnit } = this.$data
      let { data } = await Cnsc.getAttribute(categoryId)
      // 每次更新类目需要初始化属性
      if (!isInit) {
        this.product.attribute = []
        this.attrCategory = {}
        this.attrCateUnit = {}
        this.$emit('input', product)
      }

      const find = (attrId) => {
        if (!attribute) return null
        return attribute.find((attr) => attr.attributeId === attrId)
      }

      data = data.map((attr) => {
        const current = find(attr.attributeId)
        if (current && current.value) {
          let currentVal =
            typeof current.value == 'string' ? JSON.parse(current.value) : ''
          if (currentVal) {
            // 这里要考虑多选属性值为 数组对象对情况
            // 需要显示中文display_value_name字段，虾皮返回的字段没有display_value_name
            if (!isArray(currentVal) && currentVal?.value_id == 0) {
              let targetValue = isArray(currentVal)
                ? currentVal.map((el) => el.display_value_name)
                : currentVal.display_value_name
              if (isEmpty(targetValue)) {
                targetValue = isArray(currentVal)
                  ? currentVal.map((el) => el.original_value_name)
                  : currentVal.original_value_name
              }
              let targetUnit = currentVal.value_unit || null
              this.$set(attrCategory, attr.attributeName, targetValue)
              this.$set(attrCateUnit, attr.attributeName, targetUnit)
            } else {
              let targetId = isArray(currentVal)
                ? currentVal.map((el) => el.value_id)
                : currentVal.value_id
              let targetUnit = currentVal.value_unit || null
              const options = isArray(targetId)
                ? attr.optionsList.filter((item) =>
                    targetId.includes(item.value_id)
                  )
                : attr.optionsList.find((item) => targetId === item.value_id)
              const displayName = isArray(options)
                ? options.map((item) => item?.display_value_name)
                : options?.display_value_name
              this.$set(attrCategory, attr.attributeName, displayName)
              this.$set(attrCateUnit, attr.attributeName, targetUnit)
            }
          }
        }

        if (attr.isMandatory) {
          const { rules } = this.$data
          const require = [
            {
              required: true,
              message: `${attr.cnName}${this.$t('edit.isRequire')}`
            }
          ]
          this.$set(rules, attr.attributeName, require)
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
        let { data } = await Cnsc.getCnscCateList({
          parentId: prev
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
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.$set(targetOption, 'loading', true)
      const { categoryId } = targetOption
      let { data } = await Cnsc.getCnscCateList({
        parentId: categoryId
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
    onPopupScroll(event, { attributeId, optionsList }) {
      const { attrCatchOptions } = this.$data
      if (optionsList.length <= 50 && attrCatchOptions.length > 0) {
        this.$set(attrCatchOptions, attributeId, optionsList)
        return
      }
      const { target } = event
      const scrollHeight = target.scrollHeight - target.scrollTop
      const clientHeight = target.clientHeight
      // console.log(scrollHeight - clientHeight)
      if (scrollHeight - clientHeight <= 50 && optionsList.length > 50) {
        // let attributeOptions = attrCatchOptions[attributeId]
        // let totalLength = attributeOptions.length + 40
        this.$set(attrCatchOptions, attributeId, optionsList)
        // [...options].slice(0, attributeOptions.length + 40)
      }
    },

    // 属性下拉框切换
    handleChangeAttribute(value, attr) {
      attr.selectedItem = attr.optionsList.find((el) => el.value_id == value)
    },

    /**获取焦事件*/
    onFocus({ attributeId, optionsList }) {
      const { attrCatchOptions } = this.$data
      this.$set(attrCatchOptions, attributeId, optionsList)
    },

    /**属性变化事件 */
    onAttrCategoryChange() {
      // 暂时保留
    },

    // 单位变化
    onUnitChange(val) {
      // 暂时保留
    },
    /**校验 */
    validate() {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        const rej = () =>
          reject({
            message: this.$t('edit.storesCategoriesValidError'),
            name: 'storeCategoryForm'
          })
        try {
          /**
           * 动态属性校验有问题，先在这里加上手动校验
           */
          const { attribute } = this.$props.product
          let subValid = attribute.filter((attr) => {
            const { isMandatory, value } = attr
            if (isMandatory) {
              if (value === null || value === undefined || value === '') {
                return true
              }
            }
            return false
          })
          const valid1 = await this.$refs.storeCategoryForm.validate()
          let valid2 = true
          if (this.isEdit) {
            valid2 = await this.$refs.categoryAttrForm.validate()
          } else {
            valid2 = true
            subValid = []
          }
          if (valid1 && valid2 && subValid.length === 0) {
            resolve(true)
            return
          }
          rej()
        } catch (error) {
          rej()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
