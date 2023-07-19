<template>
  <el-dialog title="税号信息" :visible.sync="dialogvisible" width="450px" center>
    <el-form label-width="120px">
      <el-form-item label="VAT税号：">{{ info.vatTaxNumber }}</el-form-item>
      <el-form-item label="EORI号：">{{ info.eoriNumber }}</el-form-item>
      <el-form-item label="税号下发日期：">{{ info.taxIssueDate }}</el-form-item>
      <el-form-item label="税号生效日期：">{{ info.taxEffectiveDate }}</el-form-item>
      <el-form-item label="申报周期：">{{ info.declarePeriod | period }}</el-form-item>
      <el-form-item label="申报国家：">{{ info.countryNameZh }}</el-form-item>
      <el-form-item label="VAT税号文件：">
        <el-link type="primary" :underline="false">
          <a :href="info.vatTaxNumberFile" target="_blank">VAT税号文件</a>
        </el-link>
      </el-form-item>
      <el-form-item label="VAT证书：" prop="categoryName">
        <el-link type="primary" :underline="false" :href="info.vatCertificate">VAT证书</el-link>
      </el-form-item>
      <el-form-item label="gateway账号：">{{ info.gatewayId }}</el-form-item>
      <el-form-item label="gateway密码：">{{ info.gatewayPassword }}</el-form-item>
      <el-form-item label="密钥：">{{ info.secret }}</el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogvisible = false" size="small">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { vatInfo } from "@/api/newApi/taxServices/taxNumDeclare.js";
export default {
  props: {
    taxNumInfoDialog: Boolean,
    row: Object
  },
  data() {
    return {
      info: {}
    };
  },
  filters: {
    period(val) {
      switch (val) {
        case 0:
          return "月报";
        case 1:
          return "季报";
        case 2:
          return "年报";
      }
    }
  },
  computed: {
    dialogvisible: {
      get() {
        return this.taxNumInfoDialog;
      },
      set(val) {
        this.$emit("update:taxNumInfoDialog", val);
      }
    }
  },
  watch: {
    dialogvisible(newVal, oldVal) {
      if (newVal) {
        this.getVatInfo();
      }
    }
  },
  created() {},
  methods: {
    getVatInfo() {
      vatInfo(this.row.id)
        .then(res => {
          if (res.code == 0) {
            this.info = res.data;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item--small {
  margin-bottom: 5px !important;
}
 /deep/ .el-form-item__label{
  color:#999999;
}
</style>
