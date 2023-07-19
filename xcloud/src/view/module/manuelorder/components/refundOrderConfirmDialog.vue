<template>
  <el-dialog title="订单确认" :visible.sync="dialogvisible" width="600px" center>
    <div class="exchange-dialog-tip">提示：该订单为退换货订单，请仔细核对后进行提交</div>
    <el-descriptions :column="2">
      <el-descriptions-item label="所属公司">{{ enterpriseName }}</el-descriptions-item>
      <el-descriptions-item label="是否续费">{{ orderForm.renewFlag == '1' ? '是' : '否' }}</el-descriptions-item>
      <el-descriptions-item label="付款类型">{{ orderForm.paymentType == 'NORMAL' ? '正常付款' : orderForm.paymentType == 'PART' ? '分期付款' : '' }}</el-descriptions-item>

      <el-descriptions-item label="客户手机号">{{ orderForm.userMobile }}</el-descriptions-item>
      <el-descriptions-item label="签订方式" v-if="hasContract">{{ signDto.contractSignType | signType }}</el-descriptions-item>
      <el-descriptions-item label="开票类型" v-if="!isExchange">不开票</el-descriptions-item>
      <el-descriptions-item label="签订主体" v-if="hasContract">{{ contractName }}</el-descriptions-item>
      <el-descriptions-item label="订单类型">退换货订单</el-descriptions-item>
      <el-descriptions-item label="合同模板" v-if="hasContract">{{ templateName }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions :column="2" style="margin: 20px 0">
      <el-descriptions-item label="退货商品">{{ productName }}</el-descriptions-item>
      <el-descriptions-item label="换货商品">{{ exchangeServiceName }}</el-descriptions-item>
      <el-descriptions-item label="退货金额">￥{{ refundPaidPrice | formatQianFenWei }}</el-descriptions-item>
      <el-descriptions-item label="换货金额">￥{{ exchangePrice | formatQianFenWei }}</el-descriptions-item>
    </el-descriptions>

    <div class="renew-tip-wrap" v-if="checkRenewList.length">
      <p>续费提醒：以下公司已存在vat注册+申报服务，请在续费订单中进行续费</p>
      <p v-for="(item, index) in checkRenewList" :key="index">
        {{ index + 1 }}. <span v-if="item.companyName">【{{ item.companyName }}】</span> 服务商品：{{ item.productName }} ，所属主体：{{ item.enterpriseName }} ，服务号：{{ item.serviceNo }} ，服务截至日期 {{ item.expirationTime }}
      </p>
    </div>

    <div class="exchange-form-dialog-price-wrapper">
      <el-descriptions :column="1" v-if="restPrice >= 0">
        <el-descriptions-item label="商品总售价">￥{{ productPrice.servicePrice | formatQianFenWei }}</el-descriptions-item>
        <el-descriptions-item label="优惠金额">￥{{ (productPrice.discountedPrice > 0 ? productPrice.discountedPrice : 0) | formatQianFenWei }}</el-descriptions-item>
        <el-descriptions-item label="总应收金额">￥{{ productPrice.totalPrice | subStringNum | formatQianFenWei }}</el-descriptions-item>
        <el-descriptions-item label="尾款金额">￥{{ restPrice | formatQianFenWei }}</el-descriptions-item>
        <el-descriptions-item label="税额" v-if="payMethod === 'INTL_PAY'">￥0</el-descriptions-item>
        <el-descriptions-item label="税额" v-if="payMethod === 'CHN_PAY' && taxAmount > 0">￥{{ taxAmount }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="2" v-else>
        <el-descriptions-item label="退换类型">退款并取消服务</el-descriptions-item>
        <el-descriptions-item label="商品总售价">￥{{ productPrice.servicePrice | formatQianFenWei }}</el-descriptions-item>
        <el-descriptions-item label="退款路径">{{ refundForm.refundMethod | filterRefundMethod }}</el-descriptions-item>
        <el-descriptions-item label="优惠金额">￥{{ (productPrice.discountedPrice > 0 ? productPrice.discountedPrice : 0) | formatQianFenWei }}</el-descriptions-item>
        <el-descriptions-item label="退款原因">{{ refundForm.refundReason }}</el-descriptions-item>
        <el-descriptions-item label="总应收金额">￥{{ productPrice.totalPrice | subStringNum | formatQianFenWei }}</el-descriptions-item>
        <el-descriptions-item label="退款手续费">￥{{ refundForm.refundPoundage | formatQianFenWei }}</el-descriptions-item>
        <el-descriptions-item label="退款金额"
          >￥{{ refundNum | formatQianFenWei }}
          <template v-if="refundInfo.payMethod === 'INTL_PAY' && refundInfo.paymentTypeEn !== 'PART'"
            >{{ refundInfo.currencySymbol }}{{ floor(divide(refundNum, refundInfo.exRate), 2) }}<span class="zt-ml-2">汇率：{{ refundInfo.exRate }}</span></template
          >
        </el-descriptions-item>
        <el-descriptions-item label="税额" v-if="payMethod === 'INTL_PAY'">￥0</el-descriptions-item>
        <el-descriptions-item label="税额" v-if="payMethod === 'CHN_PAY' && taxAmount > 0">￥{{ taxAmount }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="submit" :loading="isLoading">确认提交</el-button>
      <el-button size="small" @click="dialogvisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createExchange } from '@/api/newApi/manuelorder/addOrder.js';
import { mapMutations } from 'vuex';
import { divide, floor , cloneDeep } from 'lodash';

export default {
  props: {
    refundOrderConfirmDialog: Boolean,
    orderForm: Object,
    refundData: Array,
    tableData: Array,
    signDto: Object,
    productPrice: Object,
    contractName: String,
    restPrice: String | Number,
    templateName: String,
    enterpriseName: String,
    params: Object,
    isRenewal: Boolean,
    refundForm: Object,
    selExchangeList: Array,
    refundPaidPrice: String | Number,
    hasContract: Boolean,
    checkRenewList: Array,
    payMethod: String, // 收款方式，国内or国际
    isExchange: Boolean, // 是否是退换货
    taxAmount: String | Number, // 税额
    refundInfo: {
      type: Object,
      default: {
        payMethod: '',
        paymentTypeEn: '',
        currencySymbol: '',
        exRate: '',
      },
    }, // 选择退款方式信息,需要payMethod和退款信息
  },
  data() {
    return {
      isLoading: false,
      divide,
      floor
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.refundOrderConfirmDialog;
      },
      set(val) {
        this.$emit('update:refundOrderConfirmDialog', val);
      },
    },
    exchangeServiceName() {
      return this.tableData.map((item) => item.productName || item.serviceName).join(',');
    },
    productName() {
      return this.selExchangeList.reduce((pre, cur) => {
        return pre == '' ? pre + cur.productName : pre + ',' + cur.productName;
      }, '');
    },
    exchangePrice() {
      return this.tableData.map((item) => item.productPaymentMoney).reduce((a, b) => this.$util.accAdd(a, b), 0);
    },
    // 退款金额 减去第三方平台手续费， 退款路径不同时，手续费不同
    refundNum() {
      let num = 0;
      let thirdRefundPoundage = 0;
      switch (this.refundForm.refundMethod) {
        case 'RETURN_TO_SOURCE':
          thirdRefundPoundage = this.refundInfo?.refundBacktrackCost || 0;
          break;
        case 'RETURN_TO_BANK':
          thirdRefundPoundage = this.refundInfo?.refundCardCost || 0;
          break;

        default:
          thirdRefundPoundage = 0;
          break;
      }
      num = this.refundForm.refundMoney - thirdRefundPoundage;
      num > 0 ? '' : (num = 0);
      return num;
    },
  },
  filters: {
    signType(type) {
      switch (type) {
        case 'ONLINE':
          return '电子签合同';
        case 'OFFLINE':
          return '线下签订';
      }
    },
    filterRefundMethod(refundMethod) {
      switch (refundMethod) {
        case 'RETURN_TO_SOURCE':
          return '原路返回';
        case 'RETURN_TO_BANK':
          return '退回到银行卡';
        case 'COUPON':
          return '发放优惠券';
      }
    },
  },
  methods: {
    submit() {
      let params = {
        ...this.params,
        refundOrderId: this.$route.query.id,
        refundOrderProductId: this.$route.query.orderProductId,
        payMethod: this.payMethod,
      };
      if (this.restPrice < 0) {
        let formData= cloneDeep(this.refundForm);
        formData.refundMoney= this.refundNum;
        params.applyRefundDTO = formData;
      }
      this.isLoading = true;
      createExchange(params)
        .then((res) => {
          this.isLoading = false;
          if (res.code === 0) {
            this.$message.success('提交成功');
            this.dialogvisible = false;
            this.$emit('closeChooseRefundWayDialog');
            this.back();
          }
        })
        .catch((err) => {
          this.isLoading = false;
        });
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/salesorder/index',
      });
    },
  },
};
</script>

<style lang="less" scoped>
.exchange-dialog-tip {
  background-color: #dff4fd;
  margin-bottom: 15px;
  padding: 5px 10px;
}
.exchange-form-dialog {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    flex: 0 0 45%;
  }
  &-price-wrapper {
    background-color: #f2f2f2;
    border-radius: 4px;
    padding: 10px;
    ::v-deep .el-descriptions__body {
      background-color: #f2f2f2;
    }
  }
}
.renew-tip-wrap {
  background: #ffdada;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
}
</style>
