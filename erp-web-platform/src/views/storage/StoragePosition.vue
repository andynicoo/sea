<template>
  <div class="me-pa-2">
    <div class="me-card clearfloat" v-if="statusOpts.length">
      <a-tabs
        :activeKey="model"
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
      {{ $t('storage.shelves') }}：<a-select
        :value="model2"
        style="width: 120px"
        @change="shelvesChange"
      >
        <a-select-option value="-1">{{ $t('common.all') }}</a-select-option>
        <a-select-option
          :value="index"
          v-for="(item, index) in statusOpts2"
          :key="item.storageShelvesId"
        >
          {{ item.shelvesName }}
        </a-select-option>
      </a-select>
      {{ $t('common.status') }}：<a-select
        :value="status"
        style="width: 120px"
        @change="statusChange"
      >
        <a-select-option
          :value="item.value"
          v-for="item in selectArr"
          :key="item.value"
        >
          {{ item.text }}
        </a-select-option>
      </a-select>
      <div class="me-sum-search">
        <b
          >{{ $t('storage.totalPosition') }}
          {{ dataSource.length ? dataSource[0].sum : 0 }}</b
        ><b
          >{{ $t('storage.emptyPosition') }}
          {{ dataSource.length ? dataSource[0].count : 0 }}</b
        >
        <a-input-search
          v-model="searchVal"
          :placeholder="$t('storage.positionNumber')"
          :enter-button="$t('common.search')"
          allowClear
          @search="NOSearch"
          class="me-maxw320"
        />
      </div>
    </div>
    <div class="me-card">
      <a-table
        class="me-shelf-list"
        :columns="columns"
        :data-source="dataSource"
        rowKey="storagePositionId"
        :pagination="getPagination"
        @change="changePage"
        :loading="tableLoading"
      >
        <template slot="images" slot-scope="text, record">
          <img
            v-lazy="record.images[0]"
            style="width: 50px; height: 50px; border-radius: 2px"
            class="me-mr-2"
          />
        </template>
        <template slot="storagePositionStatus" slot-scope="text, record">
          {{
            record.images.length == 0
              ? $t('storage.empty')
              : $t('storage.unEmpty')
          }}
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
/**
 * 仓位列表
 */
// import UpdateStoragePositionForm from './components/UpdateStoragePositionForm'
import tableMixins from '@/mixins/tableMixins'
import Storage from '@/api/storage'
export default {
  // components: {
  //   UpdateStoragePositionForm
  // },
  mixins: [tableMixins],
  data() {
    return {
      sum: 0,
      count: 0,
      mode: 'top',
      model: 0,
      statusOpts: [],
      model2: '-1',
      statusOpts2: [],
      status: 0,
      searchVal: '',
      selectArr: [
        { text: this.$t('common.all'), value: 0 },
        { text: this.$t('storage.empty'), value: 2 },
        { text: this.$t('storage.unEmpty'), value: 1 }
      ],
      columns: [
        {
          title: this.$t('storage.positionNumber'),
          dataIndex: 'no',
          ellipsis: true
        },
        { title: this.$t('storage.sscolumns'), dataIndex: 'shelfLayers' },
        { title: this.$t('storage.sslayers'), dataIndex: 'shelfColumns' },
        {
          title: this.$t('storage.goodsMainImg'),
          dataIndex: 'images',
          scopedSlots: { customRender: 'images' }
        },
        {
          title: this.$t('common.status'),
          dataIndex: 'storagePositionStatus',
          scopedSlots: { customRender: 'storagePositionStatus' }
        } //0: 空闲; 1: 有商品
      ]
    }
  },
  methods: {
    //仓位编号搜索
    NOSearch() {
      this.reLoadData()
    },
    async getTableDataBefore() {
      if (!this.$data.statusOpts.length) await this.getStorage()
      if (this.$data.statusOpts.length) {
        if (!this.$data.statusOpts2.length) await this.getShelves()
      }
    },
    async getTableData() {
      const { status, model, model2, statusOpts, statusOpts2 } = this.$data
      if (statusOpts2[model2] || model2 == '-1') {
        const shelvesId = statusOpts2[model2]
          ? statusOpts2[model2].storageShelvesId
          : ''
        const storageId = statusOpts[model].storageId
        const name = this.$data.searchVal
        const res = await Storage.getStoragePosition({
          ...this.$data.paginationData,
          name,
          status,
          storageId,
          storageShelvesId: shelvesId
        })
        res.data.records = res.data.records.map((e) => {
          if (e.skus) {
            e.skus = e.skus.map((e) => {
              ;/^http(s):\/\//.test(e.images)
                ? (e.images = [e.images])
                : (e.images = JSON.parse(e.images))
              return e
            })
          }
          return e
        })
        return res
      } else {
        this.$data.dataSource = []
      }
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
    // 获取货架
    async getShelves() {
      const { statusOpts, model } = this.$data

      const storageId = statusOpts[model].storageId
      const res = await Storage.getStorageShelves({
        current: 1,
        size: 10000,
        storageId
      })

      this.$data.statusOpts2 = res.data.records
      if (res.data.records.length) {
        if (this.$route.query.storageId) {
          this.$data.model2 = this.getIndex('statusOpts2', 'storageShelvesId')
        } else {
          this.$data.model2 = '-1'
        }
      } else {
        this.$data.model2 = '-1'
      }
    },
    //获取仓库或者货架的index
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
      this.$data.status = 0
      this.$data.searchVal = ''
      await this.getShelves()
      this.reLoadData()
    },
    //切换货架
    shelvesChange(value) {
      this.$data.model2 = value
      this.reLoadData()
    },
    //切换状态
    statusChange(value) {
      this.$data.status = value
      this.reLoadData()
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
.me-sum-search {
  float: right;
  b {
    display: inline-block;
    margin: 5px 20px 0 0;
    font-weight: normal;
  }
}
.me-maxw320 {
  width: 280px;
}
</style>
