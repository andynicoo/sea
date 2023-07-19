<template>
  <div class="me-pa-2 me-mb-5">
    <a-form :form="form">
      <a-form-item>
        <a-input-search
          @search="onGetProduct"
          :enter-button="$t('goodsCollection.getProduct')"
          v-decorator="['url', { rules: urlRules }]"
          autocomplete="off"
          :placeholder="$t('goodsCollection.storeUrlPlaceHolder')"
        >
        </a-input-search>
        <p>
          {{ $t('goodsCollection.pluginMessage14') }}
        </p>
      </a-form-item>
      <a-form-item>
        <span class="me-mr-2">{{ $t('goodsCollection.supplyPlatform') }}:</span>
        <a-space>
          <a-tooltip
            placement="bottom"
            v-for="logo in imgLogoLinksArr"
            :key="logo.value"
            v-show="!['拼多多'].includes(logo.displayName)"
          >
            <template slot="title">
              <span>{{ logo.displayName }}</span>
            </template>
            <a :href="logo.url" target="__blank">
              <a-avatar :size="28" :src="logo.selectImg" shape="square" />
            </a>
          </a-tooltip>
        </a-space>
      </a-form-item>
    </a-form>

    <span v-if="selectedRows.length > 0" class="me-select-text">
      {{ $t('common.selected') }}
      <span class="me-f-red"> {{ selectedRows.length }}</span>
      {{ $t('common.dataRow') }}
    </span>

    <a-table
      rowKey="itemId"
      :loading="tableLoading"
      :columns="columns"
      :data-source="dataSource"
      :row-selection="rowSelection"
      :pagination="getPagination"
      @change="changePage"
    >
      <div slot="_title" slot-scope="text, record, index">
        <div class="product-info">
          <a-popover :placement="index < 5 ? 'rightTop' : 'rightBottom'">
            <template slot="content">
              <img
                v-lazy="record.itemImg"
                style="width: 280px; height: 280px; border-radius: 2px"
              />
            </template>
            <img
              v-lazy="record.itemImg"
              style="width: 80px; height: 80px; border-radius: 2px"
            />
          </a-popover>

          <div class="info-text">
            <a target="__blank" :href="record.itemUrl" class="name">{{
              record.title
            }}</a>
          </div>
        </div>
      </div>

      <div slot="operationSlot" slot-scope="text, record">
        <a-button
          type="link"
          @click="goGoodsDetails(record)"
          v-if="platFilter()"
        >
          采集该商品
        </a-button>
        <a-button
          v-else
          :disabled="record._importDisable"
          type="link"
          @click="onImport(record)"
        >
          {{ $t('goodsCollection.import') }}
        </a-button>
      </div>
    </a-table>
    <!-- 安装插件提示 -->
    <PlugInstallTips
      :plugPopVisible="plugPopVisible"
      @closePlugPop="closePlugPop"
    ></PlugInstallTips>
  </div>
</template>

<script>
import PlugInstallTips from '@/components/PlugInstallTips'
import tableMixins from '@/mixins/tableMixins'
import CrawlApi from '@/api/crawl'
import collectionMixins from '@/mixins/collectionMixins'
import bus from '@/bus'
import { getCollectSites } from '@/util'

export default {
  props: {
    collectionPlatformConfig: {
      type: Object
    },
    platformSite: {
      type: Object
    }
  },
  mixins: [tableMixins, collectionMixins],
  components: {
    PlugInstallTips
  },
  data() {
    return {
      currentType: 2,
      form: this.$form.createForm(this),
      urlRules: [
        {
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error(this.$t('goodsCollection.urlsValidError1')))
              return
            }
            var urls = value.split('\n')
            var valid = urls.map((url) => /^http(s)?:\/\//.test(url))
            if (!valid.some(Boolean)) {
              callback(new Error(this.$t('goodsCollection.urlsValidError2')))
              return
            }
            callback()
          }
        }
      ],
      imgLogoLinksArr: getCollectSites(),
      columns: [
        // {
        //   title: this.$t('goodsCollection.columnItemImg'),
        //   dataIndex: 'itemImg',
        //   key: 'itemImg',
        //   scopedSlots: { customRender: 'itemImg' },
        //   width:120
        // },
        {
          title: this.$t('edit.productInfo'),
          dataIndex: 'title',
          key: 'title',
          scopedSlots: { customRender: '_title' },
          width: '30%'
        },
        {
          title: this.$t('goodsCollection.columnItemId'),
          dataIndex: 'itemId',
          key: 'itemId'
        },
        {
          title: this.$t('goodsCollection.columnPrice'),
          dataIndex: 'price',
          key: 'price'
        },
        {
          title: this.$t('goodsCollection.columnShopName'),
          dataIndex: 'shopName',
          key: 'shopName'
        },
        {
          title: this.$t('goodsCollection.columnOperationSlot'),
          dataIndex: 'operationSlot',
          key: 'operationSlot',
          scopedSlots: { customRender: 'operationSlot' }
        }
      ],
      leftpar: null, // 用于筛选条件使用时，分页传参
      plugPopVisible: false
    }
  },

  computed: {
    /**
     * 分页数据
     */
    getPagination() {
      const { size, current, total } = this.$data.paginationData

      let pageSize = !Number(size) ? 30 : Number(size)
      return {
        pageSize: pageSize,
        current,
        total,
        showQuickJumper: true,
        defaultPageSize: 10,
        showTotal: (total) => this.$t(`common.pageTotalText`, { total })
      }
    }
  },
  watch: {
    selectedRows: {
      handler(newData) {
        this.$emit('input', newData.length == 0)
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    //关闭插件下载提示弹窗
    closePlugPop() {
      this.$data.plugPopVisible = false
    },
    //跳转商品详情
    goGoodsDetails(record) {
      const PluginNode = document.querySelector(
        '#emalacca-chrome-extension-installed'
      )
      if (!PluginNode) {
        this.$data.plugPopVisible = true
      } else {
        window.open(record.itemUrl, '_blank')
      }
    },
    async getTableData() {
      const { form } = this.$data
      const { current } = this.$data.paginationData
      const url = form.getFieldValue('url')
      if (!url) {
        return { data: { records: [], current: 1, total: 0 } }
      }
      let params = { shopUrl: url, current, leftpar: this.leftpar }

      const res = await CrawlApi.addCrawlWithShopLink(params)
      res.data.records = res.data.itemList
      this.leftpar = res.data.leftpar || null //· 用于筛选条件使用时，分页传参
      return res
    },
    getTableDataAfter() {
      if (this.platFilter()) {
        this.$data.dataSource.forEach((item) => {
          this.$set(item, 'disabled', true)
        })
      }
    },
    //接口，插件采集开关
    platformSwitch(item) {
      if (!this.collectionPlatformConfig) return false
      let keys = Object.keys(this.collectionPlatformConfig)
      for (let i = 0; i < keys.length; i++) {
        if (
          this.collectionPlatformConfig[keys[i]] == 1 &&
          item.includes(this.platformSite[keys[i]])
        ) {
          return true
        }
      }
      return false
    },
    //筛选淘宝天猫拼多多1688
    platFilter() {
      let url = this.$data.form.getFieldValue('url')
      if (!url) return false
      let flag = false
      if (this.platformSwitch(url)) {
        flag = true
      }
      return flag
    },
    /**
     * 搜索
     */
    onGetProduct() {
      const { form } = this.$data
      form.validateFields().then(() => {
        this.leftpar = null // 清除筛选条件
        this.reLoadData()
      })
    },
    /**
     * 单个导入
     */
    async onImport(record) {
      this.importSubmit([record.itemUrl])
    },
    /**
     * 批量导入
     */
    onBatchImport(urls) {
      return new Promise((resolve) => {
        const { selectedRows } = this.$data
        const urlsArr = selectedRows.map(({ itemUrl }) => itemUrl)
        resolve(urlsArr || urls)
      })
    },
    /**
     * 导入提交
     */
    importSubmit(urlArr = [], reqCookies = null) {
      if (!urlArr.length) {
        let message = this.$t('goodsCollection.onBatchImportErrorMessage')
        this.$message.error(message)
        return
      }
      let params = { linkArr: urlArr, reqCookies }
      CrawlApi.addCrawlWithLink(params).then(() => {
        bus.$emit('work-flow-steps') // 显示头部导航提示
        this.$message.success(this.$t('goodsCollection.importSuccess'))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.product-info {
  display: grid;
  grid-template-columns: 80px 1fr;

  .info-text {
    padding: 0 10px;
    max-width: 800px;

    .name {
      overflow: hidden;
      color: #000000a6;
      text-overflow: ellipsis;
      display: -webkit-box; //作为弹性伸缩盒子模型显示。
      -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
      -webkit-line-clamp: 2; //显示的行

      &:hover {
        color: $linkColor;
      }
    }
  }
}
</style>
