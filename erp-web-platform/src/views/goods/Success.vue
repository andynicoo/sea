<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" :title="$t('edit.goodssuccess')">
    </a-page-header>
    <a-layout class="me-page-layout">
      <SearchForm @search="onSearch" :type="componentsType"></SearchForm>

      <StatusTabs ref="sub" />
      <a-affix :offset-top="60" class="custom-affix">
        <a-space class="me-mb-3">
          <a-button @click="batchDelete">
            {{ $t('faild.batchDelete') }}
          </a-button>
        </a-space>
      </a-affix>

      <!-- 列表 -->
      <CommodityList
        :loading="tableLoading"
        :data-source="dataSource"
        :type="componentsType"
        :rowSelection="rowSelection"
        :pagination="getPagination"
        @change="changePage"
      >
        <div slot="actions" slot-scope="source">
          <!-- <a-button class="me-pa-1" type="link" @click="onEdit(source)">
            {{ $t('common.edit') }}
          </a-button> -->
          <a-button type="link" class="me-pa-1" @click="goShopee(source)">
            {{ $t('edit.backgroundEdit') }}
          </a-button>
          <!-- <a-divider type="vertical" /> -->
          <!-- <a-button
            class="me-pa-1"
            v-if="!source.source.merchantId"
            :loading="source.source._loading_"
            type="link"
            @click="onRePush(source)"
          >
            {{ $t('faild.rePush') }}
          </a-button> -->
          <!-- <a-button
            class="me-pa-1"
            v-if="source.source.merchantId"
            :loading="source.source._loading_"
            type="link"
            @click="handlePublishSingle(source.source)"
          >
            发布
          </a-button> -->
          <a-divider type="vertical" />
          <a-button
            class="me-pa-1 me-error"
            type="link"
            @click="onDelete(source)"
          >
            {{ $t('common.delete') }}
          </a-button>
          <div class="me-mr-2 me-status-skip me-fs12">
            <div>{{ $t('commodityList.lastModifiedTime') }}:</div>
            {{ source.source.updateTime }}
          </div>
        </div>
      </CommodityList>
    </a-layout>

    <!-- 同步进度 -->
    <a-modal
      :title="$t('onSale.asyncProduct')"
      width="900px"
      :visible="storeAsyncModalVisible"
      :footer="false"
      @cancel="
        storeAsyncModalVisible = false
        storeSelectedList = []
      "
    >
      <AsyncGoods
        @ok="onAsyncOk"
        :title="$t('copy.tongbu')"
        :storeIds="storeSelectedList"
        ref="async-goods"
      />
    </a-modal>

    <!-- 同步在线商品选择店铺 -->
    <a-modal
      :title="$t('onSale.chooseStore')"
      destroyOnClose
      :visible="storeListModalVisible"
      @ok="handleDispatchAction"
      @cancel="
        storeListModalVisible = false
        storeSelectedList = []
      "
    >
      <StoreListModal ref="store-list-modal" />
    </a-modal>

    <!-- 搬家选择店铺 -->
    <a-modal
      :title="$t('onSale.chooseStore')"
      destroyOnClose
      :visible="productMoveModalVisible"
      @ok="handleMove"
      @cancel="
        productMoveModalVisible = false
        storeSelectedList = []
      "
    >
      <StoreListModal ref="store-list-move-modal" />
    </a-modal>
    <!-- 发布至店铺 -->
    <a-modal
      :visible="publishModalVisible"
      width="60%"
      :title="$t('onSale.chooseStore')"
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
  </div>
</template>

<script>
import SearchForm from './components/SearchForm'
import CommodityList from './components/CommodityList'
import tableMixins from '@/mixins/tableMixins'
import productTableMixins from '@/mixins/productTableMixins'
import StatusTabs from './components/StatusTabs.vue'
import Goods from '@/api/goods'
import StoreListModal from './components/StoreListModal'
import AsyncGoods from './components/AsyncGoods'
import { groupBy } from 'lodash'
// import BatchEditOption from './components/BatchEditOption'
import bus from '@/bus'
import Cnsc from '@/api/cnsc'

export default {
  mixins: [tableMixins, productTableMixins],
  components: {
    CommodityList,
    SearchForm,
    StatusTabs,
    StoreListModal,
    AsyncGoods
    // BatchEditOption
  },
  data() {
    return {
      componentsType: 9,
      params: {},
      onlineProductEditVisible: false,
      updateLoading: false,
      batchEditNextLoading: false,
      batchEditVisible: false,
      publishModalVisible: false, //发布至店铺弹框
      merchantData: {
        merchantName: null,
        storeList: []
      },
      confirmLoading: false //操作加载状态
    }
  },
  methods: {
    getTableData() {
      const { size, current } = this.$data.paginationData
      const { params, componentsType } = this.$data
      return Goods.getEarlyProductList({
        ...params,
        size,
        current,
        type: componentsType
      })
    },
    onSearch(params) {
      this.$data.params = params
      this.reLoadData()
    },
    /**
     * 重新发布
     */
    onRePush({ source }) {
      const { id } = source
      this.onSelectChange([id], [source])
      let params = { productId: [id] }
      this.setLoading('_loading_')
      Goods.productPublish(params).then(({ code }) => {
        this.setLoading('_loading_', false)
        // console.log(code)
        if (code == 0) {
          this.$message.success(this.$t('common.handlerSuccess'))
          this.loadData()
        }
      })
    },
    onViewChange({ target }) {
      const { checked } = target
      this.$set(this.$data.params, 'view', checked ? 0 : undefined)
      this.$nextTick(this.reLoadData)
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
      Goods.handleSyncProductById({ productId: arr })
        .then(() => {
          this.$message.success(this.$t('common.updateSuccess'))
          this.loadData()
        })
        .finally(() => {
          this.$data.updateLoading = false
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
    },
    getCountNum() {
      this.$nextTick(() => {
        bus.$emit('updateCount')
      })
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
    cancelPublish() {
      this.publishModalVisible = false
      this.onSelectChange([], [])
    },
    // 前往Shopee管理后台
    goShopee(source) {
      const target = source.source.merchantId
        ? 'https://seller.shopee.cn/portal/product/mtsku/' +
          source.source.itemId
        : source.source.itemPortalUrl
      this.openPage(target, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled-text {
  color: #999999 !important;
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

<style lang="scss">
.xxxx {
  .ant-checkbox + span {
    padding-left: 4px;
  }
}
</style>
