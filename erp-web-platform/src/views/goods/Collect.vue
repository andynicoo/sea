<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" title="采集箱"> </a-page-header>
    <a-layout class="me-page-layout">
      <TableFilter
        :col-item="colItem"
        :form-model="searchParams"
        @submit="onSearch"
        @reset="resetSearch"
        v-show="componentsType != 4"
      >
      </TableFilter>
      <a-tabs
        :activeKey="componentsType"
        @change="onTabsChange"
        type="card"
        class="me-tab me-mb-3 me-mt-3"
      >
        <a-tab-pane :key="0" :tab="'全部采集' + getCounts('crawlSum')">
        </a-tab-pane>
        <a-tab-pane :key="1" :tab="'未认领' + getCounts('noClaimNum')">
        </a-tab-pane>
        <a-tab-pane :key="2" :tab="'已认领' + getCounts('claimNum')">
        </a-tab-pane>
        <a-tab-pane :key="3" :tab="'采集失败' + getCounts('crawlFailNum')">
        </a-tab-pane>
        <a-tab-pane
          v-if="labelListInfo && labelListInfo.length"
          :key="4"
          :tab="'我的分类' + '(' + labelListNum + ')'"
        >
        </a-tab-pane>
        <!-- 右上角统计 -->
        <div slot="tabBarExtraContent" v-if="crawlSetInterval">
          <b>当前页:</b> <span v-html="getCountItem"></span>
        </div>
      </a-tabs>
      <a-affix :offset-top="60" class="custom-affix">
        <div class="me-ma-0 me-mb-3">
          <a-space>
            <a-button
              @click="onBatchRetry"
              type="primary"
              v-if="componentsType != 4"
            >
              {{ $t('collect.batchRetry') }}
            </a-button>
            <a-button type="primary" @click="batchClaim()">
              {{ $t('collect.batchClaim') }}
            </a-button>
            <a-button @click="settingVisible = true" type="primary">
              {{ $t('goodsCollection.claimSetting') }}
            </a-button>
            <a-popover
              v-model="batchTagsVisible"
              trigger="click"
              placement="bottomLeft"
              @visibleChange="tagsVisibleChange"
            >
              <template slot="content">
                <ul class="me-tag-list">
                  <li v-for="(item, index) in tagsList" :key="item.id">
                    <b
                      class="me-tags-cb"
                      :class="{ 'me-cb-active': item.active }"
                      :style="{ background: '#' + item.labelColor }"
                      @click="selectTags(index)"
                    ></b
                    ><span
                      v-if="!item.isEdit"
                      @click="selectTags(index)"
                      @dblclick="editTagsName(index, true)"
                      >{{ item.labelName }}</span
                    ><a-input
                      v-else
                      class="me-tabsInput"
                      size="small"
                      @blur="editTagsName(index)"
                      :maxLength="20"
                      ref="tabsInput"
                      v-model="item.labelName"
                    />
                  </li>
                </ul>
                <div class="me-btn-popover">
                  <a-button
                    type="primary"
                    size="small"
                    @click="onLabelChange()"
                  >
                    确定
                  </a-button>
                  <a-button
                    @click="batchTagsVisible = false"
                    class="me-ml-2"
                    size="small"
                    >取消</a-button
                  >
                </div>
              </template>
              <a-button @click="batchTagsPopShow()" type="primary">
                批量添加标签
              </a-button>
            </a-popover>
            <a-button @click="onBatchDeletion">
              {{ $t('collect.batchDeletion') }}
            </a-button>
            <span v-if="selectedRows.length > 0" class="me-select-text">
              {{ $t('common.selected') }}
              <span class="me-f-red"> {{ selectedRows.length }}</span>
              {{ $t('common.dataRow') }}
            </span>
          </a-space>
        </div>
      </a-affix>

      <a-affix :offset-top="60" class="custom-affix" v-if="componentsType == 4">
        <div class="me-ma-0">
          <a-button
            class="me-mr-2 me-mb-2"
            :class="{ 'me-tags-active': index == activeIndex }"
            @click="changeTags(index)"
            v-for="(item, index) in labelListInfo"
            :key="item.labelNo"
            ><b
              class="me-color-ic"
              :style="{ background: '#' + item.labelColor }"
            ></b
            >{{ item.labelName }} ({{ item.productCount }})</a-button
          >
        </div>
      </a-affix>
      <div class="me-pt-0">
        <a-table
          :loading="tableLoading"
          :columns="columns"
          :data-source="dataSource"
          :row-selection="rowSelection"
          :pagination="getPagination"
          @change="changePage"
          rowKey="productGeneralId"
        >
          <template slot="name" slot-scope="text, record">
            <div class="product-info">
              <a-popover :title="null" placement="right">
                <template slot="content">
                  <img
                    style="width: 280px; height: 280px; border-radius: 2px"
                    v-lazy="
                      record.mainImgUrl == null ? defaultImg : record.mainImgUrl
                    "
                  />
                </template>
                <img
                  class="me-mr-2"
                  style="width: 80px; height: 80px; border-radius: 2px"
                  v-lazy="
                    record.mainImgUrl == null ? defaultImg : record.mainImgUrl
                  "
                />
              </a-popover>
              <!-- v-if="record.name"  -->
              <div v-if="record.name" class="info-text">
                <p>
                  <a
                    class="me-pt-1 name me-pl-1"
                    target="__blank"
                    :href="record.sourceUrl"
                  >
                    {{ record.name }}
                  </a>
                </p>
                <p class="me-soutu me-pl-1">
                  <span class="me-mr-5 me-fs12 me-status-skip">
                    商品来源：{{ record.sourceName }}
                  </span>
                  <a
                    class="action-item hand"
                    :href="comb1688ImageLink(record)"
                    target="blank"
                  >
                    <span class="me-tab me-fr me-fs12">
                      <i class="iconfont iconsousuo"></i> 1688搜图
                    </span>
                  </a>
                </p>
                <p v-if="record.productItemSku && record.syncStatus">
                  <span class="me-ml-1 me-mr-5 me-fs12 me-status-skip">
                    {{ $t('collect.masterSKU') }}：{{ record.productItemSku }}
                  </span>
                </p>
                <a-popover
                  v-model="record.tagsVisible"
                  trigger="click"
                  placement="topLeft"
                >
                  <template slot="content">
                    <ul class="me-tag-list">
                      <li v-for="(item, index) in tagsList" :key="item.id">
                        <b
                          class="me-tags-cb"
                          :class="{ 'me-cb-active': item.active }"
                          :style="{ background: '#' + item.labelColor }"
                          @click="selectTags(index)"
                        ></b
                        ><span
                          v-if="!item.isEdit"
                          @click="selectTags(index)"
                          @dblclick="editTagsName(index, true)"
                          >{{ item.labelName }}</span
                        ><a-input
                          v-else
                          class="me-tabsInput"
                          size="small"
                          @blur="editTagsName(index)"
                          :maxLength="20"
                          ref="tabsInput"
                          v-model="item.labelName"
                        />
                      </li>
                    </ul>
                    <div class="me-btn-popover">
                      <a-button
                        type="primary"
                        size="small"
                        @click="onLabelChange(record)"
                      >
                        确定
                      </a-button>
                      <a-button
                        @click="record.tagsVisible = false"
                        class="me-ml-2"
                        size="small"
                        >取消</a-button
                      >
                    </div>
                  </template>
                  <span class="me-add-tags" @click="tagsPopShow(record)">
                    <a-icon class="me-form-ic" type="form" />
                    <span class="me-em1 me-w50 me-mr-1"
                      >添加{{ $t('common.tag') }}
                    </span>
                  </span>
                </a-popover>
                <span
                  v-for="tags in record.productLabelList"
                  :key="tags.labelNo"
                >
                  <a-popover>
                    <template slot="content">
                      <p>{{ tags.labelName }}</p>
                    </template>
                    <b
                      class="me-color-ic"
                      :style="{ background: '#' + tags.labelColor }"
                    ></b>
                  </a-popover>
                </span>
              </div>
              <div
                class="ml-2"
                v-if="record.sourceUrl && !record.name"
                style="width: 100%"
              >
                <a
                  target="_blank"
                  :href="record.sourceUrl"
                  class="name overflow-text checked-word"
                >
                  {{ record.sourceUrl }}
                </a>
              </div>
            </div>
          </template>
          <!-- 来源价格 -->
          <div slot="price" slot-scope="text, record">
            <span v-if="record.hasVariation">
              <div>
                {{ record.currency }}
                {{ record.currency == undefined ? '-' : ':' }}
              </div>
              {{ record.priceRange }}
            </span>
            <span v-else>
              <div>
                {{ record.currency }}
                {{ record.currency == undefined ? '-' : ':' }}
              </div>
              {{ record.price }}</span
            >
          </div>
          <!-- 采集状态 -->
          <span slot="crawlTime" slot-scope="text, record">
            <p class="me-status" :class="getStatusClass(record)">
              {{ getStatusText(record) }}
            </p>
            <p>{{ record.crawlTime || record.createTime }}</p>
          </span>

          <span slot="claimStatus" slot-scope="text, record">
            <template v-if="record.status == 2">
              <div>
                {{ $t('collect.claimed') }}
                <div
                  v-for="(item, index) in alaimStores2(record.claimStoresArr)"
                  :key="index"
                >
                  <div class="text-ellipsis" v-if="index < 2" :title="item">
                    <p v-if="item.split('|')[0] == '2'">
                      <i
                        class="iconfont iconLAZADA"
                        style="color: rgb(239, 77, 45)"
                      ></i>
                      {{ item.split('|')[1] }}
                    </p>
                    <p v-else>
                      <i
                        class="iconfont iconshopee"
                        style="color: rgb(239, 77, 45)"
                      ></i>
                      {{
                        item.split('|')[1]
                          ? item.split('|')[1]
                          : item.split('|')[0]
                      }}
                    </p>
                  </div>
                </div>
                <a-popover :title="null">
                  <template slot="content">
                    <div v-html="allAlaimStores(record.claimStoresArr)"></div>
                  </template>
                  <span
                    class="hand"
                    v-if="alaimStores2(record.claimStoresArr).length > 2"
                    >更多</span
                  >
                </a-popover>
              </div>
            </template>
            <template v-else-if="record.status == 1">
              {{ $t('collect.unclaimed') }}
            </template>
            <template v-else> -- </template>
          </span>

          <span slot="operate" slot-scope="text, record">
            <!-- 采集成功 -->
            <template v-if="record.crawlStatus === 2">
              <router-link
                :to="
                  `/goods/edit?edit=0&id=${record.productGeneralId}&source=${$route.name}&sourcePath=${$route.path}`
                "
              >
                <a-button type="link">
                  {{ $t('common.edit') }}
                </a-button>
              </router-link>

              <a-button type="link" @click="onPush(record)">认领</a-button>
            </template>
            <a-button type="link" class="me-error" @click="onDelete(record)">
              {{ $t('common.delete') }}
            </a-button>
            <a-button
              v-if="[3, 4].includes(record.crawlStatus)"
              type="link"
              @click="onRetry(record)"
            >
              {{ $t('collect.retry') }}
            </a-button>
          </span>
        </a-table>
      </div>
    </a-layout>
    <!-- 认领到店铺 -->
    <ClaimToStore
      v-if="pushVisible"
      v-model="pushVisible"
      @submit="claimToStoreSubmit"
      ref="claimPop"
    ></ClaimToStore>

    <a-modal
      :visible="settingVisible"
      :maskClosable="false"
      destroyOnClose
      :bodyStyle="{ padding: 0 }"
      @cancel="settingCancel"
      width="90%"
      :footer="null"
    >
      <AcquisitionSettings @closeVisible="settingClose" setType="claimSet" />
    </a-modal>
  </div>
</template>

<script>
/**
 * 采集箱
 */
import Product from '@/api/product'
import Crawl from '@/api/crawl'
import tableMixins from '@/mixins/tableMixins'
import AcquisitionSettings from './components/goodsCollection/AcquisitionSettings'
import ClaimToStore from './components/collect/ClaimToStoreNew.vue'
import TableFilter from '@/components/tableFilter'
import moment from 'moment'
import { build1688SearchImgLink } from '@/util'
import Cnsc from '@/api/cnsc.js'
import { isDev } from '@/util'
import { uniq } from 'lodash'
const defaultImg = require('@/assets/images/default-img.png')
export default {
  mixins: [tableMixins],
  components: {
    AcquisitionSettings,
    ClaimToStore,
    TableFilter
  },
  data() {
    return {
      pushVisible: false, // 认领到店铺
      confirmLoading: false,
      clearSelectedRows: false,
      formItemLayout: {},
      searchForm: this.$form.createForm(this),
      // params: {},
      defaultImg: defaultImg,
      columns: [
        {
          dataIndex: 'name',
          title: this.$t('collect.name '),
          scopedSlots: { customRender: 'name' },
          key: 'name',
          width: 400
        },
        {
          dataIndex: 'stock',
          key: 'stock',
          title: '库存',
          width: 150
          // scopedSlots: { customRender: 'stock' }
        },
        {
          title: this.$t('collect.sourcePrice '),
          scopedSlots: { customRender: 'price' },
          dataIndex: 'price',
          width: 250
        },

        {
          title: this.$t('collect.time'),
          scopedSlots: { customRender: 'crawlTime' },
          dataIndex: 'crawlTime',
          width: 250
        },

        {
          title: this.$t('collect.claimStatus'),
          key: 'status',
          scopedSlots: { customRender: 'claimStatus' },
          width: 200
        },

        {
          title: this.$t('common.handler'),
          key: 'operate',
          scopedSlots: { customRender: 'operate' },
          align: 'left',
          fixed: 'right',
          width: 200
        }
      ],
      generalSourceList: [],
      crawlStatusList: [
        { label: this.$t('collect.collectionAll'), value: '' },
        { label: '等待采集', value: 0 },
        { label: this.$t('collect.collectionIng'), value: 1 },
        { label: this.$t('collect.collectionSuccess'), value: 2 },
        { label: this.$t('collect.collectionFail'), value: 3 },
        { label: this.$t('collect.collectionJump'), value: 4 }
      ],
      claimStatusOpts: [
        { label: this.$t('collect.unClaim'), value: 1 },
        { label: this.$t('collect.claimed'), value: 2 }
      ],
      platformList: [
        { label: 'Shopee', value: 1 },
        { label: 'Lazada', value: 2 }
      ],
      crawlSetInterval: null,
      settingVisible: false,
      componentsType: 0,
      counts: {
        claimNum: 0, // 已领数
        crawlFailNum: 0, // 采集失败数量
        crawlSum: 0, // 采集总数
        noClaimNum: 0 // 未认领数
      },
      searchList: {
        columns: null, // 排序字段
        status: null // 认领状态
      },
      searchParams: {
        name: null,
        sourceName: null,
        crawlStatus: null,
        claimStatus: null
      },
      labelModalInfo: {
        visible: false,
        current: null
      },
      tagsList: [
        {
          labelNo: 1,
          labelColor: 'd9001b',
          labelName: '标签1',
          active: false,
          isEdit: false
        },
        {
          labelNo: 2,
          labelColor: 'f59a23',
          labelName: '标签2',
          active: false,
          isEdit: false
        },
        {
          labelNo: 3,
          labelColor: 'ffff00',
          labelName: '标签3',
          active: false,
          isEdit: false
        },
        {
          labelNo: 4,
          labelColor: '95f204',
          labelName: '标签4',
          active: false,
          isEdit: false
        },
        {
          labelNo: 5,
          labelColor: '00ffff',
          labelName: '标签5',
          active: false,
          isEdit: false
        },
        {
          labelNo: 6,
          labelColor: '02a7f0',
          labelName: '标签6',
          active: false,
          isEdit: false
        },
        {
          labelNo: 7,
          labelColor: '0000ff',
          labelName: '标签7',
          active: false,
          isEdit: false
        },
        {
          labelNo: 8,
          labelColor: '8400ff',
          labelName: '标签8',
          active: false,
          isEdit: false
        },
        {
          labelNo: 9,
          labelColor: 'ce808d',
          labelName: '标签9',
          active: false,
          isEdit: false
        },
        {
          labelNo: 10,
          labelColor: 'facd91',
          labelName: '标签10',
          active: false,
          isEdit: false
        }
      ],
      labelListInfo: [],
      labelId: '',
      activeIndex: 0,
      batchTagsVisible: false
    }
  },
  async mounted() {
    Product.getGeneralSourceList().then(({ data }) => {
      this.generalSourceList = data.map((item) => {
        return { label: item, value: item }
      })
    })
    // this.$data.tableLoading = true
    // await this.loadData()
    // this.$data.tableLoading = false
    // let { data } = await Cnsc.getMerchantPublishable()
    // 采集数统计
    // this.getCountNum()
  },
  computed: {
    labelListNum() {
      let sum = 0
      sum = this.labelListInfo.reduce(function(total, currentValue) {
        return total + currentValue.productCount
      }, 0)
      return sum
    },
    getStatusClass() {
      return ({ crawlStatus }) => {
        if (crawlStatus === 1) return 'me-status-primary'
        if (crawlStatus === 2) return 'me-status-success'
        if (crawlStatus === 3) return 'me-status-error'
        return 'me-status-skip'
      }
    },
    getStatusTime() {
      return ({ updateTime }) => {
        if (updateTime) return updateTime
        return '--'
      }
    },
    getStatusText() {
      return ({ crawlStatus }) => {
        const statusOptions = {
          0: this.$t('collect.waitingCollect'),
          1: this.$t('collect.claimStatusInfo'),
          2: this.$t('collect.claimStatusSuccess'),
          3: this.$t('collect.claimStatusFail'),
          4: this.$t('collect.collectionJump')
        }
        return statusOptions[crawlStatus] || this.$t('collect.claimStatusSkip')
      }
    },

    getCount() {
      return (type) => {
        const typeOpts = {
          0: this.$t('collect.waitingCollect'),
          1: this.$t('collect.claimStatusInfo'),
          2: this.$t('collect.claimStatusSuccess'),
          3: this.$t('collect.claimStatusFail')
        }
        return {
          name: typeOpts[type],
          value: this.dataSource.filter((item) => item.crawlStatus == type)
            .length
        }
      }
    },
    // 当前页面每一项状态统计值
    getCountItem() {
      return Array.from({ length: 4 }, (v, k) => {
        return `<b class="${this.getStatusClass({ crawlStatus: k })}">${
          this.getCount(k).name
        }:${this.getCount(k).value}</b>`
      }).join('｜')
    },
    /**
     * 1688搜图链接组合
     */
    comb1688ImageLink() {
      return (item) => {
        if (item.mainImgUrl) {
          return build1688SearchImgLink(item.mainImgUrl)
        } else if (item.images) {
          let images = JSON.parse(item.images)
          return images.length > 0 ? build1688SearchImgLink(images[0]) : null
        } else {
          return null
        }
      }
    },
    //searchItem
    colItem({
      generalSourceList,
      crawlStatusList,
      claimStatusOpts,
      platformList
    }) {
      return [
        {
          itemType: 'input',
          label: this.$t('collect.searchFormProductTitle'),
          key: 'name',
          itemProp: {
            style: 'width:190px'
          }
        },
        {
          itemType: 'select',
          label: this.$t('collect.searchFormDataSources'),
          key: 'sourceName',
          itemProp: {
            style: 'width:190px'
          },
          itemData: generalSourceList
        },
        {
          itemType: 'select',
          label: this.$t('collect.searchFormAcquisitionStatus'),
          key: 'crawlStatus',
          itemProp: {
            style: 'width:190px'
          },
          itemData: crawlStatusList
        },
        {
          itemType: 'rengePicker',
          label: this.$t('collect.searchFormTimeRange'),
          key: 'claimTimeRange',
          itemProp: {
            style: 'width:190px'
          }
        },
        {
          itemType: 'select',
          label: '认领状态',
          key: 'claimStatus',
          itemProp: {
            style: 'width:190px'
          },
          itemData: claimStatusOpts
        },
        {
          itemType: 'select',
          label: '认领平台',
          key: 'crawlPlatform',
          itemProp: {
            style: 'width:190px'
          },
          itemData: platformList
        }
      ]
    }
  },
  methods: {
    //切换tags标签
    changeTags(index) {
      this.$data.activeIndex = index
      this.$data.labelId = this.$data.labelListInfo[index].id
      this.onSelectChange([], [])
      this.reLoadData()
    },
    //选中标签
    selectTags(index) {
      this.tagsList[index].active = !this.tagsList[index].active
    },
    //编辑标签名称
    editTagsName(index, flag) {
      this.tagsList[index].isEdit = !this.tagsList[index].isEdit
      if (flag) {
        this.tagsList[index].active = true
        setTimeout(() => {
          this.$refs.tabsInput[0].focus()
        }, 500)
      }
    },
    //标签改变事件
    async onLabelChange(row) {
      let params = {
        labelList: []
      }
      if (row) {
        //单个
        params.productGeneralId = row.productGeneralId
      } else {
        const { selectedRowKeys } = this.$data
        //批量
        params.productGeneralIds = selectedRowKeys
      }
      this.$data.tagsList.forEach((item) => {
        if (item.active) {
          let { labelName, labelColor, labelNo, id } = item
          params.labelList.push({ labelName, labelColor, labelNo, id })
        }
      })
      if (row) {
        await Product.labelChoose(params)
        row.tagsVisible = false
      } else {
        await Product.batchLabelChoose(params)
        this.batchTagsVisible = false
      }
      this.reLoadData()
    },
    //添加标签
    tagsPopShow(row) {
      this.labelListInfo.forEach((item) => {
        this.$data.tagsList.forEach((item2) => {
          item2.active = false
          if (item.labelNo == item2.labelNo) {
            item2 = Object.assign(item2, item)
          }
        })
      })
      if (row.productLabelList.length) {
        row.productLabelList.forEach((item) => {
          this.$data.tagsList.forEach((item2) => {
            if (item.labelNo == item2.labelNo) {
              item2 = Object.assign(item2, item, { active: true })
            }
          })
        })
      }
    },
    tagsVisibleChange() {
      const { selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.batchTagsVisible = false
      }
    },
    batchTagsPopShow() {
      const { selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.$message.warning('请选择需要添加标签的数据！')
        return
      }
      this.labelListInfo.forEach((item) => {
        this.$data.tagsList.forEach((item2) => {
          item2.active = false
          if (item.labelNo == item2.labelNo) {
            item2 = Object.assign(item2, item)
          }
        })
      })
    },
    //去重显示
    alaimStores2(claimStoresArr) {
      let arr = [claimStoresArr[0]]
      let store1 =
        claimStoresArr[0].split('|')[1] || claimStoresArr[0].split('|')[0]
      if (claimStoresArr.length > 1) {
        for (let i = 1; i < claimStoresArr.length; i++) {
          let store2 =
            claimStoresArr[i].split('|')[1] || claimStoresArr[i].split('|')[0]
          if (store1 != store2) {
            arr.push(claimStoresArr[i])
          }
        }
      }
      return arr
    },
    //更多认领店铺显示
    allAlaimStores(claimStoresArr) {
      let Shopee = []
      let Lazada = []
      let html = ''
      claimStoresArr.forEach((ele) => {
        let storeInfo = ele.split('|')
        if (storeInfo[0] == '2') {
          Lazada.push(storeInfo[1])
        } else {
          Shopee.push(storeInfo[1] || storeInfo[0])
        }
      })
      Shopee = uniq(Shopee)
      if (Shopee.length) {
        html += `Shopee`
        Shopee.forEach((ele) => {
          html += `<p class="me-pl-1"><i class="iconfont iconshopee iconShopeeMore"></i> ${ele}</p>`
        })
      }
      if (Lazada.length) {
        html += `Lazada`
        Lazada.forEach((ele) => {
          html += `<p class="me-pl-1"><i class="iconfont iconLazadaMore iconLazadaMore2"></i> ${ele}</p>`
        })
      }
      return html
    },
    /**
     * 加载初始化数据
     */
    async loadData(flag) {
      if (flag == 'delete') {
        if (this.$data.dataSource.length == 1) {
          this.$data.paginationData.current -= 1
        }
      }
      if (this.getTableDataBefore) await this.getTableDataBefore()
      try {
        const { data } = await this.getTableData()
        if (data.pageInfo) {
          this.$data.dataSource = data.pageInfo.records.map((ele) => {
            this.$set(ele, 'tagsVisible', false)
            return ele
          })
        } else {
          this.$data.dataSource = []
          this.$data.activeIndex = 100
        }
        this.$data.labelListInfo = data.labelList.filter(
          (item) => item.productCount
        )
        if (data.labelList) {
          data.labelList.forEach((item) => {
            this.$data.tagsList.forEach((item2) => {
              if (item.labelNo == item2.labelNo) {
                item2 = Object.assign(item2, item)
              }
            })
          })
        }
        if (this.getTableDataAfter) await this.getTableDataAfter()
        this.$data.paginationData = this.getPageFromResp(data.pageInfo)
      } catch (error) {
        console.error(error)
      } finally {
        // 如果有统计数，刷新统计数
        try {
          this.getCountNum()
        } catch (error) {
          console.log(error)
        }
      }
      return
    },
    //tabs的数字
    getCounts(label) {
      let { counts } = this.$data
      return counts[label] == 0 ? '' : `(${counts[label]})`
    },
    getCountNum() {
      Product.generalcounts().then(({ data }) => {
        this.$data.counts = data
      })
    },
    getTableData() {
      const { searchParams, labelId, labelListInfo } = this.$data
      const { size, current } = this.$data.paginationData
      let crawlTimeStart = null
      let crawlTimeEnd = null
      if (searchParams.claimTimeRange && searchParams.claimTimeRange.length) {
        crawlTimeStart = searchParams.claimTimeRange[0] //moment(params.claimTimeRange[0]).format('YYYY-MM-DD')
        crawlTimeEnd = searchParams.claimTimeRange[1] //moment(params.claimTimeRange[1]).format('YYYY-MM-DD')
      }
      let pageParams = {
        size,
        current,
        crawlTimeStart,
        crawlTimeEnd,
        ...searchParams
      }
      delete pageParams.claimTimeRange
      if (this.componentsType == 4) {
        return Product.getPageLabel({
          size,
          current,
          labelId: labelId ? labelId : labelListInfo[0].id
        })
      } else {
        return Product.getGeneralPage(pageParams)
      }
      // let sourceName = params.sourceName
      // let name = params.name
      // let crawlStatus = params.crawlStatus
      // let status = params.status || null
      // let columns = params.columns || null
      // return Product.getGeneralPage({
      //   size,
      //   current,
      //   name,
      //   crawlTimeStart,
      //   crawlTimeEnd,
      //   sourceName,
      //   crawlStatus,
      //   columns,
      //   status
      // })
    },
    async getTableDataAfter() {
      // 处理来源价格
      await this.handlePrice()
      const get = async () => {
        const { dataSource } = this.$data
        const status = dataSource.map(({ crawlStatus }) => crawlStatus > 1)
        if (status.every(Boolean)) {
          clearInterval(this.crawlSetInterval)
          return
        }
        this.loadData()
      }
      // 判断定时是否开启
      if (!this.crawlSetInterval && !isDev) {
        this.crawlSetInterval = setInterval(get, 3000)
      }
      this.$data.dataSource = this.$data.dataSource.map((ele) => {
        var images = JSON.parse(ele.images)
        if (images && images.length) {
          ele.mainImgUrl = ele.mainImgUrl ? ele.mainImgUrl : images[0]
        }
        return ele
      })
      // 如果有统计数，刷新统计数
      // this.getCountNum()
    },
    async handlePrice() {
      Promise.all(
        this.dataSource.map((val) => {
          val.claimStoresArr =
            val.status == 2 ? JSON.parse(val.claimStores) : []
          if (val.hasVariation && val.crawlStatus == 2) {
            let variantArr = val.variantsJson
              ? JSON.parse(val.variantsJson)
              : JSON.parse(val.variant)
            const key = val.variantsJson ? 'price' : 'Price'
            const arr = variantArr.sort(
              (a, b) => Number(a[key]) - Number(b[key])
            )
            if (arr[0][key] !== arr[arr.length - 1][key]) {
              val.priceRange =
                Number(arr[0][key]).toFixed(2) +
                ' ~ ' +
                Number(arr[arr.length - 1][key]).toFixed(2)
            } else {
              val.priceRange = Number(arr[0][key]).toFixed(2)
            }
          }
        })
      )
    },
    onSearch() {
      this.$data.searchList.status = this.searchParams.claimStatus
      // this.$data.searchForm.validateFields().then((params) => {
      this.searchParams = Object.assign(this.searchParams, this.searchList)
      this.onSelectChange([], [])
      this.reLoadData()
      // })
    },

    // 认领店铺查看更多
    showMoreStore(rowIndex) {
      this.$set(this.dataSource[rowIndex], 'claimStoreMoreVisible', true)
      ;[...this.$refs['claimStoreNode' + rowIndex].children].map((el) => {
        el.style.display = 'revert'
      })
    },

    //认领到店铺或商户
    onPush(product) {
      this.onSelectChange([product.productGeneralId], [product])

      this.$data.pushVisible = true
    },
    //删除
    onDelete(productGeneral) {
      this.onSelectChange([productGeneral.productGeneralId], [productGeneral])
      this.onBatchDeletion()
    },
    //同步到本地SKU
    onAsyncSKU(product) {
      if (product.syncStatus === 1) {
        this.$message.warning(this.$t('collect.batchSyncNotRepeatable'))
        return
      }
      this.onSelectChange([product.productGeneralId], [product])
      this.batchAsync()
    },

    // 认领到店铺
    async claimToStoreSubmit(obj) {
      const { selectedRowKeys } = this
      let total = 0
      try {
        if (obj.storeIds.length) {
          const { data } = await Product.handleBatchClaim({
            isAutoMatch: obj.isAutoMatch,
            storeIds: obj.storeIds,
            productIds: selectedRowKeys
          })
          total = data.map(({ result }) => result).filter(Boolean).length
        }
        if (obj.cnscIds.length) {
          const { data } = await Cnsc.handleBatchClaimToCnscMerchant({
            isAutoMatch: obj.isAutoMatch,
            merchantIds: obj.cnscIds,
            productIds: selectedRowKeys
          })
          total = data.map(({ result }) => result).filter(Boolean).length
        }
        this.$message.success(this.$t('collect.claimSuccess', { total }))
        this.confirmLoading = false
        this.pushVisible = false
        this.onSelectChange([], [])
        // this.reLoadData()
        this.loadData()
      } catch (err) {
        this.$refs.claimPop.loading = false
      }
    },

    onCancel() {
      this.$data.pushVisible = false
      this.$data.confirmLoading = false
    },
    /**
     * 重置搜索
     */
    resetSearch() {
      // this.$data.searchForm.resetFields()
      // this.$data.searchForm.validateFields().then((params) => {
      //   this.$data.params = Object.assign({}, params)
      this.$data.componentsType = 0
      this.$data.searchParams = {
        name: null,
        sourceName: null,
        crawlStatus: null,
        claimStatus: null
      }
      this.onSelectChange([], [])
      this.reLoadData()
      // })
    },
    /**
     * 批量删除
     */
    onBatchDeletion() {
      const { selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.$message.warn(this.$t('common.handlerLimit'))
        return
      }
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          await Product.handleBatchDelete({ productIds: selectedRowKeys })
          this.$message.success(this.$t('common.handlerSuccess'))
          this.onSelectChange([], [])
          this.loadData('delete')
        }
      })
    },
    /**
     * 批量重试
     */
    async onBatchRetry() {
      const { selectedRows } = this.$data
      let productGeneralIds = selectedRows
        .filter((el) => [3, 4, 5, 6].includes(el.crawlStatus))
        .map((el) => el.productGeneralId)
      if (productGeneralIds.length == 0) {
        this.$message.error(this.$t('collect.retryDataError'))
        return
      }

      let params = {
        productGeneralIds: productGeneralIds
      }
      this.$confirm({
        title: this.$t('common.message'),
        content: this.$t('common.retryConfirm'),
        onOk: () => {
          Crawl.handCrawlRetry(params).then((res) => {
            if (res.code == 0) {
              this.successAlert(this.$t('common.handlerSuccess'))
              this.onSelectChange([], [])
              this.reLoadData()
            }
          })
        }
      })
    },

    /**
     * 批量认领
     * @params type store普通店铺 merchant cnsc商户
     */
    batchClaim(type) {
      const { selectedRows } = this.$data
      let productGeneralIds = selectedRows
        .filter((el) => el.crawlStatus === 2)
        .map((el) => el.productGeneralId)
      let UnproductGeneralIds = selectedRows
        .filter((el) => el.crawlStatus != 2)
        .map((el) => el.productGeneralId)
      if (UnproductGeneralIds.length > 0) {
        this.$message.error(this.$t('批量认领只能勾选【采集成功】的数据'))
        return
      }
      if (productGeneralIds.length == 0) {
        this.$message.error(this.$t('collect.claimDataError'))
        return
      }

      this.$data.pushVisible = true
    },
    /**
     * 批量同步到本地SKU
     */
    batchAsync() {
      const { selectedRows } = this.$data
      let productGeneralIds = selectedRows
        .filter((el) => el.crawlStatus === 2)
        .map((el) => el.productGeneralId)
      if (productGeneralIds.length == 0) {
        this.$message.error(this.$t('collect.asyncDataError'))
        return
      }

      let length = productGeneralIds.length
      this.$confirm({
        title: this.$t('collect.asyncProductToStock', { count: length }),
        content: this.$t('collect.asyncProductToStockMessage'),
        onOk: async () => {
          const ids = selectedRows
            .filter(
              ({ syncStatus, crawlStatus }) =>
                syncStatus !== 1 && crawlStatus === 2
            )
            .map(({ productGeneralId }) => productGeneralId)
          const { data } = await Product.syncStockSku(ids)
          const count = data.map(({ result }) => result).length
          let message = this.$t('collect.asyncProductToBefor', { count })
          this.$message.success(message)
          this.loadData()
          return
        }
      })
    },
    /**
     * 重试
     */
    onRetry({ productGeneralId }) {
      let param = {
        productGeneralIds: [productGeneralId]
      }
      this.$confirm({
        title: this.$t('common.message'),
        content: this.$t('common.retryConfirm'),
        onOk: () => {
          Crawl.handCrawlRetry(param).then((res) => {
            if (res.code == 0) {
              this.successAlert(this.$t('common.handlerSuccess'))
              this.reLoadData()
            }
          })
        }
      })
    },
    /**
     * 采集设置取消
     */
    settingCancel() {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('goodsCollection.confirmContent1'),
        onOk: () => {
          this.$data.settingVisible = false
        }
      })
    },
    settingClose() {
      this.$data.settingVisible = false
    },
    /**
     * 分页改变
     */
    changePage({ pageSize, current }) {
      this.$data.paginationData = {
        ...this.$data.paginationData,
        size: pageSize,
        current
      }
      this.onSelectChange([], [])
      this.loadData()
    },
    /**tab切换 */
    onTabsChange(key) {
      this.$data.componentsType = key
      this.$data.activeIndex = 0
      this.searchList = {
        columns: undefined, // 排序字段
        status: undefined // 认领状态
      }
      // this.$data.searchForm.setFieldsValue({
      //   crawlStatus: undefined
      // })
      this.searchParams.crawlStatus = undefined
      switch (key) {
        case 0: //全部采集
          this.searchList.status = ''
          this.searchParams.claimStatus = ''
          break
        case 1: //未认领
          this.searchList.status = 1
          this.searchParams.claimStatus = 1
          break
        case 2: //已认领
          this.searchList = {
            columns: 'claimTime', // 排序字段
            status: 2 // 认领状态
          }
          this.searchParams.claimStatus = 2
          break
        case 3: //采集失败
          // this.$data.searchForm.setFieldsValue({
          //   crawlStatus: 3
          // })
          this.searchList.status = ''
          this.searchParams.claimStatus = ''
          this.searchParams.crawlStatus = 3
          break
        default:
          break
      }
      this.onSearch(key)
    }
  },
  beforeDestroy() {
    //清除定时器
    clearInterval(this.crawlSetInterval)
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/mixins.scss';
.iconfont {
  &.iconjuxing1 {
    font-size: 20px;
    cursor: pointer;
  }
}

.overflow-text {
  @include ellipsisMultiline(2);
  word-wrap: break-word;
  word-break: break-all;
}
.selectText {
  margin-left: 10px;
  .me-f-red {
    color: red;
  }
}

.claim-status-content {
  li:nth-child(n + 3) {
    display: none;
  }
  .more {
    cursor: pointer;
    color: $primaryColor;
  }
}
.me-tab {
  height: 40px;
}
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
  white-space: nowrap;
}
.me-soutu {
  .me-tab {
    color: #bd8863;
    border: 1px solid #ffe4c7;
    height: 21px;
    background: #fdf6ec;
    border-radius: 1px;
    line-height: 19px;
    padding: 0px 3px;
    .iconfont {
      font-size: 11px;
    }
    &:hover {
      background: #bd8863;
      color: #fff;
    }
  }
}
.product-info {
  display: grid;
  grid-template-columns: 80px 1fr;

  .info-text {
    padding: 0 10px;
    max-width: 320px;

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
    .me-tab {
      color: #bd8863;
      border: 1px solid #ffe4c7;
      height: 21px;
      background: #fdf6ec;
      border-radius: 1px;
      line-height: 19px;
      padding: 0px 3px;
      .iconfont {
        font-size: 11px;
      }
      &:hover {
        background: #bd8863;
        color: #fff;
      }
    }
  }
}

.iconLAZADA {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url('../../assets/images/laz.png');
  background-size: cover;
  position: relative;
  top: 6px;
  left: 2px;
  background-color: #0304b1;
  border-radius: 4px;
  &:before {
    opacity: 0;
  }
}
.me-add-tags {
  font-size: 12px;
  cursor: pointer;
  position: relative;
  top: -1px;
  padding-left: 5px;
}
.me-tag-list {
  min-height: 235px;
  li {
    min-width: 150px;
    min-height: 24px;
    cursor: pointer;
  }
}
.me-tags-cb {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 1px solid #fff;
  margin-right: 5px;
  margin-top: 3px;
  vertical-align: top;
}
.me-cb-active {
  border-color: #000;
  box-shadow: 2px 2px 3px #999;
}
.me-tabsInput {
  width: 130px;
  position: relative;
  top: -1px;
}
.me-btn-popover {
  margin-top: 10px;
  text-align: center;
}
.me-color-ic {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 3px;
}
.me-tags-active {
  color: #ff8e61;
  background-color: #fff;
  border-color: #ff8e61;
}
</style>
<style>
.iconShopeeMore {
  color: rgb(239, 77, 45) !important;
}
.iconLazadaMore {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url('../../assets/images/laz.png');
  background-size: cover;
  position: relative;
  top: 6px;
  left: 2px;
  background-color: #0304b1;
  border-radius: 4px;
}
.iconLazadaMore:before {
  opacity: 0;
}
.iconLazadaMore2 {
  top: 3px;
  left: 0;
}
</style>
