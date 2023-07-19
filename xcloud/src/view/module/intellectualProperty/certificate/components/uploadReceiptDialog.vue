<template>
  <el-dialog
    title="上传授权回执"
    :visible.sync="dialogvisible"
    width="460px"
    center
    @close="reset"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="85px"
    >
      <el-form-item label="上传回执" prop="fileStr">
        <UploadFileUrl :fileList.sync="form.fileStr" fileClass uploadText="上传PDF文件" accept=".pdf" :showTip="false" />
      </el-form-item>
      <el-form-item label="官方日期" prop="officeDate">
        <el-date-picker
          v-model="form.officeDate"
          type="date"
          :clearable="false"
          placeholder="请选择官方日期"
          value-format="yyyy-MM-dd 00:00:00"
          style="width: 200px"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small"
        >取消</el-button
      >
      <el-button
        type="primary"
        size="small"
        @click="submit"
        >确认</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import {uploadAuthorizationReceiptFile} from '@/api/newApi/intellectualProperty/certificate'
import UploadFileUrl from "@/components/UploadFileUrl/index";
export default {
  props: {
    uploadReceiptDialog: Boolean,
    workOrderId: String,
  },
  components: {
    UploadFileUrl
  },
  data() {
    return {
      form: {
        fileStr: '',
        officeDate: ''
      },
      rules: {
        fileStr: [{required: true, message: '请上传回执', trigger: 'change'}],
        officeDate: [{required: true, message: '请选择官方日期', trigger: 'change'}],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.uploadReceiptDialog;
      },
      set(val) {
        this.$emit("update:uploadReceiptDialog", val);
      },
    },
  },
  methods: {
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      uploadAuthorizationReceiptFile({
        ...this.form,
        workOrderId: this.workOrderId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('提交成功');
          this.$emit("refresh");
        }
      });
    },
    reset() {
      if(this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
  },
};
</script>

<style></style>
