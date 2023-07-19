<template>
  <!-- 修改公司名称 -->
  <el-dialog title="修改公司名称" :visible.sync="dialogvisible" width="600px" @close="closeCompany">
    <el-form label-width="120px" :model="companyFrom" ref="companyFrom" :rules="rulesCompanyFrom">
      <el-form-item label="公司中文名称：" prop="companyNameZh">
        <el-input v-model="companyFrom.companyNameZh" placeholder="请输入公司中文名称" style="width: 220px" />
      </el-form-item>
      <el-form-item label="公司英文名称：" prop="companyNameEn">
        <el-input v-model="companyFrom.companyNameEn" placeholder="请输入公司英文名称" style="width: 220px" />
      </el-form-item>
      <el-form-item label="营业执照：" prop="companyBusinessLicenseList">
        <UploadFile :fileClass="true" :showTip="true" :fileList.sync="companyFrom.companyBusinessLicenseList"></UploadFile>
      </el-form-item>
      <el-form-item label="审批截图：">
        <UploadFile :fileClass="true" :maxSize="30" :accept="'.jpg,.png,.jpge,.gif'" :fileList.sync="companyFrom.approvalFileList"></UploadFile>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: right">
      <el-button style="width: 65px" type="default" @click="dialogvisible = false">取消</el-button>
      <el-button style="width: 65px" type="primary" @click="submitCompanyInfo">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { changeCompanyName } from '@/api/newApi/taxServices/serviceManage.js';
import UploadFile from '@/components/UploadFile'; // 上传文件组件
export default {
  props: {
    modifyCompanyDialog: Boolean,
    serviceId: String,
    workId: String,
    companyNameZh: String,
    companyNameEn: String,
    getWorkOrderDetail: { type: Function },
  },
  components: { UploadFile },
  data() {
    return {
      companyFrom: {
        companyNameEn: '',
        companyNameZh: '',
        companyBusinessLicenseList: [],
        approvalFileList: [],
      },
      rulesCompanyFrom: {
        companyNameEn: [{ required: true, message: '请输入公司中文名称', trigger: 'blur' }],
        companyNameZh: [{ required: true, message: '请输入公司英文名称', trigger: 'blur' }],
        // companyBusinessLicenseList: [{ required: true, message: "请上传营业执照", trigger: "change" }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        this.companyFrom.companyNameEn = this.companyNameEn;
        this.companyFrom.companyNameZh = this.companyNameZh;
        return this.modifyCompanyDialog;
      },
      set(val) {
        this.$emit('update:modifyCompanyDialog', val);
      },
    },
  },
  created() {},
  methods: {
    closeCompany() {
      this.companyFrom.companyBusinessLicenseList = [];
      this.companyFrom.approvalFileList = [];
      this.companyFrom.companyNameEn = '';
      this.companyFrom.companyNameZh = '';
      this.$refs['companyFrom'].resetFields();
    },
    submitCompanyInfo() {
      this.$refs.companyFrom.validate((valid) => {
        if (valid) {
          changeCompanyName({
            workId: this.workId,
            companyNameEn: this.companyFrom.companyNameEn,
            companyNameZh: this.companyFrom.companyNameZh,
            companyBusinessLicense: this.companyFrom.companyBusinessLicenseList.length ? this.companyFrom.companyBusinessLicenseList.map((v) => v.url).join(',') : '',
            approvalFile: this.companyFrom.approvalFileList.length ? this.companyFrom.approvalFileList[0].url : '',
          })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success('修改成功');
                this.dialogvisible = false;
                this.$emit('refresh');
              }
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-textarea {
  width: 300px;
}
</style>
