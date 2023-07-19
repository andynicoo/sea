<template>
  <div>
    <a-form-model :model="params" layout="inline" class="me-mb-4">
      <a-form-model-item>
        <a-radio-group v-model="params.type">
          <a-radio :value="1"> 按商品名称搜索 </a-radio>
          <a-radio :value="2"> 按本地SKU编码搜索 </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item>
        <a-input
          style="width: 300px"
          v-model="params.keyword"
          placeholder="商品名称"
          allowClear
        />
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="onLoadData(1)">搜索</a-button>
      </a-form-model-item>
    </a-form-model>
    <a-table
      :loading="tableLoading"
      :columns="columns"
      :data-source="sources"
      rowKey="localSku"
      :rowSelection="{ selectedRowKeys, onChange, type: 'radio' }"
      :pagination="paginationData"
      @change="changePage"
    >
      <span slot="images" slot-scope="text">
        <img :src="text" style="width: 60px; height: 60px" />
      </span>
    </a-table>
  </div>
</template>

<script>
import Product from '@/api/product'
export default {
  mounted() {
    this.onLoadData()
  },
  data() {
    return {
      params: { type: 1, keyword: '' },
      columns: [
        {
          dataIndex: 'images',
          key: 'images',
          title: '商品主图',
          scopedSlots: { customRender: 'images' }
        },
        {
          dataIndex: 'name',
          key: 'name',
          title: '本地SPU名称'
        },
        {
          dataIndex: 'itemSku',
          key: 'itemSku',
          title: '本地spu编码'
        },
        {
          dataIndex: 'localSku',
          key: 'localSku',
          title: '本地sku编码'
        }
      ],
      sources: [],
      selectedRowKeys: [],
      tableLoading: false,
      paginationData: {
        size: '10',
        current: 1,
        total: 0,
        pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
        showSizeChanger: true,
        showQuickJumper: true,
        defaultPageSize: 10
      }
    }
  },
  methods: {
    onLoadData(curr) {
      this.$data.tableLoading = true
      const memberId = this.$store.getters.getUserInfo.memberId
      if (curr) {
        this.$data.paginationData.current = 1
      }
      const { type, keyword } = this.$data.params
      const { size, current } = this.$data.paginationData
      const params = { memberId, size, current }
      if (keyword) {
        if (type === 1) {
          params.name = keyword
        } else if (type === 2) {
          params.localSku = keyword
        }
      }
      Product.getProductVariationsList(params)
        .then((res) => {
          this.$data.sources = res.data.records.map((data) => {
            try {
              const [images] = JSON.parse(data.images)
              data.images = images
            } catch (error) {
              console.log(error)
            }
            return data
          })
          this.$data.paginationData = {
            ...this.$data.paginationData,
            ...this.getPageFromResp(res.data)
          }
        })
        .finally(() => {
          this.$data.tableLoading = false
        })
    },
    onChange(selectedRowKeys, selectedRow) {
      this.$data.selectedRowKeys = selectedRowKeys
      this.$emit('change', selectedRowKeys, selectedRow)
    },
    /**
     * 分页改变
     */
    changePage({ pageSize, current }) {
      this.$data.paginationData = {
        ...this.$data.paginationData,
        size: String(pageSize),
        current
      }
      this.onLoadData()
    },
    // /**
    //  * 把接口的分页信息交给paginationData
    //  */
    getPageFromResp(source) {
      let { current, size, total } = source
      console.log(current, size, total)
      return {
        current,
        size: String(size),
        total
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
