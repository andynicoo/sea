<template>
  <div class="me-pa-2">
    <div class="me-card clearfloat">
      <a-tabs
        :activeKey="model"
        :tab-position="mode"
        :style="{ height: '200px' }"
        @change="storageChange"
      >
        <a-tab-pane
          v-for="(n, index) in statusOpts || []"
          :key="index"
          :tab="n.storageName"
        ></a-tab-pane>
      </a-tabs>
      <a-row>
        <a-col :span="12" :offset="0">
          {{ $t('storage.inventoryQuery') }}：<a-select
            v-model="model2"
            style="width: 125px"
          >
            <a-select-option
              :value="item.value"
              v-for="item in selectItems"
              :key="item.value"
            >
              {{ item.text }}
            </a-select-option>
          </a-select>
          <a-input-search
            class="me-stock-num"
            v-model="stockNum"
            :placeholder="$t('storage.inventoryNum')"
            :enter-button="$t('common.ok')"
            allowClear
            :maxLength="10"
            @search="stockSearch"
          />
        </a-col>
        <a-col :span="8" :offset="4">
          <a-input-search
            v-model="searchVal"
            :placeholder="$t('storage.searchTxt')"
            :enter-button="$t('common.search')"
            allowClear
            :maxLength="100"
            @search="NOSearch"
          />
        </a-col>
      </a-row>
    </div>
    <!-- 库存列表 -->
    <div class="me-card">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        rowKey="storageId"
        :pagination="getPagination"
        @change="changePage"
        :loading="tableLoading"
      >
        <template slot="inventoryTotal" slot-scope="text, record">
          {{ record.inventoryTotal }}
          <a-button type="link" @click="inventoryDetails(record)">
            {{ $t('storage.inventoryDetails') }}
          </a-button>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
/**
 * 库存明细
 */
// import Pagination from '@/components/Pagination'
import tableMixins from '@/mixins/tableMixins'
import Storage from '@/api/storage'
import { POSITIVE_NUMBER } from '@/util/regex'
export default {
  // components: { Pagination },
  mixins: [tableMixins],
  data() {
    return {
      mode: 'top',
      model: 0,
      statusOpts: null,
      model2: 1,
      searchVal: '',
      stockNum: '',
      selectItems: [
        { text: this.$t('storage.stock') + '>', value: 1 },
        { text: this.$t('storage.stock') + '<', value: 2 },
        { text: this.$t('storage.stock') + '=', value: 3 }
      ],

      columns: [
        { title: this.$t('storage.mainImg'), dataIndex: 'images' },
        { title: this.$t('storage.stockSkuName'), dataIndex: 'cnName' },
        { title: this.$t('storage.sname'), dataIndex: 'storageName' },
        { title: this.$t('storage.shelfName'), dataIndex: 'shelvesName' },
        { title: this.$t('storage.positionNum'), dataIndex: 'shelvesNo' },
        { title: this.$t('storage.stock'), dataIndex: 'stock' },
        { title: this.$t('storage.onQuantity'), dataIndex: 'isNumber' },
        { title: this.$t('storage.lastTime'), dataIndex: 'inDate' }
      ]
    }
  },
  methods: {
    async getTableDataBefore() {
      if (!this.$data.statusOpts) await this.getStorage()
      // if (!this.$data.statusOpts2) await this.getShelves()
    },
    async getTableData() {
      return Storage.getStockDetail({
        ...this.$data.paginationData,
        storageId: this.$data.statusOpts[this.$data.model].storageId,
        stock: this.$data.stockNum,
        type: this.$data.model2
      })
    },
    // 获取仓库
    async getStorage() {
      const storageRes = await Storage.getStorage({ current: 1, size: 10000 })
      this.$data.statusOpts = storageRes.data.records
      if (this.$route.query.storageId) {
        this.$data.model = this.getIndex('statusOpts', 'storageId')
      } else {
        this.$data.model = 0
      }
    },
    //获取仓库的index
    getIndex(type, id) {
      let index = 0
      for (let i = 0; i < this.$data[type].length; i++) {
        if (this.$data[type][i][id] == this.$route.query[id]) {
          index = i
          break
        }
      }
      return index
    },
    // 切换仓库
    async storageChange(value) {
      this.$data.model = value
      // await this.getShelves()
      this.$data.stockNum = ''
      this.$data.searchVal = ''
      this.reLoadData()
    },
    //切换类型
    // typeChange() {
    //   this.$data.stockNum = ''
    //   // this.reLoadData()
    // },
    //仓位编号搜索
    NOSearch(value) {
      this.$set(this.$data.paginationData, 'name', value)
      this.reLoadData()
    },
    stockSearch() {
      let flag = POSITIVE_NUMBER.test(this.$data.stockNum)

      if (flag || this.$data.stockNum == '') {
        this.reLoadData()
      } else {
        this.$Message({ type: 'error', content: this.$t('storage.integer') })
      }
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
.me-stock-num {
  display: inline-block;
  width: 200px;
  margin: 0 10px;
}
</style>
