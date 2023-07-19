<template>
  <div>
    <a-radio-group
      style="margin-bottom: 20px"
      v-model="selectType"
      @change="reLoadData"
    >
      <a-radio :value="1"> 按商品名称搜索 </a-radio>
      <a-radio :value="2"> 按本地SKU搜索 </a-radio>
    </a-radio-group>

    <p class="me-text-right me-mb-4">
      <a-space>
        <a-input v-model="keyword" class="me-ib" style="width: 200px" />
        <a-button type="primary" @click="reLoadData">搜索</a-button>
      </a-space>
    </p>

    <a-table
      rowKey="variationsId"
      :loading="tableLoading"
      :columns="columns"
      :data-source="dataSource"
      :pagination="getPagination"
      @change="changePage"
    >
      <span slot="actions" slot-scope="text, record">
        <a-button
          :disabled="disabledStatus(record)"
          type="link"
          @click="onPush(record)"
        >
          {{ disabledStatus(record) ? '已添加' : '添加' }}
        </a-button>
      </span>
    </a-table>

    <a-tag
      v-for="(item, index) in sku"
      closable
      @close="onClose($event, index)"
      :key="index"
      style="margin: 0 5px 5px 0"
    >
      {{ item.variationSku }}
    </a-tag>
  </div>
</template>

<script>
import Product from '@/api/product'
import tableMixins from '@/mixins/tableMixins'

export default {
  props: {
    sku: {
      type: Array,
      default: () => []
    }
  },
  model: {
    prop: 'sku',
    event: 'input'
  },
  mixins: [tableMixins],
  data() {
    return {
      selectType: 1,
      keyword: '',
      paginationData: {
        current: 1,
        pageSize: 10
      },
      columns: [
        {
          title: '商品中文名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '本地SKU',
          dataIndex: 'variationSku',
          key: 'variationSku'
        },
        {
          title: '操作',
          dataIndex: 'actions',
          key: 'actions',
          scopedSlots: { customRender: 'actions' }
        }
      ]
    }
  },
  computed: {
    disabledStatus() {
      const skuIds = this.$props.sku.map(({ variationsId }) => variationsId)
      return (localSku) => skuIds.includes(localSku.variationsId)
    }
  },
  methods: {
    async getTableData() {
      const { selectType, keyword, paginationData } = this.$data
      const _params_ = {
        ...paginationData,
        ...(selectType === 1 ? { name: keyword } : { sku: keyword })
      }
      const res = await Product.getProductStockSku(_params_)
      res.data.records = res.data.records.map((sku) => {
        if (sku.images && /^\[/.test(sku.images)) {
          sku.images = JSON.parse(sku.images)
        }
        return sku
      })
      return res
    },
    onPush(current) {
      const { sku } = this.$props
      const isExist = sku.find(({ variationsId }) => {
        return variationsId === current.variationsId
      })
      if (!isExist) {
        this.$emit('input', [...sku, current])
      }
    },
    onClose(event, index) {
      event.preventDefault()
      this.$delete(this.$props.sku, index)
    }
  }
}
</script>

<style lang="less" scoped></style>
