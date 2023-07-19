<template>
  <div>
    <Card>
      <span @click="goBack()"
            class="back">
        <Icon type="md-arrow-back" />返回列表</span>
    </Card>
    <Card class="oreder-box">
      <p class="title">录入订单</p>
      <div class="info-box">
        <Form ref="formInfo"
              :rules="ruleValidate"
              :model="formInfo">
          <p class="title">基础信息</p>
          <Row class="rowItem">
            <Col span="6">
            <FormItem label="订单来源"
                      prop="orderBusinessSource">
              <Select clearable
                      v-model="formInfo.orderBusinessSource"
                      placeholder="请选择订单来源">
                <Option v-for="(item,index) in orderSourceList"
                        :key="index"
                        :value="String(item.id)">{{item.name}}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="6"
                 class="col-right">
            <FormItem label="付款类型"
                      prop="paymentType">
              <Select clearable
                      v-model="formInfo.paymentType"
                      @on-change="priceCalculation"
                      placeholder="请选择付款类型">
                <Option v-for="(item,index) in paymentTypeList"
                        :key="index"
                        :value="String(item.id)">{{item.name}}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <p class="title">用户信息</p>
          <Table :data="userData"
                 :columns="userColumns"
                 border>
            <template slot="userPhonSlot"
                      slot-scope="{ row }">
              <div>
                <Input placeholder="输入手机号"
                       v-model="row.mobile"
                       @on-change="changeNum">
                <Icon type="ios-search"
                      slot="suffix"
                      @click="queryUserFunc(row.mobile)"
                      style="cursor:pointer;" />
                </Input>
              </div>
            </template>
          </Table>
          <p class="title margin20">订单信息
            <span>（至少录入一条商品信息，最多20条）</span>
          </p>
          <Row class="rowItem">
            <Col span="18">
            <p class="clearfix">
              <span class="add-service-btn"
                    @click="addService">+添加服务</span>
            </p>
            <Table :data="serviceData"
                   :columns="servicecolumns"
                   border>
              <template slot="serviceBox"
                        slot-scope="{ row ,index}">
                <div style="padding:8px 0;">
                  <Select v-model="row.productId"
                          label-in-value
                          filterable
                          @on-change="changeService($event,index)"
                          placeholder="选择服务">
                    <Option v-for="(item) in serviceList"
                            :key="item.productId"
                            :value="item.productId">{{item.productName}}</Option>
                  </Select>
                  <Select v-model="row.productFunctionName"
                          filterable
                          @on-change="changeServiceItem($event,index)"
                          placeholder="选择服务项目">
                    <Option v-for="(item,index) in row.serviceItemList"
                            :key="index"
                            :value="item.serviceItem">{{item.serviceItem}}</Option>
                  </Select>
                </div>
              </template>
              <template slot="operationBox"
                        slot-scope="{ row ,index}">
                <div>
                  <Button type="warning"
                          ghost
                          v-if="serviceData.length>1"
                          @click="delectService(row,index)"
                          style="margin-right:8px;">删除</Button>
                </div>
              </template>
            </Table>
            <div class="footer ">
              <div class="relative">
                <div class="left flex">
                  <div class="item">
                    <div class="couponTitle invoiceTitle flex-center">
                      <Form ref="invoiceForm"
                            :model="invoiceForm"
                            :labelWidth="120"
                            :rules="invoiceRule">
                        <Row>
                          <FormItem prop="couponNum"
                                    :labelWidth="250"
                                    label="优惠金额（默认是0，可修改。金额必须≥0）">
                            <div class="coupon-box">
                              <InputNumber placeholder="优惠金额"
                                           v-model="discountMon"
                                           :min="0"
                                           @on-change="priceCalculation"
                                           style="width:220px;"></InputNumber>
                            </div>
                          </FormItem>
                        </Row>
                        <div class="invoiceBox"
                             :class="{'active' : toggleClass}"
                             @click="toggleClass = !toggleClass"
                             v-if="isShowInvoice">
                          <img class="nActive"
                               src="@/assets/images/common/zu.png"
                               alt="">
                          <img class="yActive"
                               src="@/assets/images/common/zu2.png"
                               alt="">
                          <span>发票</span>
                          <img class="down nActive"
                               src="@/assets/images/common/arrowDownP.png"
                               alt="">
                          <img class="down yActive"
                               src="@/assets/images/common/icon.svg"
                               alt="">
                        </div>
                        <div v-if="toggleClass">
                          <Row>
                            <FormItem prop="invoiceType"
                                      label="发票："
                                      v-if="isShowInvoice">
                              <RadioGroup v-model="invoiceForm.invoiceType"
                                          @on-change="invoiceTypeChange">
                                <Radio label="3">不开发票</Radio>
                                <Radio label="1">增值税普通发票</Radio>
                                <Radio label="2">增值税专用发票</Radio>
                              </RadioGroup>
                            </FormItem>
                          </Row>
                          <div class="info">
                            <p>
                              备注： 申请开票需要加收6％的增值税金额
                            </p>
                          </div>
                          <Row v-if="invoiceForm.invoiceType !== '3'">
                            <FormItem prop="subjectType"
                                      label="开票主体：">
                              <RadioGroup v-model="invoiceForm.subjectType">
                                <Radio label="1"
                                       v-if="invoiceForm.invoiceType !== '2' ">个人</Radio>
                                <Radio label="2">公司</Radio>
                              </RadioGroup>
                            </FormItem>
                          </Row>
                          <div v-if="invoiceForm.subjectType === '1' && invoiceForm.invoiceType !== '3'"
                               class="formBox">
                            <Row>
                              <FormItem prop="name"
                                        label="名字：">
                                <Input style="width:266px"
                                       v-model="invoiceForm.name"
                                       placeholder="请输入名字"
                                       :disabled="isFinshed"></Input>
                              </FormItem>
                            </Row>
                            <Row>
                              <FormItem prop="idNumber"
                                        label="身份证号码：">
                                <Input style="width:266px"
                                       v-model="invoiceForm.idNumber"
                                       placeholder="请输入身份证号码"
                                       :disabled="isFinshed"></Input>
                              </FormItem>
                            </Row>
                          </div>
                          <div v-if="invoiceForm.subjectType === '2' && invoiceForm.invoiceType !== '3'"
                               class="formBox">
                            <Row>
                              <FormItem prop="companyName"
                                        label="公司名称：">
                                <Input style="width:266px"
                                       v-model="invoiceForm.companyName"
                                       placeholder="请输入公司名称"
                                       :disabled="isFinshed"></Input>
                              </FormItem>
                            </Row>
                            <Row>
                              <FormItem prop="taxIdentificationNumber"
                                        label="纳税识别号：">
                                <Input style="width:266px"
                                       v-model="invoiceForm.taxIdentificationNumber"
                                       placeholder="请输入纳税识别号"
                                       :disabled="isFinshed"></Input>
                              </FormItem>
                            </Row>
                            <Row>
                              <FormItem prop="companyAddress"
                                        label="公司地址："
                                        v-if="invoiceForm.invoiceType === '2'">
                                <Input style="width:266px"
                                       v-model="invoiceForm.companyAddress"
                                       placeholder="请输入公司地址"
                                       :disabled="isFinshed"></Input>
                              </FormItem>
                            </Row>
                            <Row>
                              <FormItem prop="companyTel"
                                        label="公司电话："
                                        v-if="invoiceForm.invoiceType === '2'">
                                <Input style="width:266px"
                                       v-model="invoiceForm.companyTel"
                                       placeholder="请输入公司电话"
                                       :disabled="isFinshed"></Input>
                              </FormItem>
                            </Row>
                            <Row>
                              <FormItem prop="openingBank"
                                        label="开户银行："
                                        v-if="invoiceForm.invoiceType === '2'">
                                <Input style="width:266px"
                                       v-model="invoiceForm.openingBank"
                                       placeholder="请输入开户银行"
                                       :disabled="isFinshed"></Input>
                              </FormItem>
                            </Row>
                            <Row>
                              <FormItem prop="bankAccount"
                                        label="开户账号："
                                        v-if="invoiceForm.invoiceType === '2'">
                                <Input style="width:266px"
                                       v-model="invoiceForm.bankAccount"
                                       placeholder="请输入开户账号"
                                       :disabled="isFinshed"></Input>
                              </FormItem>
                            </Row>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
                <div class="right">
                  <p>
                    服务金额: &nbsp;
                    <span class="red">¥{{serviceMoney}}</span>
                  </p>
                  <p>
                    优惠金额: &nbsp;
                    <span class="red"> ¥{{discountMon}}</span>
                  </p>
                  <p>
                    开票金额: &nbsp;
                    <span class="red">¥{{invoiceMoney}}</span>
                  </p>
                  <p>
                    应付金额: &nbsp;
                    <span class="red">¥{{totalPrice}}</span>
                  </p>
                </div>
              </div>
            </div>
            </Col>
            <Col span="5"
                 offset="1">
            <FormItem label="备注信息"
                      prop="remark">
              <Input placeholder="请填写备注信息"
                     v-model="formInfo.remark"
                     :rows="4"
                     :maxlength="500"
                     type="textarea" />
            </FormItem>
            </Col>
          </Row>
          <p class="title margin20">财务信息</p>
          <div v-if="formInfo.paymentType=='2'||formInfo.paymentType=='1'"
               style="margin-bottom:10px;">
            <Table :data="financeData1"
                   border
                   :columns="financeCloumns1"
                   width="600">
              <template slot="paymentEndBox"
                        slot-scope="{ row }">
                <div>
                  {{row.paymentEndTime}}
                </div>
              </template>
            </Table>
          </div>
          <Table :data="financeData"
                 border
                 :columns="financeCloumns"
                 v-if="formInfo.paymentType=='0'||formInfo.paymentType=='2'">
            <template slot="payDate"
                      slot-scope="{ row ,index}">
              <div>
                <DatePicker type="date"
                            v-model="row.payTime"
                            @on-change="changeFinanceData($event,index,'payTime')"
                            placeholder="付款日期"></DatePicker>
              </div>
            </template>
            <template slot="serialNumberInput"
                      slot-scope="{ row }">
              <div>
                <Input v-model="row.serialNumber"
                       placeholder="请输入交易流水号" />
              </div>
            </template>
            <template slot="paymentTypeSlot"
                      slot-scope="{ row ,index}">
              <div>
                <Select clearable
                        v-model="row.payType"
                        @on-change="changeFinanceData($event,index,'payType')"
                        placeholder="请选择支付方式">
                  <Option v-for="(item,index) in paymentChannelList"
                          :key="index"
                          :value="item.id">{{item.name}}</Option>
                </Select>
              </div>
            </template>
            <template slot="amountBox"
                      slot-scope="{ row }">
              <div>
                <p v-if="formInfo.paymentType=='0'">{{row.amount}}</p>
                <InputNumber v-model="row.amount"
                             @on-change="changeAmount(row.amount)"
                             v-else
                             :min="0"
                             :max="totalPrice"
                             placeholder="请输入实收金额"></InputNumber>
              </div>
            </template>
            <template slot="payEvidence"
                      slot-scope="{ row }">
              <div>
                <Upload :action="workOrderFile"
                        :on-format-error="formatErrorHandler1"
                        :on-success="(res,file,fileList)=>{successHandler1(res,file,fileList,'voucherUrl')}"
                        :on-remove="(file,fileList)=>{removeHandler1 (file,fileList,'voucherUrl')}"
                        :on-exceeded-size="handleMaxSize"
                        :format="['jpg','png','jpeg']"
                        :show-upload-list="false"
                        :max-size="2048">
                  <Button icon="ios-cloud-upload-outline">{{row.voucherUrl==''?'上传凭证':row.voucherUrl==undefined?'上传凭证':'重新上传'}}</Button>
                </Upload>
                <a :href="row.voucherUrl"
                   target="_blank"
                   v-if="row.voucherUrl!=''"
                   style="margin:6px 0;">付款凭证</a>
              </div>
            </template>
            <template slot="payerInput"
                      slot-scope="{ row ,index}">
              <div>
                <Input v-model="row.payer"
                       @on-change="changePayer($event,index,'payer')"
                       placeholder="请输入付款方" />
              </div>
            </template>
            <template slot="acceptCount"
                      slot-scope="{ row ,index}">
              <div>
                <Select v-model="row.acceptAccountName"
                        @on-change="changeFinanceData($event,index,'acceptAccountName')"
                        placeholder="请选择收款账户">
                  <Option v-for="(item,index) in companyBodyList"
                          :key="index"
                          :value="item.accountName">{{item.accountName}}</Option>
                </Select>
              </div>
            </template>
          </Table>
          <div class="before-tip">温馨提示：请确认已录信息无误后，再点击【提交】订单。</div>
          <FormItem>
            <Button type="primary"
                    @click="handleSubmit('formInfo','submit')">提交</Button>
            <Button @click="goBack"
                    style="margin-left: 28px">取消</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
    <PaymentModal v-if="typeinPayModal"
                  @changeState="changeState"></PaymentModal>
  </div>
</template>
<script>
import { searchOrderUserApi, searchList } from '@/api/iipto/user'
import { companyBodySettingListApi, orderConditionApi, queryServiceListApi, addOrderApi, getUpdateOrderDetail } from '@/api/iipto/typeInOrder.js'
import PaymentModal from "./PaymentModal";
export default {
  components: {
    PaymentModal
  },
  props: ['id'],
  data() {
    return {
      formInfo: {
        paymentType: '',
        billPeriod: '',
        remark: ''
      },
      ruleValidate: {
        orderBusinessSource: [
          { required: true, trigger: "change", message: "请选择订单来源" }
        ],
        paymentType: [
          { required: true, trigger: "change", message: "请选择付款类型" }
        ],
      },
      userData: [{
        mobile: ''
      }],
      userColumns: [
        {
          align: 'center',
          renderHeader: (h, params) => {
            return h('div', [
              h('span', {
                class: 'red-required',
              }, '手机号')
            ])
          },
          slot: 'userPhonSlot'
        },
        {
          key: 'nickname',
          title: '昵称',
          align: 'center'
        },
        {
          title: '用户类型',
          align: 'center',
          render: (h, params) => {
            let userType = params.row.userType == 0 ? '普通用户' : params.row.userType == 1 ? '成交用户' : params.row.userType == 2 ? '渠道用户' : params.row.userType == 3 ? '推广用户' : ''
            return h('span', userType)
          },
        },
        // {
        //   key: 'companyName',
        //   title: '公司名称',
        //   align: 'center'
        // },
      ],
      serviceData: [{
        productId: '',
        oldPrice: 0,
        subtotal: 0
      }],
      servicecolumns: [
        {
          title: '服务',
          slot: 'serviceBox',
          align: 'center',
          width: 160
        },
        {
          title: '原价',
          align: 'center',
          render(h, params) {
            let text = '￥' + (params.row.oldPrice != undefined ? params.row.oldPrice : '0')
            return h('span', text)
          },
        },
        {
          title: '建议售价',
          align: 'center',
          render(h, params) {
            let text = '￥' + (params.row.price != undefined ? params.row.price : '0')
            return h('span', text)
          },
        },
        {
          title: '数量',
          align: 'center',
          render: (h, params) => {
            return h('Input', {
              props: {
                placeholder: "请输入数量",
                value: params.row.count,
                maxlength: 4
              },
              on: {
                'on-change': (event) => {
                  this.serviceData[params.index].count = event.target.value;
                  let newTable = [...this.serviceData]
                  this.serviceData = []
                  newTable[params.index].subtotal = newTable[params.index].oldPrice * event.target.value
                  this.serviceData = newTable
                  this.priceCalculation()
                }
              }
            })
          }
        },
        {
          title: '小计',
          align: 'center',
          render(h, params) {
            let text = '￥' + (params.row.subtotal != undefined ? params.row.subtotal : '0')
            return h('span', text)
          },
        },
        {
          title: '操作',
          slot: 'operationBox',
          align: 'center',
          width: 160
        },
      ],
      toggleClass: false,
      isShowInvoice: true,
      invoiceForm: {
        invoiceType: '3',
        subjectType: '1'
      },
      invoiceRule: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }
        ],
        idNumber: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        idNumber: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' }
        ],
        taxIdentificationNumber: [
          { required: true, message: '请输入纳税识别号', trigger: 'blur' }
        ],
        companyAddress: [
          { required: true, message: '请输入公司地址', trigger: 'blur' }
        ],
        companyTel: [
          { required: true, message: '请输入公司电话', trigger: 'blur' }
        ],
        openingBank: [
          { required: true, message: '请输入开户银行', trigger: 'blur' }
        ],
        bankAccount: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
      },
      serviceMoney: 0,        // 未使用优惠券之前的价格
      discountMon: 0,         // 优惠金额
      invoiceMoney: 0,        // 开票金额
      totalPrice: 0,           // 实付金额
      isFinshed: false,
      financeData: [{
        voucherUrl: '',
        amount: 0,
        payTime: '',
        serialNumber: '',
        payType: '',
        payer: '',
        acceptAccountName: '',
        remainingBalance: 0
      }],
      financeCloumns: [
        {
          align: 'center',
          renderHeader: (h, params) => {
            return h('div', [
              h('span', {
                class: 'red-required',
              }, '付款日期')
            ])
          },
          slot: 'payDate'
        },
        {
          key: '',
          align: 'center',
          renderHeader: (h, params) => {
            return h('div', [
              h('span', {
                class: 'red-required',
              }, '支付方式')
            ])
          },
          slot: 'paymentTypeSlot'
        },
        {
          key: '',
          align: 'center',
          renderHeader: (h, params) => {
            return h('div', [
              h('span', {
                class: 'red-required',
              }, '实收金额')
            ])
          },
          slot: 'amountBox'
        },
        {
          title: '剩余尾款',
          align: 'center',
          key: 'remainingBalance'
        },
        {
          key: '',
          align: 'center',
          renderHeader: (h, params) => {
            return h('div', [
              h('span', {
                class: 'red-required',
              }, '付款凭证')
            ])
          },
          slot: 'payEvidence'
        },
        {
          key: '',
          align: 'center',
          renderHeader: (h, params) => {
            return h('div', [
              h('span', {
                class: 'red-required',
              }, '付款方')
            ])
          },
          slot: 'payerInput'
        },
        {
          key: '',
          align: 'center',
          renderHeader: (h, params) => {
            return h('div', [
              h('span', {
                class: 'red-required',
              }, '收款账户')
            ])
          },
          slot: 'acceptCount'
        },
      ],
      financeData1: [{
        billPeriod: 1,
        paymentEndTime: ''
      }],
      financeCloumns1: [
        {
          align: 'center',
          renderHeader: (h, params) => {
            return h('div', [
              h('span', {
                class: 'red-required',
              }, '账期')
            ])
          },
          render: (h, params) => {
            return h('div', [
              h('InputNumber', {
                attrs: {
                  'value': params.row.billPeriod,
                  'max': 365,
                  'min': 1
                },
                on: {
                  input: (val) => {
                    let obj = {}
                    obj.billPeriod = val
                    if (val > 365) {
                      console.log(val);
                      obj.billPeriod = 365
                      this.$Message.warning({
                        background: true,
                        content: '账期最大为365天'
                      });
                    }
                    obj.paymentEndTime = this.getTime(val)
                    this.financeData1 = []
                    this.financeData1.push(obj)
                  }
                },
              }),
              h('span', '天')
            ])
          }
        },
        {
          align: 'center',
          title: '付款截止日期',
          slot: 'paymentEndBox',
          width: '200'
        }
      ],
      selectService: [],
      typeinPayModal: false,
      companyBodyList: [],//收款账户
      orderSourceList: [],//订单来源
      paymentTypeList: [],//付款类型
      paymentChannelList: [],//支付方式
      serviceList: [],
      delOrderProductIds: [],
      orderRemark: '',
      rateVal: 6,//税点
      userMobile: ''
    }
  },
  methods: {
    changeState(val) {
      this.typeinPayModal = val
    },
    goBack() {
      this.$emit('back')
    },
    queryBaseInfoFunc() {
      companyBodySettingListApi().then(res => {
        if (res.code == 0) {
          this.companyBodyList = res.data
        }
      })
      orderConditionApi().then(res => {
        if (res.code == 0) {
          let returnData = res.data
          returnData.map(item => {
            switch (item.name) {
              case 'orderBusinessSourceMap':
                this.orderSourceList = item.orderConditionInfoVoList
                break;
              case 'paymentType':
                this.paymentTypeList = item.orderConditionInfoVoList
                break;
              case 'paymentChanne':
                this.paymentChannelList = item.orderConditionInfoVoList
                break;
              default:
                break;
            }
          })
        }
      })
      queryServiceListApi().then(res => {
        if (res.code == 0) this.serviceList = res.data
      }).finally(() => {
        if (this.id != '') this.getDetailInfo()
      })
    },
    changeNum(event) {
      this.userMobile = event.target.value
    },
    queryUserFunc(val) {
      searchOrderUserApi({
        userMobile: val
      }).then(res => {

        if (res.code == 0) {
          this.userData = []
          this.userData.push(res.data)
        }
      }).finally(() => {

      })
    },
    invoiceTypeChange(val, type) {
      this.totalPrice = Number(this.serviceMoney - this.discountMon);
      this.invoiceMoney = 0
      if (val == 2 || val == 1) {
        this.invoiceMoney = Math.floor(this.totalPrice * this.rateVal) / 100
        this.totalPrice += this.invoiceMoney
      }
      this.totalPrice = Math.round(this.totalPrice * 100) / 100
      this.changeAmount(this.totalPrice)
    },
    getTime(dayNum) {
      // dayNum向后推算几天，默认两天
      // 获取当前日期 格式转换 2019-08-07 00:00:00
      let n = Number(dayNum) <= 365 ? Number(dayNum) : 365
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      // 向后推算的日期
      let dateNew = new Date(date.setDate(date.getDate() + n)); // 向后加的时间
      let yearNew = dateNew.getFullYear();
      let monthNew = dateNew.getMonth() + 1;
      let dayNew = dateNew.getDate();
      let hourNew = dateNew.getHours();
      let minuteNew = dateNew.getMinutes();
      let secondNew = dateNew.getSeconds();

      var s = `${year}-${this.getZeroTime(month)}-${this.getZeroTime(day)} ${this.getZeroTime(hour)}:${this.getZeroTime(minute)}:${this.getZeroTime(second)}`;
      // var e = `${yearNew}-${this.getZeroTime(monthNew)}-${this.getZeroTime(dayNew)} ${this.getZeroTime(hourNew)}:${this.getZeroTime(minuteNew)}:${this.getZeroTime(secondNew)}`;
      var e = `${yearNew}-${this.getZeroTime(monthNew)}-${this.getZeroTime(dayNew)} `;
      let res = {};
      res.curTime = s; // 当前时间
      res.futreTime = e; // 推后的时间
      res.strTime = s + ' - ' + e; // 时间范围
      res.arrtime = [s, e];// 时间数组
      return e;
    },
    getZeroTime(str) {
      // 时间小于10 加0，并格式化去除小数点
      let s = '';
      if (Number(str) < 10) {
        s = '0' + str;
      } else {
        s = str;
      }
      return s;
    },
    changeService(val, index, type) {
      if (val == undefined) return
      this.serviceData[index].serviceItemList = []
      if (type != 'old') {
        this.serviceData[index].productFunctionName = ''
        this.serviceData[index].price = 0
        this.serviceData[index].subtotal = 0
        this.serviceData[index].oldPrice = 0
      }

      this.serviceList.map(item => {
        if (val.value == item.productId) {
          this.serviceData[index].productId = val.value
          this.serviceData[index].productName = val.label
          this.serviceData[index].serviceItemList = item.productExtensionInfoList
        }
      })
      this.priceCalculation(type)
    },
    changeServiceItem(val, index) {
      if (val == undefined) return
      this.serviceData[index].serviceItemList.map(item => {
        if (val == item.serviceItem) {
          this.serviceData[index].productFunctionName = item.serviceItem
          this.serviceData[index].oldPrice = item.oldPrice
          this.serviceData[index].price = item.price
          this.serviceData[index].count = 1
          this.serviceData[index].subtotal = item.oldPrice
          this.serviceData[index].categoryCount = item.categoryCount
        }
      })
      this.priceCalculation()
    },
    //价格计算
    priceCalculation(type) {
      // console.log(this.discountMon)
      this.serviceMoney = 0
      this.totalPrice = 0
      let totalMonney=0
      this.serviceData.map(item => {
        totalMonney += item.subtotal
      })
      this.serviceMoney=Math.floor(totalMonney*100)/100
      let newArr = [...this.financeData]
      this.financeData = []
      this.totalPrice = (this.serviceMoney * 100 - this.discountMon * 100) / 100
      if (this.formInfo.paymentType == '0') {
        newArr[0].amount = this.totalPrice
      } else {
        newArr[0].amount = 0
      }
      this.financeData = [...newArr]
      if (type != 'old') {
        this.changeAmount(this.totalPrice)
        this.invoiceTypeChange(this.invoiceForm.invoiceType)
      }
    },
    addService() {
      if (this.serviceData.length == 20) {
        this.$Notice.warning({
          title: '一次最多录入20条 ',
          desc: ''
        });
        return
      }
      let obj = {
        productId: '',
        oldPrice: 0,
        subtotal: 0
      }
      this.serviceData.push(obj)
    },
    delectService(row, index) {
      if (this.id != '') {
        this.delOrderProductIds.push(row.orderProdutId)
      }
      this.serviceData.splice(index, 1)
      this.priceCalculation()
    },
    changeAmount(val) {
      if (val == undefined) return
      let newTable = [...this.financeData]
      this.financeData = []
      if (val > this.totalPrice) {
        newTable[0].amount = this.totalPrice
        this.$Message.error('实收金额不能大于应付金额')
      } else {
        newTable[0].amount = val
      }
      newTable[0].remainingBalance = (this.totalPrice * 100 - (newTable[0].amount) * 100) / 100
      this.financeData = [...newTable]
    },
    changeFinanceData(val, i, type) {
      if (type == 'payTime') {
        this.financeData[i][type] = val + ' 00:00:00'
      } else {
        this.financeData[i][type] = val
      }
    },
    changePayer(val, i, type) {
      this.financeData[i][type] = val.target.value
    },
    formatErrorHandler1() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg,png,jpeg,svg格式的文件"
      });
    },
    successHandler1(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传"
        });
        return false;
      }
      let obj = { ...this.financeData[0] }
      this.financeData = []
      obj[item] = res.data.fileUrl
      this.financeData.push(obj)
    },
    removeHandler1(i, item) {
      let obj = { ...this.financeData[0] }
      this.financeData = []
      obj[item] = ''
      this.financeData.push(obj)
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: ' ',
        desc: '文件太大啦, 不能超过2M'
      });
    },
    formatDate(date, type) {
      if (typeof date === "object") {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        if (type == "month") {
          return y + "-" + m;
        } else if (type == "date") return y + "-" + m + "-" + d + ' 00:00:00';
      } else {
        return date;
      }
    },
    handleSubmit(name, type) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.submitApiFunc(type)
        } else {
          this.$Message.error('请录入完整信息');
        }
      })
    },
    submitApiFunc(type) {
      if (this.discountMon < 0) {
        this.$Message.error('优惠金额不能小于0')
        return
      }
      let serviceInfoFlag = false
      this.serviceData.map(item => {
        if (item.subtotal == 0) {
          serviceInfoFlag = true
        }
      })
      if (serviceInfoFlag) {
        this.$Message.error('请录入完整服务信息')
        return
      }
      let reg = /^1[0-9]{10}$/
      if (this.userMobile == '' || this.userMobile.length <= 10 || !reg.test(this.userMobile)) {
        this.$Message.error('请输入正确的手机号')
        return
      }
      if (this.discountMon > this.serviceMoney) {
        this.$Message.error('优惠金额不能大于服务金额')
        return
      }
      let delProductIds = []
      this.serviceData.map(item => {
        delProductIds.push(item.productId)
      })
      let orderPayVoucherList = []
      if (this.formInfo.paymentType != '1') {
        orderPayVoucherList = [...this.financeData]
        orderPayVoucherList[0].payTime = this.formatDate(this.financeData[0].payTime, 'date')
      }
      let paramsData = {
        orderBusinessSource: this.formInfo.orderBusinessSource,
        paymentType: this.formInfo.paymentType,
        copeMoney: this.totalPrice,
        discAmount: this.discountMon,
        invoiceType: this.invoiceForm.invoiceType,
        invoiceInfo: this.invoiceForm,
        orderSource: '3',
        paymentChannel: this.financeData[0].payType,
        orderPayVoucherList,
        products: this.serviceData,
        remark: this.formInfo.remark,
        userMobile: this.userMobile,
        billPeriod: this.financeData1[0].billPeriod,
        finalPayment: this.financeData1[0].paymentEndTime,
        stagingPeriod: this.financeData1[0].billPeriod
      }
      if (this.id != '') {
        paramsData.orderId = this.id
        if (this.delOrderProductIds.length > 0) paramsData.delOrderProductIds = this.delOrderProductIds.join(',')
      }
      addOrderApi(paramsData).then(res => {
        if (res.code == 0) {
          this.$Message.success('提交成功')
          if (type == 'submit') {
            this.goBack()
          }
        }
      })
    },
    formatDate(date, type) {
      if (typeof date === "object") {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        if (type == "month") {
          return y + "-" + m;
        } else if (type == "date") return y + "-" + m + "-" + d + ' 00:00:00';
      } else {
        return date;
      }
    },
    getDetailInfo() {
      getUpdateOrderDetail({ orderId: this.id }).then(res => {
        if (res.code == 0) {

          this.userData = []
          this.userData[0] = res.data.userVo
          this.userMobile = res.data.userVo.mobile
          if (JSON.stringify(res.data.invoiceInfo) != '{}') {
            this.invoiceForm = res.data.invoiceInfo
            this.invoiceForm.invoiceType = String(res.data.invoiceInfo.invoiceType)
            this.invoiceForm.subjectType = String(res.data.invoiceInfo.subjectType)
          }
          this.formInfo = res.data.order
          this.formInfo.orderBusinessSource = String(res.data.order.orderBusinessSource)
          this.formInfo.paymentType = String(res.data.order.paymentType)
          this.serviceData = res.data.products
          this.financeData1 = []
          this.financeData1[0] = {
            billPeriod: res.data.order.billPeriod,
            paymentEndTime: this.getTime(res.data.order.billPeriod)
          }
          if (res.data.order.paymentType == '2') {
            this.financeData1[0] = {
              billPeriod: res.data.order.stagingPeriod,
              paymentEndTime: this.getTime(res.data.order.billPeriod)
            }
          }
          res.data.products.map((item, index) => {
            let params = {
              value: item.productId,
              label: item.productName
            }
            item.subtotal = item.count * item.oldPrice
            this.changeService(params, index, 'old')
          })
          if (res.data.orderPayVoucherList.length > 0) {
            this.financeData[0] = res.data.orderPayVoucherList[0]
          }
          this.totalPrice = res.data.order.orderAllMoney
          this.discountMon = res.data.order.discAmountMoney
          this.serviceMoney = res.data.order.productOldMoney
          this.invoiceMoney = res.data.order.invoiceMoney
        }
      }).finally(() => {
        this.$Modal.confirm({
          title: '驳回原因',
          content: this.formInfo.rejectionReason,
          okText: '知道了',
          cancelText: ''
        });
      })
    }
  },
  mounted() {
    this.queryBaseInfoFunc()
  },
}
</script>
<style lang="less" scoped>
.back {
  cursor: pointer;
}
/deep/ .oreder-box {
  margin-top: 10px;
  padding: 0;
  .ivu-card-body {
    padding: 0;
  }
  .title {
    padding: 12px 18px;
    border-bottom: 1px solid #e9e9e9;
    color: #333;
    font-weight: 600;
  }
  .info-box {
    padding: 18px 18px 18px 28px;
    .title {
      border-bottom: none;
      padding-left: 0;
      span {
        color: #999;
        font-weight: 400;
      }
    }
    .title.margin20 {
      margin-top: 20px;
    }
    .col-right {
      margin-left: 40px;
    }
    .clearfix::after {
      content: ' ';
      line-height: 0;
      display: block;
      clear: both;
    }
    .add-service-btn {
      float: right;
      cursor: pointer;
      color: #0079fe;
      margin-bottom: 10px;
    }
    .earnest-btn {
      margin-top: 20px;
      color: #0079fe;
      cursor: pointer;
    }
    .before-tip {
      color: #0079fe;
      padding: 10px 18px;
      background-color: #f4f9ff;
      margin: 16px 0;
    }
  }
  .footer {
    width: 100%;
    padding: 28px 0px 0px 10px;
    color: #666666;
    position: relative;
    .couponTitle {
      color: #666666;
      font-size: 14px;
      .subtitle {
        height: 35px;
      }
      .info {
        margin-left: 120px;
        width: 266px;
        height: 56px;
        margin-bottom: 10px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 4px;
        border: 1px solid rgba(251, 183, 60, 1);
        p {
          color: #e99d42;
          font-size: 12px;
        }
      }
      .invoiceBox {
        display: inline-flex;
        cursor: pointer;
        align-items: center;
        padding-top: 10px;
        padding-bottom: 15px;
        span {
          padding: 0px 4px 0px 1px;
        }
        img {
          width: 18px;
          height: 18px;
        }
        .down {
          width: 10px;
          height: 10px;
        }
        .yActive {
          display: none;
        }
      }
      .invoiceBox.active {
        .nActive {
          display: none;
        }
        .yActive {
          display: block;
        }
        span {
          color: #00a3ff;
        }
      }
      /deep/ .formBox {
        .ivu-form-item {
          margin-bottom: 20px;
        }
      }
    }
    /deep/ .invoiceTitle {
      .ivu-form-item {
        margin: 0px;
        margin-bottom: 10px;
        // margin-left: 13px;
        .ivu-radio-wrapper {
          margin-right: 30px;
        }
      }
    }
    .red {
      color: #ff6600;
      font-weight: bold;
      font-size: 16px;
    }
    .right {
      color: #333333;
      .total {
        margin: 0px 20px 0px 40px;
        .red {
          font-size: 16px;
          color: #ff6600;
        }
      }
    }

    .relative {
      position: relative;
      // height: 45px;
      .flex {
        flex-direction: column;
      }
      .right {
        position: absolute;
        right: 0px;
        top: 0px;
      }
      .left {
        // position: absolute;
        // left: 0px;
        .item {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .red-required::before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 14px;
    color: #ed4014;
  }
  .coupon-box {
    margin-top: -30px;
    margin-left: -250px;
  }
}
/deep/ .ivu-table-wrapper {
  overflow: inherit;
}
</style>
