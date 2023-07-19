<template>
  <el-dialog title="替换授权书" :visible.sync="dialogvisible" width="600px" center @close="reset">
    <DynamicForm ref="dynamicForm" :moduleList="authorizeFileInfo" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="formSave">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
export default {
  props: {
    updateAuthorizationDialog: Boolean,
    workOrderId: String,
    authorizeFileInfo: Array,
  },
  components: {
    DynamicForm,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.updateAuthorizationDialog;
      },
      set(val) {
        this.$emit('update:updateAuthorizationDialog', val);
      },
    },
  },
  data() {
    return {
      rules: {},
    };
  },
  created() {},
  methods: {
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    formSave() {
      this.$refs.dynamicForm.onSubmit().then((material) => {
        workOrderCommonOperator('replaceAuthTemplate', {
          workOrderId: this.workOrderId,
          material: material,
        }).then((res) => {
          if (res.code === 0) {
            this.dialogvisible = false;
            this.$message.success('提交成功');
            this.$emit('refresh');
          }
        });
      });
    },
  },
};
</script>

<style></style>
