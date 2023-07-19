<template>
  <div class="me-pa-2" style="min-width: 1100px">
    <a-breadcrumb class="me-mb-3 me-mt-2" separator="/">
      <a-breadcrumb-item>
        运营数据
      </a-breadcrumb-item>
      <a-breadcrumb-item class="me-f12">产品数据</a-breadcrumb-item>
    </a-breadcrumb>
    <a-layout>
      <!-- 搜索块 -->
      <div class="me-tile-filter">
        <TileFilter
          :colItem="colItem"
          :formModel="searchParams"
          @submit="handleSearch"
        />
        <a-button
          class="me-handle-btn"
          type="primary"
          @click="(e) => handleSearch()"
          :loading="submitIng"
          >查询</a-button
        >
      </div>
      <div class="me-data-card">
        <h2 class="me-card-title">
          <b class="me-f5" @click="getNewData"
            >刷新<a-icon :class="{ 'me-loading': isLoading }" type="redo"/></b
          >数据统计
          <!-- <span>近7天数据统计</span> -->
        </h2>
        <ul class="me-data-board">
          <li>
            有销量的产品总数
            <b>{{ productData.existSaleTotal }}</b>
          </li>
          <li>
            商品总数量
            <b>{{ productData.productTotal }}</b>
          </li>
          <li>
            在售商品数
            <b>{{ productData.normalProduct }}</b>
          </li>
          <li>
            在售商品占比
            <b>{{ productData.normalProductProportion }}%</b>
          </li>
          <li>
            有销量商品占比
            <b>{{ productData.existSaleProportion }}%</b>
          </li>
          <li>
            动销率
            <b>{{ productData.movingPinRate }}%</b>
          </li>
          <li>
            新增在售商品数量
            <b>{{ productData.newAddProduct }}</b>
          </li>
          <li>
            新增在售商品占比
            <b>{{ productData.newAddProductProportion }}%</b>
          </li>
        </ul>

        <a-table
          :columns="columns"
          :data-source="productData.productDataResultDTOS"
          class="me-mt-4 me-stat-table"
          :pagination="false"
        >
          <a slot="name" slot-scope="text">{{ text }}</a>
          <template slot="generateDate" slot-scope="text, record">
            <span>{{ moment(record.generateDate).format('YYYY-MM-DD') }} </span>
          </template>
          <template slot="normalProductProportion" slot-scope="text, record">
            <span>{{ record.normalProductProportion }}% </span>
          </template>
          <template slot="existSaleProportion" slot-scope="text, record">
            <span>{{ record.existSaleProportion }}% </span>
          </template>
          <template slot="newAddProductProportion" slot-scope="text, record">
            <span>{{ record.newAddProductProportion }}% </span>
          </template>
        </a-table>
      </div>
    </a-layout>
  </div>
</template>

<script>
const columns = [
  {
    title: '日期',
    dataIndex: 'generateDate',
    key: 'generateDate',
    scopedSlots: { customRender: 'generateDate' }
  },
  {
    title: '有销量的产品总数',
    dataIndex: 'existSaleTotal',
    key: 'existSaleTotal'
  },
  {
    title: '商品总数',
    dataIndex: 'productTotal',
    key: 'productTotal'
  },
  {
    title: '在售商品数',
    dataIndex: 'normalProduct',
    key: 'normalProduct',
    ellipsis: true
  },
  {
    title: '在售商品占比',
    dataIndex: 'normalProductProportion',
    key: 'normalProductProportion',
    scopedSlots: { customRender: 'normalProductProportion' },
    ellipsis: true
  },
  {
    title: '有销量商品占比',
    dataIndex: 'existSaleProportion',
    key: 'existSaleProportion',
    scopedSlots: { customRender: 'existSaleProportion' },
    ellipsis: true
  },
  {
    title: '新增在售商品数量',
    dataIndex: 'newAddProduct',
    key: 'newAddProduct',
    ellipsis: true
  },
  {
    title: '新增在售商品占比',
    dataIndex: 'newAddProductProportion',
    key: 'newAddProductProportion',
    scopedSlots: { customRender: 'newAddProductProportion' },
    ellipsis: true
  }
]

import Stat from '@/api/stat'
import TileFilter from '@/components/tableFilter/Tile'
import { mapState } from 'vuex'
import dataBrandMixins from '@/mixins/dataBrandMxins'
import moment from 'moment'
export default {
  mixins: [dataBrandMixins],
  components: {
    TileFilter
  },
  watch: {
    'searchParams.site': {
      handler() {
        this.siteChange()
      },
      deep: true
    }
  },
  computed: {
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
        },
        {
          itemType: 'tileDate',
          label: '时间',
          key: 'createDate',
          key2: 'createDateType',
          itemProp: {
            style: 'width:190px'
          },
          itemData: [
            {
              value: 3,
              label: '近7天'
            }
          ]
        }
      ]
    }
  },
  data() {
    return {
      moment,
      columns,
      siteStoreList: [],
      storeList: [],
      productData: { productDataResultDTOS: [] },
      isLoading: false
    }
  },
  mounted() {
    this.siteChange()

    this.getProductData()
  },
  methods: {
    //刷新数据
    getNewData() {
      this.isLoading = true
      Stat.getNewProductData({})
        .then((res) => {
          console.log(res)
          this.getProductData()
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    //搜索
    async handleSearch(val) {
      if (!val) {
        //确定查询
        console.log(this.searchParams)
        this.submitIng = true
        // 获取店铺商品销量排行
        await this.getProductData()

        this.submitIng = false
      }
    },
    async getProductData() {
      let params = this.searchParams
      await Stat.getProductData(params).then((res) => {
        this.$data.productData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './scss/stat.scss';
</style>
