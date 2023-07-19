<template>
  <el-dialog title="录入续费结果" :visible.sync="dialogvisible" width="660px" center @close="reset">
    <el-form :model="form" ref="form" :rules="rules" label-width="110px">
      <el-form-item label="证书有效年份：" prop="eprEffectiveDate">
        <el-date-picker v-model="form.eprEffectiveDate" type="date" disabled :clearable="false" placeholder="请选择证书有效年份" value-format="yyyy-MM-dd 23:59:59" style="width: 200px"></el-date-picker>
      </el-form-item>
      <el-form-item label="账单：" prop="billFiles">
        <UploadFileUrl :fileList.sync="form.billFiles" :showTip="false" :limit="1" fileClass></UploadFileUrl>
        <span v-if="nextNodeCode == 'NODE0365'" class="warn-font">注意：请上传回收机构账单，以便直连回收机构，在线缴纳官费</span>
      </el-form-item>
      <el-form-item label="证书：" prop="certificates">
        <UploadFileUrl :fileList.sync="form.certificates" :showTip="false" :limit="10" fileClass></UploadFileUrl>
      </el-form-item>

      <template v-if="nextNodeCode == 'NODE0365' && showBank">
        <p class="mb-15">
          <span class="warn-title">回收机构账单识别结果确认</span>

          <span class="warn-font">以下信息将传给连连支付生成在线支付订单，请校正识别结果，确保订单无误。</span>
        </p>

        <el-form-item label="国际银行账号 IBAN：" prop="ban">
          <el-input v-model="form.ban" placeholder="请输入" style="width: 248px" clearable />
        </el-form-item>

        <el-form-item label="银行识别码 BIC：" prop="bankIdentifierCode">
          <el-input v-model="form.bankIdentifierCode" placeholder="请输入" style="width: 248px" clearable />
        </el-form-item>

        <el-form-item label="银行名称 Dank Name：" prop="bankName">
          <el-input v-model="form.bankName" placeholder="请输入" style="width: 248px" clearable />
        </el-form-item>
        <el-form-item label="账户名称 Account Name：" prop="accountName">
          <el-input v-model="form.accountName" placeholder="请输入" style="width: 248px" clearable />
        </el-form-item>
        <el-form-item label="官费金额：" prop="officialFee"> <el-input-number :step="1" :min="0" :precision="2" v-model="form.officialFee" placeholder="请输入" style="width: 248px" clearable />EUR </el-form-item>
        <el-form-item label="发票号：" prop="invoiceNo">
          <el-input v-model="form.invoiceNo" placeholder="请输入" style="width: 248px" clearable />
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import UploadFileUrl from '@/components/UploadFileUrl/index';
import { readBankInfoApi } from '@/api/newApi/workOrder/EPRManage';
import { inputEprRegisterInfoApi } from '@/api/newApi/workOrder/eprRenewal';
export default {
  props: {
    recordDialog: Boolean,
    serviceId: String,
    certificates: Array,
    billFiles: Array,
    uinStr: String,
    countryCode: String,
    nextNodeCode: String,
    serviceName: String,
    eprWorkOrder: Object,
    eprEffectiveDate: String,
    showBank: Boolean,
  },
  data() {
    return {
      form: {
        uinStr: '',
        billFiles: '',
        certificates: '',
        eprEffectiveDate: '',
      },
      rules: {
        // certificates: [{required: true, message: '请上传证书', trigger: 'blur'}],
        ban: [{ required: true, message: '请填写国际银行账户', trigger: 'blur' }],
        bankIdentifierCode: [{ required: true, message: '请填写银行识别码', trigger: 'blur' }],
        bankName: [{ required: true, message: '请填写银行名称', trigger: 'blur' }],
        accountName: [{ required: true, message: '请填写账户名称', trigger: 'blur' }],
        officialFee: [{ required: true, message: '请填写官费金额', trigger: 'blur' }],
        invoiceNo: [{ required: true, message: '请填写发票号', trigger: 'blur' }],
      },
    };
  },
  components: {
    UploadFileUrl,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.recordDialog;
      },
      set(val) {
        this.$emit('update:recordDialog', val);
      },
    },
    computRule() {
      if (this.serviceName && (this.serviceName.indexOf('法国weee') != -1 || this.serviceName.indexOf('法国WEEE') != -1)) {
        return {};
      }
      return this.rules;
    },
  },
  watch: {
    dialogvisible(newVal) {
      if (newVal) {
        this.form.uinStr = this.uinStr;
        if (this.eprEffectiveDate) {
          this.form.eprEffectiveDate = this.eprEffectiveDate;
        }
        if (this.eprWorkOrder && this.eprWorkOrder.bankPayInfos) {
          try {
            const bankPayInfos = JSON.parse(this.eprWorkOrder.bankPayInfos);
            this.form.ban = bankPayInfos.ban;
            this.form.bankIdentifierCode = bankPayInfos.bankIdentifierCode;
            this.form.bankName = bankPayInfos.bankName;
            this.form.accountName = bankPayInfos.accountName;
            this.form.officialFee = bankPayInfos.officialFee;
            this.form.invoiceNo = bankPayInfos.invoiceNo;
          } catch (e3) {}
        }
      }
    },
    certificates(val) {
      this.form.certificates = val.join(',');
    },
    billFiles(val) {
      this.form.billFiles = val.join(',');
    },
    'form.billFiles'(val) {
      if (val && this.nextNodeCode == 'NODE0365') {
        readBankInfoApi({
          serviceId: this.serviceId,
          voucherFiles: [val],
        }).then((res) => {
          console.log(res);
          if (res.code == 0) {
            this.form = {
              ...this.form,
              ...res.data,
            };
          }
        });
      }
    },
  },
  methods: {
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    submit() {
      console.log(this.form);
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      let billUrl = this.form.billFiles.split(',');
      let certificatesUrl = this.form.certificates.split(',');
      let data = {
        serviceId: this.serviceId,
        certificates: certificatesUrl,
        billFiles: billUrl,
        uinStr: this.form.uinStr,
        officialFee: this.form.officialFee,
        invoiceNo: this.form.invoiceNo,
        bankName: this.form.bankName,
        bankIdentifierCode: this.form.bankIdentifierCode,
        ban: this.form.ban,
        eprEffectiveDate: this.form.eprEffectiveDate,
        accountName: this.form.accountName,
      };
      inputEprRegisterInfoApi(data).then((res) => {
        if (res.code === 0) {
          this.$message.success('录入成功');
          this.$emit('refresh');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.warn-title {
  color: #444;
  font-weight: 800;
  margin-right: 50px;
}
.warn-font {
  color: #ffd2b3;
}

.mb-15 {
  margin-bottom: 15px;
}
</style>
