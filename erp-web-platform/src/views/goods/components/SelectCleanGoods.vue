<template>
  <div>
    <div class="me-page-search">
      <a-form class="me-search-form" layout="inline" :form="form">
        <a-form-item :label="$t('goodsCollection.productsSales')">
          <a-input-group compact>
            <a-select v-decorator="['salesType', { initialValue: 2 }]">
              <a-select-option :value="2">
                {{ $t('goodsCollection.GreaterOrEqual') }}
              </a-select-option>
              <a-select-option :value="1">
                {{ $t('goodsCollection.LessOrEqual') }}
              </a-select-option>
            </a-select>
            <a-input-number
              allowClear
              v-decorator="['sales']"
              :min="0"
              :max="99999"
              :precision="0"
              class="me-w119"
            />
          </a-input-group>
        </a-form-item>

        <a-form-item :label="$t('goodsCollection.productsViews')">
          <a-input-group compact>
            <a-select v-decorator="['viewsType', { initialValue: 2 }]">
              <a-select-option :value="2">
                {{ $t('goodsCollection.GreaterOrEqual') }}
              </a-select-option>
              <a-select-option :value="1">
                {{ $t('goodsCollection.LessOrEqual') }}
              </a-select-option>
            </a-select>
            <a-input-number
              allowClear
              v-decorator="['views']"
              :min="0"
              :max="99999"
              :precision="0"
              class="me-w119"
            />
          </a-input-group>
        </a-form-item>

        <a-form-item :label="$t('goodsCollection.productsCollections')">
          <a-input-group compact>
            <a-select v-decorator="['likesType', { initialValue: 2 }]">
              <a-select-option :value="2">
                {{ $t('goodsCollection.GreaterOrEqual') }}
              </a-select-option>
              <a-select-option :value="1">
                {{ $t('goodsCollection.LessOrEqual') }}
              </a-select-option>
            </a-select>
            <a-input-number
              allowClear
              v-decorator="['likes']"
              :min="0"
              :max="99999"
              :precision="0"
              class="me-w119"
            />
          </a-input-group>
        </a-form-item>

        <a-form-item :label="$t('goodsCollection.Comments')">
          <a-input-group compact>
            <a-select v-decorator="['cmtCountType', { initialValue: 2 }]">
              <a-select-option :value="2">
                {{ $t('goodsCollection.GreaterOrEqual') }}
              </a-select-option>
              <a-select-option :value="1">
                {{ $t('goodsCollection.LessOrEqual') }}
              </a-select-option>
            </a-select>
            <a-input-number
              allowClear
              v-decorator="['cmtCount']"
              :min="0"
              :max="99999"
              :precision="0"
              class="me-w119"
            />
          </a-input-group>
        </a-form-item>

        <a-form-item :label="$t('goodsCollection.Star')">
          <a-input-group compact>
            <a-select v-decorator="['ratingStarType', { initialValue: 2 }]">
              <a-select-option :value="2">
                {{ $t('goodsCollection.GreaterOrEqual') }}
              </a-select-option>
              <a-select-option :value="1">
                {{ $t('goodsCollection.LessOrEqual') }}
              </a-select-option>
            </a-select>
            <a-input-number
              allowClear
              v-decorator="['ratingStar']"
              :min="0"
              :max="99999"
              :precision="0"
              class="me-w119"
            />
          </a-input-group>
        </a-form-item>

        <a-form-item :label="$t('goodsCollection.columnShopName')">
          <a-select
            allowClear
            v-decorator="['storeId']"
            class="me-w180"
            :maxTagCount="1"
            @change="storeChange"
          >
            <a-select-option
              v-for="store in storeListCurr"
              :key="store.storeId"
              :value="store.storeId"
            >
              {{ store.storeName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :label="$t('edit.chooseCategories')">
          <a-cascader
            class="me-w180"
            :disabled="categoryFlag"
            placeholder=""
            v-decorator="['categoryIds']"
            :options="categoryOptions"
            :load-data="loadDataCategory"
            :fieldNames="{
              label: '_name',
              value: 'categoryId',
              children: 'children'
            }"
          />
          <!-- <a-select
                allowClear
                :disabled="categoryFlag"
                v-decorator="['categoryId']"
                class="me-w180"
              >
                <a-select-option
                  v-for="item in categoryList"
                  :key="item.categoryId"
                  :value="item.categoryId"
                >
                  {{ item.categoryName }}({{ item.cnName }})
                </a-select-option>
              </a-select> -->
        </a-form-item>

        <a-form-item :label="$t('goodsCollection.productsSku')">
          <a-input class="me-w180" v-decorator="['itemSku']" allowClear />
        </a-form-item>

        <a-form-item :label="$t('common.createTime')">
          <a-range-picker
            class="me-w180"
            v-decorator="['createTime']"
            valueFormat="YYYY-MM-DD"
          />
        </a-form-item>

        <a-form-item :label="$t('goodsCollection.PriceRange')">
          <a-input-number
            allowClear
            class="me-w75"
            v-decorator="['priceStart']"
            :min="0"
            :max="99999"
          />
          -
          <a-input-number
            allowClear
            class="me-w75"
            v-decorator="['priceEnd']"
            :min="0"
            :max="99999"
          />
          {{ $t('common.yuan') }}
        </a-form-item>

        <a-form-item :label="$t('goodsCollection.ProductStatus')">
          <a-select allowClear v-decorator="['status']" class="me-w180">
            <a-select-option :value="1">
              {{ $t('goodsCollection.onShelf') }}
            </a-select-option>
            <a-select-option :value="0">
              {{ $t('goodsCollection.OffShelf') }}
            </a-select-option>
            <a-select-option :value="2">
              {{ $t('goodsCollection.OffSales') }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :label="$t('goodsCollection.columnTitle')">
          <a-input class="me-w180" v-decorator="['title']" allowClear />
        </a-form-item>

        <a-form-item :label="$t('goodsCollection.RevisionTime')">
          <a-range-picker
            class="me-w180"
            v-decorator="['updateTime']"
            valueFormat="YYYY-MM-DD"
          />
        </a-form-item>

        <a-form-item :label="$t('goodsCollection.InventoryRange')">
          <a-input-number
            allowClear
            class="me-w75"
            v-decorator="['stockStart']"
            :min="0"
            :max="99999"
          />
          -
          <a-input-number
            allowClear
            class="me-w75"
            v-decorator="['stockEnd']"
            :min="0"
            :max="99999"
          />
          {{ $t('common.piece') }}
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="searchGoodsForm">搜索</a-button>
          <a-button class="me-ml-2" @click="resetForm">重置</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-tabs
      class="me-product-list-tab"
      :activeKey="tabsGoodsModel"
      type="card"
      @change="tabsGoodsChange"
    >
      <a-tab-pane key="1">
        <div slot="tab">
          {{ $t('goodsCollection.AllProducts') }} ({{ total }})
        </div>
      </a-tab-pane>
      <a-tab-pane key="2">
        <div slot="tab">
          {{ $t('goodsCollection.LockProduct') }} ({{ lockTotal }})
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" disabled>
        <div slot="tab" class="me-lock-product">
          <span>1</span>
          <a-checkbox v-model="hideLock" @change="reLoadData()">
            {{ $t('goodsCollection.HideLockedProducts') }}
          </a-checkbox>
        </div>
      </a-tab-pane>
    </a-tabs>
    <a-table
      class="me-mb50"
      :columns="columns"
      :loading="tableLoading"
      rowKey="productId"
      :data-source="dataSource"
      :pagination="getPagination"
      :row-selection="rowSelection"
      @change="changePage"
      :scroll="{ y: 300 }"
    >
      <template slot="name" slot-scope="text, record">
        <div class="me-product-info">
          <a-popover :title="null" placement="right">
            <template slot="content">
              <img
                v-lazy="record.mainImage"
                style="width: 300px; height: 300px"
              />
            </template>
            <img v-lazy="record.mainImage" style="width: 60px; height: 60px" />
          </a-popover>

          <div class="me-ml-2">
            <a
              :href="record.itemUrl || record.sourceUrl"
              target="blank"
              class="link-text-color checked-word"
              :title="record.name"
            >
              {{ record.name }}
            </a>
            <div class="attach-item">
              <span class="product-content"
                >{{ $t('commodityList.skuCode') }}：{{ record.itemSku }}</span
              >
            </div>
            <div class="attach-item">
              <span class="product-content"
                >类目：{{ getCategoryNames(record.categoryNames) }}</span
              >
            </div>
          </div>
        </div>
      </template>
      <template slot="status" slot-scope="text, record">
        <span v-if="record.status == 'UNLIST'" class="me-handler-red"
          >已下架</span
        >
        <span v-else-if="record.status == 'NORMAL'">已上架</span>
        <span v-else-if="record.status == 'BANNED'" class="me-handler-red"
          >已禁卖</span
        >
      </template>
      <template slot="currency" slot-scope="text, record">
        {{ record.currency }}：<span
          class="product-text"
          v-html="formatPrice(record)"
        ></span>
      </template>
      <template slot="countryCode" slot-scope="text, record">
        <a-tag color="orange">
          {{ record.countryCode }}/{{
            $store.getters.site[record.countryCode]
          }} </a-tag
        ><br />{{ record.storeName }}
      </template>
      <template slot="handler" slot-scope="text, record">
        <a-button
          v-if="record.lockStatus"
          type="link"
          @click="lockSelected(record)"
          >{{ $t('goodsCollection.unlocking') }}
        </a-button>
        <a-button v-else type="link" @click="lockSelected(record)"
          >{{ $t('goodsCollection.locking') }}
        </a-button>
        <a-button
          v-if="record.status == 'UNLIST'"
          type="link"
          @click="downSubmit(1, record.productId, false)"
          >上架
        </a-button>
        <a-button
          v-else
          type="link"
          @click="downSubmit(1, record.productId, true)"
          >{{ $t('goodsCollection.OffShelf2') }}
        </a-button>
        <a-button
          type="link"
          class="me-error"
          @click="deleteSubmit(1, record)"
          >{{ $t('common.delete') }}</a-button
        >
      </template>
    </a-table>
    <div class="me-fixed-bar">
      <a-button
        v-if="tabsGoodsModel == '2'"
        size="large"
        type="primary"
        @click="lockSelected('', false)"
      >
        解锁选中
      </a-button>
      <span v-else>
        <a-button
          class="me-mr-4"
          size="large"
          type="primary"
          @click="lockSelected('', true)"
        >
          {{ $t('goodsCollection.LockSelected') }}
        </a-button>
        <a-dropdown placement="topLeft">
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="1">
              {{ $t('goodsCollection.deleteAll') }}
            </a-menu-item>
            <a-menu-item key="2">
              {{ $t('goodsCollection.deleteSelected') }}
            </a-menu-item>
          </a-menu>
          <a-button
            class="me-mr-4"
            type="danger"
            size="large"
            :loading="loadingDel"
            >{{ $t('goodsCollection.BatchDelete') }} <a-icon type="down"
          /></a-button>
        </a-dropdown>
        <a-dropdown placement="topLeft">
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="3">
              {{ $t('goodsCollection.downAll') }}
            </a-menu-item>
            <a-menu-item key="4">
              {{ $t('goodsCollection.downSelected') }}
            </a-menu-item>
          </a-menu>
          <a-button size="large" :loading="loadingDow"
            >{{ $t('goodsCollection.BatchOffShelves') }} <a-icon type="down"
          /></a-button>
        </a-dropdown>
      </span>
      <div class="me-reanalysis">
        <a-button size="large" @click="reAnalysis"
          ><a-icon type="reload" />{{ $t('goodsCollection.Reanalysis') }}
        </a-button>
        <span>{{ $t('goodsCollection.LastAnalysisTime') }} :{{ time }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Goods from '@/api/goods'
import tableMixins from '@/mixins/tableMixins'
import { cloneDeep } from 'lodash'
export default {
  mixins: [tableMixins],
  props: {
    storeList: {
      type: Array
    },
    time: {
      type: String
    }
  },
  data() {
    return {
      categoryFlag: false,
      categoryOptions: [],

      tabsGoodsModel: '1',
      // salesVolume:'',
      // value:'',
      storeId: '',
      form: this.$form.createForm(this),
      searchVal: '',
      columns: [
        {
          title: this.$t('goodsCollection.productsInfo'),
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' },
          width: '400px'
        },
        {
          title: this.$t('goodsCollection.ProductStatus'),
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title:
            this.$t('goodsCollection.productsPrice') +
            '/' +
            this.$t('goodsCollection.inventory'),
          dataIndex: 'currency',
          key: 'currency',
          scopedSlots: { customRender: 'currency' }
        },
        {
          title: this.$t('goodsCollection.productsSales'),
          dataIndex: 'sales',
          key: 'sales',
          sorter: (a, b) => a.sales - b.sales
        },
        {
          title: this.$t('goodsCollection.productsViews'),
          dataIndex: 'views',
          key: 'views',
          sorter: (a, b) => a.views - b.views
        },
        {
          title: this.$t('goodsCollection.productsCollections'),
          dataIndex: 'likes',
          key: 'likes',
          sorter: (a, b) => a.likes - b.likes
        },
        {
          title: this.$t('goodsCollection.Comments'),
          dataIndex: 'cmtCount',
          key: 'cmtCount',
          sorter: (a, b) => a.cmtCount - b.cmtCount
        },
        {
          title: this.$t('goodsCollection.Star'),
          dataIndex: 'ratingStar',
          key: 'ratingStar',
          sorter: (a, b) => a.ratingStar - b.ratingStar
        },
        {
          title: this.$t('goodsCollection.BelongingShop'),
          dataIndex: 'countryCode',
          key: 'countryCode',
          scopedSlots: { customRender: 'countryCode' }
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          key: 'handler',
          scopedSlots: { customRender: 'handler' }
        }
      ],
      total: 0,
      lockTotal: 0,
      searchForm: {},
      hideLock: true,
      loadingDow: false,
      loadingDel: false
    }
  },
  async mounted() {},
  computed: {
    storeListCurr() {
      let storeList = []
      if (this.$props.storeList.length) {
        storeList = this.$props.storeList
      } else {
        storeList = JSON.parse(localStorage.analysis).storeList
      }
      return storeList
    }
  },
  methods: {
    /**
     * 禁用表格列表选择框
     */
    getCheckboxProps(record) {
      return {
        props: {
          disabled:
            record.lockStatus && this.$data.tabsGoodsModel == '1'
              ? true
              : false, // Column configuration not to be checked
          name: record.name
        }
      }
    },
    //拼接类目
    getCategoryNames(val) {
      let categoryList = [...val]
      categoryList.reverse()
      let txt = categoryList[0].replace(/\(null\)/g, '')
      categoryList.forEach((item, index) => {
        if (index > 0) txt += '>' + item.replace(/\(null\)/g, '')
      })
      return txt
    },
    //批量删除type:1单个，2选中，3全部
    async deleteSubmit(type, record) {
      let params = []
      if (type == 1) {
        params = [{ itemId: record.itemId, shopId: record.shopId }]
      } else if (type == 2) {
        params = this.selectedRows.map((item) => ({
          itemId: item.itemId,
          shopId: item.shopId
        }))
        if (!params.length) {
          this.$message.warning(this.$t('onSale.deleteError'))
          return
        }
      } else if (type == 3) {
        // this.reLoadData()
        // this.$data.loadingDel = true
        // let { size, current } = this.$data.paginationData
        // let { data } = await Goods.productIds({
        //   ...this.$data.searchForm,
        //   size,
        //   current
        // })
        // params = data
        // this.$data.loadingDel = false
        params = this.dataSource.map((item) => ({
          itemId: item.itemId,
          shopId: item.shopId
        }))
      }
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('onSale.deleteConfirm'),
        onOk: () => {
          this.$data.loadingDel = true
          Goods.deleteProductOnLine(params)
            .then(() => {
              this.$message.success(this.$t('common.handlerSuccess'))
              this.$data.loadingDel = false
              this.reLoadData()
            })
            .catch((err) => {
              this.$data.loadingDel = false
            })
        }
      })
    },
    //批量下架
    async downSubmit(type, storeId, flag) {
      let selectedRowKeys
      let txt = '下架'
      let unlist = true
      if (type == 1) {
        selectedRowKeys = [storeId]
        txt = flag ? '下架' : '上架'
        unlist = flag
      } else if (type == 2) {
        selectedRowKeys = this.$data.selectedRowKeys
        if (!selectedRowKeys.length) {
          this.$message.warning(this.$t('onSale.downError'))
          return
        }
      } else if (type == 3) {
        this.reLoadData()
        this.$data.loadingDow = true
        let { size, current } = this.$data.paginationData
        let { data } = await Goods.productIds({
          ...this.$data.searchForm,
          size,
          current
        })
        selectedRowKeys = data
        this.$data.loadingDow = false
      }
      this.$confirm({
        title: this.$t('common.warn'),
        content: `确定要${txt}该商品吗？`,
        onOk: () => {
          this.$data.loadingDow = true
          let params = { productId: selectedRowKeys, unlist }
          Goods.OnTheShelves(params)
            .then(() => {
              this.$data.loadingDow = false
              this.$message.success(this.$t('common.handlerSuccess'))
              this.reLoadData()
            })
            .catch((err) => {
              this.$data.loadingDow = false
            })
        }
      })
    },
    //锁定选中
    async lockSelected(row, status) {
      let ids = []
      let lockStatus
      let txt = '锁定'
      if (row) {
        ids = [row.id]
        lockStatus = row.lockStatus ? 0 : 1
        txt = row.lockStatus ? '解锁' : '锁定'
      } else {
        this.$data.selectedRows.forEach((item) => {
          ids.push(item.id)
        })
        lockStatus = status ? 1 : 0
        txt = status ? '锁定' : '解锁'
        if (!ids.length) {
          this.$message.warning(`请选择需要${txt}的商品`)
          return
        }
      }

      this.$confirm({
        title: this.$t('common.warn'),
        content: `确定要${txt}该商品吗？`,
        onOk: () => {
          let params = { ids, lockStatus }
          Goods.unsalableLock(params).then(() => {
            this.$message.success(this.$t('common.handlerSuccess'))
            this.reLoadData()
          })
        }
      })
    },
    //重新分析
    reAnalysis(row) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('goodsCollection.analyzeUnsalableTips'),
        onOk: async () => {
          this.$emit('steps', 1)
        }
      })
    },
    //选择店铺
    async storeChange(val) {
      console.log(val)
      this.$data.categoryOptions = []
      this.$data.form.setFieldsValue({ categoryIds: [] })
      // if(val.length>1){
      //   this.$data.categoryFlag = true
      //   this.$message.warning(this.$t('goodsCollection.CategoryOneTips')
      //   );
      // }else{
      this.$data.categoryFlag = false
      this.$data.storeId = val
      if (this.$data.storeId) this.initCategory()
      // let storeId = val[0]
      // let { data } = await Goods.getShopeeCategoryList({storeId})
      // this.$data.categoryList = data
      // }
    },
    /**初始化分类*/
    initCategory() {
      const ids = this.$data.form.getFieldValue('categoryIds')
      const { storeId } = this.$data
      const find = (options, id, callBack) => {
        if (!id || !options) return null
        options.forEach((ele) => {
          if (ele.categoryId == id) callBack(ele)
          else find(ele.children, id, callBack)
        })
      }
      let categoryIds
      if (ids && ids.length) {
        categoryIds = [null, ...ids]
      } else {
        categoryIds = [null, null]
      }
      categoryIds.reduce(async (prev, curr) => {
        prev = await prev
        let { data } = await Goods.getShopeeCategoryList({
          parentId: prev,
          storeId
        })

        data = this.handlerCategoryOptions(data)

        if (!prev) {
          this.$data.categoryOptions = data
        } else {
          const { categoryOptions } = this.$data
          find(categoryOptions, prev, (option) => {
            this.$set(option, 'children', data)
          })
        }
        return curr
      })
    },
    /**加载分类子级*/
    async loadDataCategory(selectedOptions) {
      const { storeId } = this.$data
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.$set(targetOption, 'loading', true)
      const { categoryId } = targetOption
      let { data } = await Goods.getShopeeCategoryList({
        parentId: categoryId,
        storeId
      })
      data = this.handlerCategoryOptions(data)
      this.$set(targetOption, 'loading', false)
      this.$set(targetOption, 'children', data)
      this.$data.categoryOptions = [...this.$data.categoryOptions]
    },
    /**处理分类数据*/
    handlerCategoryOptions(option) {
      return option.map((ele) => {
        ele._name = `${ele.enName}(${ele.cnName})`
        ele.isLeaf = !ele.hasChildren
        return ele
      })
    },
    /**搜索 */
    searchGoodsForm() {
      this.reLoadData()
    },
    //重置
    resetForm() {
      this.$data.form.resetFields()
      this.reLoadData()
    },
    //获取列表数据
    getTableData() {
      let { size, current } = this.$data.paginationData
      this.$data.searchVal = this.$data.form.getFieldsValue()
      this.$data.searchForm = cloneDeep(this.$data.searchVal)
      let { updateTime, createTime, categoryIds } = this.$data.searchForm
      this.$data.searchForm.categoryId = categoryIds
        ? categoryIds[categoryIds.length - 1]
        : null
      this.$data.searchForm.createTimeStart = createTime ? createTime[0] : null
      this.$data.searchForm.createTimeEnd = createTime ? createTime[1] : null
      this.$data.searchForm.updateTimeStart = updateTime ? updateTime[0] : null
      this.$data.searchForm.updateTimeEnd = updateTime ? updateTime[1] : null
      delete this.$data.searchForm.createTime
      delete this.$data.searchForm.updateTime
      delete this.$data.searchForm.categoryIds
      let lockStatus
      if (this.$data.tabsGoodsModel == 2) {
        lockStatus = 1
      } else {
        lockStatus = this.$data.hideLock ? 0 : null
      }
      return Goods.unsalableGetPage({
        ...this.$data.searchForm,
        size,
        current,
        lockStatus
      })
    },
    //获取锁定数据
    async getTableDataAfter() {
      console.log(this.$data.tabsGoodsModel)
      if (this.$data.tabsGoodsModel == 1) {
        let { size, current } = this.$data.paginationData
        let { data } = await Goods.unsalableGetPage({
          ...this.$data.searchForm,
          size,
          current,
          lockStatus: 1
        })
        this.$data.lockTotal = data.total

        console.log(this.$data.paginationData)
        this.$data.total = this.$data.paginationData.total
      } else {
        console.log(this.$data.paginationData)
        this.$data.lockTotal = this.$data.paginationData.total
      }
    },
    //选择商品切换
    tabsGoodsChange(index) {
      this.$data.tabsGoodsModel = index
      this.reLoadData()
    },
    //批量操作
    handleMenuClick(e) {
      if (e.key == 1) {
        this.deleteSubmit(3)
      } else if (e.key == 2) {
        this.deleteSubmit(2)
      } else if (e.key == 3) {
        this.downSubmit(3)
      } else if (e.key == 4) {
        this.downSubmit(2)
      }
    },
    /**
     * 单品显示价格price .变体显示列表的最低价和最高价
     */
    formatPrice(item) {
      if (!item.hasVariation) {
        return item.price + '</br>' + item.stock
      } else {
        let priceArr = item.variants.map((el) => el.price).sort((a, b) => a - b)
        return priceArr.length > 0
          ? `${priceArr[0]} ~ ${priceArr[priceArr.length - 1]}` +
              '</br>' +
              item.stock
          : '0' + '</br>' + item.stock
      }
    }
    // //提交精选
    // submitTopPicks(){
    //   let flag = true
    //   this.form.validateFields((err, values) => {
    //     if (!err) {
    //       if(this.selectedRows.length > 3 && this.selectedRows.length < 9){
    //         flag = false
    //       }else{
    //         this.$message.error('请选择4-8个商品')
    //       }
    //     }
    //   });
    //   return flag
    // }
  },
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
.me-w180 {
  width: 197px;
  background: #fff;
}
.me-w119 {
  width: 105px;
}
.me-w75 {
  width: 83px;
}
.me-lock-product {
  position: relative;
  .ant-checkbox-wrapper {
    position: absolute;
    top: 0;
    left: 0;
  }
}
.me-product-info {
  display: flex;
}
.me-fixed-bar {
  position: fixed;
  left: 185px;
  bottom: 0px;
  width: calc(100% - 185px);
  background: #fff;
  z-index: 99;
  padding: 17px;
  text-align: center;
  box-shadow: 0 -5px 5px #e8e8e8;
}
.me-reanalysis {
  position: absolute;
  top: 17px;
  left: 17px;
}
.me-search-form {
  ::v-deep .ant-form-item-label {
    min-width: 100px;
  }
}
</style>
<style lang="scss">
.me-mb50 {
  margin-bottom: 50px;
}
.me-product-list-tab {
  .ant-tabs-tab-disabled {
    background: #fff !important;
    border-color: #fff !important;
    border-bottom-color: #e8e8e8 !important;
    border-left-color: #e8e8e8 !important;
    cursor: default !important;
  }
  .me-lock-product {
    > span {
      opacity: 0;
    }
  }
}
</style>
