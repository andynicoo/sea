<!--  用户选择电子发票组件 -->
<template>
  <div>
    <Modal v-model="dialog" :title="title" width="680" @on-cancel="colseModel">
      <Form ref="contarctInput" :label-width="120" :model="invoiceForm" :rules="ruleValidate" inline>
        <Row v-if="isBefore">
          <Row class="ivu-modal-header-inner">发票详情</Row>
          <div class="formBox">
            <Row>
              <FormItem label="开票类型">
                <Select style="width: 266px" v-model="contractType">
                  <Option value="2">增值税普通发票（个人）</Option>
                  <Option value="3">增值税普通发票（公司）</Option>
                  <Option value="4">增值税专用发票</Option>
                </Select>
                <span v-show="false">{{ getInvoice }}</span>
              </FormItem>
            </Row>
            <Row>
              <FormItem prop="contractContactAddress" label="已付税款"> ¥ {{ invoiceForm.makeInvoiceMoney }} </FormItem>
            </Row>
          </div>
        </Row>
        <div v-else>
          <Row class="ivu-modal-header-inner">订单信息</Row>
          <Row>
            <FormItem prop="orderPaidMoney" label="实付金额">
              {{ orderInfo.orderPaymentMoney }}
            </FormItem>
          </Row>
          <Row class="ivu-modal-header-inner">发票信息</Row>
          <FormItem label="开票类型">
            <RadioGroup v-model="taxInvoiceType" v-if="payType === '支付税费'">
              <Radio :label="1" :disabled="taxInvoiceType !== 1">增值税普通发票（个人） </Radio>
              <Radio :label="2" :disabled="taxInvoiceType !== 2">增值税普通发票（公司）</Radio>
              <Radio :label="3" :disabled="taxInvoiceType !== 3">增值税专用发票</Radio>
            </RadioGroup>
            <RadioGroup v-model="contractType" v-else>
              <Radio label="2">增值税普通发票（个人） </Radio>
              <Radio label="3">增值税普通发票（公司）</Radio>
              <Radio label="4">增值税专用发票</Radio>
            </RadioGroup>
          </FormItem>
        </div>
        <!-- 增值发票个人 || 后补发票时显示 -->
        <div v-if="invoiceType == 2">
          <Row class="formBox">
            <FormItem prop="name" label="姓名">
              <Input style="width: 266px" v-model="invoiceForm.name" placeholder="请输入姓名"></Input>
            </FormItem>
          </Row>
          <Row class="formBox">
            <FormItem prop="idOrTaxNumber" label="身份证号码">
              <Input style="width: 266px" v-model="invoiceForm.idOrTaxNumber" placeholder="身份证号码"></Input>
            </FormItem>
          </Row>
        </div>
        <div v-else-if="invoiceType == 3">
          <Row class="formBox">
            <FormItem prop="name" label="公司名称">
              <Input style="width: 266px" v-model="invoiceForm.name" placeholder="请输入公司名称"></Input>
            </FormItem>
          </Row>
          <Row class="formBox">
            <FormItem prop="idOrTaxNumber" label="纳税识别号">
              <Input style="width: 266px" v-model="invoiceForm.idOrTaxNumber" placeholder="请输入纳税识别号"></Input>
            </FormItem>
          </Row>
        </div>
        <div v-else>
          <FormItem prop="name" label="公司名称">
            <Input style="width: 266px" v-model="invoiceForm.name" placeholder="请输入公司名称"></Input>
          </FormItem>
          <Row class="formBox">
            <FormItem prop="idOrTaxNumber" label="纳税识别号">
              <Input style="width: 266px" v-model="invoiceForm.idOrTaxNumber" placeholder="请输入纳税识别号"></Input>
            </FormItem>
          </Row>
          <Row class="formBox">
            <FormItem prop="companyAddress" label="公司地址">
              <Input style="width: 266px" v-model="invoiceForm.companyAddress" placeholder="请输入公司地址"></Input>
            </FormItem>
          </Row>
          <Row class="formBox">
            <FormItem prop="companyTel" label="公司电话">
              <Input style="width: 266px" v-model="invoiceForm.companyTel" placeholder="请输入公司电话"></Input>
            </FormItem>
          </Row>
          <Row class="formBox">
            <FormItem prop="openingBank" label="开户银行">
              <Input style="width: 266px" v-model="invoiceForm.openingBank" placeholder="请输入开户银行"></Input>
            </FormItem>
          </Row>
          <Row class="formBox">
            <FormItem prop="bankAccount" label="开户账号">
              <Input style="width: 266px" v-model="invoiceForm.bankAccount" placeholder="请输入开户银行"></Input>
            </FormItem>
          </Row>
        </div>
      </Form>
      <div slot="footer" class="footer">
        <template v-if="!isBefore">
          <div class="payType clearfix">
            <PayModeCom
              class="payType clearfix"
              size="small"
              :orderInfo="orderInfo"
              :invoiceType="contractType"
              :foreignInfo="foreignInfo"
              :isInvoice="isInvoice"
              @getPayMethod="(val) => (payMethod = val)"
              @getPayMode="(val) => (payMode = val)"
            />
          </div>
          <div class="tax">
            税费:<span
              >¥
              <span v-if="payType === '支付税费'">{{ taxPrice }}</span>
              <TaxRate
                v-else
                :contractTypeEM="getInvoice.invoiceType"
                :orderPaidMoney="orderInfo.payMethod === 'INTL_PAY' ? 0 : orderInfo.orderPaidMoney"
                @change="(val) => (tax = val)"
              />
            </span>
          </div>
        </template>

        <Button type="primary" @click="dialog = false">取消</Button>
        <Button type="primary" @click="submit">{{ isBefore ? '提交' : '去支付' }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getInvoiceDetails, invoice, invoiceFillMaterial } from '@/api/myOrder';
import TaxRate from '@/components/taxRate/taxRate';
import { userPay } from '../../../../../../utils/orderPlayConfig';
import PayModeCom from '../../../../../../components/payMode/payMode.vue';
export default {
  props: {
    value: Boolean,
    payType: {
      type: String,
      default: '开票',
    },
    orderInfo: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    TaxRate,
    PayModeCom,
  },
  data() {
    return {
      invoiceForm: {
        orderId: this.orderInfo.orderId,
      },
      // // 电子发票
      contractType: '2',
      title: '填写开票信息',
      rateList: [],
      payMode: null,
      tax: 0,
      payMethod: 'CHN_PAY',
      foreignInfo: {},
      currency: {},
      payInfo: {},
      isInvoice: true,
      ruleValidate: {
        name: [{ required: true, message: '必填', trigger: 'blur' }],
        idOrTaxNumber: [{ required: true, message: '必填', trigger: 'blur' }],
        companyAddress: [{ required: true, message: '必填', trigger: 'blur' }],
        companyTel: [{ required: true, message: '必填', trigger: 'blur' }],
        openingBank: [{ required: true, message: '必填', trigger: 'blur' }],
        bankAccount: [{ required: true, message: '必填', trigger: 'blur' }],
      },
      taxInvoiceType: '',
      taxPrice: 0,
    };
  },

  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    // 判断用户补充发票类型
    invoiceType() {
      let { invoiceType, subjectType } = this.invoiceForm;
      let num = 2;
      if (invoiceType == 'SPECIAL') {
        //增值税专用发票
        num = 4;
      } else {
        //增值税普通发票
        num = subjectType == 'PERSON' ? 2 : 3;
      }
      return num;
    },

    /** 是不是先开票  false ：后补票 true 已开票*/
    isBefore() {
      let condition = this.orderInfo.invoiceVO;
      // 为空 或者 未付款 都是后补票
      return !(
        JSON.stringify(condition) == '{}' ||
        (JSON.stringify(condition) != '{}' && condition.status == 'WAIT_PAY')
      );
    },

    getInvoice() {
      let { contractType } = this;
      let { invoiceType, subjectType } = this.invoiceForm;
      if (contractType == 4) {
        (invoiceType = 'SPECIAL'), (subjectType = 'ENTERPRISE');
      } else if (contractType == 3) {
        (invoiceType = 'GENERAL'), (subjectType = 'ENTERPRISE');
      } else {
        (invoiceType = 'GENERAL'), (subjectType = 'PERSON');
      }
      this.$set(this.invoiceForm, 'invoiceType', invoiceType);
      this.$set(this.invoiceForm, 'subjectType', subjectType);

      return { invoiceType, subjectType };
    },
  },
  created() {
    this.init();
    //补充开票信息默认选择增值税专用发票
    if (this.isBefore) {
      this.contractType = '4';
    }
  },
  methods: {
    async submit() {
      let condition = this.orderInfo.invoiceVO;
      if (this.isBefore) {
        this.$refs['contarctInput'].validate(async (valid) => {
          if (valid) {
            let { code } = await invoiceFillMaterial(this.setParm());
            code == 0 && this.colseModel();
          }
        });
      } else if (JSON.stringify(condition) != '{}' && condition.status == 'WAIT_PAY') {
        this.pay();
      } else {
        let { code } = await invoice(this.setParm());
        code == 0 && this.pay();
      }
    },

    pay() {
      let { clientOrderProductVOList, orderNo } = this.orderInfo;
      if (this.payType === '支付税费' ? this.taxPrice === 0 : Number(this.tax) == 0) {
        this.dialog = false;
        this.$emit('getListFun');
        this.$Message.success('操作成功！');
      } else {
        userPay(
          'PC',
          clientOrderProductVOList,
          { amount: this.payType === '支付税费' ? this.taxPrice : this.tax, ...this.payMode, orderNo },
          (payResponse) => {
            this.dialog = false;
            this.$payMentDialogDom(payResponse);
          }
        );
      }
    },
    setParm() {
      if (this.isBefore) {
        let { invoiceForm } = this;
        return { ...invoiceForm, orderInvoiceId: invoiceForm.orderInvoiceId };
      } else {
        let { getInvoice } = this;

        return { ...this.invoiceForm, ...getInvoice };
      }
    },

    async init() {
      let { orderId, invoiceVO } = this.orderInfo;
      // 不是 后补 就调详情
      if ((this.isBefore && orderId) || (JSON.stringify(invoiceVO) != '{}' && invoiceVO.status == 'WAIT_PAY')) {
        let { data } = await getInvoiceDetails({ orderId });
        this.invoiceForm = data;
        this.taxInvoiceType = data.invoiceType; //subjectType
        this.taxPrice = data.makeInvoiceMoney;
        if (data.invoiceType === 'GENERAL') {
          data.subjectType === 'PERSON' ? (this.taxInvoiceType = 1) : (this.taxInvoiceType = 2);
        } else {
          this.taxInvoiceType = 3;
        }
      }
    },
    colseModel() {
      this.dialog = false;
      this.$parent.getListFun();
    },
  },
};
</script>
<style lang="less" scoped>
@import url(./index.less);
</style>
