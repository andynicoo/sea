<template>
  <a-spin :spinning="spinning">
    <a-form :form="form">
      <a-form-item
        props="categoryIds"
        :label="$t('batchEdit.categoryEditValid1')"
      >
        <a-cascader
          @change="onChange"
          :options="dataOptions"
          :load-data="loadData"
          :placeholder="$t('batchEdit.categoryEditValid2')"
          v-decorator="[
            'categoryIds',
            {
              rules: [
                { required: true, message: $t('batchEdit.categoryEditValid3') }
              ]
            }
          ]"
          :fieldNames="{
            label: 'label',
            value: 'categoryId',
            children: 'children'
          }"
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
              v-decorator="[
                item.attributeName,
                {
                  rules: [
                    {
                      required: item.isMandatory,
                      message: `${item.attributeName}(${item.cnName})${$t(
                        'batchEdit.categoryEditValid3'
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
              @popupScroll="onPopupScroll($event, item)"
              @focus="onFocus(item)"
              v-decorator="[
                item.attributeName,
                {
                  rules: [
                    {
                      required: item.isMandatory,
                      message: `${item.attributeName}(${item.cnName})${$t(
                        'batchEdit.categoryEditValid3'
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
  </a-spin>
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
      dataOptions: [],
      categoryNames: [],
      categoryAttribute: [],
      spinning: false,
      catchOptions: {}
    }
  },
  async mounted() {
    const { storeId } = this.$route.query
    let options = []
    if (this.$props.category) {
      if (this.$props.category.categoryIds)
        options = this.$props.category.categoryIds
    }
    let __options = JSON.parse(JSON.stringify(options))
    let diff__options = JSON.parse(JSON.stringify(options))
    __options = __options.reverse()
    diff__options = diff__options.reverse()
    __options[0] = null

    let __options_res = __options.map(async (element, index) => {
      let { data } = await Goods.getShopeeCategoryList({
        parentId: diff__options[index - 1],
        storeId
      })
      data = data.map((e) => {
        e.label = `${e.enName}(${e.cnName})`
        e.isLeaf = !e.hasChildren
        return e
      })
      return data
    })

    this.$data.spinning = true
    Promise.all(__options_res).then((res) => {
      this.$data.categoryNames = diff__options.map((e, i) => {
        let current = res[i]
        let { categoryName, cnName } = current.find(
          (ele) => ele.categoryId === e
        )
        return `${categoryName}(${cnName})`
      })

      res.reduce((pre, next, index) => {
        const current = pre.find(
          ({ categoryId }) => categoryId == diff__options[index - 1]
        )
        current.children = next
        return next
      })
      this.$data.spinning = false
      this.$data.dataOptions = res[0]
    })

    if (this.$props.category && this.$props.category.categoryId) {
      const { categoryId, attribute } = this.$props.category
      let { data } = await Goods.getShopeeCategoryAttribute(
        categoryId + '/' + this.$props.category.countryCode
      )
      data = data.map((e) => {
        this.$set(this.$data.catchOptions, e.attributeName, [])
        e.options = JSON.parse(e.options)
        // e.originalValue = JSON.parse(e.originalValue)
        e.translateValue = JSON.parse(e.translateValue)
        return e
      })
      data = data.sort((a, b) => b.isMandatory - a.isMandatory)
      this.$data.categoryAttribute = data

      if (attribute && attribute.length) {
        data.forEach((e) => {
          let __a = attribute.find((a) => a.attributeId === e.attributeId)
          this.$nextTick(() => {
            this.$data.form.setFieldsValue({ [e.attributeName]: __a.value })
          })
        })
      }
    }

    this.$data.form.setFieldsValue({ categoryIds: diff__options })
  },
  methods: {
    onPopupScroll(event, { attributeName, options, translateValue }) {
      const { catchOptions } = this.$data
      if (options.length <= 50 && catchOptions.length > 0) {
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
    async loadData(selectedOptions) {
      const { storeId } = this.$route.query
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      let { data } = await Goods.getShopeeCategoryList({
        parentId: targetOption.categoryId,
        storeId
      })
      data = data.map((e) => {
        e.label = `${e.enName}(${e.cnName})`
        e.isLeaf = !e.hasChildren
        return e
      })
      targetOption.loading = false
      targetOption.children = data
      this.dataOptions = [...this.dataOptions]
    },
    onSubmit() {
      if (this.$data.spinning) return
      this.$data.form.validateFields().then((data) => {
        let { categoryNames, categoryAttribute } = this.$data
        let categoryIds = data.categoryIds
        const __categoryAttribute = categoryAttribute.map(
          ({ attributeId, attributeName }) => ({
            attributeId,
            value: data[attributeName] ? data[attributeName].split('--')[0] : null
          })
        )

        categoryNames = categoryNames.reverse()
        categoryIds = categoryIds.reverse()
        this.$emit('submit', {
          data: categoryAttribute,
          categoryIds,
          categoryNames,
          attribute: __categoryAttribute,
          category: this.$props.category
        })
      })
    },
    async onChange(value, selectedOptions) {
      this.$data.categoryIds = value
      this.$data.categoryNames = selectedOptions.map(
        (e) => `${e.categoryName}(${e.cnName})`
      )
      this.$data.spinning = true
      let { data } = await Goods.getShopeeCategoryAttribute(
        value[value.length - 1] + '/' + selectedOptions[0].countryCode
      )
      this.$data.spinning = false
      data = data.map((e) => {
        this.$set(this.$data.catchOptions, e.attributeName, [])
        e.options = JSON.parse(e.options)
        e.originalValue = JSON.parse(e.originalValue)
        e.translateValue = JSON.parse(e.translateValue)
        e.options = e.options.map((value, index) => {
          const tranVal =
            e.translateValue[index] === null ? value : e.translateValue[index]
          return e.options[index] + '--' + tranVal
        })
        this.$data.form.setFieldsValue({ [e.attributeName]: null })
        return e
      })
      data = data.sort((a, b) => b.isMandatory - a.isMandatory)
      this.$data.categoryAttribute = data
    }
  }
}
</script>
