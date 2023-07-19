<template>
  <div class="data-preview">
    <div class="data-preview-title">
      <span
        class="title-text"
        @click="$router.push('/overview/index')"
      >业务概览</span>
      <span
        class="title-text g-ml15 tab-current"
        @click="$refs.ostatistics.viewDetails(false)"
      >运营统计分析</span>

      <!-- <span class="title-time">更新时间:{{ updateTime || '--' }}</span> -->
    </div>

    <div class="me-tile-filter">
      <TileFilter
        :col-item="colItem"
        :form-model="searchParams"
        @submit="handleSearch"
      />
      <a-button
        class="me-handle-btn"
        type="primary"
        :loading="submitIng"
        @click="(e) => handleSearch()"
      >查询</a-button>
      <div
        v-if="isChartsDetails"
        class="export-search"
      >
        <a-button
          class="g-mr5"
          type="primary"
          :loading="submitIng"
          @click="(e) => exportData()"
        >导出</a-button>
        <a-input-search
          v-model="searchParams.searchAccount"
          placeholder="请输入用户名"
          style="width: 200px"
          allow-clear
          @search="handleSearch"
        />
      </div>
    </div>
    <OperationStatistics
      ref="ostatistics"
      :search-params="searchParams"
      @changeChartsDetails="changeChartsDetails"
    />
  </div>
</template>

<script>
import {
  downloadDetailsData,
  downloadMgForwarderPackageStatistics
} from '@/api/overview'
import { download } from '@/utils'
import OperationStatistics from './components/OperationStatistics'
import moment from 'moment'
import TileFilter from '@/components/tableFilter/Tile'
export default {
  components: {
    OperationStatistics,
    TileFilter
  },
  data() {
    return {
      updateTime: moment().format('HH:mm'),
      view: 1,
      searchParams: {
        createDate: [],
        createDateType: 3,
        searchAccount: ''
      },
      submitIng: false,
      isChartsDetails: false
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
          itemProp2: {
            'disabled-date': this.disabledDate
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
  created() {
    this.searchParams.createDate = [
      moment().subtract(6, 'days').format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD')
    ]
    this.analysisType = this.$route.query.type
    if (this.analysisType) {
      this.searchParams = JSON.parse(localStorage.searchParams)
      // this.$refs.ostatistics.viewDetails(true, this.analysisType)
    }
  },
  methods: {
    changeChartsDetails(val) {
      this.isChartsDetails = val
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },
    // 导出
    async exportData() {
      try {
        let parmas = {
          startTime: this.searchParams.createDate[0],
          endTime: this.searchParams.createDate[1]
        }
        let result = ''
        if (this.$refs.ostatistics.currentNum === 11) {
          parmas.searchType = 1
          result = await downloadMgForwarderPackageStatistics(parmas)
        } else if (this.$refs.ostatistics.currentNum === 12) {
          parmas.searchType = 2
          result = await downloadMgForwarderPackageStatistics(parmas)
        } else {
          // this.currentNum > 3 ? this.currentNum - 2 : this.currentNum
          parmas.downloadCode =
            this.$refs.ostatistics.currentNum > 3
              ? this.$refs.ostatistics.currentNum - 2
              : this.$refs.ostatistics.currentNum
          parmas.sortField = 'DESC'
          if (this.$refs.ostatistics.currentNum === 4) {
            parmas.downloadCode = 9
          }
          if (this.$refs.ostatistics.currentNum === 5) {
            parmas.downloadCode = 10
          }
          result = await downloadDetailsData(parmas)
        }
        download(
          result,
          this.$refs.ostatistics.showData[this.$refs.ostatistics.currentNum]
            .title + '详情'
        )
        this.$message.success('导出成功')
      } catch (error) {
        console.error(error)
      }
    },
    // 切换概览和分析
    changeView(val) {
      this.view = val
    },
    // 时间维度搜索
    async handleSearch(val) {
      // if (!val) {
      // 确定查询
      console.log(this.searchParams)
      if (
        (this.searchParams.createDateType === 9 &&
          this.searchParams.createDate.length === 0) ||
        this.searchParams.createDate[0] === ''
      ) {
        return this.$message.warning('请选择时间！')
      }
      if (
        moment(this.searchParams.createDate[1]).diff(
          moment(this.searchParams.createDate[0]),
          'days'
        ) < 6
      ) {
        return this.$message.warning('时间间隔不能小于7！')
      }
      // if (this.$refs.ostatistics.chartsDetails) {
      this.$refs.ostatistics.loadData()
      // } else {
      this.$refs.ostatistics.loadInfo()
      // }
      // this.submitIng = true
      // // 获取店铺商品销量排行
      // await this.getSalesData()

      // this.submitIng = false
      // }
    }
  }
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
.export-search {
  float: right;
  .g-mr5 {
    vertical-align: top;
  }
}
</style>
