<template>
  <el-dialog title="完成续费" :visible.sync="dialogvisible" width="660px" center @close="reset">
    <el-form :model="form" ref="form" :rules="rules" label-width="130px">
      <el-form-item label="证书有效年份：" prop="eprEffectiveDate">
        <el-date-picker disabled v-model="form.eprEffectiveDate" type="date" :clearable="false" placeholder="请选择证书有效年份" value-format="yyyy-MM-dd 00:00:00" style="width: 200px"></el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { renewComplete } from '@/api/newApi/workOrder/eprRenewal';
export default {
  props: {
    completeDialog: Boolean,
    serviceId: String,
    eprEffectiveDate: String,
  },
  data() {
    return {
      form: {
        eprEffectiveDate: '',
      },
      rules: {
        eprEffectiveDate: [{ required: true, message: '请选择证书有效年份', trigger: 'change' }],
      },
    };
  },
  components: {
    // UploadFileUrl,
  },
  computed: {
    dialogvisible: {
      get(val) {
        if (val && this.eprEffectiveDate) {
          this.form.eprEffectiveDate = this.eprEffectiveDate;
        }
        return this.completeDialog;
      },
      set(val) {
        this.$emit('update:completeDialog', val);
      },
    },
  },
  watch: {},
  methods: {
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    submit() {
      console.log(this.form);
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
      let data = {
        serviceId: this.serviceId,
        eprEffectiveDate: this.form.eprEffectiveDate,
      };
      renewComplete(data).then((res) => {
        if (res.code === 0) {
          this.$message.success('操作成功');
          this.$emit('refresh');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.warn-title {
  color: #444;
  font-weight: 800;
  margin-right: 50px;
}
.warn-font {
  color: #ffd2b3;
}

.mb-15 {
  margin-bottom: 15px;
}
</style>
