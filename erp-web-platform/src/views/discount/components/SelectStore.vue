<template>
  <div>
    <!-- <a-range-picker
      style="width: 100%; margin-bottom: 10px"
      @change="onRangePickerChange"
    /> -->
    <p class="me-mb-2">
      {{ $t('discount.syncType') }}:
      <a-checkbox-group v-model="groupType" @change="selectType">
        <a-checkbox value="ONGOING">
          {{ $t('discount.acting') }}
        </a-checkbox>
        <a-checkbox value="UPCOMING">
          {{ $t('discount.nextAct') }}
        </a-checkbox>
        <a-checkbox value="EXPIRED">
          {{ $t('discount.overdue') }}
        </a-checkbox>
      </a-checkbox-group>
    </p>
    <a-table
      rowKey="storeId"
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="storeList"
      :pagination="{
        total: total,
        defaultPageSize: params.size,
        showTotal: (total) => {
          return $t('order.total') + total + $t('order.data')
        }
      }"
      @change="onChange"
    >
      <template slot="storeName" slot-scope="text, record">
        {{ record.storeName
        }}<span v-if="record.storeAlias">({{ record.storeAlias }})</span>
      </template>
    </a-table>
  </div>
</template>

<script>
import Store from '@/api/store'
export default {
  data() {
    return {
      selectedRowKeys: [],
      selectedRows: [],
      storeList: [],
      pagination: {},
      columns: [
        {
          dataIndex: 'storeName',
          key: 'storeName',
          title: this.$t('order.shopName'),
          scopedSlots: { customRender: 'storeName' }
        }
      ],
      dateRange: [],
      params: {
        size: 20,
        current: 1,
        platform: 1
      },
      total: 0,
      groupType: []
    }
  },
  mounted() {
    this.getStoreList()
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.$data.selectedRows = selectedRows
          this.$data.selectedRowKeys = selectedRowKeys
        }
      }
    }
  },
  methods: {
    //选择类型
    selectType(val) {},
    //获取店铺列表
    getStoreList() {
      const { params } = this.$data
      Store.getStoreList(params).then(({ data }) => {
        this.$data.total = data.total
        this.storeList = data.records
      })
    },
    //切换分页
    onChange({ current }) {
      this.$set(this.$data.params, 'current', current)
      this.getStoreList()
    }
    // onRangePickerChange(date, dateString) {
    //   this.$data.dateRange = dateString
    // }
  }
}
</script>
