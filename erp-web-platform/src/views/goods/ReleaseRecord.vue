<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" title="发布记录"> </a-page-header>
    <a-layout class="me-page-layout">
      <div class="me-page-search">
        <PublishSearchForm
          @search="onSearch"
          @getnum="getCountNum"
          :type="componentsType"
          ref="PublishSearchForm"
        />
      </div>
      <!-- {{ params }} -->
      <a-tabs :activeKey="componentsType" @change="onTabsChange" type="card">
        <a-tab-pane
          :key="7"
          :tab="$t('faild.publishIng') + '(' + count.pushCount + ')'"
        >
        </a-tab-pane>
        <a-tab-pane
          :key="3"
          :tab="$t('faild.publishFaild') + '(' + count.pushFailCount + ')'"
        >
        </a-tab-pane>
        <a-tab-pane
          :key="8"
          :tab="
            $t('faild.publishCancel') + '(' + count.cancelPublishCount + ')'
          "
        >
        </a-tab-pane>
      </a-tabs>

      <a-space class="me-mb-2">
        <a-button @click="batchCancel" v-if="componentsType == 7">
          批量取消
        </a-button>
        <a-button @click="batchDelete('delete')" v-if="componentsType != 7">
          {{ $t('faild.batchDelete') }}
        </a-button>
        <a-button @click="batchPublish" v-if="componentsType == 8">
          批量发布
        </a-button>
      </a-space>

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
          <a-space class="me-mr-2">
            <a-button
              class="me-pa-1"
              type="link"
              @click="cancelPublish(source)"
              v-if="componentsType == 7"
            >
              取消发布
            </a-button>
            <a-button
              class="me-pa-1"
              type="link"
              @click="onEdit(source)"
              v-if="componentsType == 3"
            >
              {{ $t('common.edit') }}
            </a-button>
            <a-button
              class="me-pa-1"
              :loading="source.source._loading_"
              type="link"
              @click="onRePush(source)"
              v-if="componentsType == 3 || componentsType == 8"
            >
              {{ $t('faild.rePush') }}
            </a-button>
            <a-button
              type="link"
              class="me-pa-1 me-error"
              @click="onDelete(source)"
              v-if="componentsType == 3 || componentsType == 8"
            >
              {{ $t('common.delete') }}
            </a-button>
          </a-space>
        </div>
      </CommodityList>
    </a-layout>
  </div>
</template>

<script>
import PublishSearchForm from './components/PublishSearchForm'
import tableMixins from '@/mixins/tableMixins'
import productTableMixins from '@/mixins/productTableMixins'
import CommodityList from './components/CommodityList'
import Goods from '@/api/goods'
export default {
  components: {
    PublishSearchForm,
    CommodityList
  },
  mixins: [tableMixins, productTableMixins],
  data() {
    return {
      params: {},
      componentsType: 7,
      storeList: [],
      form: this.$form.createForm(this),
      count: {
        cancelPublishCount: 0,
        pushCount: 0,
        pushFailCount: 0
      }
    }
  },
  mounted() {
    this.getCountNum()
  },
  methods: {
    getCountNum(str) {
      const { params, componentsType } = this.$data
      // 切换tab 清空参数，否则使用参数
      var insParams = str == 'clear' ? {} : params
      Goods.getCount({ ...insParams }).then(({ data }) => {
        console.log(params)
        this.$data.count = data
      })
    },
    /**tab切换 */
    onTabsChange(key) {
      // this.$set(this.$data.componentsType, 'status', key)
      this.$refs.PublishSearchForm.resetFields()

      this.$data.dataSource = []
      this.$data.componentsType = key
      this.$nextTick(this.reLoadData, this.getCountNum('clear'))
    },
    getTableData() {
      const { size, current } = this.$data.paginationData
      const { params, componentsType } = this.$data
      return Goods.getProductList({
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
