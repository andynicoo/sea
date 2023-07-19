<template>
  <div class="content">
    <div class="no-data" v-if="tableData.length==0">
      <img src="https://fdfs.itaxs.com/group1/M00/04/9B/rBLKNV_HhkiAdyssAABP3OKB26c631.png" alt="">
      <p>您还没有购买过服务哦~，去首页逛逛吧~</p>
      <button @click="goHome">去首页</button>
    </div>
    <div class="table-box" v-else>
      <table class="table" cellpadding="0" cellspacing="0">
        <tr class="header">
          <th width="222">服务</th>
          <th width="86" >数量</th>
          <th width="126">价格</th>
          <th width="186">小计</th>
          <th width="106">状态/开票</th>
          <th width="182">操作</th>
        </tr>
        <div v-for="(item,index) in tableData" :key="index">
          <p class="title clearfix">
            <span>订单编号：{{ item.orderNo }}</span>
            <span>下单时间：{{ item.createTime }}</span>
          </p>
          <tr>
            <td class="service-box">
              <div v-for="(v,i) in item.orderProducts" :key="i">
                <p>服务名称：<span>{{ v.productProjectName }}</span></p>
                <p>服务项目：<span>{{ v.productProjectName.slice(v.productProjectName.lastIndexOf('-') + 1) }}</span> </p>
              </div>
            </td>
            <td>
              <p v-for="(v,i) in item.orderProducts" :key="i">{{ v.quantity }}</p>
            </td>
            <td>
              <p v-for="(v,i) in item.orderProducts" :key="i">
                ¥{{ v.productOldMoney }} / {{item.unit==1?'年':item.unit==2?'个':item.unit==3?'次':item.unit==4?'类':'类'}}
              </p>
            </td>
            <td class="amount">
              <p>服务金额： <span>¥{{ item.productOldMoney }}</span></p>
              <p>优惠：<span>¥{{ item.discAmount }}</span></p>
              <p>税费：<span>¥{{ item.invoiceMoney }}</span></p>
              <p>实付：
                <span class="orange-m" v-if="item.status==2">¥{{ item.amountMoney }}</span>
                <span class="orange-m" v-else>¥{{ item.orderMoney }}</span>
              </p>
            </td>
            <td class="operate">
              <p class="orange" v-if="item.status==0">待付款</p>
              <p class="blue" v-if="item.status==1">付款待确认</p>
              <p v-if="item.status==2">交易成功</p>
              <p class="gary" v-if="item.status==3">已取消</p>
              <p class="gary" v-if="item.status==4">部分付款</p>
              <p class="gary" v-if="item.status==5">部分退款</p>
              <p class="gary" v-if="item.status==6">全额退款</p>
              <p class="gary" v-if="item.status==10">订单驳回</p>
              <p class="gary" v-if="item.status==11">付款驳回</p>
              <p class="red" v-if="item.status==11">{{ item.rejectRemark }}</p>
              <p class="gary" v-if="item.status==12">待审核</p>
            </td>
            <td class="border-right">
              <Button class="bule-btn" v-if="item.status === 0" @click="goPay(item)">去付款</Button>
              <a v-if="item.status === 1" :href="item.orderPayments[0].paymentFile" target="_blank">
                <Button class="bule-btn">查看凭证</Button>
              </a>
            </td>
          </tr>
        </div>
      </table>
      <!-- <div class="pageSetion clearfix">
        <Page class="pagination" :current="pageInfo.page" :total="pageInfo.total" @on-change="registerChangePageHandler" :page-size="pageInfo.limit" />
      </div> -->
    </div>
    <SureOrder v-if="paymentBox" :orderInfo="orderInfo" @changeState="paymentBox=false;getListFun(1)"></SureOrder>
  </div>
</template>

<script>
import '@/assets/style/common.less'
import SureOrder from '../common/sureOrder'
import { getCostInfo } from '@/api/myPatent'
export default {
  components: {
    SureOrder
  },
  props: {
    designPatentWorkOrder: {}
  },
  data () {
    return {
      tableData: [],
      pageInfo: {
        page: 1,
        total: 0,
        limit: 10,
        status: '-1'
      },
      status: 0,
      paymentBox: false,
      orderInfo: {},
      timer: null,
      changeModal: false,
      rejectionReason: '',
      fileList: '',
      changeOrderId: ''
    }
  },
  mounted () {
    this.getListFun(1)
  },
  methods: {
    getListFun (page) {
      let data = { ...this.pageInfo }
      if (this.pageInfo.status === '-1') {
        delete data.status
      }
      if (page) {
        data.page = page
      }
      getCostInfo({
        serviceId: this.designPatentWorkOrder.serviceId
      })
        .then((res) => {
          if (res.code === 0) {
            this.tableData = res.data
            // this.pageInfo.page = Number(res.data.current)
            // this.pageInfo.total = Number(res.data.total)
          }
        })
        .finally(() => {
          this.filterRemark(this.tableData)
        })
    },
    filterRemark (data) {
      let self = this
      data.map((item) => {
        let remark = JSON.parse(item.remark)
        if (remark.financial_reject) {
          self.$set(item, 'rejectRemark', remark.financial_reject[0].remark)
        }
      })
    },
    registerChangePageHandler (page) {
      this.pageInfo.page = page
      this.getListFun()
    },
    goHome () {
      let url = ''
      if (this.invitedCode != null) {
        url = this.homePageUrl + '?invitedCode=' + this.invitedCode
      } else if (this.promteCode != null) {
        url = this.homePageUrl + '?promteCode=' + this.promteCode
      } else {
        url = this.homePageUrl
      }
      window.open(url)
    },
    goPay (row) {
      this.paymentBox = true
      this.orderInfo = { 
        ...row,
        clientOrderProductVOList: row.orderProducts,
        // 2 为外观专利
        productType: 2,
        supportPayType: []
      }
    }
  },
  created () {
    this.getListFun()
  }
}
</script>
<style lang="less" scoped>
.content {
  .no-data {
    margin: 56px auto;
    text-align: center;
    p {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      margin-top: 10px;
    }
    button {
      width: 98px;
      height: 32px;
      background: #00a3ff;
      margin-top: 12px;
      border: none;
      color: #fff;
      cursor: pointer;
    }
  }
  .table {
    width: 100%;
    margin-top: 18px;
    text-align: center;
    tr.header {
      padding: 14px 0;
      background-color: #d5f0ff;
      display: inline-block;
      margin-bottom: 20px;
      th {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }
    }
    td.operate{
      font-size:14px;
      color:#333
    }
    td.amount{
       padding-right:40px;
       text-align:right
    }
    td:first-child{
      width: 222px;
    }
    td:nth-child(2){
      width: 86px;
    }
    td:nth-child(3){
      width: 126px;
    }
    td:nth-child(4){
      width: 186px;
    }
    td:nth-child(5){
      width: 106px;
    }
    td:nth-child(6){
      width: 182px;
    }
    div {
      margin-bottom: 20px;
      p.title {
        padding: 14px 16px;
        background-color: #ebf8ff;
        font-size: 12px;
        font-family: PingFangSC;
        color: #333333;
        text-align: left;
        border-bottom: 0;
        span {
          margin-right: 14px;
        }
      }
      td {
        border: 1px solid rgba(153, 153, 153, 0.2);
        padding: 20px 0;
        border-top: 0;
        border-right: 0;
        font-size: 12px;
        font-family: PingFangSC;
        color: #666666;
        line-height: 18px;
        vertical-align: middle;
        p {
          line-height: 24px;
        }
      }
      .border-right {
        border-right: 1px solid rgba(153, 153, 153, 0.2);
      }
      .service-box {
        padding: 20px;
        width:222px
        p {
          text-align: left;
          span {
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
        }
      }
      .orange-m {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ff6600;
      }
      .orange {
        color: #ff6600;
      }
      .blue {
        color: #00a3ff;
      }
      .gary {
        color: #999999;
      }
      button {
        margin-bottom: 10px;
        width: 92px;
        height: 28px;
        border-radius: 100px;
        font-size: 12px;
        font-family: PingFangSC;
      }
      .bule-btn {
        background: #00a3ff;
        color: #ffffff;
        border: 1px solid #00a3ff;
      }
      .gary-btn {
        border: 1px solid #999999;
        color: #999999;
      }
      .bule-w-btn {
        border: 1px solid #1890ff;
        color: #00a3ff;
      }
    }
  }
  .pageSetion {
    text-align: center;
    margin-top: 36px;
    padding-bottom: 36px;
    .pagination {
      display: inline-block;
      line-height: 20px;
    }
    .totalNum {
      font-size: 14px;
      color: #9a9ca1;
    }
    &/deep/.ivu-page-simple .ivu-page-simple-pager input {
      padding: 0;
      margin: 0;
    }
    &/deep/.ivu-page-simple-pager {
      margin-right: 0;
    }
  }
}
</style>
