<template>
  <div class="me-pa-2">
    <a-page-header
      class="me-page-header"
      :title="$t('goodsCollection.hotSelection')"
    >
      <template slot="extra">
        <a-button key="1" type="primary" @click="autoTopFn">
          {{ $t('goodsCollection.autoTopSettings') }}
        </a-button>
      </template>
    </a-page-header>
    <a-layout class="me-page-layout">
      <div class="me-page-search">
        <a-form class="me-search-form" layout="inline" :form="form">
          <!-- <a-form-item :label="$t('goodsCollection.columnShopName')">
            <a-select v-decorator="['storeId']" style="width: 190px">
              <a-select-option
                v-for="store in storeList"
                :key="store.storeId"
                :value="store.storeId"
              >
                {{ store.storeName }}
              </a-select-option>
            </a-select>
          </a-form-item> -->
          <StoreSelect />
          <a-form-item>
            <a-button type="primary" class="me-mr-2" @click="reLoadData">{{
              $t('common.searchit')
            }}</a-button>
            <a-button @click="resetForm">{{ $t('common.reset') }}</a-button>
          </a-form-item>
        </a-form>
      </div>
      <a-tabs :activeKey="tabsModel" type="card" @change="topPicksListChange">
        <a-tab-pane key="1" :tab="$t('goodsCollection.storeTopmanagement')">
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('goodsCollection.autoTopRecord')">
        </a-tab-pane>
      </a-tabs>

      <a-affix :offset-top="60" class="custom-affix">
        <div class="me-topPick-handler me-mb-4" v-show="tabsModel == '1'">
          <a-button class="me-mr-2" @click="syncTopPicks"
            >{{ $t('goodsCollection.syncTop') }}
          </a-button>
          <a-button class="me-mr-2" @click="createTopFn"
            >{{ $t('goodsCollection.createTop') }}
          </a-button>
          <a-button @click="disableBatch"
            >{{ $t('goodsCollection.setStop') }}
          </a-button>
        </div>
      </a-affix>
      <a-table
        :columns="tableColumn"
        :loading="tableLoading"
        rowKey="id"
        :data-source="dataSource"
        :pagination="getPagination"
        @change="changePage"
      >
        <template slot="storeName" slot-scope="text, record">
          {{ $store.getters.site[record.countryCode] }}<br />
          {{ record.storeName }}
        </template>
        <template slot="name" slot-scope="text, record">
          <span v-if="record.source == 1"
            ><a-tag color="orange">{{ $t('goodsCollection.autoCreate') }}</a-tag
            ><br
          /></span>
          {{ record.name }}
        </template>
        <template slot="images" slot-scope="text, record">
          <a-popover
            :title="null"
            placement="right"
            v-for="(item, key) in JSON.parse(record.images)"
            :key="key"
          >
            <template slot="content">
              <img
                v-lazy="JSON.parse(record.images)[key]"
                style="width: 300px; height: 300px"
              />
            </template>
            <img
              v-lazy="JSON.parse(record.images)[key]"
              style="width: 60px; height: 60px;"
              class="me-mr-2"
            />
          </a-popover>
        </template>
        <template slot="status" slot-scope="text, record">
          <a-switch
            :checked-children="$t('common.open1')"
            :un-checked-children="$t('common.close1')"
            :checked="record.status ? true : false"
            @change="defaultTopChange(record)"
          />
        </template>
        <template slot="createTime" slot-scope="text, record">
          <span v-if="tabsModel == '1'">
            {{ $t('common.createTime') }}:{{ record.createTime }}<br />
            {{ $t('common.updateTime') }}:{{ record.updateTime }}
          </span>
          <span v-else>
            开始时间:{{ record.createTime }}<br />
            结束时间:{{ record.updateTime }}
          </span>
        </template>
        <template slot="handler" slot-scope="text, record">
          <a-button
            type="link"
            @click="delTopPicks(record)"
            v-if="!record.status"
            >{{ $t('common.delete') }}</a-button
          >
        </template>
      </a-table>
    </a-layout>
    <!-- 同步选择店铺 -->
    <a-modal
      :title="$t('onSale.chooseStore')"
      destroyOnClose
      :visible="storeListModalVisible"
      @ok="handleDispatchAction"
      @cancel="
        storeListModalVisible = false
        storeSelectedList = []
      "
      :maskClosable="false"
      :confirm-loading="confirmLoading"
    >
      <StoreListModal ref="store-list-modal" />
    </a-modal>
    <!-- 同步进度 -->
    <!-- <a-modal
      :title="$t('onSale.asyncProduct')"
      width="900px"
      :visible="storeAsyncModalVisible"
      :footer="false"
      @cancel="
        storeAsyncModalVisible = false
        storeSelectedList = []
      "
      :maskClosable="false"
    >
      <AsyncGoods
        @ok="onAsyncOk"
        :title="$t('copy.tongbu')"
        :storeIds="storeSelectedList"
        ref="async-goods"
      />
    </a-modal> -->
    <!-- 创建精选 -->
    <a-modal
      :title="$t('goodsCollection.createTop')"
      width="1100px"
      :visible="createTopVisible"
      @ok="saveTopPicks"
      @cancel="createTopVisible = false"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
    >
      <CreateTopPicks ref="createTopPop" @updateList="reLoadData" />
    </a-modal>
    <!-- 自动精选设置 -->
    <a-modal
      :title="$t('goodsCollection.autoTopSettings')"
      width="1000px"
      :visible="autoTopVisible"
      @ok="saveAutoTopPicks"
      @cancel="autoTopVisible = false"
      :ok-text="$t('goodsCollection.saveSettings')"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      destroyOnClose
    >
      <AutoTopPicks ref="autoTopPop" />
    </a-modal>
  </div>
</template>

<script>
import Goods from '@/api/goods'
import productTableMixins from '@/mixins/productTableMixins'
import tableMixins from '@/mixins/tableMixins'
import StoreListModal from './components/StoreListModal'
// import AsyncGoods from './components/AsyncGoods'
import CreateTopPicks from './components/CreateTopPicks'
import AutoTopPicks from './components/AutoTopPicks'
import StoreSelect from '@/components/StoreSelect'
import { mapState } from 'vuex'
export default {
  mixins: [tableMixins, productTableMixins],
  components: {
    StoreListModal,
    // AsyncGoods,
    CreateTopPicks,
    AutoTopPicks,
    StoreSelect
  },
  data() {
    return {
      tabsModel: '1',
      form: this.$form.createForm(this),
      storeSelectedList: [],
      storeListModalVisible: false,
      createTopVisible: false,
      autoTopVisible: false,
      confirmLoading: false
    }
  },
  computed: {
    //表格列
    tableColumn() {
      let col = [
        {
          title: this.$t('goodsCollection.topName'),
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.$t('goodsCollection.columnShopName'),
          dataIndex: 'storeName',
          key: 'storeName',
          scopedSlots: { customRender: 'storeName' }
        },
        {
          title: this.$t('goodsCollection.topProduct'),
          dataIndex: 'images',
          key: 'images',
          scopedSlots: { customRender: 'images' }
        },
        {
          title: this.$t('common.status'),
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('goodsCollection.topTime'),
          dataIndex: 'createTime',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          key: 'handler',
          scopedSlots: { customRender: 'handler' }
        }
      ]
      if (this.tabsModel == '2') {
        col.splice(3, 1)
      }
      return col
    },
    ...mapState({
      storeList: (state) => state.auth.storeList
    })
  },
  methods: {
    //自动精选
    autoTopFn() {
      this.$data.autoTopVisible = true
    },
    //保存自动精选
    async saveAutoTopPicks() {
      this.$data.autoTopVisible = await this.$refs.autoTopPop.submitAutoTopPicks()
      this.reLoadData()
      this.$success({
        title: '提示',
        content: (
          <div>
            <p>正在创建中，请稍后刷新查看！</p>
          </div>
        )
      })
    },
    //保存创建精选
    saveTopPicks() {
      this.$data.confirmLoading = true
      this.$refs.createTopPop.submitTopPicks().then((data) => {
        this.$data.createTopVisible = data
        this.$data.confirmLoading = false
      })
    },
    //创建精选
    createTopFn() {
      this.$data.createTopVisible = true
    },
    //同步
    syncTopPicks() {
      this.$data.storeListModalVisible = true
    },
    success() {
      this.$success({
        title: '提示',
        content: (
          <div>
            <p>正在同步中，请稍后查看！</p>
          </div>
        )
      })
    },
    //确定同步
    async handleDispatchAction() {
      const selected = this.$refs['store-list-modal'].submit()
      if (!selected) return
      this.$data.storeSelectedList = selected
      this.$data.confirmLoading = true
      let res = await Goods.handpickEnableBatch(selected)
      this.$data.confirmLoading = false
      if (res.code == 0) {
        this.$data.storeListModalVisible = false
        this.success()
      }
    },
    //重置
    resetForm() {
      this.$data.form.resetFields()
      this.reLoadData()
    },

    //获取列表
    getTableData() {
      const storeId = this.$data.form.getFieldValue('storeId')
      let params = {
        ...this.$data.paginationData,
        storeId: storeId == undefined ? undefined : storeId[1]
      }
      if (this.$data.tabsModel == '1') {
        return Goods.handpickConfigPage(params)
      } else {
        return Goods.handpickRecordPage(params)
      }
    },
    //删除精选
    delTopPicks(row) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          let res
          if (this.$data.tabsModel == '1') {
            res = await Goods.handpickConfigDelete(row.id)
          } else {
            res = await Goods.handpickRecordDelete(row.id)
          }
          if (res.code === 0) {
            this.successAlert(this.$t('common.handlerSuccess'))
            this.loadData('delete')
          } else {
            this.errorAlert(`${res.message}`)
          }
        }
      })
    },
    //一键停用
    disableBatch() {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('goodsCollection.disableBatch'),
        onOk: async () => {
          let res = await Goods.handpickDisableBatch()
          if (res.code == 0) {
            this.successAlert(this.$t('common.handlerSuccess'))
          } else {
            this.errorAlert(`${res.message}`)
          }
          this.loadData('delete')
        }
      })
    },
    //开启关闭精选
    async defaultTopChange(row) {
      let res
      if (row.status) {
        res = await Goods.handpickDisableById(row.id)
      } else {
        res = await Goods.handpickEnableById(row.id)
      }
      this.loadData('delete')
      if (res.data) {
        this.successAlert(this.$t('common.handlerSuccess'))
      } else {
        if (res.message == 'has no permission for top-picks') {
          this.$Message({
            type: 'error',
            content: `该店铺不支持热门精选操作，可前往shopee卖家后台查看该功能是否被禁止`
          })
        } else if (res.message.includes('is wrong')) {
          let sku = res.message.split(' ')[1]
          let txt = row.status ? '关闭' : '开启'
          this.errorAlert(
            `${txt}失败，${row.storeName}店铺${sku}商品在shopee后台不存在或已下架，请前往在线商品手动同步商品后再操作${txt}`
          )
        } else {
          this.errorAlert(`${res.message}`)
        }
      }
    },

    //列表切换
    topPicksListChange(index) {
      this.$data.tabsModel = index
      this.reLoadData()
    }
  }
}
</script>

<style lang="scss" scoped>
.me-topPick-handler {
}
</style>
