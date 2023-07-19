<template>
  <div>
    <!-- {{ selectedRowKeys }}{{ selectedRows }} -->
    <a-select v-model="params.type" style="width:110px">
      <a-select-option value="tit">
        商品名称
      </a-select-option>
      <a-select-option value="sku">
        SKU编码
      </a-select-option>
    </a-select>
    <a-input-search
      placeholder="请输入商品名称"
      enter-button
      @search="onSearch"
      v-model="params.title"
      class="me-w300 me-mb-2"
      v-if="params.type === 'tit'"
      allowClear
    />
    <a-input-search
      placeholder="请输入商品SKU"
      enter-button
      @search="onSearch"
      v-model="params.itemSku"
      class="me-w300 me-mb-2"
      allowClear
      v-else
    />

    <a-table
      :loading="tableLoading"
      :columns="columns"
      :data-source="dataSource"
      :pagination="getPagination"
      :rowSelection="rowSelection"
      @change="changePage"
      rowKey="id"
    >
      <!-- <template slot="name" slot-scope="text, record">
        <div class="me-em2" :title="record.name">{{ record.name }}</div>
        <div class="me-fs12 me-status-skip">ID:{{ record.id }}</div>
      </template> -->
      <template slot="name" slot-scope="text, record, index">
        <div class="product-info">
          <a-popover :placement="index < 5 ? 'rightTop' : 'rightBottom'">
            <template slot="content">
              <img
                v-lazy="record.mainImage"
                style="width: 280px; height: 280px; border-radius: 2px"
              />
            </template>
            <img
              v-lazy="record.mainImage"
              style="width: 70px; height: 70px; border-radius: 2px"
            />
          </a-popover>

          <div class="info-text">
            <a class="name"> {{ record.name }}</a>
            <p>
              <span class="me-mr-5 me-status-primary">
                ID:{{ record.id }}
              </span>
            </p>
          </div>
        </div>
      </template>
      <template slot="product_price" slot-scope="text, record">
        <div>{{ record.currency }}:</div>
        {{ getPrice(record) }}
      </template>
      <template slot="price" slot-scope="text, record">
        <div>{{ record.currency }}:</div>
        {{ getPrice(record) }}
      </template>
      <template slot="discountPeriodSlot" slot-scope="text, record">
        <!-- <div v-if="record.variants && record.variants.length">有变体</div> -->
        <div v-if="record.discountId" class="me-status-skip">已经参加活动</div>
        <div v-else>-</div>
      </template>
    </a-table>
    已选择 {{ selectedRowKeys.length }} /{{ dataSource.length }}
  </div>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import Discount from '@/api/discount'
import Goods from '@/api/goods'
import { max, min, compact, cloneDeep } from 'lodash'

export default {
  mixins: [tableMixins],
  props: {
    storeId: {
      type: Number,
      default: 0
    },
    checkedProduct: {
      type: Array,
      default: () => []
    },
    tableType: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      columns: compact([
        {
          title: this.$t('discount.goods'),
          key: 'name',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: 270
        },
        this.$props.tableType === 'default'
          ? {
              title: '售价',
              key: 'product_price',
              dataIndex: 'product_price',
              scopedSlots: { customRender: 'product_price' },
              width: 120
            }
          : null,
        this.$props.tableType === 'default'
          ? {
              title: '库存',
              key: 'stock',
              dataIndex: 'stock',
              width: 100
            }
          : null,
        this.$props.tableType === 'default'
          ? {
              title: '促销状态',
              key: 'discountPeriodSlot',
              dataIndex: 'discountPeriodSlot',
              scopedSlots: { customRender: 'discountPeriodSlot' }
            }
          : null,
        this.$props.tableType === 'couponaddpro'
          ? {
              dataIndex: 'sales',
              key: 'sales',
              scopedSlots: { customRender: 'sales' },
              title: '销量',
              sorter: (a, b) => a.sales - b.sales
            }
          : null,
        this.$props.tableType === 'couponaddpro'
          ? {
              dataIndex: 'price',
              key: 'price',
              scopedSlots: { customRender: 'price' },
              title: '售价'
              // sorter: (a, b) => a.price - b.price
            }
          : null
        // this.$props.tableType === 'couponaddpro'
        //   ? {
        //       dataIndex: 'originalPrice',
        //       key: 'originalPrice',
        //       scopedSlots: { customRender: 'originalPrice' },
        //       title: '原价',
        //       sorter: (a, b) => a.originalPrice - b.originalPrice
        //     }
        //   : null
      ]),
      params: { type: 'tit', title: '', itemSku: '' },
      checkedProArray: []
    }
  },
  mounted() {
    this.$props.checkedProduct.map((item) => {
      this.$data.checkedProArray.push(item.itemId)
    })
  },
  computed: {
    /**
     * 获取售价
     */
    getPrice() {
      return (item) => {
        if (item.hasVariation && item.variants) {
          const variantsPrices = item.variants.map(({ price }) => price)
          const _min = min(variantsPrices)
          const _max = max(variantsPrices)
          if (_max === _min) return `${_max}(变体价格相同)`
          return `${_min} ~ ${_max}(变体价格区间)`
        } else {
          return `${item.price}(无变体)`
        }
      }
    },
    rowSelection() {
      return {
        getCheckboxProps: (record) => ({
          props: {
            // 条件，为true时全禁选
            // 编辑页dataSource已存在或者参加活动的商品不可选
            // 禁用规则：传入的dataSource已包含此产品，或者此产品已参加活动
            disabled:
              this.checkedProArray.includes(record.itemId) ||
              (record.discountId != null && record.discountId != 0)
          }
        }),
        selectedRowKeys: this.$data.selectedRowKeys,
        onChange: this.onSelectChange,
        // getCheckboxProps: this.getCheckboxProps,
        onSelect: this.selectedChange,
        columnWidth: 20
      }
    }
  },
  methods: {
    getTableData() {
      const { size, current } = this.$data.paginationData
      const { storeId } = this.$props
      let params = {}
      this.$data.params.type === 'tit'
        ? (params.title = this.$data.params.title)
        : (params.itemSku = this.$data.params.itemSku)
      return Goods.getProductList({
        size,
        current,
        status: 1,
        storeId: storeId,
        ...params
      })
    },
    onSearch() {
      this.reLoadData()
    },
    getCheckPro() {
      const { selectedRows } = this.$data
      console.log(selectedRows)
      if (selectedRows.length == 0) {
        this.errorAlert(this.$t('discount.inputChoseGoods'))
        return false
      }
      this.$emit('getCheckPro', selectedRows)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './table.scss';
.me-w300 {
  width: 300px;
}
@import '@/theme/mixins.scss';
.me-em2 {
  @include ellipsisMultiline(2);
}
</style>
