<template>
  <div>
    <!-- <a-range-picker
      style="width: 100%; margin-bottom: 10px"
      @change="onRangePickerChange"
    /> -->
    <a-table
      rowKey="storeId"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      :columns="columns"
      :data-source="storeList"
      :pagination="{
        total: total,
        defaultPageSize: params.size,
        showTotal: (total) => {
          return $t('order.total') + total + $t('order.data')
        }
      }"
    >
      <template slot="storeName" slot-scope="text, record">
        {{ record.storeName
        }}<span v-if="record.storeAlias">({{ record.storeAlias }})</span>
      </template>
    </a-table>
  </div>
</template>

<script>
import moment from 'moment'
import Order from '@/api/order'
import bus from '@/bus'
import { mapState } from 'vuex'

export default {
  props: {
    syncNow: {
      type: Boolean
    }
  },
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
        size: 10,
        current: 1
      },
      total: 0,
      sTime: '',
      eTime: ''
    }
  },
  created() {
    this.$data.sTime = moment(
      new Date(new Date().getTime() - 29 * 24 * 3600 * 1000)
    ).format('YYYY-MM-DD')
    this.$data.eTime = moment(new Date()).format('YYYY-MM-DD')
  },
  mounted() {
    this.getStoreList()
  },
  computed: {
    ...mapState({
      authStoreList: (state) => state.auth.storeList // 已授权的店铺信息
    })
    // rowSelection : function() {
    //   return {
    //     selectedRowKeys:this.$data.selectedRowKeys,
    //     selectedRows:this.$data.selectedRows
    //     // onChange: (selectedRowKeys, selectedRows) => {
    //     //   this.$data.selectedRows = selectedRows
    //     //   this.$data.selectedRowKeys = selectedRowKeys
    //     // }
    //   }
    // }
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.$data.selectedRowKeys = selectedRowKeys
      this.$data.selectedRows = selectedRows
    },
    getStoreList() {
      this.$data.total = this.authStoreList.length
      this.storeList = this.authStoreList
    },
    submitTips() {
      const { selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.$message.error(this.$t('order.oneShop'))
        this.$emit('changeLoad', false)
        return true
      }
      return false
    },
    submit(flag, time) {
      const { selectedRowKeys } = this.$data

      if (this.submitTips()) return

      let params = {
        storeIds: selectedRowKeys,
        updateTimeFrom: flag ? time[0] : this.$data.sTime,
        updateTimeTo: flag ? time[1] : this.$data.eTime,
        synType: this.syncNow ? 1 : 0
      }
      Order.syncOrderAll(params).then((res) => {
        if (res.code == 0) {
          this.$message.success(this.$t('order.syncSucceeded'))

          this.$emit('submit')
          bus.$emit('on-async-store-choose', selectedRowKeys)
          bus.$emit('on-async-store-chooseB', selectedRowKeys)
        }
      })
    },
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
