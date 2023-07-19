<template>
  <el-dialog title="审核使用证据" :visible.sync="visible" :destroy-on-close="true" @close="cancel" @closed="resetForm('form')" width="30%">
    <el-form :model="form" ref="form" label-width="100px">
      <el-form-item label="审核：" prop="path">
        <el-radio-group v-model="form.path">
          <el-radio :label="1">审核通过</el-radio>
          <el-radio :label="0">审核不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="reasonShow" label="驳回原因：" prop="reason" :rules="{ required: true, message: '请输入驳回原因', trigger: 'blur' }">
        <el-input type="textarea" :maxlength="500" placeholder="请输入驳回原因" v-model="form.reason"></el-input>
      </el-form-item>
      <el-form-item v-else label="备注：" prop="remark">
        <el-input type="textarea" :maxlength="500" placeholder="输入备注" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="短信：" prop="sendSms" v-if="+form.path === 0">
        <el-radio-group v-model="form.sendSms">
          <el-radio :label="1">通知用户</el-radio>
          <el-radio :label="0">不通知用户</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">确认</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { updateNodeAPI } from '@/api/newApi/intellectualProperty/trademark.js';
export default {
  props: {
    serviceId: String,
    nodeCode: String,
  },
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        // 审核 1 审核通过 0 审核不通过
        path: 1,
        // 备注
        remark: '',
        // 驳回原因
        reason: '',
        // 1 通知用户 0 不通知用户
        sendSms: 1,
      },
      rules: {},
    };
  },
  computed: {
    reasonShow() {
      return +this.form.path === 0;
    },
  },
  methods: {
    getData() {
      this.loading = false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    show() {
      this.getData();
      this.visible = true;
    },
    cancel() {
      this.resetForm('form');
      this.visible = false;
    },
    submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let key = +this.form.path === 1 ? 'operateLogRemark' : 'operateLogoperateReason';
          let params = {
            json: { [key]: +this.form.path === 1 ? this.form.remark : this.form.reason },
            nodeCode: this.nodeCode,
            serviceId: this.serviceId,
            path: this.form.path == 1,
            sendSms: this.form.sendSms,
          };
          updateNodeAPI(params).then((res) => {
            try {
              this.loading = true;
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功',
                });
                this.$emit('update');
              }
            } finally {
              this.loading = false;
              this.cancel();
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.text {
  &-tips {
    margin-left: 82px;
    color: #999999bf;
    font-size: 12px;
  }
}
.select-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.text-money {
  margin: 0 0 19px 82px;
  span {
    margin-left: 20px;
  }
}

.inner-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  i {
    font-size: 60px;
    color: #52c41a;
  }
}
</style>
