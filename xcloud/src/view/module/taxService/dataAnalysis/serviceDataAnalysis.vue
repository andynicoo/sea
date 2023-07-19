<template>
  <div class="container">
    <div class="content">
      <Row type="flex"
           justify="space-between"
           align="middle"
           class-name="content-title">
        <Col span="6">
        <p class="title-name">服务数据概览</p>
        </Col>
        <Col span="7">
        <div class="timepicker flex">
          <Select clearable
                  v-model="serviceDataObj.countryCode"
                  style="width: 100px;margin-right:10px;"
                  placeholder="税号国家">
            <Option value="">全部国家</Option>
            <Option v-for="(item,index) in countryList"
                    :value="item.countryCode"
                    :key="index">{{ item.countryNameZh }}</Option>
          </Select>
          <DatePicker type="year"
                      :value="currentYear"
                      @on-change="dateChange"
                      placeholder="选择年份"
                      style="width: 100px;margin-right:10px;"></DatePicker>
          <Select clearable
                  v-model="serviceDataObj.month"
                  style="width: 100px;margin-right:10px;"
                  placeholder="选择月份">
            <Option v-for="(item,index) in monthList"
                    :value="item.month"
                    :key="index">{{ item.monthLabel }}</Option>
          </Select>
          <Button type="primary"
                  @click="searchList"
                  style="margin-left:10px;">查询</Button>
        </div>
        </Col>
      </Row>
      <Row>
        <div class="list">
          <div class="box">
            <p class="top">
              <img src="@/assets/images/home/icon8.png"
                   alt="">
              <span class="word">注册税号数</span>
              <span class="num">{{serviceData.registerCount || 0}}</span>
            </p>
            <p class="bottom">
              下发税号数 {{serviceData.registerCompleteCount || 0}}
            </p>
          </div>
          <div class="box">
            <p class="top">
              <img src="@/assets/images/home/icon9.png"
                   alt="">
              <span class="word">转代理数</span>
              <span class="num">{{serviceData.transformProxyCount || 0}}</span>
            </p>
            <p class="bottom">
              转代理成功数 {{serviceData.transformProxyCompleteCount || 0}}
            </p>
          </div>
          <div class="box">
            <p class="top">
              <img src="@/assets/images/home/icon7.png"
                   alt="">
              <span class="word">注销税号数</span>
              <span class="num">{{serviceData.cancelTaxCount || 0}}</span>
            </p>
            <p class="bottom">
              注销成功数 {{serviceData.cancelTaxCompleteCount || 0}}
            </p>
          </div>
          <div class="box">
            <p class="top">
              <img src="@/assets/images/home/icon10.png"
                   alt="">
              <span class="word">税务稽查数</span>
              <span class="num">{{serviceData.taxCheckCount || 0}}</span>
            </p>
            <p class="bottom">
              已处理 {{serviceData.taxCheckCompleteCount || 0}}
            </p>
          </div>
        </div>
      </Row>
      <Row>
        <div class="businessAnalysis"
             ref="businessAnalysis">
          <div class="title">
            各国服务情况总览
          </div>
          <div class="businessContent">
            <div class="chartContent">
              <DatePicker type="daterange"
                          split-panels
                          :value="[this.countryDataObj.startTime, this.countryDataObj.endTime]"
                          @on-change="countryDateChange"
                          placeholder="Select date"
                          style="width: 200px;padding:16px 0px;"></DatePicker>
              <Button type="primary"
                      @click="searchCountryDataList"
                      style="margin-left:10px;">查询</Button>
              <Table :columns="columns"
                     :data="countryData"></Table>

            </div>
          </div>
        </div>
      </Row>
      <Row>
        <div class="businessAnalysis"
             ref="businessAnalysis">
          <div class="title">
            申报数据总览
          </div>
          <div class="businessContent">
            <div class="chartContent">
              <DatePicker type="year"
                          @on-change="taxDateChange"
                          :value="currentYear"
                          placeholder="选择年份"
                          style="width: 100px;margin-right:10px;padding:16px 0px;"></DatePicker>
              <Select clearable
                      v-model="taxDataObj.countryCode"
                      style="width: 100px;margin-right:10px;"
                      placeholder="税号国家">
                <Option value="">全部国家</Option>
                <Option v-for="(item,index) in countryList"
                        :value="item.countryCode"
                        :key="index">{{ item.countryNameZh }}</Option>
              </Select>
              <Button type="primary"
                      @click="getTaxWorkOrder"
                      style="margin-left:10px;">查询</Button>
              <div class="myChart">
                <div v-show="ishasData">
                  <div id="myChart"
                       :style="{width: '100%', height: '300px'}"></div>
                </div>
                <img v-if="!ishasData"
                     src="@/assets/images/home/emptyStatus.png"
                     alt="">
              </div>
            </div>
          </div>
        </div>
      </Row>
    </div>
  </div>

</template>
<script>
import { taxWorkOrderData, taxCountryData, taxServiceData } from '@/api/taxService/overView'
import { getTaxCountry } from '@/api/taxService/common.js';
import echarts from 'echarts'
export default {
  name: '',
  props: {},
  data() {
    return {
      workOrderTotalCount: [],
      workOrderData: [],
      timeValue: '',
      countryList: [],
      monthList: function () {
        let list = []
        for (let index = 1; index < 13; index++) {
          let obj = {
            month: index,
            monthLabel: index + '月'
          }
          list.push(obj)
        }
        return list
      }(),
      currentYear: function (params) {
        let oDay = new Date();
        let year = oDay.getFullYear(); //当前年份
        return year.toString()
      }(),
      currentMonth: function (params) {
        let oDay = new Date();
        let month = oDay.getMonth() + 1; //当前月份
        return month
      }(),
      serviceData: {},
      countryData: [],
      serviceDataObj: {
        year: '',
        countryCode: '',
        month: ''
      },
      countryName: '',
      ishasData: true,
      countryDataObj: {
        startTime: '',
        endTime: ''
      },
      taxDataObj: {
        year: '',
        countryCode: '',
      },
      columns: [
        {
          title: '国家',
          key: 'countryName'
        },
        {
          title: '累计待提交注册资料',
          key: 'registerUploadCount',
          sortable: true
        },
        {
          title: '新增注册税号数',
          key: 'registerCount',
          sortable: true
        },
        {
          title: '审核注册资料数',
          key: 'auditRegisterCount',
          sortable: true
        },
        {
          title: '下发税号数',
          key: 'registerCompleteCount',
          sortable: true
        },
        {
          title: '注册资料驳回数',
          key: 'rejectRegisterCount',
          sortable: true
        },
        {
          title: '累计待提交转代理数',
          key: 'transformUploadCount',
          sortable: true
        },
        {
          title: '新增转代理数',
          key: 'transformCount',
          sortable: true
        },
        {
          title: '审核转代理资料数',
          key: 'auditTransformCount',
          sortable: true
        },
        {
          title: '完成转代理数',
          key: 'transformProxyCompleteCount',
          sortable: true
        },
        {
          title: '转代理资料驳回数',
          key: 'rejectTransformCount',
          sortable: true
        },
      ],
    }
  },
  methods: {
    getTaxWorkOrder() {
      if (this.taxDataObj.year === '') {
        this.$Message.error('请选择年份')
        return
      }
      taxWorkOrderData(this.taxDataObj).then((res) => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) !== '{}') {
            this.workOrderData = res.data
            this.countryList.forEach(element => {
              if (element.countryCode === this.taxDataObj.countryCode) {
                this.countryName = element.countryNameZh
              }
            });
            this.$nextTick(() => {
              this.ishasData = true
              this.workOrderTotalCount = res.data.map((ele) => {
                return ele.totalCount
              })
              this.draw()
            })
          } else {
            this.$nextTick(() => {
              this.ishasData = false
              this.workOrderTotalCount = []
              this.draw()
            })
          }
        }
      })
    },
    searchList() {
      if (this.serviceDataObj.year === '') {
        this.$Message.error('请选择年份')
        return
      }
      taxServiceData(this.serviceDataObj).then(res => {
        if (res.code === 0) {
          this.serviceData = res.data[0]
        }
      }).catch(error => {
        console.log(error)
      })
    },
    searchCountryDataList() {
      if (this.countryDataObj.startTime === '' && this.countryDataObj.endTime === '') {
        this.$Message.error('请选择时间')
        return
      }
      taxCountryData(this.countryDataObj).then(res => {
        if (res.code === 0) {
          this.countryData = res.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getCountryList() {
      getTaxCountry().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data
        }
      })
    },
    draw() {
      let that = this
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
            // show: false
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
          left: '70',
          top: '40',
          width: '90%'
        },
        tooltip: {
          padding: 10,
          backgroundColor: '#222',
          borderColor: '#777',
          borderWidth: 1,
          formatter: function (obj) {
            let monthIndex = Number(obj.name.replace('月', '')) - 1
            let text = ''
            for (let index = 0; index < that.workOrderData.length; index++) {
              if (index === monthIndex) {
                text =
                  `<div style="padding:0px 10px;">
                    <div>${that.countryName === '' ? '全部国家' : that.countryName}${obj.name}数据</div>
                    <div >正常申报:&nbsp;${that.workOrderData[index].regularTaxCount}</div>
                    <div >零申报:&nbsp;&nbsp;&nbsp;&nbsp;${that.workOrderData[index].zeroTaxCount}</div>
                    <div >未申报:&nbsp;&nbsp;&nbsp;&nbsp;${that.workOrderData[index].updateTaxCount}</div>
                  </div>
                `
              }
            }
            return text
          }
        },
        series: [{
          data: this.workOrderTotalCount,
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
    },
    dateChange(val) {
      this.serviceDataObj.year = val
    },
    taxDateChange(val) {
      this.taxDataObj.year = val
    },
    countryDateChange(val) {
      this.countryDataObj.startTime = val[0]
      this.countryDataObj.endTime = val[1]
    },
    getCurrentMonthFirst() {
      var date = new Date()
      date.setDate(1)
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10) month = '0' + month
      if (day < 10) day = '0' + day
      this.countryDataObj.startTime = date.getFullYear() + '-' + month + '-' + day
      return date.getFullYear() + '-' + month + '-' + day

    },
    getCurrentMonthLast() {
      var date = new Date()
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10) month = '0' + month
      if (day < 10) day = '0' + day
      this.countryDataObj.endTime = date.getFullYear() + '-' + month + '-' + day
      return date.getFullYear() + '-' + month + '-' + day
    },
  },
  created() {
    this.getCurrentMonthFirst()
    this.getCurrentMonthLast()
    this.serviceDataObj.year = this.currentYear
    this.serviceDataObj.month = this.currentMonth
    this.taxDataObj.year = this.currentYear
    this.getCountryList()
    this.getTaxWorkOrder()
    this.searchList()
    this.searchCountryDataList()
  },
}
</script>
<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  padding: 10px;
}
/deep/ .ivu-table td {
  font-size: 16px;
  font-family: PingFangSC;
  color: #333333;
  line-height: 14px;
}
/deep/ .ivu-table th {
  font-weight: bold;
}
.content {
  text-align: left;
  .list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .box {
      width: 24%;
      background: #ffffff;
      border-radius: 4px;
      padding: 20px 24px;
      cursor: pointer;
      margin: 14px 0px 24px;
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
  }
  .content-title {
    padding: 20px;
    background: #ffffff;
    border-bottom: 1px solid #e8eaec;
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
    margin-bottom: 20px;
    .title {
      border-bottom: 1px solid #dddddd;
      padding: 20px;
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
      /deep/ .ivu-table th {
        background-color: #16ade933;
        text-align: center;

        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        font-weight: 500;
        color: #333333;
        line-height: 16px;
      }
      /deep/ .ivu-table td {
        text-align: center;

        font-family: PingFangSC;
        color: #333333;
        line-height: 14px;
      }
    }
    .chartContent {
      padding: 0px 24px 24px 24px;
      .myChart {
        text-align: center;
        height: 300px;
        img {
          width: 106px;
          margin-top: 100px;
        }
      }
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
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ivu-back-top {
  bottom: 20px !important;
}
</style>
