<template>
  <a-table
    rowKey="supplierId"
    :loading="tableLoading"
    :columns="columns"
    :data-source="dataSource"
    :pagination="getPagination"
    @change="changePage"
  >
    <span slot="handler" slot-scope="text, record">
      <a-button
        type="link"
        @click="$emit('push', record)"
        :disabled="suppliers.includes(record.supplierId)"
      >
        <template v-if="suppliers.includes(record.supplierId)">
          {{ $t('common.added') }}
        </template>
        <template v-else>
          {{ $t('common.add') }}
        </template>
      </a-button>
    </span>
  </a-table>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import Purchase from '@/api/purchase'
export default {
  mixins: [tableMixins],
  props: {
    suppliers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns: [
        {
          title: this.$t('purchase.supplier'),
          dataIndex: 'supplierName'
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          scopedSlots: { customRender: 'handler' },
          align: 'center'
        }
      ]
    }
  },
  methods: {
    getTableData() {
      const { size, current } = this.$data.paginationData
      return Purchase.getSupplierList({ size, current })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>