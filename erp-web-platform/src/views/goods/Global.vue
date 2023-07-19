// 全球商品
<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" title="全球商品"> </a-page-header>
    <a-layout class="me-page-layout">
      <SearchForm
        @search="onSearch"
        :type="componentsType"
        :cncsMerchantList="cncsMerchantList"
      />
      <a-space class="me-mb-3">
        <a-button
          :loading="syncLoading"
          type="primary"
          @click="syncModalVisible = true"
          >{{ $t('commodityList.syncProducts') }}</a-button
        >
        <a-dropdown>
          <a-button
            :loading="updateLoading"
            @click="(e) => e.preventDefault()"
            type="primary"
          >
            {{ $t('onSale.updateProduct') }}
            <a-icon type="down" />
          </a-button>
          <a-menu slot="overlay">
            <a-menu-item @click="onUpdateProduct(false)">
              {{ $t('onSale.updateSelectedProducts') }}
            </a-menu-item>
            <a-menu-item @click="onUpdateProduct(true)">
              {{ $t('onSale.updateAllProducts') }}
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item
              :key="item.merchant_id"
              v-for="item in cncsMerchantList"
              @click="prePublishToStore(item)"
            >
              {{ item.merchant_name }}
            </a-menu-item>
          </a-menu>
          <a-button type="primary">
            {{ $t('commodityList.publishStore') }} <a-icon type="down" />
          </a-button>
        </a-dropdown>
        <a-button @click="handleBatchDelete">{{
          $t('edit.deleteBatches')
        }}</a-button>
        <a-button type="primary" @click="onProductMoveCnsc">
          {{ $t('onSale.moved') }}
        </a-button>
      </a-space>
      <CommodityList
        :loading="tableLoading"
        :data-source="dataSource"
        :type="componentsType"
        showStatus
        :rowSelection="rowSelection"
        :pagination="getPagination"
        @change="changePage"
      >
        <div slot="actions" slot-scope="item">
          <a-button type="link" class="me-pa-1" @click="toEdit(item)">
            {{ $t('edit.edit') }}
          </a-button>
          <a-divider type="vertical" />
          <!-- <a-button type="link" class="me-pa-1" @click="onEdit(item)">
            编辑
          </a-button> -->
          <a-button
            :loading="item.source._r_loading_"
            type="link"
            class="me-pa-1"
            @click="handleUpdate(item)"
          >
            {{ $t('edit.update') }}
          </a-button>
          <a-divider type="vertical" />
          <a-button
            type="link"
            class="me-pa-1"
            @click="handlePublishSingle(item.source)"
          >
            {{ $t('edit.publish') }}
          </a-button>

          <div>
            <a-button
              type="link"
              class="me-pa-1 me-error"
              @click="handleDelete(item)"
            >
              {{ $t('common.delete') }}
            </a-button>
            <a-divider type="vertical" />
            <a-button
              type="link"
              class="me-pa-1 me-error"
              @click="goShopee(item)"
            >
              {{ $t('edit.backgroundEdit') }}
            </a-button>
          </div>

          <div class="me-mr-2 me-status me-status-skip">
            <div>{{ $t('commodityList.lastModifiedTime') }}:</div>
            {{ item.source.updateTime }}
          </div>
        </div>
      </CommodityList>
    </a-layout>
    <!-- 商户弹框 -->
    <a-modal
      :visible="syncModalVisible"
      title="选择商户"
      @ok="handleSyncProducts"
      @cancel="
        syncModalVisible = false
        onMerchantSelectChange([], [])
      "
    >
      <a-table
        rowKey="merchant_id"
        :columns="merchantColumns"
        :data-source="cncsMerchantList"
        :row-selection="{
          selectedRowKeys: selectMerchantKeys,
          onChange: onMerchantSelectChange
        }"
      ></a-table>
    </a-modal>

    <!-- 发布至店铺 -->
    <a-modal
      :visible="publishModalVisible"
      width="60%"
      title="选择店铺"
      :confirm-loading="confirmLoading"
      @ok="handlePublishToStore"
      @cancel="cancelPublish"
    >
      <div class="merchant-wrap">
        <div class="merchant-item">
          <div class="left">
            {{ merchantData.merchantName }}
          </div>
          <div class="right">
            <ul v-for="(val, key) in merchantData.storeList" :key="key">
              <div class="site-name">
                <a-checkbox v-model="val.checked">
                  {{ key }}
                </a-checkbox>
              </div>
              <div class="radio-wrap">
                <a-radio-group name="radioGroup" v-model="val.checkedStore">
                  <a-radio
                    v-for="storeItem in val"
                    :value="storeItem.store_id"
                    :key="storeItem.store_id"
                    :disabled="!val.checked"
                  >
                    {{ storeItem.store_name }}
                  </a-radio>
                </a-radio-group>
              </div>
            </ul>
          </div>
        </div>
      </div>
      <p style="line-height:38px;color:red">{{ $t('edit.storePostedSite') }}</p>
    </a-modal>
    <!-- 搬家选择店铺 -->
    <a-modal
      :title="$t('onSale.chooseStore')"
      destroyOnClose
      :visible="productMoveModalVisible"
      @ok="handleMoveCnsc"
      @cancel="
        productMoveModalVisible = false
        onMerchantSelectChange([], [])
      "
    >
      <a-table
        rowKey="merchant_id"
        :columns="merchantColumns"
        :data-source="filterCnscList"
        :row-selection="{
          selectedRowKeys: selectMerchantKeys,
          onChange: onMerchantSelectChange
        }"
      ></a-table>
    </a-modal>
  </div>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import productTableMixins from '@/mixins/productTableMixins'
import CommodityList from './components/CommodityList'
import SearchForm from './components/SearchForm'
import Cnsc from '@/api/cnsc'
import { groupBy, isEmpty } from 'lodash'
import { mapState } from 'vuex'

export default {
  mixins: [tableMixins, productTableMixins],
  components: {
    SearchForm,
    CommodityList
  },
  computed: {
    ...mapState({
      storeInfoList: (state) => state.auth.storeList
    })
  },
  data() {
    return {
      params: {
        merchant_id: null //商户
      },
      componentsType: 10, //cnsc特用枚举
      cncsMerchantList: [], // 商户列表
      filterCnscList: [], // 过滤后的商户列表
      syncModalVisible: false, //同步弹框
      selectMerchantKeys: [], //选中的商户索引
      selectMerchantRows: [], //选中的商户
      merchantColumns: [
        {
          dataIndex: 'merchant_name',
          title: '商户名称'
        }
      ],
      publishModalVisible: false, //发布至店铺弹框
      merchantData: {
        merchantName: null,
        storeList: []
      },
      updateLoading: false,
      syncLoading: false,
      confirmLoading: false //操作加载状态
    }
  },

  async mounted() {
    let { data: cncsMerchantList } = await Cnsc.getMerchantPublishable()
    if (cncsMerchantList) this.cncsMerchantList = cncsMerchantList
  },

  methods: {
    getTableDataBefore() {
      this.$data.dataSource = []
    },
    getTableDataAfter() {
      // 处理发布后对应的店铺id展示name
      this.dataSource.map((item) => {
        if (!isEmpty(item.publishShops)) {
          item.publishShops.map((val) => {
            if (val.success === 'success') {
              item['isShowShops'] = true
              const storeInfo = this.storeInfoList.filter(
                (store) => store.platformId == val.shopId
              )[0]
              val['storeName'] =
                storeInfo.countryCode + '-' + storeInfo.storeName
            }
          })
        }
      })
    },
    /**搜索 */
    onSearch(data) {
      this.$data.params = { ...this.$data.params, ...data }
      this.reLoadData()
    },
    getTableData() {
      const { size, current } = this.$data.paginationData
      const { params } = this.$data
      return Cnsc.getCnscGoodsPage({
        ...params,
        size,
        status: 1,
        current
      })
    },

    // 同步
    handleSyncProducts() {
      const { selectMerchantKeys, selectMerchantRows } = this.$data
      if (selectMerchantKeys.length == 0) {
        this.$message.warning(this.$t('onSale.updateError'))
        return false
      }
      this.syncLoading = true
      let params = {
        merchantIds: selectMerchantRows.map((el) => el.merchant_id)
      }
      Cnsc.handleSyncProduct(params).then(() => {
        this.$message.success(this.$t('common.handlerSuccess'))
        this.syncModalVisible = false
        this.syncLoading = false
        this.reLoadData()
      })
    },

    // 发布至店铺
    async prePublishToStore(merchantInfo) {
      const { merchant_id, merchant_name } = merchantInfo
      const { selectedRowKeys, selectedRows } = this.$data
      if (selectedRowKeys.length == 0) {
        this.$message.warning(this.$t('global.pleaceSelectGoods'))
        return false
      }
      let checkedMerchantIds = selectedRows.map((el) => el.merchantId)
      if ([...new Set(checkedMerchantIds)].length > 1) {
        this.$message.warning(this.$t('global.pleaceSelectSameMerchant'))
        return false
      }

      if (!merchant_id) {
        this.$message.warning(this.$t('global.pleaceSelectMerchant'))
        return false
      }
      let { data: storeList } = await Cnsc.getStorePublishable(
        merchantInfo.merchant_id
      )
      this.merchantData.merchantName = merchant_name
      this.merchantData.storeList = groupBy(storeList, 'country_code')
      this.publishModalVisible = true
    },

    // 单独发布
    async handlePublishSingle(item) {
      this.onSelectChange([item.id], [item])
      const { merchantId, merchantName } = item
      let params = {
        merchant_name: merchantName,
        merchant_id: merchantId
      }
      this.prePublishToStore(params)
    },

    // 发布至店铺
    handlePublishToStore() {
      //找出选中的店铺ids
      const { storeList } = this.merchantData
      let checkedStoreIds = []
      Object.keys(storeList).forEach((key) => {
        // 如果选中了站点
        if (storeList[key].checked) {
          checkedStoreIds.push(storeList[key].checkedStore)
        }
      })
      let params = {
        shopId: checkedStoreIds,
        productId: this.selectedRows.map((el) => el.id)
      }
      this.confirmLoading = true
      Cnsc.handlePublishProductsToStore(params)
        .then(() => {
          this.confirmLoading = false
          this.$message.success(this.$t('common.handlerSuccess'))
        })
        .catch(() => {
          this.confirmLoading = false
          this.$message.error(this.$t('common.handlerFail'))
        })
        .finally(() => {
          this.confirmLoading = false
          this.publishModalVisible = false
          this.selectMerchantKeys = []
        })
    },

    // 去编辑
    toEdit({ source }) {
      const { id, merchantId = '' } = source
      const path = `/goods/cnsc-edit?id=${id}&merchantId=${merchantId}`
      this.$router.push({ path })
    },

    // 删除
    handleDelete({ source }) {
      const { id } = source
      this.onSelectChange([id], [source])
      this.handleBatchDelete()
    },

    // 删除操作
    handleBatchDelete(str) {
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
          await Cnsc.deleteProducts(params)
          this.$message.success(this.$t('common.handlerSuccess'))
          this.reLoadData()
          this.onSelectChange([], [])

          if (str == 'delete') this.getCountNum()
        },
        onCancel: () => {
          this.onSelectChange([], [])
        }
      })
    },

    cancelPublish() {
      this.publishModalVisible = false
      this.onSelectChange([], [])
    },

    onMerchantSelectChange(selectedRowKeys, selectItems) {
      this.selectMerchantKeys = selectedRowKeys
      this.selectMerchantRows = selectItems
    },
    // 更新商品
    handleUpdate({ source }) {
      const { id } = source
      this.onSelectChange([id], [source])
      this.setLoading('_r_loading_')
      Cnsc.syscProductSingle({ productId: [id] })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success(this.$t('common.updateSuccess'))
            this.loadData()
          }
        })
        .finally(() => {
          this.setLoading('_r_loading_', false)
        })
    },
    /**更新商品 */
    onUpdateProduct(status) {
      let arr = []
      if (!status) {
        // 更新选中商品
        const { selectedRowKeys } = this.$data
        arr = [...selectedRowKeys]
        if (!arr.length) {
          this.$message.warning(this.$t('onSale.updateError'))
          return
        }
      }
      this.$data.updateLoading = true
      Cnsc.syscProductSingle({ productId: arr })
        .then(() => {
          this.$message.success(this.$t('common.updateSuccess'))
          this.loadData()
        })
        .finally(() => {
          this.$data.updateLoading = false
        })
    },
    // 前往Shopee管理后台
    goShopee(item) {
      this.openPage(
        'https://seller.shopee.cn/portal/product/mtsku/' + item.source.itemId,
        '_blank'
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.me-page-title-wrap {
  padding: 13px 16px;
  background: #fff;
  .title {
    font-weight: 600;
  }
}
.merchant-wrap {
  .merchant-item {
    display: table;
    width: 100%;
    .left,
    .right {
      display: table-cell;
    }
    .left {
      width: 30%;
      margin-right: 38px;
      border-right: 1px solid #ededed;
      font-weight: 600;
      border-bottom: 1px solid #ededed;
    }
    .right {
      width: 70%;
      border-bottom: 1px solid #ededed;
      padding-left: 28px;
      box-sizing: border-box;
      ul {
        width: 100%;
        line-height: 40px;
        .site-name {
          width: 120px;
          font-weight: 600;
        }
        .radio-wrap {
          padding-left: 20px;
          .ant-radio-wrapper {
            line-height: 40px;
          }
        }
      }
    }
  }
}
</style>
