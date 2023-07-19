<template>
  <a-spin :spinning="productLoading">
    <div class="goods-edit-container me-pa-2">
      <div class="base goods-edit-left">
        <div class="me-pb-4">
          <Breadcrumb :breadList="breadList" />
          <!-- 商品源 start -->
          <div class="me-card">
            <a-tabs v-if="editType === '10'" type="card">
              <a-tab-pane
                v-for="item in tabsList"
                :key="item.merchant_id"
                :tab="item.merchant_name"
              ></a-tab-pane>
            </a-tabs>
            <h2 class="me-sub-title me-mt-3" id="goods-source">
              {{ $t('edit.productSource') }}
            </h2>
            <ProductSourceForm v-model="product" />
          </div>
          <!-- 商品源 end -->
          <!-- 商品基本信息 -->
          <div class="goods-base-info me-card">
            <h2 class="me-sub-title me-mt-3" id="goodsBaseInfo">
              {{ $t('edit.basicInfo') }}
            </h2>
            <GoodsBaseInfo v-model="product" ref="goodsBaseInfoForm" />
          </div>
          <!-- 普通店铺和类目 start -->
          <!-- <template v-if="editType != 0 && storeType == 'normal'">
            <h2 class="me-sub-title me-mt-3" id="StoreCategoryForm">
              {{ $t('edit.storesCategories') }}
            </h2>
            <template v-if="!isEmpty(product)">
              <StoreCategoryForm ref="storeCategoryForm" v-model="product" />
            </template>
          </template> -->
          <!-- 店铺和类目 end -->

          <!-- CNSC店铺和类目 -->
          <!-- <template v-if="editType != 0 && storeType == 'cnsc'">
            <h2 class="me-sub-title me-mt-3" id="StoreCategoryForm">
              {{ $t('edit.storesCategories') }}
            </h2>
            <template v-if="!isEmpty(product)">
              <CnscCategoryForm ref="storeCategoryForm" v-model="product" />
            </template>
          </template> -->

          <!-- 商品信息 start -->
          <!-- <h2 class="me-sub-title me-mt-3">{{ $t('edit.productInfo') }}</h2>
          <ProductInfoForm ref="productInfoForm" v-model="product" /> -->
          <!-- 商品信息 end -->

          <!-- 媒体管理 start -->
          <div class="me-card" v-if="product.createTime">
            <h2 class="me-sub-title me-mt-3" id="mediaManagerForm">
              {{ $t('edit.mediaManage') }}
            </h2>
            <MediaManagerForm ref="mediaManagerForm" v-model="product" />
          </div>
          <!-- 媒体管理 end -->

          <!-- 商品规格 start -->
          <div class="me-card">
            <h2 class="me-sub-title me-mt-3" id="productSpecForm">
              {{ $t('edit.productSpecs') }}
            </h2>
            <template v-if="!isEmpty(product)">
              <ProductSpecForm
                ref="productSpecForm"
                v-model="product"
                :labelCol="labelCol"
              />
            </template>
          </div>
          <!-- 商品规格 end -->

          <!-- 附加信息 start -->
          <div class="me-card">
            <h2 class="me-sub-title me-mt-3" id="extraInfoForm">
              {{ $t('edit.extraInfo') }}
            </h2>
            <ExtraInfoForm ref="extraInfoForm" v-model="product" />
          </div>
          <!-- 附加信息 end -->
          <!-- 按钮组 start -->
          <a-affix
            :offset-bottom="0"
            class="custom-affix"
            @change="affixChange"
          >
            <div
              class="button-group"
              :class="{ 'button-group-fixed': affixFixed }"
            >
              <a-space>
                <!-- 普通商品保存  -->
                <template v-if="storeType == 'normal'">
                  <a-button :loading="saveLoading" @click="onSave">
                    {{ $t('edit.save') }}
                  </a-button>
                </template>

                <!-- cnsc保存 -->
                <template v-if="storeType == 'cnsc'">
                  <a-button :loading="saveLoading" @click="onSaveCnsc()">
                    {{ $t('edit.save') }}
                  </a-button>
                  <a-button
                    :loading="saveLoading"
                    @click="onSaveAndPublishCnsc()"
                    type="primary"
                  >
                    {{ $t('edit.savePublish') }}
                  </a-button>
                </template>

                <!-- 采集箱商品保存 start -->
                <template v-if="editType == 0">
                  <a-button :loading="saveLoading" @click="onGatherSave(false)">
                    {{ $t('edit.save') }}
                  </a-button>
                </template>
                <!-- 采集箱商品保存 end -->

                <!-- 采集认领到店铺||CNSC -->
                <template v-if="editType == 0">
                  <!-- <a-dropdown
                    :getPopupContainer="(targetNode) => targetNode.parentNode"
                  >
                    <a-menu slot="overlay">
                      <a-sub-menu key="1" :title="$t('collect.claimToShop')">
                        <a-menu-item
                          @click="onSaveAndClaim(store)"
                          :key="store.storeId"
                          v-for="store in basicStoreList"
                        >
                          {{
                            store.storeAlias
                              ? store.storeAlias
                              : store.storeName
                          }}
                        </a-menu-item>
                      </a-sub-menu>
                      <a-sub-menu
                        key="2"
                        :title="$t('collect.claimToMerchant')"
                      >
                        <a-menu-item
                          @click="onSaveAndClaimCnsc(store)"
                          :key="store.merchant_id"
                          v-for="store in tabsList"
                        >
                          {{ store.merchant_name }}
                        </a-menu-item>
                      </a-sub-menu>
                    </a-menu> -->
                  <a-button
                    :loading="gatherSaveClaimLoading"
                    type="primary"
                    @click="onSaveAndClaimCnsc"
                  >
                    {{ $t('edit.saveClaim') }}
                  </a-button>
                  <!-- </a-dropdown> -->
                </template>

                <!-- 在线商品更新编辑 -->
                <template v-if="editType == 1">
                  <a-button
                    :loading="saveLoading"
                    @click="onUpdate"
                    type="primary"
                  >
                    {{ $t('edit.update') }}
                    <a-icon type="arrow-up" />
                  </a-button>
                </template>

                <!-- 商品编辑 -->
                <template
                  v-if="
                    (editType == 2 || editType == 3) && storeType == 'normal'
                  "
                >
                  <a-button
                    :loading="publishLoading"
                    @click="onPublish"
                    type="primary"
                  >
                    {{ $t('edit.savePublish') }}
                  </a-button>
                </template>

                <!-- 非采集编辑 && !$route.query.merchantId -->
                <template v-if="editType > 1">
                  <a-dropdown
                    :getPopupContainer="(targetNode) => targetNode.parentNode"
                  >
                    <a-menu slot="overlay" v-if="$route.query.merchantId">
                      <a-menu-item @click="onTranslate({ lang: 'en' })">
                        英语
                      </a-menu-item>
                      <a-menu-item @click="onTranslate({ lang: 'zh' })">
                        简体中文
                      </a-menu-item>
                      <a-menu-item
                        @click="translateOrigin()"
                        v-if="translateCount > 0"
                      >
                        恢复到原文
                      </a-menu-item>
                    </a-menu>
                    <a-menu slot="overlay" v-else>
                      <a-menu-item
                        :key="target.lang"
                        v-for="target in targetLangListAli"
                        @click="onTranslate(target)"
                      >
                        {{ target.name }}
                      </a-menu-item>
                      <a-menu-item
                        @click="translateOrigin()"
                        v-if="translateCount > 0"
                      >
                        恢复到原文
                      </a-menu-item>
                    </a-menu>
                    <a-button :loading="transitionLoading">
                      {{ $t('edit.onKeyTransition') }}
                    </a-button>
                  </a-dropdown>
                </template>

                <a-button @click="$router.go(-1)" class="me-fr">
                  {{ $t('edit.back') }}
                </a-button>
              </a-space>
            </div>
          </a-affix>

          <!-- 按钮组 end -->
        </div>
      </div>
      <!-- 右侧锚点 -->
      <AnchorGoodsEdit :anchorObj="anchorObj" />
      <!-- 认领到店铺 -->
      <ClaimToStore
        v-if="pushVisible"
        v-model="pushVisible"
        @submit="claimToStoreSubmit"
        ref="claimPop"
      ></ClaimToStore>
    </div>
  </a-spin>
</template>

<script>
import { mapState } from 'vuex'
import store from '@/store'
import Product from '@/api/product'
import Goods from '@/api/goods'
import Store from '@/api/store'
import Order from '@/api/order'
import Basic from '@/api/basic'
import Cnsc from '@/api/cnsc'
import {
  mean,
  // round,
  range,
  // compact,
  isEmpty,
  cloneDeep,
  // merge,
  findIndex
} from 'lodash'
import { looseEqual } from '@/util'
// import StoreCategoryForm from './components/edit/StoreCategoryForm'
// import CnscCategoryForm from './components/edit/CnscCategoryForm'
import ProductSourceForm from './components/edit/ProductSourceForm'
// import ProductInfoForm from './components/edit/ProductInfoForm'
import MediaManagerForm from './components/edit/MediaManagerForm'
import ProductSpecForm from './components/edit/ProductSpecForm'
import ExtraInfoForm from './components/edit/ExtraInfoForm'
import AnchorGoodsEdit from './components/edit/Anchor.vue'
import GoodsBaseInfo from './components/edit/GoodsBaseInfo.vue'
import Breadcrumb from '@/components/Breadcrumb'
import ClaimToStore from './components/collect/ClaimToStoreNew.vue'
export default {
  name: 'GoodsEdit',
  components: {
    // StoreCategoryForm,
    // CnscCategoryForm,
    ProductSourceForm,
    // ProductInfoForm,
    MediaManagerForm,
    ProductSpecForm,
    ExtraInfoForm,
    AnchorGoodsEdit,
    GoodsBaseInfo,
    Breadcrumb,
    ClaimToStore
  },
  computed: {
    ...mapState({
      targetLangList: (state) => state.product.targetLangList,
      targetLangListAli: (state) => state.product.targetLangListAli,
      basicStoreList: (state) => state.auth.basicStoreList,
      menuArr: (state) => state.vars?.menuArr,
      shipLimit: (state) => state.vars?.shipLimit
    }),
    /**编辑类型*/
    editType() {
      return this.$route.query.edit
    },
    /**锚点 */
    getAnchor() {
      const type = this.$route.query.edit
      const {
        storeCategoryForm,
        productInfoForm,
        mediaManagerForm,
        productSpecForm,
        extraInfoForm
      } = this.$data.anchorGourp
      if (type == 0) {
        return {
          productInfoForm,
          mediaManagerForm,
          productSpecForm,
          extraInfoForm
        }
      }
      return {
        storeCategoryForm,
        productInfoForm,
        mediaManagerForm,
        productSpecForm,
        extraInfoForm
      }
    },
    breadList() {
      const path = this.$route.query.sourcePath
      const curMenu = this.menuArr.find((item) => item.href === path)
      return [
        {
          title: this.$t('edit.index'),
          path
        },
        {
          title: curMenu?.menuName,
          path
        },
        {
          title: this.$t('edit.edit'),
          path
        }
      ]
    }
  },
  data() {
    return {
      pushVisible: false, // 认领到店铺
      range,
      isEmpty,
      product: {},
      anchorGourp: {
        storeCategoryForm: {
          name: this.$t('edit.storesCategories'),
          warning: false
        },
        productInfoForm: {
          name: this.$t('edit.productInfo'),
          warning: false
        },
        mediaManagerForm: {
          name: this.$t('edit.productImage'),
          warning: false
        },
        productSpecForm: {
          name: this.$t('edit.productSpecs'),
          warning: false
        },
        extraInfoForm: {
          name: this.$t('edit.extraInfo'),
          warning: false
        }
      },
      saveLoading: false /**保存加载状态 */,
      publishLoading: false /**保存并发布加载状态 */,
      gatherSaveClaimLoading: false /**保存并认领加载状态 */,
      productLoading: false /**商品数据加载状态 */,
      transitionLoading: false /**一键翻译加载状态 */,
      storeType: null,
      affixFixed: false,
      labelCol: { span: 3 },
      tabsList: [],
      anchorObj: {
        'goods-source': {
          title: '商品源',
          key: 'goods-source',
          href: '#goods-source',
          vilidate: false,
          error: false
        },
        goodsBaseInfoForm: {
          title: '基本信息',
          key: 'goodsBaseInfoForm',
          href: '#goodsBaseInfo',
          error: false
        },
        mediaManagerForm: {
          title: '媒体管理',
          key: 'mediaManagerForm',
          href: '#mediaManagerForm',
          error: false
        },
        productSpecForm: {
          title: '商品规格',
          key: 'productSpecForm',
          href: '#productSpecForm',
          error: false
        },
        extraInfoForm: {
          title: '附加信息',
          key: 'extraInfoForm',
          href: '#extraInfoForm',
          error: false
        }
      },
      anchorError: {},
      saveSuccess: false,
      lameDelegation: false,
      originProduct: {}, // 一键翻译前的数据
      translateCount: 0
    }
  },
  async mounted() {
    await this.initData()
    this.$data.originProduct = cloneDeep(this.$data.product)
    const { storeId, merchantId, shopId } = this.$route.query
    this.storeType = storeId ? 'normal' : this.storeType
    this.storeType = merchantId ? 'cnsc' : this.storeType
    // 如果是普通店铺,获取店铺限制
    if (this.editType != 0) {
      this.getItemLimit(shopId)
    }

    // 如果是除全球商户之外的,这里包括采集箱，都要获取普通店铺列表
    if (this.storeType != 'cnsc') {
      Store.getAllStore().then(({ data }) => {
        this.$store.commit('setStoreList', data)
      })
      // this.getItemLimit()
    }

    // 如果是cnsc店铺
    if (this.editType == 0 || this.storeType == 'cnsc') {
      Cnsc.getMerchantPublishable().then(({ data }) => {
        this.tabsList = data || []
        this.$store.commit('setMerchantList', data)
      })
    }

    Basic.allIllegalWord().then(({ data }) => {
      this.$store.commit('setIllegalWord', data)
    })
    this.addMeituChange()

    // 采集失败也能编辑(指的是采集商品缺某几项数据,后端会判定这种是成功，可以进入编辑页)，进入编辑页后初始化商品图片
    if (this.product.images == null) {
      this.$refs.mediaManagerForm.deleteProductImages()
    }
  },
  methods: {
    // 恢复到原文
    translateOrigin() {
      this.$data.product = this.$data.originProduct
      this.$data.translateCount = 0
    },
    // 认领到店铺
    async claimToStoreSubmit(obj) {
      const selectedRowKeys = [this.$route.query.id]
      let total = 0
      console.log(obj)
      try {
        if (obj.storeIds.length) {
          const { data } = await Product.handleBatchClaim({
            isAutoMatch: obj.isAutoMatch,
            storeIds: obj.storeIds,
            productIds: selectedRowKeys
          })
          total = data.map(({ result }) => result).filter(Boolean).length
        }
        if (obj.cnscIds.length) {
          const { data } = await Cnsc.handleBatchClaimToCnscMerchant({
            isAutoMatch: obj.isAutoMatch,
            merchantIds: obj.cnscIds,
            productIds: selectedRowKeys
          })
          // total = data.map(({ result }) => result).filter(Boolean).length
        }
        this.$message.success(this.$t('common.handlerSuccess'))
        this.$router.go(-1)
        // this.$message.success(this.$t('collect.claimSuccess', { total }))
        // this.confirmLoading = false
        // this.pushVisible = false
        // this.onSelectChange([], [])
        // this.reLoadData()
      } catch (err) {
        this.$refs.claimPop.loading = false
      }
    },
    /**初始化数据*/
    async initData() {
      const { id, storeId, edit, merchantId } = this.$route.query
      this.$data.productLoading = true
      let dataSource = {}
      try {
        if (edit == 0) {
          const res = await Product.getProductDetail(id)
          dataSource = res.data
          // 普通店铺
        } else if (storeId) {
          const res =
            edit != 1
              ? await Goods.getEarlyShopeeProductDetail(id)
              : await Goods.getShopeeProductDetailV2(id)
          dataSource = res.data
          // cnsc
        } else if (merchantId) {
          const res = await Cnsc.getEarlyCnscProductDetail(id)
          dataSource = res.data
        } else {
          console.warn('数据错误，看URL参数')
        }
        if (!dataSource.rate) {
          let { data } = await Basic.getCurrencyRate(dataSource.currency)
          this.$set(dataSource, 'rate', data)
        }
      } catch (error) {
        console.error(error)
      }
      // 普通店铺匹配当地语言
      if (storeId) {
        /**设置本地语言 */
        this.$store.dispatch('setTargetLangList', {
          currency: dataSource.currency
        })
        this.$store.dispatch('setTargetLangListAli', {
          currency: dataSource.currency
        })
      }

      // cnsc店铺使用全部语言
      if (merchantId) {
        this.$store.dispatch('setTargetLangList', {
          currency: 'all'
        })
        this.$store.dispatch('setTargetLangListAli', {
          currency: 'all'
        })
      }

      /**保证规格名和规格值长度一致，采集过来的数据可能存在不一致 */
      if (dataSource.specs && dataSource.specs?.length) {
        dataSource.specs = dataSource.specs.map((ele) => {
          if (!ele.imagesUrl) ele.imagesUrl = []
          if (!ele.options) ele.options = []
          const length = ele.options.length
          ele.imagesUrl.length = length
          ele.options.length = length
          return ele
        })
      }

      /**记录是否是历史本地SKU */
      if (dataSource.variants && Array.isArray(dataSource.variants)) {
        dataSource.variants = dataSource.variants.map((ele) => {
          ele._isHistorySku = !!ele.productItemSku
          return ele
        })
      }

      /**处理图片 */
      if (dataSource.images && /^\[([\s\S])*\]$/.test(dataSource.images)) {
        dataSource.images = JSON.parse(dataSource.images).slice(0, 9)
      }
      if (
        dataSource.detailImgUrl &&
        /^\[([\s\S])*\]$/.test(dataSource.detailImgUrl)
      ) {
        dataSource.detailImgUrl = JSON.parse(dataSource.detailImgUrl)
      }

      /**计算多规格商品变体折扣 */
      if (dataSource.variants && Array.isArray(dataSource.variants)) {
        dataSource.variants = dataSource.variants.map((ele) => {
          const d = ele.promotionPrice / ele.price
          if (ele.promotionPrice && ele.price) {
            ele.discount = (d * 10).toFixed(2)
          }
          return ele
        })
      }
      /**计算单规格商品折扣 */
      if (dataSource.promotionPrice && dataSource.price) {
        const d = dataSource.promotionPrice / dataSource.price
        dataSource.discount = (d * 10).toFixed(2)
      }

      /**获取物流信息 */
      if (this.editType != 0 && storeId) {
        try {
          let { data } = await Order.handleSyncLogisticsV2({
            storeId,
            shopId: this.$route.query.shopId
          })
          data = data?.filter((item) => item.maskChannelId == 0) || []
          // 如果有product有物流信息，那么初始化选中物流为现有的选中
          let logistics = data.map((item) => {
            // 如果有sizes就默认选中第一个--台湾站点专有的情况
            if (item.sizes && item.sizes.length && !item.sizeId) {
              item.sizeId = String(item.sizes[0].size_id)
            }
            const findObj = dataSource.logistics?.find(
              ({ logisticId }) => logisticId === item.logisticId
            )
            if (findObj) {
              return {
                ...item,
                enabled: findObj.enabled,
                sizeId: findObj.sizeId ? String(findObj.sizeId) : item.sizeId,
                isFree: findObj.isFree
              }
            } else {
              return {
                ...item,
                enabled: false
              }
            }
          })
          dataSource.logistics = logistics || []
        } catch (error) {
          dataSource.logistics = []
          console.error(error)
        }
      }

      if (dataSource.categoryIds && Array.isArray(dataSource.categoryIds)) {
        dataSource.categoryIds = dataSource.categoryIds.reverse()
      }

      let discount
      if (dataSource.discountId) {
        if (dataSource.hasVariation) {
          /**多规格设置折扣 */
          discount = dataSource.variants.map(({ promotionPrice, price }) => {
            return (promotionPrice / price) * 10
          })
          discount = Number(mean(discount)).toFixed(2)
        } else {
          /**单品设置折扣 */
          const { promotionPrice, price } = dataSource
          discount = Number((promotionPrice / price) * 10).toFixed(2)
        }
      }
      dataSource.discount = discount
      this.$data.productLoading = false
      this.$data.product = dataSource
      this.productCopy = cloneDeep(dataSource)
    },
    /**监听美图秀秀事件*/
    addMeituChange() {
      let hiddenProperty =
        'hidden' in document
          ? 'hidden'
          : 'webkitHidden' in document
          ? 'webkitHidden'
          : 'mozHidden' in document
          ? 'mozHidden'
          : null
      let visibilityChangeEvent = hiddenProperty.replace(
        /hidden/i,
        'visibilitychange'
      )
      document.addEventListener(visibilityChangeEvent, () => {
        if (!document[hiddenProperty]) {
          let meituImageInfo = localStorage.getItem('meituImageInfo')
          meituImageInfo = JSON.parse(meituImageInfo)
          let { index, subIndex, img, type } = meituImageInfo || {}
          console.log(meituImageInfo)
          /**
           * 媒体图片修图
           */
          if (img && type == 1) {
            const { images } = this.$data.product
            this.$set(images, index, img)
          }
          /**
           * 规格图片修图
           */
          if (img && type == 2) {
            const { specs } = this.$data.product
            this.$set(specs[index].imagesUrl, subIndex, img)
          }
        }
      })
    },
    /**锚点定位 */
    goAnchor(index) {
      if (this.$refs[index]) {
        const el = this.$refs[index].$el
        const top = el.offsetTop
        window.scrollTo({
          top: top - 120,
          behavior: 'smooth'
        })
      }
    },
    /**一键翻译 */
    async onTranslate({ lang }) {
      this.$data.transitionLoading = true
      const product = cloneDeep(this.$data.product)
      let { storeId, name, description, specs } = product
      specs == null ? (specs = []) : ''
      storeId = lang === 'EN' ? null : storeId
      const optionList = specs
        .map(({ options }) => options)
        .reduce((prev, curr) => prev.concat(curr), [])
        .map((source, index) => ({
          source,
          target: null,
          translateId: 'option-' + index
        }))

      const nameList = specs.map(({ name }, index) => ({
        source: name,
        target: null,
        translateId: 'name-' + index
      }))
      let params = {
        storeId,
        list: [
          { source: name, target: null, translateId: 'title' },
          { source: description, target: null, translateId: 'desc' },
          ...optionList,
          ...nameList
        ]
      }
      //   if (this.$route.query.merchantId) {
      params.to = lang
      //   }
      Basic.batchTranslate(params)
        .then(({ data, code }) => {
          if (code === 0) {
            // 取出标题
            product.name =
              data.list.find((el) => el.translateId == 'title').target ||
              product.name
            // 取出描述
            product.description =
              data.list.find((el) => el.translateId == 'desc').target ||
              product.description
            if (product.specs && product.specs.length) {
              product.specs = product.specs.map((spec) => {
                spec.options = spec.options.map((el) => {
                  // 找到当前项在optionList中的id，再根据id找到翻译后的目标值
                  let currentOptionId = optionList.find(
                    (ele) => ele.source == el
                  ).translateId
                  return (
                    data.list.find((tar) => tar.translateId == currentOptionId)
                      .target || el
                  )
                })
                // 在nameList找到当前项的ID
                let matchNameId = nameList.find((el) => el.source == spec.name)
                  .translateId
                let matchName = data.list.find(
                  (el) => el.translateId == matchNameId
                )
                spec.name = matchName ? matchName.target : ''
                return spec
              })
            }
            this.$data.product = product
            this.$message.success(this.$t('common.handlerSuccess'))
            this.$refs['productSpecForm'].renderSpecsFramework(product)
            this.$data.translateCount++
          }
        })
        .catch((error) => {
          console.log(error)
          this.$message.error(this.$t('common.handlerFail'))
        })
        .finally(() => {
          this.$data.transitionLoading = false
        })
    },
    async validate() {
      const errors = []
      let obj = {}
      for (const [key, item] of Object.entries(this.anchorObj)) {
        if (item.vilidate !== false) {
          this.$set(item, 'error', false)
          this.$set(item, 'errorList', false)
          try {
            const result = await this.$refs?.[key]?.validate()
            if (Array.isArray(result)) {
              result.forEach((item) => {
                obj = Object.assign({}, obj, item)
              })
            } else {
              if (typeof result === 'object') {
                obj = Object.assign({}, obj, result)
              }
            }
          } catch (error) {
            this.$set(item, 'error', true)
            this.$set(item, 'errorList', Array.isArray(error) ? error : [error])
            this.goAnchor(key)
            errors.push(error)
            console.log(error, 'error')
          }
        }
      }
      if (errors.length) {
        return Promise.reject(errors)
      }
      const product = cloneDeep(this.$data.product)
      product.images = JSON.stringify(product.images)
      product.detailImgUrl = JSON.stringify(product.detailImgUrl)
      // 在没有选预约的时候会有一个默认值
      if (!product.daysToShip) {
        product.daysToShip = this.shipLimit?.daysToShip
      }
      // 合并出参不改源数据
      const params = Object.assign({}, product, obj)
      return Promise.resolve(params)
    },
    // 保存不做校验
    async onSave() {
      this.saveLoading = true
      this.saveSuccess = true
      const result = await this.$refs.goodsBaseInfoForm.save()
      const params = {
        ...this.product,
        ...result,
        images: JSON.stringify(this.product.images),
        detailImgUrl: JSON.stringify(this.product.detailImgUrl)
      }
      try {
        this.editType == 1
          ? await Goods.updateShopeeProductV2(params)
          : await Goods.getEarlyProductDetailEdit(params)
        this.$message.success(this.$t('common.handlerSuccess'))
        // this.$router.go(-1)
      } catch (error) {
        this.$message.error(this.$t('common.handlerFail'))
        console.error(error)
      }
      this.saveLoading = false
    },
    // cnsc商品保存
    async onSaveCnsc() {
      this.saveLoading = true
      this.saveSuccess = true
      const result = await this.$refs.goodsBaseInfoForm.save()
      const params = {
        ...this.product,
        ...result,
        images: JSON.stringify(this.product.images),
        detailImgUrl: JSON.stringify(this.product.detailImgUrl)
      }
      try {
        await Cnsc.handleEarlyUpdateProduct(params)
        this.$message.success(this.$t('common.handlerSuccess'))
        // this.$router.go(-1)
      } catch (error) {
        this.$message.error(this.$t('common.handlerFail'))
        console.error(error)
      }
      this.$data.saveLoading = false
    },
    // cnsc商品保存并校验
    onSaveCnscValidate(publish = false) {
      return new Promise((resolve) => {
        this.validate()
          .then((product) => {
            this.$data.saveLoading = true
            Cnsc.handleEarlyUpdateProduct(product)
              .then(() => {
                if (!publish) {
                  this.$message.success(this.$t('common.handlerSuccess'))
                  this.$router.go(-1)
                } else {
                  resolve(true)
                }
              })
              .catch(() => {
                resolve(false)
                this.$message.error(this.$t('common.handlerFail'))
              })
              .finally(() => {
                if (!publish) {
                  this.$data.saveLoading = false
                }
              })
          })
          .catch((error) => {
            resolve(false)
            console.error(error)
            this.showErrors(error)
          })
      })
    },
    //cnsc保存并发布
    async onSaveAndPublishCnsc() {
      if (this.lameDelegation) {
        this.$confirm({
          content: '店铺授权失效,请重新授权',
          onOk: () => {
            this.$router.replace('/store')
          }
        })
        return
      }
      if (
        this.$data.storeType !== 'cnsc' &&
        !this.$data.product.logistics.length
      ) {
        this.$confirm({
          content: '请前往店铺后台设置物流方式'
        })
        return
      }

      this.saveSuccess = true
      let saveExit = await this.onSaveCnscValidate(true)
      if (saveExit) {
        let params = {
          productId: [this.$route.query.id]
        }
        this.$data.saveLoading = true
        Cnsc.handlePublishToMerchant(params)
          .then(({ data, message, code }) => {
            // 超量3019999时，只弹超量提示框
            if (data && code === 0) {
              this.$message.success(this.$t('common.handlerSuccess'))
              this.$router.go(-1)
            } else if (code === 3019999 || code === 999999) {
              console.log(message)
            } else {
              this.$message.error(message)
            }
          })
          .catch(() => {
            this.$message.error(this.$t('common.handlerFail'))
          })
          .finally(() => {
            this.$data.saveLoading = false
          })
      }
    },
    /**采集商品保存 */
    async onGatherSave(isClaim = false) {
      this.saveLoading = true
      this.saveSuccess = true
      const result = await this.$refs.goodsBaseInfoForm.save()
      const params = {
        ...this.product,
        images: JSON.stringify(this.product.images),
        detailImgUrl: JSON.stringify(this.product.detailImgUrl),
        ...result
      }
      try {
        await Product.updateGeneralItem(params)
        this.saveLoading = false
        if (!isClaim) {
          this.$message.success(this.$t('common.handlerSuccess'))
          this.$router.go(-1)
        } else {
          return Promise.resolve(true)
        }
      } catch (error) {
        this.$message.error(this.$t('common.handlerFail'))
        this.saveLoading = false
        console.error(error)
        return Promise.reject(false)
      }
      // return new Promise((resolve) => {
      //   this.validate()
      //     .then((product) => {
      //       this.$data.saveLoading = true
      //       console.log(product, 'product')
      //       Product.updateGeneralItem(product)
      //         .then(() => {
      //           if (!isClaim) {
      //             this.$message.success(this.$t('common.handlerSuccess'))
      //             this.$router.go(-1)
      //           } else {
      //             resolve(true)
      //           }
      //         })
      //         .catch(() => {
      //           resolve(false)
      //           this.$message.error(this.$t('common.handlerFail'))
      //         })
      //         .finally(() => {
      //           if (!isClaim) {
      //             this.$data.saveLoading = false
      //           }
      //         })
      //     })
      //     .catch((error) => {
      //       console.error(error)
      //       resolve(false)
      //       this.showErrors(error)
      //     })
      // })
    },
    /**保存并发布-普通店铺 */
    onPublish() {
      if (this.lameDelegation) {
        this.$confirm({
          content: '店铺授权失效,请重新授权',
          onOk: () => {
            this.$router.replace('/store')
          }
        })
        return
      }
      this.saveSuccess = true
      this.validate()
        .then((product) => {
          this.$data.publishLoading = true
          Goods.savaOrPublishV2(product)
            .then(({ data }) => {
              if (data.result) {
                this.$message.success('正在发布中，请前往“发布中”列表查看')
                this.$router.go(-1)
              } else {
                this.$message.error(data.message)
              }
            })
            .catch(() => {
              this.$message.error(this.$t('common.handlerFail'))
            })
            .finally(() => {
              this.$data.publishLoading = false
            })
        })
        .catch((error) => {
          console.error(error)
          // this.showErrors(error)
        })
    },
    /**保存并认领 */
    async onSaveAndClaim({ memberId, storeId }) {
      this.gatherSaveClaimLoading = true
      this.saveSuccess = true
      try {
        const result = await this.$refs.goodsBaseInfoForm.save()
        const params = {
          ...this.product,
          ...result,
          productId: this.product.productGeneralId,
          memberId,
          storeId,
          images: JSON.stringify(this.product.images),
          detailImgUrl: JSON.stringify(this.product.detailImgUrl)
        }
        await Product.handleClaim(params)
        this.$message.success(this.$t('common.handlerSuccess'))
        this.$router.go(-1)
      } catch (error) {
        // 异常提示细些，只有成功和code 400
        this.$message.error(
          this.$t('common.handlerFail') + ',认领的产品存在问题，请重新编辑产品'
        )
        console.error(error)
      }
      this.gatherSaveClaimLoading = false
    },
    /**保存并认领CNSC */
    async onSaveAndClaimCnsc({ merchant_id }) {
      this.saveSuccess = true
      let saveExit = await this.onGatherSave(true)
      if (saveExit) {
        this.$data.pushVisible = true
        // let params = {
        //   productIds: [this.$route.query.id],
        //   merchantId: merchant_id
        // }
        // this.$data.gatherSaveClaimLoading = true
        // Cnsc.handleBatchClaimToCnscMerchant(params)
        //   .then(({ data, message }) => {
        //     if (data) {
        //       this.$message.success(this.$t('common.handlerSuccess'))
        //       this.$router.go(-1)
        //     } else {
        //       this.$message.error(message)
        //     }
        //   })
        //   .catch(() => {
        //     this.$message.error(this.$t('common.handlerFail'))
        //   })
        //   .finally(() => {
        //     this.$data.gatherSaveClaimLoading = false
        //   })
      }
    },
    // 在线商品更新
    onUpdate() {
      if (this.lameDelegation) {
        this.$confirm({
          content: '店铺授权失效,请重新授权',
          onOk: () => {
            this.$router.replace('/store')
          }
        })
        return
      }
      this.saveSuccess = true
      this.validate()
        .then((product) => {
          this.$data.saveLoading = true
          // Goods.handleUpdateToShopee(product)
          Goods.updatesEarlyProduct(product)
            .then(({ data }) => {
              if (!data.result) {
                this.$message.error(data.message)
              }
            })
            .catch(() => {
              this.$message.error(this.$t('common.handlerFail'))
            })
            .finally(() => {
              this.$data.saveLoading = false
            })
        })
        .catch((error) => {
          console.error(error)
          this.showErrors(error)
        })

      this.$message.info('商品正在更新中，请稍后查看更新结果')
      this.$router.go(-1)
    },
    showErrors(errors) {
      if (!errors) return
      // this.$error({
      //   title: '温馨提示',
      //   content: () => (
      //     <div>
      //       <p>您当前商品可能存在以下问题</p>
      //       <p>规格：长度不能超过20个字符/不超过50个变体/不能重复。</p>
      //       <p>图片：不能重复/不超过800x800像素/不能为空。</p>
      //       <p>价格：价格不能为空/必须是其他规格价格的5倍以内。</p>
      //       <p>库存：不能为空/单个规格不能大于99999。</p>
      //     </div>
      //   )
      // })
    },
    affixChange(val) {
      this.affixFixed = val
    },
    async getItemLimit(id) {
      try {
        let limitData = {}
        if (id != 0) {
          const {
            data: { response = {} }
          } = await Goods.getItemLimit(id)
          limitData = response
        } else if (this.storeType == 'cnsc') {
          // 设置默认值
          limitData = {
            item_count_limit: { min_limit: 0, max_limit: 1000 },
            item_description_length_limit: { min_limit: 20, max_limit: 5000 },
            item_image_count_limit: { min_limit: 1, max_limit: 9 },
            item_name_length_limit: { min_limit: 15, max_limit: 120 },
            priceLimit: { min_limit: 1, max_limit: 100000 },
            stock_limit: { min_limit: 0, max_limit: 100000 },
            tier_variation_name_length_limit: { min_limit: 1, max_limit: 14 },
            tier_variation_option_length_limit: { min_limit: 1, max_limit: 20 },
            wholesale_price_threshold_percentage: {
              min_limit: 0,
              max_limit: 100
            }
          }
        }
        this.$store.commit('setVars', { shopItemLimit: limitData })
      } catch (error) {
        const { data } = error.response
        if (data?.code === 999999) {
          this.lameDelegation = true
        }
        console.error(error.response)
      }
    }
  },
  beforeRouteEnter(to, rom, next) {
    store.commit('setVars', { hideLeftMenu: true })
    next()
  },
  async beforeRouteLeave(to, from, next) {
    if (to.name === 'login') {
      next()
      return
    }
    next(false)
    if (!this.saveSuccess && this.product.createTime) {
      let { variants } = cloneDeep(this.product)
      // 删除变体增加的属性
      variants = variants.map((item) => {
        Reflect.deleteProperty(item, `_specs_0_`)
        Reflect.deleteProperty(item, `_specs_1_`)
        return item
      })
      // 页面没有渲染出来
      if (!this.$refs.goodsBaseInfoForm) {
        return next()
      }
      const goodsBaseInfo = await this.$refs.goodsBaseInfoForm.save()
      const { attribute } = goodsBaseInfo || {}
      if (attribute) {
        // 同步虾皮这边回来的attributeName是英文，我们是的是中文所以两边去除再对比
        attribute?.forEach((item) => {
          Reflect.deleteProperty(item, 'attributeName')
        })
        this.productCopy.attribute?.forEach((item) => {
          Reflect.deleteProperty(item, 'attributeName')
          item.attributeValueList?.forEach((it) => {
            Reflect.deleteProperty(it, 'displayValueName')
          })
        })
        // 出参重新排序与原值一样从小到大
        attribute.sort((a, b) => a.attributeId - b.attributeId)
      }
      const target = Object.assign(
        {},
        this.product,
        { variants },
        goodsBaseInfo
      )
      console.log(target, this.productCopy)
      // console.log(
      //   looseEqual(target.attribute, this.productCopy.attribute),
      //   '类目'
      // )
      // console.log(
      //   looseEqual(target.variants, this.productCopy.variants),
      //   '变体'
      // )
      // console.log(looseEqual(target.specs, this.productCopy.specs), '规格')

      const isEqual = looseEqual(this.productCopy, target)
      if (!isEqual) {
        this.$confirm({
          title: '提示',
          content: '你还没有保存修改,是否确认离开',
          onOk: () => {
            next()
          }
        })
      } else {
        next()
      }
    } else {
      store.commit('setVars', { hideLeftMenu: false })
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
.me-title {
  font-weight: 600;
  color: #262424;
  line-height: 28px;
  font-size: 20px;
}

.me-sub-title {
  // height: 40px;
  // background: #f6f6f6;
  border-radius: 4px;
  line-height: 25px;
  font-size: 18px;
  font-weight: 600;
  color: #262424;
  padding-left: 16px;
  border: none;
}

.button-group {
  padding: 10px;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  &-fixed {
    background-color: #ffffff;
    box-shadow: 0 -2px 6px 0 rgb(0 0 0 / 12%);
  }
}

.anchor-affix-content {
  position: fixed;
  right: 0;
  top: 40%;
  z-index: 6;
  width: 110px;
  padding: 10px;

  .move-point {
    transform: rotate(45deg);
    position: absolute;
    left: -5px;
    top: -5px;
    display: none;
    cursor: pointer;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 3px;

    .move-point {
      display: block;
    }
  }

  & > span {
    display: block;
    background-color: #3e90f1;
    margin-bottom: 10px;
    color: #ffffff;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    position: relative;

    &:last-child {
      margin-bottom: 0;
    }

    &.warn {
      &::before {
        content: '';
        display: block;
        position: absolute;
        left: 2px;
        top: 2px;
        width: 12px;
        height: 12px;
        background-color: red;
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
.goods-edit-container {
  display: flex;
  .goods-edit-left {
    flex: 0 0 1140px;
  }
}
::v-deep .ant-form-item-label {
  // width: 10.5%;
}
</style>

<style lang="scss">
.custom-affix {
  height: 64px;
  .ant-affix {
    z-index: 9 !important;
  }
}
.v-application a {
  color: inherit;
}
</style>
