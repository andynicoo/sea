<template>
  <a-spin :spinning="loading">
    <!-- {{ storeListSize }} -->
    <!-- 普通商家 -->
    <a-form :form="form">
      <a-form-item :label="$t('collect.store')">
        <a-cascader
          v-decorator="['storeId', { rules: storeIdRules }]"
          :options="basicStoreListSize"
          :show-search="{ filter }"
          :placeholder="$t('store.choseStore')"
          @change="handleSelectChange"
        />
      </a-form-item>

      <template v-if="categoryList">
        <a-form-item :label="$t('collect.productType')">
          <a-cascader
            @change="onChange"
            :options="categoryList"
            :load-data="loadData"
            :placeholder="$t('collect.pselectedType')"
            v-decorator="['categoryIds', { rules: categoryIdsRules }]"
            :fieldNames="{
              label: 'label',
              value: 'categoryId',
              children: 'children'
            }"
          />
        </a-form-item>
      </template>

      <template v-if="categoryAttributeList">
        <template v-for="category in categoryAttributeList">
          <a-form-item
            :key="category.attributeId"
            :label="`${category.attributeName}(${category.cnName})`"
          >
            <!-- 文本域 -->
            <template v-if="category.inputType == 'TEXT_FILED'">
              <a-input
                v-decorator="[
                  `${category.attributeId}`,
                  { rules: getAttributeRules(category) }
                ]"
              />
            </template>

            <!-- 下拉选择 -->
            <template v-else>
              <a-select
                show-search
                @search="handleSearch($event, category)"
                @popupScroll="onPopupScroll($event, category)"
                @focus="onFocus(category)"
                v-decorator="[
                  `${category.attributeId}`,
                  { rules: getAttributeRules(category) }
                ]"
              >
                <template
                  v-for="(ops, index) in catchOptions[category.attributeId]"
                >
                  <a-select-option :value="ops" :key="index">
                    {{ ops }}
                  </a-select-option>
                </template>
              </a-select>
            </template>
          </a-form-item>
        </template>
      </template>
    </a-form>

    <a-modal
      title="温馨提示"
      :visible="cnscModal"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="CNSC店铺授权"
    >
      <p>
        您选择的店铺已经升级为CNSC店铺，无法使用单店铺发布商品，请进行CNSC店铺授权，<a
          class="me-link"
          @click="openPage('/information/info?type=1&listId=3&newsId=2')"
          >查看操作手册>></a
        >
      </p>
    </a-modal>
  </a-spin>
</template>

<script>
import Goods from '@/api/goods'
import { getMixinsOptions } from '@/util'
import { mapState } from 'vuex'
import Store from '@/api/store'

export default {
  data() {
    return {
      loading: false,
      form: this.$form.createForm(this),
      storeList: [],
      categoryList: null,
      categoryAttributeList: null,
      storeIdRules: [
        { required: true, message: this.$t('collect.storeNotEmpty') }
      ],
      categoryIdsRules: [],
      catchOptions: {},
      // 当前店铺的countryCode
      countryCode: '',
      cnscModal: false,
      isCnsc: false
    }
  },
  computed: {
    getAttributeRules() {
      return ({ isMandatory, attributeName, cnName }) => [
        {
          required: isMandatory,
          message: `${attributeName}(${cnName})${this.$t('collect.notEmpty')}`
        }
      ]
    },
    // submitDisabled() {
    //   const { storeList, categoryList, categoryAttributeList } = this.$data
    //   return !!storeList && !!categoryList && !!categoryAttributeList
    // },
    ...mapState({
      basicStoreListSize: (state) => state.auth.basicStoreListSize
    })
  },
  async mounted() {},
  methods: {
    filter(inputValue, path) {
      return path.some(
        (option) =>
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      )
    },
    handleSelectChange(value, selectedOptions) {
      console.log(value, selectedOptions[1])
      // 当是cnsc的店铺时，阻塞流程，让用户去授权
      this.$data.isCnsc = selectedOptions[1].cnsc == 0 ? false : true

      this.$data.countryCode = value[0]
      this.$data.categoryList = null
      Goods.getShopeeCategoryList({ storeId: value[1] }).then(({ data }) => {
        this.$data.categoryList = this.handlerData(data)
      })
    },
    /**
     * 商品分类改变事件
     */
    async onChange(selectedOptions) {
      const { countryCode } = this.$data
      if (!selectedOptions.length)
        return (this.$data.categoryAttributeList = null)
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.$data.loading = true
      let { data } = await Goods.getShopeeCategoryAttribute(
        targetOption + '/' + countryCode
      )
      // targetOption+"/"+countryCode '4976' + '/' + 'MY'
      this.$data.loading = false
      data = data.map((element) => {
        if (element.options) element.options = JSON.parse(element.options)
        // if (element.originalValue)
        //   element.originalValue = JSON.parse(element.originalValue)
        if (element.translateValue)
          element.translateValue = JSON.parse(element.translateValue)
        return element
      })
      data = data.sort((a, b) => b.isMandatory - a.isMandatory)
      this.$data.categoryAttributeList = data
    },
    /**
     * 商品分类选择事件
     */
    async loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.$set(targetOption, 'loading', true)
      const storeId = this.$data.form.getFieldValue('storeId')[1]
      const params = { parentId: targetOption.categoryId, storeId }
      this.$data.loading = true
      let { data } = await Goods.getShopeeCategoryList(params)
      this.$data.loading = false
      data = this.handlerData(data)
      this.$set(targetOption, 'loading', false)
      this.$set(targetOption, 'children', data)
    },

    handlerData(data) {
      return data.map((e) => {
        e.label = `${e.enName}(${e.cnName})`
        e.isLeaf = !e.hasChildren
        return e
      })
    },
    /**
     * 下拉框滚动事件
     */
    onPopupScroll(event, { attributeId, options, translateValue }) {
      const { catchOptions } = this.$data
      if (options.length <= 50 && catchOptions.length > 0) {
        let totalLength = options.length
        this.$set(
          catchOptions,
          attributeId,
          getMixinsOptions(options, translateValue, totalLength)
        )
        return
      }
      const { target } = event
      const scrollHeight = target.scrollHeight - target.scrollTop
      const clientHeight = target.clientHeight
      if (scrollHeight - clientHeight <= 50 && options.length > 50) {
        let attributeOptions = catchOptions[attributeId]
        let totalLength = attributeOptions.length + 40
        this.$set(
          catchOptions,
          attributeId,
          getMixinsOptions(options, translateValue, totalLength)
        )
      }
    },
    /**
     * 下拉框聚焦事件
     */
    onFocus({ attributeId, options, translateValue }) {
      const { catchOptions } = this.$data
      this.$set(
        catchOptions,
        attributeId,
        getMixinsOptions(options, translateValue, 40)
      )
    },

    // 筛选brand
    handleSearch(value, { attributeId, options, translateValue }) {
      setTimeout(() => {
        const { catchOptions } = this.$data
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
        this.$set(catchOptions, attributeId, filtersOption)
      }, 300)
    },

    submit() {
      // 当是cnsc的店铺时，阻塞流程，让用户去授权
      if (this.$data.isCnsc) {
        this.$data.cnscModal = true
        return
      }
      return this.claimToNormalStore()
    },

    //认领到普通店铺
    claimToNormalStore() {
      return new Promise((resolve, reject) => {
        this.$data.form
          .validateFields()
          .then((res) => {
            let attribute
            let goodsCategoryId
            const { categoryAttributeList } = this.$data
            const { categoryIds, storeId } = res
            if (categoryAttributeList) {
              attribute = categoryAttributeList.map(
                ({ attributeId, attributeName }) => ({
                  attributeId,
                  value: res[attributeId],
                  attributeName
                })
              )
            }
            if (categoryIds && categoryIds.length) {
              goodsCategoryId = categoryIds[categoryIds.length - 1]
            }
            resolve({
              storeId: storeId[1],
              attribute,
              goodsCategoryId
            })
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    handleOk() {
      this.getShopeeAuthUrl('v2')
      this.$data.cnscModal = false
    },
    handleCancel() {
      this.$data.cnscModal = false
    },
    //授权操作
    async getShopeeAuthUrl(version) {
      const URLOPTS = {
        v1: 'getShopeeAuthLocalUrl',
        v2: 'getShopeeAuthUrlV2'
      }
      let { data } = await Store[URLOPTS[version]]()
      if (data) {
        this.openPage(data, '_blank')
      }
    }
  }
}
</script>
