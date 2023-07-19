<template>
  <div class="data-preview">
    <div class="data-preview-title">
      <span class="title-text tab-current">业务概览</span>
      <span
        class="title-text g-ml15"
        @click="$router.push('/overview/analysis')"
      >运营统计分析</span>

      <!-- <span class="title-time">更新时间:{{ updateTime || '--' }}</span> -->
    </div>

    <a-row
      class="echarts-list"
      :gutter="16"
    >
      <a-col
        class="echarts-item"
        span="8"
      >
        <RegUserCharts />
      </a-col>
      <a-col
        class="echarts-item"
        span="8"
      >
        <UserBindShopCharts />
      </a-col>
      <a-col
        class="echarts-item"
        span="8"
      >
        <ShopCharts />
      </a-col>
      <a-col
        class="echarts-item"
        span="12"
      >
        <OrderCharts />
      </a-col>
      <a-col
        class="echarts-item"
        span="12"
      >
        <TurnoverCharts />
      </a-col>
    </a-row>
    <a-row
      :gutter="16"
      class="retention"
    >
      <a-col :span="24"><Retentioncharts /></a-col>
    </a-row>
  </div>
</template>

<script>
import RegUserCharts from './components/RegUserCharts'
import ShopCharts from './components/ShopCharts'
import OrderCharts from './components/OrderCharts'
import TurnoverCharts from './components/TurnoverCharts'
import Retentioncharts from './components/Retentioncharts'
import UserBindShopCharts from './components/UserBindShopCharts'
import moment from 'moment'
export default {
  components: {
    RegUserCharts,
    ShopCharts,
    OrderCharts,
    TurnoverCharts,
    Retentioncharts,
    UserBindShopCharts
  },
  data() {
    return {
      updateTime: moment().format('HH:mm')
    }
  },
  computed: {
    colItem() {
      return [
        {
          itemType: 'tileDate',
          label: '筛选时间',
          key: 'createDate',
          key2: 'createDateType',
          itemProp: {
            style: 'width:190px'
          },
          itemData: [
            {
              value: 3,
              label: '近7天'
            },
            {
              value: 7,
              label: '本月'
            },
            {
              value: 8,
              label: '上月'
            },
            {
              value: 9,
              label: '自定义日期'
            }
          ]
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.data-preview {
  // background-color: #fff;
  // padding: 16px;
  .echarts-list {
    .echarts-item {
      height: 270px;
      margin-top: 10px;
    }
  }
  .retention {
    margin-top: 8px;
  }
  /deep/ .ant-empty-description {
    color: rgba(0, 0, 0, 0.25);
  }
  .data-preview-title {
    .title-text {
      font-size: 20px;
      font-weight: 500;
      color: #212226;
      cursor: pointer;
    }
    .title-time {
      color: #acadb3;
      margin-left: 8px;
    }
    .tab-current {
      color: #f7622f;
      border-bottom: 1px solid #f7622f;
    }
  }
}
.me-tile-filter {
  background: #fff;
  margin-top: 10px;
  padding: 10px;
  .me-page-search,
  /deep/ .me-search-item {
    padding: 0;
  }
  .me-page-search {
    display: inline-block;
  }
}
</style>
