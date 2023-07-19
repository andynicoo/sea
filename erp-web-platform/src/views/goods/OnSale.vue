<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" title="在线商品"> </a-page-header>
    <a-layout class="me-page-layout">
      <SearchForm @search="onSearch">
        <template v-slot:form-item>
          <!-- <a-form-item label="店铺类型">
            <a-select
              v-decorator="['isCnsc']"
              style="width: 190px"
              allowClear
              :placeholder="$t('edit.placeChoose')"
            >
              <a-select-option value="0"> 其他店铺 </a-select-option>
              <a-select-option value="1"> CNSC店铺 </a-select-option>
            </a-select>
          </a-form-item> -->
          <a-form-item label="商品类型">
            <a-select
              v-decorator="['goodType']"
              style="width: 190px"
              allowClear
              :placeholder="$t('edit.placeChoose')"
            >
              <a-select-option value="1"> 全部商品 </a-select-option>
              <a-select-option value="2"> 促销商品 </a-select-option>
              <a-select-option value="3"> 预售商品 </a-select-option>
            </a-select>
          </a-form-item>
        </template>
      </SearchForm>
      <a-tabs
        :activeKey="params.status"
        @change="onTabsChange"
        type="card"
        class="me-tab"
      >
        <a-tab-pane
          :key="1"
          :tab="
            this.$t('onSale.uped') +
              (counts.normalCount == 0 || counts.normalCount == undefined
                ? ''
                : '(' + counts.normalCount + ')')
          "
        ></a-tab-pane>
        <a-tab-pane
          :key="0"
          :tab="
            $t('onSale.downed') +
              (counts.unlistCount == 0 || counts.unlistCount == undefined
                ? ''
                : '(' + counts.unlistCount + ')')
          "
        ></a-tab-pane>
        <!-- <a-tab-pane :key="2" :tab="$t('onSale.disabled')"> </a-tab-pane> -->
      </a-tabs>

      <a-affix :offset-top="60" class="custom-affix">
        <a-space class="me-mb-3">
          <a-button type="primary" @click="onlineProductEditVisible = true">
            {{ $t('onSale.batchEdit') }}
          </a-button>

          <a-button type="primary" @click="onAsyncProduct">
            {{ $t('onSale.asyncOnlineProducts') }}
          </a-button>

          <!-- <a-dropdown>
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
          </a-dropdown> -->

          <a-button type="primary" @click="onProductMove">
            {{ $t('onSale.moved') }}
          </a-button>

          <template v-if="params.status !== 2">
            <template v-if="params.status === 0">
              <a-button :loading="batchUpLoading" @click="onBatchUp">
                {{ $t('onSale.batchUp') }}
              </a-button>
            </template>
            <template v-if="params.status === 1">
              <a-button :loading="batchDownLoading" @click="onBatchDown">
                {{ $t('onSale.batchDown') }}
              </a-button>
            </template>

            <!-- <a-button @click="onAutoTop">
              {{ $t('onSale.autoTop') }}
            </a-button> -->
          </template>

          <a-button @click="batchDelete">
            {{ $t('onSale.batchDelete') }}
          </a-button>

          <template v-if="params.status === 1">
            <a-checkbox :value="0" @change="onViewChange" class="xxxx">
              {{ $t('onSale.onlyViewNotFlowProduct') }}
            </a-checkbox>
          </template>
        </a-space>
      </a-affix>

      <!-- 列表 -->
      <CommodityList
        :loading="tableLoading"
        :data-source="dataSource"
        :type="componentsType"
        showStatus
        :rowSelection="rowSelection"
        :pagination="getPagination"
        @change="changePage"
        @reloadPageData="reloadPageData"
      >
        <div slot="actions" slot-scope="source">
          <!-- CNSC不允许操作，只能在全球商品编辑 -->
          <a-button class="me-pa-1" type="link" @click="onEdit(source)">
            {{ $t('common.edit') }}
          </a-button>
          <a-divider type="vertical" v-if="!source.source.merchantId" />
          <template v-if="params.status !== 2 && !source.source.merchantId">
            <!-- <a-button
              :loading="source.source._p_loading_"
              class="me-pa-1"
              :class="{ 'disabled-text': source.source.topTime != null }"
              type="link"
              @click="onPlacetop(source)"
              :disabled="source.source.topTime != null"
            >
              {{ $t('onSale.top') }}
            </a-button>
            <a-divider type="vertical" /> -->
            <template v-if="params.status === 0">
              <a-button
                :loading="source.source._u_loading_"
                class="me-pa-1"
                type="link"
                @click="onUp(source)"
              >
                {{ $t('onSale.up') }}
              </a-button>
              <a-divider type="vertical" />
            </template>
            <a-button
              :loading="source.source._r_loading_"
              class="me-pa-1"
              type="link"
              @click="onUpdate(source)"
            >
              {{ $t('onSale.update') }}
            </a-button>
            <a-divider type="vertical" />
            <a-button
              :loading="source.source._c_loading_"
              class="me-pa-1"
              type="link"
              @click="cancelDiscount(source.source)"
              v-if="source.source.discountId"
            >
              取消参加活动
            </a-button>
            <a-button
              :loading="source.source._c_loading_"
              class="me-pa-1"
              type="link"
              @click="addDiscount(source.source)"
              v-else
            >
              参加活动
            </a-button>
          </template>
          <div class="me-mr-2">
            <template v-if="params.status === 1 && !source.source.merchantId">
              <a-button
                :loading="source.source._d_loading_"
                class="me-pa-1 me-error"
                type="link"
                @click="onDown(source)"
              >
                {{ $t('onSale.down') }}
              </a-button>
              <a-divider type="vertical" />
            </template>
            <a-button
              type="link"
              class="me-pa-1 me-error"
              @click="onDelete(source)"
            >
              {{ $t('common.delete') }}
            </a-button>
            <a-divider type="vertical" />
            <a-button
              type="link"
              class="me-pa-1 me-error"
              @click="goShopee(source)"
            >
              {{ $t('edit.backgroundEdit') }}
            </a-button>
          </div>
          <div class="me-mr-2 me-fs12 me-status-skip">
            <div>{{ $t('toBeEdit.lastModifiedTime') }}:</div>
            {{ source.source.updateTime }}
          </div>
        </div>
      </CommodityList>
    </a-layout>
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
        :selectedStore="selectedStore"
        ref="async-goods"
        @resetAsyncStatus="resetAsyncStatus"
      />
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

    <a-modal
      :title="$t('onSale.onLineBatchEdit')"
      :visible="onlineProductEditVisible"
      :footer="null"
      @cancel="
        onlineProductEditVisible = false
        reLoadData()
      "
    >
      <p class="me-text-center">
        {{ $t('onSale.modelMsg1') }}
      </p>
      <p class="me-text-center me-mt-4">
        <a-space>
          <a-button @click="asyncOnlineProduct" type="primary">
            {{ $t('onSale.asyncOnlineProducts') }}
          </a-button>
          <a-button :loading="batchEditNextLoading" @click="batchEditNext">
            {{ $t('onSale.modelMsg2') }}
          </a-button>
        </a-space>
      </p>
    </a-modal>

    <a-modal
      width="900px"
      :title="$t('onSale.onLineBatchEdit')"
      :visible="onlineProductEditChooseStoreVisible"
      destroyOnClose
      :maskClosable="false"
      @ok="onOnlineBatchEditChooseStoreOk"
      @cancel="
        onlineProductEditChooseStoreVisible = false
        reLoadData()
      "
    >
      <p class="me-mb-2">{{ $t('onSale.modelMsg3') }}</p>
      <StoreListModal
        rowSelectionType="radio"
        ref="online-product-edit-choose-store"
      />
    </a-modal>

    <a-modal
      width="90%"
      :title="null"
      :visible="onlineProductEditTabsVisible"
      destroyOnClose
      :maskClosable="false"
      :footer="null"
      @cancel="onlineProductEditTabsVisible = false"
    >
      <OnlineBatchEditTabs
        @cancel="
          onlineProductEditTabsVisible = false
          currentStore = null
          reLoadData()
        "
        :store="currentStore"
        :status="params.status"
        :currentObj="currentObj"
      />
    </a-modal>
  </div>
</template>

<script>
import SearchForm from './components/SearchForm'
import tableMixins from '@/mixins/tableMixins'
import productTableMixins from '@/mixins/productTableMixins'
import CommodityList from './components/CommodityList'
import StoreListModal from './components/StoreListModal'
import AsyncGoods from './components/AsyncGoods'
import Goods from '@/api/goods'
import moment from 'moment'
import OnlineBatchEditTabs from './components/OnlineBatchEditTabs'
import { cloneDeep } from 'lodash'
import Discount from '@/api/discount'

import { Modal } from 'ant-design-vue'

export default {
  components: {
    SearchForm,
    CommodityList,
    StoreListModal,
    AsyncGoods,
    OnlineBatchEditTabs
  },
  mixins: [tableMixins, productTableMixins],
  data() {
    const status = parseInt(this.$route.query.status || 1)
    return {
      params: { status: status },
      componentsType: 1,
      currentStore: null,
      currentObj: {},
      batchDownLoading: false,
      updateLoading: false,
      batchUpLoading: false,
      batchEditNextLoading: false,
      onlineProductEditVisible: false,
      onlineProductEditChooseStoreVisible: false,
      onlineProductEditTabsVisible: false,
      counts: {
        unlistCount: 0, // 下架数
        normalCount: 0 // 上架数
      },
      // 同步在线商品，已选的店铺
      selectedStore: []
    }
  },
  mounted() {
    // 商品上下架数量统计
    // this.getCountNum()
  },
  methods: {
    getCountNum() {
      this.$data.params
      var params = {
        ...this.$data.params,
        type: 1
      }
      params.status = null
      Goods.getGoodsListCount(params).then(({ data }) => {
        this.$data.counts = data
      })
    },
    reloadPageData() {
      this.loadData()
    },
    async loadData(flag) {
      this.$data.tableLoading = true
      if (flag == 'delete') {
        if (this.$data.dataSource.length == 1) {
          this.$data.paginationData.current -= 1
        }
      }
      if (this.getTableDataBefore) await this.getTableDataBefore()
      try {
        const { data } = await this.getTableData()
        var converArr = cloneDeep(data.records)
        converArr = converArr.map((ele) => {
          if (!ele.shopeeProductExtDTO) {
            ele.shopeeProductExtDTO = []
          }
          return ele
        })
        this.$data.dataSource = converArr
        this.$data.paginationData = this.getPageFromResp(data)
        if (this.getTableDataAfter) await this.getTableDataAfter()
      } catch (error) {
        console.warn('没有数据:', error)
      } finally {
        // 如果有统计数，刷新统计数
        try {
          // this.getCountNum()
        } catch (error) {
          console.log(error)
        }

        this.$data.tableLoading = false
        if (this.$data.clearSelectedRows) {
          this.$data.selectedRowKeys = []
          this.$data.selectedRows = []
        }
      }
    },
    getTableDataBefore() {
      this.$data.dataSource = []
    },
    /**搜索 */
    onSearch(data) {
      this.$data.params = { ...this.$data.params, ...data }
      this.reLoadData()
    },
    getTableData() {
      const { size, current } = this.$data.paginationData
      const { params, componentsType } = this.$data
      return Goods.getProductList({
        ...params,
        size,
        current,
        type: componentsType
      })
    },
    /**更新商品单条 */
    onUpdate({ source }) {
      const { id } = source
      this.onSelectChange([id], [source])
      this.setLoading('_r_loading_')
      Goods.handleSyncProductById({ productId: [id] })
        .then(() => {
          this.$message.success(this.$t('common.updateSuccess'))
          this.loadData()
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
      Goods.handleSyncProductById({ productId: arr })
        .then(() => {
          this.$message.success(this.$t('common.updateSuccess'))
          this.loadData()
        })
        .finally(() => {
          this.$data.updateLoading = false
        })
    },
    /**上架 */
    onUp({ source }) {
      const { id } = source
      this.onSelectChange([id], [source])
      this.setLoading('_u_loading_')
      this.onBatchUp().finally(() => {
        this.setLoading('_u_loading_', false)
        // this.getCountNum()
      })
    },
    /**批量上架 */
    onBatchUp() {
      return new Promise((resolve) => {
        this.$data.batchUpLoading = true
        this.upSubmit().finally(() => {
          this.$data.batchUpLoading = false
          // this.getCountNum()
          resolve()
        })
      })
    },
    upSubmit() {
      return new Promise((resolve, reject) => {
        const { selectedRowKeys } = this.$data
        if (!selectedRowKeys.length) {
          this.$data.batchUpLoading = false
          this.$message.warning(this.$t('onSale.upError'))
          return
        }

        this.setLoading('_u_loading_')
        let params = { productId: selectedRowKeys, unlist: false }
        Goods.OnTheShelves(params)
          .then(() => {
            this.$message.success(this.$t('common.handlerSuccess'))
            this.reLoadData()
            resolve()
          })
          .catch(() => {
            reject()
          })
          .finally(() => {
            this.setLoading('_u_loading_', false)
            this.onSelectChange([], [])
          })
      })
    },
    /**下架 */
    onDown({ source }) {
      const { id } = source
      this.onSelectChange([id], [source])
      // this.setLoading('_d_loading_')
      this.downSubmit().finally(() => {
        // this.setLoading('_d_loading_', false)
        // this.getCountNum()
      })
    },
    /**批量下架 */
    onBatchDown() {
      this.$data.batchDownLoading = true
      this.downSubmit().finally(() => {
        this.$data.batchDownLoading = false
        // this.getCountNum()
      })
    },
    downSubmit() {
      return new Promise((resolve, reject) => {
        const { selectedRowKeys } = this.$data
        if (!selectedRowKeys.length) {
          this.$message.warning(this.$t('onSale.downError'))
          reject()
          return
        }
        this.$confirm({
          title: this.$t('common.warn'),
          content: this.$t('onSale.dowmConfirm'),
          onOk: () => {
            let params = { productId: selectedRowKeys, unlist: true }
            Goods.OnTheShelves(params)
              .then(() => {
                this.$message.success(this.$t('common.handlerSuccess'))
                this.reLoadData()
              })
              .catch(() => {
                reject()
              })
              .finally(() => {
                this.onSelectChange([], [])
                resolve()
              })
          },
          onCancel: () => {
            resolve()
          }
        })
      })
    },
    /**置顶 */
    onPlacetop({ source }) {
      const { id } = source
      this.onSelectChange([id], [source])
      this.batchPlacetop()
    },
    /**批量置顶 */
    batchPlacetop() {
      const { selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.$message.warning(this.$t('onSale.topWarning'))
        return
      }
      this.setLoading('_p_loading_')
      let params = { productId: selectedRowKeys }
      Goods.sureProductTop(params)
        .then(({ data }) => {
          this.$message.success(this.$t('common.handlerSuccess'))
          this.reLoadData()
          const warning = Modal.warning()
          const toUp = (c) => {
            this.$router.push({ path: '/goods/auto-up', query: { c } })
            warning.destroy()
          }
          if (data) {
            warning.update({
              title: this.$t('common.message'),
              content: () => (
                <p>
                  {this.$t('onSale.upMessage11')}
                  <a on-click={() => toUp(1)} class="me-link">
                    {this.$t('onSale.upMessage12')}
                  </a>
                  {this.$t('onSale.upMessage13')}
                </p>
              )
            })
          } else {
            warning.update({
              title: this.$t('common.message'),
              content: () => (
                <p>
                  {this.$t('onSale.upMessage21')}
                  <a on-click={() => toUp(2)} class="me-link">
                    {this.$t('onSale.upMessage22')}
                  </a>
                  {this.$t('onSale.upMessage23')}
                </p>
              )
            })
          }
        })
        .finally(() => {
          this.setLoading('_p_loading_', false)
        })
    },
    /**批量定时置顶提交 */
    onDatePickerOk(date) {
      if (moment(date).isBefore(moment())) {
        this.$message.error(this.$t('onSale.dateChooseError'))
        return
      }
      const { selectedRowKeys } = this.$data
      const time = moment(date).format('YYYY-MM-DD HH:mm:ss')
      let params = { productId: selectedRowKeys, toppingDate: time }
      Goods.setPlaceTopTime(params).then(() => {
        this.$message.success(this.$t('common.handlerSuccess'))
        this.reLoadData()
      })
    },
    /**批量定时置顶开关 */
    onShowDatePicker(open) {
      const { selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.$message.error(this.$t('onSale.dateChooseTimedError'))
        return
      }
      this.$data.datePickerVisible = open
    },
    /**tab切换 */
    onTabsChange(key) {
      this.$set(this.$data.params, 'view', undefined)
      this.$set(this.$data.params, 'status', key)
      this.$nextTick(this.reLoadData)
    },
    /**已同步商品 */
    onViewChange({ target }) {
      const { checked } = target
      this.$set(this.$data.params, 'view', checked ? 0 : undefined)
      this.$nextTick(this.reLoadData)
    },
    /**同步在线商品 */
    asyncOnlineProduct() {
      this.onAsyncProduct()
    },
    /**已同步商品 */
    async batchEditNext() {
      this.$data.batchEditNextLoading = true
      const { data } = await Goods.getProductList()
      this.$data.batchEditNextLoading = false
      if (!data.records.length) {
        this.$message.error(this.$t('onSale.modelMsg4'))
        return
      }
      this.$data.onlineProductEditChooseStoreVisible = true
      this.$data.onlineProductEditVisible = false
    },
    /**同步商品选择店铺OK */
    onOnlineBatchEditChooseStoreOk() {
      const store = this.$refs['online-product-edit-choose-store'].submit(true)
      this.$data.currentStore = store[0]?.storeId
      this.currentObj = store[0]
      this.$data.onlineProductEditChooseStoreVisible = false
      this.$data.onlineProductEditTabsVisible = true
    },
    /**自动置顶 */
    onAutoTop() {
      this.$router.push('/goods/auto-up')
    },
    // 前往Shopee管理后台
    goShopee(source) {
      console.log(source.source.id)
      this.openPage(source.source.itemPortalUrl, '_blank')
    },
    /**
     * 批量删除
     */
    batchDelete() {
      this.$data.batchDeletePublishLoading = true
      const { selectedRowKeys, selectedRows } = this.$data
      if (!selectedRowKeys.length) {
        this.$message.warning(this.$t('productCatalog.deleteErrorMessage'))
        return
      }
      const params = []
      selectedRows.map((item) => {
        params.push({ itemId: item.itemId, shopId: item.shopId })
      })
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          // let params = { productId: selectedRowKesys, shopId: 1 }
          await Goods.deleteProductOnLine(params)
          this.$message.success(this.$t('common.handlerSuccess'))
          this.reLoadData()
          this.onSelectChange([], [])
        },
        onCancel: () => {
          this.onSelectChange([], [])
        }
      })
    },
    // 取消参加活动
    cancelDiscount(source) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: '确定取消当前产品参加活动吗？',
        onOk: async () => {
          const data = await Discount.deleteDiscountProduct({
            discountId: source.discountId,
            itemIds: [source.itemId]
          })
          if (data.code == 0) {
            this.$message.success(this.$t('common.handlerSuccess'))
            this.reLoadData()
          } else {
            this.$message.error(data.message)
          }
        }
      })
    },
    // 参加活动
    addDiscount(source) {
      sessionStorage.setItem('addDiscountPro', {})
      let { id } = source
      let stringPro = JSON.stringify(source)
      sessionStorage.setItem('addDiscountPro', stringPro)
      this.openPage(`/discount/list?&addDiscountByPid=${id}`)
    },
    resetAsyncStatus() {
      this.$data.storeAsyncStatus = false
      this.$data.storeAsyncModalVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled-text {
  color: #999999 !important;
}
</style>

<style lang="scss">
.me-custorm-date-picker {
  &.ant-calendar-picker {
    min-width: auto !important;
  }
}

.custom-tabs {
  background-color: #ffffff;
  border: 1px solid rgb(235, 235, 235);

  .ant-tabs-bar {
    margin-bottom: 0;
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
