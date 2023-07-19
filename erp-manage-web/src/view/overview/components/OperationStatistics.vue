<template>
  <div>
    <a-row
      :class="{ 'height-zero': chartsDetails }"
      class="echarts-list"
      :gutter="16"
    >
      <a-col
        class="echarts-item"
        span="12"
        @click="viewDetails(true, 0)"
      >
        <!-- <b @click.prevent="viewDetails(true, 0)">详情 ></b> -->
        <StatisCharts :show-data="showData[0]" />
      </a-col>
      <a-col
        class="echarts-item"
        span="12"
        @click="viewDetails(true, 1)"
      >
        <!-- <b @click.prevent="viewDetails(true, 1)">详情 ></b> -->
        <StatisCharts :show-data="showData[1]" />
      </a-col>
      <a-col
        class="echarts-item"
        span="12"
        @click="viewDetails(true, 2)"
      >
        <!-- <b @click.prevent="viewDetails(true, 2)">详情 ></b> -->
        <StatisCharts :show-data="showData[2]" />
      </a-col>
      <a-col
        class="echarts-item"
        span="12"
        @click="viewDetails(true, 3)"
      >
        <!-- <b @click.prevent="viewDetails(true, 3)">详情 ></b> -->
        <StatisCharts :show-data="showData[3]" />
      </a-col>
      <a-col
        class="echarts-item"
        span="12"
        @click="viewDetails(true, 4)"
      >
        <!-- <b @click.prevent="viewDetails(true, 4)">详情 ></b> -->
        <StatisCharts :show-data="showData[4]" />
      </a-col>
      <a-col
        class="echarts-item"
        span="12"
        @click="viewDetails(true, 5)"
      >
        <!-- <b @click.prevent="viewDetails(true, 5)">详情 ></b> -->
        <StatisCharts :show-data="showData[5]" />
      </a-col>
      <a-col
        class="echarts-item"
        span="12"
        @click="viewDetails(true, 6)"
      >
        <!-- <b @click.prevent="viewDetails(true, 6)">详情 ></b> -->
        <StatisCharts :show-data="showData[6]" />
      </a-col>
      <a-col
        class="echarts-item"
        span="12"
        @click="viewDetails(true, 7)"
      >
        <!-- <b @click.prevent="viewDetails(true, 7)">详情 ></b> -->
        <StatisCharts :show-data="showData[7]" />
      </a-col>
      <a-col
        class="echarts-item"
        span="12"
        @click="viewDetails(true, 8)"
      >
        <!-- <b @click.prevent="viewDetails(true, 8)">详情 ></b> -->
        <StatisCharts :show-data="showData[8]" />
      </a-col>
      <a-col
        class="echarts-item"
        span="12"
        @click="viewDetails(true, 9)"
      >
        <!-- <b @click.prevent="viewDetails(true, 9)">详情 ></b> -->
        <StatisCharts :show-data="showData[9]" />
      </a-col>
      <a-col
        class="echarts-item"
        span="12"
        @click="viewDetails(true, 10)"
      >
        <!-- <b @click.prevent="viewDetails(true, 10)">详情 ></b> -->
        <StatisCharts :show-data="showData[10]" />
      </a-col>
      <a-col
        class="echarts-item"
        span="12"
        @click="viewDetails(true, 11)"
      >
        <!-- <b @click.prevent="viewDetails(true, 11)">详情 ></b> -->
        <StatisCharts :show-data="showData[11]" />
      </a-col>
      <a-col
        class="echarts-item"
        span="12"
        @click="viewDetails(true, 12)"
      >
        <!-- <b @click.prevent="viewDetails(true, 12)">详情 ></b> -->
        <StatisCharts :show-data="showData[12]" />
      </a-col>
    </a-row>
    <div :class="{ 'height-zero': !chartsDetails }">
      <div class="dosage-statistics">
        <h2>功能用量统计 / {{ showData[currentNum].title }}详情</h2>
        <a-table
          :pagination="getPagination"
          :columns="columnsB"
          :data-source="dataSource"
          row-key="memberId"
          @change="changePage"
        >
          <template
            slot="account"
            slot-scope="text, record"
          >
            <span
              class="os-link"
              @click="goUser(record)"
            >{{ text }}</span>
          </template>
          <template
            slot="setMealName"
            slot-scope="text"
          >
            {{ text || '-' }}
          </template>
        </a-table>
      </div>
      <a-button @click="viewDetails(false)">返回</a-button>
    </div>
  </div>
</template>

<script>
import {
  loginUserDetails,
  statisticsFunctionUseQuery,
  queryDetailsByField,
  queryBinding,
  queryNoBinding,
  selectMgForwarderPackageCount,
  selectMgForwarderPackageList,
  downloadMgForwarderPackageStatistics
} from '@/api/overview'
import StatisCharts from './StatisCharts'
import tableMixins from '@/mixins/tableMixins'
import { sumBy } from 'lodash'
const initPagination = {
  current: 1,
  size: 10
}
export default {
  components: {
    StatisCharts
  },
  mixins: [tableMixins],
  props: {
    searchParams: {
      type: Object
    }
  },
  data() {
    return {
      titleName: [
        '登录',
        '授权',
        '创建',
        '翻译',
        '采集',
        '采集',
        '刊登',
        '编辑',
        '修图',
        '翻译',
        '发布',
        '打包',
        '打包'
      ],
      autoLoad: false,
      currentNum: 0,
      chartsDetails: false,
      analysisType: '',
      showData: [
        {
          key: 'loginUserCount',
          title: '登录用户数',
          sum: 0,
          data: [],
          chartsId: 'c11'
        },
        {
          key: 'storeAuthorizationCount',
          title: '店铺授权数',
          sum: 0,
          data: [],
          chartsId: 'c1'
        },
        {
          key: 'subAccountCount',
          title: '子账号创建数',
          sum: 0,
          data: [],
          chartsId: 'c2'
        },
        {
          key: 'picTranslateCount',
          title: '图片翻译数',
          sum: 0,
          data: [],
          chartsId: 'c3'
        },
        {
          key: 'noBindingStoreProductCrawlCount',
          title: '未绑定店铺的采集数量',
          sum: 0,
          data: [],
          chartsId: 'c13'
        },
        {
          key: 'bindingStoreProductCrawlCount',
          title: '已绑定店铺的采集数量',
          sum: 0,
          data: [],
          chartsId: 'c12'
        },
        {
          key: 'productPublishCount',
          title: '商品刊登数',
          sum: 0,
          data: [],
          chartsId: 'c4'
        },
        {
          key: 'batchEditCount',
          title: '批量编辑商品数',
          sum: 0,
          data: [],
          chartsId: 'c5'
        },
        {
          key: 'imageRevisionCount',
          title: '在线修图张数',
          sum: 0,
          data: [],
          chartsId: 'c6'
        },
        {
          key: 'translateCount',
          title: '一键翻译描述数量',
          sum: 0,
          data: [],
          chartsId: 'c7'
        },
        {
          key: 'timePushToolCount',
          title: '定时发布商品数',
          sum: 0,
          data: [],
          chartsId: 'c8'
        },
        {
          title: '代打包下单完成数',
          sum: 0,
          data: [],
          chartsId: 'c9'
        },
        {
          title: '发起代打包数',
          sum: 0,
          data: [],
          chartsId: 'c10'
        }
      ],
      dataSource: [],
      sortField: 'DESC'
    }
  },
  computed: {
    columnsB() {
      return [
        {
          title: '用户名',
          dataIndex: 'account',
          key: 'account',
          scopedSlots: { customRender: 'account' }
        },
        {
          title: this.titleName[this.currentNum] + '次数',
          dataIndex: 'number',
          key: 'number',
          sorter: (a, b) => a.number - b.number
        },
        {
          title: '最早' + this.titleName[this.currentNum] + '时间',
          dataIndex: 'minTime',
          key: 'minTime'
        },
        {
          title: '最晚' + this.titleName[this.currentNum] + '时间',
          dataIndex: 'maxTime',
          key: 'maxTime'
        },
        {
          title: '付费状态',
          dataIndex: 'setMealName',
          key: 'setMealName',
          scopedSlots: { customRender: 'setMealName' }
        }
      ]
    }
  },
  created() {
    this.analysisType = this.$route.query.type
    if (this.analysisType) {
      this.viewDetails(true, this.analysisType)
    }
    this.loadInfo()
  },
  methods: {
    // 获取数据
    async loadInfo() {
      let params = {
        startTime: this.searchParams.createDate[0],
        endTime: this.searchParams.createDate[1]
      }
      let { data } = await statisticsFunctionUseQuery(params)
      this.showData.forEach((item, index) => {
        this.showData[index].data = data[item.key]
        this.showData[index].sum = sumBy(data[item.key], 'number')
      })
      let res1 = await selectMgForwarderPackageCount({
        searchType: 1,
        ...params
      })
      this.showData[11].data = res1.data
      this.showData[11].sum = sumBy(res1.data, 'number')
      let res2 = await selectMgForwarderPackageCount({
        searchType: 2,
        ...params
      })
      this.showData[12].data = res2.data
      this.showData[12].sum = sumBy(res2.data, 'number')
    },
    // 获取店铺列表
    getTableData() {
      let params = Object.assign(this.paginationData, {
        startTime: this.searchParams.createDate[0],
        endTime: this.searchParams.createDate[1],
        sortField: this.sortField || 'DESC',
        queryField: this.currentNum,
        searchAccount: this.searchParams.searchAccount
      })
      if (this.currentNum === 0) {
        params.queryField = 3
        return loginUserDetails(params)
      } else if (this.currentNum === 4) {
        return queryNoBinding(params)
      } else if (this.currentNum === 5) {
        return queryBinding(params)
      } else if (this.currentNum === 11) {
        params.searchType = 1
        return selectMgForwarderPackageList(params)
      } else if (this.currentNum === 12) {
        params.searchType = 2
        return selectMgForwarderPackageList(params)
      } else {
        params.queryField =
          this.currentNum > 3 ? this.currentNum - 2 : this.currentNum
        return queryDetailsByField(params)
      }
    },
    // 排序，分页改变
    changePage({ pageSize, current }, b, { order }) {
      this.$data.paginationData = {
        ...this.$data.paginationData,
        size: pageSize,
        current
      }
      if (order === 'ascend') {
        this.sortField = 'ASC'
      } else {
        this.sortField = 'DESC'
      }
      this.loadData()
    },
    async viewDetails(flag, val) {
      this.dataSource = []
      this.chartsDetails = flag
      this.currentNum = Number(val) || 0
      this.$router.replace({
        path: '/overview/analysis',
        query: {
          type: this.currentNum
        }
      })
      // localStorage.currentNum = this.currentNum
      this.$emit('changeChartsDetails', flag)
      if (
        (this.searchParams.createDateType === 9 &&
          this.searchParams.createDate.length === 0) ||
        this.searchParams.createDate[0] === ''
      ) {
        return this.$message.warning('请选择时间！')
      }
      if (flag) {
        this.loadData()
      } else {
        this.$router.replace({
          path: '/overview/analysis'
        })
      }
    },
    goUser(record) {
      localStorage.searchParams = JSON.stringify(this.searchParams)
      this.$router.push({
        path: '/usermanage/all-user',
        query: {
          memberid: record.memberId,
          analysis: true,
          type: this.currentNum
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.echarts-list {
  .echarts-item {
    height: 320px;
    margin-top: 10px;
    position: relative;
    > b {
      position: absolute;
      top: 20px;
      right: 30px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      cursor: pointer;
      &:hover {
        color: #f7622f;
        border-bottom: 1px solid #f7622f;
      }
    }
  }
}
.dosage-statistics {
  background: #fff;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.os-link {
  color: #f7622f;
  text-decoration: underline;
  cursor: pointer;
}
.height-zero {
  height: 0;
  overflow: hidden;
}
</style>
