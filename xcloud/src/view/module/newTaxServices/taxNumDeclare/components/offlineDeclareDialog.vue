<template>
  <el-dialog :visible.sync="dialogvisible" width="650px" center @close="closeModel">

  <span slot="title" class="dialog-footer">
    <p>线下申报</p>
    <span class="diag-head-title">申报数据未通过API传输</span>
  </span>

    <el-form class="tax-form mt-10" :model="taxData" label-width="110px" ref="ruleForm" :rules="rules">
      <el-form-item label="应缴税金" prop="allTaxPrice" v-if="!isYearManage">
        <el-input-number v-model="taxData.allTaxPrice" controls-position="right" :min="0.0" :precision="2"></el-input-number>
      </el-form-item>
      <el-form-item label="申报回执：" prop="declareReceiptList">
        <UploadFile :fileClass="true" :accept="'.jpg,.png,.jpge,.pdf'" initTip="文件格式: 图片,pdf,数量：不超过10" :maxSize="30" :limit="10" :fileList.sync="taxData.declareReceiptList"></UploadFile>
      </el-form-item>
      <el-form-item label="缴税凭证："  v-if="!isYearManage" >
        <UploadFile :fileClass="true" :accept="'.jpg,.png,.jpge,.gif'" initTip="文件格式: 图片,数量：1" :fileList.sync="taxData.taxCertificateList"></UploadFile>
      </el-form-item>
      <el-form-item label="申报数据文件：">
        <UploadFile :fileClass="true" :maxSize="50" :accept="'.jpg,.png,.jpge,.pdf,.zip, xls, .xlsx, .csv,.txt,.rar,.doc,.docx'" initTip="文件限制：大小不超过50M，格式: png、pdf ,excel  doc. docx, txt,ZIP,rar,数量：1"  :fileList.sync="taxData.sellOfflineFileList"></UploadFile>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </div>

  </el-dialog>
</template>

<script>
import { offlineSubmission, offlineSubmissionYear } from "@/api/newApi/taxServices/taxNumDeclare.js";
import UploadFile from "@/components/UploadFile"; // 上传文件组件
export default {
  props: {
    offlineDeclareDialog: Boolean,
    id: String,
    isYearManage: Boolean,
    getserviceDetail: {
      type: Function,
      default: null,
    },
  },
  components: { UploadFile },
  data() {
    return {
      rules: {
        allTaxPrice: [{ required: true, message: "请输入应缴税金", trigger: "blur" }],
        declareReceiptList: [{ required: true, type: 'array', message: "请上传申报回执", trigger: "change" }]
      },
      taxData: {
        taxCertificateList: [], // 缴税凭证
        sellOfflineFileList: [], // 客户线下申报数据文件
        declareReceiptList: [], // 申报回执
        allTaxPrice: null
      }
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.offlineDeclareDialog;
      },
      set(val) {
        this.$emit("update:offlineDeclareDialog", val);
      },
    },
  },

  watch: {
  },
  methods: {
    submit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          if (this.isYearManage) {
            this.yearDeclare()
          } else {
            this.confirm();
          }
          
        } else {
          return false;
        }
      });
    },
    closeModel() {
      this.taxData.taxCertificateList = [], // 缴税凭证
      this.taxData.sellOfflineFileList= [], // 客户线下申报数据文件
      this.taxData.declareReceiptList= [], // 申报回执
      this.taxData.allTaxPrice= null
      this.$refs["ruleForm"].resetFields();
    },
    confirm() {
      offlineSubmission({
        allTaxPrice: this.taxData.allTaxPrice,
        id: this.id,
        declareReceipt: this.taxData.declareReceiptList.map((v) => v.url).join(","),
        sellOfflineFile: this.taxData.sellOfflineFileList.length ? this.taxData.sellOfflineFileList[0].url : '',
        taxCertificate: this.taxData.taxCertificateList.length ? this.taxData.taxCertificateList[0].url : ''
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success("保存成功");
          this.dialogvisible = false;
          this.getserviceDetail();
        } else {
          this.$message.error("保存失败");
        }
      });
    },
    yearDeclare() {
      offlineSubmissionYear({
        id: this.id,
        offlineDeclareReceipt: this.taxData.declareReceiptList.map((v) => v.url).join(","),
        sellOfflineFile: this.taxData.sellOfflineFileList.length ? this.taxData.sellOfflineFileList[0].url : ''
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success("保存成功");
          this.dialogvisible = false;
          this.getserviceDetail();
        } else {
          this.$message.error("保存失败");
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.color-red {
  color: #f56c6c;
}
/deep/ .dialog-footer p{
  font-size: 18px;
  font-weight: 800;
  color: #333;
}
/deep/ .dialog-footer .diag-head-title {
  color: #e6a23c;
}
/deep/ .el-dialog__header {
  height: 82px;
}
</style>
