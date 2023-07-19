<template>
  <div>
    <Card class="top-fixed">
      <div class="title">
        <span>销售数据</span>
        <Form :model="searchForm"
              inline
              class="form-box">
          <FormItem label="统计周期"
                    style="width:250px;">
            <DatePicker type="daterange"
                        placement="bottom-end"
                        :clearable="false"
                        :value="deafaultDate"
                        :options="options"
                        @on-change="changeDealDate"
                        placeholder="选择周期"
                        style="width: 190px"></DatePicker>
          </FormItem>
          <FormItem label="统计范围:"
                    style="width:400px;"
                    v-if="departmentList.length>0">
            <Select v-model="searchForm.type"
                    placeholder="部门"
                    @on-change="changeType"
                    style="width: 100px">
              <Option value="0">不限</Option>
              <Option value="1">部门</Option>
              <Option value="2">员工</Option>
            </Select>
            <Select v-model="searchForm.departmentId"
                    v-if="searchForm.type!=0"
                    @on-change="changeDepartment"
                    placeholder="部门名称"
                    style="width: 100px;margin:0 16px;">
              <Option :value="item.departmentId"
                      v-for="(item,index) in departmentList"
                      :key="index">{{item.departmentName}}</Option>
            </Select>
            <Select v-model="searchForm.userId"
                    @on-change="changeUser"
                    placeholder="员工姓名"
                    style="width: 100px"
                    v-show="searchForm.type==2">
              <Option :value="item.userId"
                      v-for="(item,index) in staffList"
                      :key="index">{{item.nickName}}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </Card>
    <Card style="margin:84px 0 24px 0;padding-bottom:24px;"
          class="clearfix">
      <div class="title font16">{{departmentList.length>0?'部门':'本人'}}业绩
        <Tooltip placement="right"
                 content="以下数据均受数据权限控制：
① 本人仅看到本人的销售数据。
② 主管或主管以上可看到下级所有人的销售数据。"
                 theme="light">
          <img src="@/assets/images/iipto-common/wenhao.svg">
        </Tooltip>
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
          <p class="title font16">趋势图
            <Tooltip placement="right"
                     content="在统计周期内，指定统计指标每日的数据，形成趋势图，汇总每日的数据等于部门/本人业绩。"
                     theme="light">
              <img src="@/assets/images/iipto-common/wenhao.svg">
            </Tooltip>
          </p>
        </div>
      </div>
      <div id="tendency-chart"
           :style="{width: '98%', height: '350px','margin-top':'16px'}"></div>
      <div class="title font16"
           :style="{'margin-top':'16px'}">销售排行榜
        <Tooltip placement="right"
                 content="在统计周期内，所有销售部门员工的销售金额排行榜，销售金额大的排名靠前，按销售金额降序排列"
                 theme="light">
          <img src="@/assets/images/iipto-common/wenhao.svg">
        </Tooltip>
        <Button class="export-btn"
                @click="exportFunc">导出Excel</Button>
      </div>
      <Table class="sales-table"
             :data="salesData"
             :columns="salesColumns"></Table>
      <Page @on-change="changePageHandler"
            @on-page-size-change="handlePageSize"
            :current="pageInfo.page"
            :total="listTotal"
            :page-size="pageInfo.limit"
            show-elevator
            show-sizer
            style="float:right;" />
    </Card>
  </div>
</template>
<script>
import echarts from 'echarts'
import { salesDataApi, salesListApi } from '@/api/iipto/salesData'
import { getAllChildUserAndChildDepartmentApi } from '@/api/iipto/user'
import { getToken } from '@/libs/util'
export default {
  data() {
    return {
      options: {
        disabledDate(date) {
          return (date > Date.now())
        }
      },
      searchForm: {
        type: '0',
        beginDate: new Date().pattern("yyyy-MM-") + '01',
        endDate: new Date().pattern("yyyy-MM-dd"),
        userId: this.$store.state.user.userId,
        departmentId: ''
      },
      deafaultDate: [new Date().pattern("yyyy-MM-") + '01', new Date().pattern("yyyy-MM-dd")],
      returnDealData: {},
      salesData: [],
      salesColumns: [
        {
          title: '排名',
          key: 'sort'
        },
        {
          title: '员工姓名',
          key: 'followUserName'
        },
        {
          title: '所属部门',
          key: 'departmentName'
        },
        {
          title: '销售金额',
          key: 'payAmount'
        },
        {
          title: '支付订单数',
          key: 'payOrderCount'
        },
        {
          title: '支付人数',
          key: 'payUserCount'
        },
        {
          title: '支付件数',
          key: 'payProductCount'
        },
        {
          title: '退款金额',
          key: 'refundAmount'
        },
      ],
      pageInfo: {
        page: 1,
        limit: 10
      },
      listTotal: 0,
      departmentList: [],
      staffList: [],
      isFixed: true
    }
  },
  methods: {
    changeDealDate(val) {
      this.searchForm.beginDate = val[0]
      this.searchForm.endDate = val[1]
      this.getDealAnalysisFunc()
    },
    getDealAnalysisFunc() {
      let data = { ...this.searchForm }
      if (data.type != 2) {
        data.userId = this.$store.state.user.userId
      }
      salesDataApi(data).then(res => {
        if (res.code == 0) {
          this.returnDealData = res.data.data
          this.$nextTick(() => {
            this.drawTendencychart()
            this.getTableFunc(1)
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
          left: 10,
          itemWidth: 16,
          itemHeight: 4,
          textStyle: {
            color: '#666'  // 图例文字颜色
          },
        },
        grid: {
          left: 10,
          right: '4%',
          bottom: '3%',
          containLabel: true
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
    //获取table数据
    getTableFunc(page) {
      let data = { ...this.searchForm }
      data.page = this.pageInfo.page
      data.limit = this.pageInfo.limit
      if (data.type != 2) {
        data.userId = this.$store.state.user.userId
      }
      if (page) {
        data.page = page
      }
      salesListApi(data).then(res => {
        if (res.code == 0) {
          this.salesData = res.data.records
          this.listTotal = res.data.total - 0
        }
      })
    },
    //翻页
    changePageHandler(page) {
      this.pageInfo.page = page
      this.getTableFunc()
    },
    //调整页数
    handlePageSize(limit) {
      this.pageInfo.limit = limit
      this.getTableFunc(1)
    },
    getUserFunc() {
      getAllChildUserAndChildDepartmentApi({ 'userId': this.searchForm.userId }).then(res => {
        if (res.code == 0) {
          if (res.data) {
            this.departmentList = res.data
          }
        }
      })
    },
    changeType(val) {
      if (val == '0') {
        this.searchForm.userId = this.$store.state.user.userId,
          this.searchForm.departmentId = ''
        this.getDealAnalysisFunc()
      } else if (val == '1') {
        this.searchForm.userId = this.$store.state.user.userId
        if (this.searchForm.departmentId) {
          this.changeDepartment()
        }
      }
    },
    changeDepartment(val) {
      if (this.searchForm.type == 1) {
        this.searchForm.userId = this.$store.state.user.userId
        this.getDealAnalysisFunc()
      }
      this.departmentList.map(item => {
        if (val == item.departmentId) {
          this.staffList = item.children
        }
      })
    },
    changeUser(val) {
      if (val != undefined) {
        this.getDealAnalysisFunc()
      }
    },
    exportFunc() {
      let formData = new FormData()
      formData.append('beginDate', this.searchForm.beginDate)
      formData.append('endDate', this.searchForm.endDate)
      formData.append('type', this.searchForm.type)
      formData.append('userId', this.searchForm.userId)
      formData.append('departmentId', this.searchForm.departmentId)
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/trademark/saleStatics/management/saleData/list/export', true)
      // 设置请求token
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken())
      xmlResquest.responseType = 'blob'
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        // 组装a标签
        let elink = document.createElement('a')
        // 设置下载文件名
        elink.download = timestamp + '.xlsx'
        elink.style.display = 'none'

        let blob = new Blob([content])
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
      }
      xmlResquest.send(formData)
    }
  },
  mounted() {
    this.getDealAnalysisFunc()
    this.getUserFunc()
  },
}
</script>
<style lang="less" scoped>
.top-fixed {
  position: fixed;
  top: 104px;
  right: 26px;
  left: 222px;
  z-index: 99;
}
.title {
  font-size: 18px;
  font-family: SourceHanSansSC-Medium, SourceHanSansSC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 36px;
  & > span {
    margin-top: 10px;
  }
  .form-box {
    float: right;
    margin-top: -4px;
  }
  .export-btn {
    width: 88px;
    height: 32px;
    background: #16ade9;
    border-radius: 2px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 1;
    padding: 0;
    float: right;
  }
}
.title.font16 {
  font-size: 16px;
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
    /deep/ .ivu-tooltip {
      float: right;
    }
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
  .yestoday {
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
.transaction-data-box {
  .title {
    padding: 0;
  }
  .transaction-num {
    margin-top: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.sales-table {
  margin-top: 20px;
  /deep/ .ivu-table th {
    background: #e6f7ff;
  }
}
/deep/ .ivu-tooltip-inner {
  max-width: 400px;
  white-space: break-spaces;
}
.clearfix::after {
  content: ' ';
  line-height: 0;
  display: block;
  clear: both;
}
/deep/ .ivu-form-inline .ivu-form-item {
  margin-bottom: 0;
}
</style>

