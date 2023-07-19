<template>
  <div>
    <a-modal
      :title="$t('onSale.chooseStore')"
      destroyOnClose
      width="800px"
      :visible="storeVisible"
      @cancel="
        $emit('cancelSync')
        storeVisible = false
      "
      :maskClosable="false"
    >
      <template slot="footer">
        <a-button
          v-if="selectSyncTime"
          type="primary"
          @click="selectSyncTime = false"
        >
          上一步
        </a-button>
        <a-button
          v-else
          @click="
            $emit('cancelSync')
            storeVisible = false
          "
        >
          {{ $t('common.cancel') }}
        </a-button>
        <a-button
          v-if="diyTime && !selectSyncTime"
          type="primary"
          @click="onAsyncNext"
        >
          下一步
        </a-button>
        <a-button
          v-else
          type="primary"
          @click="submitStore"
          :loading="syncLoading"
        >
          {{ $t('common.ok') }}
          <!-- :loading="asyncOrderConfirmLoading" -->
        </a-button>
      </template>
      <div v-show="selectSyncTime">
        <h2>温馨提示：</h2>
        <p class="me-mb-3">同步数据较多时，需要等待时间较长，请耐心等待</p>
        选择时间:<a-range-picker
          :disabled-date="disabledDate"
          class="me-ml-1"
          @change="onRangePickerChange"
        />
      </div>
      <div v-show="!selectSyncTime" class="me-mb-2">
        <span class="me-select-text">
          {{ $t('common.selected') }}
          <span class="me-f-red"> {{ selectedRowKeys.length }}</span>
          {{ $t('common.dataRow') }}
        </span>
      </div>
      <!-- {{ selectedRows }} -->
      <a-table
        v-show="!selectSyncTime"
        rowKey="storeId"
        :loading="tableLoading"
        :columns="columns"
        :data-source="dataSource"
        :row-selection="{ ...rowSelection, type: rowSelectionType }"
        :pagination="getPagination"
        @change="changePage"
        :scroll="{ y: 500 }"
      >
        <div
          slot="filterDropdown"
          slot-scope="{
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            column
          }"
          style="padding: 8px"
        >
          <a-input
            v-ant-ref="(c) => (searchInput = c)"
            :placeholder="$t('common.searchit') + column.title"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="
              (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
            "
            @pressEnter="() => handleSearch(selectedKeys, confirm)"
          />
          <a-button
            type="primary"
            icon="search"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="() => handleSearch(selectedKeys, confirm)"
          >
            {{ $t('common.search') }}
          </a-button>
          <a-button
            size="small"
            style="width: 90px"
            @click="() => handleReset(clearFilters)"
          >
            {{ $t('common.reset') }}
          </a-button>
        </div>
        <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="search"
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <template slot="storeType" slot-scope="text, record">
          {{
            record.storeType == 1
              ? $t('store.localStore')
              : $t('store.crossStore')
          }}
        </template>
        <template slot="authorizedStatus" slot-scope="text, record">
          {{
            record.authorizedStatus == 1
              ? $t('store.authed')
              : $t('store.noAuth')
          }}
        </template>
      </a-table>
    </a-modal>
    <a-modal
      title="同步进度"
      width="900px"
      :visible="asyncProgressVisible"
      :footer="false"
      @cancel="
        $emit('cancelSync')
        asyncProgressVisible = false
        selectedRowKeys = []
      "
    >
      <SyncProgress
        :type="1"
        :storeIds="selectedRowKeys"
        :storeItems="selectedRows"
        :paltform="paltform"
        :modules="modules"
        @ok="syncComplete"
        ref="syncProgress"
        @resetAsyncStatus="resetAsyncStatus"
      />
    </a-modal>
  </div>
</template>

<script>
import Store from '@/api/store'
import tableMixins from '@/mixins/tableMixins'
import SyncProgress from './SyncProgress'
import moment from 'moment'
export default {
  props: {
    rowSelectionType: {
      //单选or多选
      type: String,
      default: 'checkbox'
    },
    // selectSyncTime: {
    //   type: Boolean,
    //   default: false
    // },
    diyTime: {
      type: Boolean,
      default: false
    },
    paltform: {
      type: String,
      default: 'Shopee' //选中平台
    },
    modules: {
      type: String,
      default: 'goods' //模块
    }
  },
  components: {
    SyncProgress
  },
  computed: {
    //分页数据
    // getPagination() {
    //   const { size, current, total } = this.$data.paginationData
    //   return {
    //     pageSize: Number(size),
    //     current,
    //     total,
    //     showTotal: (total) => this.$t(`common.pageTotalText`, { total })
    //   }
    // }
  },
  mixins: [tableMixins],
  data() {
    return {
      config: {
        Shopee: {
          //获取店铺列表/store/info/page
          getStoreListApi: '/store/store/info/page'
        },
        Lazada: {
          getStoreListApi: '/store/lazada/info/page'
        }
      },
      columns: [
        {
          title: this.$t('store.merchantName'),
          dataIndex: 'merchantName',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'merchantName'
          },
          onFilter: (value, record) =>
            record.merchantName
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          sorter: (a, b) => a.merchantName.length - b.merchantName.length,
          width: '22%'
        },
        {
          title: this.$t('store.storeName'),
          dataIndex: 'storeName',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'storeName'
          },
          onFilter: (value, record) =>
            record.storeName
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          sorter: (a, b) => a.storeName.length - b.storeName.length,
          width: '22%'
        },
        {
          title: this.$t('store.storeAlias'),
          dataIndex: 'storeAlias',
          width: '20%',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'storeAlias'
          },
          sorter: (a, b) => a.storeAlias.length - b.storeAlias.length,
          onFilter: (value, record) =>
            record.storeAlias
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
        },
        {
          title: this.$t('store.country'),
          dataIndex: 'countryCode',
          width: '15%',
          scopedSlots: { customRender: 'countryCode' },
          sorter: (a, b) =>
            a.countryCode.toLowerCase() > b.countryCode.toLowerCase(),
          sortDirections: ['descend']
        },
        {
          title: this.$t('store.storeType'),
          dataIndex: 'storeType',
          width: '15%',
          scopedSlots: { customRender: 'storeType' },
          filters: [
            {
              text: this.$t('store.localStore'),
              value: 1
            },
            {
              text: this.$t('store.crossStore'),
              value: 2
            }
          ],
          onFilter: (value, record) => record.storeType === value
        }
      ],

      storeName: null,
      storeVisible: true,
      asyncProgressVisible: false,
      selectSyncTime: false,
      syncTimeVal: [],
      syncLoading: false
    }
  },
  mounted() {},
  methods: {
    //禁止选中日期
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },
    //自定义日期选择
    onRangePickerChange(date, dateString) {
      this.$data.syncTimeVal = dateString
      console.log(date, dateString)
    },
    //获取店铺列表
    getTableData() {
      let { config } = this.$data
      let params = Object.assign(this.paginationData, {
        storeAlias: this.storeAlias,
        platform: this.paltform == 'Shopee' ? 1 : 2
      })

      return Store.getStoreListM(config[this.paltform].getStoreListApi, params)
    },
    // getTableData() {
    //   const { storeName } = this.$data
    //   const { size, current } = this.$data.paginationData
    //   return Store.getStoreList({ size, current, storeName })
    // },
    getTableDataAfter() {
      this.$data.dataSource = this.$data.dataSource.map((item) => {
        // 为了支持搜索和排序
        item.storeAlias ??= ''
        item.merchantName ??= ''
        return item
      })
    },
    //提交校验提示
    submitTips() {
      const { selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.$message.error(this.$t('order.oneShop'))
        return true
      }
      return false
    },
    //提交选中店铺
    submitStore() {
      const {
        selectedRowKeys,
        selectedRows,
        selectSyncTime,
        syncTimeVal
      } = this.$data
      if (this.submitTips()) return
      if (selectSyncTime) {
        if (!syncTimeVal[0]) {
          this.$message.warning('请选择时间')
          return
        }
      }
      this.$data.syncLoading = true
      this.$emit('handleStore', selectedRowKeys, selectedRows, {
        flag: selectSyncTime,
        time: syncTimeVal
      })
    },
    handleSearch(selectedKeys, confirm) {
      confirm()
      this.searchText = selectedKeys[0]
    },

    handleReset(clearFilters) {
      clearFilters()
      this.searchText = ''
    },

    // //搜索店铺
    // onSearch(value) {
    //   this.$data.storeName = value
    //   this.reLoadData()
    // },
    //开始同步
    startSync() {
      this.$data.asyncProgressVisible = true
      this.$nextTick(() => {
        this.$refs.syncProgress.async()
      })
    },
    //同步完成
    syncComplete() {
      this.$emit('syncComplete')
    },
    //同步订单下一步
    onAsyncNext() {
      if (this.submitTips()) return
      this.$data.selectSyncTime = true
    },
    resetAsyncStatus() {
      // this.$data.storeAsyncStatus = false
      this.$emit('cancelSync')
      this.$data.storeVisible = false
      this.$data.asyncProgressVisible = false
    }
  }
}
</script>
