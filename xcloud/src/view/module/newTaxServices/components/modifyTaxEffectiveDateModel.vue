<template>
  <!-- 修改税号生效时间 -->
  <el-dialog title="修改税号生效日期" :visible.sync="dialogvisible" width="600px" @close="closeModal">
    <el-form label-width="120px" :model="form" ref="form" :rules="rules">
      <el-form-item label="税号生效日期：" prop="taxEffectiveDate">
        <el-date-picker v-model="form.taxEffectiveDate" type="date" placeholder="请选择税号生效日期" style="width: 300px" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>

      <el-form-item label="税号文件：" prop="vatTaxNumberFileList">
        <UploadFile :fileClass="true" :showTip="true" :fileList.sync="form.vatTaxNumberFileList"></UploadFile>
      </el-form-item>

      <!-- <el-form-item label="下一次申报周期：" prop="time">
          <el-date-picker v-if=" ['SA', 'AE'].includes(countryCode)" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 250px" value-format="yyyy-MM-dd HH:mm:ss" v-model="form.time"></el-date-picker>
          <el-date-picker v-else v-model="form.time" type="monthrange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份">
          </el-date-picker>
        </el-form-item> -->

      <el-form-item label="审批截图：">
        <UploadFile :fileClass="true" :accept="'.jpg,.png,.jpge,.gif'" :maxSize="30" :fileList.sync="form.approvalFileList"></UploadFile>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: right">
      <el-button style="width: 65px" type="default" @click="dialogvisible = false">取消</el-button>
      <el-button style="width: 65px" type="primary" @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { changeVatInfo } from '@/api/newApi/taxServices/serviceManage.js';
import UploadFile from '@/components/UploadFile'; // 上传文件组件
// import moment from "moment";
export default {
  props: {
    modifyTaxEffectiveDateDialog: Boolean,
    workId: [String, Number],
    countryCode: String,
    taxEffectiveDate: String,
    // beginTime: String,
    // endTime: String,
    vatTaxNumberFile: String,
    getWorkOrderDetail: { type: Function },
  },
  components: { UploadFile },
  data() {
    return {
      form: {
        taxEffectiveDate: '',
        approvalFileList: [],
        vatTaxNumberFileList: [],
      },
      declareList: [],
      rules: {
        taxEffectiveDate: [{ required: true, message: '请选择税号生效日期', trigger: 'change' }],
        vatTaxNumberFileList: [{ required: true, message: '请上传税号文件', trigger: 'change' }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.modifyTaxEffectiveDateDialog;
      },
      set(val) {
        this.$emit('update:modifyTaxEffectiveDateDialog', val);
      },
    },
  },
  watch: {
    dialogvisible(val) {
      if (val) {
        this.form.taxEffectiveDate = this.taxEffectiveDate;
        // this.form.beginTime = this.beginTime
        // this.form.endTime = this.endTime
        if (this.vatTaxNumberFile) {
          this.form.vatTaxNumberFileList = [{ url: this.vatTaxNumberFile, name: this.vatTaxNumberFile.substr(this.vatTaxNumberFile.lastIndexOf('/') + 1) }];
        }
      }
    },
  },
  created() {},
  methods: {
    closeModal() {
      this.form.approvalFileList = [];
      this.form.taxEffectiveDate = '';
      this.$refs['form'].resetFields();
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // let beginTime = "";
          // let endTime = "";
          // if (this.countryCode != "AE" && this.countryCode != "SA") {
          //   beginTime = this.form.time[0] + " 00:00:00";
          //   endTime = moment(this.form.time[1]).endOf("month").format("YYYY-MM-DD") + " 00:00:00";
          // } else {
          //   beginTime = this.form.time[0];
          //   endTime = this.form.time[1];
          // }
          // console.log('??')
          changeVatInfo({
            isUpdate: true,
            workId: this.workId,
            taxEffectiveDate: this.form.taxEffectiveDate,
            // beginTime,
            // endTime,
            approvalFile: this.form.approvalFileList.length ? this.form.approvalFileList[0].url : '',
            vatTaxNumberFile: this.form.vatTaxNumberFileList.map((v) => v.url).join(','),
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
/deep/ .el-input {
  width: 250px;
}
</style>
