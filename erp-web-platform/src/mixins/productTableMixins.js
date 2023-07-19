import Goods from '@/api/goods'
import Basic from '@/api/basic'
import Cnsc from '@/api/cnsc'
import moment from 'moment'
import { checkIllegalWord } from '@/util/document'
import { build1688SearchImgLink } from '@/util'
import { max, min, groupBy, flatten } from 'lodash'
import { message } from 'ant-design-vue'

export default {
  data() {
    return {
      params: {},
      datePickerVisible: false,
      storeAsyncStatus: false,
      storeListModalVisible: false,
      storeAsyncModalVisible: false,
      productMoveModalVisible: false,
      storeSelectedList: [],
      batchDeletePublishLoading: false,

      /**批量修改类目数据 */
      batchEditCategory: null,

      batchEditCategoryLoading: false,

      batchEditPriceVisible: false,

      batchEditVisible: false
    }
  },
  computed: {
    /**
     * 1688搜图链接组合
     */
    comb1688ImageLink() {
      return (item) => {
        if (item.mainImgUrl) {
          return build1688SearchImgLink(item.mainImgUrl)
        } else if (item.images) {
          let images = JSON.parse(item.images)
          return images.length > 0 ? build1688SearchImgLink(images[0]) : null
        } else {
          return null
        }
      }
    },
    /**
     * 获取售价
     */
    getPrice() {
      return (item) => {
        if (item.hasVariation) {
          const variantsPrices = item.variants.map(({ price }) => price)
          const _min = min(variantsPrices)
          const _max = max(variantsPrices)
          if (_max === _min) return `(${item.currency})：${_max}`
          return `(${item.currency})：${_min} ~ ${_max}`
        }
        return `(${item.currency})：${item.price}`
      }
    }
  },
  methods: {
    /**
     * 违规词库
     */
    async checkWord() {
      const { data } = await Basic.allIllegalWord()
      checkIllegalWord(data, 'checked-word')
    },
    getTableDataAfter() {
      this.checkWord()
    },
    /**
     * 禁选历史日期
     */
    disabledDate(value) {
      return moment(value).isBefore(moment().subtract(1, 'days'))
    },
    /**
     * 搜索
     */
    onSearch(data) {
      this.$data.params = data
      this.reLoadData()
    },
    /**
     * 编辑点击
     */
    onEdit({ source }) {
      //如果属于cnsc商户，后端返回的storeId为0，不用携带到编辑页，反之普通店铺也一样不携带0
      const { id, storeId, merchantId = '', shopId } = source
      var { componentsType, params } = this.$data
      let path = ''
      let query = {}
      //cnsc商户跳转到全球商品编辑
      if ([1, 9].includes(componentsType) && merchantId) {
        query = {
          merchantId,
          shopId,
          status: params?.status
        }
        let key = componentsType === 9 ? 'id' : 'productId'
        query[key] = id
        path = `/goods/cnsc-edit`
      } else {
        query = {
          edit: componentsType == 9 ? 1 : componentsType,
          storeId: storeId == '0' ? '' : storeId,
          merchantId: merchantId == '0' ? '' : merchantId,
          shopId,
          id,
          status: params?.status
        }
        path = `/goods/edit`
      }
      query.sourcePath = this.$route.path
      console.log(query)
      this.$router.push({ path, query })
    },
    /**
     * 删除
     */
    onDelete({ source }) {
      const { id } = source
      this.onSelectChange([id], [source])
      this.batchDelete()
    },
    /**
     * 批量删除
     */
    batchDelete() {
      this.$data.batchDeletePublishLoading = true
      const { selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.$message.warning(this.$t('productCatalog.deleteErrorMessage'))
        return
      }
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          let params = { productId: selectedRowKeys }
          await Goods.deleteEarlyProductList(params)
          this.$message.success(this.$t('common.handlerSuccess'))
          this.reLoadData()
          this.onSelectChange([], [])
        },
        onCancel: () => {
          this.onSelectChange([], [])
        }
      })
    },
    // 批量取消
    batchCancel() {
      const { selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.$message.warning(this.$t('productCatalog.cancelErrorMessage'))
        return
      }

      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.cancelConfirm'),
        onOk: async () => {
          let params = { productId: selectedRowKeys }
          await Goods.cancelPublish(params)
          this.$message.success(this.$t('common.handlerSuccess'))
          this.reLoadData()
          this.onSelectChange([], [])
        }
      })
    },
    /**
     * 批量立即发布
     * 需要区分普通店铺商品和cnsc店铺商品
     * 有merchantId值的是cnsc店铺走handlePublishProductsToCnscStore接口
     * 反之走普通商品发布接口
     */
    batchPublish() {
      const { selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.$message.warning(this.$t('productCatalog.publishErrorMessage'))
        return
      }

      // 普通店铺商品
      let normalProducts = this.dataSource.filter(
        (item) => selectedRowKeys.includes(item.id) && item.storeId
      )
      // cnsc店铺商品
      let cnscProducts = this.dataSource.filter(
        (item) => selectedRowKeys.includes(item.id) && item.merchantId
      )
      if (normalProducts.length > 0) {
        this.handlePublishNormalStore(normalProducts)
      }
      if (cnscProducts.length > 0) {
        this.handlePublishProductsToCnscStore(cnscProducts)
      }
    },

    // 发布到普通店铺
    handlePublishNormalStore(normalProducts) {
      let params = { productId: normalProducts.map((el) => el.id) }
      this.$data.batchPublishLoading = true
      Goods.productPublishV2(params)
        .then(({ code }) => {
          this.setLoading('_loading_', false)
          if (code == 0) {
            this.$message.success(this.$t('common.handlerSuccess'))
            this.$notification.info({
              message: this.$t('common.message'),
              duration: 15,
              description: this.$t('toBeEdit.publishLoadingMessage')
            })
          }
        })
        .catch(() => {})
        .finally(() => {
          this.$data.batchPublishLoading = false
          this.reLoadData()
        })
    },

    // 发布商品到cnsc店铺
    handlePublishProductsToCnscStore(cnscProducts) {
      let params = {
        productId: cnscProducts.map((el) => el.id)
      }
      this.$data.batchPublishLoading = true
      Cnsc.handlePublishToMerchant(params)
        .then(({ code }) => {
          this.setLoading('_loading_', false)
          if (code == 0) {
            this.$message.success(this.$t('common.handlerSuccess'))
          }
        })
        .catch(() => {
          this.$notification.info({
            message: this.$t('common.message'),
            duration: 15,
            description: this.$t('toBeEdit.publishLoadingMessage')
          })
        })
        .finally(() => {
          this.$data.batchPublishLoading = false
          this.reLoadData()
        })
    },

    /**
     * 设置加载状态
     */
    setLoading(field, status = true) {
      const { selectedRows } = this.$data
      selectedRows.forEach((element) => {
        this.$set(element, field, status)
      })
    },
    /**
     * 同步在线商品点击事件
     */
    onAsyncProduct() {
      const { storeAsyncStatus } = this.$data
      if (storeAsyncStatus) {
        this.$data.storeAsyncModalVisible = true
      } else {
        this.$data.storeListModalVisible = true
        this.$data.storeSelectedList = []
      }
    },
    /**
     * 同步在线商品开始
     */
    handleDispatchAction() {
      const selected = this.$refs['store-list-modal'].submit()
      const selectedStore = this.$refs['store-list-modal'].getSesectedStore()
      this.$data.selectedStore = selectedStore
      if (!selected.length) return
      this.$data.storeSelectedList = selected
      this.$data.storeAsyncModalVisible = true
      this.$data.storeAsyncStatus = true
      this.$data.storeListModalVisible = false
      this.$nextTick(async () => {
        this.$refs['async-goods'].async()
      })
    },
    /**
     * 同步完成
     */
    onAsyncOk() {
      this.$message.success(this.$t('productCatalog.asyncCompleteMessage'))
      console.log('同步完成')
      this.$nextTick(async () => {
        this.$refs['async-goods'].asyncDone()
      })
      this.$data.storeAsyncStatus = false
      this.$data.storeAsyncModalVisible = false
      this.reLoadData()
    },
    /**
     * 店铺搬家
     */
    onProductMove() {
      const { selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.$message.warning(this.$t('productCatalog.moveErrorMessage'))
        return
      }
      this.$data.productMoveModalVisible = true
      this.$data.storeSelectedList = []
    },
    /**
     * cnsc店铺搬家
     */
    onProductMoveCnsc() {
      let { selectedRowKeys, selectedRows, cncsMerchantList } = this.$data
      let differentStore = false
      if (!selectedRowKeys.length) {
        this.$message.warning(this.$t('productCatalog.moveErrorMessage'))
        return
      }
      if (selectedRows.length > 1) {
        selectedRows.forEach((item) => {
          if (selectedRows[0].merchantId != item.merchantId) {
            differentStore = true
          }
        })
      }
      if (differentStore) {
        return this.$message.warning(this.$t('请选择同一店铺商品'))
      }
      this.filterCnscList = cncsMerchantList.filter((item) => {
        return item.merchant_id != selectedRows[0].merchantId
      })
      if (!this.filterCnscList.length) {
        return this.$message.warning(this.$t('暂无其他CNSC店铺'))
      }
      this.$data.productMoveModalVisible = true
      this.$data.storeSelectedList = []
    },
    /**
     * 搬家提交
     */
    handleMove() {
      const selected = this.$refs['store-list-move-modal'].submit()
      if (!selected.length) return
      const { selectedRowKeys } = this.$data
      let params = {
        productIds: selectedRowKeys,
        storeId: selected
      }
      Goods.handleMoveStore(params).then(() => {
        this.$message.success(this.$t('productCatalog.moveSuccessMessage'))
        this.$data.productMoveModalVisible = false
        this.$data.storeSelectedList = []
        this.reLoadData()
      })
    },
    /**
     * 搬家提交cnsc
     */
    handleMoveCnsc() {
      const { selectMerchantKeys, selectedRowKeys } = this.$data
      if (!selectMerchantKeys.length) {
        return this.$message.warning('请选择店铺')
      }
      let params = {
        productIds: selectedRowKeys.join(),
        merchantIds: selectMerchantKeys.join()
      }
      Goods.handleMoveStoreCnsc(params).then(() => {
        this.$message.success(this.$t('productCatalog.moveSuccessMessage'))
        this.$data.productMoveModalVisible = false
        this.$data.storeSelectedList = []
        this.reLoadData()
      })
    },

    /**批量设置类目 */
    onBatchEditCategory() {
      if (!this.$data.selectedRowKeys.length) {
        return message.error('请选择需要设置类目的商品')
      }

      this.$data.batchEditCategory = this.getSiteGroup()
    },

    /**批量修改商品提交 */
    onBatchEditPriceSubmit() {
      this.$refs.setPriceTemplate.submit().then(() => {
        this.batchEditPriceVisible = false
        this.reLoadData()
        this.$message.success('操作成功')
      })
    },
    /**批量修改类目提交 */
    onBatchEditCategorySubmit() {
      this.batchEditCategoryLoading = true
      const mp = this.batchEditCategory.map(({ items, value }) => {
        if (!value) return Promise.resolve()
        items = items.map((item) => {
          return { ...item, ...value }
        })
        return Goods.handleEditBatch(items)
      })
      Promise.all(mp)
        .then(() => {
          this.batchEditCategory = null
          this.reLoadData()
        })
        .finally(() => {
          this.batchEditCategoryLoading = false
        })
    },
    /**类目选择 */
    onCategoryChoose(item) {
      const { countryCode } = item
      this.$categoryChoose(countryCode).then(async (data) => {
        this.$set(item, 'value', data)
      })
    },

    /**获取站点组 */
    getSiteGroup() {
      const sites = groupBy(this.$data.selectedRows, 'siteName')
      return Object.keys(sites).map((name) => {
        const [first] = sites[name]
        const _name_ = name === 'null' ? 'CNSC' : name
        return {
          items: sites[name],
          name: _name_,
          currency: first.currency,
          countryCode: first.countryCode
        }
      })
    },
    /**批量修改价格 */
    onBatchEditPrice() {
      if (!this.$data.selectedRowKeys.length) {
        return message.error('请选择需要设置价格的商品')
      }
      this.$priceTemplate(this.selectedRows).then((data) => {
        Goods.handleEditBatch(flatten(data)).then(() => {
          this.$message.success('批量修改成功')
        })
      })
    },
    onVisibleChange(visible) {
      const { selectedRows } = this.$data
      if (!selectedRows.length) {
        this.$message.error(this.$t('common.handlerLimit'))
        this.$data.batchEditVisible = false
        return
      }
      this.$data.batchEditVisible = visible
    }
  }
}
