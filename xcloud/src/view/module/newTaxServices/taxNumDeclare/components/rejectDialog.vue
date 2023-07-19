<template>
  <el-dialog title="驳回进度" :visible.sync="dialogvisible" width="460px" center>
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <div style="margin-bottom: 20px">
        <span>当前申报进度： </span><span>{{ (rejectNode || '').split(':')[0] }}</span>
      </div>
      <div style="margin-bottom: 20px">
        <span>更改为： </span><span>{{ (rejectNode || '').split(':')[1] }}</span>
      </div>
      <el-form-item label="驳回原因" prop="reason">
        <el-input v-model="form.reason" placeholder="请输入驳回原因：" clearable size="small" type="textarea" style="width: 400px" />
      </el-form-item>
      <el-form-item label="示例文件：" prop="sampleFile">
        <UploadFileUrl :fileList.sync="form.sampleFile" />
      </el-form-item>
      <el-form-item label="发短信给客户：" prop="notice">
        <el-radio-group v-model="form.notice">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import UploadFileUrl from '@/components/UploadFileUrl/index';
import { doReject } from '@/api/newApi/taxServices/taxNumDeclare.js';
export default {
  props: {
    rejectDialog: Boolean,
    workId: String,
    rejectNode: String,
    getserviceDetail: {
      type: Function,
      default: null,
    },
  },
  components: {
    UploadFileUrl,
  },
  data() {
    return {
      formLabelWidth: '120px',
      form: {
        notice: true,
        reason: '',
        sampleFile: '',
      },
      rules: {
        reason: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }],
        notice: [{ required: true, message: '请选择是否发短信给客户', trigger: 'change' }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.rejectDialog;
      },
      set(val) {
        this.$emit('update:rejectDialog', val);
      },
    },
  },
  created() {},
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
      doReject({
        ...this.form,
        workId: this.workId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('驳回成功');
          this.getserviceDetail();
        } else {
          this.$message.error('驳回失败');
        }
      });
    },
  },
};
</script>

<style></style>
