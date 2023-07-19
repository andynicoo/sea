<template>
  <div>
    <Card>
      <p class="title line"
         style="font-size:18px;">实时概览</p>
      <div class="content-box">
        <p class="content-title">销售额（元）
          <Tooltip placement="right"
                   content="0点截至当前时间，所有支付订单金额之和（不剔除退款金额）"
                   theme="light">
            <img src="@/assets/images/iipto-common/wenhao.svg">
          </Tooltip>
        </p>
        <p class="saleroom">
          <span class="todays">￥{{returnSalesData.todayPayOrderMoney}}</span>
          <span class="yesterday">昨日￥{{returnSalesData.yesterdayPayOrderMoney}}</span>
        </p>
        <div class="sale-data-box">
          <div id="saleroom"
               :style="{width: '90%', height: '350px','margin-top':'10px'}"></div>
          <div class="sale-data-analysis">
            <div class="item">
              <div class="item-title">
                支付订单数
                <Tooltip placement="top-end"
                         content="0点截至当前时间，成功支付的订单数（不剔除退款订单）"
                         theme="light">
                  <img src="@/assets/images/home/info-circle.png">
                </Tooltip>
              </div>
              <p class="todays">{{returnSalesData.todayPayOrderCount}}</p>
              <p class="yesterday">昨日支付订单数
                <span>{{returnSalesData.yesterdayPayOrderCount}}</span>
              </p>
            </div>
            <div class="item">
              <div class="item-title">
                支付人数
                <Tooltip placement="top-end"
                         content="0点截至当前时间，下单并且支付成功的客户数，一人多次付款记为一人。"
                         theme="light">
                  <img src="@/assets/images/home/info-circle.png">
                </Tooltip>
              </div>
              <p class="todays">{{returnSalesData.todayPayUserCount}}</p>
              <p class="yesterday">昨日支付人数
                <span>{{returnSalesData.yesterdayPayUserCount}}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="sale-data-explain">
          订单相关指标（如下单人数）以下单时间统计，支付相关指标（如支付人数）以支付成功时间统计。<br> （注意：用户购物的流程是：“浏览”-“下单“-“支付”。下单与支付是分开的2个操作，下单后，顾客可以继续支付，或者不支付。所有下单相关的指标、支付相关的指标，均与退款无关。即，只要顾客下单了，下单人数+1，只要顾客支付了，支付人数+1，不论顾客最后是否退款，这个下单人数、支付人数都不会因此扣减。）
        </div>
      </div>
    </Card>
    <Card style="margin:24px 0;">
      <div class="title">交易分析
        <div class="date-box">
          <span>统计周期：</span>
          <DatePicker type="daterange"
                      placement="bottom-end"
                      :clearable="false"
                      :value="deafaultDate"
                      :options="options"
                      @on-change="changeDealDate($event,'dealTime')"
                      placeholder="选择周期"
                      style="width: 210px"></DatePicker>
        </div>
      </div>
      <div class="transaction-data-box">
        <div class="transaction-num"
             v-if="JSON.stringify(returnDealData)!='{}'">
          <div class="item">
            <div class="item-title">
              总销售额
              <Tooltip placement="top"
                       content="统计周期内，所有支付订单金额之和（不剔除退款金额）。"
                       theme="light">
                <img src="@/assets/images/home/info-circle.png">
              </Tooltip>
            </div>
            <p class="todays">￥{{returnDealData.orderStatisticsVo.payAmount}}</p>
            <p class="yesterday">今日销售额
              <span>￥{{returnDealData.orderStatisticsVo.payDayAmount}}</span>
            </p>
          </div>
          <div class="item">
            <div class="item-title">
              支付订单数
              <Tooltip placement="top"
                       content="统计周期内，成功支付的订单数（不剔除退款订单）。"
                       theme="light">
                <img src="@/assets/images/home/info-circle.png">
              </Tooltip>
            </div>
            <p class="todays">{{returnDealData.orderStatisticsVo.payOrderCount}}
              <span>单</span>
            </p>
            <p class="yesterday">今日支付订单数
              <span>{{returnDealData.orderStatisticsVo.payOrderDayCount}}单</span>
            </p>
          </div>
          <div class="item">
            <div class="item-title">
              支付人数
              <Tooltip placement="top"
                       content="统计周期内，下单并且支付成功的客户数，一人多次付款记为一人。"
                       theme="light">
                <img src="@/assets/images/home/info-circle.png">
              </Tooltip>
            </div>
            <p class="todays">{{returnDealData.orderStatisticsVo.payUserCount}}
              <span>人</span>
            </p>
            <p class="yesterday">今日支付人数
              <span>{{returnDealData.orderStatisticsVo.payUserDayCount}}人</span>
            </p>
          </div>
          <div class="item">
            <div class="item-title">
              支付件数
              <Tooltip placement="top"
                       content="统计周期内， 成功付款订单的服务件数之和（不剔除退款订单）。"
                       theme="light">
                <img src="@/assets/images/home/info-circle.png">
              </Tooltip>
            </div>
            <p class="todays">{{returnDealData.orderStatisticsVo.payProductCount}}
              <span>件</span>
            </p>
            <p class="yesterday">今日支付件数
              <span>{{returnDealData.orderStatisticsVo.payProductDayCount}}件</span>
            </p>
          </div>
          <div class="item">
            <div class="item-title">
              退款金额
              <Tooltip placement="top-end"
                       content="在统计周期内，所有退款订单的总额。"
                       theme="light">
                <img src="@/assets/images/home/info-circle.png">
              </Tooltip>
            </div>
            <p class="todays">￥{{returnDealData.refundOrderStatisticsVo.refundAmount}}</p>
            <p class="yesterday">今日退款金额
              <span>￥{{returnDealData.refundOrderStatisticsVo.refundDayAmount}}</span>
            </p>
          </div>
        </div>
        <div class="transaction-data">
          <p class="content-title">趋势图
            <Tooltip placement="right"
                     content="在统计周期内，指定统计指标每日的数据，形成趋势图"
                     theme="light">
              <img src="@/assets/images/iipto-common/wenhao.svg">
            </Tooltip>
          </p>
        </div>
      </div>
      <div id="tendency-chart"
           :style="{width: '98%', height: '350px','margin-bottom':'24px'}"></div>
    </Card>
    <Card>
      <div class="title">服务分析
        <div class="date-box">
          <span>统计周期：</span>
          <DatePicker type="daterange"
                      placement="bottom-end"
                      :clearable="false"
                      :value="deafaultDate"
                      :options="options"
                      @on-change="changeDealDate($event,'serviceTime')"
                      placeholder="选择周期"
                      style="width: 210px"></DatePicker>
        </div>
      </div>
      <div class="service-analysis-box">
        <div class="service-item">
          <p class="title">
            服务排行榜
            <Tooltip placement="right"
                     content="服务排行榜：在统计周期内，按购买服务的销售额降序排列。（排名、服务、支付件数、销售额）
销售额：统计周期内，所有支付订单金额之和（不剔除退款金额）。 
支付件数：统计周期内， 成功付款订单的服务件数之和（不剔除退款订单）。"
                     theme="light">
              <img src="@/assets/images/iipto-common/wenhao.svg">
            </Tooltip>
          </p>
          <Table :data="serviceData"
                 :columns="serviceColumns"
                 class="service-data-table"
                 border></Table>
          <Page :total="serviceData.length"
                @on-change="changePageHandler"
                size="small"
                class="service-page" />
        </div>
        <div class="service-item">
          <div class="title">
            服务销售额占比
            <Tooltip placement="right"
                     content="统计周期内，该服务销售额/总的销售额=销售额服务占比。"
                     theme="light">
              <img src="@/assets/images/iipto-common/wenhao.svg">
            </Tooltip>
            <div class="type-box">
              <span :class="channelType==0?'active':''"
                    @click="channelType=0">全部渠道</span>
              <span :class="channelType==1?'active':''"
                    @click="channelType=1">PC</span>
              <span :class="channelType==2?'active':''"
                    @click="channelType=2">H5</span>
            </div>
          </div>
          <div id="service-pie"
               :style="{width: '100%', height: '300px'}"></div>
          <div class="no-data"
               v-if="seriesData.length==0">
            <img src="http://file.itaxs.com/dev/20210526/2cee9e56ed674210861f888732e3e36f.png"
                 alt="">
            <p>暂无数据</p>
          </div>
        </div>
      </div>
    </Card>
    <Card style="margin:24px 0;">
      <div class="title">用户分析
        <Tooltip placement="right"
                 content="累计注册用户数：截止到现在，总的注册用户数。
新注册用户数：在统计周期内，新增的注册用户数。
邀请注册数：在统计周期内，邀请新用户成功注册的数量。
跟进用户数：在统计周期内，新分配跟进人的用户数。
成交用户数：在统计周期内，新增付款成功的用户数。"
                 theme="light">
          <img src="@/assets/images/iipto-common/wenhao.svg">
        </Tooltip>
        <div class="date-box">
          <span>统计周期：</span>
          <DatePicker type="daterange"
                      placement="bottom-end"
                      :clearable="false"
                      :value="deafaultDate"
                      :options="options"
                      @on-change="changeDealDate($event,'userTime')"
                      placeholder="选择周期"
                      style="width: 210px"></DatePicker>
        </div>
      </div>
      <div class="transaction-data-box">
        <div class="transaction-num"
             v-if="JSON.stringify(returnUserData)!='{}'">
          <div class="item">
            <div class="item-title">
              累计注册用户数
              <img src="@/assets/images/home/info-circle.png">
            </div>
            <p class="todays">{{returnUserData.userStatisticsDataVo.allUserCount}}
              <span>人</span>
            </p>
            <p class="yesterday">今日新注册用户数
              <span>{{returnUserData.userStatisticsDataVo.todayAllUserCount}}人</span>
            </p>
          </div>
          <div class="item">
            <div class="item-title">
              新注册用户数
              <img src="@/assets/images/home/info-circle.png">
            </div>
            <p class="todays">{{returnUserData.userStatisticsDataVo.newUserCount}}
              <span>人</span>
            </p>
            <p class="yesterday">今日新注册用户数
              <span>{{returnUserData.userStatisticsDataVo.todayAllUserCount}}人</span>
            </p>
          </div>
          <div class="item">
            <div class="item-title">
              邀请注册数
              <img src="@/assets/images/home/info-circle.png">
            </div>
            <p class="todays">{{returnUserData.userStatisticsDataVo.inviteUserCount}}
              <span>人</span>
            </p>
            <p class="yesterday">今日邀请注册数
              <span>{{returnUserData.userStatisticsDataVo.todayInviteUserCount}}人</span>
            </p>
          </div>
          <div class="item">
            <div class="item-title">
              跟进用户数
              <img src="@/assets/images/home/info-circle.png">
            </div>
            <p class="todays">{{returnUserData.userStatisticsDataVo.followUserCount}}
              <span>人</span>
            </p>
            <p class="yesterday">今日跟进用户数
              <span>{{returnUserData.userStatisticsDataVo.todayFollowUserCount}}人</span>
            </p>
          </div>
          <div class="item">
            <div class="item-title">
              成交用户数
              <img src="@/assets/images/home/info-circle.png">
            </div>
            <p class="todays">{{returnUserData.userStatisticsDataVo.payUserCount}}
              <span>人</span>
            </p>
            <p class="yesterday">今日成交用户数
              <span>{{returnUserData.userStatisticsDataVo.todayPayUserCount}}人</span>
            </p>
          </div>
        </div>
        <div class="transaction-data">
          <p class="content-title">趋势图
            <Tooltip placement="right"
                     content="在统计周期内，指定统计指标每日的数据，形成趋势图"
                     theme="light">
              <img src="@/assets/images/iipto-common/wenhao.svg">
            </Tooltip>
          </p>
        </div>
        <div id="user-chart"
             :style="{width: '98%', height: '350px','margin-top':'10px'}"></div>
        <!-- <div class="title"
             style="margin-top:15px;">成交客户分析
          <Tooltip placement="right"
                   content="成交金额：统计周期内，所有支付订单金额之和（不剔除退款金额）。
                          新成交客户成交金额占比：统计周期内，新成交客户销售额/所有成交金额*100%
                          老成交客户成交金额占比：统计周期内，1-新成交客户成交金额占比
                          全部成交客户数：统计周期内，付款成功的客户数，一人多次付款成功记为一人。
                          新成交客户数：过去2年没有购买，在筛选时间内首次在店铺付款的客户数量。
                          老成交客户数：过去2年购买过，在筛选时间内在店铺再次付款的客户数量。等于全部成交客户数减去新成交客户数。"
                   theme="light">
            <img src="@/assets/images/iipto-common/wenhao.svg">
          </Tooltip>
          <div class="date-box">
            <span>统计周期：</span>
            <DatePicker type="daterange"
                        placement="bottom-end"
                        :options="options"
                        placeholder="选择周期"
                        style="width: 210px"></DatePicker>
          </div>
        </div>
        <div id="myChartPie"
             :style="{width: '100%', height: '300px'}"></div>
        <Table :data="customerData"
               :columns="customerColumns"
               style="margin-bottom:40px;"></Table> -->
      </div>
    </Card>
  </div>
</template>
<script>
import echarts from 'echarts'
import { salesDataApi, dealDataApi, serviceDataApi, userDataApi } from '@/api/iipto/overViewData'
export default {
  data() {
    return {
      options: {
        disabledDate(date) {
          return (date > Date.now())
        }
      },
      serviceData: [],
      serviceColumns: [
        {
          title: '排名',
          width: '60px',
          render: (h, params) => {
            return h('span', params.row._index + 1)
          }
        },
        {
          title: '服务名称',
          render: (h, params) => {
            let functionCode = this.$functionCodeList(params.row.functionCode), country = this.countryList[params.row.countryCode]
            return h('span', country + functionCode)
          },
        },
        {
          title: '支付件数',
          key: 'payProductCount',
        },
        {
          title: '销售额',
          key: 'payAmount',
        },
      ],
      customerData: [],
      customerColumns: [
        {
          title: '客户类型',
          key: '',
        },
        {
          key: '',
          renderHeader: (h, params) => {
            return h('span', [
              h('Tooltip', {
                props: {
                  content: `全部成交客户数：统计周期内，付款成功的客户数，一人多次付款成功记为一人。
新成交客户数：过去2年没有购买，在筛选时间内首次在店铺付款的客户数量。
老成交客户数：过去2年购买过，在筛选时间内在店铺再次付款的客户数量。等于全部成交客户数减去新成交客户数。`,
                  trigger: 'hover',
                  size: 'small',
                  placement: 'bottom',
                  theme: 'light'
                }
              }, [
                  h('span', {}, '客户数'),
                  h('img', {
                    attrs: {
                      src: require("@/assets/images/iipto-common/wenhao.svg"),
                      style: "margin-left:5px;vertical-align:middle;"
                    }
                  })
                ])
            ])
          }
        },
        {
          key: '',
          renderHeader: (h, params) => {
            return h('span', [
              h('Tooltip', {
                props: {
                  content: `全部成交客户占比：统计周期内，成交客户数 / 累积所有客户数
新成交客户占比：统计周期内，新成交客户数 / 全部成交客户数
老成交客户占比：统计周期内，老成交客户数 / 全部成交客户数`,
                  trigger: 'hover',
                  size: 'small',
                  placement: 'bottom',
                  theme: 'light'
                }
              }, [
                  h('span', {}, '客户数占比'),
                  h('img', {
                    attrs: {
                      src: require("@/assets/images/iipto-common/wenhao.svg"),
                      style: "margin-left:5px;vertical-align:middle;"
                    }
                  })
                ])
            ])
          }
        },
        {
          key: '',
          renderHeader: (h, params) => {
            return h('span', [
              h('Tooltip', {
                props: {
                  content: "在统计周期内，销售额/客户数=客单价",
                  trigger: 'hover',
                  size: 'small',
                  placement: 'bottom',
                  theme: 'light'
                }
              }, [
                  h('span', {}, '客单价'),
                  h('img', {
                    attrs: {
                      src: require("@/assets/images/iipto-common/wenhao.svg"),
                      style: "margin-left:5px;vertical-align:middle;"
                    }
                  })
                ])
            ])
          }
        },
        {
          key: '',
          renderHeader: (h, params) => {
            return h('span', [
              h('Tooltip', {
                props: {
                  content: "统计周期内，所有支付订单金额之和（不剔除退款金额）",
                  trigger: 'hover',
                  size: 'small',
                  placement: 'bottom',
                  theme: 'light'
                }
              }, [
                  h('span', {}, '销售额'),
                  h('img', {
                    attrs: {
                      src: require("@/assets/images/iipto-common/wenhao.svg"),
                      style: "margin-left:5px;vertical-align:middle;"
                    }
                  })
                ])
            ])
          }
        },
        {
          title: '复购率',
          key: '',
          renderHeader: (h, params) => {
            return h('span', [
              h('Tooltip', {
                props: {
                  content: "统计周期内重复购买的客户数/统计周期内的总客户数=复购率",
                  trigger: 'hover',
                  size: 'small',
                  placement: 'bottom',
                  theme: 'light'
                }
              }, [
                  h('span', {}, '客单价'),
                  h('img', {
                    attrs: {
                      src: require("@/assets/images/iipto-common/wenhao.svg"),
                      style: "margin-left:5px;vertical-align:middle;"
                    }
                  })
                ])
            ])
          }
        },
      ],
      returnSalesData: {},
      dealTime: {
        beginTime: new Date().pattern("yyyy-MM-") + '01',
        endTime: new Date().pattern("yyyy-MM-dd"),
      },
      deafaultDate: [new Date().pattern("yyyy-MM-") + '01', new Date().pattern("yyyy-MM-dd")],
      returnDealData: {},
      //服务分析
      serviceTime: {
        beginTime: new Date().pattern("yyyy-MM-") + '01',
        endTime: new Date().pattern("yyyy-MM-dd"),
      },
      returnServiceData: {},
      countryList: {
        'US': '美国',
        'EU': '欧盟',
        'JP': '日本',
        'GB': '英国',
        'AU': '澳大利亚',
        'CA': '加拿大',
        'CN': '中国',
        'DE': '德国',
        'ES': '西班牙',
        'FR': '法国',
        'ID': '印度尼西亚',
        'IN': '印度',
        'IT': '意大利',
        'KR': '韩国',
        'MY': '马来西亚',
        'NZ': '新西兰',
        'RU': '俄罗斯',
        'SG': '新加坡',
        'TW': '中国台湾',
        'VN': '越南',
        'ALL': '通用',
      },
      channelType: 0,
      servicePieData: [],
      channelPayAmount: 0,
      //用户分析
      userTime: {
        beginTime: new Date().pattern("yyyy-MM-") + '01',
        endTime: new Date().pattern("yyyy-MM-dd"),
      },
      returnUserData: {},
      seriesData: []
    }
  },
  watch: {
    channelType(val, old) {
      if (val == 0) {
        this.channelPayAmount = this.returnServiceData.allChannelPayAmount
        this.servicePieData = this.returnServiceData.allProductRankingList
      } else if (val == 1) {
        this.channelPayAmount = this.returnServiceData.pcChannelPayAmount
        this.servicePieData = this.returnServiceData.pcProductRankingList
      } else if (val == 2) {
        this.channelPayAmount = this.returnServiceData.h5ChannelPayAmount
        this.servicePieData = this.returnServiceData.h5ProductRankingList
      }
      this.$nextTick(() => {
        this.initServiceSaleData()
      })
    }
  },
  methods: {
    //实时概况
    getSalesDataFunc() {
      salesDataApi().then(res => {
        if (res.code == 0) {
          this.returnSalesData = res.data
          this.$nextTick(() => {
            this.drawSale()
          })
        }
      })
    },
    drawSale() {
      let that = this
      let chartDom = document.getElementById('saleroom');
      let myChart = echarts.init(chartDom);
      let xData = [], todayData = [], yesterdayData = []
      that.returnSalesData.yesterdayHour24RealTimeOverviewVoList.map(item => {
        xData.push(item.hourName)
        yesterdayData.push(item.payOrderMoney)
      })
      that.returnSalesData.todayHour24RealTimeOverviewVoList.map(item => {
        todayData.push(item.payOrderMoney)
      })
      let option = {
        legend: {
          data: [
            {
              name: '今日销售额',
              icon: 'rect',
            },
            {
              name: '昨日销售额',
              icon: 'rect',
            }
          ],
          left: 0,
          itemWidth: 16,
          itemHeight: 4,
          textStyle: {
            color: '#666'  // 图例文字颜色
          },
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter(params) {
            let axisValue = params[0].axisValue
            let nextDate = params[0].axisValue.split(':')[0] - 0,
              newDate = nextDate > 9 ? (nextDate + ':59') : ('0' + nextDate + ':59')
            let value = axisValue + '-' + newDate + "<br />"
            value += '今日销售额：¥ ' + params[0].value + "<br />"
            value += '昨日销售额：¥ ' + params[1].value
            return value
          }
        },
        grid: {
          left: 0,
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisLabel: {
            showMaxLabel: true,
            color: '#999'
          },
          data: xData
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisLabel: {
            showMaxLabel: true,
            color: '#999'
          },
        },
        series: [
          {
            name: '今日销售额',
            type: 'line',
            smooth: true,
            emphasis: {
              focus: 'series'
            },
            data: todayData
          },
          {
            name: '昨日销售额',
            type: 'line',
            smooth: true,
            emphasis: {
              focus: 'series'
            },
            data: yesterdayData
          }
        ],
        color: ['#3388FF', '#33D7FF']
      }
      option && myChart.setOption(option);
    },
    //交易分析
    changeDealDate(val, type) {
      if (type == 'dealTime') {
        this.dealTime.beginTime = val[0]
        this.dealTime.endTime = val[1]
        this.getDealAnalysisFunc()
      } else if (type == 'serviceTime') {
        this.serviceTime.beginTime = val[0]
        this.serviceTime.endTime = val[1]
        this.getServiceAnalysisFunc()
      } else if (type == 'userTime') {
        this.userTime.beginTime = val[0]
        this.userTime.endTime = val[1]
        this.getUserDataFunc()
      }
    },
    getDealAnalysisFunc() {
      dealDataApi(this.dealTime).then(res => {
        if (res.code == 0) {
          this.returnDealData = res.data
          this.$nextTick(() => {
            this.drawTendencychart()
          })
        }
      })
    },
    drawTendencychart() {
      let chartDom = document.getElementById('tendency-chart');
      let myChart = echarts.init(chartDom);
      let xData = [], salesData = [], payOrderData = [], payUserData = [], payProductData = [], refundData = []
      this.returnDealData.orderDayDetailList.map(item => {
        xData.push(item.dateName)
        salesData.push(item.payDayAmount)
        payOrderData.push(item.payOrderDayCount)
        payUserData.push(item.payUserDayCount)
        payProductData.push(item.payProductDayCount)
      })
      this.returnDealData.refundOrderDayDetailList.map(item => {
        refundData.push(item.refundDayAmount)
      })
      let option = {
        legend: {
          data: [
            {
              name: '销售额',
              icon: 'rect',
            },
            {
              name: '支付订单数',
              icon: 'rect',
            },
            {
              name: '支付人数',
              icon: 'rect',
            },
            {
              name: '支付件数',
              icon: 'rect',
            },
            {
              name: '退款金额',
              icon: 'rect',
            },
          ],
          itemWidth: 16,
          itemHeight: 4,
          left: 24,
          textStyle: {
            color: '#666'  // 图例文字颜色
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: 24,
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisLabel: {
            showMaxLabel: true,
            color: '#999'
          },
          data: xData
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisLabel: {
            showMaxLabel: true,
            color: '#999'
          },
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }],
        series: [
          {
            name: '销售额',
            data: salesData,
            type: 'line',
            smooth: true,
            symbol: 'none'
          },
          {
            name: '支付订单数',
            data: payOrderData,
            type: 'line',
            smooth: true,
            symbol: 'none'
          },
          {
            name: '支付人数',
            data: payUserData,
            type: 'line',
            smooth: true,
            symbol: 'none'
          },
          {
            name: '支付件数',
            data: payProductData,
            type: 'line',
            smooth: true,
            symbol: 'none'
          },
          {
            name: '退款金额',
            data: refundData,
            type: 'line',
            smooth: true,
            symbol: 'none'
          }
        ],
        color: ['#3388FF', '#77DD55', '#33D7FF', '#6666FF', '#FFB811']
      }
      option && myChart.setOption(option);
    },
    //服务分析
    getServiceAnalysisFunc() {
      serviceDataApi(this.serviceTime).then(res => {
        if (res.code == 0) {
          this.returnServiceData = res.data
          this.serviceData = res.data.allProductRankingList
          this.channelPayAmount = res.data.allChannelPayAmount
          this.servicePieData = res.data.allProductRankingList
          this.$nextTick(() => {
            this.initServiceSaleData()
          })
        }
      })
    },
    initServiceSaleData() {
      let other = {
        value: 0,
        name: '其他',
        percentage: 0
      },
        that = this
      that.seriesData = []
      that.servicePieData.map((item, index) => {
        if (index < 5) {
          let obj = {
            value: item.payAmount,
            percentage: item.payAmountProportion,
            name: that.countryList[item.countryCode] + that.$functionCodeList(item.functionCode)
          }
          that.seriesData.push(obj)
        } else {
          other.value += item.payAmount
          other.percentage += item.payAmountProportion
        }
      })
      if (that.servicePieData.length > 5) {
        that.seriesData.push(other)
      }
      this.drawServiceSale()
    },
    drawServiceSale() {
      let chartDom = document.getElementById('service-pie');
      let myChart = echarts.init(chartDom);
      let that = this
      let colors = ['#397FFF', '#33D7FF', '#A3F42D', '#77DD55', '#FFB811', '#6666FF'];
      let option = {
        color: colors,
        tooltip: {
          trigger: 'item',
          formatter(params) {
            let value = params.data.name + '：<br />'
            value += '占比  ' + params.data.percentage + '%<br />'
            value += '销售额  ¥' + params.data.value
            return value
          }
        },
        title: {
          text: '¥' + that.channelPayAmount,
          left: "16%",
          top: "46%",
          textStyle: {
            color: "#333333",
            fontSize: 22,
            align: "center"
          }
        },
        legend: {
          type: 'plain',
          orient: 'vertical',
          right: 0,
          top: 100,
          bottom: 20,
          itemWidth: 8,
          itemHeight: 8,
          formatter(name) {
            let value = ''
            that.seriesData.map(item => {
              if (item.name == name) {
                if (name.length > 5) {
                  value = name.slice(0, 5) + '...'
                }
                value += '  |  ' + item.percentage + '%   ' + '  ￥' + item.value
              }
            })
            return value
          },
        },
        series: [
          {
            type: 'pie',
            center: ['30%', '50%'],
            radius: ['60%', '80%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'left'
            },
            labelLine: {
              show: false
            },
            data: this.seriesData,
          }
        ]
      };
      if (that.seriesData.length > 0) {
        // chartDom.style.display = 'block'
        option && myChart.setOption(option);
      } else {
        myChart.dispose()
        // chartDom.style.display = 'none'
      }
    },
    //用户分析
    getUserDataFunc() {
      userDataApi(this.userTime).then(res => {
        if (res.code == 0) {
          this.returnUserData = res.data
          this.$nextTick(() => {
            this.drawUserchart()
          })
        }
      })
    },
    drawUserchart() {
      let chartDom = document.getElementById('user-chart');
      let myChart = echarts.init(chartDom);
      let xData = [], salesData = [], payOrderData = [], payUserData = [], payProductData = [], refundData = []
      this.returnUserData.userStatisticsDataVoDayList.map(item => {
        xData.push(item.dateName)
        salesData.push(item.newUserCount)
        payOrderData.push(item.inviteUserCount)
        payUserData.push(item.followUserCount)
        payProductData.push(item.payUserCount)
      })
      let option = {
        legend: {
          data: [
            {
              name: '新注册用户数',
              icon: 'rect',
            },
            {
              name: '邀请注册数',
              icon: 'rect',
            },
            {
              name: '跟进用户数',
              icon: 'rect',
            },
            {
              name: '成交用户数',
              icon: 'rect',
            }
          ],
          left: 0,
          itemWidth: 16,
          itemHeight: 4,
          textStyle: {
            color: '#666'  // 图例文字颜色
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: 24,
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            interval: 0,//使x轴文字显示全
            show: false
          },
          axisLabel: {
            showMaxLabel: true,
            color: '#999'
          },
          data: xData
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisLabel: {
            showMaxLabel: true,
            color: '#999'
          },
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }],
        series: [
          {
            name: '新注册用户数',
            data: salesData,
            type: 'line',
            smooth: true,
            symbol: 'none'
          },
          {
            name: '邀请注册数',
            data: payOrderData,
            type: 'line',
            smooth: true,
            symbol: 'none'
          },
          {
            name: '跟进用户数',
            data: payUserData,
            type: 'line',
            smooth: true,
            symbol: 'none'
          },
          {
            name: '成交用户数',
            data: payProductData,
            type: 'line',
            smooth: true,
            symbol: 'none'
          }
        ],
        color: ['#3388FF', '#77DD55', '#33D7FF', '#6666FF', '#FFB811']
      }
      option && myChart.setOption(option);
    },
    drawPie() {
      let that = this
      let myChart = echarts.init(document.getElementById('myChartPie'))
      let departmentDataArr = [
        {
          title: '新成交客户',
          data: []
        },
        {
          title: '老成交客户',
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
            }
          });
        }
      })
      let option = {
        title: [],
        color: ["#3388FF", "#33D7FF"],
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
        series: [

        ]
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
          radius: ['40%', '70%'],
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
    changePageHandler(page) {
      console.log(page)
    }
  },
  mounted() {
    this.getSalesDataFunc()
    this.getDealAnalysisFunc()
    this.getServiceAnalysisFunc()
    this.getUserDataFunc()
  },
}
</script>
<style lang="less" scoped>
/deep/ .ivu-card-body {
  padding: 0;
}
/deep/ .ivu-card-body {
  .title {
    font-size: 16px;
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 34px;
    padding: 16px 24px 0 24px;
    .date-box {
      float: right;
    }
    .type-box {
      float: right;
      span {
        display: inline-block;
        padding: 5px 16px;
        border: 1px solid #d9d9d9;
        cursor: pointer;
        color: #000;
      }
      span.active {
        border: 1px solid #16ade9;
        color: #16ade9;
      }
    }
  }
  .title.line {
    border-bottom: 1px solid #dddddd;
  }
  .item {
    padding: 20px 24px 12px;
    border: 1px solid #e9e9e9;
    margin-bottom: 20px;
    .item-title {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;

      img {
        width: 14px;
        float: right;
      }
    }
    .todays {
      font-size: 26px;
      font-family: PingFangSC;
      color: #333333;
      margin: 8px 0 10px 0;
      span {
        font-size: 18px;
        font-family: PingFangSC;
        color: #333333;
      }
    }
    .yesterday {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      span {
        color: #333333;
        margin-left: 8px;
      }
    }
  }
  .item:hover {
    box-shadow: 0px 2px 10px 0px rgba(22, 173, 233, 0.18);
    border-radius: 2px;
    border: 1px solid #16ade9;
  }
  .content-title {
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC;
    color: rgba(0, 0, 0, 0.85);
  }
  .content-box {
    padding: 14px 24px;
    .saleroom {
      margin-top: 10px;
      .todays {
        font-size: 26px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }
      .yesterday {
        font-size: 14px;
        font-family: PingFangSC;
        color: #666666;
        margin-left: 8px;
      }
    }
    .sale-data-box {
      position: relative;
      .sale-data-analysis {
        position: absolute;
        right: 0;
        top: 0;
        .item {
          height: 132px;
        }
      }
    }
    .sale-data-explain {
      padding: 12px;
      background-color: #e6f7ff;
      font-size: 12px;
      font-family: PingFangSC;
      color: #666666;
      line-height: 22px;
    }
  }
  .transaction-data-box {
    padding: 14px 24px;
    .title {
      padding: 0;
    }
  }
  .transaction-num {
    margin-top: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .service-analysis-box {
    padding: 14px 24px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    .service-item {
      border: 1px solid #dddddd;
      padding: 14px 16px;
      width: 49%;
      position: relative;
      .title {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        padding: 0;
        margin-bottom: 16px;
      }
      .service-page {
        float: right;
      }
    }
  }
}
.no-data {
  text-align: center;
  position: absolute;
  top: 100px;
  img {
    width: 60%;
  }
  p {
    text-align: center;
    font-size: 16px;
    color: #666;
  }
}
/deep/ .ivu-tooltip-inner {
  max-width: 400px;
  white-space: break-spaces;
}
/deep/ .ivu-input {
  font-size: 14px;
  color: #333;
}
/deep/ .item-title .ivu-tooltip {
  float: right;
}
</style>

