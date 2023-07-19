<template>
  <div>
    <a-input-search
      class="me-mb-2"
      style="width: 300px"
      :placeholder="$t('onSale.searchplaceholder')"
      :enter-button="$t('common.search')"
      @search="onSearch"
    />
    <a-table
      rowKey="storeId"
      :loading="tableLoading"
      :columns="columns"
      :data-source="dataSource"
      :pagination="getPagination"
      :row-selection="{ ...rowSelection, type: rowSelectionType }"
      @change="changePage"
    >
      <template slot="storeName" slot-scope="text, record">
        {{ record.storeName }}
        <span v-if="record.storeAlias">({{ record.storeAlias }})</span>
      </template>
    </a-table>
  </div>
</template>

<script>
import Store from '@/api/store'
import tableMixins from '@/mixins/tableMixins'
export default {
  props: {
    rowSelectionType: {
      type: String,
      default: 'checkbox'
    },
    rowSelectionParent: {
      type: Array
    }
  },
  computed: {
    /**
     * 分页数据
     */
    getPagination() {
      const { size, current, total } = this.$data.paginationData
      return {
        pageSize: Number(size),
        current,
        total,
        showTotal: (total) => this.$t(`common.pageTotalText`, { total })
      }
    }
  },
  mixins: [tableMixins],
  data() {
    return {
      columns: [
        {
          dataIndex: 'storeName',
          key: 'storeName',
          title: this.$t('onSale.storeName'),
          scopedSlots: { customRender: 'storeName' }
        }
      ],
      storeName: null
    }
  },
  mounted() {},
  methods: {
    getTableData() {
      const { storeName } = this.$data
      const { pageSize, current } = this.$data.paginationData
      return Store.getStoreList({
        size: pageSize,
        current,
        storeName,
        platform: 1
      })
    },
    getTableDataAfter() {
      if (this.$props.rowSelectionParent) {
        //热门精选黄金时段设置
        this.$data.clearSelectedRows = false
        this.$data.selectedRowKeys.push(...this.$props.rowSelectionParent)
        this.$data.selectedRowKeys.forEach((item) => {
          let row = this.$data.dataSource.find((item2) => item2.storeId == item)
          this.$set(row, 'disabled', true)
          this.$data.selectedRows.push(row)
        })
      }
    },
    submit(rows) {
      const { selectedRowKeys, selectedRows } = this.$data
      if (!selectedRowKeys.length) {
        this.$message.error(this.$t('onSale.storeListModalSubmitError'))
        return
      }
      if (rows) {
        return selectedRows
      } else {
        return selectedRowKeys
      }
    },
    getSesectedStore() {
      const { selectedRows } = this.$data
      return selectedRows
    },
    onSearch(value) {
      this.$data.storeName = value
      this.reLoadData()
    }
  }
}
</script>
