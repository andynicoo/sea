<template>
  <div class="me-pa-2">
    <div class="me-card">
      <a-tabs
        v-model="tabsActiveKey"
        @change="onTabsChange"
        type="card"
        class="me-mt-4"
      >
        <a-tab-pane key="0" :tab="$t('discount.all')" />
        <a-tab-pane key="ongoing" :tab="$t('discount.acting')" />
        <a-tab-pane key="upcoming" :tab="$t('discount.nextAct')" />
        <a-tab-pane key="expired" :tab="$t('discount.overdue')" />
        <a-button
          slot="tabBarExtraContent"
          type="link"
          class="me-fr"
          @click="syncFollowList()"
        >
          同步后台数据
          <a-icon type="reload" />
        </a-button>
      </a-tabs>
      <div class="me-setmeal">
        <TileFilter
          :colItem="colItem"
          :formModel="searchParams"
          @submit="handleSearch"
        />
        <a-space>
          <a-button
            class="me-handle-btn"
            type="primary"
            @click="(e) => handleSearch()"
            :loading="submitIng"
            >筛选</a-button
          >
          <a-button class="me-handle-btn" @click="openPage('/discount/loading')"
            >重置</a-button
          >
        </a-space>
      </div>
    </div>
    <div class="me-card">
      <a-space>
        <a-button
          class="me-handle-btn"
          type="primary"
          @click="openPage('/discount/edit-additional')"
          >新建活动</a-button
        >
      </a-space>
      <DiscountTable
        :loading="tableLoading"
        :data-source="dataSource"
        :tabstatus="tabsActiveKey"
        :pagination="getPagination"
        @change="changePage"
        tableType="additional"
      >
        <div slot="actions" slot-scope="source">
          <a-tag v-if="source.source.record.editable">可编辑</a-tag>
          <a-button
            class="me-pa-1"
            type="link"
            v-if="
              source.source.record.status === 'ongoing' ||
                source.source.record.status === 'upcoming'
            "
            @click="editDiscount(source.source.record)"
          >
            编辑活动
          </a-button>
          <a-button
            class="me-pa-1"
            type="link"
            v-if="source.source.record.status === 'expired'"
            @click="viewDetail(source.source.record)"
          >
            查看详情
          </a-button>
          <a-button
            class="me-pa-1 me-status-error"
            type="link"
            v-if="source.source.record.status === 'ongoing'"
            @click="endDiscount(source.source.record)"
          >
            终止活动 </a-button
          ><br />
          <a-button
            class="me-pa-1 me-status-error"
            type="link"
            @click="deleteDiscount(source.source.record)"
            v-if="
              source.source.record.status !== 'ongoing' &&
                source.source.record.status !== 'expired'
            "
          >
            删除
          </a-button>
        </div>
      </DiscountTable>
    </div>

    <!-- 同步在线商品选择店铺 -->
    <a-modal
      :title="$t('onSale.chooseStore')"
      destroyOnClose
      :visible="storeListModalVisible"
      :confirm-loading="confirmLoading"
      @ok="handleDispatchAction"
      @cancel="
        storeListModalVisible = false
        storeSelectedList = []
      "
    >
      <StoreListModal ref="store-list-modal" />
    </a-modal>
  </div>
</template>

<script>
import TileFilter from '@/components/tableFilter/Tile'
import dataBrandMixins from '@/mixins/dataBrandMxins'
import tableMixins from '@/mixins/tableMixins'
// import productTableMixins from '@/mixins/productTableMixins'
import { mapState } from 'vuex'
import Discount from '@/api/discount'
import DiscountTable from './components/DiscountTable'
import { cloneDeep } from 'lodash'
import StoreListModal from '../goods/components/StoreListModal'

export default {
  components: {
    TileFilter,
    DiscountTable,
    StoreListModal
  },
  mixins: [dataBrandMixins, tableMixins],
  computed: {
    ...mapState({
      storeListSize: (state) => state.auth.storeListSize
    }),
    colItem({ siteStoreList, storeList, platformList }) {
      return [
        {
          itemType: 'tile',
          label: '平台',
          key: 'platform',
          itemProp: {
            style: 'width:190px'
          },
          itemData: platformList
        },
        {
          itemType: 'tileCheck',
          label: '站点',
          key: 'site',
          itemProp: {
            style: 'width:190px'
          },
          itemData: siteStoreList
        },
        {
          itemType: 'tileCheck',
          label: '店铺',
          key: 'store',
          itemProp: {
            style: 'width:190px'
          },
          itemData: storeList
        }
        // {
        //   itemType: 'rengePicker',
        //   label: '创建时间',
        //   key: 'createDate',
        //   key2: 'createDateType',
        //   itemProp: {
        //     style: 'width:290px'
        //   }
        // }
      ]
    }
  },
  watch: {
    'searchParams.site': {
      handler() {
        this.siteChange()
      },
      deep: true
    }
  },
  mounted() {
    this.siteChange()
  },
  data() {
    return {
      storeList: [], // 店铺
      tabsActiveKey: '0',
      autoTimeFocus: 0,
      dataSource: [],
      confirmLoading: false,
      // 同步在线商品，已选的店铺
      selectedStore: [],
      storeListModalVisible: false,
      storeSelectedList: []
    }
  },
  methods: {
    onTabsChange(key) {
      // this.$router.push({ path: this.$route.path, query: { key } })
      this.reLoadData()
    },
    //搜索
    async handleSearch(val) {
      if (!val) {
        //确定查询
        this.submitIng = true
        await this.reLoadData()
        this.submitIng = false
      }
    },
    resetParams() {
      this.$router.go(0)
    },
    reloadPageData() {
      this.loadData()
    },
    getTableDataBefore() {
      this.$data.dataSource = []
    },
    getTableData() {
      let searchParams = this.$data.searchParams

      const { size, current } = this.$data.paginationData
      return Discount.getAddOnDealList({
        ...searchParams,
        size,
        current,
        ...{ status: this.$data.tabsActiveKey }
      })
    },
    syncFollowList() {
      // Discount.syncFollowList({})
      this.$data.storeListModalVisible = true
    },
    resetAsyncStatus() {
      this.$data.storeAsyncStatus = false
      this.$data.storeAsyncModalVisible = false
    },
    // 同步后台数据
    async handleDispatchAction() {
      const selected = this.$refs['store-list-modal'].submit()
      const selectedStore = this.$refs['store-list-modal'].getSesectedStore()
      this.$data.selectedStore = selectedStore
      if (!selected.length) return
      this.$data.storeSelectedList = selected

      let params = []
      this.$data.selectedStore.map((ele) => {
        params.push({
          shopId: ele.platformId,
          storeId: ele.storeId
        })
      })
      this.$data.confirmLoading = true
      let data = await Discount.syncAddOnDealList(params).catch(() => {
        this.$data.confirmLoading = false
      })
      this.$data.confirmLoading = false
      console.log(data)

      this.$data.storeListModalVisible = false
    },
    deleteDiscount({ id }) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: '确定删除吗?',
        onOk: async () => {
          await Discount.deleteAddOnDealDetail({ id })
          this.$message.success(this.$t('common.handlerSuccess'))
          this.reLoadData()
        }
      })
    },
    endDiscount({ id }) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: '确定终止吗?',
        onOk: async () => {
          await Discount.endAddOnDealDetail({ id })
          this.$message.success(this.$t('common.handlerSuccess'))
          this.reLoadData()
        }
      })
    },
    editDiscount({ id, status }) {
      this.openPage(
        `/discount/edit-additional?edit=edit&id=${id}&status=${status}`
      )
    },
    viewDetail({ id, status }) {
      this.openPage(
        `/discount/edit-additional?edit=view&id=${id}&status=${status}`
      )
    }
  }
}
</script>
<style lang="scss">
.me-setmeal {
  .me-page-search {
    background: #fff !important;
    padding-bottom: 0px;
  }
}
</style>
