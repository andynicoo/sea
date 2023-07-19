<template>
  <div class="me-pa-2">
    <div class="me-card clearfloat" v-if="statusOpts.length">
      <a-tabs
        :default-active-key="activeKey"
        :tab-position="mode"
        :style="{ height: '200px' }"
        @change="storageChange"
        :animated="false"
      >
        <a-tab-pane
          v-for="(n, index) in statusOpts || []"
          :key="index"
          :tab="n.storageName"
        ></a-tab-pane>
      </a-tabs>
      <a-row>
        <a-col :span="8" :offset="16">
          <a-input-search
            v-model="searchVal"
            :placeholder="$t('storage.shelfName')"
            :enter-button="$t('common.search')"
            allowClear
            @search="shelfSearch"
          />
        </a-col>
      </a-row>
    </div>
    <div class="me-card">
      <a-table
        class="me-shelf-list"
        :columns="columns"
        :data-source="dataSource"
        rowKey="createTime"
        :pagination="getPagination"
        @change="changePage"
        :loading="tableLoading"
      >
        <template slot="storageName" slot-scope="text, record">
          {{ record.storageName }}
        </template>
        <template slot="shelfLayers" slot-scope="text, record">
          {{ record.shelfLayers }}/{{ record.shelfColumns }}
        </template>
        <template slot="num" slot-scope="text, record">
          {{ record.num - record.stock }}/{{ record.num }}
        </template>
        <template slot="handler" slot-scope="text, record">
          <a-button type="link" @click="viewPositions(record)">
            {{ $t('storage.viewPosition') }}
          </a-button>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import Storage from '@/api/storage'
export default {
  mixins: [tableMixins],
  data() {
    return {
      mode: 'top',
      activeKey: 0,
      statusOpts: [],
      searchVal: '',
      columns: [
        {
          title: this.$t('storage.sname'),
          dataIndex: 'storageName',
          scopedSlots: { customRender: 'storageName' }
        },
        { title: this.$t('storage.shelfNumber'), dataIndex: 'shelvesNo' },
        { title: this.$t('storage.shelfName'), dataIndex: 'shelvesName' },
        { title: this.$t('storage.shelvesPrefix'), dataIndex: 'shelvesPrefix' },
        {
          title: this.$t('storage.layers') + '/' + this.$t('storage.columns'),
          dataIndex: 'shelfLayers',
          scopedSlots: { customRender: 'shelfLayers' }
        },
        {
          title: this.$t('storage.emptyP') + '/' + this.$t('storage.totalP'),
          dataIndex: 'num',
          scopedSlots: { customRender: 'num' }
        },
        { title: this.$t('storage.inventoryTotal'), dataIndex: 'stock' },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          fixed: 'right',
          scopedSlots: { customRender: 'handler' }
        }
      ]
    }
  },

  methods: {
    //货架名称搜索
    shelfSearch(val) {
      this.$set(this.$data.paginationData, 'shelvesName', val)
      this.reLoadData()
    },
    //切换仓库
    storageChange(val) {
      this.$data.activeKey = val
      this.$data.searchVal = ''
      this.reLoadData()
    },
    //获取仓库列表
    async getTableData() {
      if (!this.$data.statusOpts.length) {
        const { data } = await Storage.getStorage({ size: 10000, current: 1 })
        this.$data.statusOpts = data.records
      }

      if (!this.$data.statusOpts.length) throw new Error('没有仓库')

      return Storage.getStorageShelves({
        ...this.$data.paginationData,
        storageId: this.$data.statusOpts[this.$data.activeKey].storageId
      })
    },
    //查看仓位
    viewPositions(row) {
      this.$router.push({
        path: '/storage/storage-position',
        query: {
          storageId: row.storageId,
          storageShelvesId: row.storageShelvesId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.me-card {
  ::v-deep .ant-tabs {
    height: 55px !important;
  }
}
</style>
