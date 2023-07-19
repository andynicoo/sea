<template>
  <div>
    <div class="modal-table-search">
      <div class="me-select-text">
        <div v-if="radioCheckedData.name">
          {{ $t('common.selected') }}
          <span class="me-f-red me-mr-2"> {{ radioCheckedData.name }}</span>
          <a-button type="primary" @click="resetClick" size="small">{{$t('common.reset')}}</a-button>
        </div>
      </div>
      <div>
        <a-input class="me-w300 me-mr-2" v-model="searchKey" :placeholder="$t('goodsCollection.autoPublishSet36')" @pressEnter="searchClick"/>
        <a-button type="primary" @click="searchClick" size="small">{{$t('common.search')}}</a-button>
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
        <a-radio :checked="radioCheckedData.id === record.discountId" name="discount" :value="record.discountId" @change="radioChange($event)"></a-radio>
      </div>
    </a-table>
  </div>
  
</template>

<script>
import { isEmpty } from '@/util'
import Goods from '@/api/goods'
export default {
  props: {
    storeItem: {
      type: Object,
      defalut: {}
    }
  },
  data() {
    return {
      columns: [
        { 
          title: '',
          key: 'select',
          scopedSlots: { customRender: 'select' },
          width: 50,
        },
        {
          title: this.$t('goodsCollection.autoPublishSet36'),
          dataIndex: 'discountName'
        },
        {
          title: this.$t('goodsCollection.autoPublishSet37'),
          dataIndex: 'status',
        },
        {
          title: this.$t('goodsCollection.autoPublishSet38'),
          dataIndex: 'startTime'
        },
        {
          title: this.$t('goodsCollection.autoPublishSet39'),
          dataIndex: 'endTime'
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
      searchKey: '',
    }
  },
  mounted() {
    if (!isEmpty(this.storeItem)) {
      this.radioCheckedData = {
        id: this.storeItem.discountId,
        name: this.storeItem.discountName
      }
      this.getDiscountParamList()
    }
  },
  methods: {
    // 获取店铺折扣活动列表
    getDiscountParamList() {
      let params = {
        storeId: this.storeItem.storeId,
        current: this.paginationData.current,
        size: this.paginationData.pageSize,
        name: this.searchKey,
        type: 1
      }
      Goods.getDiscountParamList(params).then( ({data}) => {
        this.list = data.records || []
        this.paginationData.total = data.total
      })
    },
    changePage(res) {
      this.paginationData.current = res.current
      this.paginationData.pageSize = res.pageSize
      this.getDiscountParamList()
    },
    searchClick() {
      this.paginationData.current = 1
      this.getDiscountParamList()
    },
    resetClick() {
      this.radioCheckedData = {
        id: null,
        name: ''
      }
    },
    radioChange({target}) {
      const id = target.value
      this.list.map((val) => {
        if (id === val.discountId) {
          this.radioCheckedData = {
            id: val.discountId,
            name: val.discountName
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-table-search{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
