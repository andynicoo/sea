<template>
  <div class="container">
    <div class="content">
      <Row type="flex"
           justify="space-between"
           align="middle"
           class-name="content-title">
        <Col span="6">
        <p class="title-name">数据概览</p>
        </Col>
        <Col span="7">
        <div class="timepicker">
          <DatePicker type="daterange"
                      :value="[this.progressDataObj.beginTime, this.progressDataObj.endTime]"
                      @on-change="progressDateChange"
                      placeholder="Select date"
                      style="width: 200px"></DatePicker>
          <Button type="primary"
                  @click="getProgressData"
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
              {{progressData.newUserCount || 0}}
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
              {{progressData.payUserCount || 0}}
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
              {{progressData.averagePrice || 0}}
              <span class="item-unit">

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
              {{progressData.buyServiceCount || 0}}
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
              {{progressData.renewalOrderCount || 0}}
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
              {{progressData.payOrderCount || 0}}
              <span class="item-unit">
                单
              </span>
            </div>
          </div>
          <div class="item">
            <div class="item-title">
              支付总金额
              <img src="@/assets/images/home/info-circle.png"
                   alt="">
            </div>
            <div class="item-content">
              {{progressData.payAmount || 0}}
              <span class="item-unit">
              </span>
            </div>
          </div>
          <div class="item">
            <div class="item-title">
              退款总金额
              <img src="@/assets/images/home/info-circle.png"
                   alt="">
            </div>
            <div class="item-content">
              {{progressData.refundAmount || 0}}
              <span class="item-unit">
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
              {{progressData.repeatPayRate || 0}}%
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
                  <div class="box"
                       style="border-left:1px solid #e9e9e9;"
                       :class="{'active': indexItme === 1}"
                       @click="currentItem(1)">
                    <p class="top">
                      <img src="@/assets/images/home/icon1.png"
                           alt="">
                      <span class="word">线索总数</span>
                      <span class="num">{{businessAnalysisData.clewCount || 0}}</span>
                    </p>
                    <p class="bottom">
                      今日新增线索 {{businessAnalysisData.clewDayCount || 0}}
                    </p>
                  </div>
                  <div class="box"
                       :class="{'active': indexItme === 2}"
                       @click="currentItem(2)">
                    <p class="top">
                      <img src="@/assets/images/home/icon2.png"
                           alt="">
                      <span class="word">注册用户数</span>
                      <span class="num">{{businessAnalysisData.registerUserCount || 0}}</span>
                    </p>
                    <p class="bottom">
                      今日注册用户 {{businessAnalysisData.registerUserDayCount || 0}}
                    </p>
                  </div>
                  <div class="box"
                       :class="{'active': indexItme === 3}"
                       @click="currentItem(3)">
                    <p class="top">
                      <img src="@/assets/images/home/icon3.png"
                           alt="">
                      <span class="word">成交用户数</span>
                      <span class="num">{{businessAnalysisData.payUserCount || 0}}</span>
                    </p>
                    <p class="bottom">
                      今日成交用户 {{businessAnalysisData.payUserDayCount || 0}}
                    </p>
                  </div>
                  <div class="box"
                       :class="{'active': indexItme === 4}"
                       @click="currentItem(4)">
                    <p class="top">
                      <img src="@/assets/images/home/icon4.png"
                           alt="">
                      <span class="word">订单总数</span>
                      <span class="num">{{businessAnalysisData.payOrderCount || 0}}</span>
                    </p>
                    <p class="bottom">
                      今日订单数 {{businessAnalysisData.payOrderDayCount || 0}}
                    </p>
                  </div>
                  <div class="box"
                       :class="{'active': indexItme === 5}"
                       @click="currentItem(5)">
                    <p class="top">
                      <img src="@/assets/images/home/icon5.png"
                           alt="">
                      <span class="word">税号总数</span>
                      <span class="num">{{businessAnalysisData.taxVatServiceCount || 0}}</span>
                    </p>
                    <p class="bottom">
                      今日购买税号数 {{businessAnalysisData.taxVatServiceDayCount || 0}}
                    </p>
                  </div>
                  <div class="box"
                       style="width:300px;"
                       :class="{'active': indexItme === 6}"
                       @click="currentItem(6)">
                    <p class="top">
                      <img src="@/assets/images/home/icon6.png"
                           alt="">
                      <span class="word">成交总金额</span>
                      <span class="num">{{businessAnalysisData.payAmount || 0}}</span>
                    </p>
                    <p class="bottom">
                      今日成交金额 {{businessAnalysisData.payDayAmount || 0}}
                    </p>
                  </div>
                </div>
              </div>
              <div class="right">
                <img src="@/assets/images/home/rightIcon.png"
                     @click="move(-500)"
                     alt="">
              </div>
            </div>
            <div class="chartContent">
              <DatePicker type="year"
                          :value="currentYear"
                          @on-change="businessDateChange"
                          placeholder="选择年月"
                          style="width: 100px;margin-right:10px;"></DatePicker>
              <Select clearable
                      v-model="businessAnalysisObj.month"
                      @on-clear="chearMonth"
                      style="width: 100px;margin-right:0px;"
                      placeholder="选择月份">
                <Option v-for="(item,index) in monthList"
                        :value="item.month"
                        :key="index">{{ item.monthLabel }}</Option>
              </Select>
              <Button type="primary"
                      @click="currentItem(indexItme)"
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
      <Row>
        <div class="departmentContent">
          <div class="title">
            各部门数据分析
          </div>
          <div class="content">
            <DatePicker type="year"
                        :value="currentYear"
                        @on-change="departmentDateChange"
                        placeholder="选择年月"
                        style="width: 100px;margin-right:10px;"></DatePicker>
            <Select clearable
                    v-model="departmentObj.month"
                    style="width: 100px;margin-right:0px;"
                    placeholder="选择月份">
              <Option v-for="(item,index) in monthList"
                      :value="item.month"
                      :key="index">{{ item.monthLabel }}</Option>
            </Select>
            <Button type="primary"
                    @click="getDepartmentData"
                    style="margin-left:10px;">查询</Button>
            <Table style="margin-top:20px;"
                   :columns="departmentColumns"
                   :data="departmentData"></Table>
            <div class="myChartPie">
              <div v-show="isPiehasData">
                <div id="myChartPie"
                     :style="{width: '100%', height: '300px'}"></div>
              </div>
              <img v-if="!isPiehasData"
                   src="@/assets/images/home/emptyStatus.png"
                   alt="">
            </div>
          </div>
        </div>
      </Row>
      <Row>
        <div class="departmentContent">
          <div class="title">
            具体销售情况
          </div>
          <div class="content">
            <DatePicker type="daterange"
                        :value="[this.salesDataObj.startTime, this.salesDataObj.endTime]"
                        @on-change="salesDateChange"
                        placeholder="Select date"
                        style="width: 200px"></DatePicker>
            <Button type="primary"
                    @click="getsalesData"
                    style="margin-left:10px;">查询</Button>
            <Table height="420"
                   style="margin-top:20px;"
                   :columns="salesColumns"
                   :data="salesData"></Table>
          </div>
        </div>
      </Row>
      <Row>
        <div class="departmentContent">
          <div class="title">
            服务数据分析
          </div>
          <div class="content">
            <DatePicker type="daterange"
                        :value="[this.serviceDataObj.beginTime, this.serviceDataObj.endTime]"
                        @on-change="serviceDataChange"
                        placeholder="Select date"
                        style="width: 200px"></DatePicker>
            <Button type="primary"
                    @click="getServiceData"
                    style="margin-left:10px;">查询</Button>
            <Table style="margin-top:20px;"
                   :columns="serviceColumns"
                   :data="serviceData"></Table>
          </div>
        </div>
      </Row>
    </div>
  </div>

</template>
<script>
import {
  progressDataApi,
  businessAnalysisDataApi,
  registerUserViewApi,
  payUserViewApi,
  orderViewApi,
  taxVatServiceViewApi,
  payAmountViewApi,
  department,
  saleInfo,
  serviceAnalysis,
  clewViewApi
} from '@/api/taxService/overView'
import echarts from 'echarts'
export default {
  name: '',
  props: {},
  data() {
    return {
      workOrderTotalCount: [],
      taxData: [],
      indexItme: 2,
      indexTitle: '',
      progressDataObj: {
        beginTime: '',
        endTime: ''
      },
      salesDataObj: {
        startTime: '',
        endTime: ''
      },
      salesData: [],
      salesColumns: [
        {
          title: '排名',
          type: 'index'
        },
        {
          title: '人员',
          key: 'departmentUserName'
        },
        {
          title: '所属部门',
          key: 'departmentName'
        },
        {
          title: '跟进用户数',
          key: 'followUserCount',
          sortable: true
        },
        {
          title: '成交用户数',
          key: 'payUserCount',
          sortable: true
        },
        {
          title: '税号数',
          key: 'taxVatServiceCount',
          sortable: true
        },
        {
          title: '成交金额',
          key: 'payAmount',
          sortable: true
        }
      ],
      serviceDataObj: {
        beginTime: '',
        endTime: ''
      },
      serviceData: [],
      serviceColumns: [
        {
          title: '国家',
          key: 'countryName'
        },
        {
          title: '注册税号数',
          key: 'registerCount',
          sortable: true
        },
        {
          title: '下发税号数',
          key: 'completeCount',
          sortable: true
        },
        {
          title: '转代理数',
          key: 'agentCount',
          sortable: true
        },
        {
          title: '转代理成功数',
          key: 'agentSucceededCount',
          sortable: true
        },
        {
          title: '注销税号数',
          key: 'cancelCount',
          sortable: true
        },
        {
          title: '税务稽查数',
          key: 'checkCount',
          sortable: true
        }
      ],
      progressData: {},
      businessAnalysisData: {},
      businessAnalysisObj: {
        year: '',
        month: ''
      },
      departmentObj: {
        year: '',
        month: ''
      },
      ishasData: true,
      isPiehasData: true,
      departmentColumns: [
        {
          title: '部门',
          key: 'departmentName'
        },
        {
          title: '线索数',
          key: 'clewCount',
          sortable: true
        },
        {
          title: '渠道数',
          key: 'channelCount',
          sortable: true
        },
        {
          title: '注册用户数',
          key: 'registerUserCount',
          sortable: true
        },
        {
          title: '成交用户数',
          key: 'payUserCount',
          sortable: true
        },
        {
          title: '税号数',
          key: 'taxVatServiceCount',
          sortable: true
        },
        {
          title: '成交金额',
          key: 'payAmount',
          sortable: true
        }
      ],
      departmentData: [],
      dailyTotalCount: [],
      dailyOrderTotalCount: [],
      monthList: function () {
        let list = []
        for (let index = 1; index < 13; index++) {
          let obj = {
            month: index.toString(),
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
        return month.toString()
      }(),
    }
  },
  methods: {
    getProgressData() {
      if (this.progressDataObj.beginTime === '' && this.progressDataObj.endTime === '') {
        this.$Message.error('请选择时间')
        return
      }
      progressDataApi(this.progressDataObj).then((res) => {
        if (res.code === 0) {
          this.progressData = res.data
          // console.log(this.progressData)
        }
      })
    },
    getBusinessAnalysisData() {
      businessAnalysisDataApi().then((res) => {
        if (res.code === 0) {
          this.businessAnalysisData = res.data
        }
      })
    },
    dateChange() {

    },
    move(distance) {
      this.$refs.list.style.transform = `translateX(${distance}px)`
    },
    drawOrder() {
      let that = this
      let myChart = echarts.init(document.getElementById('myChart'))
      let xAxisList = []
      if (that.businessAnalysisObj.month === undefined) {
        for (let index = 1; index < 13; index++) {
          let item = index + '月'
          xAxisList.push(item)
        }
      } else {
        for (let index = 1; index < 32; index++) {
          let item = index + '日'
          xAxisList.push(item)
        }
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
            return obj.name + obj.seriesName + '&nbsp;' + obj.value
          }
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          bottom: '0',
          data: ['成交订单', '退款订单'],
        },
        series: [{
          name: '成交订单',
          data: this.dailyTotalCount,
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#1890FF',
          },
          symbol: 'circle',
          symbolSize: 7,
          itemStyle: {
            normal: {
              color: "#1890FF",
            }
          },
        },
        {
          name: '退款订单',
          data: this.dailyOrderTotalCount,
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#FCBB1C',
          },
          symbol: 'circle',
          symbolSize: 7,
          itemStyle: {
            normal: {
              color: "#FCBB1C",
            }
          },
        }]
      };

      myChart.setOption(option, true);
    },
    draw() {
      let that = this
      let myChart = echarts.init(document.getElementById('myChart'))
      let xAxisList = []
      if (that.businessAnalysisObj.month === undefined) {
        for (let index = 1; index < 13; index++) {
          let item = index + '月'
          xAxisList.push(item)
        }
      } else {
        for (let index = 1; index < 32; index++) {
          let item = index + '日'
          xAxisList.push(item)
        }
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
            return obj.name + that.indexTitle + '&nbsp;' + obj.value
          }
        },
        series: [{
          data: this.dailyTotalCount,
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

      myChart.setOption(option, true);
    },
    drawPie() {
      let that = this
      let myChart = echarts.init(document.getElementById('myChartPie'))
      let departmentDataArr = [
        {
          title: '注册用户',
          data: []
        },
        {
          title: '成交用户',
          data: []
        },
        {
          title: '税号数',
          data: []
        },
        {
          title: '成交金额',
          data: []
        },
      ]
      let departmentNameList = []
      that.departmentData.map((ele) => {
        if (ele.departmentName.includes('销售') || ele.departmentName.includes('渠道')) {
          let obj = {
            value: 0,
            name: ''
          }
          departmentNameList.push(ele.departmentName)
          departmentDataArr.forEach((element, index) => {
            switch (element.title) {
              case '注册用户':
                obj = {
                  value: ele.registerUserCount,
                  name: ele.departmentName
                }
                element.data.push(obj)
                break;
              case '成交用户':
                obj = {
                  value: ele.payUserCount,
                  name: ele.departmentName
                }
                element.data.push(obj)
                break;
              case '税号数':
                obj = {
                  value: ele.taxVatServiceCount,
                  name: ele.departmentName
                }
                element.data.push(obj)
                break;
              case '成交金额':
                obj = {
                  value: ele.payAmount,
                  name: ele.departmentName
                }
                element.data.push(obj)
                break;
            }
          });
        }
      })
      let option = {
        title: [],
        color: ["#9CC833", "#FCBB1C", "#028CF8"],
        legend: {
          orient: 'horizontal',
          left: 'center',
          bottom: '0',
          data: departmentNameList
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: []
      };
      for (let i = 0; i < departmentDataArr.length; i++) {
        option.title[i] = {
          text: `${departmentDataArr[i].title}`,
          left: i * 25 + 9 + "%",
          y: "15%",
          textStyle: {
            fontSize: 15,
          },
        }
        option.series[i] = {
          name: `${departmentDataArr[i].title}`,
          type: 'pie',
          radius: '55%',
          bottom: '20',
          center: [`${i * 25 + 12.5}% `, '60%'],
          itemStyle: {
            shadowColor: 'rgba(9, 85, 144, 0.3)',
            shadowBlur: 10
          },
          label: {
            show: false,
          },
          data: departmentDataArr[i].data,
        }
      }
      myChart.setOption(option);
    },
    getCurrentMonthFirst() {
      var date = new Date()
      date.setDate(1)
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10) month = '0' + month
      if (day < 10) day = '0' + day
      this.progressDataObj.beginTime = date.getFullYear() + '-' + month + '-' + day
      this.salesDataObj.startTime = date.getFullYear() + '-' + month + '-' + day
      this.serviceDataObj.beginTime = date.getFullYear() + '-' + month + '-' + day
      return date.getFullYear() + '-' + month + '-' + day

    },
    getCurrentMonthLast() {
      var date = new Date()
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10) month = '0' + month
      if (day < 10) day = '0' + day
      this.progressDataObj.endTime = date.getFullYear() + '-' + month + '-' + day
      this.salesDataObj.endTime = date.getFullYear() + '-' + month + '-' + day
      this.serviceDataObj.endTime = date.getFullYear() + '-' + month + '-' + day
      return date.getFullYear() + '-' + month + '-' + day
    },
    progressDateChange(val) {
      this.progressDataObj.beginTime = val[0]
      this.progressDataObj.endTime = val[1]
    },
    businessDateChange(val) {
      this.businessAnalysisObj.year = val
    },
    departmentDateChange(val) {
      this.departmentObj.year = val
    },
    salesDateChange(val) {
      this.salesDataObj.startTime = val[0]
      this.salesDataObj.endTime = val[1]
    },
    serviceDataChange(val) {
      this.serviceDataObj.beginTime = val[0]
      this.serviceDataObj.endTime = val[1]
    },
    chearMonth(val) {
      this.businessAnalysisObj.month = ''
    },
    compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    },
    registerUserView() {
      registerUserViewApi(this.businessAnalysisObj).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) !== '{}') {
            this.$nextTick(() => {
              this.ishasData = true
              this.dailyTotalCount = res.data.map((ele) => {
                return ele.registerUserCount
              })
              this.draw()
            })
          } else {
            this.$nextTick(() => {
              this.ishasData = false
              this.dailyTotalCount = []
              this.draw()
            })
          }
        }
      })
    },
    payUserView() {
      payUserViewApi(this.businessAnalysisObj).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) !== '{}') {
            this.$nextTick(() => {
              this.ishasData = true
              this.dailyTotalCount = res.data.map((ele) => {
                return ele.payUserCount
              })
              this.draw()
            })
          } else {
            this.$nextTick(() => {
              this.ishasData = false
              this.dailyTotalCount = []
              this.draw()
            })
          }
        }
      })
    },
    orderView() {
      orderViewApi(this.businessAnalysisObj).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) !== '{}') {
            this.$nextTick(() => {
              this.ishasData = true
              this.dailyTotalCount = res.data.map((ele) => {
                return ele.payOrderCount
              })
              this.dailyOrderTotalCount = res.data.map((ele) => {
                return ele.refundOrderCount
              })

              this.drawOrder()
            })
          } else {
            this.$nextTick(() => {
              this.ishasData = false
              this.dailyTotalCount = []
              this.drawOrder()
            })
          }
        }
      })
    },
    taxVatServiceView() {
      taxVatServiceViewApi(this.businessAnalysisObj).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) !== '{}') {
            this.$nextTick(() => {
              this.ishasData = true
              this.dailyTotalCount = res.data.map((ele) => {
                return ele.taxVatServiceCount
              })
              this.draw()
            })
          } else {
            this.$nextTick(() => {
              this.ishasData = false
              this.dailyTotalCount = []
              this.draw()
            })
          }
        }
      })
    },
    clewView() {
      clewViewApi(this.businessAnalysisObj).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) !== '{}') {
            this.$nextTick(() => {
              this.ishasData = true
              this.dailyTotalCount = res.data.map((ele) => {
                return ele.clewCount
              })
              this.draw()
            })
          } else {
            this.$nextTick(() => {
              this.ishasData = false
              this.dailyTotalCount = []
              this.draw()
            })
          }
        }
      })
    },
    payAmountView() {
      payAmountViewApi(this.businessAnalysisObj).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) !== '{}') {
            this.$nextTick(() => {
              this.ishasData = true
              this.dailyTotalCount = res.data.map((ele) => {
                return ele.payAmount
              })
              this.draw()
            })
          } else {
            this.$nextTick(() => {
              this.ishasData = false
              this.dailyTotalCount = []
              this.draw()
            })
          }
        }
      })
    },
    getDepartmentData() {
      department(this.departmentObj).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) !== '{}') {
            this.$nextTick(() => {
              this.isPiehasData = true
              this.departmentData = res.data
              this.drawPie()
            })
          } else {
            this.$nextTick(() => {
              this.departmentData = []
              this.isPiehasData = false
              this.drawPie()
            })
          }
        }
      })
    },
    getsalesData() {
      saleInfo(this.salesDataObj).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) !== '{}') {
            this.salesData = res.data
          } else {
            this.$Message.error('暂无销售数据')
          }
        }
      })
    },
    getServiceData() {
      serviceAnalysis(this.serviceDataObj).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) !== '{}') {
            this.serviceData = res.data
          } else {
            this.$Message.error('暂无服务数据')
          }
        }
      })
    },
    currentItem(item) {
      if (item) {
        this.indexItme = item
      }
      switch (this.indexItme) {
        case 1:
          this.indexTitle = '线索总数'
          this.clewView()
          break;
        case 2:
          this.indexTitle = '注册用户数'
          this.registerUserView()
          break;
        case 3:
          this.indexTitle = '成交用户数'
          this.payUserView()
          break;
        case 4:
          this.indexTitle = '订单总数'
          this.orderView()
          break;
        case 5:
          this.indexTitle = '税号总数'
          this.taxVatServiceView()
          break;
        case 6:
          this.indexTitle = '成交总金额'
          this.payAmountView()
          break;
      }
    }
  },
  created() {
    this.businessAnalysisObj.month = this.currentMonth
    this.businessAnalysisObj.year = this.currentYear
    this.departmentObj.month = this.currentMonth
    this.departmentObj.year = this.currentYear
    this.getCurrentMonthFirst()
    this.getCurrentMonthLast()
    this.getProgressData()
    this.currentItem()
    this.getBusinessAnalysisData()
    this.getDepartmentData()
    this.clewView()
    this.getsalesData()
    this.getServiceData()
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
      width: 10.5%;
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
          display: block;
          img {
            width: 16px;
            cursor: pointer;
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
            // width: 100%;
            .box {
              width: 250px;
              min-width: 250px;
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
        @media screen and (min-width: 1800px) {
          // .left,
          // .right {
          //   display: none;
          // }
          .center {
            .list {
              .box {
                width: 16.5%;
                min-width: 250px;
              }
            }
          }
        }
      }
    }
    .chartContent {
      padding: 0px 24px 0px 24px;
    }
  }
  .departmentContent {
    background: #ffffff;
    margin-top: 24px;
    /deep/ .ivu-table th {
      background-color: #16ade933;
      text-align: center;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: #333333;
      line-height: 14px;
    }
    /deep/ .ivu-table td {
      text-align: center;
      font-family: PingFangSC;
      color: #333333;
      line-height: 14px;
    }
    .title {
      border-bottom: 1px solid #dddddd;
      padding: 20px 24px;
      font-size: 18px;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
    .content {
      padding: 20px 24px;
    }
  }
  .myChart {
    text-align: center;
    height: 300px;
    img {
      width: 106px;
      margin-top: 100px;
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