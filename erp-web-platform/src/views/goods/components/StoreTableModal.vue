<template>
  <div class="store-list">
    <div class="me-mb-2">
      <span class="me-select-text">
        {{ $t('common.selected') }}
        <span class="me-f-red"> {{ selectedRowKeys.length }}</span>
        {{ $t('common.dataRow') }}
        <span v-if="isBasicStore" class="me-ml-2 me-f-red">
          （全球店铺目前不支持自动认领，自动发布）
        </span>
      </span>
    </div>
    <a-table
      rowKey="storeId"
      :columns="columns"
      :data-source="storeList"
      :row-selection="rowSelection"
      :pagination="pagination"
      :scroll="{ y: 500 }"
      @change="handleTableChange"
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
          style="width: 188px; margin-bottom: 8px; display: block;"
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
          record.authorizedStatus == 1 ? $t('store.authed') : $t('store.noAuth')
        }}
      </template>
    </a-table>
  </div>
</template>

<script>
import Order from '@/api/order'
import moment from 'moment'
import bus from '@/bus'
import { mapState } from 'vuex'

export default {
  props: {
    syncNow: {
      type: Boolean
    },
    selectedKeys: {
      type: Array,
      defalut: []
    },
    isBasicStore: {
      type: Boolean,
      defalut: false
    },
    list: {
      type: Array,
      defalut: null
    } // 从父级传数据过来展示
  },
  computed: {
    ...mapState({
      authStoreList: (state) => state.auth.storeList // 已授权的店铺信息
    }),
    rowSelection() {
      return {
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({
          props: {
            disabled: this.isBasicStore ? record.merchantId !== 0 : false, // Column configuration not to be checked
            name: record.name
          }
        }),
        selectedRowKeys: this.selectedRowKeys
      }
    }
  },
  data() {
    return {
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
          width: '25%'
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
          width: '25%'
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
        // {
        //   title: this.$t('store.authStatus'),
        //   dataIndex: 'authorizedStatus',
        //   width: '15%',
        //   scopedSlots: { customRender: 'authorizedStatus' },
        //   filters: [
        //     {
        //       text: this.$t('store.authed'),
        //       value: 1
        //     },
        //     {
        //       text: this.$t('store.noAuth'),
        //       value: 0
        //     }
        //   ],
        //   onFilter: (value, record) => record.authorizedStatus === value
        // }
      ],
      storeList: [],
      selectedRowKeys: [],
      searchText: '',
      searchInput: null,
      pagination: {
        total: 0,
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
        showTotal: (total) => {
          return this.$t('order.total') + total + this.$t('order.data')
        }
      }
    }
  },
  mounted() {
    this.selectedRowKeys = this.selectedKeys ? [...this.selectedKeys] : []
    // 店铺数据是否从父级传过来
    if (!this.list) {
      this.getStoreAllStore()
    } else {
      this.storeList = [...this.list]
    }
    this.pagination.total = this.storeList.length
  },
  methods: {
    //获取所有可用店铺
    getStoreAllStore() {
      this.storeList = this.authStoreList.map((item) => {
        // 为了支持搜索和排序
        item.storeAlias ??= ''
        item.merchantName ??= ''
        return item
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
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    submit() {
      return this.selectedRowKeys
    },
    // 订单目录下--同步订单
    syncOrderSubmit() {
      if (!this.selectedRowKeys.length) {
        this.$message.error(this.$t('order.oneShop'))
        this.$emit('changeLoad', false)
        return
      }
      this.$data.asyncOrderConfirmLoading = true
      let sTime = moment(
        new Date(new Date().getTime() - 29 * 24 * 3600 * 1000)
      ).format('YYYY-MM-DD')
      let eTime = moment(new Date()).format('YYYY-MM-DD')
      let params = {
        storeIds: this.selectedRowKeys,
        updateTimeFrom: sTime,
        updateTimeTo: eTime,
        synType: this.syncNow ? 1 : 0
      }

      Order.syncOrderAll(params).then((res) => {
        if (res.code == 0) {
          this.$message.success(this.$t('order.syncSucceeded'))
          this.$emit('syncOrderSubmit')
          bus.$emit('on-async-store-choose', this.selectedRowKeys)
          bus.$emit('on-async-store-chooseB', this.selectedRowKeys)
        }
        this.$data.asyncOrderConfirmLoading = false
        this.$data.syncModalVisible = false
      })
    },
    handleTableChange(pagination, filters, sorter, { currentDataSource }) {
      this.pagination.total = currentDataSource.length
    }
  }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: inherit;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #f0f0f0;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
</style>
