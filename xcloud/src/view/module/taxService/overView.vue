<template>
  <div class="container">
    <div class="content">
      <Row type="flex"
           justify="space-between"
           align="middle"
           class-name="content-title">
        <Col span="6">
        <p class="title-name">流程进度</p>
        </Col>
        <Col span="7">
        <div class="timepicker">
          <DatePicker type="daterange"
                      :value="timeValue"
                      @on-change="dateChange($event, 1)"
                      placeholder="Select date"
                      style="width: 200px"></DatePicker>
          <Button type="primary"
                  @click="searchList"
                  style="margin-left:10px;">查询</Button>
        </div>
        </Col>
      </Row>
      <Row>
        <div class="itemList">
          <div class="item">
            <div class="item-title">
              新增用户数
              <img src="@/assets/images/home/info-circle.png"
                   alt="">
            </div>
            <div class="item-content">
              12656
              <span class="item-unit">
                人
              </span>
            </div>
          </div>
          <div class="item">
            <div class="item-title">
              成交用户数
              <img src="@/assets/images/home/info-circle.png"
                   alt="">
            </div>
            <div class="item-content">
              12656
              <span class="item-unit">
                人
              </span>
            </div>
          </div>
          <div class="item">
            <div class="item-title">
              客单价
              <img src="@/assets/images/home/info-circle.png"
                   alt="">
            </div>
            <div class="item-content">
              12656
              <span class="item-unit">
                ¥
              </span>
            </div>
          </div>
          <div class="item">
            <div class="item-title">
              购买服务数
              <img src="@/assets/images/home/info-circle.png"
                   alt="">
            </div>
            <div class="item-content">
              12656
              <span class="item-unit">
                个
              </span>
            </div>
          </div>
          <div class="item">
            <div class="item-title">
              续费订单数
              <img src="@/assets/images/home/info-circle.png"
                   alt="">
            </div>
            <div class="item-content">
              12656
              <span class="item-unit">
                单
              </span>
            </div>
          </div>
          <div class="item">
            <div class="item-title">
              支付订单数
              <img src="@/assets/images/home/info-circle.png"
                   alt="">
            </div>
            <div class="item-content">
              12656
              <span class="item-unit">
                单
              </span>
            </div>
          </div>
          <div class="item">
            <div class="item-title">
              支付订单数
              <img src="@/assets/images/home/info-circle.png"
                   alt="">
            </div>
            <div class="item-content">
              12656
              <span class="item-unit">
                单
              </span>
            </div>
          </div>
          <div class="item">
            <div class="item-title"
                 style="color:#16ADE9;">
              复购率
              <img src="@/assets/images/home/info-circle.png"
                   alt="">
            </div>
            <div class="item-content">
              80%
            </div>
          </div>

        </div>
      </Row>
      <Row>
        <div class="businessAnalysis"
             ref="businessAnalysis">
          <div class="title">
            业务数据分析
          </div>
          <div class="businessContent">
            <div class="businessSwiper">
              <div class="left">
                <img src="@/assets/images/home/leftIcon.png"
                     @click="move(0)"
                     alt="">
              </div>
              <div class="center">
                <div class="list"
                     ref="list">
                  <div class="box active">
                    <p class="top">
                      <img src="@/assets/images/home/icon1.png"
                           alt="">
                      <span class="word">线索总数</span>
                      <span class="num">38696</span>
                    </p>
                    <p class="bottom"
                       @click="getTaxWorkOrder">
                      今日新增线索 20
                    </p>
                  </div>
                  <div class="box">
                    <p class="top">
                      <img src="@/assets/images/home/icon1.png"
                           alt="">
                      <span class="word">线索总数</span>
                      <span class="num">38696</span>
                    </p>
                    <p class="bottom">
                      今日新增线索 20
                    </p>
                  </div>
                  <div class="box">
                    <p class="top">
                      <img src="@/assets/images/home/icon1.png"
                           alt="">
                      <span class="word">线索总数</span>
                      <span class="num">38696</span>
                    </p>
                    <p class="bottom">
                      今日新增线索 20
                    </p>
                  </div>
                  <div class="box">
                    <p class="top">
                      <img src="@/assets/images/home/icon1.png"
                           alt="">
                      <span class="word">线索总数</span>
                      <span class="num">38696</span>
                    </p>
                    <p class="bottom">
                      今日新增线索 20
                    </p>
                  </div>
                  <div class="box">
                    <p class="top">
                      <img src="@/assets/images/home/icon1.png"
                           alt="">
                      <span class="word">线索总数</span>
                      <span class="num">38696</span>
                    </p>
                    <p class="bottom">
                      今日新增线索 20
                    </p>
                  </div>
                  <div class="box">
                    <p class="top">
                      <img src="@/assets/images/home/icon1.png"
                           alt="">
                      <span class="word">线索总数</span>
                      <span class="num">38696</span>
                    </p>
                    <p class="bottom">
                      今日新增线索 20
                    </p>
                  </div>
                </div>
              </div>
              <div class="right">
                <img src="@/assets/images/home/rightIcon.png"
                     @click="move(-235)"
                     alt="">
              </div>
            </div>
            <div class="chartContent">
              <DatePicker type="year"
                          placeholder="Select month"
                          style="width: 100px"></DatePicker>
              <div id="myChart"
                   :style="{width: '100%', height: '300px'}"></div>
            </div>
          </div>
        </div>
      </Row>
    </div>
  </div>

</template>
<script>
import { taxWorkOrderData } from '@/api/taxService/overView'
import echarts from 'echarts'
export default {
  name: '',
  props: {},
  data() {
    return {
      workOrderTotalCount: [],
      taxData: [],
      timeValue: ''
    }
  },
  methods: {
    getTaxWorkOrder() {
      taxWorkOrderData({
        year: '2020'
      }).then((res) => {
        if (res.code === 0) {
          this.taxData = res.data
          this.$nextTick(() => {
            this.workOrderTotalCount = this.taxData.map((ele) => {
              return ele.totalCount
            })
            console.log('this.workOrderTotalCount', this.workOrderTotalCount)
            this.draw()
          })
        }
      })
    },
    searchList() {

    },
    dateChange() {

    },
    move(distance) {
      this.$refs.list.style.transform = `translateX(${distance}px)`
    },
    draw() {
      let myChart = echarts.init(document.getElementById('myChart'))
      let xAxisList = []
      for (let index = 1; index < 13; index++) {
        let item = index + '月'
        xAxisList.push(item)
      }
      // 绘制图表
      let option = {
        xAxis: {
          type: 'category',
          data: xAxisList,
          axisLine: {
            show: false,
            onZero: true,
          },
          minInterval: 1,
          axisTick: {
            show: false
          },
          axisLabel: {
            fontWeight: 'bold',
            fontSize: 14
          },
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false,
            onZero: true
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            fontWeight: 'bold',
            fontSize: 14
          },
        },
        grid: {
          left: '40',
          top: '40',
          width: '95%'
        },
        // backgroundColor: 
        tooltip: {
          padding: 10,
          backgroundColor: '#222',
          borderColor: '#777',
          borderWidth: 1,
          formatter: function (obj) {
            console.log('obj', obj)
          }
        },
        series: [{
          data: [20, 320, 140, 54, 654, 543, 650, 54, 430, 32, 54, 521],
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#1890FF',
          },
          areaStyle: {
            color: '#1890FF33',
          },
          symbol: 'circle',
          symbolSize: 7,
          itemStyle: {
            normal: {
              color: "#1890FF",
            }
          },
        }]
      };

      myChart.setOption(option);
    }
  },
  mounted() {
    this.draw()
  },
  created() {

  },
}
</script>
<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  padding: 10px;
}
.content {
  text-align: left;
  .content-title {
    padding: 14px;
    background: #ffffff;
    border-bottom: 1px solid #e8eaec;
    margin-bottom: 14px;
    .timepicker {
      float: right;
    }
  }
  .itemList {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    .item {
      // min-width: 155px;
      width: 11.5%;
      height: 88px;
      background: #ffffff;
      border-radius: 4px;
      padding: 12px;
      .item-title {
        font-size: 14px;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #999999;
        line-height: 22px;
        img {
          width: 10px;
          float: right;
          margin-top: 5px;
        }
      }
      .item-content {
        font-size: 22px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 38px;
      }
      .item-unit {
        font-size: 14px;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #999999;
        line-height: 22px;
      }
    }
  }
  .businessAnalysis {
    background: #ffffff;
    .title {
      border-bottom: 1px solid #dddddd;
      padding: 20px 24px;
      font-size: 18px;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
    .businessContent {
      .businessSwiper {
        padding: 20px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left,
        .right {
          display: none;
          img {
            width: 16px;
            cursor: pointer;
          }
        }
        @media screen and (max-width: 1600px) {
          .left,
          .right {
            display: block;
          }
        }
        .center {
          width: 100%;
          height: 110px;
          margin: 0px 12px;
          position: relative;
          overflow: hidden;
          .list {
            display: flex;
            align-items: center;
            position: absolute;
            left: 0px;
            top: 0px;
            transition: 0.5s ease;
            width: 100%;
            .box {
              min-width: 221px;
              width: 16.6%;
              border-top: 1px solid #e9e9e9;
              border-bottom: 1px solid #e9e9e9;
              border-right: 1px solid #e9e9e9;
              padding: 20px 16px;
              background: rgba(153, 153, 153, 0.08);
              cursor: pointer;
              .top {
                display: flex;
                align-items: center;
                img {
                  width: 24px;
                  height: 24px;
                  margin-right: 12px;
                }
                .word {
                  font-size: 16px;
                  font-family: SourceHanSansSC-Medium, SourceHanSansSC;
                  font-weight: 500;
                  color: rgba(0, 0, 0, 0.85);
                  line-height: 24px;
                  margin-right: 10px;
                }
                .num {
                  font-size: 24px;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: 500;
                  color: #333333;
                  line-height: 32px;
                }
              }
              .bottom {
                font-size: 14px;
                font-family: SourceHanSansSC-Normal, SourceHanSansSC;
                font-weight: 400;
                color: #666666;
                line-height: 20px;
                margin-top: 10px;
                padding-left: 35px;
              }
            }
            .active {
              box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.09);
              background: #ffffff;
              border-radius: 4px 0px 0px 4px;
              border: 1px solid #e9e9e9;
            }
          }
        }
      }
    }
    .chartContent {
      padding: 0px 24px 0px 24px;
    }
  }
  .unit {
    font-size: 16px;
  }
  .title-name {
    font-size: 18px;
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 18px;
  }
  .content-type {
    padding: 20px;
    background: #ffffff;
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
  .topSearch {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0px 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #dcdee2;
    .title-name {
      line-height: 20px;
      font-size: 14px;
      color: #17233d;
      font-weight: bold;
    }
  }
}

.bottom {
  margin-top: 15px;
}

.pageContent {
  text-align: right;
  padding-top: 20px;
}

.num-info {
  .title {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    height: 22px;
    line-height: 22px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
  }
  .value {
    .total {
      color: rgba(0, 0, 0, 0.85);
      display: inline-block;
      line-height: 32px;
      height: 32px;
      font-size: 24px;
      margin-right: 32px;
    }
    .subtotal {
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      vertical-align: top;
      margin-right: 0;
      i {
        font-size: 22px;
        color: red;
        transform: scale(0.82);
        margin-left: 4px;
      }
    }
  }
}

#chart,
#myChart {
  width: 100%;
  height: 100px;
  margin: auto;
  top: -10px;
}

#search,
#search1 {
  height: 100px;
}

#pie {
  height: 300px;
}

#sale,
#scan {
  height: 300px;
}

.ivu-divider-horizontal {
  margin: 10px 0;
}

.txt-left {
  text-align: left;
  .title,
  a {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
  .num {
    font-size: 30px;
    color: #000;
    margin-bottom: 10px;
  }
  .des,
  .footer {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    i {
      font-size: 22px;
      margin-right: 10px;
    }
  }
  .des {
    margin-top: 23px;
  }
  .chart_divider {
    margin-top: -55px;
  }
  .progress {
    margin: 8px 0;
  }
}

.tab {
  margin-top: 15px;
  padding: 20px 10px 15px;
  background-color: #fff;
  .extra-item {
    display: inline-block;
    margin-right: 24px;
    a {
      margin-left: 24px;
    }
  }
  .title {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    text-align: left;
  }
}
</style>
