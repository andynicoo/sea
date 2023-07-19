<template>
  <el-dialog
    title="修改官方文件"
    :visible.sync="dialogvisible"
    width="460px"
    center
    @close="reset"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="110px"
    >
      <el-form-item label="文件类型" prop="status">
        审查意见OA
      </el-form-item>
      <el-form-item label="上传文件" prop="fileStr">
        <UploadFileUrl :fileList.sync="form.fileStr" fileClass hiddenUpload uploadText="上传文件" :maxSize="5" initTip="文件限制：文件大小不超过5M" :showTip="false" />
      </el-form-item>
      <el-form-item label="官方开始日期" prop="officeStartDate">
        <el-date-picker
          v-model="form.officeStartDate"
          type="date"
          :clearable="false"
          placeholder="请选择官方开始日期"
          value-format="yyyy-MM-dd 00:00:00"
          style="width: 200px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="官方结束日期" prop="officialExpirationDate">
        <el-date-picker
          v-model="form.officialExpirationDate"
          type="date"
          :clearable="false"
          placeholder="请选择官方结束日期"
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
import { OAPatentUpdateOfficialFile } from "@/api/newApi/intellectualProperty/OAAppearancePatent";
import UploadFileUrl from "@/components/UploadFileUrl/index";
export default {
  props: {
    modifyDialog: Boolean,
    checkItem: Object,
    workOrderId: String,
  },
  data() {
    return {
      form: {
        fileStr: '',
        officeStartDate: '',
        officialExpirationDate: '',
      },
      rules: {
        fileStr: [{required: true, message: '请上传回执', trigger: 'change'}],
        officeStartDate: [{required: true, message: '请选择官方开始日期', trigger: 'change'}],
        officialExpirationDate: [{required: true, message: '请选择官方结束日期', trigger: 'change'}],
      },
    };
  },
  components: {
    UploadFileUrl
  },
  computed: {
    dialogvisible: {
      get() {
        return this.modifyDialog;
      },
      set(val) {
        this.$emit("update:modifyDialog", val);
      },
    },
  },
  watch: {
    checkItem() {
      this.form.fileStr = this.checkItem.officialFile
      this.form.officeStartDate = this.checkItem.officeStartDate.split(' ')[0] + ' 00:00:00'
      this.form.officialExpirationDate = this.checkItem.officialExpirationDate.split(' ')[0] + ' 00:00:00'
    }
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
      OAPatentUpdateOfficialFile({
        ...this.form,
        workOrderId: this.workOrderId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('修改成功');
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
