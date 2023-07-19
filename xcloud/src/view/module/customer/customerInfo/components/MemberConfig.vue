<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="会员账号">
        {{ ids }}
      </el-form-item>
      <el-form-item label="当前积分">
        {{ integral }}
      </el-form-item>
      <el-form-item label="累计积分">
        {{ sumIntegral }}
      </el-form-item>
      <el-form-item label="调整方式">
        <el-radio-group v-model="form.opt">
          <el-radio :label="true">增加</el-radio>
          <el-radio :label="false">减少</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="调整数额">
        <el-input-number v-model="form.integral" :min="1" :max="999999"></el-input-number>
      </el-form-item>
      <el-form-item label="描写说明">
        <el-input type="textarea" v-model="form.remarks" placeholder="平台赠送积分" :autosize="{ minRows: 3, maxRows: 5 }"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :disabled="submiting" :loading="submiting">保存</el-button>
        <el-button @click="closeModal">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { optAdminUserIntegral } from '@/api/newApi/customer/customerInfo.js';
export default {
  data() {
    return {
      userId: this.$route.query.userId,
      form: {
        integral: 0,
        opt: true,
        remarks: '',
      },
      submiting: false,
    };
  },
  props: {
    integral: {
      default: 0,
      type: Number,
    },
    sumIntegral: {
      default: 0,
      type: Number,
    },
    ids: {
      default: '',
      type: String,
    },
  },
  methods: {
    async onSubmit() {
      console.log('submit!');
      this.submiting = true;
      await optAdminUserIntegral({
        enterpriseId: this.$route.query.enterpriseId,
        userId: this.$route.query.userId,
        integral: this.form.integral,
        opt: this.form.opt,
        remarks: this.form.remarks,
      })
        .then((res) => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '调整成功！',
            });
            this.$emit('resetPage', true);
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
            this.submiting = false;
          }
        })
        .catch(() => {
          this.submiting = false;
        });
    },
    closeModal() {
      this.$emit('resetPage', false);
    },
  },
};
</script>
