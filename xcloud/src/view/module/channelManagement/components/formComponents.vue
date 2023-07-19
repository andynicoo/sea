<template>
  <div>
    <div class="title">
      <slot name="title"></slot>
      <slot name="titleRight"></slot>
    </div>
    <Table border
          :loading="tableLoading"
          :columns="columns"
          @on-select="onSelect"
          @on-select-cancel="onSelectCancel"
          @on-select-all="onSelectAll"
          @on-selection-change="onSelectionChange"
          @on-sort-change="onSortChange"
          @on-filter-change="onFilterChange"
          @on-row-click="onRowClick"
          @on-row-dblclick="onRowDblclick"
          @on-expand="onExpand"
          :data="tableData">
    </Table>
    <div class="fooder">
      <slot name="footer"></slot>
      <Page @on-change="changePageHandler"
            @on-current-change="onCurrentChange"
            :current="pageInfo.page"
            :total="listTotal"
            :page-size="pageInfo.limit"
            show-total
            show-elevator
            v-if="isShowPage" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: []
    },
    columns: {
      type: Array,
      default: []
    },
    listTotal: {
      type: Number,
      default: 0
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    isShowPage: {
      type: Boolean,
      default: true
    },
    pageInfo: {
      type: Object,
      default: () => {
        return {
          limit: 10,
          page: 1
        }
      }
    }
  },
  data() {
    return {

    }
  },
  created() {
    // console.log('listTotal', this.listTotal)
  },
  methods: {
    changePageHandler(page) {
      this.pageInfo.page = page
      this.getList()
    },
    getList() {
      this.$emit('getList', this.pageInfo)
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow)
    },
    onSelect(selection, row) {
      this.$emit('on-select', selection, row)
    },
    onSelectCancel(selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    onSelectAll(selection) {
      this.$emit('on-select-all', selection)
    },
    onSelectionChange(selection) {
      this.$emit('on-selection-change', selection)
    },
    onSortChange(column, key, order) {
      this.$emit('on-sort-change', column, key, order)
    },
    onFilterChange(row) {
      this.$emit('on-filter-change', row)
    },
    onRowClick(row, index) {
      this.$emit('on-row-click', row, index)
    },
    onRowDblclick(row, index) {
      this.$emit('on-row-dblclick', row, index)
    },
    onExpand(row, status) {
      this.$emit('on-expand', row, status)
    }
  }
}
</script>

<style lang="less" scoped>
.fooder {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  &/deep/ .ivu-page {
    margin-top: 0px;
  }
}
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
}
/deep/ .isShowSupplierName{
  display: inline-block;
}
</style>