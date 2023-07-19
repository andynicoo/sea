<template>
  <div class="echart-wrap">
    <div class="echart-box">
      <div class="echart-title">
        <div class="text">销售额趋势</div>
        <div class="data-show">
          <div class="show-box">
            <p class="show-title">销售额</p>
            <p class="show-value">￥ {{ resData.amountMoneyStatistics | formatQianFenWei }}</p>
            <p class="show-percent">
              <span v-if="typeof resData.amountMoneyMonthOnYearStatistics === 'number'">
                环比 {{ resData.amountMoneyMonthOnYearStatistics }} %
              </span>
              <span v-else>环比 -</span>
              <i v-if="resData.amountMoneyMonthOnYearStatistics > 0" class="el-icon-top arrow-up"></i>
              <i v-else-if="resData.amountMoneyMonthOnYearStatistics < 0" class="el-icon-bottom arrow-down"></i>
            </p>
            <p class="show-percent">
              <span v-if="typeof resData.amountMoneyYearOnYearStatistics === 'number'">
                同比 {{ resData.amountMoneyYearOnYearStatistics }} %
              </span>
              <span v-else>同比 -</span>
              <i v-if="resData.amountMoneyYearOnYearStatistics > 0" class="el-icon-top arrow-up"></i>
              <i v-else-if="resData.amountMoneyYearOnYearStatistics < 0" class="el-icon-bottom arrow-down"></i>
            </p>
          </div>
          <div class="show-box">
            <p class="show-title">商品销量</p>
            <p class="show-value">{{ resData.productSalesStatistics || 0 }}</p>
            <p class="show-percent">
              <span v-if="typeof resData.productSalesMonthOnYearStatistics === 'number'">
                环比 {{ resData.productSalesMonthOnYearStatistics }} %
              </span>
              <span v-else>环比 -</span>
              <i v-if="resData.productSalesMonthOnYearStatistics > 0" class="el-icon-top arrow-up"></i>
              <i v-else-if="resData.productSalesMonthOnYearStatistics < 0" class="el-icon-bottom arrow-down"></i>
            </p>
            <p class="show-percent">
              <span v-if="typeof resData.productSalesYearOnYearStatistics === 'number'">
                同比 {{ resData.productSalesYearOnYearStatistics }} %
              </span>
              <span v-else>同比 -</span>
              <i v-if="resData.productSalesYearOnYearStatistics > 0" class="el-icon-top arrow-up"></i>
              <i v-else-if="resData.productSalesYearOnYearStatistics < 0" class="el-icon-bottom arrow-down"></i>
            </p>
          </div>
          <div class="more">
            <el-button type="primary" @click="more()">更 多</el-button>
          </div>
        </div>
      </div>
      <div class="echart-cont">
        <div ref="myChart" class="charts" style="height: 100%"></div>
      </div>
    </div>
    <saleMoreModal
      ref="saleMoreModal"
      title="销售额趋势"
      :formModal="formModal"
      :type="1"
      keyStr="orderSalesModelVOList"
    />
  </div>
</template>

<script>
import echarts from 'echarts';
import { on, off } from '@/libs/tools';
import saleMoreModal from './saleMoreModal.vue';

export default {
  components: {
    saleMoreModal,
  },
  data() {
    return {
      myChart: null,
    };
  },
  props: {
    resData: {
      default: () => {},
    },
    formModal: {
      default: () => {},
    },
  },
  watch: {
    resData(newVal) {
      this.$nextTick(() => {
        this.setEchartBar(this.resData.orderSalesModelVOList.records || []);
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.myChart = echarts.init(this.$refs.myChart);
      on(window, 'resize', this.resize);
    });
  },
  methods: {
    // 更多
    more() {
      this.$refs.saleMoreModal.showModal = true;
    },
    // 渲染图表 Bar
    setEchartBar(dataList) {
      this.myChart.setOption({
        color: ['#169BD5', '#ED7D31'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          bottom: 0,
          left: 'center',
        },
        grid: {
          top: 10,
          right: 30,
          bottom: 30,
          left: 10,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: dataList.map((v) => v.groupByTypeName),
          axisPointer: {
            type: 'shadow',
          },
        },
        yAxis: [
          {
            type: 'value',
            name: '销售额',
            // min: 0,
            // max: 100,
            // interval: 10,
            axisLabel: {
              formatter: '￥ {value}',
            },
          },
          {
            type: 'value',
            name: '商品销量',
            // min: 0,
            // max: 100000,
            // interval: 10000,
            // axisLabel: {
            //   formatter: '￥ {value}'
            // }
          },
        ],
        series: [
          {
            name: '销售额',
            type: 'line',
            yAxisIndex: 0,
            data: dataList.map((v) => v.amountMoney),
          },
          {
            name: '商品销量',
            type: 'bar',
            barWidth: 30,
            yAxisIndex: 1,
            data: dataList.map((v) => v.productSales),
          },
        ],
      });
    },
    beforeDestroy() {
      off(window, 'resize', this.resize);
    },
    resize() {
      this.myChart.resize();
    },
  },
};
</script>

<style lang="less" scoped>
.echart-box {
  margin: 0 15px 15px;
  .echart-title {
    line-height: 32px;
    .text {
      font-size: 16px;
      font-weight: bold;
      padding-left: 10px;
    }
    .data-show {
      display: flex;
      .show-box {
        width: 23%;
        border: 1px solid #ccc;
        background-color: #f2f2f2;
        border-radius: 4px;
        padding: 10px 25px;
        margin-right: 20px;
        .show-title {
          font-size: 16px;
          line-height: 30px;
          font-weight: bold;
        }
        .show-value {
          font-size: 20px;
          line-height: 30px;
        }
        .show-percent {
          font-size: 12px;
          line-height: 20px;
          .arrow-up {
            color: red;
            font-weight: bold;
          }
          .arrow-down {
            color: green;
            font-weight: bold;
          }
        }
      }
      .more {
        flex: 1;
        position: relative;
        button {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 88px;
        }
      }
    }
  }
  .echart-cont {
    margin-top: 12px;
    height: 550px;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
}
</style>
