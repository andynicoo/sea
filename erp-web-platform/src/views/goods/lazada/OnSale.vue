<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" title="在线商品"> </a-page-header>
    <a-layout class="me-page-layout">
      <!-- 搜索 start -->
      <TableFilter
        :col-item="colItem"
        :form-model="searchParams"
        @submit="onSearch"
        @reset="resetSearch"
      ></TableFilter>
      <!-- <div class="me-page-search">
        <a-form :form="searchForm" layout="inline">
          <a-form-item label="商品标题">
            <a-input v-decorator="['name']" style="width: 190px" />
          </a-form-item>
          <a-form-item label="站点">
            <a-input v-decorator="['site']" style="width: 190px" />
          </a-form-item>
          <a-form-item label="采集来源">
            <a-select v-decorator="['sourceName']" style="width: 190px">
              <a-select-option
                :value="item"
                v-for="(item, index) in generalSourceList"
                :key="index"
              >
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="创建时间">
            <a-range-picker
              style="width: 190px"
              v-decorator="['createTimeRange']"
            />
          </a-form-item>
          <a-form-item label="更新时间">
            <a-range-picker
              style="width: 190px"
              v-decorator="['updateTimeRange']"
            />
          </a-form-item>
          <a-form-item label="产品状态">
            <a-select v-decorator="['productStatus']" style="width: 190px">
              <a-select-option
                :value="item.id"
                v-for="(item, index) in productStatusList"
                :key="index"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="库存范围">
            <a-input
              placeholder="件"
              v-decorator="['startInventory']"
              style="width: 90px"
            />
            <span class="divide-flex"> — </span>
            <a-input
              placeholder="件"
              v-decorator="['endInventory']"
              style="width: 90px"
            />
          </a-form-item>
          <a-form-item label="价格范围">
            <a-input
              placeholder="元"
              v-decorator="['startPrice']"
              style="width: 90px"
            />
            <span class="divide-flex"> — </span>
            <a-input
              placeholder="元"
              v-decorator="['endPrice']"
              style="width: 90px"
            />
          </a-form-item>
          <a-form-item class="me-mr-3">
            <a-button @click="onSearch()" type="primary">
              {{ $t('form.search') }}
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button @click="resetSearch">
              {{ $t('form.reset') }}
            </a-button>
          </a-form-item>
        </a-form>
      </div> -->
      <!-- 搜索 end -->
      <a-tabs
        :activeKey="params.status"
        @change="onTabsChange"
        type="card"
        class="me-tab me-mt-3"
      >
        <a-tab-pane
          :key="1"
          :tab="
            '已上架' +
              (counts.normalCount == 0 || counts.normalCount == undefined
                ? ''
                : '(' + counts.normalCount + ')')
          "
        >
        </a-tab-pane>
        <a-tab-pane
          :key="2"
          :tab="
            '已下架' +
              (counts.unlistCount == 0 || counts.unlistCount == undefined
                ? ''
                : '(' + counts.unlistCount + ')')
          "
        ></a-tab-pane>
      </a-tabs>

      <a-affix :offset-top="60" class="custom-affix">
        <a-space class="me-mb-3">
          <a-button type="primary" @click="syncShop"> 同步在线商品 </a-button>

          <a-dropdown>
            <a-button
              :loading="updateLoading"
              @click="(e) => e.preventDefault()"
              type="primary"
            >
              更新新品
              <a-icon type="down" />
            </a-button>
            <a-menu slot="overlay">
              <a-menu-item @click="onUpdateProduct(false)">
                更新选中商品
              </a-menu-item>
              <a-menu-item @click="onUpdateProduct(true)">
                更新全部商品
              </a-menu-item>
            </a-menu>
          </a-dropdown>

          <template>
            <template v-if="params.status === 2">
              <a-button
                :loading="batchUpLoading"
                @click="downDeleteSubmit(null, 1)"
              >
                批量上架
              </a-button>
            </template>
            <template v-if="params.status === 1">
              <a-button
                :loading="batchDownLoading"
                @click="downDeleteSubmit(null, 2)"
              >
                批量下架
              </a-button>
            </template>
          </template>

          <a-button @click="downDeleteSubmit(null, 3)"> 批量删除 </a-button>
        </a-space>
        <a-button-group class="me-fr">
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

      <!-- 列表 -->

      <CommodityList
        :rowKey="'productId'"
        :loading="tableLoading"
        :data-source="dataSource"
        :type="componentsType"
        :listType="listType"
        :rowSelection="rowSelection"
        :pagination="getPagination"
        @change="changePage"
        @changeType="changeType"
      >
        <template slot="actions" slot-scope="source">
          <a-button class="me-pa-1" type="link" @click="onEdit(source)">
            编辑
          </a-button>
          <a-divider type="vertical" />
          <a-button
            class="me-pa-1 me-error"
            type="link"
            @click="downDeleteSubmit(source.source, 3)"
          >
            删除
          </a-button>
          <a-divider type="vertical" />

          <template>
            <a-button
              v-if="params.status == 1"
              type="link"
              class="me-pa-1"
              @click="downDeleteSubmit(source.source, 2)"
            >
              下架
            </a-button>
            <a-button
              v-if="params.status == 2"
              type="link"
              class="me-pa-1"
              @click="downDeleteSubmit(source.source, 1)"
            >
              上架
            </a-button>
          </template>

          <a-divider type="vertical" />
          <a-button
            type="link"
            class="me-pa-1"
            @click="openPage(source.source.editUrl)"
          >
            后台编辑
          </a-button>
        </template>
      </CommodityList>
    </a-layout>
    <!-- 同步在线商品选择店铺 -->
    <SyncStoreInfo
      ref="syncOrderAssembly"
      v-if="syncModalVisible"
      :paltform="paltform"
      @handleStore="syncOrder"
      @cancelSync="syncModalVisible = false"
      @syncComplete="syncComplete"
    ></SyncStoreInfo>
    <!-- <a-modal
      :title="$t('onSale.chooseStore')"
      destroyOnClose
      :visible="storeListModalVisible"
      @ok="handleDispatchAction"
      @cancel="
        storeListModalVisible = false
        storeSelectedList = []
      "
    >
      <StoreListModal ref="store-list-modal" />
    </a-modal> -->

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
    >
      <AsyncGoods
        @ok="onAsyncOk"
        :title="$t('copy.tongbu')"
        :storeIds="storeSelectedList"
        ref="async-goods"
      />
    </a-modal> -->

    <a-modal
      :title="$t('onSale.onLineBatchEdit')"
      :visible="onlineProductEditVisible"
      :footer="null"
      @cancel="
        onlineProductEditVisible = false
        reLoadData()
      "
    >
      <p class="me-text-center">
        {{ $t('onSale.modelMsg1') }}
      </p>
      <p class="me-text-center me-mt-4">
        <a-space>
          <a-button @click="asyncOnlineProduct" type="primary">
            {{ $t('onSale.asyncOnlineProducts') }}
          </a-button>
          <a-button :loading="batchEditNextLoading" @click="batchEditNext">
            {{ $t('onSale.modelMsg2') }}
          </a-button>
        </a-space>
      </p>
    </a-modal>

    <a-modal
      width="900px"
      :title="$t('onSale.onLineBatchEdit')"
      :visible="onlineProductEditChooseStoreVisible"
      destroyOnClose
      :maskClosable="false"
      @ok="onOnlineBatchEditChooseStoreOk"
      @cancel="
        onlineProductEditChooseStoreVisible = false
        reLoadData()
      "
    >
      <p class="me-mb-2">{{ $t('onSale.modelMsg3') }}</p>
      <StoreListModal
        rowSelectionType="radio"
        ref="online-product-edit-choose-store"
      />
    </a-modal>

    <a-modal
      width="90%"
      :title="null"
      :visible="onlineProductEditTabsVisible"
      destroyOnClose
      :maskClosable="false"
      :footer="null"
      @cancel="onlineProductEditTabsVisible = false"
    >
      <OnlineBatchEditTabs
        @cancel="
          onlineProductEditTabsVisible = false
          currentStore = null
          reLoadData()
        "
        :store="currentStore"
      />
    </a-modal>
  </div>
</template>

<script>
import Product from '@/api/product'
// import SearchForm from './../components/SearchForm'
import tableMixins from '@/mixins/tableMixins'
import productTableMixins from '@/mixins/productTableMixins'
import CommodityList from './components/CommodityList.vue'
import StoreListModal from './../components/StoreListModal'
import AsyncGoods from './../components/AsyncGoods'
import Goods from '@/api/goods'
import Lazada from '@/api/lazada'
import moment from 'moment'
import OnlineBatchEditTabs from './../components/OnlineBatchEditTabs'
import { cloneDeep } from 'lodash'

import { Modal } from 'ant-design-vue'

import TableFilter from '@/components/tableFilter'
import SyncStoreInfo from '@/components/syncStoreInfo'
import { mapState } from 'vuex'
export default {
  components: {
    // SearchForm,
    CommodityList,
    StoreListModal,
    // AsyncGoods,
    OnlineBatchEditTabs,
    TableFilter,
    SyncStoreInfo
  },
  mixins: [tableMixins, productTableMixins],
  data() {
    return {
      paltform: 'Lazada',
      //列表搜索参数
      searchParams: {
        title: null
      },

      searchForm: this.$form.createForm(this),
      params: { status: 1 },
      componentsType: 1,
      listType: true,
      // 采集源
      generalSourceList: [],
      // 产品状态
      productStatusList: [
        { id: 0, label: '已下架' },
        { id: 1, label: '已上架' },
        { id: 2, label: '禁售' }
      ],
      currentStore: null,
      batchDownLoading: false,
      updateLoading: false,
      batchUpLoading: false,
      batchEditNextLoading: false,
      onlineProductEditVisible: false,
      onlineProductEditChooseStoreVisible: false,
      onlineProductEditTabsVisible: false,
      counts: {
        unlistCount: 0, // 下架数
        normalCount: 0 // 上架数
      },

      syncModalVisible: false //同步弹窗
    }
  },
  computed: {
    ...mapState({
      lazadaStoreListSize: (state) => state.auth.lazadaStoreListSize
    }),
    //列表搜索项
    colItem({ lazadaStoreListSize, generalSourceList }) {
      return [
        {
          itemType: 'input',
          label: this.$t('searchForm.productTitle'),
          key: 'title',
          itemProp: {
            style: 'width:190px'
          }
        },
        // {
        //   itemType: 'select',
        //   label: this.$t('order.site'),
        //   key: 'countryCode',
        //   itemProp: {
        //     style: 'width:190px'
        //   },
        //   itemData: lazadaStoreListSize
        // },
        {
          itemType: 'cascader',
          label: this.$t('order.shop'),
          key: 'storeId',
          itemProp: {
            options: lazadaStoreListSize
          }
        },
        {
          itemType: 'select',
          label: this.$t('searchForm.collectionSource'),
          key: 'sourceName',
          itemProp: {
            style: 'width:190px'
          },
          itemData: generalSourceList
        },
        {
          itemType: 'rengePicker',
          label: this.$t('common.createTime'),
          key: 'createTime',
          itemProp: {
            style: 'width:190px'
          }
        },
        {
          itemType: 'rengePicker',
          label: this.$t('common.updateTime'),
          key: 'updateTime',
          itemProp: {
            style: 'width:190px'
          }
        }
      ]
    }
  },
  mounted() {
    /**
     * 采集源
     */
    Product.getGeneralSourceList().then(({ data }) => {
      this.$data.generalSourceList = data.map((item) => {
        return { label: item, value: item }
      })
    })
    // 商品上下架数量统计
    // this.getCountNum()
    // this.loadData()
  },
  methods: {
    // 同步店铺弹窗开启
    syncShop() {
      this.syncModalVisible = !this.syncModalVisible
    },
    //同步订单方法
    async syncOrder(storeIds) {
      let params = {
        storeIds: storeIds
        // updateTimeFrom: this.$data.sTime,
        // updateTimeTo: this.$data.eTime,
        // synType: 0
      }
      this.$refs.syncOrderAssembly.startSync()
      // await Lazada.goodsLazadaProductSync(params)
    },
    //同步完成
    syncComplete() {
      this.$message.success('同步完成')
      this.syncShop()
      this.reLoadData()
    },
    //处理筛选条件时间和店铺
    getTime() {
      const [createTimeStart, createTimeEnd] =
        this.searchParams.createTime ?? []
      const [updateTimeStart, updateTimeEnd] =
        this.searchParams.updateTime ?? []
      const storeId = this.searchParams.storeId
        ? this.searchParams.storeId[1]
        : null
      return {
        createTimeStart: createTimeStart ? createTimeStart + ' 00:00:00' : '',
        createTimeEnd: createTimeEnd ? createTimeEnd + ' 23:59:59' : '',
        updateTimeStart: updateTimeStart ? updateTimeStart + ' 00:00:00' : '',
        updateTimeEnd: updateTimeEnd ? updateTimeEnd + ' 23:59:59' : '',
        storeId,
        createTime: undefined,
        updateTime: undefined
      }
    },

    /**搜索 */
    onSearch() {
      // this.$data.searchForm.validateFields((err, value) => {
      this.$data.params = {
        ...this.$data.params,
        ...this.$data.searchParams,
        ...this.getTime()
      }
      // })
      this.reLoadData()
    },

    /**
     * 重置搜索
     */
    resetSearch() {
      this.$data.searchParams = {
        title: null
      }
      // this.$data.searchForm.validateFields().then((params) => {
      this.$data.params = { status: this.$data.params.status }
      // this.onSelectChange([], [])
      this.reLoadData()
      // })
    },
    /**获取列表数据 */
    getTableData() {
      const { size, current } = this.$data.paginationData
      const { params, componentsType } = this.$data
      return Lazada.getGoodsLazadaOnSalePage({
        ...params,
        size,
        current
      })
    },

    /**
     * 编辑点击, 传递status参数(是否上架)
     */
    onEdit(source) {
      const { productId } = source.source
      this.$router.push({
        path: '/goods/lazada/edit',
        query: { id: productId, edit: 2, bc: '在线商品' }
      })
    },
    getCountNum() {
      // this.$data.params
      // var params = {
      //   ...this.$data.params,
      //   type: 1
      // }
      // params.status = null
      // Goods.getGoodsListCount(params).then(({ data }) => {
      //   this.$data.counts = data
      // })
    },
    async loadData(flag) {
      this.$data.tableLoading = true
      if (flag == 'delete') {
        if (this.$data.dataSource.length == 1) {
          this.$data.paginationData.current -= 1
        }
      }
      if (this.getTableDataBefore) await this.getTableDataBefore()
      try {
        const { data } = await this.getTableData()
        var converArr = cloneDeep(data.records)
        converArr = converArr.map((ele) => {
          if (!ele.shopeeProductExtDTO) {
            ele.shopeeProductExtDTO = { remarks: null }
            // console.log(ele.shopeeProductExtDTO)
          }
          return ele
        })
        this.$data.dataSource = converArr
        this.$data.paginationData = this.getPageFromResp(data)
        if (this.getTableDataAfter) await this.getTableDataAfter()
      } catch (error) {
        console.warn('没有数据:', error)
      } finally {
        // 如果有统计数，刷新统计数
        try {
          this.getCountNum()
        } catch (error) {
          this.$refs.sub.getCountNum()
          console.log(error)
        }

        this.$data.tableLoading = false
        if (this.$data.clearSelectedRows) {
          this.$data.selectedRowKeys = []
          this.$data.selectedRows = []
        }
      }
    },
    getTableDataBefore() {
      this.$data.dataSource = []
    },

    /**更新商品单条 */
    onUpdate({ source }) {
      const { id } = source
      this.onSelectChange([id], [source])
      this.setLoading('_r_loading_')
      Goods.handleSyncProductById({ productId: [id] })
        .then(() => {
          this.$message.success(this.$t('common.updateSuccess'))
          this.loadData()
        })
        .finally(() => {
          this.setLoading('_r_loading_', false)
        })
    },
    /**更新商品 */
    onUpdateProduct(status) {
      let arr = []
      if (!status) {
        // 更新选中商品
        const { selectedRowKeys } = this.$data
        arr = [...selectedRowKeys]
        if (!arr.length) {
          this.$message.warning(this.$t('onSale.updateError'))
          return
        }
      }
      this.$data.updateLoading = true
      Lazada.goodsLazadaProductUpdate({ productIds: arr })
        .then(() => {
          this.$message.success(this.$t('common.updateSuccess'))
          this.loadData()
        })
        .finally(() => {
          this.$data.updateLoading = false
        })
    },
    /**上架 */
    // onUp(source) {
    //   const { productId } = source
    //   console.log(productId, source)
    //   this.onSelectChange([productId], [source])
    //   this.setLoading('_u_loading_')
    //   this.onBatchUp().finally(() => {
    //     this.setLoading('_u_loading_', false)
    //     this.getCountNum()
    //   })
    // },
    /**批量上架 */
    // onBatchUp() {
    //   return new Promise((resolve) => {
    //     this.$data.batchUpLoading = true
    //     this.upSubmit().finally(() => {
    //       this.$data.batchUpLoading = false
    //       this.getCountNum()
    //       resolve()
    //     })
    //   })
    // },
    // upSubmit() {
    //   return new Promise((resolve, reject) => {
    //     const { selectedRowKeys } = this.$data
    //     if (!selectedRowKeys.length) {
    //       this.$data.batchUpLoading = false
    //       this.$message.warning(this.$t('onSale.upError'))
    //       return
    //     }

    //     this.setLoading('_u_loading_')
    //     let params = { productId: selectedRowKeys, unlist: false }
    //     Goods.OnTheShelves(params)
    //       .then(() => {
    //         this.$message.success(this.$t('common.handlerSuccess'))
    //         this.reLoadData()
    //         resolve()
    //       })
    //       .catch(() => {
    //         reject()
    //       })
    //       .finally(() => {
    //         this.setLoading('_u_loading_', false)
    //         this.onSelectChange([], [])
    //       })
    //   })
    // },
    // /**下架 */
    // onDown(source) {
    //   const { productId } = source
    //   console.log(productId,source)
    //   this.onSelectChange([productId], [source])
    //   this.setLoading('_d_loading_')
    //   this.downSubmit().finally(() => {
    //     this.setLoading('_d_loading_', false)
    //     // this.getCountNum()
    //   })
    // },
    // /**批量下架 */
    // onBatchDown() {
    //   this.$data.batchDownLoading = true
    //   this.downSubmit().finally(() => {
    //     this.$data.batchDownLoading = false
    //     // this.getCountNum()
    //   })
    // },
    //下架和删除
    downDeleteSubmit(rows, type) {
      //type 3是删除，2是下架, 1是上架
      let ids = []
      let txt = ['', '上架', '下架', '删除']
      let api = [
        '',
        'goodsLazadaProductUnlist',
        'goodsLazadaProductUnlist',
        'goodsLazadaProductDelete'
      ]
      if (rows) {
        ids = [rows.productId]
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
        onOk: () => {
          let params = { productIds: ids, type: type }
          Lazada[api[type]](params)
            .then((res) => {
              let failSum = res.data.filter((item) => !item.isSuccess)
              if (failSum.length) {
                const h = this.$createElement
                let html = []
                failSum.forEach((element) => {
                  html.push(h('p', element.msg))
                })
                this.$error({
                  title: '错误提示',
                  content: h('div', {}, html)
                })
              } else {
                this.$message.success(this.$t('common.handlerSuccess'))
              }
            })
            .catch(() => {})
            .finally(() => {
              this.reLoadData()
              this.onSelectChange([], [])
            })
        }
      })
      // })
    },
    /**置顶 */
    onPlacetop({ source }) {
      const { id } = source
      this.onSelectChange([id], [source])
      this.batchPlacetop()
    },
    /**批量置顶 */
    batchPlacetop() {
      const { selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.$message.warning(this.$t('onSale.topWarning'))
        return
      }
      this.setLoading('_p_loading_')
      let params = { productId: selectedRowKeys }
      Goods.sureProductTop(params)
        .then(({ data }) => {
          this.$message.success(this.$t('common.handlerSuccess'))
          this.reLoadData()
          const warning = Modal.warning()
          const toUp = (c) => {
            this.$router.push({ path: '/goods/auto-up', query: { c } })
            warning.destroy()
          }
          if (data) {
            warning.update({
              title: this.$t('common.message'),
              content: () => (
                <p>
                  {this.$t('onSale.upMessage11')}
                  <a on-click={() => toUp(1)} class="me-link">
                    {this.$t('onSale.upMessage12')}
                  </a>
                  {this.$t('onSale.upMessage13')}
                </p>
              )
            })
          } else {
            warning.update({
              title: this.$t('common.message'),
              content: () => (
                <p>
                  {this.$t('onSale.upMessage21')}
                  <a on-click={() => toUp(2)} class="me-link">
                    {this.$t('onSale.upMessage22')}
                  </a>
                  {this.$t('onSale.upMessage23')}
                </p>
              )
            })
          }
        })
        .finally(() => {
          this.setLoading('_p_loading_', false)
        })
    },
    /**批量定时置顶提交 */
    onDatePickerOk(date) {
      if (moment(date).isBefore(moment())) {
        this.$message.error(this.$t('onSale.dateChooseError'))
        return
      }
      const { selectedRowKeys } = this.$data
      const time = moment(date).format('YYYY-MM-DD HH:mm:ss')
      let params = { productId: selectedRowKeys, toppingDate: time }
      Goods.setPlaceTopTime(params).then(() => {
        this.$message.success(this.$t('common.handlerSuccess'))
        this.reLoadData()
      })
    },
    /**批量定时置顶开关 */
    onShowDatePicker(open) {
      const { selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.$message.error(this.$t('onSale.dateChooseTimedError'))
        return
      }
      this.$data.datePickerVisible = open
    },
    /**tab切换 */
    onTabsChange(key) {
      this.$set(this.$data.params, 'view', undefined)
      this.$set(this.$data.params, 'status', key)
      this.$nextTick(this.reLoadData)
    },

    /**切换列表类型 */
    changeListType(flag) {
      this.$data.listType = flag
      window.dispatchEvent(new Event('resize')) //table fixed对齐
    },
    /**已同步商品 */
    onViewChange({ target }) {
      const { checked } = target
      this.$set(this.$data.params, 'view', checked ? 0 : undefined)
      this.$nextTick(this.reLoadData)
    },
    /**同步在线商品 */
    asyncOnlineProduct() {
      this.onAsyncProduct()
    },
    /**已同步商品 */
    async batchEditNext() {
      this.$data.batchEditNextLoading = true
      const { data } = await Goods.getProductList()
      this.$data.batchEditNextLoading = false
      if (!data.records.length) {
        this.$message.error(this.$t('onSale.modelMsg4'))
        return
      }
      this.$data.onlineProductEditChooseStoreVisible = true
      this.$data.onlineProductEditVisible = false
    },
    /**同步商品选择店铺OK */
    onOnlineBatchEditChooseStoreOk() {
      const store = this.$refs['online-product-edit-choose-store'].submit()
      this.$data.currentStore = store[0]
      this.$data.onlineProductEditChooseStoreVisible = false
      this.$data.onlineProductEditTabsVisible = true
    },

    // 前往Shopee管理后台
    goShopee(source) {
      console.log(source.source.id)
      this.openPage(source.source.itemPortalUrl, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled-text {
  color: #999999 !important;
}
</style>

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
<style lang="scss">
.xxxx {
  .ant-checkbox + span {
    padding-left: 4px;
  }
}
</style>
