<template>
  <div class="shopee-form">
    <a-form-model
      ref="ruleForm"
      :model="formModel"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      :layout="layout"
    >
      <!-- 当只有一个输入框不能回车提交刷新网页 -->
      <input type="text" style="display: none;" />
      <!-- <a-row> -->
      <!-- <a-col span="24"> -->
      <a-form-model-item
        v-if="editType == '1'"
        prop="storeId"
        :label="$t('edit.chooseStore')"
      >
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
      <!-- 巴西类目暂时不支持编辑 -->
      <template v-if="isCnscDisabled && product.countryCode === 'BR'">
        <a-form-model-item :label="$t('edit.chooseCategories')">
          <span class="me-status-skip">当前站点类目正在更新中</span>
        </a-form-model-item>
      </template>
      <template v-else>
        <a-form-model-item
          :label="$t('edit.chooseCategories')"
          prop="categoryIds"
          :rules="[{ required: true, message: '请选择类目' }]"
        >
          <CategroyCascader
            v-model="formModel.categoryIds"
            @change="onCategoryIdsChange"
            :options="categoryOptions"
            :recommendList.sync="recommendCategoryList"
            :disabled="isCnscDisabled"
            :search="getCategoryRecommend"
            :showRecomend="!isCnscStore"
            :shopId="product.shopId"
          ></CategroyCascader>
        </a-form-model-item>
      </template>
      <!-- </a-col> -->
      <a-form-model-item
        v-if="showBrand && !isCnscStore"
        :label="$t('edit.brand')"
        prop="brandId"
        :rules="[{ required: true, message: '请选择' }]"
      >
        <BrandSelect v-model="formModel.brandId" :brandList.sync="brandList" />
      </a-form-model-item>
      <template v-for="item in formItem">
        <!-- <a-col :key="item.key" :span="item.span || 24"> -->
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
        <!-- </a-col> -->
      </template>
      <div v-if="$scopedSlots.button" class="button">
        <slot name="button" />
      </div>
      <!-- </a-row> -->
    </a-form-model>
  </div>
</template>

<script>
import FormItem from './FormItem'
import BrandSelect from './BrandSelect'
import Cnsc from '@/api/cnsc'
import api from '@/api/product'
import Goods from '@/api/goods'
import { mapState } from 'vuex'
import { createTree } from '@/util/index'
import CategroyCascader from './CategroyCascader'
import { initFormItem, initSetFormModel } from './common'
import moment from 'moment'

const initFormModel = {
  brandId: undefined
}
export default {
  name: 'ShopeeForm',
  components: {
    FormItem,
    BrandSelect,
    CategroyCascader
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
    layout: {
      type: String,
      default: 'horizontal'
    },
    isCnscStore: {
      type: Boolean,
      default: false
    },
    isCnscDisabled: {
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
  data() {
    return {
      formItem: [],
      categoryOptions: [],
      categoryList: [], //类目的一维list
      brandList: [],
      renderedOptions: [],
      searchVal: '',
      filterDataList: [],
      formModel: {},
      rules: {},
      unWatchProduct: null,
      editType: this.$route.query.edit,
      recommendCategoryList: []
    }
  },
  computed: {
    ...mapState({
      storeList: (state) => state.product.storeList,
      shopItemLimit: (state) => state.vars?.shopItemLimit,
      storeLimit: (state) => state.product.storeLimit
    }),
    showBrand({ brandList }) {
      return !!brandList.length
    }
  },
  created() {},
  mounted() {
    // 只监听一次变化
    this.unWatchProduct = this.$watch('product', this.init)
    if (this.$route.path === '/goods/cnsc-edit') {
      this.init()
    }
  },
  methods: {
    init(val) {
      console.log('第一次变化', val)
      this.initCategory()
      this.getCategoryOptions()
      this.unWatchProduct()
      if (!this.isCnscStore) {
        // this.getCategoryRecommend()
      }
    },
    async initCategory() {
      const { categoryId, categoryIds, attribute = [], brandId } = this.product
      if (!categoryId) {
        this.$store.commit('clearVars', 'shipLimit')
        return
      }
      this.formModel = initSetFormModel(attribute)
      this.getCategortList(categoryId)
      if (!this.isCnscStore) {
        this.getBrandList(categoryId, this.product.countryCode)
      }
      this.$set(this.formModel, 'categoryIds', categoryIds)
      this.$set(this.formModel, 'categoryId', categoryId)
      this.$set(this.formModel, 'brandId', brandId)
      this.setShipLimit()
    },
    // 获取类目属性元素
    async getCategortList(categoryId) {
      let getAttributeApi = api.getAttributeV2
      if (this.isCnscStore) {
        getAttributeApi = Cnsc.getAttribute
      }
      try {
        let { data } = await getAttributeApi(
          categoryId,
          this.product.countryCode
        )
        // 如果是cnsc不可编辑，则不做校验
        if (this.isCnscDisabled) {
          data &&
            data.map((item) => {
              item.isMandatory = false // 不校验
            })
        }
        this.formItem = initFormItem(data || [], this.isCnscDisabled)
      } catch (error) {
        console.error(error)
      }
    },
    validate() {
      return new Promise((resolove, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            const obj = this.formatParams()
            this.$emit('submit', obj)
            resolove(obj)
          } else {
            reject()
          }
        })
      })
    },
    formatParams() {
      const { categoryIds = null } = this.formModel
      const categoryId = categoryIds
        ? categoryIds[categoryIds.length - 1]
        : null
      const attribute = this.formItem
        .filter((item) => {
          const val = this.formModel[item.key]

          return val?.some((it) => it.originalValueName) //必须有值才行,只有单位会报错
        })
        .map((item) => {
          // 先拷贝一下避免删除源数据
          let val = [...this.formModel[item.attributeId]].map((it) => {
            // 修改日期保存值为时间戳
            if (item.attributeType === 'DATE_TYPE') {
              it.displayValueName = moment(it.displayValueName).valueOf()
              it.originalValueName = moment(it.originalValueName).valueOf()
              it.key = moment(it.key).valueOf()
            }
            return it
          })
          // 出参去除key与displayValueName
          val = val.map((it) => {
            Reflect.deleteProperty(it, 'key')
            Reflect.deleteProperty(it, 'displayValueName')
            return it
          })
          return {
            attributeId: item.attributeId,
            attributeName: item.cnName,
            attributeValueList: val
          }
        })
      let brandName = this.brandList.filter((e) => {
        return this.formModel.brandId == e.brand_id
      })
      const obj = {
        attribute,
        categoryIds,
        categoryId,
        brandId: this.formModel.brandId ?? null,
        originalBrandName: brandName[0]?.original_brand_name
      }
      return obj
    },
    // 保存不做校验
    async save() {
      const params = this.formatParams()
      this.$emit('submit', params)
      return Promise.resolve(params)
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    onCategoryIdsChange(val) {
      this.formModel = { ...initFormModel }
      this.$set(this.formModel, 'categoryIds', val)
      this.formItem = []
      if (!val.length) return
      this.getCategortList(val.slice(-1), true)
      this.formModel.categoryId = val.slice(-1)[0]
      this.setShipLimit()
      if (!this.isCnscStore) {
        this.getBrandList(val.slice(-1), this.product.countryCode)
      }
    },
    // 获取类目数据
    async getCategoryOptions() {
      let getCategoryApi = api.getCategorySelectV2
      if (this.isCnscStore) {
        getCategoryApi = Cnsc.getCnscCateAllList
      }
      try {
        const { data } = await getCategoryApi({
          countryCode: this.product.countryCode
        })
        this.categoryList = data || []
        this.categoryOptions = createTree(data || [], 'categoryId')
      } catch (error) {
        console.error(error)
      }
    },
    async setShipLimit() {
      const { shopId } = this.product
      const { categoryId } = this.formModel
      try {
        const { data } = await api.getShipLimit({ shopId, categoryId })
        const { min_limit, max_limit, non_pre_order_days_to_ship: daysToShip } =
          data || {}
        const shipLimit = {
          shipMinLimit: min_limit,
          shipMaxLimit: max_limit,
          daysToShip
        }
        console.log(min_limit, max_limit, shipLimit)
        this.$store.commit('setVars', {
          shipLimit
        })
      } catch (error) {
        console.error(error)
      }
    },
    // 获取类目推荐
    async getCategoryRecommend() {
      const { countryCode, name, shopId } = this.product
      try {
        const { data } = await api.getCategoryRecommend({
          countryCode,
          name,
          shopId
        })
        // this.formModel.categoryIds ??= data || []
        this.recommendCategoryList = data || []
        return Promise.resolve(data)
      } catch (error) {
        console.error(error)
      }
    },
    // 品牌下拉数据
    async getBrandList(id, countryCode) {
      try {
        const { data } = await Goods.getBrandV2(id, countryCode)
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
    filter(inputValue, path) {
      return path.some(
        (option) =>
          option.cnName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      )
    }
  }
}
</script>

<style lang="less" scoped>
.shopee-form {
  .form-title {
    font-weight: 700;
    color: #333;
    font-size: 17px;
  }
  .button {
    display: inline-block;
    margin-top: 3px;
  }
  /deep/.ant-tag-blue {
    border-color: @primary-color;
    color: @primary-color;
    background-color: rgba(255, 114, 13, 0.1);
  }
  /deep/ .ant-select-dropdown-menu {
    padding-left: unset;
  }
}
</style>
