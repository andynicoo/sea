<template>
  <a-form :form="form">
    <a-form-item props="categoryNames">
      <a-input
        @focus="$emit('focus', $event, category)"
        v-decorator="[
          'categoryNames',
          { rules: [{ required: true, message: $t('batchEdit.attrValid1') }] }
        ]"
      />
    </a-form-item>
    <template v-for="item in categoryAttribute">
      <a-form-item
        :props="item.attributeName"
        :key="item.attributeId"
        :label="`${item.attributeName}(${item.cnName})`"
      >
        <!-- 文本域 -->
        <template v-if="item.inputType == 'TEXT_FILED'">
          <a-input
            @change="onAttributeChange(item.attributeId, $event)"
            v-decorator="[
              item.attributeName,
              {
                rules: [
                  {
                    required: item.isMandatory,
                    message: `${item.attributeName}(${item.cnName})${$t(
                      'batchEdit.attrValid2'
                    )}`
                  }
                ]
              }
            ]"
          />
        </template>

        <!-- 下拉选择 -->
        <template v-else>
          <a-select
            show-search
            @search="handleSearch($event, item)"
            @change="onAttributeChangeByChoose(item.attributeId, $event)"
            @popupScroll="onPopupScroll($event, item)"
            @focus="onFocus(item)"
            v-decorator="[
              item.attributeName,
              {
                rules: [
                  {
                    required: item.isMandatory,
                    message: `${item.attributeName}(${item.cnName})${$t(
                      'edit.attrValid2'
                    )}`
                  }
                ]
              }
            ]"
          >
            <template
              v-for="(ops, index) in item.options.length <= 50
                ? item.options
                : catchOptions[item.attributeName]"
            >
              <a-select-option :value="ops" :key="index">
                {{ ops }}
              </a-select-option>
            </template>
          </a-select>
        </template>
      </a-form-item>
    </template>
  </a-form>
</template>

<script>
import Goods from '@/api/goods'
import { getMixinsOptions } from '@/util'
export default {
  props: {
    category: Object
  },
  data() {
    return {
      form: this.$form.createForm(this),
      categoryAttribute: [],
      catchOptions: {},
      countryCode: ''
    }
  },
  mounted() {
    this.initCategoryAttribute()
  },
  methods: {
    onPopupScroll(event, { attributeName, options, translateValue }) {
      const { catchOptions } = this.$data
      if (options.length <= 50 && catchOptions.length > 0) {
        // let totalLength = options.length
        // this.$set(
        //   catchOptions,
        //   attributeName,
        //   getMixinsOptions(options, translateValue, totalLength)
        // )
        return
      }
      const { target } = event
      const scrollHeight = target.scrollHeight - target.scrollTop
      const clientHeight = target.clientHeight
      if (scrollHeight - clientHeight <= 50 && options.length > 50) {
        let attributeOptions = catchOptions[attributeName]
        let __options = [...options]
        this.$set(
          catchOptions,
          attributeName,
          __options.slice(0, attributeOptions.length + 40)
        )
      }
    },
    /**
     * 展开时初始化数据
     */
    onFocus({ attributeName, options, translateValue }) {
      const { catchOptions } = this.$data
      const __options = [...options]
      this.$set(catchOptions, attributeName, __options.slice(0, 40))
    },
    // 筛选brand
    handleSearch(value, { attributeName, options, translateValue }) {
      setTimeout(() => {
        const { catchOptions } = this.$data
        let totalLength = options.length
        const attrOptions = [...options].slice(0, totalLength)
        const tranOptions = [...translateValue].slice(0, totalLength)
        var filtersOption = []
        for (var ind = 0; ind < totalLength; ind++) {
          var curOption = attrOptions[ind]
          if (curOption.indexOf(value) > -1) {
            filtersOption.push(curOption)
          }
        }
        this.$set(catchOptions, attributeName, filtersOption)
      }, 300)
    },
    onAttributeChange(fieldId, event) {
      const { id } = this.$props.category
      this.$emit('change', id, fieldId, event.target.value)
    },
    onAttributeChangeByChoose(fieldId, event) {
      const { id } = this.$props.category
      this.$emit('change', id, fieldId, event)
    },
    setCategoryAttribute(value) {
      value.forEach((e) => {
        this.$set(this.$data.catchOptions, e.attributeName, [])
      })
      this.$data.categoryAttribute = value
    },
    setFieldsValue(value) {
      setTimeout(() => {
        this.$data.form.setFieldsValue(value)
      }, 100)
    },
    validate() {
      return new Promise(async (resolve, reject) => {
        try {
          const valid = await this.$data.form.validateFields()
          resolve(!!valid)
        } catch (error) {
          reject(error)
        }
      })
    },
    async initCategoryAttribute() {
      const { categoryId, id } = JSON.parse(
        JSON.stringify(this.$props.category)
      )

      if (categoryId) {
        let { data } = await Goods.getShopeeCategoryAttribute(
          categoryId + '/' + this.$props.category.countryCode
        )
        data = data.map((e) => {
          this.$set(this.$data.catchOptions, e.attributeName, [])
          e.options = JSON.parse(e.options)
          // e.originalValue = JSON.parse(e.originalValue)
          e.translateValue = JSON.parse(e.translateValue)
          e.options = e.options.map((value, index) => {
            const tranVal =
              e.translateValue[index] === null ? value : e.translateValue[index]
            return e.options[index] + '--' + tranVal
          })
          return e
        })
        data = data.sort((a, b) => b.isMandatory - a.isMandatory)
        this.$data.categoryAttribute = data
        this.$nextTick(() => this.$emit('create', id, data))
      }
    }
  }
}
</script>
