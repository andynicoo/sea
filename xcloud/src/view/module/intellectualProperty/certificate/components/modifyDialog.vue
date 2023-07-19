<template>
  <el-dialog title="修改授权书" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form" label-width="110px">
      <el-form-item label="文件类型" prop="status"> 授权书 </el-form-item>
      <el-form-item label="上传文件" prop="fileStr">
        <UploadFileUrl :fileList.sync="form.fileStr" fileClass hiddenUpload uploadText="上传文件" :maxSize="5" initTip="文件限制：文件大小不超过5M" :showTip="false" />
      </el-form-item>
      <el-form-item label="官方开始日期" prop="officeDateBegin">
        <el-date-picker v-model="form.officeDateBegin" type="date" :clearable="false" placeholder="请选择官方开始日期" value-format="yyyy-MM-dd 00:00:00" style="width: 200px"></el-date-picker>
      </el-form-item>
      <el-form-item label="官方结束日期" prop="officeDateEnd">
        <el-date-picker v-model="form.officeDateEnd" type="date" :clearable="false" placeholder="请选择官方结束日期" value-format="yyyy-MM-dd 00:00:00" style="width: 200px"></el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateAuthorizationFile } from '@/api/newApi/intellectualProperty/certificate';
import UploadFileUrl from '@/components/UploadFileUrl/index';
export default {
  props: {
    modifyDialog: Boolean,
    detailWorkOrderVO: Object,
    serviceId: String,
  },
  data() {
    return {
      form: {
        fileStr: '',
        officeDateBegin: '',
        officeDateEnd: '',
      },
      rules: {
        fileStr: [{ required: true, message: '请上传回执', trigger: 'change' }],
        officeDateBegin: [{ required: true, message: '请选择官方开启日期', trigger: 'change' }],
        officeDateEnd: [{ required: true, message: '请选择官方结束日期', trigger: 'change' }],
      },
    };
  },
  components: {
    UploadFileUrl,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.modifyDialog;
      },
      set(val) {
        this.$emit('update:modifyDialog', val);
      },
    },
  },
  created() {
    this.form.fileStr = this.detailWorkOrderVO.officialFile;
    this.form.officeDateBegin = this.detailWorkOrderVO.officeDateBegin;
    this.form.officeDateEnd = this.detailWorkOrderVO.officeDateEnd;
  },
  methods: {
    submit() {
      if (+new Date(this.form.officeDateBegin) > +new Date(this.form.officeDateEnd)) {
        this.$message.warning('开始日期不能早于结束日期');
        return;
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      updateAuthorizationFile({
        ...this.form,
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.dialogvisible = false;
          this.$message.success('修改成功');
          this.$emit('refresh');
        }
      });
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
  },
};
</script>

<style></style>
