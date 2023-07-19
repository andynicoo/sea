<template>
  <div class="me-pa-2 me-mb-5">
    <a-form :form="form">
      <a-form-item v-show="!queryPlatform">
        <span class="me-mr-2">{{ $t('goodsCollection.choosePlatform') }}:</span>
        <a-space>
          <span
            v-for="logo in imgPlatformArr"
            :key="logo.platCode"
            v-show="!['拼多多'].includes(logo.displayName)"
          >
            <template v-if="logo.pfs">
              <a-dropdown>
                <a @click="(e) => e.preventDefault()">
                  <a-avatar
                    shape="square"
                    :size="28"
                    :src="logo.isSelect ? logo.selectImg : logo.initialImg"
                    style="border-radius:0"
                  />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item v-for="pfs in logo.pfs" :key="pfs.platCode">
                    <a @click="onChoose(logo, pfs)">{{ pfs.name }}</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
            <template v-else>
              <a @click="onChoose(logo, null)">
                <a-avatar
                  :size="28"
                  shape="square"
                  :src="logo.isSelect ? logo.selectImg : logo.initialImg"
                  style="border-radius:0"
                />
              </a>
            </template>
          </span>
        </a-space>
      </a-form-item>
      <a-form-item :validate-status="activeValidStatus" :help="activeValidText">
        <span class="me-mr-2">{{ $t('goodsCollection.activePlatform') }}:</span>
        <span
          class="me-cp"
          style="min-height: 40px; width: 100%"
          @click="currentPlatClick"
        >
          <template v-if="currentPlatFormat">
            <a-avatar :size="28" :src="currentPlatFormat.img" shape="square" />
            <span class="me-ml-2">{{ currentPlatFormat.name }}</span>
          </template>
          <template v-if="!currentPlatFormat">
            <span class="me-handler-danger">{{
              $t('goodsCollection.activeValidMessage')
            }}</span>
          </template>
        </span>
        <span
          v-if="currentPlatFormat && currentPlatFormat.platCode == 'PDD'"
          class="me-ml-2"
          >由于拼多多升级更新频繁，可能会导致“平台采集”功能出现采集失败的情况，如遇到该问题，建议您优先使用“插件采集”功能。</span
        >
      </a-form-item>
      <a-form-item class="me-mb-0" v-if="currentPlatFormat">
        <span class="me-mr-2 me-vat"
          >{{ $t('goodsCollection.queryConditions') }}:</span
        >
        <a-space class="me-mr-2">
          <a-form-item
            class="me-ib"
            style="width: 180px"
            v-show="!platFilter()"
          >
            <a-select
              v-decorator="['sortValue']"
              :placeholder="$t('goodsCollection.sort')"
            >
              <a-select-option
                v-for="opt in currentPlatFormat.conditionOpts"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="me-ib " style="width: 180px">
            <a-input
              v-decorator="['startPrice', { rules: startPriceRules }]"
              :placeholder="$t('goodsCollection.lowestPrice')"
            />
          </a-form-item>
          <a-form-item>
            <span>—</span>
          </a-form-item>
          <a-form-item class="me-ib" style="width: 180px">
            <a-input
              v-decorator="['endPrice', { rules: endPriceRules }]"
              :placeholder="$t('goodsCollection.highestPrice')"
            />
          </a-form-item>
          <a-form-item class="me-ib me-mr-2" style="width: 180px">
            <a-input
              v-decorator="['keyWord', { rules: keyWordRules }]"
              :placeholder="$t('goodsCollection.keyword')"
            />
          </a-form-item>
        </a-space>
        <a-space class="me-vat">
          <a-form-item class="me-ib" style="width: 180px">
            <a-button @click="submit" type="primary">
              {{ $t('common.search') }}
            </a-button>
          </a-form-item>
        </a-space>
      </a-form-item>
    </a-form>

    <span v-if="selectedRows.length > 0" class="me-select-text">
      {{ $t('common.selected') }}
      <span class="me-f-red"> {{ selectedRows.length }}</span>
      {{ $t('common.dataRow') }}
    </span>
    <a-config-provider>
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
      <!-- 后端服务器出错, 无数据返回，显示重试按钮 -->
      <template #renderEmpty>
        <div style="text-align: center">
          <a-empty :image="simpleImage" class="me-pa-4">
            <div slot="description">
              <p v-if="!isSearchFailure">{{ $t('common.noData') }}</p>
              <div v-else>
                {{ $t('goodsCollection.message2') }}
                <a-button
                  size="small"
                  icon="reload"
                  class="me-ml-2"
                  @click="submit"
                  type="primary"
                >
                  {{ $t('collect.retry') }}
                </a-button>
              </div>
            </div>
          </a-empty>
        </div>
      </template>
    </a-config-provider>
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
import collectionMixins from '@/mixins/collectionMixins'
import CrawlApi from '@/api/crawl'
import { Empty } from 'ant-design-vue'
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
      form: this.$form.createForm(this),
      imgPlatformArr: getCollectSites(),
      startPriceRules: [
        {
          validator: (rule, endPrice, callback) => {
            const { form } = this.$data
            let startPrice = form.getFieldValue('startPrice')
            if (startPrice) {
              startPrice = Number(startPrice)
              if (Number.isNaN(startPrice) || startPrice < 0) {
                callback(
                  new Error(this.$t('goodsCollection.priceValidMessage1'))
                )
                return
              }
            }
            callback()
          }
        }
      ],
      endPriceRules: [
        {
          validator: (rule, endPrice, callback) => {
            const { form } = this.$data
            let startPrice = form.getFieldValue('startPrice')
            if (endPrice && startPrice) {
              startPrice = Number(startPrice)
              endPrice = Number(endPrice)
              if (Number.isNaN(startPrice) || Number.isNaN(endPrice)) {
                callback(
                  new Error(this.$t('goodsCollection.priceValidMessage1'))
                )
                return
              }
              if (startPrice >= endPrice) {
                callback(
                  new Error(this.$t('goodsCollection.priceValidMessage2'))
                )
                return
              }
            }
            callback()
          }
        }
      ],
      keyWordRules: [
        {
          required: true,
          message: this.$t('goodsCollection.keyWordValidMessage')
        }
      ],
      activeValidStatus: null,
      activeValidText: null,
      params: null,
      leftpar: null, // 用于筛选条件使用时，分页传参
      columns: [
        // {
        //   title: this.$t('goodsCollection.columnItemImg'),
        //   dataIndex: 'itemImg',
        //   key: 'itemImg',
        //   scopedSlots: { customRender: 'itemImg' },
        //   width:100
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
      platUrl: null, //当前站点url
      isSearchFailure: false,
      idSelectedArr: [],
      plugPopVisible: false,
      queryPlatform: ''
    }
  },
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  computed: {
    /**
     * 当前选中平台
     */
    currentPlatFormat() {
      const { imgPlatformArr } = this.$data
      const plat = imgPlatformArr.find((plat) => plat.isSelect)
      if (!plat) {
        return null
      }
      if (plat.pfs) {
        const pfs = plat.pfs.find((p) => p.isSelect)
        return {
          name: `${plat.displayName}(${pfs.displayName})`,
          img: plat.selectImg,
          url: pfs.url,
          conditionOpts: plat.conditionOpts,
          platCode: pfs.platCode
        }
      }
      return {
        name: plat.displayName,
        img: plat.selectImg,
        url: plat.url,
        conditionOpts: plat.conditionOpts,
        platCode: plat.platCode
      }
    },
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
  mounted() {
    this.queryPlatform = this.$route.query.platform
    if (this.queryPlatform) {
      let logo = this.imgPlatformArr.filter(
        (item) => item.platCode == this.queryPlatform
      )[0]
      this.onChoose(logo, null)
      setTimeout(() => {
        this.form.setFieldsValue({ keyWord: this.$route.query.title })
        this.submit()
      })
    }
  },
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
      let flag = false
      if (this.platformSwitch(this.currentPlatFormat.name)) {
        flag = true
      }
      return flag
    },
    /**
     * 获取表格数据
     */
    async getTableData() {
      const { params } = this.$data
      this.isSearchFailure = false
      if (!params) {
        return { data: { records: [], current: 1, size: 30, total: 0 } }
      }
      const { current } = this.$data.paginationData
      const res = await CrawlApi.getCrawlPFQuery({
        // size: size || 30,
        current,
        leftpar: this.leftpar,
        ...params
      })
      // 后端服务器出错，403：爬虫服务器抓取失败，408：后端服务器请求超时
      if ([403, 408].includes(res.data.code)) {
        this.isSearchFailure = true
      }
      res.data.records = res.data.itemList
      this.leftpar = res.data.leftpar || null //· 用于筛选条件使用时，分页传参
      return res
    },
    getTableDataAfter() {
      // 处理天猫、淘宝站点搜索出来的商品放大后显示模糊(60*60改成360*360)
      if (
        this.currentPlatFormat &&
        ['TM', 'TB'].includes(this.currentPlatFormat.platCode)
      ) {
        this.$data.dataSource.forEach((item) => {
          if (item.itemImg.search(/60x60.jpg/)) {
            item.itemImg = item.itemImg.replace(/60x60/, '360x360')
          }
        })
      }
      if (this.platFilter()) {
        this.$data.dataSource.forEach((item) => {
          this.$set(item, 'disabled', true)
        })
      }
    },
    /**
     * 搜索提交校验
     */
    submit() {
      const { form } = this.$data
      const { currentPlatFormat } = this
      if (!currentPlatFormat) {
        this.$data.activeValidStatus = 'error'
        this.$data.activeValidText = this.$t(
          'goodsCollection.activeValidMessage'
        )
        return
      } else {
        this.$data.activeValidStatus = null
        this.$data.activeValidText = null
      }
      form.validateFields().then((data) => {
        this.leftpar = null // 清除筛选条件
        this.$data.params = { ...data, sourceCode: currentPlatFormat.platCode }
        this.reLoadData()
      })
    },
    /**
     * 选中平台
     */
    onChoose(logo, pfs) {
      console.log(logo, pfs)
      const { imgPlatformArr } = this.$data
      // 重置筛选条件
      this.form.resetFields(['sortValue'])
      imgPlatformArr.forEach((element) => {
        if (element.platCode === logo.platCode) {
          this.platUrl = element.url
          this.$set(element, 'isSelect', true)
          /**
           * 选中子级
           */
          if (element.pfs && pfs) {
            element.pfs.forEach((p) => {
              if (p.platCode === pfs.platCode) {
                this.$set(p, 'isSelect', true)
              } else {
                this.$set(p, 'isSelect', false)
              }
            })
          }
        } else {
          this.$set(element, 'isSelect', false)
          /**
           * 取消选中子级
           */
          if (element.pfs && pfs) {
            element.pfs.forEach((p) => {
              this.$set(p, 'isSelect', false)
            })
          }
        }
      })
    },
    /**
     * 单个导入
     */
    async onImport(record) {
      this.importSubmit([record.itemUrl], null, [record.itemId])
    },
    /**
     * 批量导入采集箱
     */
    onBatchImport(urls) {
      return new Promise((resolve) => {
        const { selectedRows } = this.$data
        const urlsArr = selectedRows.map(({ itemUrl }) => itemUrl)
        if (this.currentPlatFormat.name == '1688') {
          this.idSelectedArr = selectedRows.map(({ itemId }) => itemId)
        } else {
          this.idSelectedArr = []
        }
        if (urlsArr.length == 0 && urls.length == 0) {
          this.$message.error(
            this.$t('goodsCollection.onBatchImportErrorMessage')
          )
          return false
        }
        resolve(urlsArr || urls)
      })
    },
    /**
     * 导入提交
     */
    importSubmit(urlArr = [], reqCookies = null, idArr = []) {
      if (!urlArr.length) {
        let message = this.$t('goodsCollection.onBatchImportErrorMessage')
        this.$message.error(message)
        return
      }
      let params = { linkArr: urlArr, reqCookies }
      if (this.currentPlatFormat.name == '1688') {
        params = Object.assign(params, { itemIds: idArr })
      }
      CrawlApi.addCrawlWithLink(params).then(() => {
        bus.$emit('work-flow-steps') // 显示头部导航提示
        this.$message.success(this.$t('goodsCollection.importSuccess'))
      })
    },
    currentPlatClick() {
      this.openPage(this.currentPlatFormat.url, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/theme/mixins.scss';

.overflow-text {
  word-wrap: break-word;
  word-break: break-all;
  @include ellipsisMultiline(2);
}

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

.me-plug-pop {
  text-align: center;

  h2 {
    font-weight: 600;
    color: #262424;
    line-height: 25px;
    font-size: 18px;
  }

  p {
    line-height: 22px;
    color: #909099;
    font-size: 12px;
  }

  .me-f12 {
    font-size: 12px;
  }
}

.me-vat {
  vertical-align: top;
}
</style>
