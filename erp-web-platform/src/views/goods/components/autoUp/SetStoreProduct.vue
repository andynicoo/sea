<template>
  <div>
    <a-form-model :model="params" layout="inline">
      <a-form-model-item label="商品类目">
        <a-cascader
          :options="categoryOptions"
          :load-data="loadCategoryData"
          @change="onCategoryChange"
          placeholder="请选择分类"
          :fieldNames="{
            label: '_name_',
            value: 'categoryId',
            children: 'children'
          }"
        />
      </a-form-model-item>
      <a-form-model-item label="商品标题">
        <a-input v-model="params.title" />
      </a-form-model-item>
      <a-form-model-item label="商品编码">
        <a-input v-model="params.itemSku" />
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="initData">搜索</a-button>
      </a-form-model-item>
    </a-form-model>

    <!-- {{ selected }}-- {{ chosenRowKeys }}--{{ selectedRows.length }} -->
    <a-tabs v-model="activeKey" :animated="false">
      <a-tab-pane :key="1" :tab="$t('autoUp.productRangeBtn2')">
        <a-table
          rowKey="id"
          :columns="columns"
          :data-source="products"
          :row-selection="{
            selectedRowKeys: selected.map(String),
            onChange: onSelectProductChange,
            getCheckboxProps: onGetCheckboxProps
          }"
          :pagination="getPagination"
          @change="onPageChange"
          :loading="loading"
        >
          <span
            slot="_product_info_"
            slot-scope="text, record"
            class="me-product-info"
          >
            <img
              v-lazy="record.mainImage"
              style="width: 60px; height: 60px; border-radius: 2px"
            />
            <div class="info">
              <a-tooltip>
                <template slot="title">{{ record.name }}</template>
                <p class="name">{{ record.name }}</p>
              </a-tooltip>
              <p>{{ $t('autoUp.productId') }}：{{ record.id }}</p>
              <p>{{ $t('autoUp.itemSku') }}：{{ record.itemSku }}</p>
            </div>
          </span>
        </a-table>
      </a-tab-pane>

      <!-- 已选择 -->
      <a-tab-pane
        :key="2"
        :tab="$t('autoUp.chooses', { num: selected.length })"
      >
        <a-table
          :pagination="false"
          rowKey="id"
          :columns="columns"
          :data-source="selectedRows"
          :row-selection="{
            selectedRowKeys: chosenRowKeys,
            onChange: chosenRowChange
          }"
          :loading="loading"
        >
          <span
            slot="_product_info_"
            slot-scope="text, record"
            class="me-product-info"
          >
            <img
              v-lazy="record.mainImage"
              style="width: 60px; height: 60px; border-radius: 2px"
            />
            <div class="info">
              <a-tooltip>
                <template slot="title">{{ record.name }}</template>
                <p>{{ record.name }}</p>
              </a-tooltip>
              <p>{{ $t('autoUp.productId') }}：{{ record.id }}</p>
              <p>{{ $t('autoUp.itemSku') }}：{{ record.itemSku }}</p>
            </div>
          </span>
        </a-table>
      </a-tab-pane>
    </a-tabs>

    <p
      class="me-text-right"
      style="border-top: 1px solid #e8e8e8; padding-top: 20px"
    >
      <a-space>
        <template v-if="activeKey === 2">
          <a-button @click="unSelect" :disabled="!chosenRowKeys.length">
            {{ $t('common.unSelect') }}
          </a-button>
        </template>
        <a-button type="primary" @click="$emit('ok')">
          {{ $t('common.ok') }}
        </a-button>
      </a-space>
    </p>
  </div>
</template>

<script>
import goods from '@/api/goods'
import Product from '@/api/product'
import { createTree } from '@/util'
import { max, min, sum, cloneDeep } from 'lodash'
export default {
  props: {
    storeId: Number,
    disableds: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      params: {
        title: '',
        current: 1,
        size: 10,
        total: 0,
        pageSize: 10
      },
      activeKey: 1,
      products: [],
      chosenRowKeys: [],
      columns: [
        {
          title: this.$t('autoUp.productInfo'),
          key: '_product_info_',
          dataIndex: '_product_info_',
          scopedSlots: { customRender: '_product_info_' }
        },
        {
          title: this.$t('autoUp.price'),
          key: '_price_range_',
          dataIndex: '_price_range_'
        },
        {
          title: this.$t('autoUp.stock'),
          key: '_stock_',
          dataIndex: '_stock_'
        },
        {
          title: this.$t('autoUp.createTime'),
          key: 'createTime',
          dataIndex: 'createTime'
        }
      ],
      categoryOptions: [],
      loading: false
    }
  },
  computed: {
    /**
     * 分页数据
     */
    getPagination() {
      const { size, current, total } = this.$data.params
      return {
        pageSize: size,
        current,
        total,
        pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
        showSizeChanger: true,
        showTotal: (total) => this.$t(`common.pageTotalText`, { total })
      }
    },

    selectedRows() {
      const { products } = this.$data
      const selected = cloneDeep(this.$props.selected).map(Number)
      console.log(selected)
      console.log(products.length)
      return products.filter((pr) => selected.includes(Number(pr.id)))
    }
  },
  async mounted() {
    this.initData()
    const { data } = await Product.getCategorySelectV2({
      countryCode: this.$props.countryCode
    })
    console.log(createTree(data || [], 'categoryId'))
    this.$data.category = createTree(data || [], 'categoryId')
  },
  methods: {
    initData() {
      this.$set(this.$data.params, 'current', 1)
      this.getDataSource()
    },
    getDataSource() {
      const { params } = this.$data
      const { storeId } = this.$props
      this.$data.loading = true
      goods
        .getProductList({ ...params, size: 3000, status: 1, type: 1, storeId })
        .then(({ data }) => {
          this.$set(params, 'total', data.total)

          data.records = data.records.map((product) => {
            if (product.hasVariation) {
              const { variants } = product
              const prices = variants.map(({ price }) => price)
              const stocks = variants.map(({ stock }) => stock)
              const _min = min(prices)
              const _max = max(prices)
              const _sum = sum(stocks)
              product._stock_ = _sum
              if (_min === _max) {
                product._price_range_ = `${product.currency} ${_min}`
              } else {
                product._price_range_ = `${product.currency} ${_min}~${_max}`
              }
            } else {
              product._stock_ = product.stock
              product._price_range_ = `${product.currency} ${product.price}`
            }

            return product
          })
          this.$data.products = data.records

          this.$data.loading = false
        })
    },
    /**行选择 */
    onSelectProductChange(selectedRowKeys) {
      if (this.$props.multiple) {
        if (selectedRowKeys.length > 5) {
          this.$message.error('最多选择5个产品')
          return
        }
      }
      this.$emit('change', selectedRowKeys)
    },
    /**已选择行选择 */
    chosenRowChange(chosenRowChange) {
      this.$data.chosenRowKeys = chosenRowChange
    },
    /**取消选择 */
    unSelect() {
      const chosenRowKeys = cloneDeep(this.$data.chosenRowKeys).map(Number)
      const selected = cloneDeep(this.$props.selected).map(Number)
      const _chosenRowKeys = selected.filter((id) => {
        if (!chosenRowKeys.includes(id)) return true
      })
      this.$emit('change', _chosenRowKeys)
      this.$data.chosenRowKeys = []
    },
    onPageChange({ current, pageSize }) {
      this.$set(this.$data.params, 'current', current)
      this.$set(this.$data.params, 'size', pageSize)
    },
    /**行选择属性 */
    onGetCheckboxProps({ id }) {
      const { disableds } = this.$props
      return {
        props: {
          disabled: disableds.includes(Number(id))
        }
      }
    },
    // loadCategoryData(selectedOptions) {
    //   const targetOption = selectedOptions[selectedOptions.length - 1]
    //   targetOption.loading = true
    //   goods
    //     .getShopeeCategoryList({
    //       storeId: this.$props.storeId,
    //       parentId: targetOption.categoryId
    //     })
    //     .then(({ data }) => {
    //       data = data.map((ele) => {
    //         ele._name_ = `${ele.enName}--${ele.cnName}`
    //         ele.isLeaf = !ele.hasChildren
    //         return ele
    //       })
    //       targetOption.loading = false
    //       targetOption.children = data
    //       this.$data.categoryOptions = [...this.$data.categoryOptions]
    //     })
    // },
    onCategoryChange(value) {
      const { params } = this.$data
      const categoryId = value[value.length - 1]
      this.$set(params, 'categoryId', categoryId)
    }
  }
}
</script>

<style lang="scss" scoped>
.me-product-info {
  display: grid;
  grid-template-columns: 60px 1fr;

  .info {
    margin-left: 10px;

    p {
      max-width: 600px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
}
</style>
