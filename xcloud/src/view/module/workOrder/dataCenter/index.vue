<template>
  <div>
    <div class="bigbox bottomline">
      <div class="searchbox">
        <span class="title">整体看板</span>
        <SearchBox ref="search1" @searchChange="reSearch" :countryList="countryList" :types='1'></SearchBox>
      </div>
      <div class="data">
        <div class="numarea">
          <div class="title me-mb2">
            总销售额(元)
            <el-tooltip
              class="item"
              effect="dark"
              content="统计周期内，所有支付订单金额之和（不剔除退款金额）"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="num">￥{{orderViewVO.totalSale}}</div>
        </div>
        <div class="numarea">
          <div class="title me-mb2">
            总订单数
            <el-tooltip
              class="item"
              effect="dark"
              content="统计周期内，产生的所有订单（包括已支付、已取消、已退款等状态下的所有订单）"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="num">{{orderViewVO.totalNum}}</div>
        </div>
        <div class="numarea">
          <div class="title me-mb2">
            支付订单数
            <el-tooltip
              class="item"
              effect="dark"
              content="统计周期内，成功支付的订单数（不剔除退款订单）"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="num">{{orderViewVO.totalPayOrders}}</div>
        </div>
        <div class="numarea">
          <div class="title me-mb2">
            支付件数
            <el-tooltip
              class="item"
              effect="dark"
              content="统计周期内， 成功付款订单的服务件数之和（不剔除退款订单）"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="num">{{orderViewVO.totalThings}}</div>
        </div>
        <div class="numarea">
          <div class="title me-mb2">
            退款金额
            <el-tooltip class="item" effect="dark" content="统计周期内，所有退款订单的总额" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="num">￥{{orderViewVO.totalRefund}}</div>
        </div>
        <div class="numarea">
          <div class="title me-mb2">
            退款订单数
            <el-tooltip class="item" effect="dark" content="统计周期内，申请退款的总订单数" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="num">{{orderViewVO.totalRefundNum}}</div>
        </div>
        <div class="numarea">
          <div class="title me-mb2">
            消费顾客数
            <el-tooltip class="item" effect="dark" content="统计周期内，产生订单的所有顾客数" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="num">{{orderViewVO.consumers}}</div>
        </div>
        <div class="numarea">
          <div class="title me-mb2">
            老顾客数
            <el-tooltip class="item" effect="dark" content="统计周期内，产生订单的老顾客数" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="num">{{orderViewVO.oldConsumers}}</div>
        </div>
        <div class="numarea">
          <div class="title me-mb2">
            新顾客数
            <el-tooltip class="item" effect="dark" content="统计周期内，产生订单的新顾客数" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="num">{{orderViewVO.newConsumers}}</div>
        </div>
      </div>
      <EchartLine
        :titArr="['总销售额', '总订单数', '支付订单数', '支付件数', '退款金额', '消费顾客数', '老顾客数', '新顾客数']"
        :trendList="trendList"
        v-if="trendList.length"
        ref="Echart1"
      ></EchartLine>
    </div>
    <div class="bigbox">
      <div class="searchbox">
        <span class="title">各业务销售额数据看板</span>
        <SearchBox ref="search1" @searchChange2="reSearch2" :countryList="countryList" :types='2'></SearchBox>
      </div>
      <div class="data">
        <div class="numarea" v-for="item in top10sales" :key="item.functionCode">
          <div class="title me-mb2">
            {{item.functionName}}
          </div>
          <div class="num">￥{{item.totalSale}}</div>
        </div>
        <el-link :underline="false" @click="moreData">更多<i class="el-icon-arrow-right"></i></el-link>
      </div>
      <EchartLine
        :titArr="Echart2Tit"
        :trendList="saleTrends"
        v-if="saleTrends.length"
        ref="Echart2"
      ></EchartLine>
    </div>
  </div>
</template>

<script>
import * as comps from './components/index'
import { findCountrys } from '@/api/newApi/processFields/processConfig'
export default {
  components: { ...comps },
  data () {
    return {
      visible: true,
      countryList: [],
      orderViewVO: {}, // 整体看板统计数
      trendList: [], // 整体看板变化趋势
      top10sales: [], // 业务销售看板 统计数，是数组，嗯
      saleTrends: [], // 业务销售看板 变化趋势
      Echart2Tit: [] // 业务销售看板 变化趋势，legend title
    }
  },
  mounted () {
    this.queryCountryList()
  },
  methods: {
    reSearch (data) {
      this.orderViewVO = data.orderViewVO
      this.trendList = data.trendList
      if (this.$refs.Echart1) {
        this.$nextTick(() => {
          this.$refs.Echart1.initDom()
        })
      }
    },
    reSearch2 (data) {
      this.saleTrends = data.saleTrends
      this.top10sales = data.top10sales
      this.Echart2Tit = this.top10sales.map(item => item.functionName)
      if (this.$refs.Echart2) {
        this.$nextTick(() => {
          this.$refs.Echart2.initDom()
        })
      }
    },
    randerDom1 () {
      this.$refs['echart1'].initDom()
    },
    /**
     * 查询国家列表
     */
    queryCountryList () {
      findCountrys().then((res) => {
        if (res.code === 0) {
          this.countryList = res.data
        }
      })
    },
    moreData() {
      this.$router.push({
        path: '/workOrder/dataCenter/salesDetail'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bigbox {
  padding: 10px;
  background: #fff;
  .searchbox {
    display: flex;
    .title {
      font-size: 16px;
      flex: 1;
      white-space: nowrap;
    }
  }
  .data {
    display: flex;
    flex-wrap: wrap;
    padding: 20px 30px;
    .numarea {
      min-width: 150px;
      margin-bottom: 20px;
      .title {
        font-size: 14px;
      }
      .num {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
.bottomline{
  border-bottom: 5px solid #f5f7f9
}
</style>
