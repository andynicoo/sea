<template>
  <a-spin :spinning="loading">
    <div class="base me-pb-5">
      <!-- 提示锚点 -->
      <Anchor :errors="errorAnchors" />

      <a-breadcrumb class="me-pb-2 me-pt-2">
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>Lazada</a-breadcrumb-item>
        <a-breadcrumb-item>{{ point }}</a-breadcrumb-item>
        <a-breadcrumb-item>编辑</a-breadcrumb-item>
      </a-breadcrumb>

      <!-- 基本信息 start -->
      <template v-if="loaded">
        <div class="me-card" id="basicInfo">
          <h2 class="me-sub-title me-mt-3" id="goodsBaseInfo">基本信息</h2>
          <BasicInfo ref="basicInfo" v-model="product" />
        </div>
      </template>
      <!-- 基本信息 end -->

      <!-- 商品信息 start -->
      <template v-if="loaded">
        <div class="me-card" id="productinfo">
          <h2 class="me-sub-title me-mt-3" id="goodsBaseInfo">商品信息</h2>
          <Productinfo ref="productinfo" v-model="product" />
        </div>
      </template>
      <!-- 商品信息 end -->

      <!-- 媒体管理 start -->
      <template v-if="product.image">
        <div class="me-card" id="mediaManager">
          <h2 class="me-sub-title me-mt-3" id="goodsBaseInfo">媒体管理</h2>
          <MediaManager ref="mediaManager" v-model="product" />
        </div>
      </template>
      <!-- 媒体管理 end -->

      <!-- 规格信息 start -->
      <div class="me-card" id="spacesInfo">
        <h2 class="me-sub-title me-mt-3" id="goodsBaseInfo">规格信息</h2>
        <SpacesInfo ref="spacesInfo" v-model="product" />
      </div>
      <!-- 规格信息 end -->

      <!-- 物流信息 start -->
      <div class="me-card me-mb-0" id="logisticsInfo">
        <h2 class="me-sub-title me-mt-3" id="goodsBaseInfo">物流信息</h2>
        <LogisticsInfo ref="logisticsInfo" v-model="product" />
      </div>
      <!-- 物流信息 end -->

      <!-- 操作按钮 start -->
      <a-affix :offset-bottom="0">
        <div class="me-card me-mb-0 actions me-tar">
          <a-space>
            <template v-if="$route.query.edit == 1">
              <a-button
                type="primary"
                :loading="publishLoading"
                @click="onSavePublish"
              >
                保存并发布
              </a-button>
              <a-button type="primary" :loading="saveLoading" @click="onSave">
                保存
              </a-button>
            </template>
            <template v-else-if="$route.query.edit == 2">
              <a-button
                type="primary"
                :loading="uploadLoading"
                @click="onUpload"
              >
                更新
              </a-button>
            </template>
            <!-- 非采集编辑 && !$route.query.merchantId -->
            <template v-if="editType == 1">
              <a-dropdown
                :getPopupContainer="(targetNode) => targetNode.parentNode"
              >
                <a-menu slot="overlay" v-if="$route.query.storeType == 2">
                  <a-menu-item @click="onTranslate({ lang: 'en' })">
                    英语
                  </a-menu-item>
                  <a-menu-item @click="onTranslate({ lang: 'zh' })">
                    简体中文
                  </a-menu-item>
                </a-menu>

                <a-menu slot="overlay" v-else>
                  <a-menu-item
                    :key="target.lang"
                    v-for="target in targetLangList"
                    @click="onTranslate(target)"
                  >
                    {{ target.name }}
                  </a-menu-item>
                </a-menu>
                <a-button :loading="transitionLoading">
                  {{ $t('edit.onKeyTransition') }}
                </a-button>
              </a-dropdown>
            </template>
            <a-button @click="$router.back()"> 取消 </a-button>
          </a-space>
        </div>
      </a-affix>
      <!-- 操作按钮 end -->
    </div>
  </a-spin>
</template>

<script>
import { mapState } from 'vuex'
import BasicInfo from './components/BasicInfo'
import Productinfo from './components/Productinfo'
import MediaManager from './components/MediaManager'
import SpacesInfo from './components/SpacesInfo'
import LogisticsInfo from './components/LogisticsInfo'
import Anchor from './components/Anchor'
import Lazada from '@/api/lazada'
import Basic from '@/api/basic'
import bus from '@/bus'
import { cloneDeep } from 'lodash'
import scrollIntoView from 'scroll-into-view-if-needed'

export default {
  components: {
    BasicInfo,
    Productinfo,
    MediaManager,
    SpacesInfo,
    LogisticsInfo,
    Anchor
  },
  data() {
    return {
      loading: false,
      product: {},
      saveLoading: false,
      publishLoading: false,
      uploadLoading: false,
      loaded: false,
      errorAnchors: {},
      transitionLoading: false
    }
  },
  async mounted() {
    this.addMeituChange()

    const edit = this.$route.query.edit
    const id = this.$route.query.id

    let res = {}

    if (edit == 2) {
      res = await Lazada.getOnlineLazadaProduct(id)
    } else {
      res = await Lazada.getLazadaDetails(id)
    }

    if (res.data.categoryIds) {
      res.data.categoryIds = res.data.categoryIds.reverse()
    }
    if (res.data.categoryIdNames) {
      res.data.categoryIdNames = res.data.categoryIdNames.reverse()
    }
    if (res.data.specsInfo) {
      res.data.specsInfo = JSON.parse(res.data.specsInfo)
      res.data.specsInfo = res.data.specsInfo
        .map((specs) => {
          specs.__options__ = cloneDeep(specs.options)
          specs.__cp_options__ = cloneDeep(specs.options)
          return specs
        })
        .slice(0, 2)
    } else if (
      typeof res.data.specsInfo === 'string' &&
      res.data.specsInfo === 'null'
    ) {
      res.data.specsInfo = []
    }

    if (!res.data.image) res.data.image = []
    else res.data.image = JSON.parse(res.data.image)

    if (!res.data.images) res.data.images = []
    else res.data.image = JSON.parse(res.data.images)

    if (!res.data.detailImgUrl) res.data.detailImgUrl = []
    else res.data.detailImgUrl = JSON.parse(res.data.detailImgUrl)

    res.data.image = res.data.image.splice(0, 8)

    if (res.data.variationsList && Array.isArray(res.data.variationsList)) {
      res.data.variationsRecordVOList = cloneDeep(res.data.variationsList)
    }

    if (
      res.data.variationsRecordVOList &&
      Array.isArray(res.data.variationsRecordVOList)
    ) {
      res.data.variationsRecordVOList = res.data.variationsRecordVOList.map(
        (ele) => {
          if (ele.images) ele.images = JSON.parse(ele.images)
          ele.images = ele.images.splice(0, 8)

          if (ele.specsData) ele.specsData = JSON.parse(ele.specsData)
          if (!ele.vindex && ele.variationsSku)
            ele.vindex = ele.variationsSku.replace(' - ', ',')
          res.data.packageHeight = ele.packageHeight
          res.data.packageLength = ele.packageLength
          res.data.packageWeight = ele.packageWeight
          res.data.packageWidth = ele.packageWidth
          res.data.Hazmat = ele.Hazmat && ele.Hazmat.split(',')
          res.data.taxClass = ele.taxClass
          res.data.packageContent = ele.packageContent
          return ele
        }
      )
    }
    if (!res.data.attributes) res.data.attributes = {}
    else res.data.attributes = JSON.parse(res.data.attributes)

    this.$data.product = res.data
    this.$data.loaded = true

    const categoryId = res.data.categoryId
    const storeId = res.data.storeId

    Lazada.getLazadaCategoryAttribute({
      site: res.data.countryCode,
      categoryId,
      storeId
    }).then((res) => {
      res.data = res.data.map((ele) => {
        if (ele.options) ele.options = JSON.parse(ele.options)
        return ele
      })
      bus.$emit('lazadaEditBasicInfoCategoryChange', res.data)
    })
    // 普通店铺匹配当地语言
    if (storeId) {
      /**设置本地语言 */
      this.$store.dispatch('setTargetLangList', {
        currency: res.data.countryCode
      })
    }
  },
  computed: {
    point() {
      return this.$route.query.bc
    },
    /**编辑类型*/
    editType() {
      return this.$route.query.edit
    },
    ...mapState({
      targetLangList: (state) => state.product.targetLangList
      // basicStoreList: (state) => state.auth.basicStoreList,
      // menuArr: (state) => state.vars?.menuArr,
      // shipLimit: (state) => state.vars?.shipLimit
    })
  },
  methods: {
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
          let { index, img, type } = meituImageInfo || {}
          console.log(meituImageInfo)
          /**
           * 媒体图片修图
           */
          if (img && type == 1) {
            const { image } = this.$data.product
            this.$set(image, index, img)
          }
        }
      })
    },
    /**获取商品 */
    getProductData() {
      const product = cloneDeep(this.$data.product)

      if (product.specsInfo) {
        product.specsInfo = product.specsInfo.map((ele) => {
          ele.__options__ = undefined
          ele.__cp_options__ = undefined
          return ele
        })
      }

      const list = product.variationsRecordVOList.map((ele) => {
        ele.images = JSON.stringify(ele.images)
        ele.taxClass = product.taxClass
        ele.packageWeight = product.packageWeight
        ele.packageLength = product.packageLength
        ele.packageWidth = product.packageWidth
        ele.packageHeight = product.packageHeight
        ele.Hazmat = product.Hazmat && product.Hazmat.join()
        ele.packageContent = product.packageContent
        ele.specsData = JSON.stringify(ele.specsData)
        return ele
      })

      product.variationsRecordVOList = list
      product.variationsList = list
      product.brand = product.attributes.brand

      Object.keys(product.attributes).forEach((field) => {
        if (Array.isArray(product.attributes[field])) {
          product.attributes[field] = product.attributes[field].join(',')
        }
      })

      if (product.attributes) {
        product.attributes = JSON.stringify(product.attributes)
      }
      if (product.specsInfo) {
        product.specsInfo = JSON.stringify(product.specsInfo)
      }
      if (product.image && Array.isArray(product.image)) {
        product.image = JSON.stringify(product.image)
      }
      if (product.detailImgUrl && Array.isArray(product.detailImgUrl)) {
        product.detailImgUrl = JSON.stringify(product.detailImgUrl)
      }
      product.images = product.image

      return product
    },
    gotoView(view) {
      scrollIntoView(document.getElementById(view))
      this.$set(this.$data.errorAnchors, view, true)
    },
    /**校验 */
    async validate() {
      this.$data.errorAnchors = {}
      let basicInfoValidated = false
      let productinfoValidated = false
      let mediaManagerValidated = false
      let spacesInfoValidated = false
      let logisticsInfoValidated = false

      const basicInfo = this.$refs.basicInfo
      const productinfo = this.$refs.productinfo
      const mediaManager = this.$refs.mediaManager
      const spacesInfo = this.$refs.spacesInfo
      const logisticsInfo = this.$refs.logisticsInfo

      try {
        await basicInfo.validate()
        basicInfoValidated = true
      } catch (error) {
        console.error(error)
        this.gotoView('basicInfo')
      }

      try {
        await productinfo.validate()
        productinfoValidated = true
      } catch (error) {
        console.error(error)
        this.gotoView('productinfo')
      }

      try {
        await mediaManager.validate()
        mediaManagerValidated = true
      } catch (error) {
        console.error(error)
        this.gotoView('mediaManager')
      }

      try {
        await spacesInfo.validate()
        spacesInfoValidated = true
      } catch (error) {
        console.error(error)
        this.gotoView('spacesInfo')
      }

      try {
        await logisticsInfo.validate()
        logisticsInfoValidated = true
      } catch (error) {
        console.error(error)
        this.gotoView('logisticsInfo')
      }

      if (
        basicInfoValidated &&
        productinfoValidated &&
        mediaManagerValidated &&
        spacesInfoValidated &&
        logisticsInfoValidated
      ) {
        return this.getProductData()
      }
      this.$message.error('请输入必填项')
      throw new Error('表单校验失败')
    },
    async onSave() {
      this.$data.saveLoading = true
      Lazada.putLazadaProduct(this.getProductData())
        .then(() => {
          this.$message.success('保存成功')
          this.$router.back()
        })
        .catch(() => {
          this.$message.error('保存失败')
        })
        .finally(() => {
          this.$data.saveLoading = false
        })
    },
    /**保存并发布 */
    async onSavePublish() {
      const data = await this.validate()
      this.$data.publishLoading = true
      Lazada.lazadaProductSaveAndPublish(data)
        .then((res) => {
          if (res.code === 0) {
            const msgs = res.data.map(({ msg }) => msg)
            const stss = res.data
              .map(({ isSuccess }) => isSuccess)
              .filter((s) => !s)
            if (stss.length) {
              this.$message.error(`发布失败!${msgs}`)
            } else {
              this.$message.success('发布成功')
              this.$router.back()
            }
          }
        })
        .catch(() => {
          this.$message.error('发布失败')
        })
        .finally(() => {
          this.$data.publishLoading = false
        })
    },
    /**更新 */
    async onUpload() {
      const data = await this.validate()
      this.$data.uploadLoading = true
      Lazada.updateOnlineLazadaProduct(data)
        .then(() => {
          this.$message.success('更新成功')
          this.$router.back()
        })
        .catch(() => {
          this.$message.error('更新失败')
        })
        .finally(() => {
          this.$data.uploadLoading = false
        })
    },
    /**一键翻译 */
    async onTranslate({ lang }) {
      this.$data.transitionLoading = true
      const product = cloneDeep(this.$data.product)
      let { storeId, name, description, shortDescription, specsInfo } = product
      specsInfo == null ? (specsInfo = []) : ''
      storeId = lang === 'EN' ? null : storeId
      let optionList = []
      if (specsInfo.length) {
        optionList = specsInfo[0].options.map((item, index) => ({
          source: item,
          target: null,
          translateId: item
        }))
      }
      let params = {
        storeId,
        list: [
          { source: name, target: null, translateId: 'title' },
          { source: description, target: null, translateId: 'desc' },
          {
            source: shortDescription ? shortDescription : '',
            target: null,
            translateId: 'shortDesc'
          },
          ...optionList
        ]
      }
      if (this.$route.query.storeType == 2) {
        params.to = lang
      }
      Basic.batchTranslate(params)
        .then(({ data, code }) => {
          if (code === 0) {
            // 取出标题
            product.name = data.list.find(
              (el) => el.translateId == 'title'
            ).target
            // 取出描述
            product.description = data.list.find(
              (el) => el.translateId == 'desc'
            ).target
            // 取出短描述
            product.shortDescription = data.list.find(
              (el) => el.translateId == 'shortDesc'
            ).target
            if (product.specsInfo && product.specsInfo.length) {
              product.specsInfo[0].options = product.specsInfo[0].options.map(
                (item) => {
                  item = data.list.find((tar) => tar.translateId == item).target
                  return item
                }
              )
            }
            this.$data.product = product
            this.$message.success(this.$t('common.handlerSuccess'))
            this.$refs['productinfo'].changeDescription(product)
            this.$refs['spacesInfo'].renderSpaces(product)
          }
        })
        .catch((error) => {
          console.error(error)
          this.$message.error(this.$t('common.handlerFail'))
        })
        .finally(() => {
          this.$data.transitionLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.me-sub-title {
  border-radius: 4px;
  line-height: 25px;
  font-size: 18px;
  font-weight: 600;
  color: #262424;
  padding-left: 16px;
  border: none;
}

.actions {
}
.me-tar {
  text-align: right;
}
</style>
