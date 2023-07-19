<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" :title="$t('edit.goodscancel')">
    </a-page-header>
    <a-layout class="me-page-layout">
      <SearchForm :type="componentsType" @search="onSearch" />
      <StatusTabs ref="sub" />

      <a-affix :offset-top="60" class="custom-affix">
        <a-space class="me-mb-3">
          <a-button-group>
            <a-popover
              @visibleChange="onVisibleChange"
              :visible="batchEditVisible"
              :title="null"
              trigger="click"
              placement="bottomLeft"
            >
              <template slot="content">
                <BatchEditOption
                  @cancel="reLoadData"
                  @selected="batchEditVisible = false"
                  :rows="selectedRows"
                />
              </template>
              <a-button type="primary">
                {{ $t('searchForm.batchEdit') }}
              </a-button>
            </a-popover>

            <a-button @click="onBatchEditCategory"> 批量设置类目 </a-button>
            <a-button @click="onBatchEditPrice"> 批量修改价格 </a-button>
          </a-button-group>

          <a-button @click="batchPublish" type="primary">
            {{ $t('commodityList.batchRelease') }}
          </a-button>
          <a-button @click="batchDelete">
            {{ $t('faild.batchDelete') }}
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
        @reloadPageData="reLoadData"
      >
        <div slot="actions" slot-scope="source">
          <a-button
            class="me-pa-1"
            type="link"
            @click="cancelPublish(source)"
            v-if="componentsType == 7"
          >
            {{ $t('commodityList.cancelRelease') }}
          </a-button>
          <a-divider type="vertical" v-if="componentsType == 7" />
          <a-button
            class="me-pa-1"
            type="link"
            @click="onEdit(source)"
            v-if="componentsType == 3"
          >
            {{ $t('common.edit') }}
          </a-button>
          <a-divider type="vertical" v-if="componentsType == 3" />
          <a-button
            class="me-pa-1"
            :loading="source.source._loading_"
            type="link"
            @click="onRePush(source)"
            v-if="componentsType == 3 || componentsType == 8"
          >
            {{ $t('faild.rePush') }}
          </a-button>
          <a-divider
            type="vertical"
            v-if="componentsType == 3 || componentsType == 8"
          />
          <a-button
            type="link"
            class="me-pa-1 me-error"
            @click="onDelete(source)"
            v-if="componentsType == 3 || componentsType == 8"
          >
            {{ $t('common.delete') }}
          </a-button>
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
import BatchEditOption from './components/BatchEditOption'
import Goods from '@/api/goods'
import bus from '@/bus'

export default {
  components: {
    SearchForm,
    CommodityList,
    StatusTabs,
    BatchEditOption
  },
  mixins: [tableMixins, productTableMixins],
  data() {
    return {
      params: {},
      componentsType: 8,
      storeList: [],
      form: this.$form.createForm(this),
      count: {
        cancelPublishCount: '',
        pushCount: '',
        pushFailCount: ''
      },
      batchPublishLoading: false
    }
  },
  mounted() {},
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
      this.batchPublish()
    },
    // 取消发布
    cancelPublish({ source }) {
      const { id } = source
      this.onSelectChange([id], [source])
      this.batchCancel()
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
