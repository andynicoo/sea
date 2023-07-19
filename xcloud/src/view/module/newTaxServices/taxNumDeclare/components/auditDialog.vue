<template>
  <!-- 审核税金弹窗 -->
  <el-dialog title="审核税金" :visible.sync="dialogvisible" width="460px" center>
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="审核：" prop="isPass">
        <el-radio-group v-model="form.isPass">
          <el-radio :label="true">通过，确认税金到账</el-radio>
          <!-- <el-radio :label="false">税金有误，驳回</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <template v-if="form.isPass === false">
        <div style="margin-bottom: 20px">
          <span>当前申报进度： </span><span>{{ (rejectNode || '').split(':')[0] }}</span>
        </div>
        <div style="margin-bottom: 20px">
          <span>更改为： </span><span>{{ (rejectNode || '').split(':')[1] }}</span>
        </div>
        <el-form-item label="驳回原因：" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入驳回原因" clearable type="textarea" style="width: 400px" />
        </el-form-item>
        <el-form-item label="发送短信给客户：" prop="isSendMessage">
          <el-radio-group v-model="form.isSendMessage">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <template v-if="['IT', 'FR'].includes(countryCode)">
        <el-form-item>
          <el-checkbox v-model="form.isApiDeclare">API提交注册申报（如未选择API申报，则需要线下进行申报处理）</el-checkbox>
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { taxAudit } from '@/api/newApi/taxServices/taxNumDeclare.js';
export default {
  props: {
    auditDialog: Boolean,
    id: String,
    rejectNode: String,
    getserviceDetail: {
      type: Function,
      default: null,
    },
    countryCode: String,
  },
  data() {
    return {
      form: {
        isPass: true,
        isApiDeclare: false,
        // isSendMessage:false
      },
      rules: {
        isPass: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
        reason: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.auditDialog;
      },
      set(val) {
        this.$emit('update:auditDialog', val);
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
      taxAudit({
        ...this.form,
        id: this.id,
      })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('审核成功');
            this.getserviceDetail();
          }
        })
        .catch((err) => {
          this.$message(err.message);
        });
    },
  },
};
</script>

<style></style>
