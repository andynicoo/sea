<template>
  <div class="me-max-h400">
    <!-- 揽货地址列表-->
    <a-table
      :columns="columns"
      :data-source="dataSource"
      rowKey="addressId"
      :loading="tableLoading"
      :showHeader="false"
      :row-selection="rowSelection"
      :pagination="false"
    >
      <template slot="fullAddress" slot-scope="text, record">
        {{ record.name }} {{ record.phone }}<br />
        <span class="me-address"
          >{{ record.fullAddress }}<br />
          {{ record.country }} {{ record.zipcode }}</span
        >
      </template>
      <template slot="handler" slot-scope="text, record">
        <a-button
          type="link"
          class="me-pa-1 me-error"
          @click="delAddress(record)"
        >
          {{ $t('common.delete') }}
        </a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import Order from '@/api/order'
export default {
  mixins: [tableMixins],
  props: {
    currentAddress: {
      type: Object
    }
  },
  data() {
    return {
      clearSelectedRows: false, //不清空表格选中
      columns: [
        //表头数据
        {
          title: this.$t('storage.sname'),
          dataIndex: 'fullAddress',
          key: 'fullAddress',
          scopedSlots: { customRender: 'fullAddress' }
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          scopedSlots: { customRender: 'handler' }
        }
      ]
    }
  },
  mounted() {},

  methods: {
    //选中地址
    selectedChange(record, selected, selectedRows, nativeEvent) {
      if (selected) {
        this.$data.selectedRowKeys = [record.addressId]
        this.$data.selectedRows = [record]
      } else {
        this.$data.selectedRowKeys = []
        this.$data.selectedRows = []
      }
      // console.log(record, selected, selectedRows, nativeEvent)
    },
    //获取地址列表
    getTableData() {
      return Order.listFirstMileAddress({
        ...this.$data.paginationData,
        size: '100'
      })
    },
    getTableDataAfter() {
      this.$data.selectedRowKeys = [this.$props.currentAddress.addressId]
      this.$data.selectedRows = this.$data.dataSource.filter(
        (item) => item.addressId == this.$props.currentAddress.addressId
      )
    },
    //删除地址
    delAddress(row) {
      if (row.addressId != JSON.parse(localStorage.fmAddress).addressId) {
        this.$confirm({
          title: this.$t('common.warn'),
          content: this.$t('common.deleteConfirm'),
          onOk: async () => {
            await Order.deleFirstMileAddress({
              addressId: row.addressId
            })
            this.$message.success(this.$t('common.handlerSuccess'))
            this.loadData('delete')
          }
        })
      } else {
        this.$message.success('不能删除选中地址')
      }
    },
    //确定新增地址
    addressOk() {
      return new Promise((resolve) => {
        if (this.$data.selectedRowKeys.length) {
          resolve(this.$data.selectedRows)
        } else {
          this.$message.warning('请选择地址')
          resolve(false)
        }
      })
    }
  },
  beforeDestroy() {}
}
</script>
<style lang="scss" scoped>
.me-address {
  font-size: 12px;
  color: #999;
}
.me-max-h400 {
  max-height: 500px;
  overflow-y: auto;
}
</style>
