<template>
  <div>
    <div class="me-curr-batchnumber">
      <span> {{ $t('order.batchNum') }} ：CNF516564378519210311</span
      ><span> {{ $t('order.shop') }} ：Malacca.vn</span
      ><span> {{ $t('order.pickupDate') }} ：2021-03-11</span
      ><span> {{ $t('order.batchNumberStatus') }}：初始化</span>
    </div>

    <div class="me-curr-batchnumber">
      <a-button @click="btachUnbundling" class="me-fr" type="primary"
        >{{ $t('order.batchUnbinding') }}
      </a-button>
      <a-input-search
        class="w360"
        v-model="searchVal"
        :placeholder="$t('order.orderNum')+','+$t('order.deliveryNumber')"
        :enter-button="$t('common.search')"
        allowClear
        @search="onSearch"
      />
    </div>
    <a-table
      class="me-shelf-list"
      :columns="columns"
      :data-source="dataSource"
      rowKey="createTime"
      :pagination="getPagination"
      @change="changePage"
      :loading="tableLoading"
      :row-selection="rowSelection"
    >
      <template slot="handler" slot-scope="text, record">
        <a-button type="link" @click="unbundling(record)">
          {{ $t('order.untie') }}
        </a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
/**
 * 货架管理
 */
import Storage from '@/api/storage'
import tableMixins from '@/mixins/tableMixins'
export default {
  mixins: [tableMixins],
  components: {
    // ShelfAddOrEdit
  },
  props: {
    currentStorage: Object
  },
  data() {
    return {
      selectedRowKeys: [],
      selectedRows: [],
      columns: [
        { title: this.$t('order.orderNum'), dataIndex: 'shelvesNo' },
        {
          title: this.$t('order.deliveryNumber'),
          dataIndex: 'shelvesName',
          scopedSlots: { customRender: 'shelvesName' }
        },
        { title: this.$t('common.status'), dataIndex: 'shelvesPrefix' },
        {
          title: this.$t('order.submitTime'),
          dataIndex: 'shelfLayers',
          scopedSlots: { customRender: 'shelfLayers' }
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          scopedSlots: { customRender: 'handler' }
        }
      ]
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.$data.selectedRows = selectedRows
          this.$data.selectedRowKeys = selectedRowKeys
        }
      }
    }
  },
  methods: {
    //获取仓库货架数据
    getTableData() {
      return Storage.getStorageShelves({
        ...this.$data.paginationData,
        storageId: 2 || this.$props.currentStorage.storageId
      })
    },

    //解绑
    unbundling(row) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: '确定要解绑吗？',
        onOk: async () => {
          let res = await Storage.delStorageShelves({
            storageShelvesId: row.storageShelvesId
          })
          if (res.code === 0) {
            this.$Message({
              type: 'success',
              content: this.$t('common.handlerSuccess')
            })

            this.loadData('delete')
          } else {
            this.$Message({ type: 'error', content: `${res.message}` })
          }
        }
      })
    },
    //批量解绑
    btachUnbundling(row) {
      if (!this.$data.selectedRowKeys.length) {
        this.$message.error(this.$t('order.selectOneOrder'))

        return
      }
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('order.areYouUntie'),
        onOk: async () => {
          let res = await Storage.delStorageShelves({
            storageShelvesId: row.storageShelvesId
          })
          if (res.code === 0) {
            this.$Message({
              type: 'success',
              content: this.$t('common.handlerSuccess')
            })

            this.loadData('delete')
          } else {
            this.$Message({ type: 'error', content: `${res.message}` })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.me-curr-batchnumber {
  overflow: hidden;
  padding-bottom: 10px;
  span {
    display: inline-block;
    padding: 7px 15px 0 0;
  }
}
.w360 {
  width: 360px;
}
</style>
