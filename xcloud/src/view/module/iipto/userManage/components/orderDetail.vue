<template>
  <div class="orderDetail">
    <div class="back"
         @click="goBack()"
         v-if="id!=undefined">
      <Icon type="md-arrow-back" />返回列表</div>
    <div class="orderDetailInfo">
      <div class="titleBox">
        <span class="title">订单信息</span>
        <Button v-if="orderDetailInfo.status==1"
                v-show="hasAuthority('order_list01')"
                type="primary"
                @click="confirm">确认到账</Button>
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
          <Col span="4">{{orderDetailInfo.userType == 0 ? "普通用户" :orderDetailInfo.userType == 1 ? "成交用户" : orderDetailInfo.userType == 2 ? "渠道用户" :orderDetailInfo.userType == 3 ? "推广用户" :   '其他'}}</Col>
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
          <Col span="4">{{orderDetailInfo.paymentTime || '暂无'}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">到账时间：</Col>
          <Col span="4">{{orderDetailInfo.gatheringTime || '暂无'}}</Col>
          <Col span="4">付款凭证：</Col>
          <Col span="4">
          <a v-if="orderDetailInfo.paymentFile!==''"
             :href="orderDetailInfo.paymentFile "
             target="_blank">{{'付款凭证'}}</a>
          <span v-if="orderDetailInfo.paymentFile==''">{{'暂无'}}</span>
          </Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">订单归属：</Col>
          <Col span="4">{{orderDetailInfo.followUserName || '暂无'}}</Col>
        </Row>
      </div>
    </div>
    <div class="serviceInfo">
      <p class="title">
        购买的服务信息
        <Button v-if="orderDetailInfo.status === 2 || orderDetailInfo.status === 5"
                type="primary"
                @click="requestRefund">申请退款</Button>
      </p>
      <Table :loading="tableLoading"
             :columns="columns"
             :data="tableData"
             class="serviceList"
             @on-selection-change="selectData">
        <template slot="status"
                  slot-scope="{ row }">
          <span>{{row.status == '1' ? "正常" : row.status == '2' ? "退款" : row.status == '3' ? "已付款" : row.status == '4' ? "无需支付" :""}}</span>
        </template>
      </Table>
      <!-- <Page
                    @on-change="changePageHandler"
                    :current="pageInfo.page"
                    :total="listTotal"
                    :page-size="pageInfo.limit"
                    show-total
                    show-elevator
                /> -->
    </div>
    <Modal title="申请退款"
           v-model="refundModal"
           class-name="refundModal"
           footer-hide>
      <Form :model="formLeft"
            ref="formLeft"
            label-position="left"
            :label-width="100"
            :rules="ruleForm">
        <FormItem label="退款的服务："
                  prop="serviceName"
                  :label-width="200">
          <Input v-model="formLeft.serviceName"
                 type="textarea"
                 disabled="disabled"></Input>
        </FormItem>
        <FormItem label="退款金额（最多可退款金额）："
                  class="money"
                  prop="refundMoney"
                  :label-width="250">
          <Input v-model="formLeft.refundMoney"
                 placeholder="请输入需退款金额"
                 type="number"
                 :disabled="orderDetailInfo.paymentChannel !== 3"></Input>元
        </FormItem>
        <FormItem label="退款银行："
                  prop="refundBank"
                  v-if="orderDetailInfo.paymentChannel === 3"
                  :label-width="200">
          <Input v-model="formLeft.refundBank"
                 placeholder="请输入银行名称"></Input>
        </FormItem>
        <FormItem label="退款账户："
                  prop="refundAccount"
                  v-if="orderDetailInfo.paymentChannel === 3"
                  :label-width="200">
          <Input v-model="formLeft.refundAccount"
                 placeholder="请输入银行卡号"></Input>
        </FormItem>
        <FormItem label="收款人/公司："
                  prop="refundPayee"
                  v-if="orderDetailInfo.paymentChannel === 3"
                  :label-width="200">
          <Input v-model="formLeft.refundPayee"
                 placeholder="请输入收款人/公司全名"></Input>
        </FormItem>
        <FormItem label="退款原因："
                  prop="refundReason"
                  :label-width="200">
          <Input v-model="formLeft.refundReason"
                 type="textarea"
                 placeholder="请输入退款原因"></Input>
        </FormItem>
        <FormItem style="text-align:center;">
          <Button type="primary"
                  @click="submitApplication('formLeft')">提交申请</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import * as API from '@/api/iipto/order.js'
export default {
  name: 'orderDetail',
  props: ['id'],
  data() {
    return {
      orderDetailInfo: {},
      pageInfo: {
        limit: 10,
        page: 1,
      },
      listTotal: 0,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '服务名称',
          key: 'productName'
        },
        {
          title: '服务号',
          key: 'serverNo'
        },
        {
          title: '服务国家',
          key: 'countryNameZh'
        },
        {
          title: '服务金额',
          key: 'price'
        },
        {
          title: '优惠金额',
          key: 'discAmount'
        },
        {
          title: '发票金额',
          key: 'invoiceMoney'
        },
        {
          title: '数量',
          key: 'count'
        },
        {
          title: '服务公司',
          key: 'companyName'
        },
        {
          title: '服务状态',
          slot: 'status'
        },
        {
          title: '操作',
          key: ''
        },
      ],
      tableData: [],
      tableLoading: false,
      formLeft: {
        serviceName: '',
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
        // refundMoney: [
        //     { required: true, trigger: "blur", message: "请填写最多可退款金额" },
        // ],
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
      value: ''
    }
  },
  mounted() {
    this.getOrderDetail();
  },
  watch: {
    $route(to, from) {
      if (to.path === '/orderDetail') {
        this.getOrderDetail();
      }
    }
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
    getOrderDetail() {
      this.tableLoading = true;
      let orderId = ''
      if (this.id == undefined) {
        orderId = this.$route.query.id
      } else {
        orderId = this.id
      }
      API.getOrderDetail({ orderId }).then((res) => {
        this.tableLoading = false;
        if (res.code == 0) {
          this.orderDetailInfo = res.data;
          this.tableData = res.data.orderBuyProductList;
          this.tableData.forEach(element => {
            if (element.status === 2) {
              element._disabled = true
            }
          })
        } else {
          this.$Message.warning(res.message);
        }
      })
        .catch((err) => console.log(err))
    },
    //确认到账操作
    confirm() {
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
                this.value = val;
              }
            }
          })
        },
        onOk: () => {
          let data = {
            orderId: this.id,
            paymentTime: this.formatDate(this.value)
          }
          API.sureAccount(data).then((res) => {
            if (res.code == 0) {
              this.$Message.success('确认成功')
              this.$emit('refresh')
            } else {
              this.$Message.warning(res.message)
            }
          })
            .catch(err => console.log(err))
        }
      })
    },
    // 列表选中的项
    selectData(val) {
      this.ModalData = val
    },
    requestRefund() {
      this.formLeft = {
        serviceName: '',
        refundMoney: 0,
        orderProductIds: '',
      }
      if (this.ModalData.length === 0) {
        this.$Message.warning('请选择服务')
        return
      }
      for (let index = 0; index < this.ModalData.length; index++) {
        const element = this.ModalData[index];
        this.formLeft.orderProductIds += element.orderProductId + ','
        this.formLeft.serviceName += element.productName + ';  '
        this.formLeft.refundMoney += (Number(element.price) - Number(element.discAmount) + Number(element.invoiceMoney)) * 100
      }
      this.formLeft.refundMoney = Math.floor((this.formLeft.refundMoney) / 100 * 100) / 100
      this.formLeft.orderProductIds = this.formLeft.orderProductIds.substr(0, this.formLeft.orderProductIds.length - 1)
      this.refundModal = true
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
    // 提交申请
    submitApplication(name) {
      if (this.id === undefined) {
        this.formLeft.orderId = this.$route.query.id
      } else {
        this.formLeft.orderId = this.id
      }
      if (this.formLeft.refundMoney <= 0) {
        this.$Message.error('退款金额不能小于等于0')
        return
      }
      if (this.formLeft.refundMoney > Number(this.orderDetailInfo.amountMoney)) {
        this.$Message.error('退款金额不能大于订单已付金额');
        return
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          API.requestRefund(this.formLeft).then(res => {
            if (res.code === 0) {
              this.$Message.success('申请退款成功');
              this.refundModal = false
              this.getOrderDetail()
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.$Message.error('请填写完整资料');
        }
      })
    }
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