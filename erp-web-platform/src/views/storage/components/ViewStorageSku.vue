<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      rowKey="variationsId"
      :pagination="getPagination"
      @change="changePage"
      :loading="tableLoading"
    >
      <template slot="images" slot-scope="text, record">
        <img
          v-lazy="record.images[0]"
          style="width: 50px; height: 50px; border-radius: 2px"
          class="me-mr-2"
        />
      </template>
      <template slot="status" slot-scope="text, record">
        {{
          record.status == 1
            ? $t('viewStorageSku.natural')
            : $t('viewStorageSku.stop')
        }}

        natural stop
      </template>
    </a-table>
  </div>
</template>

<script>
import Product from '@/api/product'
import tableMixins from '@/mixins/tableMixins'
export default {
  mixins: [tableMixins],
  props: {
    masterSku: Number
  },
  data() {
    return {
      columns: [
        {
          title: this.$t('viewStorageSku.images'),
          dataIndex: 'images',
          key: 'images',
          scopedSlots: { customRender: 'images' }
        },
        {
          title: this.$t('viewStorageSku.variationSku'),
          dataIndex: 'variationSku',
          key: 'variationSku'
        },
        {
          title: this.$t('viewStorageSku.name'),
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: this.$t('viewStorageSku.status'),
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        }
      ]
    }
  },

  mounted() {},
  methods: {
    //获取仓库列表
    async getTableData() {
      const res = await Product.getProductStockSku({
        ...this.$data.paginationData,
        itemId: this.$props.masterSku
      })
      res.data.records = res.data.records.map((element) => {
        if (element.images) element.images = JSON.parse(element.images)
        else element.images = []
        return element
      })
      return res
    }
  }
}
</script>

<style lang="scss" scoped></style>
