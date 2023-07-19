<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" :title="tabArr[componentsType].name">
    </a-page-header>
    <a-layout class="me-page-layout">
      <div>
        <SearchForm @search="onSearch" :type="searchFormType">
          <!-- <template #site-item>
            <a-form-item label="站点">
              <a-select v-decorator="['countryCode']" style="width: 190px">
                <a-select-option
                  v-for="item in lazadaStoreListSize"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </template> -->
          <!-- <template #form-item>
            <a-form-item label="QC状态">
              <a-select v-decorator="['status']" style="width: 190px">
                <a-select-option
                  v-for="item in QCStatus"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </template> -->
        </SearchForm>
      </div>

      <a-tabs
        :activeKey="componentsType"
        @change="onTabsChange"
        type="card"
        class="me-lazada-llm"
      >
        <a-tab-pane
          v-for="item in tabArr"
          :key="item.key"
          :tab="
            item.name +
              (counts[item.count] == 0 || counts[item.count] == undefined
                ? ''
                : '(' + counts[item.count] + ')')
          "
        >
        </a-tab-pane>
      </a-tabs>

      <a-affix :offset-top="60" class="custom-affix">
        <a-space class="me-mb-3">
          <a-button
            type="primary"
            @click="batchPublishDelete(null, 2)"
            :loading="batchPublishLoading"
            v-if="[0, 4, 5].includes(componentsType)"
          >
            {{ $t('searchForm.batchPublish') }}
          </a-button>

          <a-button @click="batchPublishDelete(null, 1)">
            {{ $t('searchForm.batchTimedDelete') }}
          </a-button>

          <a-button v-if="[1].includes(componentsType)"> 取消发布 </a-button>
        </a-space>
        <a-button-group class="me-fr me-mb-3">
          <a-button
            @click="changeListType(true)"
            :type="listType ? 'primary' : ''"
            >Product</a-button
          >
          <a-button
            @click="changeListType(false)"
            :type="listType ? '' : 'primary'"
          >
            SKU
          </a-button>
        </a-button-group>
      </a-affix>

      <CommodityList
        :loading="tableLoading"
        :data-source="dataSource"
        :type="componentsType"
        :rowSelection="rowSelection"
        :pagination="getPagination"
        :listType="listType"
        @change="changePage"
        @changeType="changeType"
      >
        <div slot="actions" slot-scope="source">
          <a-button
            class="me-pa-1"
            type="link"
            @click="onEdit(source)"
            v-if="[0, 4, 5].includes(componentsType)"
          >
            {{ $t('common.edit') }}
          </a-button>
          <a-divider
            type="vertical"
            v-if="[0, 4, 5].includes(componentsType)"
          />
          <a-button
            v-if="[0, 4, 5].includes(componentsType)"
            class="me-pa-1"
            type="link"
            @click="batchPublishDelete(source.source, 2)"
          >
            {{ componentsType == 0 ? '发布' : '重新发布' }}
          </a-button>
          <a-divider
            type="vertical"
            v-if="[0, 4, 5].includes(componentsType)"
          />
          <a-button
            v-if="[0, 4, 5].includes(componentsType)"
            class="me-pa-1 me-error"
            type="link"
            @click="batchPublishDelete(source.source, 1)"
            :loading="source.source._d_loading_"
          >
            {{ $t('common.delete') }}
          </a-button>
          <a-button
            v-if="[3].includes(componentsType)"
            class="me-pa-1"
            type="link"
            @click="openPage(source.source.editUrl)"
          >
            后台编辑
          </a-button>
          <div class="me-mr-2 me-status me-status-skip me-fs12">
            <div>最后修改时间:</div>
            {{ source.source.updateTime }}
          </div>
        </div>
      </CommodityList>
    </a-layout>
  </div>
</template>

<script>
import CommodityList from './components/CommodityList'
import SearchForm from './../components/SearchForm'
import tableMixins from '@/mixins/tableMixins'
// import productTableMixins from '@/mixins/productTableMixins'
import Lazada from '@/api/lazada'

import '@/views/goods/components/common.scss'
import { mapState } from 'vuex'
export default {
  mixins: [tableMixins],
  components: {
    CommodityList,
    SearchForm
  },

  data() {
    return {
      params: {},
      batchPublishLoading: false,
      componentsType: 0,
      listType: true, //列表是否收起sku
      searchFormType: 'Lazada', //Lazada传入搜索表单的值
      counts: {
        cancelPublishCount: 0, // 商品已取消发布数
        pushCount: 0, // 商品发布中数
        pushFailCount: 0, // 商品发布失败数
        pushSuccessCount: 0, // 商品发布成功数
        stayPublishCount: 0, // 商品待发布数
        timingPublishCount: 0, // 商品定时发布数
        timer: null
      },
      //QC审核状态
      QCStatus: [
        {
          value: 1,
          label: '通过'
        },
        {
          value: 0,
          label: '拒绝'
        },
        {
          value: -1,
          label: '待定'
        },
        {
          value: -2,
          label: '批准'
        },
        {
          value: -3,
          label: '当场拒绝'
        },
        {
          value: -4,
          label: '锁定'
        }
      ],
      //发布商品Tabs
      tabArr: [
        {
          name: '待发布',
          path: '/goods/lazada/to-be-released',
          count: 'stayPublishCount',
          key: 0
        },
        {
          name: '发布中',
          path: '/goods/lazada/publishing',
          count: 'pushCount',
          key: 1
        },
        {
          name: 'QC审核',
          path: '/goods/lazada/qc-audit',
          count: 'stayPublishCount',
          key: 2
        },
        {
          name: '发布成功',
          path: '/goods/lazada/success',
          count: 'pushSuccessCount',
          key: 3
        },
        {
          name: '发布失败',
          path: '/goods/lazada/faild',
          count: 'pushFailCount',
          key: 4
        },
        {
          name: '已取消',
          path: '/goods/lazada/cancel',
          count: 'cancelPublishCount',
          key: 5
        }
      ]
    }
  },
  created() {
    let { tabArr } = this.$data
    const path = location.pathname
    const hash = location.hash
    tabArr.map((item) => {
      if (path === item.path || hash.indexOf(item.path) > -1) {
        this.$data.componentsType = item.key
      }
    })
  },
  computed: {
    ...mapState({
      lazadaStoreListSize: (state) => state.auth.lazadaStoreListSize
    })
  },
  methods: {
    //切换列表类型
    changeListType(flag) {
      this.$data.listType = flag
      window.dispatchEvent(new Event('resize')) //table fixed对齐
    },
    //搜索
    onSearch(data) {
      this.$data.params = data
      this.reLoadData()
    },
    //发布
    //删除
    batchPublishDelete(rows, type) {
      console.log(rows)
      //type 1是删除，2是发布
      let ids = []
      let txt = ['', '删除', '发布']
      let api = ['', 'deleteLazadaProduct', 'publishLazadaProduct']
      if (rows) {
        ids = [rows.productRecordId]
      } else {
        ids = this.$data.selectedRowKeys
      }

      if (!ids.length) {
        this.$message.warning(`请选择需要${txt[type]}的商品`)
        return
      }
      this.$confirm({
        title: this.$t('common.warn'),
        content: `确认要${txt[type]}吗？`,
        onOk: async () => {
          let res = await Lazada[api[type]]({ productRecordIds: ids })
          console.log(res)
          if (res.code === 0) {
            this.$message.success(this.$t('common.handlerSuccess'))
            this.loadData(type == 1 ? 'delete' : '')
            this.onSelectChange([], [])
          }
        },
        onCancel: () => {
          this.onSelectChange([], [])
        }
      })
    },
    //获取列表数据
    getTableData() {
      const { size, current } = this.$data.paginationData
      const { params, componentsType } = this.$data
      return Lazada.getGoodsLazadaProductPage({
        ...params,
        size,
        page: current,
        localStatus: componentsType,
        name: params.title
      })
    },
    //切换商品列表
    onTabsChange(key) {
      const { tabArr } = this.$data
      tabArr.map((item) => {
        if (key == item.key) {
          this.$router.push({ path: item.path })
        }
      })
    },
    onEdit({ source }) {
      let bc = ''
      if (this.$data.componentsType === 0) bc = '待发布'
      if (this.$data.componentsType === 1) bc = '发布中'
      if (this.$data.componentsType === 3) bc = '发布成功'
      if (this.$data.componentsType === 4) bc = '发布失败'
      if (this.$data.componentsType === 5) bc = '已取消'
      this.$router.push({
        path: '/goods/lazada/edit',
        query: {
          storeType: source.storeType,
          edit: 1,
          id: source.productRecordId,
          bc
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.me-custorm-date-picker {
  &.ant-calendar-picker {
    min-width: auto !important;
  }
}
.dynamic-title-dialog {
  color: #40a9ff;
  margin: 0 10px;
}
</style>
<style>
.me-lazada-llm .ant-tabs-nav.ant-tabs-nav-animated div:nth-child(3) {
  display: none;
}
</style>
