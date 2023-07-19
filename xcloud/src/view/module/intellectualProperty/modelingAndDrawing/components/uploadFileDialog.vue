<template>
  <el-dialog :title="uploadText" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <div style="margin-bottom: 20px">确认{{ uploadText }}并提交审核？</div>
    <el-form :model="form" :rules="rules" ref="form" label-width="85px">
      <el-form-item label="绘图类型" prop="drawingType" v-if="cureentNodeCode === progressBarObj.DRAWING">
        <el-select placeholder="选择专利图纸出图方式" size="small" style="width: 200px" clearable filterable v-model="form.drawingType">
          <el-option :value="item.value" :label="item.label" v-for="item in typeList" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传文件" prop="fileStr">
        <UploadFileUrl :fileList.sync="form.fileStr" fileClass :maxSize="100" uploadText="上传文件" accept=".zip,.rar,.pdf" initTip="支持拓展格式：zip、rar、pdf" :showTip="false" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { modelUpload } from '@/api/newApi/intellectualProperty/modelingAndDrawing';
import UploadFileUrl from '@/components/UploadFileUrl/index';
import { progressBarObj } from '../enumObj';
export default {
  props: {
    uploadFileDialog: Boolean,
    serviceId: String,
    uploadText: String,
    cureentNodeCode: String,
  },
  data() {
    return {
      form: {
        fileStr: '',
        drawingType: '',
      },
      rules: {
        drawingType: [{ required: true, message: '请选择绘图类型', trigger: 'change' }],
        fileStr: [{ required: true, message: '请上传文件', trigger: 'change' }],
      },
      progressBarObj,
      typeList: [
        { label: '线图', value: 1 },
        { label: '渲染', value: 2 },
        { label: '拍照', value: 3 },
      ],
    };
  },
  components: {
    UploadFileUrl,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.uploadFileDialog;
      },
      set(val) {
        this.$emit('update:uploadFileDialog', val);
      },
    },
  },
  methods: {
    submit() {
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
      modelUpload({
        ...this.form,
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('上传成功');
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
