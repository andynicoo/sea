<template>
  <!-- 线下付款提示 -->
  <el-dialog title="审核凭证" :visible.sync="dialogvisible" width="650px" class="man-confirm-dialog" @close="reset">
    <el-descriptions class="margin-top" title="" :column="2">
      <el-descriptions-item label="商品金额（元）">{{ info.orderPaymentMoney }}</el-descriptions-item>
      <el-descriptions-item label="已付金额">{{ detailInfo.orderPaidMoney }}</el-descriptions-item>
      <el-descriptions-item label="税额">{{ info.invoiceMoney }}</el-descriptions-item>
      <el-descriptions-item label="未付金额">{{ calculationMoney(detailInfo) }}</el-descriptions-item>
      <el-descriptions-item label="总应付金额">{{ $util.accAdd(info.orderPaymentMoney, info.invoiceMoney) }}</el-descriptions-item>
      <el-descriptions-item label="本次付款金额">{{ info.paymentAmount }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions class="margin-top" title="凭证信息" :column="2">
      <el-descriptions-item label="付款方">{{ info.payer }}</el-descriptions-item>
      <el-descriptions-item label="收款账号">{{ info.acceptAccountName }}</el-descriptions-item>
      <el-descriptions-item label="支付方式">{{ info.paymentChannel | filterPaymentChannel(paymentChannelList) }}</el-descriptions-item>
      <el-descriptions-item label="付款时间">
        {{ info.paymentTime }}
      </el-descriptions-item>
      <el-descriptions-item label="付款凭证">
        <el-image v-if="info.paymentFile" style="width: 60px; height: 40px" :preview-src-list="info.paymentFile.split(',')" :src="info.paymentFile.split(',')[0]"></el-image>
      </el-descriptions-item>
      <el-descriptions-item label="流水">{{ info.platformTradeNo }}</el-descriptions-item>
      <el-descriptions-item label="币种/金额" v-if="detailInfo.payMethod === 'INTL_PAY'">{{currency[info.currency]}} {{info.currencyPayAmount}} 汇率：{{info.exRate}}</el-descriptions-item>
      <el-descriptions-item label="备注">{{ info.remark }}</el-descriptions-item>
    </el-descriptions>

    <el-form label-width="130px" ref="auditForm" :model="form">
      <el-form-item label="实际到账时间：" prop="arrivalTime" :rules="[{ required: true, trigger: 'change', message: '请选择实际到账时间' }]">
        <el-date-picker v-model="form.arrivalTime" type="datetime" placeholder="请选择实际到账时间" value-format="yyyy-MM-dd HH:mm:ss" :clearable="false"> </el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态：" prop="auditResult" :rules="[{ required: true, trigger: 'change', message: '请选择审核状态' }]">
        <el-radio-group v-model="form.auditResult">
          <el-radio label="AUDIT_SUCCESS">审核通过</el-radio>
          <el-radio label="AUDIT_FAIL">审核不通过</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="原因：" prop="remark" :rules="[{ required: form.auditResult === 'AUDIT_FAIL', trigger: 'blur', message: '请填写原因' }]">
        <el-input type="textarea" :rows="4" v-model="form.remark" placeholder="请输入" style="width: 300px" :maxlength="150" show-word-limit></el-input>
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
import { auditUpload } from '@/api/newApi/orderManage/salesorder.js';
import currency from '@/utils/currency.js';

export default {
  data() {
    return {
      form: {
        arrivalTime: '',
        auditResult: '',
        remark: '',
      },
      subLoading: false,
      // rulesForm: {
      //   auditResult: [{ required: true, trigger: 'change', message: '请选择审核状态' }],
      //   arrivalTime: [{ required: true, trigger: 'change', message: '请选择实际到账时间' }],
      //   remark: [{ required: true, trigger: 'blur', message: '请填写原因' }],
      // },
      currency: currency
    };
  },
  props: {
    showAuditUploadFile: Boolean,
    detailInfo: Object,
    paymentChannelList: { type: Array },
    checkItem: Object,
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
        return this.showAuditUploadFile;
      },
      set(val) {
        this.$emit('update:showAuditUploadFile', val);
      },
    },
    isItem() {
      return this.checkItem && this.checkItem.orderPaymentId;
    },
    info() {
      if (!this.isItem) {
        if (this.detailInfo.orderPaymentDetails.length) {
          return this.detailInfo.orderPaymentDetails[0];
        }
        return {};
      } else {
        return this.checkItem;
      }
    },
  },
  watch: {
    dialogvisible(newVal) {
      this.$nextTick(() => {
        this.form.arrivalTime = this.info.paymentTime;
      });
    },
  },
  created() {},
  methods: {
    //未付金额 unPaidMoney
    calculationMoney(record) {
      return (record.unPaidMoney || 0);
    },
    reset() {
      this.form = {
        arrivalTime: '',
        remark: '',
        auditResult: '',
      };
      this.$refs.auditForm.resetFields();
    },

    submitConfirm() {
      console.log(this.form);
      this.$refs.auditForm.validate((valid) => {
        if (valid) {
          this.subLoading = true;
          auditUpload({
            ...this.form,
            orderId: this.detailInfo.orderId,
            orderPaymentId: this.info.orderPaymentId,
          })
            .then((res) => {
              this.subLoading = false;
              if (res.code == 0) {
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
