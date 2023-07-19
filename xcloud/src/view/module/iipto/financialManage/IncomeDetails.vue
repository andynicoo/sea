<template>
  <div class="orderListWrapper">
    <div class="mainPage"
         v-if="!isDetailShow">
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem>
          <Input v-model="searchForm.info"
                 clearable
                 placeholder="请输入手机号/订单号"
                 style="width:200px;" />
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.paymentChannel"
                  placeholder="收款方式">
            <Option value="1">微信</Option>
            <Option value="2">支付宝</Option>
            <Option value="3">银联</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.orderBusinessSource"
                  placeholder="订单来源">
            <Option value="1">必胜道</Option>
            <Option value="2">卖家成长</Option>
            <Option value="3">跨标云</Option>
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker v-model="date"
                      type="daterange"
                      placement="bottom-end"
                      @on-change="dateChange"
                      placeholder="收款时间"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.countryCode"
                  placeholder="国家">
            <Option v-for="(item,index) in countryList"
                    :value="item.countryCode"
                    :key="index">{{ item.countryNameZh }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.functionCode"
                  style="width: 100px;"
                  placeholder="所有服务">
            <Option value="1">商标注册</Option>
            <Option value="2">答复审查意见</Option>
            <Option value="3">商标注册(顾问)</Option>
            <Option value="4">补差价</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="searchList"
                  style="margin-right:5px;">查询</Button>
          <Button type="primary"
                  ghost
                  @click="resetList">重置</Button>
        </FormItem>
      </Form>
      <div class="money">
        <Row class-name="statistical">
          <Col span="4">应收金额: {{totalOrderMoney}}</Col>
          <Col span="4">优惠金额: {{totaldiscAmount}}</Col>
          <Col span="4">服务实收金额: {{totalServiceMoney}}</Col>
          <Col span="4"
               v-if="!(searchForm.countryCode || searchForm.functionCode)">开票金额: {{totalInvoiceMoney}}</Col>
          <Col span="4"
               v-if="!(searchForm.countryCode || searchForm.functionCode)">实收总金额: {{totalamountMoney}}</Col>
          <Col span="4"
               style="float:right;">
          <Button type="primary"
                  style="float:right;"
                  @click="exportList">导出Excel</Button>
          </Col>
        </Row>
      </div>
      <div class="tableArea">
        <Table border
               :loading="tableLoading"
               :columns="columns"
               :data="tableData">
          <template slot="paymentChannel"
                    slot-scope="{ row }">
            <span>{{row.paymentChannel == '2' ? "支付宝" : row.paymentChannel == '1' ? "微信" : row.paymentChannel == '3' ? "银联" : '' }}</span>
          </template>
        </Table>
        <Page @on-change="changePageHandler"
              :current="pageInfo.page"
              :total="listTotal"
              :page-size="pageInfo.limit"
              show-total
              show-elevator />
      </div>
    </div>
  </div>
</template>
<script>
import * as API from '@/api/iipto/order.js';
import { getTaxCountry } from '@/api/taxService/common.js';
import { getToken } from '@/libs/util'
export default {
  name: 'orderList',
  data() {
    return {
      isDetailShow: false,
      searchForm: {
        info: '',
        paymentChannel: '',
        startTime: '',
        endTime: '',
        countryCode: '',
        functionCode: '',
        orderBusinessSource: ''
      },
      date: '',
      countryList: [
        { countryNameZh: "美国", countryCode: "US" },
        { countryNameZh: "欧盟", countryCode: "EU" },
        { countryNameZh: "日本", countryCode: "JP" },
        { countryNameZh: "英国", countryCode: "GB" },
        { countryNameZh: "加拿大", countryCode: "CA" },
      ],
      pageInfo: {
        limit: 10,
        page: 1,
      },
      listTotal: 0,
      tableLoading: false,
      detailId: '',
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 60
        },
        {
          title: '订单号',
          key: 'orderNo',
          minWidth: 50,
        },
        {
          title: '客户手机号',
          key: 'userMobile'
        },
        {
          title: '服务名称',
          width: 120,
          render(h, params) {
            let categoryCount = params.row.categoryCount;
            let functionCode = params.row.functionCode;
            let productName = '一标' + categoryCount + '类'
            if (functionCode != 4) {
              return h('div', [
                h('p', params.row.productName),
                h('p', productName),
              ])
            } else {
              return h('div', [
                h('p', productName),
              ])
            }
          },
        },
        {
          title: '服务号',
          key: 'serverNo'
        },
        {
          title: '国家',
          key: 'countryNameZh'
        },
        {
          title: '受理号',
          key: 'acceptNum'
        },
        {
          title: '受理号日期',
          render(h, params) {
            let acceptTime = params.row.acceptTime
            if (acceptTime !== '') {
              acceptTime = params.row.acceptTime.slice(0, 10)
            }
            return h('span', acceptTime)
          },
        },
        {
          title: '收款方式',
          slot: 'paymentChannel'
        },
        {
          title: '应收金额',
          key: 'orderMoney'
        },
        {
          title: '优惠金额',
          key: 'discAmount'
        },
        {
          title: '实收金额',
          key: 'amountMoney'
        },
        {
          title: '到账时间',
          key: 'gatheringTime'
        },
        // {
        //     title: '操作',
        //     slot: 'operate'
        // }
      ],
      totalOrderMoney: 0,
      totalamountMoney: 0,
      totaldiscAmount: 0,
      totalInvoiceMoney: 0,
      totalServiceMoney: 0,
      tableData: []
    }
  },
  mounted() {
    this.getOrderList();
    this.statisticsMoney();
  },
  methods: {
    //订单创建时间
    dateChange(date) {
      this.searchForm.startTime = date[0];
      this.searchForm.endTime = date[1];
    },
    //获取列表
    getOrderList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo };
      API.incomeList(params).then((res) => {
        if (res.code == 0) {
          // console.log(res.data.records)
          this.tableLoading = false;
          this.tableData = res.data.records;
          this.listTotal = Number(res.data.total);
        } else {
          this.$Message.warning(res.message);
          this.tableLoading = false
        }
      })
        .catch((err) => console.log(err))
    },
    //搜索列表
    searchList() {
      this.pageInfo.page = 1;
      this.getOrderList()
      this.statisticsMoney()
    },
    //重置列表
    resetList() {
      this.searchForm = {};
      this.date = "";
      this.pageInfo.page = 1;
      this.getOrderList()
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page
      this.getOrderList()
    },
    // 根据条件查询统计订单金额
    statisticsMoney() {
      let params = { ...this.searchForm, ...this.pageInfo };
      API.incomeStatistics(params).then((res) => {
        if (res.code === 0) {
          this.totalOrderMoney = res.data.totalOrderMoney
          this.totalamountMoney = res.data.totalamountMoney
          this.totaldiscAmount = res.data.totaldiscAmount
          this.totalInvoiceMoney = res.data.totalInvoiceMoney
          this.totalServiceMoney = res.data.totalServiceMoney
        }
      }).catch(err => console.log(err))
    },
    exportList() {
      let formData = new FormData()
      formData.append('info', this.searchForm.info == undefined ? '' : this.searchForm.info)
      formData.append('paymentChannel', this.searchForm.refundMethod == undefined ? '' : this.searchForm.paymentChannel)
      formData.append('startTime', this.searchForm.startTime == undefined ? '' : this.searchForm.startTime)
      formData.append('endTime', this.searchForm.endTime == undefined ? '' : this.searchForm.endTime)
      formData.append('countryCode', this.searchForm.countryCode == undefined ? '' : this.searchForm.countryCode)
      formData.append('functionCode', this.searchForm.functionCode == undefined ? '' : this.searchForm.functionCode)
      formData.append('orderBusinessSource', this.searchForm.orderBusinessSource == undefined ? '' : this.searchForm.orderBusinessSource)
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/trademark/order/management/income/list/export', true)
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
  }
}
</script>
<style lang="less" scoped>
.money {
  .statistical {
    font-size: 14px;
    padding-bottom: 10px;
  }
}
</style>