<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" :title="$t('edit.goodsrelease')">
    </a-page-header>
    <a-layout class="me-page-layout">
      <SearchForm @search="onSearch" :type="componentsType"></SearchForm>
      <StatusTabs ref="sub" />
      <a-affix :offset-top="60" class="custom-affix">
        <a-space class="me-mb-3">
          <a-button @click="batchCancel">
            {{ $t('commodityList.batchCancelled') }}
          </a-button>
        </a-space>
      </a-affix>

      <!-- 列表 -->
      <CommodityList
        :loading="tableLoading"
        :data-source="dataSource"
        :type="componentsType"
        showStatus
        :rowSelection="rowSelection"
        :pagination="getPagination"
        @change="changePage"
      >
        <div slot="actions" slot-scope="source">
          <a-button class="me-pa-1" type="link" @click="onEdit(source)">
            {{ $t('common.edit') }}
          </a-button>
          <a-divider type="vertical" />
          <a-button
            class="me-pa-1 me-error"
            type="link"
            @click="cancelPublish(source)"
          >
            {{ $t('commodityList.cancelRelease') }}
          </a-button>
          <div class="me-mr-2 me-status me-status-skip me-fs12">
            <div>{{ $t('commodityList.lastModifiedTime') }}:</div>
            {{ source.source.updateTime }}
          </div>
        </div>
      </CommodityList>
    </a-layout>
  </div>
</template>

<script>
import SearchForm from './components/SearchForm'
import tableMixins from '@/mixins/tableMixins'
import productTableMixins from '@/mixins/productTableMixins'
import CommodityList from './components/CommodityList'
import StatusTabs from './components/StatusTabs.vue'
import Goods from '@/api/goods'
import bus from '@/bus'
export default {
  components: {
    SearchForm,
    CommodityList,
    StatusTabs
  },
  mixins: [tableMixins, productTableMixins],
  data() {
    return {
      params: {},
      componentsType: 7,
      storeList: [],
      form: this.$form.createForm(this),
      count: {
        cancelPublishCount: '',
        pushCount: '',
        pushFailCount: ''
      },
      timer: null,
      batchEditVisible: false,
      batchPublishLoading: false
    }
  },
  mounted() {
    // this.$data.timer = setInterval(() => {
    //   this.reLoadData()
    //   this.checkDataSource()
    // }, 2000)
  },
  beforeDestroy() {
    console.log('stop timer beforeDestroy release')
    clearInterval(this.$data.timer)
    this.$data.timer = null
  },
  methods: {
    getTableData() {
      const { size, current } = this.$data.paginationData
      const { params, componentsType } = this.$data
      return Goods.getEarlyProductList({
        ...params,
        size,
        current,
        type: componentsType
      })
    },
    //重置
    resetForm() {
      this.$data.form.resetFields()
      this.reLoadData()
    },
    /**
     * 重新发布
     */
    onRePush({ source }) {
      const { id } = source
      this.onSelectChange([id], [source])
      let params = { productId: [id] }
      this.setLoading('_loading_')
      Goods.productPublish(params).then(({ code }) => {
        this.setLoading('_loading_', false)
        // console.log(code)
        if (code == 0) {
          this.$message.success(this.$t('common.handlerSuccess'))
        }
        this.loadData()
      })
    },
    // 取消发布
    cancelPublish({ source }) {
      const { id } = source
      this.onSelectChange([id], [source])
      this.batchCancel()
    },
    checkDataSource() {
      const { dataSource } = this.$data
      if (dataSource == 0) {
        clearInterval(this.$data.timer)
        this.$data.timer = null

        bus.$emit('clearTimer')
      }
    },
    getCountNum() {
      this.$nextTick(() => {
        bus.$emit('updateCount')
      })
    }
  }
}
</script>

<style lang="scss">
.me-custorm-date-picker {
  &.ant-calendar-picker {
    min-width: auto !important;
  }
}

.custom-tabs {
  background-color: #ffffff;
  border: 1px solid rgb(235, 235, 235);

  .ant-tabs-bar {
    margin-bottom: 0;
  }
}
</style>
