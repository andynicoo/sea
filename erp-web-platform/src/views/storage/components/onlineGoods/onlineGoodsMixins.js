import { compact } from 'lodash'
import { isEmpty } from '@/util'
import Storage from '@/api/storage'
import { downloadFile } from '@/util/index'

export default {
  data() {
    return {
      sitesList: [],
      pairVisible: false,
      importVisible: false,
      profitVisible: false,
      pairConfirmLoading: false,
      importConfirmLoading: false,
      profitConfirmLoading: false,
      pairInfoData: null
    }
  },
  mounted() {},
  computed: {
    /**当前选中站点的店铺 */
    currentStore() {
      const { sitesList } = this.$data
      const stores = this.stores.map(({ value, children }) => {
        if (sitesList.includes(value)) {
          return children
        }
      })
      return compact(stores).reduce((pre, cur) => pre.concat(cur), [])
    },
    checkAll() {
      return this.$data.sitesList.length === this.stores.length
    },
    indeterminate() {
      return (
        this.stores.length > this.$data.sitesList.length &&
        this.$data.sitesList.length > 0
      )
    },
    stores() {
      return this.$store.getters.getStoreListSize
    }
  },
  methods: {
    onCheckAllChange({ target }) {
      this.$data.params.storeId = null
      if (target.checked) {
        this.$data.sitesList = this.stores.map(({ value }) => value)
      } else {
        this.$data.sitesList = []
      }
    },
    onSiteChange() {
      this.$data.params.storeId = null
    },

    /**导入取消 */
    onImportCancel() {
      this.$data.importVisible = false
      this.$data.importConfirmLoading = false
    },
    /**导入 */
    onImportOk() {
      this.importConfirmLoading = true
      this.$refs.importExcel
        .handleUpload()
        .then(() => {
          this.reLoadData()
          this.$data.importVisible = false
          this.$message.success('导入成功')
        })
        .catch(() => {
          this.$message.error(this.$t('common.handlerFail'))
        })
        .finally(() => {
          this.importConfirmLoading = false
        })
    },
    /**配对取消 */
    onPairCancel() {
      this.$data.pairVisible = false
      this.$data.pairConfirmLoading = false
      this.$data.pairInfoData = null
    },
    /**配对 */
    onPairOk() {
      const pairInfoData = this.$data.pairInfoData
      const data = this.$refs.pairStorageSkuList.radioCheckedData
      if (isEmpty(data.id)) {
        this.errorAlert('请选择需要配对的本地SKU')
        return
      }
      let params = {
        productId: pairInfoData.productId,
        productItemId: data.itemId,
        productItemSku: data.itemSku,
        productVariationsId: data.variationsId,
        productVariationsSku: data.variationSku,
        shopeeId: pairInfoData.shopeeId,
        shopeeItemId: pairInfoData.itemId,
        shopeeVariationsId: pairInfoData.variationId,
        shopeeVariationsSku: pairInfoData.variationSku
      }
      this.pairConfirmLoading = true
      Storage.updateProductPair(params).then((res) => {
        this.pairConfirmLoading = false
        if (res.code === 0) {
          this.pairVisible = false
          this.paginationData.current = 1
          this.reLoadData()
          this.$message.success('配对成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**预估利润 */
    onProfit() {
      const selectedRowKeys = this.$data.selectedRowKeys
      if (!selectedRowKeys.length) {
        this.$message.error('请选择需要预估利润的商品')
        return
      }
      this.$data.profitVisible = true
    },
    /**预估利润 */
    onProfitOk() {
      const templateId = this.$refs.setPriceTemplate.currentTemplateId
      if (isEmpty(templateId)) {
        this.$message.error('请选择定价模板')
        return
      }
      let arr = this.selectedRows.map((item) => ({
        currency: item.currency,
        id: templateId,
        weight: item.weight,
        purchaseCost: item.cost,
        listPrice: item.price,
        shopeeVariationsId: item.variationId,
        productVariationsSku: item.localSku
      }))
      this.$data.profitConfirmLoading = true
      Storage.profitProductPrice(arr).then((res) => {
        this.$data.profitConfirmLoading = false
        if (res.code === 0) {
          this.$data.profitVisible = false
          this.reLoadData()
          this.$message.success('操作成功')
        } else {
          this.$message.success(res.message)
        }
      })
    },
    /**预估利润取消 */
    onProfitCancel() {
      this.$data.profitVisible = false
      this.$data.profitConfirmLoading = false
    },
    /**导出 */
    onExport() {
      Storage.productExport(this.$data.params).then((res) => {
        downloadFile(res, '在线商品')
      })
    }
  }
}
