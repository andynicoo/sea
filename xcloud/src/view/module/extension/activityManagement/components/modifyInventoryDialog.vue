<template>
  <el-dialog title="修改库存" :visible.sync="dialogvisible" width="500px" center @close="reset" destroy-on-close>
    <el-form :model="form" inline ref="form" :rules="rules">
      <el-form-item prop="num" label="库存数:">
        <el-input-number v-model="form.num" controls-position="right" :max="99999999999" :min="-99999999999" :step="1" :step-strictly="true" placeholder="正数为增加库存，负数为减库存" clearable style="width: 350px" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit" :loading="loading">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateStockApi } from '@/api/newApi/extension/activity.js';
export default {
  props: {
    modifyInventoryDialog: Boolean,
    rowData: Object,
  },
  data() {
    return {
      loading: false,
      form: {
        num: undefined,
      },
      rules: {
        num: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
      },
    };
  },

  computed: {
    dialogvisible: {
      get() {
        return this.modifyInventoryDialog;
      },
      set(val) {
        this.$emit('update:modifyInventoryDialog', val);
      },
    },
  },
  mounted() {},
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let data = {
            batchNo: this.rowData.batchNo,
            marketingActivityId: this.rowData.marketingActivityId,
            num: this.form.num,
            productInfoId: this.rowData.id,
          };
          updateStockApi(data)
            .then((res) => {
              if (res.code === 0) {
                this.$message.success('修改成功');
                this.$emit('update:modifyInventoryDialog', false);
                this.$emit('refresh');
              } else {
                this.$message.error(res.msg);
              }
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    // 重置
    reset() {
      if (this.$refs.form) {
        this.selectedAllList = [];
        this.selected = [];
        this.$refs.form.resetFields();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>
