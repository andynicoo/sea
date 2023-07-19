<template>
  <el-dialog title="修改首次申报月份" :visible.sync="dialogvisible" center width="400px" @close="closeModel">
    <el-form ref="form" :rules="rules" :model="form" label-width="140px">
      <el-form-item label="首次报税月份：" prop="firstMonth">
        <el-date-picker v-model="form.firstMonth" type="date" value-format="yyyy-MM-dd HH:mm:ss" style="width: 200px"> </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="text-danger">注意:1;指客户在本系统首次申报的月份</div>
    <div class="text-danger">2.此修改不影响服务截止时间，若服务截止时间变动，单独修改服务截止时间</div>
    <div slot="footer" style="text-align: center">
      <el-button style="width: 65px" type="default" @click="dialogvisible = false">取消</el-button>
      <el-button style="width: 65px" type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { firstMonth } from '@/api/newApi/taxServices/taxNumDeclare.js';
export default {
  props: {
    changeFirstMonthDialog: Boolean,
    workId: String,
    month: String,
  },
  data() {
    return {
      form: {
        firstMonth: '',
      },
      rules: {
        firstMonth: [{ required: true, message: '请选择首次报税月份', trigger: 'change' }],
      },
    };
  },
  watch: {
    month: {
      handler(val) {
        this.form.firstMonth = val;
      },
      immediate: true,
    },
  },
  computed: {
    dialogvisible: {
      get() {
        return this.changeFirstMonthDialog;
      },
      set(val) {
        this.$emit('update:changeFirstMonthDialog', val);
      },
    },
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          firstMonth({
            ...this.form,
            workId: this.workId,
          }).then((res) => {
            this.$message.success('修改成功');
            this.$emit('refresh');
            this.dialogvisible = false;
          });
        }
      });
    },
    closeModel() {
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style></style>
