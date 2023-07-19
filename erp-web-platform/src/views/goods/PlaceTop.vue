<template>
  <div class="me-pa-2">
    <div class="me-card">
      <SearchForm @search="onSearch"> </SearchForm>
    </div>

    <CommodityList
      :loading="tableLoading"
      :data-source="dataSource"
      :type="componentsType"
      :rowSelection="rowSelection"
      :pagination="getPagination"
      @change="changePage"
    >
      <div slot="actions" slot-scope="source">
        <a-space class="me-mr-2">
          <a-button class="me-pa-1" type="link" @click="onEdit(source)">
            {{$t('common.edit')}}
          </a-button>
          <a-button
            class="me-pa-1 me-error"
            type="link"
            @click="onDelete(source)"
          >
            {{$t('common.delete')}}
          </a-button>
        </a-space>
      </div>
    </CommodityList>
  </div>
</template>

<script>
import SearchForm from './components/SearchForm'
import CommodityList from './components/CommodityList'
import tableMixins from '@/mixins/tableMixins'
import productTableMixins from '@/mixins/productTableMixins'

import Goods from '@/api/goods'
export default {
  mixins: [tableMixins, productTableMixins],
  components: {
    CommodityList,
    SearchForm
  },
  data() {
    return {
      componentsType: 6
    }
  },
  methods: {
    getTableData() {
      const { size, current } = this.$data.paginationData
      const { params, componentsType } = this.$data
      return Goods.getProductList({
        ...params,
        size,
        current,
        type: componentsType
      })
    }
  }
}
</script>
