<template>
  <div>
    <div class="modal-table-search">
      <div class="me-select-text">
        <div v-if="radioCheckedData.name">
          {{ $t('common.selected') }}
          <span class="me-f-red name-elipsis">
            {{ radioCheckedData.name }}</span
          >
        </div>
      </div>
      <div>
        <a-input
          class="me-w300 me-mr-2"
          v-model="searchValue"
          :placeholder="$t('goodsCollection.autoPublishSet36')"
          @pressEnter="searchClick"
        >
          <a-select
            slot="addonBefore"
            v-model="searchKey"
            :options="searchKeyOptions"
            style="width: 120px"
          ></a-select>
        </a-input>
        <a-button type="primary" @click="searchClick" size="small">{{
          $t('common.search')
        }}</a-button>
      </div>
    </div>
    <a-table
      rowKey="discountId"
      :columns="columns"
      :pagination="paginationData"
      @change="changePage"
      :data-source="list"
      :scroll="{ y: 450 }"
    >
      <div slot="select" slot-scope="text, record">
        <a-radio
          :checked="radioCheckedData.id === record.variationsId"
          name="discount"
          :value="record.variationsId"
          @change="radioChange($event)"
        ></a-radio>
      </div>
      <div slot="images" slot-scope="text, record">
        <a-popover :title="null" placement="right">
          <template slot="content">
            <img
              v-lazy="record.images[0]"
              style="width: 200px; height: 200px"
            />
          </template>
          <img
            v-lazy="record.images[0]"
            style="width: 40px; height: 40px; border-radius: 2px"
          />
        </a-popover>
      </div>
      <div slot="goodsName" slot-scope="text, record" class="name-elipsis">
        {{ record.name }}
      </div>
    </a-table>
  </div>
</template>

<script>
import Product from '@/api/product'
import { isEmpty } from '@/util'
export default {
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
          title: '',
          key: 'select',
          scopedSlots: { customRender: 'select' },
          width: 50
        },
        {
          title: '图片',
          dataIndex: 'images',
          scopedSlots: { customRender: 'images' },
          width: 80
        },
        {
          title: this.$t('storageSku.productCnName'),
          scopedSlots: { customRender: 'goodsName' },
          dataIndex: 'name'
        },
        {
          title: '本地SKU',
          dataIndex: 'variationSku'
        }
      ],
      list: [],
      paginationData: {
        pageSize: 5,
        current: 1,
        total: 0,
        pageSizeOptions: ['5', '10', '30', '50', '100'],
        showSizeChanger: true,
        showQuickJumper: true,
        defaultPageSize: 10,
        size: 'small',
        showTotal: (total) => this.$t(`common.pageTotalText`, { total })
      },
      radioCheckedData: {
        id: null,
        name: ''
      },
      searchKey: 1,
      searchValue: '',
      searchKeyOptions: [
        { label: '商品名称', value: 1 },
        { label: '本地SKU', value: 2 }
      ]
    }
  },
  mounted() {
    this.getStorageSkuList()
  },
  methods: {
    getStorageSkuList() {
      let params = {
        current: this.paginationData.current,
        size: this.paginationData.pageSize,
        name: this.searchKey === 1 ? this.searchValue : null,
        sku: this.searchKey === 2 ? this.searchValue : null
      }
      Product.getProductStockSku(params).then(({ data }) => {
        data.records.map((item) => {
          item.images = item.images ? JSON.parse(item.images) : []
        })
        this.list = data.records || []
        this.paginationData.total = data.total
      })
    },
    changePage(res) {
      this.paginationData.current = res.current
      this.paginationData.pageSize = res.pageSize
      this.getStorageSkuList()
    },
    searchClick() {
      this.paginationData.current = 1
      this.getStorageSkuList()
    },
    radioChange({ target }) {
      const id = target.value
      this.list.map((val) => {
        if (id === val.variationsId) {
          console.log(val)
          this.radioCheckedData = {
            id: val.variationsId,
            itemId: val.itemId,
            variationsId: val.variationsId,
            name: val.name,
            masterSku: val.itemSku,
            itemSku: val.itemSku,
            newVariationsSku: val.variationSku,
            variationSku: val.variationSku
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/mixins.scss';
.modal-table-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.name-elipsis {
  @include ellipsisMultiline(2);
  max-width: 220px;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
