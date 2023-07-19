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
      <div style="width: 350px">
        <p class="me-desc">
          {{ $t('toBeEdit.fenlei') }}:{{
            getCategoryStr(record, 'categoryNames')
          }}
        </p>
        <p>{{ $t('toBeEdit.brand') }}:{{ record.originalBrandName }}</p>
      </div>
    </template>
    <template v-slot:after="{ record, index }">
      <div style="width: 350px">
        <p v-if="record._categoryNames_">
          {{ $t('toBeEdit.fenlei') }}:{{
            getCategoryStr(record, '_categoryNames_')
          }}
        </p>
        <template v-if="record._brandId_">
          <p class="me-desc">
            <span class="me-ib"> {{ $t('toBeEdit.brand') }}: </span>
            <template>
              <!-- 修改品牌类目时，下拉品牌从下方form的品牌下来中获取 -->
              <!-- {{ record._brandId_ }}--{{ record._originalBrandName_ }} -->
              <a-select
                show-search
                @search="handleSearch($event, brandList)"
                class="me-ib"
                style="width: 200px"
                v-model="record._originalBrandName_"
                @popupScroll="onPopupScroll($event, brandList)"
                @focus="onFocus()"
                @change="selectChange($event, index)"
                :placeholder="$t('toBeEdit.chosebrand')"
                v-if="
                  form.getFieldValue('type') == 2 &&
                    form.getFieldValue('brand') != undefined
                "
              >
                <a-select-option
                  v-for="item in brandListOptions.brandListOption"
                  :key="`${item.display_brand_name}` + '|' + `${item.brand_id}`"
                >
                  {{ item.display_brand_name }}
                </a-select-option>
              </a-select>

              <!-- 统一设置为 自由品牌/无品牌时，先设置为no brand,点击时从当前分类获取下拉品牌 -->
              <a-select
                show-search
                @search="handleSearch($event, brandList)"
                class="me-ib"
                style="width: 200px"
                v-model="record._originalBrandName_"
                @popupScroll="onPopupScroll($event, brandList)"
                @focus="onFocus2(record)"
                :placeholder="$t('toBeEdit.chosebrand')"
                v-if="form.getFieldValue('type') == 1"
              >
                <a-select-option
                  v-for="item in brandListOptions.brandListOption"
                  :key="`${item.display_brand_name}` + '|' + `${item.brand_id}`"
                >
                  {{ item.display_brand_name }}
                </a-select-option>
              </a-select>
            </template>
          </p>
        </template>
      </div>
    </template>

    <template>
      <a-form :form="form">
        <!-- {{ brandList.length }}---
        {{ brandListOptions.brandListOption.length }} -->
        <a-form-item>
          <a-radio-group v-decorator="['type', { initialValue: 1 }]">
            <a-radio :value="1"> {{ $t('toBeEdit.tongyishezhi') }} </a-radio>
            <a-radio :value="2"> {{ $t('toBeEdit.xiugaibrand') }} </a-radio>
          </a-radio-group>
        </a-form-item>
        <template v-if="form.getFieldValue('type') === 2">
          <a-form-item :label="$t('toBeEdit.brandlist')">
            <a-cascader
              v-decorator="['categoryIds']"
              @change="onCategoryChange"
              :options="categoryOptions"
              :placeholder="$t('categoryAttrEdit.categoryEditValid2')"
              :fieldNames="{
                label: 'label',
                value: 'categoryId',
                children: 'children'
              }"
            />
          </a-form-item>
          <template v-if="brandList.length">
            <a-form-item :label="$t('toBeEdit.chosenewbrand')">
              <a-select
                show-search
                @search="handleSearch($event, brandList)"
                v-decorator="['brand']"
                :placeholder="$t('toBeEdit.chosebrand')"
                @popupScroll="onPopupScroll($event, brandList)"
                @focus="onFocus()"
              >
                <a-select-option
                  v-for="item in brandListOptions.brandListOption"
                  :key="`${item.display_brand_name}` + '|' + `${item.brand_id}`"
                >
                  {{ item.display_brand_name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </template>
        </template>
      </a-form>
    </template>
  </BaseTable>
</template>

<script>
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import Goods from '@/api/goods'
import { cloneDeep } from 'lodash'
import { createTree } from '@/util/index'

export default {
  mixins: [batchEditMixins],
  components: { BaseTable },
  data() {
    return {
      btnStyle: {
        top: 0,
        left: 0
      },
      form: this.$form.createForm(this),
      categoryOptions: [],
      attributeOptions: [], // 批量编辑处选择类目的时候获得的品牌[]
      catchCategoryNames: [],
      catchOptions: {},

      brandList: [],
      brandListOptions: {
        brandListOption: []
      }
    }
  },
  computed: {
    getCategoryStr() {
      return (record, field) => {
        if (record[field]) return record[field].join('>')
        return null
      }
    },
    getBrandStr() {
      return (record, field) => {
        if (record[field] && record[field][0]) {
          return record[field][0].value
        }
        return null
      }
    }
  },
  methods: {
    /**列表数据请求后置 */
    getTableDataAfter() {
      let { dataSource } = this.$data
      this.$data.dataSource = dataSource.map((data) => {
        data.attribute = data.attribute.sort(
          (a, b) => (b.attributeName == 'Brand') - (a.attributeName == 'Brand')
        )
        if (data.categoryNames) {
          data.categoryNames = data.categoryNames.reverse()
        }
        if (data.categoryIds) {
          data.categoryIds = data.categoryIds.reverse()
        }
        return data
      })
      this.$data.countryCode = dataSource[0].countryCode
      const params = {
        storeId: dataSource[0].storeId,
        countryCode: this.$data.countryCode
      }
      Goods.getCategoryListV2(params).then(({ data }) => {
        data = data.map((e) => {
          e.label = `${e.categoryDisplayName}(${e.cnName})`
          e.isLeaf = !e.hasChildren
          return e
        })
        this.$data.categoryOptions = createTree(data || [], 'categoryId')
      })
    },
    /**分类改变 */
    async onCategoryChange(value, selectedOptions) {
      const originVal = cloneDeep(value)
      const { dataSource } = this.$data
      this.form.setFieldsValue({
        brand: ''
      })
      // this.$data.countryCode = selectedOptions[0].countryCode
      this.$data.catchCategoryNames = selectedOptions.map((e) => {
        return `${e.categoryName}(${e.cnName})`
      })

      value = value[value.length - 1]
      let brandData = await Goods.getBrandV2(value, this.$data.countryCode)
      this.$data.brandList = brandData.data

      const params = {
        shopId: this.$data.dataSource[0].shopId,
        categoryIds: originVal
      }
      Goods.chooseCategory(params).then((res) => {
        console.log(res)
      })
    },
    /**下拉框滚动事件 */
    onPopupScroll(event, brandList) {
      const { brandListOptions } = this.$data
      const { target } = event
      const scrollHeight = target.scrollHeight - target.scrollTop
      const clientHeight = target.clientHeight
      if (scrollHeight - clientHeight <= 50 && brandList.length > 50) {
        let totalLength = brandListOptions.brandListOption.length + 50
        if (brandList.length != brandListOptions.brandListOption.length) {
          const arr = brandList.slice(
            brandListOptions.brandListOption.length,
            totalLength
          )
          this.$data.brandListOptions.brandListOption = this.$data.brandListOptions.brandListOption.concat(
            arr
          )
        }
      }
    },
    /**下拉框聚焦事件 */
    onFocus() {
      const { brandList } = this.$data
      this.$data.brandListOptions.brandListOption = brandList.slice(0, 50)
    },
    // 筛选brand
    handleSearch(value, brandList) {
      console.log(value)
      if (value == '') {
        return
      }
      setTimeout(() => {
        const { brandListOptions } = this.$data
        let totalLength = brandList.length
        var filtersOption = []
        for (var ind = 0; ind < totalLength; ind++) {
          var curOption =
            brandList[ind].display_brand_name +
            '--' +
            brandList[ind].original_brand_name
          if (curOption.toLowerCase().indexOf(value.toLowerCase()) > -1) {
            filtersOption.push(brandList[ind])
          }
        }
        // this.$set(catchOptions, attributeId, filtersOption)
        // const brandListOption = brandListOptions.brandListOption
        // console.log(filtersOption)
        this.$set(brandListOptions, 'brandListOption', filtersOption)
      }, 300)
    },
    /**下拉框聚焦事件 */
    async onFocus2(record) {
      let { categoryId, _categoryId_ } = record
      categoryId = _categoryId_ || categoryId
      let brandData = await Goods.getBrandV2(categoryId, this.$data.countryCode)
      this.$data.brandList = brandData.data

      this.$data.brandListOptions.brandListOption = this.$data.brandList.slice(
        0,
        50
      )
    },
    /**取消 */
    onCancel() {
      this.$emit('cancel')
    },
    selectChange(value, index) {
      this.$data.dataSource[index].brandId = value.split('|')[1]
    },
    /**设置默认值 */
    setDefaultValu() {
      const { dataSource } = this.$data
      dataSource.forEach((element) => {
        if (!element._change_) {
          this.$set(element, '_change_', true)
          // if (!element._attribute_) {
          //   this.$set(element, '_attribute_', element.attribute)
          // }
          if (!element._originalBrandName_) {
            this.$set(element, '_originalBrandName_', element.originalBrandName)
          }
          if (!element._brandId_) {
            this.$set(element, '_brandId_', element.brandId)
          }
          if (!element._categoryNames_) {
            this.$set(
              element,
              '_categoryNames_',
              element.categoryNames ? element.categoryNames : null
            )
          }
          if (!element._categoryId_) {
            this.$set(element, '_categoryId_', element.categoryId)
          }
          if (!element._categoryIds_) {
            this.$set(
              element,
              '_categoryIds_',
              element.categoryIds ? element.categoryIds : null
            )
          }
        }
      })
    },
    /**保存 */
    async onSave() {
      this.setDefaultValu()
      const { dataSource, selectedRowKeys, form } = this.$data
      let data = cloneDeep(dataSource).filter(({ id }) => {
        return selectedRowKeys.includes(id)
      })
      const type = form.getFieldValue('type')
      data = data.map((ele) => {
        if (ele.categoryNames && ele.categoryNames.length) {
          ele.categoryNames = ele._categoryNames_
          ele.categoryId = ele._categoryId_
          ele.categoryIds = ele._categoryIds_
          if (ele._originalBrandName_.indexOf('|') > -1) {
            ele.originalBrandName = ele._originalBrandName_.split('|')[0]
          } else {
            ele.originalBrandName = ele._originalBrandName_
            ele.brandId = ele._brandId_
          }
          if (type == 1) ele.brandId = 0
        }

        return ele
      })
      console.log(data)
      let res = await Goods.handleEditBatch(data)
    },
    /**预览 */
    onPreview() {
      this.setDefaultValu()
      const { form, dataSource, catchCategoryNames } = this.$data
      form.validateFields().then(({ type, categoryIds, brand }) => {
        if (type === 2 && brand == undefined) {
          this.$message.error(this.$t('toBeEdit.chosebrand'))
          return false
        }
        dataSource.forEach((product) => {
          this.$set(product, '_categoryNames_', product.categoryNames)
          this.$set(product, '_categoryId_', product.categoryId)
          this.$set(product, '_attribute_', product.attribute)
          if (type === 1) {
            // 有分类时，就有品牌，可选择品牌,默认为空置的No brand,下拉时请求全部
            if (product.categoryNames) {
              this.$set(product, '_originalBrandName_', 'NoBrand')
              this.$set(product, '_brand_id_', 0)
            }
          } else {
            // const attr = cloneDeep(attributeOptions)
            const categoryId = categoryIds[categoryIds.length - 1]
            this.$set(product, '_categoryIds_', categoryIds)
            this.$set(product, '_categoryId_', categoryId)
            this.$set(product, '_categoryNames_', catchCategoryNames)
            this.$set(product, '_brandId_', brand.split('|')[1])
            this.$set(product, '_originalBrandName_', brand.split('|')[0])
          }
        })
      })
    },
    initData() {
      this.getTableData()
    },
    getArrayByKey(key) {
      let newArr = []
      const { brandList } = this.$data
      brandList.map((ele) => {
        newArr.push(ele[key])
      })
      return newArr
    }
  }
}
</script>

<style lang="scss" scoped>
.me-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-width: 250px;
  max-width: 350px;
}
.replace-input {
  width: 390px;
  margin-right: 10px;
}
.radioStyle {
  display: block;
  height: 40px;
  line-height: 40px;
  .input {
    width: 100px;
    margin-right: 10px;
    margin-left: 10px;
  }
}
</style>
