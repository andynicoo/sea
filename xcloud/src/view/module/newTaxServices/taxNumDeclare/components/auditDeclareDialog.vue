<template>
  <el-dialog title="审核申报" :visible.sync="dialogvisible" width="460px" center>
    <el-form class="tax-form" :model="taxData" v-if="taxWorkOrder.countryCode === 'PL'" label-width="110px">
      <p>确认税金：</p>
      <p>请和税务师确认应缴税金是否一致：</p>
      <el-form-item label="含税销售总额">
        <el-input-number v-model="taxData.includeTaxPrice" :disabled="taxDisabled" controls-position="right" :min="0.0" :precision="2"></el-input-number>
      </el-form-item>
      <el-form-item label="不含税销售总额">
        <el-input-number v-model="taxData.excludeTaxPrice" :disabled="taxDisabled" controls-position="right" :min="0.0" :precision="2"></el-input-number>
      </el-form-item>
      <el-form-item label="抵扣金额">
        <el-input-number v-model="taxData.deductionPrice" :disabled="taxDisabled" controls-position="right" :min="0.0" :precision="2"></el-input-number>
      </el-form-item>
      <el-form-item label="销项税额">
        <el-input-number v-model="taxData.taxAmtTotal" :disabled="taxDisabled" controls-position="right" :min="0.0" :precision="2"></el-input-number>
      </el-form-item>
      <el-form-item label="最终缴纳税金">
        <el-input-number v-model="taxData.allTaxPrice" :disabled="taxDisabled" controls-position="right" :min="0.0" :precision="2" style="width: 220px"></el-input-number>
        <el-button size="mini" class="tax-btn" @click="changeTax" v-show="hasAuthority('M1_31')">{{ taxDisabled ? '修改税金' : '保存' }}</el-button>
      </el-form-item>
    </el-form>
    <div v-if="taxDisabled">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item class="is-required" label="审核：" prop="status">
          <el-radio-group v-model="form.isPass">
            <el-radio :label="true">审核通过</el-radio>
            <!-- <el-radio :label="false">资料不对，驳回</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <!-- 国家是沙特阿拉伯并且服务商是沙特自营需要填写发票号 -->
        <el-form-item class="invoice-number-item is-required" label="发票号：" prop="invoiceNumber" v-if="form.isPass === true && taxWorkOrder.countryCode === 'SA' && taxWorkOrder.supplierIdSa">
          <el-input v-model="form.invoiceNumber" placeholder="请输入发票号" clearable style="width: 200px" />
        </el-form-item>
        <div v-if="form.isPass === false" style="margin-bottom: 20px">
          <span>当前申报进度： </span><span>{{ (rejectNode || '').split(':')[0] }}</span>
        </div>
        <div v-if="form.isPass === false" style="margin-bottom: 20px">
          <span>更改为： </span><span>{{ (rejectNode || '').split(':')[1] }}</span>
        </div>
        <el-form-item label="发短信给客户：" prop="isSendMessage" v-if="form.isPass === false">
          <el-radio-group v-model="form.isSendMessage">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="驳回原因" prop="reason" v-if="form.isPass === false">
          <el-input v-model="form.reason" placeholder="请输入驳回原因：" clearable size="small" type="textarea" style="width: 400px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogvisible = false" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="submit">确认</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { orderAudit, updateDeclareData } from '@/api/newApi/taxServices/taxNumDeclare.js';
export default {
  props: {
    auditDeclareDialog: Boolean,
    taxWorkOrder: Object,
    id: String,
    rejectNode: String,
    getserviceDetail: {
      type: Function,
      default: null,
    },
  },

  data() {
    var invoiceNumberVali = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('发票号必填'));
      } else if (!/^[0-9]*$/.test(value)) {
        callback(new Error('仅支持输入数字，不含空格'));
      } else {
        callback();
      }
    };
    return {
      formLabelWidth: '120px',
      form: {
        isPass: true,
        isSendMessage: true,
        invoiceNumber: '',
      },
      rules: {
        isPass: [{ required: true, message: '请选择审核状态', trigger: 'blur' }],
        reason: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }],
        isSendMessage: [{ required: true, message: '请选择是否发短信给客户', trigger: 'change' }],
        invoiceNumber: [{ validator: invoiceNumberVali, trigger: 'blur' }],
      },
      taxData: {
        includeTaxPrice: 0,
        excludeTaxPrice: 0,
        deductionPrice: 0,
        taxAmtTotal: 0,
        allTaxPrice: 0,
      },
      taxDisabled: true,
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.auditDeclareDialog;
      },
      set(val) {
        this.$emit('update:auditDeclareDialog', val);
      },
    },
  },

  watch: {
    taxWorkOrder: {
      handler(val) {
        if (val.countryCode === 'PL') {
          this.taxData = {
            includeTaxPrice: val.includeTaxPrice,
            excludeTaxPrice: val.excludeTaxPrice,
            deductionPrice: val.deductionPrice,
            taxAmtTotal: val.taxAmtTotal,
            allTaxPrice: val.allTaxPrice,
          };
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    console.log(this.taxWorkOrder, 'taxWorkOrder');
  },
  methods: {
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      orderAudit({
        ...this.form,
        id: this.id,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('审核成功');
          this.getserviceDetail();
        } else {
          this.$message.error('审核失败');
        }
      });
    },
    // 修改税金
    changeTax() {
      this.taxDisabled = !this.taxDisabled;
      if (this.taxDisabled) {
        let queryData = this.taxData;
        queryData.workId = this.id;
        updateDeclareData(queryData).then((res) => {
          if (res.code === 0) {
            this.$message.success('操作成功');
            this.getserviceDetail();
          } else {
            this.$message.error('操作失败');
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bg-blue {
  text-align: right;
  background-color: #d0effb;
  padding-right: 2px;
  border: 1px solid #dedede;
}
.bg-gray {
  background-color: #f2f2f2;
  padding-left: 4px;
  border: 1px solid #dedede;
}
.color-red {
  color: red;
}
.tax-form {
  /deep/ .el-form-item.el-form-item--small {
    margin-bottom: 1px;
  }
  /deep/ .el-form-item__label {
    background-color: #d0effb;
  }
  .tax-btn {
    position: absolute;
    right: 0;
    top: 2px;
  }
  /deep/ .el-input__inner {
    text-align: left;
  }
  /deep/ .el-input-number {
    width: 300px;
  }
}

.dialog-footer {
  text-align: right;
  padding: 30px 0px;
}
.invoice-number-item {
  /deep/.el-form-item__content {
    margin-left: 68px;
  }
}
</style>
