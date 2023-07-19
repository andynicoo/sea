<template>
  <el-dialog width="650px" title="编辑线下付款信息" :visible.sync="drawerVisible" @close="reset">
    <div>
      <el-form label-width="130px" ref="confrimAccountForm" :rules="rulesconfrimAccountForm" :model="confrimAccount">
        <el-form-item label="发票金额（元）：">
          {{ detailInfo.makeInvoiceMoney }}
        </el-form-item>

        <el-form-item prop="paymentChannel" label="支付方式：">
          <el-select style="width: 300px" v-model="confrimAccount.paymentChannel" placeholder="支付方式" clearable>
            <el-option v-for="item in paymentChannelList" :value="item.dataCode" :key="item.baseDataId" :label="item.dataValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款方：" prop="payer">
          <el-input v-model="confrimAccount.payer" style="width: 300px" clearable></el-input>
        </el-form-item>

        <el-form-item label="收款账号：" prop="acceptAccountNo">
          <el-select v-model="confrimAccount.acceptAccountNo" placeholder="请选择" size="small" style="width: 300px" clearable filterable>
            <el-option-group style="width: 450px">
              <div class="option_title" style="background: #f6f8fa">
                <span>银行账号</span>
                <span>账户名称</span>
                <span>开户银行</span>
              </div>

              <el-option v-for="(item, index) in collectionList" :key="index" :label="item.accountName" :value="item.bankAccount" class="option_title">
                <span>{{ item.bankAccount }}</span>
                &nbsp;
                <span>{{ item.accountName }}</span>
                &nbsp;
                <span>{{ item.bankName }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item label="付款凭证：" prop="paymentFile">
          <UploadImages ref="uploadImageRef" :num="3" :imageUrl="confrimAccount.paymentFile" :on-success="uploadSuccess" :on-error="onUploadError" :on-remove="onUploadRemove"></UploadImages>
        </el-form-item>
        <el-form-item label="付款时间：" prop="paymentTime" style="width: 300px">
          <el-date-picker :picker-options="pickerOptions" v-model="confrimAccount.paymentTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"> </el-date-picker>
        </el-form-item>

        <el-form-item label="交易流水：">
          <el-input v-model="confrimAccount.platformTradeNo" style="width: 300px" clearable></el-input>
        </el-form-item>

        <el-form-item label="备注说明：" prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            v-model="confrimAccount.remark"
            :placeholder="`1、请输入线下付款原因
              2、可备注特别说明`"
            style="width: 300px"
            :maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>

      <div style="text-align: right">
        <span class="dialog-footer">
          <el-button size="mini" type="primary" @click="submitConfirmPay" :loading="submitIng">保存</el-button>

          <el-button size="mini" @click="drawerVisible = false">取消</el-button>
        </span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { refundAudit, editAccount } from '@/api/newApi/orderManage/refundOrder';
import { editOrderRefund } from '@/api/newApi/orderManage/salesorder.js';
import { getWorldCountryListByPid } from '@/api/newApi/customer/companyInfo';
import { orderOcrPayVoucher } from '@/api/newApi/orderManage/salesorder.js';
import { getBankAccountList } from '@/api/newApi/common.js';
import { getBaseDataByDataType } from '@/api/newApi/common';
import UploadImages from '@/components/UploadImages/index'; //发票上传组件
import { uploadInvoiceCertificate } from '@/api/newApi/finance/invoice.js';

export default {
  props: {
    showOffLinePayDialog: Boolean,
    detailInfo: Object,
  },
  components: { UploadImages },
  data() {
    return {
      submitIng: false,
      confrimAccount: {
        acceptAccountNo: '',
        paymentFile: '',
        paymentTime: '',
        platformTradeNo: '',
        remark: '',
        paymentAmount: '',
        paymentChannel: '',
        payer: '',
        currentPaymentAmount: '',
      },
      collectionList: [], //收款账户列表
      paymentChannelList: [],
      rulesconfrimAccountForm: {
        currentPaymentAmount: [{ required: true, message: '请输入本次付款金额', trigger: 'blur' }],
        payer: [{ required: true, message: '请输入付款方', trigger: 'blur' }],
        acceptAccountNo: [{ required: true, message: '请选择收款账号', trigger: 'change' }],
        paymentChannel: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
        acceptAccountNo: [{ required: true, message: '请输入收款账号', trigger: 'blur' }],
        paymentFile: [{ required: true, message: '请上传付款凭证', trigger: 'change' }],
        paymentTime: [{ required: true, message: '请选择付款时间', trigger: 'change' }],
        remark: [{ required: true, message: '请输入备注说明', trigger: 'blur' }],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  computed: {
    drawerVisible: {
      get() {
        // if (this.showOffLinePayDialog) {
        //   this.refundForm = JSON.parse(JSON.stringify(this.orderRefund))
        //   console.log(this.refundForm)
        //   this.provinceChange(this.refundForm.province)
        // }
        return this.showOffLinePayDialog;
      },
      set(val) {
        this.$emit('update:showOffLinePayDialog', val);
      },
    },
  },
  watch: {
    showOffLinePayDialog(val) {
      if (val) {
        // // this.refundForm = JSON.parse(JSON.stringify(this.orderRefund));
        // Object.keys(this.refundForm).forEach((item) => {
        //   this.refundForm[item] = this.orderRefund[item];
        // });
        // console.log(this.refundForm);
        this.getBankList();

        this.getPayChannel();
      }
    },
  },
  created() {},
  methods: {
    submit() {
      this.$refs.refundForm.validate((valid) => {
        if (valid) {
          this.submitIng = true;

          this.auditConfirm();
        } else {
          return false;
        }
      });
    },
    getPayChannel() {
      const payList = ['WEIXIN', 'ALIPAY', 'UNIONPAY', 'AIR_WALLEX_CODE', 'LIAN_LIAN_PAY_CODE', 'WAN_LI_CODE', 'PAYPAL_CODE'];
      getBaseDataByDataType({
        dataType: 'PAYMENT_CHANNEL_TYPE',
      }).then((res) => {
        if (res.code == 0) {
          this.paymentChannelList = res.data.filter((item) => payList.includes(item.dataCode));
        }
      });
    },
    /**获取收款账户数据  */
    getBankList() {
      getBankAccountList({
        enterpriseId: localStorage.getItem('enterpriseId'),
      }).then((res) => {
        if (res.code == 0) {
          this.collectionList = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    /**
     * 上传图片的操作
     */
    uploadSuccess(file) {
      this.confrimAccount.paymentFile = file;
      const list = file.split(',');
      orderOcrPayVoucher({
        uri: list[list.length - 1],
      }).then((res) => {
        if (res && res.data) {
          this.confrimAccount.paymentTime = res.data.payTime; //付款时间
          this.confrimAccount.platformTradeNo = res.data.serialNumber; //流水号
        }
      });
    },
    submitConfirmPay() {
      this.$refs.confrimAccountForm.validate((valid) => {
        if (valid) {
          this.submitIng = true;
          this.uploadCertificateFn();
        }
      });
    },

    uploadCertificateFn() {
      let data = {
        orderId: this.detailInfo.orderId,
        ...this.confrimAccount,
        paymentAmount: this.detailInfo.makeInvoiceMoney,
        acceptAccountName: this.collectionList.find((item) => this.confrimAccount.acceptAccountNo === item.bankAccount).accountName,
      };
      // if (this.detailInfo.paymentTypeEn === 'PART') {
      //   data.paymentAmount = this.confrimAccount.currentPaymentAmount;
      // }
      // if (this.isItem) {
      //   data.orderPaymentId = this.checkItem.orderPaymentId;
      // }
      uploadInvoiceCertificate(data)
        .then((res) => {
          this.submitIng = false;
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '操作成功',
            });
            this.drawerVisible = false;
            this.$emit('refresh');
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .catch((e) => {
          this.submitIng = false;
        });
    },
    // 上传失败
    onUploadError(file) {},
    // 上传移除
    onUploadRemove(file, uploadFiles) {
      this.confrimAccount.paymentFile = file;
    },

    reset() {
      if (this.$refs.refundForm) {
        this.$refs.refundForm.resetFields();
      }
    },
    auditConfirm() {
      editAccount({
        ...this.refundForm,
        refundId: this.id,
        orderId: this.orderId,
      })
        .then((res) => {
          if (res.code === 0) {
            this.drawerVisible = false;
            this.$message({
              type: 'success',
              message: '修改成功',
              duration: 2000,
            });
            this.submitIng = false;
            this.$emit('refresh');
          } else {
            this.$message({
              type: 'fail',
              message: '修改失败',
              duration: 2000,
            });
          }
        })
        .catch((e) => {
          this.submitIng = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 3;
  }
}
</style>
