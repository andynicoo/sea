<template>
  <div class="me-pa-2 me-auto-up-page">
    <a-page-header class="me-page-header" :title="$t('onSale.autoTop')">
    </a-page-header>
    <a-layout class="me-page-layout">
      <div>
        <a-tabs
          type="card"
          v-model="searchForm.bootsStatus"
          @change="reLoadData"
        >
          <a-tab-pane :key="1" :tab="$t('onSale.upMessage12')" />
          <a-tab-pane :key="2" :tab="$t('onSale.upMessage22')" />
          <a-button
            slot="tabBarExtraContent"
            @click="autoUpConfig"
            type="primary"
          >
            {{ $t('autoUp.autoUpSetting') }}
          </a-button>
        </a-tabs>
        <div class="me-page-search">
          <a-form-model :model="searchForm" ref="searchForm" layout="inline">
            <a-form-model-item :label="$t('searchForm.store')">
              <a-select
                allowClear
                v-model="searchForm.storeId"
                style="width: 200px"
                :placeholder="$t('edit.placeChoose')"
              >
                <a-select-option
                  v-for="store in stores"
                  :value="store.storeId"
                  :key="store.storeId"
                >
                  {{ store.storeAlias ? store.storeAlias : store.storeName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <!-- <StoreSelect v-model="searchForm.storeId" /> -->
            <a-form-model-item :label="$t('autoUp.upTime')">
              <a-range-picker
                :show-time="{ format: 'HH:mm' }"
                format="YYYY-MM-DD HH:mm"
                valueFormat="YYYY-MM-DD HH:mm"
                :placeholder="[$t('autoUp.startTime'), $t('autoUp.endTime')]"
                v-model="searchForm.timeRange"
              />
            </a-form-model-item>

            <a-form-model-item :label="$t('autoUp.keyword')">
              <a-input
                v-model="searchForm.name"
                :placeholder="$t('autoUp.keywordpl')"
              />
            </a-form-model-item>

            <a-form-model-item class="me-mr-3">
              <a-button @click="reLoadData" type="primary">
                {{ $t('autoUp.searchBtn') }}
              </a-button>
            </a-form-model-item>

            <a-form-item class="me-mr-3">
              <a-button @click="resetSearch">
                {{ $t('form.reset') }}
              </a-button>
            </a-form-item>

            <template v-if="searchForm.bootsStatus === 2">
              <a-form-model-item>
                <a-button
                  :disabled="!selectedRowKeys.length"
                  @click="onCancelUp(selectedRowKeys)"
                >
                  {{ $t('autoUp.batchCancelUp') }}
                </a-button>
              </a-form-model-item>
            </template>
          </a-form-model>
        </div>

        <a-table
          :loading="tableLoading"
          :data-source="dataSource"
          :pagination="getPagination"
          @change="changePage"
          rowKey="id"
          :columns="subColumns"
          :row-selection="searchForm.bootsStatus === 2 ? rowSelection : null"
        >
          <div
            slot="product_info"
            class="product-info"
            slot-scope="text, record, index"
          >
            <!-- <img style="width: 68px; height: 68px" v-lazy="record.images" /> -->
            <a-popover :placement="index < 5 ? 'rightTop' : 'rightBottom'">
              <template slot="content">
                <img
                  v-lazy="record.images"
                  style="width: 280px; height: 280px; border-radius: 2px"
                />
              </template>
              <img
                v-lazy="record.images"
                style="width: 80px; height: 80px; border-radius: 2px"
              />
            </a-popover>
            <div class="info-text">
              <a target="__blank" :href="record.sourceUrl" class="name">{{
                record.name
              }}</a>
              <p class="me-mt-3">
                <span class="me-mr-5 me-fs12 me-status-skip"
                  >{{ $t('commodityList.skuCode') }}：<span>{{
                    record.itemSku
                  }}</span></span
                >
              </p>
            </div>
            <!-- <div>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>{{ record.name }}</span>
                </template>
                <p class="me-info-name">{{ record.name }}</p>
              </a-tooltip>
              <p class="me-info-item-sku">商品编码：{{ record.itemSku }}</p>
            </div> -->
          </div>

          <span slot="price_info" slot-scope="text, record">
            <div>{{ record.currency }}:</div>
            {{ getPrice(record) }}
          </span>

          <span slot="store_info" slot-scope="text, record">
            <p>
              <span class="me-store-info-tag">
                {{ record.siteCN }} / {{ record.siteEN }}
              </span>
            </p>
            <p style="margin-top: 6px">{{ record.storeName }}</p>
          </span>

          <span slot="up_time" slot-scope="text, record">
            <p>{{ record.bootsTime }}</p>
            <p v-if="record.time_diff">
              {{ $t('autoUp.countDown') }}：
              <span style="color: #ff720d">{{ record.time_diff }}</span>
            </p>
          </span>

          <span slot="actions" slot-scope="text, record">
            <span @click="onCancelUp([record.id])" class="me-link">
              {{ $t('autoUp.cancelTop') }}
            </span>
          </span>
        </a-table>
      </div>
    </a-layout>

    <a-modal
      width="790px"
      :title="$t('autoUp.autoUpSetting')"
      :visible="autoUpSettingVisible"
      :confirm-loading="autoUpSettingConfirmLoading"
      :okText="$t('autoUp.saveSetting')"
      :maskClosable="false"
      destroyOnClose
      @ok="autoUpSettingOnOk"
      @cancel="autoUpSettingOnCancel"
    >
      <AutoUpSetting ref="autoUpSetting" />
    </a-modal>

    <a-modal
      :title="null"
      :visible="sureVisible"
      @ok="goStore"
      @cancel="sureVisible = false"
      okText="前往授权"
    >
      <div class="sureit">请先授权店铺，才能置顶</div>
    </a-modal>
  </div>
</template>

<script>
import AutoUpSetting from '@/views/goods/components/autoUp/AutoUpSetting'
// import StoreSelect from '@/components/StoreSelect'
import goods from '@/api/goods'
import tableMixins from '@/mixins/tableMixins'
import { max, min, cloneDeep, compact } from 'lodash'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  mixins: [tableMixins],
  components: {
    AutoUpSetting
    // StoreSelect
  },
  data() {
    const bootsStatus = this.$route.query.c || 1
    return {
      searchForm: {
        name: null,
        timeRange: [],
        storeId: null,
        bootsStatus
      },
      autoUpSettingVisible: false,
      autoUpSettingConfirmLoading: false,
      // stores: [],
      sureVisible: false
    }
  },
  destroyed() {
    clearInterval(this.interval)
  },
  computed: {
    subColumns() {
      const { bootsStatus } = this.$data.searchForm
      const data = compact([
        {
          title: this.$t('autoUp.productInfo'),
          dataIndex: 'product_info',
          key: 'product_info',
          scopedSlots: { customRender: 'product_info' }
        },
        {
          title: this.$t('commodityList.price'),
          dataIndex: 'price_info',
          key: 'price_info',
          scopedSlots: { customRender: 'price_info' }
        },
        {
          title: this.$t('commodityList.stock'),
          dataIndex: 'stock',
          key: 'stock'
        },
        bootsStatus !== 2
          ? {
              title: this.$t('autoUp.upTime'),
              dataIndex: 'up_time',
              key: 'up_time',
              scopedSlots: { customRender: 'up_time' }
            }
          : null,
        {
          title: this.$t('autoUp.store'),
          dataIndex: 'store_info',
          key: 'store_info',
          scopedSlots: { customRender: 'store_info' }
        },
        bootsStatus === 2
          ? {
              title: this.$t('autoUp.action'),
              dataIndex: 'actions',
              key: 'actions',
              scopedSlots: { customRender: 'actions' }
            }
          : null
      ])
      return data
    },
    ...mapState({
      stores: (state) => state.auth.storeList
    }),
    /**
     * 获取售价
     */
    getPrice() {
      return (item) => {
        if (item.hasVariation && item.variants?.length) {
          const variantsPrices = item.variants.map(({ price }) => price)
          const _min = min(variantsPrices)
          const _max = max(variantsPrices)
          if (_max === _min) return `${_max}`
          return `${_min} ~ ${_max}`
        }
        return `${item.price}`
      }
    }
  },
  mounted() {
    // store.getAllStore().then(({ data }) => {
    //   this.$data.stores = data
    // })
  },
  // beforeRouteEnter(to, rom, next) {
  //   window._VV.$message.info('自动置顶功能正在升级中，敬请期待')
  //   next({ path: '/goods/to-be-edit' })
  // },
  methods: {
    // 自动置顶设置
    autoUpConfig() {
      if (this.stores.length > 0) {
        this.$data.autoUpSettingVisible = true
      } else {
        this.$data.sureVisible = true
      }
    },
    goStore() {
      this.$router.push({
        path: '/store'
      })
    },
    /**置顶设置完成 */
    autoUpSettingOnOk() {
      this.$data.autoUpSettingConfirmLoading = true
      this.$refs['autoUpSetting']
        .submit()
        .then(() => {
          this.$data.autoUpSettingVisible = false
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.$data.autoUpSettingConfirmLoading = false
        })
    },
    /**置顶设置取消 */
    autoUpSettingOnCancel() {
      this.$data.autoUpSettingVisible = false
      this.$data.autoUpSettingConfirmLoading = false
    },
    async getTableData() {
      const { bootsStatus } = this.$data.searchForm
      const searchForm = cloneDeep(this.$data.searchForm)
      const { size, current } = this.$data.paginationData
      let [startTime, endTime] = searchForm.timeRange
      searchForm.startTime = startTime
      searchForm.endTime = endTime
      searchForm.timeRange = null
      searchForm.size = size
      searchForm.current = current
      if (bootsStatus == 1) {
        const res = await goods.getGoodsProductBootsPage(searchForm)
        this.interval = setInterval(this.renderTimeStep, 1000)
        return res
      } else {
        const res = await goods.goodsProductBootsList(searchForm)
        const data = {
          current,
          size,
          total: res.data.length,
          records: res.data
        }
        return { data }
      }
    },
    /**倒计时 */
    renderTimeStep() {
      const { dataSource } = this.$data
      dataSource.forEach((product) => {
        const bootsTimeEnd = product.bootsTimeEnd
        const sysTime = moment()
        let day = moment(bootsTimeEnd).diff(sysTime, 'd')
        this.$set(product, 'time_diff', null)
        if (!day) {
          if (moment(bootsTimeEnd).diff(sysTime, 's') >= 0) {
            const hour = moment(bootsTimeEnd).diff(sysTime, 'h')
            const minute = moment(bootsTimeEnd).diff(sysTime, 'm') - hour * 60
            const second =
              moment(bootsTimeEnd).diff(sysTime, 's') -
              minute * 60 -
              hour * 60 * 60
            const time = `${hour}:${minute}:${second}`
            this.$set(product, 'time_diff', time)
          }
        }
      })
    },
    /**取消置顶 */
    onCancelUp(ids) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: () => {
          goods.goodsProductBootsQuit({ ids }).then(() => {
            this.$message.success(this.$t('common.success'))
            this.loadData('delete')
          })
        }
      })
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
      const { bootsStatus } = this.$data.searchForm
      if (bootsStatus == 1) this.loadData()
    },
    /**
     * 重置搜索
     */
    resetSearch() {
      this.$data.searchForm = {
        ...this.$data.searchForm,
        name: null,
        timeRange: [],
        storeId: null
      }
    }
  }
}
</script>

<style lang="scss">
.me-auto-up-page {
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
    .me-info-item-sku {
      font-size: 12px;
      color: #999999;
      line-height: 22px;
    }
  }
  .me-store-info-tag {
    background: #ffeee2;
    border-radius: 2px;
    border: 1px solid #ff720d;
    font-size: 12px;
    color: #ff720d;
    padding: 4px 9px;
  }
}
.sureit {
  font-size: 16px;
  font-weight: bold;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
</style>
