// 全球商品编辑
<template>
  <a-spin :spinning="saveLoading">
    <div>
      <!-- 商品源 start -->
      <div class="goods-base-info me-card ">
        <h2 class="me-sub-title me-mt-3" id="goods-source">
          {{ $t('edit.productSource') }}
        </h2>
        <ProductSourceForm v-model="product" />
      </div>
      <!-- 商品源 end -->
      <!-- CNSC店铺和类目 -->
      <div class="goods-base-info me-card ">
        <h2 class="me-sub-title me-mt-3" id="goodsBaseInfo">
          {{ $t('edit.productInfo') }}
        </h2>
        <template v-if="!isEmpty(product)">
          <GoodsBaseInfo
            ref="goodsBaseInfoForm"
            v-model="product"
            :itemLimits="itemLimits"
            :isEdit="tabsKey === 99999"
          />
        </template>
      </div>

      <!-- 媒体管理 start -->
      <div class="goods-base-info me-card ">
        <h2 class="me-sub-title me-mt-3" id="mediaManagerForm">
          {{ $t('edit.mediaManage') }}
        </h2>
        <template v-if="!isEmpty(product)">
          <MediaManagerForm ref="mediaManagerForm" v-model="product" />
        </template>
      </div>
      <!-- 媒体管理 end -->

      <!-- 商品规格 start -->
      <div class="goods-base-info me-card ">
        <h2 class="me-sub-title me-mt-3" id="productSpecForm">
          {{ $t('edit.productSpecs') }}
        </h2>
        <template v-if="!isEmpty(product)">
          <ProductSpecForm
            ref="productSpecForm"
            v-model="product"
            :itemLimits="itemLimits"
            :isEdit="tabsKey === 99999"
          />
        </template>
      </div>
      <!-- 商品规格 end -->

      <!-- 附加信息 start -->
      <div class="goods-base-info me-card ">
        <h2 class="me-sub-title me-mt-3" id="extraInfoForm">
          {{ $t('edit.extraInfo') }}
        </h2>
        <ExtraInfoForm
          ref="extraInfoForm"
          v-model="product"
          :isEdit="tabsKey === 99999"
        />
      </div>
      <!-- 附加信息 end -->
      <!-- 操作按钮 start -->
      <a-affix :offset-bottom="0" class="custom-affix" @change="affixChange">
        <div class="button-group" :class="{ 'button-group-fixed': affixFixed }">
          <a-space v-if="tabsKey === 99999">
            <a-button type="primary" @click="onUpdate">
              {{ $t('edit.update') }}
              <a-icon type="arrow-down" />
            </a-button>
            <a-button type="primary" @click="onSave">
              {{ $t('common.save') }}
              <a-icon type="arrow-up" />
            </a-button>
            <a-button @click="$router.go(-1)">
              {{ $t('common.cancel') }}
            </a-button>
          </a-space>
          <a-space v-else>
            <a-button type="primary" @click="onUpdate">
              {{ $t('edit.update') }}
            </a-button>
            <a-button type="primary" @click="onSave">
              {{ $t('common.save') }}
            </a-button>
            <a-button
              type="primary"
              @click="onPutaway(product.status === 'NORMAL')"
            >
              {{
                product.status === 'NORMAL'
                  ? $t('onSale.down')
                  : $t('onSale.up')
              }}
            </a-button>
            <a-button @click="$router.push('/goods/on-sale')">
              {{ $t('common.cancel') }}
            </a-button>
          </a-space>
        </div>
      </a-affix>
      <!-- 操作按钮 end -->
      <!-- 右侧锚点 -->
      <AnchorGoodsEdit :anchorObj="anchorObj" />
    </div>
  </a-spin>
</template>

<script>
import ProductSourceForm from './ProductSourceForm'
import GoodsBaseInfo from './GoodsBaseInfo'
// import ProductInfoForm from './ProductInfoForm'
import MediaManagerForm from './MediaManagerForm'
import ProductSpecForm from './ProductSpecForm'
import ExtraInfoForm from './ExtraInfoForm'
import { mean, cloneDeep, isEmpty } from 'lodash'
import Cnsc from '@/api/cnsc'
import Goods from '@/api/goods'
import AnchorGoodsEdit from '@/views/goods/components/edit/Anchor.vue'
export default {
  components: {
    ProductSourceForm,
    GoodsBaseInfo,
    // ProductInfoForm,
    MediaManagerForm,
    ProductSpecForm,
    ExtraInfoForm,
    AnchorGoodsEdit
  },
  props: {
    productData: {
      type: Object,
      default: () => ({})
    },
    tabsKey: Number
  },
  data() {
    return {
      isEmpty,
      saveLoading: false,
      anchorGourp: {
        storeCategoryForm: {
          name: this.$t('edit.productInfo'),
          warning: false
        },
        // productInfoForm: {
        //   name: this.$t('edit.productInfo'),
        //   warning: false
        // },
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
      product: {},
      affixFixed: false,
      anchorObj: {
        'goods-source': {
          title: '商品源',
          key: 'goods-source',
          href: '#goods-source',
          vilidate: false,
          error: false
        },
        goodsBaseInfoForm: {
          title: '商品信息',
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
      itemLimits: {}
    }
  },
  async mounted() {
    this.product = cloneDeep(this.$props.productData) || {}
    await this.initData(this.tabsKey)
    this.addMeituChange()
  },
  methods: {
    async initData(id, isUpdated = false) {
      const { merchantId } = this.$route.query
      this.$data.saveLoading = true
      if (id === 99999) {
        id = this.$route.query.id
      }
      let dataSource
      if (!isEmpty(this.product) && !isUpdated) {
        dataSource = this.product
      } else {
        this.product = {}
        const res = await Cnsc.getCnscProductDetail(id)
        dataSource = res.data
      }

      // cnsc店铺使用全部语言
      if (merchantId) {
        this.$store.dispatch('setTargetLangList', {
          currency: 'all'
        })
      }
      if (dataSource.shopId !== 0) {
        this.getItemLimit(dataSource.shopId)
      }
      /**保证规格名和规格值长度一致，采集过来的数据可能存在不一致 */
      if (dataSource.specs) {
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
      // if (dataSource.logistics && dataSource.storeId) {
      //   let { data } = await Order.handleSyncLogistics({
      //     storeId: dataSource.storeId
      //   })
      //   let logistics = data.map((ele) => {
      //     const find = (id) => {
      //       return dataSource.logistics.find(({ logisticId }) => {
      //         return id === logisticId
      //       })
      //     }
      //     /**黑猫物流初始化 */
      //     let _c_ = find(ele.logisticId)
      //     if (!_c_) _c_ = {}
      //     ele = { ...ele, ..._c_ }
      //     if (ele.sizes && ele.sizes.length && !ele.sizeId) {
      //       ele.sizeId = ele.sizes[0].sizeId
      //     }
      //     return ele
      //   })

      //   dataSource.logistics = logistics
      // }

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

      /**
       * 黑猫宅急便默认选择第一个
       */
      if (dataSource.logistics) {
        dataSource.logistics = dataSource.logistics.map((logistic) => {
          if (logistic.sizes && logistic.sizes.length && !logistic.sizeId) {
            logistic.sizeId = logistic.sizes[0].sizeId
          }
          return logistic
        })
      }

      this.$data.saveLoading = false
      this.product = dataSource
    },
    async getItemLimit(id) {
      try {
        const {
          data: { response = {} }
        } = await Goods.getItemLimit(id)
        this.itemLimits = response
      } catch (error) {
        console.error(error.response)
      }
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
          /**
           * 媒体图片修图
           */
          if (img && type == 1) {
            const { images } = this.product
            this.$set(images, index, img)
          }
          /**
           * 规格图片修图
           */
          if (img && type == 2) {
            const { specs } = this.product
            this.$set(specs[index].imagesUrl, subIndex, img)
          }
        }
      })
    },
    /**表单校验 */
    async validate() {
      let errors = []
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
      // 合并出参不改源数据
      const params = Object.assign({}, product, obj)
      return Promise.resolve(params)
    },
    /**保存 */
    onSave() {
      this.validate()
        .then((product) => {
          Reflect.deleteProperty(product, 'publishShops')

          this.$data.saveLoading = true

          const updateApi =
            this.tabsKey === 99999
              ? Cnsc.updateProductMerchant
              : Cnsc.updateProductShop
          updateApi(product)
            .then((res) => {
              if (res.code == 0) {
                this.initData(this.tabsKey, true)
                this.$message.success(this.$t('common.handlerSuccess'))
              }
            })
            .catch((err) => {
              this.$message.error(err.message)
            })
            .finally(() => {
              this.$data.saveLoading = false
            })
        })
        .catch((error) => {
          console.error(error)
          this.showErrors(error)
        })
    },
    /**更新 */
    onUpdate() {
      this.$data.saveLoading = true
      const cnscSyscProduct =
        this.tabsKey === 99999
          ? Cnsc.syscProductSingle({ productId: [this.product.id] })
          : Cnsc.syscStoreProduct({ itemId: [this.product.itemId] })
      cnscSyscProduct
        .then((res) => {
          if (res.code == 0) {
            this.$message.success(this.$t('common.handlerSuccess'))
            setTimeout(() => {
              this.$router.go(0)
            }, 500)
          } else {
            this.$message.error(res.message)
          }
        })
        .catch(() => {
          this.$message.error(this.$t('common.handlerFail'))
        })
        .finally(() => {
          this.$data.saveLoading = false
        })
    },
    showErrors(errors) {
      if (!errors) return
      this.$error({
        title: '温馨提示',
        content: () => (
          <div>
            <p>您当前商品可能存在以下问题</p>
            <p>规格：长度不能超过20个字符/不超过50个变体/不能重复。</p>
            <p>图片：不能重复/不超过800x800像素/不能为空。</p>
            <p>价格：价格不能为空/必须是其他规格价格的5倍以内。</p>
            <p>库存：不能为空/单个规格不能大于99999。</p>
          </div>
        )
      })
    },
    onPutaway(isPutaway) {
      this.$data.saveLoading = true
      Cnsc.unListProductShop({
        productId: [this.tabsKey],
        unlist: isPutaway
      })
        .then(() => {
          this.$message.success(this.$t('common.handlerSuccess'))
          this.initData(this.tabsKey, true)
        })
        .catch(() => {
          this.$message.error(this.$t('common.handlerFail'))
        })
        .finally(() => {
          this.$data.saveLoading = false
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
    affixChange(val) {
      this.affixFixed = val
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
  line-height: 40px;
  font-size: 18px;
  font-weight: 600;
  color: #262424;
  padding-left: 16px;
  border: none;
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
.custom-affix {
  height: 64px;
  .ant-affix {
    z-index: 9 !important;
  }
}
</style>
