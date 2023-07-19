<template>
  <el-dialog title="修改金额" :visible.sync="dialogvisible" width="650px" class="man-confirm-dialog" :close-on-click-modal="false" @close="reset">
    <el-descriptions class="margin-top" title="" :column="2">
      <el-descriptions-item label="商品金额（元）">{{ detailInfo.orderPaymentMoney }}</el-descriptions-item>
      <el-descriptions-item label="已付金额">{{ detailInfo.orderPaidMoney }}</el-descriptions-item>
      <el-descriptions-item label="税额">{{ detailInfo.invoiceMoney }}</el-descriptions-item>
      <el-descriptions-item label="未付金额">{{ calculationMoney(detailInfo) }}</el-descriptions-item>
      <el-descriptions-item label="总应付金额">{{ $util.accAdd(detailInfo.orderPaymentMoney, detailInfo.invoiceMoney) }}</el-descriptions-item>
      <el-descriptions-item label="本次付款金额">{{ payInfo.paymentAmount }}</el-descriptions-item>
    </el-descriptions>
    <!-- {{payInfo}} -->
    <el-descriptions class="margin-top" title="凭证信息" :column="2">
      <el-descriptions-item label="付款方">{{ payInfo.payer }}</el-descriptions-item>
      <el-descriptions-item label="收款账号">{{ payInfo.acceptAccountName }}</el-descriptions-item>
      <el-descriptions-item label="支付方式">{{ payInfo.paymentChannel | filterPaymentChannel(paymentChannelList) }}</el-descriptions-item>
      <el-descriptions-item label="付款时间">
        {{ payInfo.paymentTime }}
      </el-descriptions-item>
      <el-descriptions-item label="付款凭证">
        <el-image v-if="payInfo.paymentFile" style="width: 60px; height: 40px" :preview-src-list="payInfo.paymentFile.split(',')" :src="payInfo.paymentFile.split(',')[0]"></el-image>
      </el-descriptions-item>
      <el-descriptions-item label="流水">{{ payInfo.platformTradeNo }}</el-descriptions-item>
      <el-descriptions-item label="币种/金额" v-if="detailInfo.payMethod === 'INTL_PAY'">{{ payInfo.currencySymbol }} {{ payInfo.currencyPayAmount }} 汇率：{{ payInfo.exRate }}</el-descriptions-item>
      <el-descriptions-item label="备注">{{ payInfo.remark }}</el-descriptions-item>
    </el-descriptions>

    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="85px" label-position="left">
      <el-form-item label="应付金额:" prop="payment">
        <!-- 可修改范围+-1 -->
        <el-input-number v-model="form.finalPaymentMoney" controls-position="right" :min="shouldPay < 1 ? 0 : shouldPay - 1" :max="shouldPay + 1" :precision="2"></el-input-number>
      </el-form-item>
      <el-form-item label="修改原因:" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="4"></el-input>
      </el-form-item>
    </el-form>

    <div style="text-align: right">
      <span class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitConfirm" :loading="subLoading">保存</el-button>

        <el-button size="mini" @click="dialogvisible = false">取消</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { updateFinalPaymentMoney } from '@/api/newApi/orderManage/salesorder.js';
import currency from '@/utils/currency.js';

export default {
  data() {
    return {
      form: {
        finalPaymentMoney: null,
        remark: '',
      },
      subLoading: false,
      rules: {
        remark: [{ required: true, trigger: 'blur', message: '请填写备注' }],
      },
      currency: currency,
    };
  },
  props: {
    updateMoneyDialog: Boolean,
    detailInfo: Object,
    paymentChannelList: { type: Array },
    orderPayments: { type: Array },
  },
  filters: {
    filterPaymentChannel(val, list) {
      return (list.find((item) => item.dataCode == val) || {}).dataValue;
    },
  },
  inject: ['parentFn'],
  computed: {
    dialogvisible: {
      get() {
        return this.updateMoneyDialog;
      },
      set(val) {
        this.$emit('update:updateMoneyDialog', val);
      },
    },
    // info() {
    //   let payLength = this.detailInfo.orderPaymentDetails.length;
    //   if (payLength) {
    //     // 取最后一条
    //     return this.detailInfo.orderPaymentDetails[payLength - 1];
    //   } else {
    //     return {};
    //   }
    // },
    // 付款信息可操作的一笔
    payInfo() {
      let payInfo = this.orderPayments.find((ele) => ['PAY_WAIT_CONFIRM', 'PAY_REJECT'].includes(this.detailInfo.orderStatus));
      return payInfo;
    },
    // 应付金额范围=付款信息可操作的一笔的支付金额+-1并>0
    shouldPay() {
      let paymentAmount = this.payInfo.paymentAmount ? this.payInfo.paymentAmount : 0;
      return paymentAmount;
    },
  },
  created() {
    this.reset();
  },
  methods: {
    //未付金额 unPaidMoney
    calculationMoney(record) {
      return record.unPaidMoney || 0;
    },
    reset() {
      if (this.payInfo.paymentAmount) {
        this.form.finalPaymentMoney = this.payInfo.paymentAmount;
        this.form.remark = '';
      }
    },

    submitConfirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.subLoading = true;
          updateFinalPaymentMoney({
            ...this.form,
            orderId: this.detailInfo.orderId,
          })
            .then((res) => {
              this.subLoading = false;
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功',
                });
                this.dialogvisible = false;
                this.parentFn.getDeatilData();
              } else {
                this.$message({ type: 'error', message: res.message });
              }
            })
            .catch((e) => {
              this.subLoading = false;
            });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-descriptions__table {
  font-size: 14px;
}
</style>
