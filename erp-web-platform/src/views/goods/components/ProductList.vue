<template>
  <a-table
    rowKey="id"
    :loading="tableLoading"
    :columns="columns"
    :data-source="dataSource"
    :pagination="getPagination"
    :row-selection="rowSelection"
    @change="changePage"
  >
    <span slot="nameSlot" slot-scope="text, record">
      <div style="display: flex; align-items: center">
        <img
          style="width: 60px; height: 60px"
          class="me-mr-2"
          v-lazy="record.mainImage"
        />
        <p>{{ record.name }}</p>
      </div>
    </span>
    <template #price="text,record">
      <div>{{ record.currency }}:</div>
      {{ getPrice(record) }}
    </template>
  </a-table>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import Goods from '@/api/goods'
import { getPrice } from './common'
export default {
  mixins: [tableMixins],
  props: {
    storeId: Number,
    sources: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns: [
        {
          title: this.$t('productList.name'),
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'nameSlot' }
        },
        {
          title: this.$t('productList.price'),
          dataIndex: 'price',
          key: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: this.$t('productList.itemSku'),
          dataIndex: 'itemSku',
          key: 'itemSku'
        }
      ],
      clearSelectedRows: false
    }
  },
  mounted() {
    const { sources } = this.$props
    const ids = sources.map(({ id }) => id)
    this.onSelectChange(ids, sources)
  },
  methods: {
    getTableData() {
      const { storeId } = this.$props
      const { size, current } = this.$data.paginationData
      return Goods.getProductList({
        size,
        current,
        status: 1,
        type: 1,
        storeId
      })
    },
    getRows() {
      return this.$data.selectedRows
    },
    getPrice
  }
}
</script>
