<template>
  <div class="pa-2">
    <v-card>
      <v-card-text>
        <v-row>
          <v-col xl="2" md="3">
            <v-text-field label="关键字" v-model="name">
              <template v-slot:append-outer>
                <v-btn @click="onReload" small color="primary">搜索</v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mt-2">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="desserts"
          hide-default-footer
          disable-sort
          item-key="id"
          :items-per-page="paginationData.size"
        >
        </v-data-table>

        <Pagination
          :paginationData="paginationData"
          @change="changePage"
        ></Pagination>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
/**
 * 关联商品列表
 */
import tableMixins from '@/mixins/tableMixins'
import Supplier from '@/api/supplier'
export default {
  mixins: [tableMixins],
  data() {
    return {
      name: '',

      headers: [
        { text: '主图', value: 'mainImages' },
        { text: '本地SKU/原厂SKU', value: 'skuOldSku' },
        { text: '商品名称', value: 'productVariationsSkuName' },
        { text: '商品链接', value: 'url' },
        { text: '最低采购价', value: 'address' },
        { text: '上次采购价', value: 'lastPrice' },
        { text: '添加时间', value: 'createTime' },
        { text: '默认供应商', value: 'isMain' },
        { text: '操作', value: 'options' }
      ]
    }
  },
  methods: {
    getTableData() {
      return Supplier.getSupplierProductList({
        ...this.$data.paginationData,
        name: this.$data.name
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
