<template>
  <div class="orderListWrapper">
    <div class="mainPage" v-if="!isDetailShow && !isTypeIn">
      <Form ref="searchForm" :model="searchForm" inline>
        <FormItem>
          <Input v-model="searchForm.searchContent" clearable placeholder="请输入手机号/订单号/服务公司" style="width: 200px" />
        </FormItem>
        <FormItem>
          <Select clearable v-model="searchForm.inviteContentType" placeholder="请选择搜索类型">
            <Option value="1">邀请人</Option>
            <Option value="2">跟进人</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input v-model="inviteContent" clearable placeholder="请输入邀请人/跟进人" style="width: 200px" />
        </FormItem>
        <FormItem>
          <Select clearable v-model="searchForm.orderSource" placeholder="渠道来源">
            <Option value="0">PC网页端</Option>
            <!-- <Option value="1">微信小程序</Option> -->
            <Option value="2">H5</Option>
            <Option value="3">录入订单</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable v-model="searchForm.orderBusinessSource" placeholder="订单来源">
            <Option value="1">必胜道</Option>
            <Option value="2">卖家成长</Option>
            <Option value="3">跨标云</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable v-model="searchForm.paymentChannel" placeholder="支付方式">
            <Option value="0">未知</Option>
            <Option value="1">微信</Option>
            <Option value="2">支付宝</Option>
            <Option value="3">银联</Option>
          </Select>
        </FormItem>
        <!-- <FormItem>
          <Select clearable
                  v-model="searchForm.paymentAccount"
                  placeholder="收款账号">
            <Option value="1">全部</Option>
            <Option value="2">跨标云账号</Option></Option>
            <Option value="3">等等</Option>
          </Select>
        </FormItem> -->
        <FormItem>
          <Select clearable v-model="searchForm.acceptAccountName" placeholder="请选择收款账户">
            <Option v-for="(item, index) in companyBodyList" :key="index" :value="item.accountName">{{ item.accountName }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker v-model="date" type="daterange" placement="bottom-end" @on-change="dateChange" placeholder="订单创建时间" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <DatePicker v-model="paymentDate" type="daterange" @on-change="paymentDateChange" placeholder="付款时间" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <DatePicker v-model="periodDate" type="daterange" @on-change="periodDateChange" placeholder="付款截止日期" style="width: 200px"></DatePicker>
        </FormItem>
        <!-- <FormItem>
          <Select clearable
                  v-model="searchForm.countryCode"
                  placeholder="商标国家">
            <Option v-for="(item,index) in countryList"
                    :value="item.countryCode"
                    :key="index">{{ item.countryNameZh }}</Option>
          </Select>
        </FormItem> -->
        <!-- <FormItem>
          <Select clearable
                  v-model="searchForm.functionCode"
                  style="width: 100px;"
                  placeholder="全部商品">
            <Option value="1">注册税号</Option>
            <Option value="2">税务申报</Option>
            <Option value="5">注册+申报</Option>
            <Option value="6">注销税号</Option>
            <Option value="7">税务稽查</Option>
          </Select>
        </FormItem> -->
        <FormItem>
          <Button type="primary" @click="searchList" style="margin-right: 5px">查询</Button>
          <Button type="primary" ghost @click="resetList">重置</Button>
        </FormItem>
      </Form>
      <div class="money">
        <Row class-name="statistical">
          <Col span="4">订单金额: {{ allOrderOldMoney }}</Col>
          <Col span="4">应付金额: {{ allOrderMoney }}</Col>
          <Col span="4">优惠金额: {{ allDiscAmount }}</Col>
          <Col span="4">实付金额: {{ allAmountMoney }}</Col>
          <Col span="4">开票金额: {{ allInvoiceMoney }}</Col>
          <Col span="4">退款金额: {{ allRefundMoney }}</Col>
        </Row>
      </div>
      <div class="tableArea">
        <div class="tableAreaInline">
          <Tabs :value="searchForm.status" :animated="false" @on-click="tabsChange">
            <TabPane label="全部订单" name="-1"></TabPane>
            <TabPane label="待付款" name="0"></TabPane>
            <TabPane label="录单待确认" name="8"></TabPane>
            <TabPane label="录单被驳回" name="10"></TabPane>
            <TabPane label="付款待确认" name="1"></TabPane>
            <TabPane label="已付款" name="2"></TabPane>
            <TabPane label="已取消" name="3"></TabPane>
            <TabPane label="部分付款" name="4"></TabPane>
            <TabPane label="部分退款" name="5"></TabPane>
            <TabPane label="全额退款" name="6"></TabPane>
          </Tabs>
          <div>
            <Button
              type="primary"
              @click="
                isTypeIn = true
                detailId = ''
              "
              v-show="hasAuthority('orderlist_addrecord_001')"
              style="margin-right: 12px"
              >录入订单</Button
            >
            <Button @click="updatefollowuserFun" v-show="hasAuthority('order_list09')">修改跟进人</Button>
            <!-- <Button type="primary"
                    v-show="hasAuthority('order_list04')"
                    @click="exportList">导出Excel</Button> -->
          </div>
        </div>
        <Table border :loading="tableLoading" @on-selection-change="selectData" :columns="columns" :data="tableData">
          <template slot="orderStatusBox" slot-scope="{ row }">
            <span>{{
              row.status == '0'
                ? '待付款'
                : row.status == '1'
                ? '付款待确认'
                : row.status == '2'
                ? '已付款'
                : row.status == '3'
                ? '已取消'
                : row.status == '4'
                ? '部分付款'
                : row.status == '5'
                ? '部分退款'
                : row.status == '6'
                ? '全额退款'
                : row.status == '7'
                ? '无需支付'
                : row.status == '8'
                ? '录入待确认'
                : row.status == '9'
                ? '待录入凭证'
                : row.status == '10'
                ? '驳回'
                : row.status == '11' 
                ? '付款待确认' 
                : ''
            }}</span>
          </template>
          <template slot="operate" slot-scope="{ row }">
            <Button ghost type="info" v-show="hasAuthority('iipto_order_list02')" @click="toDetail(row.id)">查看</Button>
            <span v-if="row.status == 1">
              <!-- <Button ghost
                      v-show="hasAuthority('iipto_order_list01')"
                      type="info"
                      @click="confirm(row.id)">确认到账</Button> -->
            </span>
          </template>
        </Table>
        <Page @on-change="changePageHandler" :current="pageInfo.page" :total="listTotal" :page-size="pageInfo.limit" show-total show-elevator />
      </div>
    </div>
    <Modal v-model="followModal" width="350px" class-name="distribution" title="修改跟进人" @on-ok="updateInviteFun">
      <Select style="width: 100%" label-in-value @on-change="changeInviteUser" v-model="followInfo.followUserId" clearable placeholder="跟进人">
        <Option v-for="item in salesList" :value="item.userId" :key="item.nickName">{{ item.nickName }}</Option>
      </Select>
    </Modal>
    <orderDetail v-if="isDetailShow" :id="detailId" @back="backFn" @toChangeOrder="changeOrder" @refresh="refreshList"></orderDetail>
    <!-- <orderDetail v-if="isDetailShow" :id="detailId" @back="isDetailShow = false" @toChangeOrder="changeOrder" @refresh="refreshList"></orderDetail> -->
    <TypeInOrder
      v-if="isTypeIn"
      :id="detailId"
      @back="
        isTypeIn = false
        getOrderList()
      "
    ></TypeInOrder>
  </div>
</template>
<script>
import orderDetail from './components/orderDetail'
import TypeInOrder from './components/TypeInOrder'
import PaymentModal from './components/PaymentModal'
import * as API from '@/api/iipto/order.js'
import { roleusers } from '@/api/taxService/user'
import { getToken } from '@/libs/util'
import { companyBodySettingListApi } from '@/api/iipto/typeInOrder.js'
export default {
  name: 'orderList',
  components: {
    orderDetail,
    TypeInOrder,
    PaymentModal
  },
  data() {
    return {
      isDetailShow: false,
      isTypeIn: false,
      searchForm: {
        searchContent: '',
        orderSource: '',
        creatStartTime: '',
        creatEndTime: '',
        status: '',
        countryCode: '',
        paymentStartTime: '',
        paymentEndTime: '',
        inviteContentType: ''
      },
      date: '',
      paymentDate: '',
      periodDate: [],
      countryList: [],
      pageInfo: {
        limit: 10,
        page: 1
      },
      listTotal: 0,
      tableLoading: false,
      detailId: '',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          type: 'index',
          width: 50
        },
        {
          title: '订单号',
          key: 'orderNo',
          minWidth: 50
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '用户账号',
          key: 'userMobile'
        },
        {
          title: '服务名称',
          render(h, params) {
            let productNames = params.row.productNames.split(';')
            return h(
              'div',
              productNames.map(function (type) {
                return h('div', {}, type)
              })
            )
          }
        },
        {
          title: '服务金额',
          key: 'productOldMoney'
        },
        {
          title: '发票金额',
          key: 'invoiceMoney'
        },
        {
          title: '应付金额',
          key: 'orderAllMoney'
        },
        {
          title: '优惠金额',
          key: 'discAmountMoney'
        },
        {
          title: '实付金额',
          key: 'amountAllMoney'
        },
        {
          title: '退款金额',
          key: 'refundMoney'
        },
        {
          title: '渠道来源',
          key: 'orderSource',
          render: (h, params) => {
            return h('span', params.row.orderSource == 0 ? 'PC网页端' : params.row.orderSource == 1 ? '微信小程序' : params.row.orderSource == 2 ? 'H5' : params.row.orderSource == 3 ? '录入订单' : '')
          }
        },
        {
          title: '订单状态',
          slot: 'orderStatusBox'
        },
        {
          title: '邀请人',
          key: 'inviteUserName'
        },
        {
          title: '订单归属',
          key: 'followUserName'
        },
        {
          title: '操作',
          slot: 'operate'
        }
      ],
      allAmountMoney: 0,
      allDiscAmount: 0,
      allOrderMoney: 0,
      allOrderOldMoney: 0,
      allInvoiceMoney: 0,
      allRefundMoney: 0,
      tableData: [],
      value: '',
      salesList: [],
      followModal: false,
      inviteInfo: {},
      followInfo: {},
      selectArr: [],
      selectUserArr: [],
      inviteContent: '',
      companyBodyList: [] //收款账户
    }
  },
  mounted() {
    this.queryBaseInfoFunc()
    this.getOrderList()
    this.statisticsMoney()
    this.getRoleusers()
  },
  methods: {
    //订单创建时间
    dateChange(date) {
      this.searchForm.creatStartTime = date[0]
      this.searchForm.creatEndTime = date[1]
    },
    //订单付款时间
    paymentDateChange(date) {
      this.searchForm.paymentStartTime = date[0]
      this.searchForm.paymentEndTime = date[1]
    },
    //订单付款开始截止时间
    periodDateChange(date) {
      this.searchForm.periodStartTime = date[0]
      this.searchForm.periodEndTime = date[1]
    },
    //选择tab状态
    tabsChange(name) {
      this.searchForm.status = name
      this.getOrderList()
      this.statisticsMoney()
    },
    //获取列表
    getOrderList() {
      this.tableLoading = true
      let params = { ...this.searchForm, ...this.pageInfo }
      if (params.inviteContentType == 1) {
        params.inviteContent = this.inviteContent
      } else if (params.inviteContentType == 2) {
        params.followContent = this.inviteContent
      }
      if (params.status == -1) {
        delete params.status
      }
      // console.log(params);
      this.selectArr = []
      API.getOrderList(params)
        .then((res) => {
          if (res.code == 0) {
            // console.log(res.data.records)
            this.tableLoading = false
            this.tableData = res.data.records
            this.listTotal = Number(res.data.total)
          } else {
            this.$Message.warning(res.message)
            this.tableLoading = false
          }
        })
        .catch((err) => console.log(err))
    },
    //搜索列表
    searchList() {
      this.pageInfo.page = 1
      this.getOrderList()
      this.statisticsMoney()
    },
    //重置列表
    resetList() {
      this.searchForm = {}
      this.date = ''
      this.paymentDate = ''
      this.pageInfo.page = 1
      this.getOrderList()
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page
      this.getOrderList()
    },
    //查看详情
    toDetail(id) {
      this.isDetailShow = true
      this.detailId = id
    },
    //确认到账操作
    confirm(id) {
      this.$Modal.confirm({
        title: '是否确认到账',
        render: (h) => {
          return h('DatePicker', {
            props: {
              value: this.value,
              placeholder: '请选择款项的实际到账日期'
            },
            on: {
              input: (val) => {
                this.value = val
              }
            }
          })
        },
        onOk: () => {
          let data = {
            orderId: id,
            paymentTime: this.formatDate(this.value)
          }
          API.sureAccount(data)
            .then((res) => {
              if (res.code == 0) {
                this.$Message.success('确认成功')
                this.getOrderList()
              } else {
                this.$Message.warning(res.message)
              }
            })
            .catch((err) => console.log(err))
        }
      })
    },
    refreshList() {
      this.isDetailShow = false
      this.getOrderList()
    },
    changeOrder(val) {
      this.isDetailShow = false
      this.isTypeIn = true
      this.detailId = val
    },
    // 根据条件查询统计订单金额
    statisticsMoney() {
      let params = { ...this.searchForm, ...this.pageInfo }
      if (params.inviteContentType == 1) {
        params.inviteContent = this.inviteContent
      } else if (params.inviteContentType == 2) {
        params.followContent = this.inviteContent
      }
      if (params.status == -1) {
        delete params.status
      }
      API.statistics(params)
        .then((res) => {
          if (res.code === 0) {
            this.allAmountMoney = res.data.allAmountMoney
            this.allDiscAmount = res.data.allDiscAmount
            this.allOrderMoney = res.data.allOrderMoney
            this.allOrderOldMoney = res.data.allOrderOldMoney
            this.allInvoiceMoney = res.data.allInvoiceMoney
            this.allRefundMoney = res.data.allRefundMoney
          }
        })
        .catch((err) => console.log(err))
    },
    //导出Excel
    exportList() {
      let formData = new FormData()
      formData.append('searchContent', this.searchForm.searchContent)
      formData.append('status', this.searchForm.status)
      formData.append('orderSource', this.searchForm.orderSource)
      formData.append('creatStartTime', this.searchForm.creatStartTime)
      formData.append('creatEndTime', this.searchForm.creatEndTime)
      formData.append('countryCode', this.searchForm.countryCode)
      formData.append('functionCode', this.searchForm.functionCode)
      formData.append('inviteContent', this.searchForm.inviteContent)
      formData.append('paymentStartTime', this.searchForm.paymentStartTime)
      formData.append('paymentEndTime', this.searchForm.paymentEndTime)
      formData.append('inviteContentType', this.searchForm.inviteContentType)
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/etax/derive/management/order/export/list', true)
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
    },
    //批量操作
    selectData(val) {
      let self = this
      this.selectUserArr = val
      this.selectArr = []
      // console.log(this.selectUserArr)
      val.map(function (i, k) {
        self.selectArr.push(i.id)
      })
      // console.log(self.selectArr.join(','))
    },
    //修改跟进人
    updatefollowuserFun() {
      if (this.selectArr.length === 0) {
        this.$Message.success('请选择订单')
        return
      }
      this.followModal = true
    },
    changeInviteUser(val) {
      if (val != undefined) {
        this.inviteInfo.userId = val.value
        this.inviteInfo.userName = val.label
      }
    },
    updateInviteFun() {
      if (JSON.stringify(this.inviteInfo) === '{}') {
        this.$Message.success('请选择邀请人')
        return
      }
      this.inviteInfo.ids = this.selectArr.join(',')
      API.updatefollowuserAPI(this.inviteInfo).then((res) => {
        this.selectArr = []
        this.$Message.success('修改成功!')
        this.getOrderList()
      })
    },
    getRoleusers() {
      roleusers({
        roleCode: 'sales_manager;channel_manager'
      })
        .then((res) => {
          this.salesList = res.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    //时间格式转换
    formatDate(date) {
      if (typeof date === 'object') {
        const y = date.getFullYear()
        let m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = date.getDate()
        d = d < 10 ? '0' + d : d
        return y + '-' + m + '-' + d + ' 00:00:00'
      } else {
        return date
      }
    },
    // 获取收款账户列表
    queryBaseInfoFunc() {
      companyBodySettingListApi().then((res) => {
        if (res.code == 0) {
          this.companyBodyList = res.data
        }
      })
    },
    backFn(val) {
      // console.log(val);
      this.isDetailShow = false
      if (val) {
        this.getOrderList()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.money {
  .statistical {
    padding-left: 17px;
    font-size: 14px;
    margin-bottom: 30px;
  }
}
/deep/ .tableAreaInline {
  display: flex;
  justify-content: space-between;
  .ivu-tabs-bar {
    margin-bottom: 0px !important;
  }
  .ivu-btn-primary {
    height: 30px;
  }
}
/deep/ .tableArea {
  .ivu-table-cell {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
}
/deep/ .ivu-tabs-nav .ivu-tabs-tab {
  margin-right: 0;
}
/deep/ .ivu-tabs-ink-bar {
  background-color: transparent;
}
</style>
