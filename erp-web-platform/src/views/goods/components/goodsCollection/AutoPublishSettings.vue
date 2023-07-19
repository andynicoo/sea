<template>
  <div class="publish-setting">
    <a-tabs
      v-if="storeData && storeList.length > 0"
      v-model="storeSize"
      @change="tabsChange"
      :animated="false"
    >
      <a-tab-pane v-for="(value, name) in storeData" :key="name">
        <div
          slot="tab"
          :style="{ paddingRight: (value.count > 0 ? 25 : 0) + 'px' }"
        >
          <a-badge :count="value.count" :offset="[20, 8]">
            {{ shopeeSite[name] }}
          </a-badge>
        </div>
        <h3>{{ $t('goodsCollection.autoPublishSet1') }}</h3>
        <a-table
          class="me-mb-4"
          rowKey="storeId"
          :columns="columns"
          :pagination="false"
          :scroll="{ y: 260 }"
          :data-source="value.storeConfigs"
        >
          <div slot="storeNameTitle">
            {{ $t('goodsCollection.autoPublishSet3') }}
            （<span class="operationBtn" @click="createStoreClick(value)">{{
              $t('goodsCollection.autoPublishSet4')
            }}</span
            >）
          </div>
          <div slot="logisticsTitle">
            <span class="me-handler-red">*</span>
            {{ $t('goodsCollection.autoPublishSet5') }}
          </div>
          <div slot="categoryTitle">
            <span class="me-handler-red">*</span>
            {{ $t('goodsCollection.autoPublishSet6') }}
            （<span class="operationBtn" @click="setCategoryAllClick(value)">{{
              $t('goodsCollection.autoPublishSet7')
            }}</span
            >）
          </div>
          <template v-slot:operationTitle>
            <div>
              {{ $t('goodsCollection.columnOperationSlot') }}
              （<span class="operationBtn" @click="allDelClick">{{
                $t('goodsCollection.autoPublishSet8')
              }}</span
              >）
            </div>
          </template>
          <div slot="categoryNames" slot-scope="text, record">
            <a-cascader
              @change="
                (value, selectedOptions) =>
                  onCategoryChange(value, selectedOptions, record)
              "
              :options="value.categoryList"
              :placeholder="$t('collect.pselectedType')"
              v-model="record.categoryIds"
              :fieldNames="{
                label: 'label',
                value: 'categoryId',
                children: 'children'
              }"
            >
              <div v-if="record.categoryNames" class="operationBtn me-text-oh">
                <a-tooltip :title="record.categoryNames">
                  {{ record.categoryNames }}
                </a-tooltip>
              </div>
              <span v-else class="operationBtn">{{
                $t('goodsCollection.autoPublishSet12')
              }}</span>
            </a-cascader>
          </div>
          <!-- <div slot="discount" slot-scope="text, record">
            <div v-if="record.discountId">
              <a-tooltip
                v-if="record.discountName && record.discountName.length > 12"
                :key="record.discountName"
                :title="record.discountName"
              >
                <span
                  @click="selectDiscountClick(record)"
                  class="operationBtn me-mr-3"
                >
                  {{ `${record.discountName.slice(0, 12)}...` }}
                </span>
              </a-tooltip>
              <span
                v-else
                @click="selectDiscountClick(record)"
                class="operationBtn me-mr-3"
              >
                {{ record.discountName }}
              </span>
              <a-input
                class="me-suffix-price-input me-w80 "
                v-model="record.discount"
                v-positiveNumber="{ minNum: 0.01, fixedNum: 2 }"
                :suffix="$t('goodsCollection.autoPublishSet10')"
              />
            </div>
            <span
              v-else
              @click="selectDiscountClick(record)"
              class="operationBtn"
            >
              {{ $t('goodsCollection.autoPublishSet9') }}
            </span>
          </div> -->
          <div slot="logistics" slot-scope="text, record">
            <div
              v-if="record.logistics && record.logistics.length > 0"
              class="operationBtn me-text-oh"
              @click="selectLogisticsClick(record)"
            >
              <a-tooltip :title="record.logisticsStr">
                {{ record.logisticsStr }}
              </a-tooltip>
            </div>
            <span
              v-else
              @click="selectLogisticsClick(record)"
              class="operationBtn"
            >
              {{ $t('goodsCollection.autoPublishSet11') }}
            </span>
          </div>

          <div slot="operation" slot-scope="text, record, index">
            <a-button
              :disabled="
                record.defaultTemplate === 1 || record.defaultTemplate === true
              "
              type="danger"
              size="small"
              @click="onDelete(index)"
            >
              {{ $t('common.delete') }}
            </a-button>
          </div>
        </a-table>
        <h3>
          {{ shopeeSite[name] }}
          {{ $t('goodsCollection.autoPublishSet13') }}
          <span>({{ $t('goodsCollection.autoPublishSet14') }})</span>
        </h3>
        <div class="push-set">
          <div>
            <div class="line">
              <span>{{ $t('goodsCollection.autoPublishSet15') }}</span>
              <div>
                <a-radio-group v-model="value.issueTimeType" :name="'time'">
                  <a-radio :value="0">
                    {{ $t('goodsCollection.autoPublishSet16') }}
                  </a-radio>
                  <a-radio :value="1">
                    {{ $t('goodsCollection.autoPublishSet17') }}
                  </a-radio>
                </a-radio-group>
                <div class="me-mt-2">
                  <a-date-picker
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                    v-if="value.issueTimeType === 1"
                    v-model="value.issueTime"
                    :disabled-date="disabledDate"
                    show-time
                  >
                    <template slot="renderExtraFooter">
                      <span class="me-handler-red">{{
                        $t('goodsCollection.autoPublishSet18')
                      }}</span>
                    </template>
                  </a-date-picker>
                </div>
              </div>
            </div>
            <div class="line">
              <span>{{ $t('goodsCollection.autoPublishSet19') }}</span>
              <a-tooltip :title="$t('goodsCollection.tooltipTitle14')">
                <a-input
                  class="me-suffix-price-input item-content me-w120"
                  v-model="value.packageWeight"
                  v-positiveNumber="{ minNum: 0.01, fixedNum: 2 }"
                  suffix="KG"
                />
              </a-tooltip>
            </div>
          </div>
          <div>
            <!-- <div class="line">
              <span>存储图片</span>
              <a-checkbox v-model="value.addPictureSpace">
                添加到图片空间
              </a-checkbox>
            </div> -->
            <div class="line">
              <span>{{ $t('goodsCollection.autoPublishSet20') }}</span>
              <a-select v-model="value.autoTranslate" style="width: 120px">
                <a-select-option :value="0">
                  {{ $t(value.lang) }}
                </a-select-option>
                <a-select-option :value="1">
                  {{ $t('goodsCollection.autoPublishSet21') }}
                </a-select-option>
                <a-select-option :value="2">
                  {{ $t('goodsCollection.autoPublishSet22') }}
                </a-select-option>
              </a-select>
            </div>
            <div class="line">
              <span>{{ $t('goodsCollection.autoPublishSet23') }}</span>
              <div>
                <a-checkbox
                  :checked="value.preventRepeatedCharacter"
                  @change="
                    preventRepeatedChange(
                      $event,
                      value,
                      'preventRepeatedCharacter'
                    )
                  "
                  >{{ $t('goodsCollection.autoPublishSet24') }}</a-checkbox
                >
                <a-checkbox
                  :checked="value.preventRepeatedImage"
                  @change="
                    preventRepeatedChange($event, value, 'preventRepeatedImage')
                  "
                  >{{ $t('goodsCollection.autoPublishSet25') }}</a-checkbox
                >
                <p class="me-handler-red me-mt-2">
                  *{{ $t('goodsCollection.autoPublishSet26') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <div v-else>
      <a-empty :image="simpleImage" class="me-pa-4">
        <div slot="description">
          <p>{{ $t('goodsCollection.autoPublishSet43') }}</p>
          <p>
            {{ $t('goodsCollection.autoPublishSet44') }}
            <router-link to="/store" class="operationBtn">
              <button>{{ $t('goodsCollection.autoPublishSet45') }}</button>
            </router-link>
            {{ $t('goodsCollection.autoPublishSet46') }}
          </p>
        </div>
      </a-empty>
    </div>
    <!-- 选择店铺 -->
    <a-modal
      :visible="storeVisible"
      :maskClosable="false"
      :title="$t('goodsCollection.claimSettingTitle8')"
      @ok="storeVisibleOk"
      @cancel="storeVisible = false"
      destroyOnClose
      width="70%"
    >
      <StoreTableModal
        ref="storeTable"
        :selectedKeys="storeIds"
        :isBasicStore="true"
        :list="storeList"
      />
    </a-modal>
    <!-- 选择折扣活动 -->
    <a-modal
      :visible="discountVisible"
      :maskClosable="false"
      :title="$t('goodsCollection.autoPublishSet28')"
      @ok="discountVisibleOk"
      @cancel="discountVisible = false"
      destroyOnClose
      width="60%"
    >
      <DiscountList ref="discountList" :storeItem="storeItem" />
    </a-modal>
    <!-- 选择物流 -->
    <a-modal
      :visible="logisticsVisible"
      :maskClosable="false"
      :title="$t('goodsCollection.autoPublishSet11')"
      @ok="logisticsVisibleOk"
      @cancel="logisticsVisible = false"
      destroyOnClose
      :width="600"
    >
      <LogisticList
        :list="logisticsList"
        ref="logisticList"
        :selectList="storeItem.logistics"
      />
    </a-modal>
    <!-- 选择类目 -->
    <a-modal
      :visible="categoryVisible"
      :maskClosable="false"
      :title="$t('goodsCollection.autoPublishSet29')"
      @ok="categoryVisibleOk"
      @cancel="categoryVisible = false"
      destroyOnClose
      :width="500"
    >
      <a-cascader
        @change="
          (value, selectedOptions) =>
            onCategoryChange(value, selectedOptions, categoryAllData)
        "
        :options="categoryVisibleList"
        :placeholder="$t('collect.pselectedType')"
        :fieldNames="{
          label: 'label',
          value: 'categoryId',
          children: 'children'
        }"
        style="width: 100%"
      />
    </a-modal>
  </div>
</template>

<script>
import { createTree, isEmpty } from '@/util'
import Goods from '@/api/goods'
import Order from '@/api/order'
import DiscountList from './DiscountList'
import LogisticList from './LogisticList'
import moment from 'moment'
import { merge, cloneDeep } from 'lodash'
import { Empty } from 'ant-design-vue'
import { positiveNumber } from '@/directive/number'
import StoreTableModal from '../StoreTableModal'
import { mapState } from 'vuex'

// 各个站点的语种
const COUNTRY_LANG = {
  ID: 'common.lang2',
  PH: 'common.flblish',
  MY: 'common.lang1',
  TH: 'common.lang3',
  VN: 'common.lang4',
  BR: 'common.lang5',
  TW: 'common.lang6',
  SG: 'common.english'
}

export default {
  components: {
    DiscountList,
    LogisticList,
    StoreTableModal
  },
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  directives: {
    positiveNumber
  },
  computed: {
    ...mapState({
      basicStoreList: (state) => state.auth.basicStoreList
    })
  },
  data() {
    return {
      storeSize: '',
      storeData: {},
      shopeeSite: this.$store.getters.site,
      storeList: [],
      storeVisible: false,
      storeIds: [],
      columns: [
        {
          dataIndex: 'storeName',
          key: 'storeName',
          slots: { title: 'storeNameTitle' },
          width: '25%'
        },
        {
          key: 'categoryId',
          slots: { title: 'categoryTitle' },
          scopedSlots: { customRender: 'categoryNames' },
          width: '35%'
        },
        // {
        //   title: this.$t('goodsCollection.autoPublishSet30'),
        //   key: 'discount',
        //   scopedSlots: { customRender: 'discount' }
        // },
        {
          key: 'logistics',
          width: '25%',
          slots: { title: 'logisticsTitle' },
          scopedSlots: { customRender: 'logistics' }
        },
        {
          key: 'operation',
          slots: { title: 'operationTitle' },
          scopedSlots: { customRender: 'operation' },
          width: '15%'
        }
      ],
      discountVisible: false,
      logisticsVisible: false,
      logisticsList: [],
      storeItem: {},
      categoryIdsRules: [],
      categoryVisible: false,
      categoryVisibleList: [],
      categoryAllData: {},
      storeConfigData: []
    }
  },
  mounted() {
    this.getDataAll()
  },
  methods: {
    //获取所有可用店铺
    async getStoreAllStore(data) {
      let obj = {}
      await Promise.all(
        data.map((item, index) => {
          if (index === 0) {
            this.storeSize = item.countryCode
          }
          item.storeAlias ??= ''
          if (isEmpty(obj[item.countryCode]) && item.authorizedStatus === 1) {
            obj[item.countryCode] = {}
            obj[item.countryCode].list = [item]
            obj[item.countryCode].lang = COUNTRY_LANG[item.countryCode]
          } else if (item.authorizedStatus === 1) {
            obj[item.countryCode].list.push(item)
          }
        })
      )
      // obj[this.storeSize].categoryList = await this.getShopeeCategoryList(this.storeSize)
      return obj
    },
    // 获取用户--自动发布设置信息
    getDataAll() {
      if (isEmpty(this.basicStoreList)) {
        return
      }
      // authorizedStatus: 1   // 授权状态 0无效 1有效
      Goods.getProductReleaseTemplateAll().then(async ({ data }) => {
        let storeData = await this.getStoreAllStore(this.basicStoreList)
        await Promise.all(
          data.map((val) => {
            if (!isEmpty(storeData[val.countryCode])) {
              if (val.storeConfigs && Array.isArray(val.storeConfigs)) {
                val.storeConfigs.map(async (items) => {
                  let logisticNameArr = []
                  if (items.logistics && Array.isArray(items.logistics)) {
                    await Promise.all(
                      items.logistics.map((item) => {
                        let str = item.isFree
                          ? '(' +
                            this.$t('goodsCollection.autoPublishSet31') +
                            ')'
                          : ''
                        logisticNameArr.push(item.logisticName + str)
                      })
                    )
                  }
                  items.logisticsStr = logisticNameArr.join(', ') || ''
                  const currentShop = this.basicStoreList.filter(
                    (sto) => sto.storeId === items.storeId
                  )[0]
                  items['shopId'] = items.shopId
                    ? items.shopId
                    : currentShop.platformId
                })
                storeData[val.countryCode].count = val.storeConfigs.length
              }
              storeData[val.countryCode] = Object.assign(
                storeData[val.countryCode],
                val
              )
            }
          })
        )
        storeData[
          this.storeSize
        ].categoryList = await this.getShopeeCategoryList(this.storeSize)
        this.storeData = storeData
        this.storeList = storeData[this.storeSize]?.list || []
        // this.storeList = this.storeListAll.filter(
        //   (item) => item.countryCode === this.storeSize
        // )
      })
    },
    async tabsChange(e) {
      // 获取每个站点类目
      let list = await cloneDeep(this.storeData[e].categoryList)
      list ??= await this.getShopeeCategoryList(e)
      this.$set(this.storeData[e], 'categoryList', list)
    },
    createStoreClick(item) {
      this.storeList = item.list.filter(
        (item) => item.countryCode === this.storeSize
      )
      this.storeIds = item.storeConfigs?.map((item) => item.storeId) || []
      this.storeVisible = true
    },
    // 选择店铺导入
    storeVisibleOk() {
      const storeIds = this.$refs.storeTable.selectedRowKeys
      const arr = this.storeList
        .filter((item) => storeIds.includes(item.storeId))
        .map((item) => {
          return {
            storeName: item.storeName,
            storeId: item.storeId,
            shopId: item.platformId
          }
        })
      this.$set(this.storeData[this.storeSize], 'storeConfigs', arr)
      this.$set(this.storeData[this.storeSize], 'count', arr.length)
      this.storeVisible = false
    },
    // 防重功能change
    preventRepeatedChange(e, item, key) {
      const value = e.target.checked
      this.$set(this.storeData[this.storeSize], key, value)
    },

    // 禁用时间
    disabledDate(current) {
      return current && current < moment().startOf('minute')
    },
    // 全部移除店铺列表
    allDelClick() {
      this.storeData[this.storeSize].storeConfigs = []
      this.storeData[this.storeSize].count = 0
    },
    // 单个删除店铺
    onDelete(index) {
      this.storeData[this.storeSize].storeConfigs.splice(index, 1)
      this.storeData[this.storeSize].count = this.storeData[
        this.storeSize
      ].storeConfigs.length
    },
    // 选择折扣活动
    async selectDiscountClick(item) {
      this.storeItem = item
      this.discountVisible = true
    },
    discountVisibleOk() {
      const data = this.$refs.discountList.radioCheckedData
      this.discountVisible = false
      this.storeItem.discountId = data.id
      this.storeItem.discountName = data.name
    },
    // 选择物流 获取店铺物流信息
    async selectLogisticsClick(item) {
      this.logisticsList = []
      const { data } = await Order.handleSyncLogisticsV2({
        storeId: item.storeId,
        shopId: item.shopId
      })
      this.storeItem = item
      let list = cloneDeep(data)
      if (item.logistics && Array.isArray(item.logistics)) {
        const logisticIdArr = item.logistics.map((val) => val.logisticId)
        let arr = merge([], item.logistics)
        await Promise.all(
          list.map((val) => {
            if (!logisticIdArr.includes(val.logisticId)) {
              arr.push(val)
            }
          })
        )
        list = arr
      }
      this.logisticsList = list
      this.logisticsVisible = true
    },
    // 导入物流
    logisticsVisibleOk() {
      this.$refs.logisticList.submit().then(async (res) => {
        let logisticNameArr = []
        const data = await Promise.all(
          res.map((item) => {
            let str = item.isFree
              ? '(' + this.$t('goodsCollection.autoPublishSet31') + ')'
              : ''
            logisticNameArr.push(item.logisticName + str)
            return {
              logisticId: item.logisticId,
              logisticName: item.logisticName,
              enabled: item.enabled,
              isFree: item.isFree,
              sizeId: item.sizeId
            }
          })
        )
        this.logisticsVisible = false
        this.storeItem.logistics = data
        this.storeItem.logisticsStr = logisticNameArr.join(', ') || ''
      })
    },
    // 获取类目
    async getShopeeCategoryList(code) {
      this.categoryList = null
      let { data } = await Goods.getCategoryListV2({ countryCode: code })
      data = data.map((e) => {
        e.label = `${e.cnName}`
        e.isLeaf = !e.hasChildren
        return e
      })
      let list = await createTree(data || [], 'categoryId')
      return list
    },
    /**
     * 店铺类目改变事件
     */
    onCategoryChange(e, options, item) {
      const params = {
        shopId: item.shopId,
        categoryIds: e
      }
      Goods.chooseCategory(params).then((res) => {
        console.log(res)
      })
      this.$set(item, 'categoryIds', e)
      this.$set(item, 'categoryId', e[e.length - 1])
      const categoryNames = options.map((e) => `${e.cnName}`).join('/')
      this.$set(item, 'categoryNames', categoryNames)
    },
    // 设置全部类目
    setCategoryAllClick(items) {
      if (!items.storeConfigs || items.storeConfigs.length === 0) {
        this.errorAlert(this.$t('goodsCollection.autoPublishSet32'))
        return
      }
      this.categoryVisible = true
      this.categoryVisibleList = items.categoryList
      this.storeConfigData = items.storeConfigs || []
      this.categoryAllData = {}
    },
    categoryVisibleOk() {
      if (!isEmpty(this.categoryAllData)) {
        this.storeConfigData.map((val) => {
          val.categoryIds = this.categoryAllData.categoryIds
          val.categoryId = this.categoryAllData.categoryId
          val.categoryNames = this.categoryAllData.categoryNames
        })
      }

      this.categoryVisible = false
    },
    async submit() {
      // 过滤空店铺
      let list = []
      for (let k in this.storeData) {
        // eslint-disable-next-line
        if (!!this.storeData[k].storeConfigs) {
          list.push(Object.assign({ countryCode: k }, { ...this.storeData[k] }))
        }
      }
      // eslint-disable-next-line
      return new Promise(async (resolve, reject) => {
        let isError = false
        await Promise.all(
          list.map((val) => {
            const error = this.verifyStoresData(val.storeConfigs)
            let sit = this.shopeeSite[val.countryCode]
            if (!isEmpty(error) && !isError) {
              this.errorAlert('【' + sit + '】-- ' + error)
              isError = true
            }
            // 校验定时发布
            if (val.issueTimeType === 1 && isEmpty(val.issueTime)) {
              this.errorAlert(
                '【' +
                  sit +
                  '】-- ' +
                  this.$t('goodsCollection.autoPublishSet33')
              )
              reject()
              return
            }
            delete val.categoryList
            delete val.list
          })
        )
        if (isError) {
          reject()
          return
        }
        let params = {
          productReleaseTemplateList: [...list]
        }
        const { data } = await Goods.productReleaseTemplateEdit(params)
        resolve(data)
      })
    },
    // 校验
    verifyStoresData(arr) {
      let error = ''
      const isLogisticsError = arr.every(
        (val) => val.logistics && val.logistics.length > 0
      )
      const isCategoryError = arr.every((val) => val.categoryId)
      if (!isLogisticsError) {
        error = this.$t('goodsCollection.autoPublishSet34')
      }
      if (!isCategoryError) {
        error = this.$t('goodsCollection.autoPublishSet35')
      }
      return error
    }
  }
}
</script>

<style lang="scss" scoped>
.publish-setting {
  padding: 0 16px 16px;
  h3 {
    margin-bottom: 12px;
    font-weight: bold;
    font-size: 14px;
    > span {
      font-size: 12px;
      color: #aaa;
    }
  }
  .push-set {
    display: flex;
    > div {
      flex: 1;
    }
    .line {
      display: flex;
      line-height: 32px;
      > span {
        min-width: 80px;
        margin-right: 10px;
      }
    }
    .line + .line {
      margin-top: 10px;
    }
  }
}
.verticalAlign-sub {
  vertical-align: sub;
}
.operationBtn {
  cursor: pointer;
  color: #f7622f;
}
// 修改滚动条样式
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: inherit;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #f0f0f0;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
</style>
