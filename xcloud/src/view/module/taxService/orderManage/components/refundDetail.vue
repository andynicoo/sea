<template>
  <div class="orderDetail">
    <div class="back" @click="goBack()">
      <Icon type="md-arrow-back" />返回列表
    </div>
    <div class="orderDetailInfo">
      <div class="titleBox">
        <span class="title">退款信息</span>
        <Button v-if="refundDetailInfo.status === 0" v-show="hasAuthority('order_refund02')" type="primary" @click="auditFun(id)">审核</Button>
        <Button v-if="refundDetailInfo.status === 1" v-show="hasAuthority('order_refund03')" type="primary" @click="refundFun()">确认退款</Button>
      </div>
      <div class="basicInfoBox">
        <Row class="rowItem">
          <Col span="4">申请人：</Col>
          <Col span="4">{{refundDetailInfo.createBy}}</Col>
          <Col span="4">申请时间：</Col>
          <Col span="4">{{refundDetailInfo.createTime}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">本次退款金额：</Col>
          <Col span="4">{{rowInfo.refundMoney}}</Col>
          <Col span="4">累计退款金额：</Col>
          <Col span="4">{{orderDetailInfo.refundMoney}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">退款状态：</Col>
          <Col span="4">{{refundDetailInfo.status == '0' ? "待审核" : refundDetailInfo.status == '1' ? "待退款" : refundDetailInfo.status == '2' ? "已退款" : refundDetailInfo.status == '3' ? "审核不通过" :""}}</Col>
          <Col span="4">退款原因：</Col>
          <Col span="4">{{rowInfo.refundReason}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">退款凭证：</Col>
          <Col span="4"><a :href="rowInfo.refundCertificate" target="_blank" v-if="rowInfo.refundCertificate">点击查看</a></Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">退款的服务：</Col>
        </Row>
        <Row class="rowItem">
          <Table :loading="tableLoading" :columns="columns" :data="tableData" class="serviceList">
            <template slot="status" slot-scope="{ row }">
              <span>{{row.status == '0' ? "待付款" : row.status == '1' ? "付款待确认" : row.status == '2' ? "已付款" : row.status == '3' ? "已取消" : ""}}</span>
            </template>
          </Table>
        </Row>
      </div>
    </div>
    <div class="orderDetailInfo">
      <div class="titleBox">
        <span class="title">订单信息</span>
        <!-- <Button v-if="orderDetailInfo.status==1" v-show="hasAuthority('order_list01')" type="primary" @click="confirm">确认到账</Button> -->
      </div>
      <div class="basicInfoBox">
        <Row class="rowItem">
          <Col span="4">订单号：</Col>
          <Col span="4">{{orderDetailInfo.orderNo}}</Col>
          <Col span="4">订单状态：</Col>
          <Col span="4">{{orderDetailInfo.status == '0' ? "待付款" : orderDetailInfo.status == '1' ? "付款待确认" : orderDetailInfo.status == '2' ? "已付款" : orderDetailInfo.status == '3' ? "已取消" : orderDetailInfo.status == '4' ? '部分付款' : orderDetailInfo.status == '5' ? '部分退款' : orderDetailInfo.status == '6' ? '全额退款' : '' }}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">用户昵称：</Col>
          <Col span="4">{{orderDetailInfo.userNickname || "暂无"}}</Col>
          <Col span="4">手机号：</Col>
          <Col span="4">{{orderDetailInfo.userMobile}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">用户级别：</Col>
          <Col span="4">{{orderDetailInfo.userType == 0 ? "普通用户" : '其他'}}</Col>
          <Col span="4">电子邮箱：</Col>
          <Col span="4">{{orderDetailInfo.userEmail || '暂无'}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">订单金额：</Col>
          <Col span="4">{{orderDetailInfo.orderOldMoney}}</Col>
          <Col span="4">优惠金额：</Col>
          <Col span="4">{{orderDetailInfo.discAmount}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">应付金额：</Col>
          <Col span="4">{{orderDetailInfo.orderMoney}}</Col>
          <Col span="4">订单来源:</Col>
          <Col span="4">{{orderDetailInfo.orderSource == '0' ? "PC网页端" :orderDetailInfo.orderSource == '1'?"微信小程序":orderDetailInfo.orderSource == '2'? "微信公众号":""}}</Col>

        </Row>
        <Row class="rowItem">
          <Col span="4">实付金额：</Col>
          <Col span="4">{{orderDetailInfo.amountMoney}}</Col>
          <Col span="4">支付渠道:</Col>
          <Col span="4">{{orderDetailInfo.paymentChannel == '0' ? "未知" :orderDetailInfo.paymentChannel == '1' ? "微信扫码支付" :orderDetailInfo.paymentChannel == '2' ? "支付宝PC端支付" :orderDetailInfo.paymentChannel == '3' ? "银联" :orderDetailInfo.paymentChannel == '4' ? "微信小程序支付" :orderDetailInfo.paymentChannel == '5'? "微信公众号支付" : ""}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">创建时间：</Col>
          <Col span="4">{{orderDetailInfo.createTime}}</Col>
          <Col span="4">付款时间：</Col>
          <Col span="4">{{orderDetailInfo.paymentTime}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">到账时间：</Col>
          <Col span="4">{{orderDetailInfo.gatheringTime || '暂无'}}</Col>
          <Col span="4">付款凭证：</Col>
          <Col span="4">
          <a v-if="orderDetailInfo.paymentFile!==''" :href="orderDetailInfo.paymentFile " target="_blank">{{'付款凭证'}}</a>
          <span v-if="orderDetailInfo.paymentFile==''">{{'暂无'}}</span>
          </Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">订单归属：</Col>
          <Col span="4">{{orderDetailInfo.followUserName || '暂无'}}</Col>
        </Row>
      </div>
    </div>
    <div class="orderDetailInfo">
      <div class="titleBox">
        <span class="title">操作记录</span>
      </div>
      <Table :loading="tableLogLoading" :columns="columnsLog" :data="tableDataLog" class="serviceList">
        <template slot="reason" slot-scope="{ row }">
          <div>
            <span v-if="row.status == 0">审核不通过<span style="color: rgb(226,62,75);" v-if="row.reason">（原因：{{row.reason}}）</span></span>
            <span v-if="row.status == 1">审核通过</span>
            <span v-if="row.status == 2">退款完成</span>
            
          </div>
        </template>
      </Table>
    </div>
    <auditMedal v-if="isAuditMedalShow" @changeState="auditMedalFun" :refundId="rowInfo.id" @refresh="refreshDetail"></auditMedal>
    <refundMedal v-if="isRefundMedalShow" @changeState="auditMedalFun" :refundInfo="rowInfo" @refresh="refreshDetail"></refundMedal>
  </div>
</template>
<script>
import * as API from '@/api/taxService/order.js'
import refundMedal from "../components/refundMedal"
import auditMedal from "../components/auditMedal"
export default {
  name: 'orderDetail',
  props: ['rowInfo'],
  data() {
    return {
      orderDetailInfo: {},
      refundDetailInfo: {},
      isAuditMedalShow: false,
      isRefundMedalShow: false,
      pageInfo: {
        limit: 10,
        page: 1,
      },
      listTotal: 0,
      columns: [
        {
          title: '服务名称',
          key: 'productName'
        },
        {
          title: '服务金额',
          key: 'price'
        },
        {
          title: '优惠金额',
          key: 'discAmount'
        },
      ],
      tableData: [],
      tableLoading: false,
      columnsLog: [
        {
          title: '操作人',
          key: 'operationUser'
        },
        {
          title: '审核时间',
          key: 'createTime'
        },
        {
          title: '操作记录',
          slot: 'reason'
        },
      ],
      tableDataLog: [],
      tableLogLoading: false,
      formLeft: {
        refundMoney: 0,
        refundBank: '',
        refundAccount: '',
        refundPayee: '',
        refundReason: '',
        orderProductIds: '',
        orderId: ''
      },
      refundModal: false,
      ruleForm: {
        refundMoney: [
          { required: true, type: 'number', trigger: "blur", message: "请填写最多可退款金额" },
        ],
        refundBank: [
          { required: true, trigger: "blur", message: "请填写退款银行" }
        ],
        refundAccount: [
          { required: true, trigger: "blur", message: "请填写退款账户" }
        ],
        refundPayee: [
          { required: true, trigger: "blur", message: "请填写收款人/公司" }
        ],
        refundReason: [
          { required: true, trigger: "blur", message: "请填写退款原因" }
        ],
      },
      ModalData: [],
    }
  },
  components: {
    auditMedal,
    refundMedal
  },
  mounted() {
    this.getRefundDetail();
  },
  methods: {
    //返回列表
    goBack() {
      this.$emit('back')
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page
    },
    //详情信息
    getRefundDetail() {
      this.tableLoading = true;
      let refundId = this.rowInfo.id
      API.refundDetail({ refundId }).then((res) => {
        this.tableLoading = false;
        if (res.code == 0) {
          this.refundDetailInfo = res.data
          this.tableDataLog = res.data.operationRecord;
          this.orderDetailInfo = res.data.orderBasic;
          this.tableData = res.data.refundProductList;
        } else {
          this.$Message.warning(res.message);
        }
      })
        .catch((err) => console.log(err))
    },
    //确认到账操作
    // confirm() {
    //     this.$Modal.confirm({
    //         title: '是否确认到账',
    //         content: '可在详情页查看付款凭证',
    //         onOk: () => {
    //             API.sureAccount({orderId: this.id}).then((res) => {
    //                 if(res.code == 0) {
    //                     this.$Message.success('确认成功')
    //                     this.$emit('refresh')
    //                 }else {
    //                     this.$Message.warning(res.message)
    //                 }
    //             })
    //             .catch(err => console.log(err))
    //         }
    //     })
    // },
    auditMedalFun(obj) {
      this.isAuditMedalShow = obj.state
      this.isRefundMedalShow = obj.state
    },
    auditFun() {
      this.isAuditMedalShow = true
    },
    refundFun() {
      this.isRefundMedalShow = true
    },
    requestRefund() {
      if (this.ModalData.length === 0) {
        this.$Message.warning('请选择服务')
        return
      }
      for (let index = 0; index < this.ModalData.length; index++) {
        const element = this.ModalData[index];
        this.formLeft.orderProductIds += element.orderProductId + ','
        this.formLeft.refundMoney += (Number(element.price) - Number(element.discAmount)) * 100
      }
      this.formLeft.refundMoney = this.formLeft.refundMoney / 100
      this.formLeft.orderProductIds = this.formLeft.orderProductIds.substr(0, this.formLeft.orderProductIds.length - 1)
      this.refundModal = true
    },
    refreshDetail() {
      this.getRefundDetail();
      this.isAuditMedalShow = false
      this.isRefundMedalShow = false
    }
    // 提交申请
    // submitApplication(name) {
    //     if(this.id === undefined){
    //         this.formLeft.orderId = this.$route.query.id
    //     }else{
    //         this.formLeft.orderId = this.id
    //     }
    //     if (this.formLeft.refundMoney < 0) {
    //         this.$Message.error('退款金额不能小于0')
    //         return
    //     }
    //     if (this.formLeft.refundMoney > Number(this.orderDetailInfo.amountMoney)) {
    //         this.$Message.error('退款金额不能大于订单已付金额');
    //         return
    //     }
    //     this.$refs[name].validate((valid) => {
    //         if (valid) {
    //             API.requestRefund(this.formLeft).then(res => {
    //                 if (res.code === 0) {
    //                     this.$Message.success('申请退款成功');
    //                     this.refundModal = false
    //                     this.getRefundDetail()
    //                 }
    //             }).catch(error => {
    //                 console.log(error)
    //             })
    //         } else {
    //             this.$Message.error('请填写完整资料');
    //         }
    //     })
    // }
  },
}
</script>
<style lang="less" scoped>
.orderDetail {
  .back {
    height: 40px;
    line-height: 40px;
    cursor: pointer;
  }
  /deep/ .serviceInfo {
    .title {
      font-size: 16px;
      font-weight: 700;
      padding-left: 10px;
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #ccc;
    }
    .ivu-btn {
      float: right;
    }
  }
  .orderDetailInfo {
    .titleBox {
      display: flex;
      justify-content: space-between;
      height: 36px;
      line-height: 36px;
      border-bottom: 1px solid #ccc;
      .title {
        font-size: 16px;
        font-weight: 700;
      }
    }
    .basicInfoBox {
      padding: 20px;
      .rowItem {
        margin-bottom: 10px;
      }
    }
  }
}
/deep/ .serviceList {
  margin-top: 10px;
  .ivu-table td {
    border-right: 1px solid #e8eaec;
  }
}
/deep/ .refundModal {
  .ivu-form-item {
    display: flex;
    flex-direction: column;
  }
  .ivu-form-item-content {
    margin-left: 0px !important;
  }
  .money {
    .ivu-form-item-content {
      display: inherit;
    }
  }
}
</style>