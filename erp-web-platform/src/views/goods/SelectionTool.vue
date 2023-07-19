<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" title="选品工具"></a-page-header>
    <a-layout class="me-page-layout">
      <div class="me-page-search">
        <a-form class="me-search-form" layout="inline" :form="form">
          <a-form-item label="站点">
            <a-select
              v-decorator="[
                'site',
                {
                  initialValue: 'MY'
                }
              ]"
              style="width: 190px"
              @change="siteChange"
            >
              <a-select-option
                v-for="site in siteList"
                :key="site.code"
                :value="site.code"
              >
                {{ site.desc }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="类目">
            <a-cascader
              :options="categoryOptions"
              :field-names="{
                label: 'label',
                value: 'id',
                children: 'children'
              }"
              placeholder="Please select"
              change-on-select
              @change="onChange"
              v-model="categoryId"
            />
          </a-form-item>
          <a-form-item label="类型">
            <a-select
              v-decorator="[
                'shopLocation',
                {
                  initialValue: '0'
                }
              ]"
              style="width: 190px"
            >
              <a-select-option value="0">
                全部
              </a-select-option>
              <a-select-option value="1">
                本土
              </a-select-option>
              <a-select-option value="2">
                跨境
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="价格">
            <a-input-group compact>
              <a-input
                v-model="priceMin"
                style=" width: 81px;border-right: 0; text-align: center"
                placeholder="最低价格"
                v-positiveNumber="{ fixedNum: 2, maxNum: 1000000, minNum: 0 }"
              />
              <a-input
                style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
                placeholder="~"
                disabled
              />
              <a-input
                v-model="priceMax"
                style="width: 81px; text-align: center; border-left: 0"
                placeholder="最高价格"
                v-positiveNumber="{ fixedNum: 2, maxNum: 1000000, minNum: 0 }"
              />
            </a-input-group>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" class="me-mr-2" @click="searchForm">{{
              $t('common.searchit')
            }}</a-button>
          </a-form-item>
        </a-form>
      </div>
      <a-tabs :activeKey="tabsModel" type="card" @change="topPicksListChange">
        <a-tab-pane key="DAY" tab="天榜"> </a-tab-pane>
        <a-tab-pane key="WEEK" tab="周榜"> </a-tab-pane>
        <a-tab-pane key="MONTH" tab="月榜"> </a-tab-pane>
      </a-tabs>
      <a-table
        :columns="tableColumn"
        :loading="tableLoading"
        rowKey="ctime"
        :data-source="dataSource"
        :pagination="paginationData"
        @change="paginationChange"
      >
        <template slot="itemName" slot-scope="text, record">
          <a :href="record.itemUrl" target="_blank">{{ record.itemName }} </a
          ><i
            v-copy="record.itemName"
            title="复制"
            class="iconfont iconjuxing1 me-copy-icon"
          ></i>
          <div>
            <a-dropdown placement="topCenter">
              <a-menu slot="overlay">
                <a-menu-item
                  v-for="item in siteList"
                  :key="item.id"
                  @click="batchTranslate(record, siteLang[item.code])"
                >
                  {{ item.desc }}
                </a-menu-item>
                <a-menu-item key="zh" @click="batchTranslate(record, 'zh')">
                  中文
                </a-menu-item>
              </a-menu>
              <span class="me-cp me-status-link">翻译</span>
            </a-dropdown>
          </div>
        </template>
        <template slot="images" slot-scope="text, record">
          <a-popover :title="null" placement="right">
            <template slot="content">
              <img v-lazy="record.imgUrl" style="width: 300px; height: 300px" />
            </template>
            <img
              v-lazy="record.imgUrl"
              style="width: 60px; height: 60px;"
              class="me-mr-2"
            />
          </a-popover>
        </template>
        <template slot="catName" slot-scope="text, record">
          <p>{{ record.catName }}</p>
          <p v-if="form.getFieldValue('site') != 'TW'">
            ({{ record.catNameZh }})
          </p>
        </template>
        <template slot="shopInfo" slot-scope="text, record">
          <p>
            {{ record.shopInfo.shopName
            }}<i
              v-copy="record.shopInfo.shopName"
              title="复制"
              class="iconfont iconjuxing1 me-copy-icon"
            ></i>
          </p>
          <p>店铺ID：{{ record.shopInfo.shopId }}</p>
          <p>店铺地址：{{ record.shopInfo.shopLocation }}</p>
          <p>店铺类型：{{ record.shopInfo.cbOption ? '跨境' : '本土' }}</p>
        </template>
        <template slot="handler" slot-scope="text, record">
          <p>找同类货源：</p>
          <a-button
            type="link"
            @click="platformAcquisition('ALBB', record.itemName)"
            >1688</a-button
          >
          <a-button
            type="link"
            @click="platformAcquisition('PDD', record.itemName)"
            >拼多多</a-button
          >
        </template>
      </a-table>
    </a-layout>
  </div>
</template>

<script>
import Basic from '@/api/basic'
import Goods from '@/api/goods'
import { sortBy } from 'lodash'
import { positiveNumber } from '@/directive/number'
import { isIntersect } from '@/util'
export default {
  name: 'goodsselectiontool',
  data() {
    return {
      tabsModel: 'DAY',
      form: this.$form.createForm(this),
      siteList: [],
      categoryOptions: [],
      tableLoading: false,
      dataSource: [],
      paginationData: {
        size: '10',
        current: 1,
        total: 0,
        pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
        showSizeChanger: true,
        showTotal: (total) => this.$t(`common.pageTotalText`, { total })
      },
      siteLang: {
        MY: 'ms',
        VN: 'vi',
        ID: 'id',
        TH: 'th',
        BR: 'pt',
        TW: 'zh-TW',
        PH: 'en',
        SG: 'en',
        MX: 'es'
      },
      categoryVal: '',
      categoryId: [],
      listSource: [],
      sortOrderFlag: false,
      priceMin: '',
      priceMax: ''
    }
  },
  computed: {
    //表格列
    tableColumn() {
      let col = [
        {
          title: '产品名称',
          dataIndex: 'itemName',
          key: 'itemName',
          scopedSlots: { customRender: 'itemName' },
          width: '230px'
        },
        {
          title: '商品主图',
          dataIndex: 'images',
          key: 'images',
          scopedSlots: { customRender: 'images' }
        },
        {
          title: '店铺名称',
          dataIndex: 'shopInfo',
          key: 'shopInfo',
          scopedSlots: { customRender: 'shopInfo' }
        },
        {
          title: '行业类目',
          dataIndex: 'catName',
          key: 'catName',
          width: '190px',
          scopedSlots: { customRender: 'catName' }
        },
        {
          title: '上一日销量',
          dataIndex: 'sales',
          key: 'sales'
        },
        // {
        //   title: '近一日销量增量',
        //   dataIndex: 'sales',
        //   key: 'sales2'
        // },
        {
          title: '累计销量',
          dataIndex: 'sold',
          key: 'sold'
        },
        {
          title: '价格',
          dataIndex: 'price',
          key: 'price',
          sorter: true,
          sortOrder: this.sortOrderFlag
        },
        {
          title: '新增点赞数',
          dataIndex: 'likeCountAdd',
          key: 'likeCountAdd'
        },
        {
          title: '新增评论数',
          dataIndex: 'ratingNumAdd',
          key: 'ratingNumAdd'
        },
        {
          title: '上榜天数',
          dataIndex: 'listDays',
          key: 'listDays'
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          key: 'handler',
          scopedSlots: { customRender: 'handler' }
        }
      ]
      return col
    }
  },
  directives: {
    positiveNumber
  },
  async created() {
    let { data } = await Goods.listSelectionCategorySite()
    this.$data.siteList = data || []
    this.getCategoryData('MY')
  },
  methods: {
    //改变分页
    paginationChange({ current, pageSize }, filters, { order }) {
      this.paginationData.current = current
      this.paginationData.size = String(pageSize)
      if (order == 'ascend') {
        this.sortOrderFlag = 'ascend'
        this.dataSource = sortBy(this.dataSource, function(o) {
          return Number(o.price.split('~')[1])
        })
      } else if (order == 'descend') {
        this.sortOrderFlag = 'descend'
        this.dataSource = sortBy(this.dataSource, function(o) {
          return -Number(o.price.split('~')[1])
        })
      } else {
        this.sortOrderFlag = false
        this.dataSource = this.listSource
      }
    },
    //获取类目
    async getCategoryData(siteCode) {
      let res = await Goods.listSelectionCategory({
        sourceSite: siteCode,
        parentIds: [0]
      })
      this.categoryOptions = []
      res.data.forEach((item) => {
        this.categoryOptions.push(item)
      })
      let res2 = await Goods.listSelectionCategory({
        sourceSite: siteCode,
        parentIds: res.data.map((item) => item.id)
      })
      this.categoryOptions.forEach((item) => {
        res2.data.forEach((itemSub) => {
          if (item.id == itemSub.parentId) {
            if (!item.children) {
              this.$set(item, 'children', [])
            }
            item.children.push(itemSub)
          }
        })
      })
      //获取列表数据
      this.getListData(siteCode)
    },
    //获取列表数据
    async getListData(siteCode, categoryVal) {
      if (this.priceMin && this.priceMax) {
        let sum = Number(this.priceMax) - Number(this.priceMin)
        if (sum < 0) {
          return this.$message.warning('请正确填写价格区间！')
        }
      }
      this.tableLoading = true
      let { data } = await Goods.listHotItem({
        siteId: this.siteList.filter((item) => siteCode == item.code)[0].id,
        catId: categoryVal || this.categoryOptions[0].val,
        exampleType: this.tabsModel,
        shopLocation: this.form.getFieldValue('shopLocation')
      })
      this.tableLoading = false
      let resData = JSON.parse(data)
      let priceRange = []
      if (this.priceMin && this.priceMax) {
        resData.itemList = resData.itemList.filter((item) => {
          priceRange = item.price.split('~')
          if (isIntersect(priceRange, [this.priceMin, this.priceMax])) {
            return item
          }
        })
      } else if (this.priceMin) {
        resData.itemList = resData.itemList.filter((item) => {
          priceRange = item.price.split('~')
          if (isIntersect(priceRange, [this.priceMin, 99999999])) {
            return item
          }
        })
      } else if (this.priceMax) {
        resData.itemList = resData.itemList.filter((item) => {
          priceRange = item.price.split('~')
          if (isIntersect(priceRange, [0, this.priceMax])) {
            return item
          }
        })
      }
      this.sortOrderFlag = false
      this.$data.dataSource = resData.itemList
      this.$data.listSource = resData.itemList
      this.paginationData.total = resData.itemList.length
      this.paginationData.current = 1
      if (!categoryVal) this.categoryId = [this.categoryOptions[0].id]
    },
    //切换站点
    siteChange(val) {
      this.getCategoryData(val)
    },
    //类目选中值改变
    async onChange(value, selectedOptions) {
      if (selectedOptions[selectedOptions.length - 1].children) {
        let subList = selectedOptions[selectedOptions.length - 1].children.map(
          (item) => item.id
        )
        let { data } = await Goods.listSelectionCategory({
          sourceSite: this.form.getFieldValue('site'),
          parentIds: subList
        })
        selectedOptions[selectedOptions.length - 1].children.forEach((item) => {
          data.forEach((itemSub) => {
            if (item.id == itemSub.parentId) {
              if (!item.children) {
                this.$set(item, 'children', [])
              }
              item.children.push(itemSub)
            }
          })
        })
      }

      this.categoryVal = selectedOptions[selectedOptions.length - 1].val

      this.getListData(this.form.getFieldValue('site'), this.categoryVal)
    },
    //翻译标题
    async batchTranslate(item, lang) {
      let params = {
        storeId: 0,
        to: lang,
        list: [
          {
            source: item.itemName,
            target: '',
            translateId: item.itemName
          }
        ]
      }
      const { data } = await Basic.batchTranslate(params)
      item.itemName = data.list[0].target || item.itemName
    },
    //平台采集
    platformAcquisition(val, title) {
      // let zz = encodeURI(title)
      // console.log(zz)
      // window.open(
      //   'https://s.1688.com/selloffer/offer_search.htm?keywords=' + zz,
      //   '_blank'
      // )
      this.$router.push({
        path: '/goods/source-results',
        query: { platform: val, title }
      })
    },
    //查询
    searchForm() {
      this.getListData(this.form.getFieldValue('site'), this.categoryVal)
    },
    //列表切换
    topPicksListChange(index) {
      this.$data.tabsModel = index
      this.searchForm()
    }
  }
}
</script>

<style lang="scss" scoped>
.me-lang {
  &:hover {
    background: #999;
  }
}
</style>
