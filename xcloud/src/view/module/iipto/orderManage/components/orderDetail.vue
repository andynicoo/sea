<template>
  <div class="orderDetail">
    <Card v-if="id!=undefined">
      <div class="back"
           @click="goBack()"
           >
        <Icon type="md-arrow-back" />返回列表</div>
    </Card>
    <Card class="orderDetailInfo">
      <div class="titleBox">
        <span class="title">订单信息</span>
        <!-- <Button v-if="orderDetailInfo.status==1"
                v-show="hasAuthority('order_list01')"
                type="primary"
                @click="confirm">确认到账</Button> -->

        <Button v-if="orderDetailInfo.status == 8 && hasAuthority('orderdetails_verify_001')" type="primary" @click="sureOrderModal = true">订单确认</Button>
        <Button v-if="orderDetailInfo.status == 10 && hasAuthority('orderdetails_record_001')" type="primary" @click="changeOrder()">修改订单</Button>
      </div>
      <div class="basicInfoBox">
        <Row class="rowItem">
          <Col span="8">订单号：{{ orderDetailInfo.orderNo }}</Col>
          <Col span="8"
            >订单状态：{{
              orderDetailInfo.status == '0'
                ? '待付款'
                : orderDetailInfo.status == '1'
                ? '付款待确认'
                : orderDetailInfo.status == '2'
                ? '已付款'
                : orderDetailInfo.status == '3'
                ? '已取消'
                : orderDetailInfo.status == '4'
                ? '部分付款'
                : orderDetailInfo.status == '5'
                ? '部分退款'
                : orderDetailInfo.status == '6'
                ? '全额退款'
                : orderDetailInfo.status == '7'
                ? '无需支付'
                : orderDetailInfo.status == '8'
                ? '录入待确认'
                : orderDetailInfo.status == '9'
                ? '待录入凭证'
                : orderDetailInfo.status == '10'
                ? '驳回'
                : orderDetailInfo.status == '11'
                ? '付款待确认'
                : ''
            }}</Col
          >
        </Row>
        <Row class="rowItem">
          <Col span="8">用户昵称：{{ orderDetailInfo.userNickname || '暂无' }}</Col>
          <Col span="8">手机号：{{ orderDetailInfo.userMobile }}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="8"
            >用户级别：{{
              orderDetailInfo.userType == 0 ? '普通用户' : orderDetailInfo.userType == 1 ? '成交用户' : orderDetailInfo.userType == 2 ? '渠道用户' : orderDetailInfo.userType == 3 ? '推广用户' : '其他'
            }}</Col
          >
          <Col span="8">电子邮箱：{{ orderDetailInfo.userEmail || '暂无' }}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="8">订单金额：{{ orderDetailInfo.orderOldAllMoney }}</Col>
          <Col span="8">优惠金额：{{ orderDetailInfo.discAmountMoney }}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="8">应付金额：{{ orderDetailInfo.orderAllMoney }}</Col>
          <Col span="8"
            >渠道来源：{{
              orderDetailInfo.orderSource == '0'
                ? 'PC网页端'
                : orderDetailInfo.orderSource == '1'
                ? '微信小程序'
                : orderDetailInfo.orderSource == '2'
                ? 'H5'
                : orderDetailInfo.orderSource == '3'
                ? '录入订单'
                : ''
            }}</Col
          >
        </Row>
        <Row class="rowItem">
          <Col span="8">实付金额：{{ orderDetailInfo.amountAllMoney }}</Col>
          <Col span="8"
            >订单来源：{{ orderDetailInfo.orderBusinessSource == 1 ? '必胜道' : orderDetailInfo.orderBusinessSource == 2 ? '卖家成长' : orderDetailInfo.orderBusinessSource == 3 ? '跨标云' : '' }}</Col
          >
          <!-- <Col span="4">支付渠道:</Col>
          <Col span="4">{{orderDetailInfo.paymentChannel == '0' ? "未知" :orderDetailInfo.paymentChannel == '1' ? "微信扫码支付" :orderDetailInfo.paymentChannel == '2' ? "支付宝PC端支付" :orderDetailInfo.paymentChannel == '3' ? "银联" :orderDetailInfo.paymentChannel == '4' ? "微信小程序支付" :orderDetailInfo.paymentChannel == '5'? "微信公众号支付" : ""}}</Col> -->
        </Row>
        <!-- <Col span="4">付款时间：</Col>
          <Col span="4">{{orderDetailInfo.paymentTime || '暂无'}}</Col> -->
        <!-- <Row class="rowItem">
          <Col span="4">到账时间：</Col>
          <Col span="4">{{orderDetailInfo.gatheringTime || '暂无'}}</Col>
          <Col span="4">付款凭证：</Col>
          <Col span="4">
          <a v-if="orderDetailInfo.paymentFile!==''"
             :href="orderDetailInfo.paymentFile "
             target="_blank">{{'付款凭证'}}</a>
          <span v-if="orderDetailInfo.paymentFile==''">{{'暂无'}}</span>
          </Col>
        </Row> -->
        <Row class="rowItem">
          <Col span="8">创建时间：{{ orderDetailInfo.createTime }}</Col>
          <Col span="8">订单归属：{{ orderDetailInfo.followUserName || '暂无' }}</Col>
        </Row>
      </div>
      <div class="serviceInfo">
        <p class="title">付款信息</p>
        <Table :columns="payColumns" :data="payTableData" class="serviceList">
          <template slot="paymentFileBox" slot-scope="{ row }">
            <div>
              <a v-if="row.voucherUrl !== ''" :href="row.voucherUrl" target="_blank">{{ '付款凭证' }}</a>
              <span v-if="row.voucherUrl == ''">{{ '暂无' }}</span>
            </div>
          </template>
          <template slot="status" slot-scope="{ row }">
            <span>{{ row.status == '1' ? '未付款' : row.status == '2' ? '退款' : row.status == '3' ? '已付款' : row.status == '4' ? '无需支付' : '' }}</span>
          </template>
          <!-- 新增‘操作’列 -->
          <template slot="paymentOper" slot-scope="{ row }">
            <span class="va-btn" v-if="confirmToZhangIf(row.voucherStatus, orderDetailInfo.status, orderSourceBut)" @click="confirmToZhang(row)">确认到账</span>

            <!-- <div>
              <span class="va-btn" v-if="confirmToZhangIf(row.voucherStatus, orderDetailInfo.status, orderSourceBut)" @click="confirmToZhang(row)">确认到账</span>
              <span class="va-btn" v-if="row.voucherStatus === 0 && (orderDetailInfo.status === 1 || orderDetailInfo.status === 11) && (orderSourceBut === 3 || orderSourceBut === 0)">测试</span>
            </div> -->
            <!-- <span
              class="va-btn"
              v-if="row.voucherStatus === 0 && (orderDetailInfo.status === 1 || orderDetailInfo.status === 11) && (orderSourceBut === 3 || orderSourceBut === 0)"
              @click="confirmToZhang(row)"
              >确认到账</span
            > -->
            <span class="va-btn" v-if="orderSourceBut === 3 && row.voucherStatus === 1" @click="modify(row)">修改</span>
            <!-- <span class="va-btn" @click="modify(row)">修改</span> -->
            <!-- 灰色 -->
            <span class="va-btn-prompt" v-if="orderSourceBut === 0 && row.voucherStatus === 1" @click="btnprompt">修改</span>
          </template>
        </Table>
        <div class="remark-box">
          <div class="box-label">
            <span>订单备注：</span>
            <Icon type="ios-create-outline" class="editor-icon" @click="editorRemark" />
          </div>
          <div class="box-content">
            <span v-if="orderDetailInfo.remark">{{ orderDetailInfo.remark }}</span>
            <span v-else>未填写</span>
          </div>
        </div>
      </div>
    </Card>
    <Card class="serviceInfo">
      <p class="title">
        购买的服务信息
        <Button v-if="orderDetailInfo.status === 2 || orderDetailInfo.status === 5" type="primary" @click="requestRefund">申请退款</Button>

        <Button v-if="(orderDetailInfo.status == 9 || orderDetailInfo.status == 4) && hasAuthority('orderdetails_record_001')" @click="typeinPayModal = true">录入付款凭证</Button>
        <Button v-if="hasAuthority('orderdetails_cancelorder_001')" @click="cancleOrderFunc" style="margin-right: 8px">取消服务</Button>
      </p>
      <Table :loading="tableLoading"
             :columns="columns"
             :data="tableData"
             class="serviceList"
             @on-selection-change="selectData">
        <template slot="status"
                  slot-scope="{ row }">
          <span>{{row.servicesStatus == '1' ? "正常" : row.servicesStatus == '2' ? "已退款" : row.servicesStatus == '3' ? "退款申请中" :""}}</span>
        </template>
      </Table>
      <Page @on-change="changePageHandler" :current="pageInfo.page" :total="listTotal" :page-size="pageInfo.limit" show-total show-elevator />
    </Card>
    <!-- 修改付款信息 -->
    <Modal v-model="modifyCertificate" title="修改付款凭证" width="830" :mask-closable="false" @on-ok="modifyCertificateFn" @on-cancel="modifyCertificate = false">
      <Form :model="formFile" class="formTrans" ref="formFile" :rules="ruleFormFile" label-position="top">
        <div class="modify-modal-box">
          <FormItem label="付款凭证" prop="voucherUrl">
            <Upload
              :show-upload-list="false"
              :format="['jpg', 'png']"
              :max-size="2 * 1024"
              :action="workOrderFile"
              :before-upload="beforeUploadAccept1"
              :on-format-error="formatErrorHandler1"
              :on-success="
                (res, file, fileList) => {
                  successHandlerAccept1(res, file, fileList)
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeHandlerAccept1(file, fileList)
                }
              "
              style="accept-upload"
            >
              <div class="demo-upload-list">
                <!-- 图片显示 -->
                <img :src="uploadImg" v-if="uploadImg" />
                <div class="demo-upload-list-cover">
                  <!-- <Icon type="ios-trash-outline" @click.native="changeState"></Icon>
                  <Icon type="ios-eye-outline" @click.native="changeState"></Icon> -->
                  <Icon type="ios-cloud-upload-outline"></Icon>
                </div>
              </div>
              <!-- <Button style="height: 100px; width: 100px"><img style="width: 100%; height: 100%" :src="uploadImg" alt="" /></Button> -->
              <!-- <Button icon="ios-cloud-upload-outline" style="height: 100px">上传图片</Button> -->
            </Upload>
            <Button style="width: 100px; height: 30px" @click="visible = !visible">预览图片</Button>
            <p class="">文件格式：.jpg，.png，图片大小＜2M</p>
          </FormItem>
          <div class="modify-modal-right">
            <FormItem label="支付方式" prop="payType">
              <Select v-model="formFile.payType" style="width: 250px">
                <!-- <Option value="0">未知</Option> -->
                <Option value="1">微信</Option>
                <Option value="2">支付宝</Option>
                <Option value="3">银联</Option>
              </Select>
            </FormItem>
            <FormItem label="付款方" prop="payer">
              <Input v-model="formFile.payer" clearable placeholder="请输入付款方" style="width: 250px" />
            </FormItem>
            <!-- <Select clearable
                      v-model="formFile.acceptAccountName"
                      style="width: 250px"
                      placeholder="收款账号">
                <Option value="1">全部</Option>
                <Option value="2">跨标云账号</Option></Option>
                <Option value="3">等等</Option>
              </Select> -->
            <!-- <FormItem label="收款账号" prop="acceptAccountName">
              <Input v-model="formFile.acceptAccountName" clearable placeholder="收款账号" style="width: 250px" />
            </FormItem> -->
            <FormItem label="收款账户" style="width: 250px" prop="acceptAccountName">
              <Select v-model="formFile.acceptAccountName" placeholder="请选择收款账户">
                <Option v-for="(item, index) in companyBodyList" :key="index" :value="item.accountName">{{ item.accountName }}</Option>
              </Select>
            </FormItem>
            <!-- 禁用状态 -->
            <FormItem v-if="formFile.orderPaymentType === 0" label="实收金额" class="amount-box">
              <span class="paid-in-amount">(尾款{{ formFile.remainingBalance }}，订单总金额¥{{ formFile.orderAllMoney }})</span>
              <Input disabled type="text" :placeholder="formFile.amount + ''" style="width: 250px">
                <Icon type="logo-yen" slot="prefix" size="12" />
              </Input>
            </FormItem>
            <FormItem v-if="formFile.orderPaymentType !== 0" label="实收金额" prop="amount" class="amount-box">
              <span class="paid-in-amount">(尾款{{ formFile.remainingBalance }}，订单总金额¥{{ formFile.orderAllMoney }})</span>
              <Input type="number" number placeholder="请输入实收金额" style="width: 250px" v-model="formFile.amount">
                <Icon type="logo-yen" slot="prefix" size="12" />
              </Input>
            </FormItem>
            <!-- <FormItem label="交易流水号" prop="acceptAccountNum">
              <Input v-model="formFile.acceptAccountNum" clearable placeholder="请填写交易流水号" style="width: 250px" />
            </FormItem> -->
            <FormItem label="付款日期：" prop="payTime">
              <DatePicker type="date" v-model="formFile.payTime" @on-change="moDate" placeholder="yyyy-mm-dd" style="width: 250px"></DatePicker>
            </FormItem>
          </div>
        </div>
      </Form>
      <div slot="footer" style="width: 150px">
        <Button type="primary" @click="sureUload">确定</Button>
        <Button
          type="primary"
          ghost
          style="margin-left: 20px"
          @click="
            modifyCertificate = false
            formFile.payTime = ''
          "
          >取消</Button
        >
      </div>
    </Modal>

    <Modal title="申请退款" v-model="refundModal" class-name="refundModal" footer-hide>
      <Form :model="formLeft" ref="formLeft" label-position="left" :label-width="100" :rules="ruleForm">
        <FormItem label="退款的服务：" prop="serviceName" :label-width="200">
          <Input v-model="formLeft.serviceName" type="textarea" disabled="disabled"></Input>
        </FormItem>
        <FormItem label="退款金额（最多可退款金额）：" class="money" prop="refundMoney" :label-width="250">
          <Input v-model="formLeft.refundMoney" placeholder="请输入需退款金额" type="number" :disabled="orderDetailInfo.paymentChannel !== 3"></Input>元
        </FormItem>
        <FormItem label="退款银行：" prop="refundBank" v-if="orderDetailInfo.paymentChannel === 3" :label-width="200">
          <Input v-model="formLeft.refundBank" placeholder="请输入银行名称"></Input>
        </FormItem>
        <FormItem label="退款账户：" prop="refundAccount" v-if="orderDetailInfo.paymentChannel === 3" :label-width="200">
          <Input v-model="formLeft.refundAccount" placeholder="请输入银行卡号"></Input>
        </FormItem>
        <FormItem label="收款人/公司：" prop="refundPayee" v-if="orderDetailInfo.paymentChannel === 3" :label-width="200">
          <Input v-model="formLeft.refundPayee" placeholder="请输入收款人/公司全名"></Input>
        </FormItem>
        <FormItem label="退款原因：" prop="refundReason" :label-width="200">
          <Input v-model="formLeft.refundReason" type="textarea" placeholder="请输入退款原因"></Input>
        </FormItem>
        <FormItem style="text-align: center">
          <Button type="primary" @click="submitApplication('formLeft')">提交申请</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="sureOrderModal" title="订单确认">
      <RadioGroup v-model="auditType" style="margin: 20px 0">
        <Radio label="0">订单确认无误</Radio>
        <Radio label="1">信息有误，驳回订单</Radio>
      </RadioGroup>
      <div v-if="auditType == 1">
        <Input v-model="rejectReason" type="textarea" :maxlength="500" :autosize="{ minRows: 2, maxRows: 5 }" placeholder="请输入驳回原因"></Input>
      </div>
      <p slot="footer">
        <Button type="primary" ghost style="margin-right: 20px" @click="sureOrderModal = false">取消</Button>
        <Button type="primary" @click="sureOrderFunc">确认</Button>
      </p>
    </Modal>
    <!-- 确认到账 -->
    <Modal v-model="determineMoney" title="确认到账">
      <RadioGroup v-model="auditTypeDetermine" style="margin: 20px 0">
        <Radio label="0">已收到款项</Radio>
        <Radio label="1">未收到款，或凭证错误</Radio>
      </RadioGroup>
      <div v-if="auditTypeDetermine === '0'">
        <DatePicker type="date" @on-change="dateChange" :value="accountDate" format="yyyy-MM-dd" placeholder="请选择款项的实际到账日期" style="width: 200px"></DatePicker>
      </div>
      <div v-if="auditTypeDetermine === '1'">
        <Input v-model="rejectReasonDetermine" type="textarea" :maxlength="500" :autosize="{ minRows: 2, maxRows: 5 }" placeholder="请输入驳回原因，必填项"></Input>
      </div>
      <p slot="footer" class="but-right">
        <Button type="primary" @click="determineMoneyFn">确认</Button>
        <Button type="primary" ghost style="margin-left: 10px" @click="determineMoney = false">取消</Button>
      </p>
    </Modal>
    <PaymentModal v-if="typeinPayModal" :orderId="id" @changeState="changeState"></PaymentModal>
    <!-- 查看图片 -->
    <Modal footer-hide title="图片预览" v-model="visible">
      <!-- <img :src="uploadImg" v-if="visible" style="width: 100%" /> -->
      <img :src="uploadImg" style="width: 100%" />
    </Modal>
  </div>
</template>
<script>
import * as API from '@/api/iipto/order.js'
import { enterOrderAdoptApi, enterOrderRejectApi, cancelOrderApi, updateOrderRemarkApi, updatePayVouche, rejectPay, getPayVoucheInfo, companyBodySettingListApi } from '@/api/iipto/typeInOrder.js'
import PaymentModal from './PaymentModal'
export default {
  name: 'orderDetail',
  components: {
    PaymentModal
  },
  props: ['id'],
  data() {
    return {
      orderDetailInfo: {},
      pageInfo: {
        limit: 10,
        page: 1
      },
      listTotal: 50,
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
          title: '注册进度',
          render: (h, { row }) => {
            let status = row.progressBar,
              type = '',
              color = ''
            if (row.serviceType == 1 || row.serviceType == 3) {
              type = this.$iiptoProgressBar(status)
            } else if (row.serviceType == 2) {
              type = ''
            } else {
              type = row.otherServiceHandleProgress == 1 ? '待处理' : row.otherServiceHandleProgress == 2 ? '处理中' : row.otherServiceHandleProgress == 3 ? '已完成' : ''
            }
            return h('span', [
              h(
                'span',
                {
                  style: {
                    color: color
                  }
                },
                type
              )
            ])
          }
        },
        {
          title: '服务状态',
          slot: 'status'
        },
        {
          title: '操作',
          key: '',
          align: 'center'
        }
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
        refundBank: [{ required: true, trigger: 'blur', message: '请填写退款银行' }],
        refundAccount: [{ required: true, trigger: 'blur', message: '请填写退款账户' }],
        refundPayee: [{ required: true, trigger: 'blur', message: '请填写收款人/公司' }],
        refundReason: [{ required: true, trigger: 'blur', message: '请填写退款原因' }]
      },
      ModalData: [],
      value: '',
      refundQuantity: 0,
      //v-3.7新增
      payColumns: [
        {
          title: '序号',
          width: 60,
          render: (h, params) => {
            return h('span', params.row._index + 1)
          }
        },
        {
          title: '付款日期',
          render: (h, params) => {
            return h('span', params.row.payTime)
          }
        },
        {
          title: '支付方式',
          render: (h, params) => {
            let text = ''
            switch (params.row.payType) {
              case 0:
                text = '未知'
                break
              case 1:
                text = '微信'
                break
              case 2:
                text = '支付宝'
                break
              case 3:
                text = '银联'
                break
              default:
                break
            }
            return h('span', text)
          }
        },
        {
          key: 'amount',
          title: '实收金额'
        },
        {
          key: 'remainingBalance',
          title: '剩余尾款'
        },
        {
          slot: 'paymentFileBox',
          title: '付款凭证'
        },
        {
          key: 'payer',
          title: '付款方'
        },
        {
          key: 'acceptAccountName',
          title: '收款账户'
        },
        {
          key: 'gatheringTime',
          title: '到账时间'
        },
        {
          slot: 'paymentOper',
          title: '操作',
          align: 'center'
        }
      ],
      payTableData: [],
      sureOrderModal: false,
      auditType: '0',
      rejectReason: '',
      typeinPayModal: false,
      // 3.9新增
      // 确认到账弹框状态
      determineMoney: false,
      // 单选框默认选项
      auditTypeDetermine: '0',
      // input内容
      rejectReasonDetermine: '',
      // 修改组件状态
      modifyCertificate: false,
      formFile: {
        fileType: '',
        voucherUrl: '',
        payTime: '',
        // acceptAccountNum: '',
        amount: '',
        acceptAccountName: '',
        payer: '',
        payType: ''
      },
      // 表单验证规则
      ruleFormFile: {
        // fileType: [{ required: true, trigger: 'change', message: '请选择文件类型' }],
        voucherUrl: [{ required: true, trigger: 'change', message: '请选择上传文件' }],
        payType: [{ required: true, trigger: 'change', message: '请选择支付方式' }],
        payer: [{ required: true, trigger: 'change', message: '请选择付款方', whitespace: true, type: 'string' }],
        acceptAccountName: [{ required: true, trigger: 'change', message: '请选择收款账号' }],
        amount: [{ required: true, message: '请选择实收金额', trigger: 'change', type: 'number', min: 0 }],
        // acceptAccountNum: [{ required: true, trigger: 'change', message: '请选择交易流水号', type: 'string', whitespace: true }],
        payTime: [{ required: true, trigger: 'change', message: '请选择付款日期', type: 'date' }]
        // payTime: [{ required: true, type: 'date', message: 'Please select the date', trigger: 'change' }]
      },
      accountDate: '', // 确认到账时间
      confirmData: {}, // 点击确认到账赋值
      orderSourceBut: '', // 0、PC网页端 2、H5,3:录入订单 状态显示按钮
      statusBut: '',
      idBut: '',
      moqDate: '',
      orderPayVoucherIdTj: '',
      companyBodyList: [], //收款账户
      // 上次文件列表
      defaultFileList: [{ name: 'img1.png', url: '' }], //图片上传默认图片
      uploadImg: '',
      visible: false, //大图状态
      refresh: false // 触发父组件刷新
    }
  },
  mounted() {
    this.queryBaseInfoFunc() // 获取付款账户列表
    this.getOrderDetail(1)
  },
  watch: {
    $route(to, from) {
      if (to.path === '/orderDetail') {
        this.getOrderDetail(1)
      }
    }
  },
  methods: {
    moDate(e) {
      this.moqDate = e
    },
    // 上传文件之前的钩子
    beforeUploadAccept1(file) {
      // const check = this.formFile.voucherUrl
      let self = this
      // if (check != '') {
      //   self.$Notice.warning({
      //     title: '最多只可上传1个文件'
      //   })
      //   return false
      // } else
      if (file.size > 2097152) {
        self.$Notice.warning({
          title: '文件大小超过2M'
        })
        return false
      }
    },
    // 文件格式验证失败时的钩子
    formatErrorHandler1() {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件格式不正确, 请上传jpg,png格式的文件'
      })
    },
    // 文件上传成功时的钩子
    successHandlerAccept1(res, file, fileList) {
      let self = this
      if (fileList.length > 1) {
        // 设定只能传一张图
        fileList.shift()
      }
      this.formFile.voucherUrl = res.data.fileUrl
      if (res.code !== 0) {
        self.$Notice.warning({
          title: '警告',
          desc: '请尝试再次上传'
        })
        return false
      }
      this.uploadImg = res.data.fileUrl
      this.formFile.voucherUrl = res.data.fileUrl
    },
    // 文件列表移除文件时的钩子
    removeHandlerAccept1() {
      this.formFile.voucherUrl = ''
    },
    // 付款信息确认到账
    confirmToZhang(row) {
      this.confirmData = row
      // console.log(row)
      this.rejectReasonDetermine = '' // 清空编辑框内容
      this.accountDate = '' // 清空到账时间
      this.determineMoney = true // 显示弹框
    },
    // 确认到账提交
    determineMoneyFn() {
      if (this.auditTypeDetermine === '1') {
        if (this.rejectReasonDetermine.trim() === '') {
          this.$Message.error('请输入驳回原因')
        } else {
          // console.log(this.rejectReasonDetermine.trim())

          this.confirmData.remark = this.rejectReasonDetermine.trim()
          // 驳回接口
          let data = {}
          data.reason = this.rejectReasonDetermine.trim()
          data.orderId = this.idBut
          data.orderPayVoucherId = this.confirmData.id
          rejectPay(data)
            .then((res) => {
              if (res.code == 0) {
                this.$Message.success('驳回成功')
                // this.$emit('refresh')
                this.getOrderDetail(1)
                this.refresh = true
              }
            })
            .catch((err) => {
              console.log(err)
            })
          // console.log(this.confirmData)
          // console.log(data)
          this.determineMoney = false // 关闭弹框
        }
      } else {
        if (this.accountDate === '') {
          this.$Message.error('请输入到账日期')
        } else {
          // console.log('收到款项')
          // this.confirmData.payTime = this.accountDate // 选择的时间
          // console.log(this.confirmData.payTime)
          let data = {
            orderId: this.id,
            // paymentTime: this.accountDate, // 选择的时间
            paymentTime: this.formatDate(this.accountDate), // 选择的时间
            orderPayVoucherId: this.confirmData.id // 选择的凭证id“数组内每一行的id”
          }
          // console.log(data)
          API.sureAccount(data)
            .then((res) => {
              if (res.code == 0) {
                this.$Message.success('确认成功')
                // this.$emit('refresh')
                this.getOrderDetail(1)
                this.refresh = true
              } else {
                this.$Message.warning(res.message)
              }
            })
            .catch((err) => console.log(err))
          this.determineMoney = false // 关闭弹框
        }
      }
    },
    // 款项的实际到账日期
    dateChange(date) {
      this.accountDate = date
    },
    // 修改
    modify(row) {
      this.moqDate = '' // 清空付款日期
      this.formFile.payTime = ''
      // console.log(row)
      // this.$Modal.confirm({
      //   title: '驳回原因',
      //   content: '驳回原因。。。。。',
      //   okText: '知道了',
      //   cancelText: ''
      // })
      this.orderPayVoucherIdTj = row.id
      let data = {}
      data.orderPayVoucherId = row.id
      data.orderId = this.idBut
      // console.log(data)
      // 获取修改前的信息
      getPayVoucheInfo(data)
        .then((res) => {
          if (res.code == 0) {
            // console.log(res)
            this.formFile = res.data
            this.formFile.payType = String(res.data.payType) //显示默认选项需转为字符串
            this.moqDate = res.data.payTime //存储付款时间
            this.uploadImg = res.data.voucherUrl
            // console.log(this.formFile)
          }
        })
        .catch(() => {})
      this.modifyCertificate = true
      // 点击修改弹出提示信息
      this.$Notice.warning({
        title: '',
        desc: `驳回原因：${row.rejectionReason}`
      })
    },
    // 确定提交上传文件表单
    sureUload(e) {
      // console.log(this.formFile)
      this.$refs['formFile'].validate((valid) => {
        if (valid) {
          // this.$Message.success('Success!')
          let data = this.formFile
          // console.log(data.orderAllMoney)
          // console.log(data.payType)
          data.payTime = this.moqDate // 更新时间
          data.orderPayVoucherId = this.orderPayVoucherIdTj // 传订单id
          // console.log(data)
          updatePayVouche(data)
            .then((res) => {
              if (res.code == 0) {
                // this.modifyCertificate = false
                this.$Message.success('修改成功')
                this.getOrderDetail(1)
                // console.log(res)
                // this.$refs['formFile'].resetFields() // 清除表单验证规则与内容
              }
            })
            .catch(() => {
              // this.$refs['formFile'].resetFields() // 清除表单验证规则与内容
            })
          this.modifyCertificate = false
        } else {
          this.$Message.error('请完善信息!')
        }
      })
    },
    // 修改凭证确认事件
    modifyCertificateFn() {
      // console.log('修改凭证确认事件')
    },
    //返回列表
    goBack() {
      this.$emit('back', this.refresh)
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page
      this.getOrderDetail()
    },
    //日期转化
    formatDate(date) {
      if (typeof date === 'object') {
        const y = date.getFullYear()
        let m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = date.getDate()
        d = d < 10 ? '0' + d : d
        return y + '-' + m + '-' + d + ' 00:00:00'
      } else {
        return date + ' 00:00:00'
      }
    },
    //详情信息
    getOrderDetail(page) {
      this.tableLoading = true
      let orderId = ''
      if (this.id == undefined) {
        orderId = this.$route.query.id
      } else {
        orderId = this.id
      }
      let paramsData = {
        orderId,
        serviceLimit: 10,
        servicePage: this.pageInfo.page
      }
      if (page) {
        paramsData.servicePage = page
      }
      API.getOrderDetail(paramsData)
        .then((res) => {
          this.tableLoading = false
          this.refundQuantity = 0
          if (res.code == 0) {
            this.orderDetailInfo = res.data
            this.tableData = res.data.orderBuyProductList
            this.payTableData = res.data.orderPayVoucherList
            this.listTotal = res.data.orderBuyProductListCount
            //3.9
            this.orderSourceBut = res.data.orderSource
            this.statusBut = res.data.status
            this.idBut = res.data.id
            // console.log('订单来源orderSource', this.orderSourceBut, '状态status', this.statusBut, 'id', this.idBut)
          } else {
            this.$Message.warning(res.message)
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
                this.value = val
              }
            }
          })
        },
        onOk: () => {
          let data = {
            orderId: this.id,
            paymentTime: this.formatDate(this.value)
          }
          API.sureAccount(data)
            .then((res) => {
              if (res.code == 0) {
                this.$Message.success('确认成功')
                this.$emit('refresh')
              } else {
                this.$Message.warning(res.message)
              }
            })
            .catch((err) => console.log(err))
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
        orderProductIds: ''
      }
      if (this.ModalData.length === 0) {
        this.$Message.warning('请选择服务')
        return
      }
      for (let index = 0; index < this.ModalData.length; index++) {
        const element = this.ModalData[index]
        this.formLeft.orderProductIds += element.orderProductId + ','
        this.formLeft.serviceName += element.productName + ';  '
        this.formLeft.refundMoney += (Number(element.price) - Number(element.discAmount) + Number(element.invoiceMoney)) * 100
      }
      this.formLeft.refundMoney = Math.floor((this.formLeft.refundMoney / 100) * 100) / 100
      this.formLeft.orderProductIds = this.formLeft.orderProductIds.substr(0, this.formLeft.orderProductIds.length - 1)
      this.refundModal = true
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
        this.$Message.error('退款金额不能大于订单已付金额')
        return
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          API.requestRefund(this.formLeft)
            .then((res) => {
              if (res.code === 0) {
                this.$Message.success('申请退款成功')
                this.refundModal = false
                this.ModalData = []
                this.getOrderDetail(1)
              }
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          this.$Message.error('请填写完整资料')
        }
      })
    },
    //确认订单
    sureOrderFunc() {
      if (this.auditType == '0') {
        this.orderPassFunc()
      } else if (this.auditType == '1') {
        this.orderRejectFunc()
      }
    },
    //确认订单通过
    orderPassFunc() {
      enterOrderAdoptApi({ orderId: this.id }).then((res) => {
        if (res.code == 0) {
          this.$Message.success('操作成功')
          this.sureOrderModal = false
          this.getOrderDetail(1)
        }
      })
    },
    //确认订单驳回
    orderRejectFunc() {
      enterOrderRejectApi({ orderId: this.id, reason: this.rejectReason }).then((res) => {
        if (res.code == 0) {
          this.$Message.success('操作成功')
          this.sureOrderModal = false
          this.getOrderDetail(1)
        }
      })
    },
    changeState(val) {
      this.typeinPayModal = val
      this.getOrderDetail(1)
    },
    changeOrder() {
      this.$emit('toChangeOrder', this.id)
    },
    //取消订单
    cancleOrderFunc() {
      if (this.ModalData.length === 0) {
        this.$Message.warning('请选择服务')
        return
      }
      let productIds = []
      this.ModalData.map((item) => {
        productIds.push(item.orderProductId)
      })
      this.$Modal.confirm({
        title: '确定取消服务吗？',
        content: ``,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          let data = {
            orderId: this.id,
            productIds: productIds.join(',')
          }
          cancelOrderApi(data).then((res) => {
            if (res.code == 0) {
              this.ModalData = []
              this.$Message.success('服务已取消')
              this.getOrderDetail()
            }
          })
        },
        onCancel: () => {}
      })
    },
    //编辑备注
    editorRemark() {
      this.$Modal.confirm({
        render: (h) => {
          return h('Input', {
            props: {
              value: this.orderDetailInfo.remark,
              autofocus: true,
              placeholder: '输入备注',
              maxlength: 500
            },
            on: {
              input: (val) => {
                this.orderRemark = val
              }
            }
          })
        },
        onOk: () => {
          updateOrderRemarkApi({ orderId: this.id, remark: this.orderRemark }).then((res) => {
            if (res.code == 0) {
              this.$Message.success('操作成功')
              this.getOrderDetail(1)
            }
          })
        }
      })
    },
    btnprompt() {
      this.$Message.warning('请到客户端修改')
    },
    // 获取收款账户信息
    queryBaseInfoFunc() {
      companyBodySettingListApi().then((res) => {
        if (res.code == 0) {
          this.companyBodyList = res.data
        }
      })
      // orderConditionApi().then((res) => {
      //   if (res.code == 0) {
      //     let returnData = res.data
      //     returnData.map((item) => {
      //       switch (item.name) {
      //         case 'paymentChanne':
      //           this.paymentChannelList = item.orderConditionInfoVoList
      //           break
      //         default:
      //           break
      //       }
      //     })
      //   }
      // })
    },
    /* 
      确认到账按钮条件
      voucherStatus != 0 && status =1 || =11 && orderSource =3 || =0
    */
    confirmToZhangIf(voucherStatus, status, orderSource) {
      if (voucherStatus !== 0) return false
      return [1, 11].includes(status) && [3, 0].includes(orderSource)
    }
  }
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
    .remark-box {
      margin-top: 10px;
      display: flex;
      .box-label {
        font-weight: 600;
        display: flex;
        flex-direction: column;
      }
      .box-content {
        border: 1px solid #797979;
        padding: 4px;
      }
      .editor-icon {
        font-size: 20px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
  .orderDetailInfo {
    margin: 15px 0;
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
.va-btn {
  color: rgb(0, 121, 254);
  cursor: pointer;
}
.va-btn:hover {
  text-decoration: underline;
}
.modify-modal-box {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.modify-modal-right {
  width: 70%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
.modify-modal-right > * {
  margin-right: 20px;
}
.amount-box {
  position: relative;
}
.paid-in-amount {
  position: absolute;
  top: -30px;
  left: 52px;
  font-size: 12px;
  color: #f80909;
  width: 250px;
  transform: scale(0.9);
}
.but-right {
  display: flex;
  justify-content: flex-end;
}
.va-btn-prompt {
  color: #ccc;
  cursor: pointer;
  position: relative;
  line-height: 20px;
}
.va-btn-prompt:hover {
  text-decoration: underline;
}
.va-btn-prompt::before {
  content: '？';
  position: absolute;
  top: -8px;
  right: -20px;
  color: rgb(216, 59, 59);
}
.demo-upload-list {
  display: inline-block;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  transition: 0.5s;
}
.demo-upload-list:hover .demo-upload-list-cover {
  background: rgba(0, 0, 0, 0.5);
  transition: 0.5s;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 40px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
