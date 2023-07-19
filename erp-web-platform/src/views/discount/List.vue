<template>
  <div class="me-pa-2">
    <div class="me-pb-2" v-if="addDiscountPro">
      <a-breadcrumb class="me-ib">
        <a-breadcrumb-item>在线商品</a-breadcrumb-item>
        <a-breadcrumb-item>编辑商品</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <!-- <div class="me-card platform me-mb-0 me-pl-3">
      <span
        class="hand me-mr-5"
        v-for="(item, index) in platform"
        :key="item.title"
        :class="{ active: index == platformCheckIndex }"
        @click="changePlatform(index)"
      >
        <i class="iconfont lefticon" :class="[item.icon]"></i>
      </span>
    </div> -->
    <div class="me-card">
      <a-tabs
        v-model="tabsActiveKey"
        @change="onTabsChange"
        type="card"
        class="me-mt-4"
      >
        <a-tab-pane key="0" :tab="$t('discount.all')" />
        <a-tab-pane key="ongoing" :tab="$t('discount.acting')" />
        <a-tab-pane key="upcoming" :tab="$t('discount.nextAct')" />
        <a-tab-pane key="expired" :tab="$t('discount.overdue')" />
        <a-button
          slot="tabBarExtraContent"
          type="link"
          class="me-fr"
          @click="onAsync()"
        >
          {{ $t('discount.synStoreAct') }}
          <a-icon type="reload" />
        </a-button>
      </a-tabs>

      <div class="me-setmeal">
        <TileFilter
          :colItem="colItem"
          :formModel="searchParams"
          @submit="handleSearch"
        />
        <a-space>
          <a-button
            class="me-handle-btn"
            type="primary"
            @click="(e) => handleSearch()"
            :loading="submitIng"
            >筛选</a-button
          >
          <a-button class="me-handle-btn" @click="openPage('/discount/loading')"
            >重置</a-button
          >
        </a-space>
      </div>
    </div>

    <div class="me-card">
      <a-button @click="openPage('/discount/edit?edit=add')" type="primary">
        新建活动
      </a-button>
      <a-table
        :loading="tableLoading"
        :columns="columns"
        :data-source="dataSource"
        :pagination="getPagination"
        :rowSelection="rowSelection"
        @change="changePage"
        rowKey="discountId"
      >
        <template slot="goodsUrl" slot-scope="text, record">
          <div
            class="me-img-wrap"
            v-if="record.goodsUrl && record.goodsUrl.length"
          >
            <a-space>
              <img
                style="width: 40px; height: 40px"
                v-lazy="img"
                v-for="(img, index) in filterImages(record.goodsUrl)"
                :key="index"
              />
              <div class="me-img-mask" v-if="record.goodsUrl.length > 5">
                +{{ record.goodsUrl.length - 5 }}
              </div>
            </a-space>
          </div>
          <p v-else>暂无添加商品</p>
        </template>
        <template slot="discountPeriodSlot" slot-scope="text, record">
          <p>{{ record.startTime.substring(0, 16) }}</p>
          <p>{{ record.endTime.substring(0, 16) }}</p>
        </template>

        <template slot="status" slot-scope="text">
          {{ statusText[text] }}
        </template>

        <template slot="actionSlot" slot-scope="text, record">
          <a-space>
            <a-button
              type="link"
              v-if="record.status == 'upcoming' || record.status == 'ongoing'"
              @click="editDiscount(record)"
            >
              编辑
            </a-button>
            <a-button
              type="link"
              v-if="record.status == 'upcoming'"
              @click="deleteDiscount(record)"
              class="me-error"
            >
              删除
            </a-button>
            <a-button
              type="link"
              v-if="record.status == 'ongoing'"
              class="me-error"
              @click="endDiscount(record)"
            >
              结束
            </a-button>
            <a-button
              type="link"
              v-if="record.status == 'expired'"
              @click="detail(record)"
            >
              详情
            </a-button>
            <a-button
              type="link"
              v-if="record.status == 'ongoing' || record.status == 'upcoming'"
              @click="syncDiscount(record)"
              :loading="record._sync_loading_"
            >
              同步活动
            </a-button>
          </a-space>
        </template>
      </a-table>
      <div v-if="addDiscountPro">
        <a-button @click="addProToDiscount" type="primary"> 确定 </a-button>
      </div>
    </div>
    <a-modal
      :title="$t('discount.choseStore')"
      :visible="sdVisible"
      :confirm-loading="sdConfirmLoading"
      @ok="syncProgressOk"
      @cancel="sdVisible = false"
      width="800px"
      destroyOnClose
      :maskClosable="false"
    >
      <SelectStore ref="refStore" />
    </a-modal>

    <a-modal
      title="同步进度"
      :visible="syncVisible"
      @cancel="syncVisible = false"
      :footer="false"
      width="800px"
    >
      <DiscountListSyncProgress ref="syncProgress" />
    </a-modal>
  </div>
</template>

<script>
import TileFilter from '@/components/tableFilter/Tile'
import SelectStore from './components/SelectStore'
import DiscountListSyncProgress from './components/DiscountListSyncProgress'
import tableMixins from '@/mixins/tableMixins'
import Discount from '@/api/discount'
import dataBrandMxins from '@/mixins/dataBrandMxins'
import { mapState } from 'vuex'

export default {
  mixins: [tableMixins, dataBrandMxins],
  components: { SelectStore, DiscountListSyncProgress, TileFilter },
  data() {
    return {
      platform: [
        { title: 'Shopee', icon: 'iconshopee-logo' }
        // { title: 'Lazada', icon: 'iconLAZADA' }
      ],
      platformCheckIndex: 0, // 初始第一个
      columns: [
        {
          title: this.$t('discount.actName'),
          key: 'discountName',
          dataIndex: 'discountName'
        },
        {
          title: this.$t('discount.goods'),
          key: 'goodsUrl',
          dataIndex: 'goodsUrl',
          scopedSlots: { customRender: 'goodsUrl' },
          width: 350
        },
        {
          title: this.$t('discount.store'),
          key: 'storeName',
          dataIndex: 'storeName'
        },
        {
          title: this.$t('discount.status'),
          key: 'status',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '同步时间',
          key: 'createTime',
          dataIndex: 'createTime'
        },
        {
          title: this.$t('discount.actTime'),
          key: 'discountPeriodSlot',
          dataIndex: 'discountPeriodSlot',
          scopedSlots: { customRender: 'discountPeriodSlot' }
        },
        {
          title: this.$t('common.handler'),
          key: 'actionSlot',
          dataIndex: 'actionSlot',
          scopedSlots: { customRender: 'actionSlot' }
        }
      ],
      sdVisible: false,
      sdConfirmLoading: false,
      syncVisible: false,
      statusText: {
        expired: '已过期',
        upcoming: '即将到来的',
        ongoing: '进行中'
      },
      storeList: [], // 店铺
      autoLoad: false
    }
  },
  watch: {
    'searchParams.site': {
      handler() {
        this.siteChange()
      },
      deep: true
    }
  },
  mounted() {
    this.siteChange()
    if (this.addDiscountPro) {
      this.$message.info('请选择要加入的活动！')
    }
    setTimeout(() => {
      this.loadData()
    }, 100)
  },
  computed: {
    editType() {
      return this.$route.query.edit
    },
    discountId() {
      return this.$route.query.id
    },
    addDiscountPro() {
      return this.$route.query.addDiscountByPid
    },
    filterImages() {
      return (items) => {
        return items.length > 5 ? items.slice(0, 5) : items
      }
    },
    tabsActiveKey() {
      const { key = '0' } = this.$route.query
      return key
    },
    ...mapState({
      storeListSize: (state) => state.auth.storeListSize
    }),
    colItem({ siteStoreList, storeList, platformList }) {
      return [
        {
          itemType: 'tile',
          label: '平台',
          key: 'platform',
          itemProp: {
            style: 'width:190px'
          },
          itemData: platformList
        },
        {
          itemType: 'tileCheck',
          label: '站点',
          key: 'site',
          itemProp: {
            style: 'width:190px'
          },
          itemData: siteStoreList
        },
        {
          itemType: 'tileCheck',
          label: '店铺',
          key: 'store',
          itemProp: {
            style: 'width:190px'
          },
          itemData: storeList
        }
      ]
    }
  },
  methods: {
    //搜索
    async handleSearch(val) {
      console.log(this.searchParams)
      if (!val) {
        //确定查询
        this.submitIng = true
        await this.reLoadData()
        this.submitIng = false
      }
    },
    getTableData() {
      const { platformCheckIndex } = this.$data
      const { key = 0 } = this.$route.query
      const { size, current } = this.$data.paginationData
      let params = { size, current, status: key, platformCheckIndex }
      if (key == 0) params.status = undefined
      params = {
        ...params,
        ...this.searchParams
      }
      console.log(this.searchParams)
      return Discount.getShopeeDiscountList(params)
    },
    changePlatform(index) {
      this.$data.platformCheckIndex = index
      this.reLoadData()
    },
    deleteDiscount({ discountId }) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('discount.sureDetele'),
        onOk: async () => {
          await Discount.deleteDiscount({ discountId })
          this.$message.success(this.$t('common.handlerSuccess'))
          this.reLoadData()
        }
      })
    },
    endDiscount({ discountId }) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: '确认要结束当前活动吗？',
        onOk: async () => {
          await Discount.endDiscount({ discountId })
          this.$message.success(this.$t('common.handlerSuccess'))
          this.reLoadData()
        }
      })
    },
    editDiscount({ discountId, status }) {
      // let discountStatus
      // status == '进行中'
      //   ? (discountStatus = 'runing')
      //   : (discountStatus = 'nuxt')
      this.openPage(`/discount/edit?edit=edit&id=${discountId}`)
    },
    async syncDiscount(source) {
      const { discountId, storeId } = source
      this.$set(source, '_sync_loading_', true)
      await Discount.singleSync({ discountId, storeId })
        .then(() => {
          this.$set(source, '_sync_loading_', false)
          this.$message.success(this.$t('common.handlerSuccess'))
          this.reLoadData()
        })
        .finally(() => {
          this.$set(source, '_sync_loading_', false)
        })
    },
    detail({ discountId, status }) {
      this.$router.push({
        path: '/discount/detail',
        query: { id: discountId, key: status }
      })
    },
    /**同步店铺获取,获取进度 */
    async syncProgressOk() {
      const storeIds = this.$refs.refStore.selectedRowKeys
      const discountList = this.$refs.refStore.groupType
      if (!discountList.length) {
        return this.$message.error('请至少选择一个活动类型')
      }
      if (!storeIds.length) {
        return this.$message.error('请至少选择一个店铺')
      }
      const res = await Discount.syncDiscount({ storeIds, discountList })
      this.$data.sdVisible = false
      this.$data.syncVisible = true
      this.$nextTick(() => {
        let uc = this.$refs.syncProgress.setSync(res.data)

        const interval = setInterval(() => {
          if (uc) {
            this.reLoadData()
            this.$data.syncVisible = false
            return clearInterval(interval)
          }
          Discount.getSyncProgress({ storeIds }).then((res) => {
            uc = this.$refs.syncProgress.setSync(res.data)
          })
        }, 1000)
      })
    },
    syncOk() {
      const groupType = this.$refs.refStore.groupType
      const selectedRowKeys = this.$refs.refStore.selectedRowKeys
      let params = {
        discountList: groupType.join(),
        storeIds: selectedRowKeys.join()
      }

      if (groupType.length && selectedRowKeys.length) {
        this.$data.sdConfirmLoading = true
        Discount.conditionsSync(params)
          .then(({ data }) => {
            this.reLoadData()
            this.$data.sdVisible = false
            this.$data.sdConfirmLoading = false
            this.$message.success(this.$t('common.synSuccess'))
          })
          .catch((error) => {
            this.$data.sdConfirmLoading = false
          })
      } else {
        this.$message.error(this.$t('discount.seletTypeStore'))
      }
    },
    addProToDiscount() {
      const { selectedRows, selectedRowKeys } = this.$data
      console.log(selectedRows, selectedRowKeys)
      if (selectedRowKeys.length != 1) {
        this.errorAlert('请选择一个要加入的活动！')
        return
      }
      let discountId = selectedRowKeys[0]
      this.openPage(`/discount/edit?edit=addDiscountPro&id=${discountId}`)
    },
    onAsync() {
      if (this.$refs.syncProgress) {
        if (!this.$refs.syncProgress.getStatus()) {
          this.$data.syncVisible = true
          this.$data.sdVisible = false
        } else {
          this.$data.sdVisible = true
        }
      } else {
        this.$data.sdVisible = true
      }
    },
    onTabsChange(key) {
      this.$router.push({ path: this.$route.path, query: { key } })
      this.reLoadData()
    }
  }
}
</script>

<style lang="scss" scoped>
.platform {
  border-bottom: 1px solid #f5f5f5;
  height: 56px;
  i {
    font-size: 20px;
    color: #909099;
  }
  .active i {
    font-size: 25px;
    color: #262424;
  }
}
</style>
