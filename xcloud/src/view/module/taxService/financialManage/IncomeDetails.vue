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
            <Option value="31">微信</Option>
            <Option value="32">支付宝</Option>
            <Option value="33">银联</Option>
            <Option
                v-for="(v, i) in paymentaccountList"
                :value="v.id"
                :key="i"
                >{{ v.accountName }}</Option
              >
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
          <DatePicker v-model="completeDate"
                      type="daterange"
                      placement="bottom-end"
                      @on-change="completeDateChange"
                      placeholder="完成时间"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.countryCode"
                  placeholder="税号国家">
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
            <Option value="1">注册税号</Option>
            <Option value="2">转代理+申报</Option>
            <!-- <Option value="3">税务补缴</Option> -->
            <!-- <Option value="4">转代理</Option> -->
            <Option value="5">注册+申报</Option>
            <Option value="6">注销税号</Option>
            <Option value="7">税务稽查</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.companyBody"
                  placeholder="归属公司">
            <Option value="1">跨税云</Option>
            <Option value="2">必胜道</Option>
            <Option value="3">卖家成长</Option>
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
          <Col span="3">应收金额: {{totalOrderMoney}}</Col>
          <Col span="3">优惠金额: {{totaldiscAmount}}</Col>
          <Col span="3">服务实收金额: {{totalServiceMoney}}</Col>
          <Col span="3"
               v-if="!(searchForm.countryCode || searchForm.functionCode)">开票金额: {{totalInvoiceMoney}}</Col>
          <Col span="3"
               v-if="!(searchForm.countryCode || searchForm.functionCode)">实收总金额: {{totalamountMoney}}</Col>
          <Col span="3"
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
            <div v-if="row.orderSource==5">
              <span v-for="(item,index) in row.paymentAccount.split(',')" :key="index">{{ paymentaccount[item] + '；'}}</span>
            </div>
            <span v-else>{{row.paymentChannel == '2' ? "支付宝" : row.paymentChannel == '1' ? "微信" : row.paymentChannel == '3' ? "银联" : '' }}</span>
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
import * as API from '@/api/taxService/order.js';
import * as API1 from "@/api/orderManage/addOrder";
import { getTaxCountry } from '@/api/taxService/common.js';
import { getToken } from '@/libs/util'
export default {
  name: 'orderList',
  data() {
    return {
      isDetailShow: false,
      paymentaccountList: [],
      paymentaccount:{},
      searchForm: {
        info: '',
        paymentChannel: '',
        startTime: '',
        endTime: '',
        completionStartTime: '',
        completionEndTime: '',
        countryCode: '',
        functionCode: ''
      },
      date: '',
      completeDate:'',
      countryList: [],
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
          width: 50
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
          key: 'productName',
          // render(h,params) {
          //     let productNames=params.row.productNames.split(';')
          //     return h('div',
          //     productNames.map(function(type){
          //         return h('div', {
          //         }, type);
          //     })
          //     );
          // },
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
          title: '归属公司',
          render: (h, params) => {
            let text = '';
            if(params.row.companyBody == '1'){
              text = '跨税云';
            }else if(params.row.companyBody == '2'){
              text = '必胜道';
            }else if(params.row.companyBody == '3'){
              text = '卖家成长';
            }
            return h('span', text)
          }
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
    this.statisticsMoney();
    this.getCountryList()
    this.getPaymentaccountList()
  },
  methods: {
    //获取订单款项收款方下拉
    getPaymentaccountList() {
      API1.getPaymentaccount().then(res => {
        if (res.code == 0) {
          this.paymentaccountList = res.data;
          this.paymentaccountList.map(item=>{
            this.paymentaccount[item.id] = item.accountName
          })
          this.getOrderList();
        }
      });
    },
    //订单创建时间
    dateChange(date) {
      if(!!date[0]){
        this.searchForm.startTime = date[0] + ' 00:00:00';
        this.searchForm.endTime = date[1] + ' 23:59:59';
      }else{
        this.searchForm.startTime = '';
        this.searchForm.endTime = '';
      }
    },
    //完成complete时间
    completeDateChange(date) {
      if(!!date[0]){
        this.searchForm.completionStartTime = date[0] + ' 00:00:00';
        this.searchForm.completionEndTime = date[1] + ' 23:59:59';
      }else{
        this.searchForm.completionStartTime = '';
        this.searchForm.completionEndTime = '';
      }
    },
    //获取税号国家下拉数据
    getCountryList() {
      getTaxCountry().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data
        }
      })
    },
    //获取列表
    getOrderList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo };
      API.incomeList(params).then((res) => {
        if (res.code == 0) {
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
      this.completeDate = "";
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
      formData.append('info', this.searchForm.info || '')
      formData.append('paymentChannel', this.searchForm.paymentChannel || '')
      formData.append('startTime', this.searchForm.startTime || '')
      formData.append('endTime', this.searchForm.endTime || '')
      formData.append('completionStartTime', this.searchForm.completionStartTime || '')
      formData.append('completionEndTime', this.searchForm.completionEndTime || '')
      formData.append('countryCode', this.searchForm.countryCode || '')
      formData.append('functionCode', this.searchForm.functionCode || '')
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/etax/order/management/income/list/export', true)
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