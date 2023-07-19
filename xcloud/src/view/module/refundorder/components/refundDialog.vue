<template>
  <el-dialog width="460px" title="确认退款" :visible.sync="dialogvisible" @close="reset">
    <el-form :model="refundForm" label-width="120px" :rules="refundFormRules" ref="refundForm">
      <!-- {{ refundForm }}--{{order}} -->
      <el-form-item label="退款方式：" prop="confirmMethod">
        <el-radio v-model="refundForm.confirmMethod" label="ONLINE" v-if="isSupportOnline">线上退款</el-radio>
        <el-radio v-model="refundForm.confirmMethod" label="OFFLINE">线下退款</el-radio>
      </el-form-item>

      <el-form-item label="退款金额：" v-if="order.payMethod === 'CHN_PAY'">￥{{ order.refundMoney | formatQianFenWei }}</el-form-item>
      <el-form-item label="退款金额：" v-else
        >￥{{ order.refundMoney | formatQianFenWei }} <span class="zt-ml-2">{{ order.currencySymbol }}{{ floor(divide(order.refundMoney, order.exRate), 2) }}</span> <span class="zt-ml-2">汇率：{{ order.exRate }}</span></el-form-item
      >
      <el-form-item label="退款路径：" v-if="refundForm.confirmMethod == 'ONLINE'">
        {{ order.refundMethod | filterRefundMethod }}
      </el-form-item>

      <el-form-item label="退款凭证：" v-if="refundForm.confirmMethod == 'OFFLINE'" prop="refundCertificate">
        <UploadImages ref="uploadImageRef" :imageUrl="refundForm.refundCertificate" :on-success="uploadSuccess" :on-error="onUploadError" :on-remove="onUploadRemove" :num="1"></UploadImages>
      </el-form-item>

      <el-form-item v-if="order.refundStatus == 'REFUND_FAIL'" label="退款成功金额：">￥{{ (productList[0] || {}).refundSuccessMoney | formatQianFenWei }}</el-form-item>
      <el-form-item v-if="order.refundStatus == 'REFUND_FAIL'" label="退款失败金额：">
        {{ $util.accSub((productList[0] || {}).refundMoney, (productList[0] || {}).refundSuccessMoney) }}
      </el-form-item>

      <template v-if="order.refundStatus == 'REFUND_FAIL' && refundForm.confirmMethod == 'ONLINE'">
        <el-form-item label="退款账户类型" prop="bankCountType">
          <el-radio-group v-model="refundForm.bankCountType">
            <el-radio label="PERSONAL">个人</el-radio>
            <el-radio label="ENTERPRISE">企业</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="退款银行" prop="refundBank">
          <el-input v-model="refundForm.refundBank" placeholder="请输入" clearable style="width: 300px" size="small" />
        </el-form-item>
        <el-form-item label="退款账户" prop="refundAccount">
          <el-input v-model="refundForm.refundAccount" placeholder="请输入" clearable style="width: 300px" size="small" />
        </el-form-item>
        <el-form-item label="收款人姓名" prop="refundPayee" v-if="refundForm.bankCountType == 'PERSONAL'">
          <el-input v-model="refundForm.refundPayee" placeholder="请输入" clearable style="width: 300px" size="small" />
        </el-form-item>
        <el-form-item label="收款公司名称：" prop="refundPayee" v-if="refundForm.bankCountType == 'ENTERPRISE'">
          <el-input v-model="refundForm.refundPayee" placeholder="请输入" clearable style="width: 300px" size="small" />
        </el-form-item>
        <el-form-item label="开户支行：" prop="bankBranch">
          <el-input v-model="refundForm.bankBranch" placeholder="请输入" clearable style="width: 300px" size="small" />
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="refundConfirm" size="small" :loading="refundLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import UploadImages from '@/components/UploadImages';
import { applyOrderRefund, againRefund } from '@/api/newApi/orderManage/refundOrder';
import { divide, floor } from 'lodash';

export default {
  props: {
    refundDialogvisible: Boolean,
    order: { type: Object },
    productList: { type: Array },
    id: { type: String },
    orders: { type: Object },
  },
  components: { UploadImages },
  data() {
    return {
      divide,
      floor,
      refundLoading: false,
      refundForm: {
        confirmMethod: 'ONLINE',
        refundCertificate: '',
      },
      refundError: false,
      refundFormRules: {
        bankCountType: [{ required: true, message: '请选择退款账户类型', trigger: 'change' }],
        refundBank: [{ required: true, message: '请输入退款银行', trigger: 'blur' }],
        refundAccount: [{ required: true, message: '请输入退款账户', trigger: 'blur' }],
        refundPayee: [{ required: true, message: '请输入收款人/公司', trigger: 'blur' }],
        bankBranch: [{ required: true, message: '请输入开户支行', trigger: 'blur' }],
        refundCertificate: [{ required: true, type: 'string', message: '请选择退款凭证', trigger: 'blur' }],
      },
    };
  },
  created() {},
  filters: {
    // 退款路径
    filterRefundMethod(refundMethod) {
      let result = refundMethod;
      switch (refundMethod) {
        case 'RETURN_TO_SOURCE':
          result = '原路返回';
          break;
        case 'RETURN_TO_BANK':
          result = '退回到银行卡';
          break;
        case 'COUPON':
          result = '发放优惠券';
          break;
        case 'VIRTUAL':
          result = '虚拟退款';
          break;
      }
      return result;
    },
  },
  watch: {
    'orders.payMethod'() {
      // 如果是国际支付，退款只能线下
      // if (this.orders.payMethod === 'INTL_PAY') {
      //   this.refundForm.confirmMethod = 'OFFLINE';
      // }
    },
  },
  computed: {
    dialogvisible: {
      get() {
        return this.refundDialogvisible;
      },
      set(val) {
        this.$emit('update:refundDialogvisible', val);
      },
    },
    // 是否支持线上退款
    // 国内：都可以
    // 国际：原路退回可以线上、线下。退回到银行卡只能线下
    isSupportOnline() {
      var support = true;
      if (this.order.payMethod === 'INTL_PAY' && this.order.refundMethod === 'RETURN_TO_BANK') {
        this.refundForm.confirmMethod = 'OFFLINE';
        support = false;
      }
      return support;
    },
  },
  methods: {
    refundConfirm() {
      if (this.order.refundStatus == 'REFUND_FAIL') {
        this.refund();
        return;
      }
      if (this.refundForm.confirmMethod == 'OFFLINE') {
        this.oldRefundConfirm();
        return;
      }
      this.refundLoading = true;
      applyOrderRefund({
        id: this.id,
        // ...this.refundForm,
      })
        .then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '退款成功',
              duration: 2000,
            });
            this.refundLoading = false;
            this.dialogvisible = false;
            this.$emit('getParentFn');
          }
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: err.message,
          });
          this.refundLoading = false;
          this.dialogvisible = false;
          this.$emit('getParentFn');
        })
        .finally(() => {});
    },

    reset() {
      // if (this.$refs.refundForm) {
      //   this.refundForm = {
      //     confirmMethod: '',
      //     refundCertificate: '',
      //   };
      //   this.$refs.refundForm.resetFields();
      // }
    },

    oldRefundConfirm() {
      if (!this.refundForm.refundCertificate) {
        return this.$message({
          type: 'error',
          message: '请上传凭证',
        });
      }
      this.refundLoading = true;
      applyOrderRefund({
        id: this.id,
        confirmMethod: 'OFFLINE',
        refundCertificate: this.refundForm.refundCertificate,
      })
        .then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '退款成功',
              duration: 2000,
            });
            this.dialogvisible = false;
            this.$emit('getParentFn');
          }
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: err.message,
          });
          this.dialogvisible = false;
          this.$emit('getParentFn');
        })
        .finally(() => {});
    },

    uploadSuccess(file) {
      this.refundForm.refundCertificate = file;
    },
    // 上传失败
    onUploadError(file) {},
    // 上传移除
    onUploadRemove(file) {
      this.refundForm.refundCertificate = '';
    },

    refund() {
      this.$refs.refundForm.validate((valid) => {
        if (valid) {
          var params;
          if (this.refundForm.confirmMethod == 'ONLINE') {
            params = {
              refundId: this.id,
              ...this.refundForm,
              refundCertificate: '',
            };
          } else {
            if (!this.refundForm.refundCertificate) {
              return this.$message({
                type: 'error',
                message: '请上传凭证',
              });
            }
            params = {
              refundId: this.id,
              refundCertificate: this.refundForm.refundCertificate,
              confirmMethod: this.refundForm.confirmMethod,
            };
          }
          againRefund(params)
            .then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '退款成功',
                  duration: 2000,
                });
                this.dialogvisible = false;
                this.$emit('getParentFn');
              }
            })
            .catch((err) => {
              this.$message({
                type: 'error',
                message: err.message,
              });
            })
            .finally(() => {
              this.refundLoading = false;
              this.$emit('getParentFn');
            });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.red {
  color: #de1f37;
}
</style>
