<template>
  <BaseTable
    :columns="getColumns"
    :dataSource="dataSource"
    :pagination="getPagination"
    :loading="tableLoading"
    :rowSelection="rowSelection"
    :onCancel="onCancel"
    :onSave="onSave"
    :onPreview="onPreview"
    :onChange="onChange"
    :saveBtnText="$t('batchEditOption.save')"
    :saveMsg="$t('common.batchEditSuccess')"
    :btnStyle="btnStyle"
    @initData="initData"
  >
    <template v-slot:before="{ record }">
      <p>
        {{ getcategoryNames(record.categoryNames) }}
      </p>
      <template v-if="record.attribute">
        <p v-for="attr in record.attribute" :key="attr.attributeId">
          <span>{{ getAttrItemName(attr) }}</span>
          ：
          <span>{{ getAttrItemValue(attr) }}</span>
        </p>
      </template>
    </template>
    <template v-slot:after="{ record }">
      <p>
        {{ getcategoryNames(record._categoryNames_) }}
      </p>
      <template v-if="record._attribute_">
        <p v-for="attr in record._attribute_" :key="attr.attributeId">
          <span>{{ getAttrItemName(attr) }}</span>
          ：
          <span>{{ getAttrItemValue(attr) }}</span>
        </p>
      </template>
    </template>
    <template>
      <a-spin :spinning="formLoading">
        <a-form-model
          :model="formModel"
          ref="ruleForm"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-form-model-item
            :label="$t('categoryAttrEdit.useNewcategory')"
            :rules="[{ required: true, message: '请选择类目' }]"
          >
            <!-- <a-cascader
              @change="onCategoryChange"
              :options="categoryOptions"
              :load-data="loadData"
              :placeholder="$t('categoryAttrEdit.categoryEditValid2')"
              v-decorator="['categoryIds', { rules: categoryIdsRules }]"
              :fieldNames="{
                label: 'label',
                value: 'categoryId',
                children: 'children'
              }"
            /> -->
            <a-cascader
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
  </BaseTable>
</template>
<script>
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import Goods from '@/api/goods'
import FormItem from '@/components/ShopeeTypeForm/FormItem'
import Product from '@/api/product'
import { cloneDeep } from 'lodash'
import { getMixinsOptions, createTree } from '@/util'
import { initFormItem } from '@/components/ShopeeTypeForm/common'

export default {
  mixins: [batchEditMixins],
  components: { BaseTable, FormItem },
  data() {
    return {
      // form: this.$form.createForm(this),
      btnStyle: {
        top: 10,
        left: 137
      },
      categoryOptions: [],
      categoryAttribute: [],
      categoryNames: [],
      formLoading: false,
      formModel: {},
      catchOptions: {},
      categoryIdsRules: [
        {
          required: true,
          message: this.$t('categoryAttrEdit.categoryIdsRule1')
        }
      ],

      // 当前店铺的countryCode
      countryCode: ''
    }
  },
  computed: {
    getAttributeRules() {
      return ({ isMandatory, attributeName, cnName }) => [
        {
          required: isMandatory,
          message: `
            ${cnName}${this.$t('categoryAttrEdit.notEmpty')}
          `
          // message: `
          //   ${attributeName}(${cnName})${this.$t('categoryAttrEdit.notEmpty')}
          // `
        }
      ]
    },
    getcategoryNames() {
      return (names) => {
        if (names && Array.isArray(names)) {
          return names.join(' / ')
        }
        return null
      }
    },
    getAttrItemName() {
      return ({ attributeName = '--' }) => {
        return `${attributeName}`
      }
    },
    getAttrItemValue() {
      return ({ attributeValueList = [] }) => {
        let arr = []
        if (attributeValueList) {
          attributeValueList.map((item) => {
            let name = ''
            if (item.displayValueName) {
              name = item.displayValueName
            } else if (item.originalValueName) {
              name = item.originalValueName + (item.valueUnit || '')
            }
            arr.push(name)
          })
        }
        let name = arr.toString() || ''
        return `${name}`
      }
    }
  },
  methods: {
    /**列表数据请求后置 */
    async getTableDataAfter() {
      let { dataSource } = this.$data
      this.$data.dataSource = dataSource.map((data) => {
        if (data.categoryNames) {
          data.categoryNames = data.categoryNames.reverse()
        }
        if (data.categoryIds) {
          data.categoryIds = data.categoryIds.reverse()
        }
        return data
      })
      try {
        const { data } = await Product.getCategorySelectV2({
          countryCode: dataSource[0].countryCode
        })
        this.categoryOptions = createTree(data || [], 'categoryId')
      } catch (error) {
        console.error(error)
      }
    },
    /**加载分类数据 */
    async loadData(selectedOptions) {
      const { dataSource } = this.$data
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      const params = {
        storeId: dataSource[0].storeId,
        parentId: targetOption.categoryId
      }
      let { data } = await Goods.getShopeeCategoryList(params)
      data = data.map((e) => {
        e.label = `${e.cnName}`
        e.isLeaf = !e.hasChildren
        return e
      })
      targetOption.loading = false
      targetOption.children = data
      this.$data.categoryOptions = [...this.$data.categoryOptions]
    },
    /**分类改变 */
    async onCategoryChange(value, selectedOptions) {
      this.formModel = Object.assign({}, { categoryIds: value })
      // 分类改变，清空已选
      this.formItem = []
      this.$data.countryCode = this.$data.dataSource[0].countryCode
      this.$data.categoryNames = selectedOptions.map((e) => {
        // return `${e.categoryName}(${e.cnName})`
        return `${e.cnName}`
      })
      let id = value[value.length - 1]
      this.$data.formLoading = true
      let res
      if (this.$data.countryCode == 'CNSC') {
        res = await Product.getCnscAttributeV2(id, this.$data.countryCode)
      } else {
        res = await Product.getAttributeV2(id, this.$data.countryCode)
      }
      this.categoryAttribute = initFormItem(res.data, false)
      this.$data.formLoading = false
      const params = {
        shopId: this.$data.dataSource[0].shopId,
        categoryIds: value
      }
      Goods.chooseCategory(params).then((res) => {
        console.log(res)
      })
    },
    /**保存 */
    async onSave() {
      this.setDefaultValue()
      if (!this.formModel.categoryIds) {
        return '请选择类目'
      }
      const {
        dataSource,
        selectedRowKeys,
        categoryNames,
        categoryAttribute
      } = this.$data

      let _data = dataSource.filter(({ id }) => selectedRowKeys.includes(id))
      _data = cloneDeep(_data).map((element) => {
        const categoryId = this.formModel.categoryIds[
          this.formModel.categoryIds.length - 1
        ]
        element.categoryIds = this.formModel.categoryIds
        element.categoryId = categoryId
        element.categoryNames = categoryNames
        element['attribute'] = categoryAttribute
          .filter((item) => this.formModel[item.key])
          .map((item) => {
            const val = this.formModel[item.attributeId]
            return {
              attributeId: item.attributeId,
              attributeName: item.cnName,
              attributeValueList: val
            }
          })
        return element
      })
      await Goods.handleEditBatch(_data)
    },
    /**预览 */
    onPreview() {
      this.setDefaultValue()
      const { dataSource, categoryNames, categoryAttribute } = this.$data
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          dataSource.forEach((element) => {
            const categoryId = this.formModel.categoryIds[
              this.formModel.categoryIds.length - 1
            ]
            this.$set(element, '_categoryIds_', this.formModel.categoryIds)
            this.$set(element, '_categoryId_', categoryId)
            this.$set(element, '_categoryNames_', categoryNames)
            let attribute = []
            categoryAttribute
              .filter((item) => this.formModel[item.key])
              .map((item) => {
                const val = this.formModel[item.attributeId].filter(
                  (att) => att.originalValueName
                )
                if (val.length !== 0) {
                  attribute.push({
                    attributeId: item.attributeId,
                    attributeName: item.cnName,
                    attributeValueList: val
                  })
                }
              })
            this.$set(element, '_attribute_', attribute)
          })
        }
      })
    },
    /**设置默认值 */
    setDefaultValue() {
      const { dataSource } = this.$data
      dataSource.forEach((element) => {
        if (!element._change_) {
          this.$set(element, '_change_', true)
          this.$set(element, '_categoryIds_', element.categoryIds)
          this.$set(element, '_categoryNames_', element.categoryNames)
          this.$set(element, '_attribute_', element.attribute)
        }
      })
    },
    initData() {
      this.getTableData()
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

<style lang="scss" scoped>
.me-category-label {
  margin: 12px;
  ::v-deep .ant-form-item-label {
    line-height: 20px;
  }
}
</style>
