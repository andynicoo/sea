<template>
  <el-dialog
    title="上传零申报凭证"
    :visible.sync="dialogvisible"
    width="500px"
    center
  >
    <div class="block-wrapper">
      <div v-for="(item, index) in 5" :key="index">
        <el-descriptions :column="1">
          <el-descriptions-item label="驳回人">kooriookami</el-descriptions-item>
          <el-descriptions-item label="驳回原因">4533</el-descriptions-item>
          <el-descriptions-item label="驳回时间">2020-10-10 11:11:22</el-descriptions-item>
        </el-descriptions>
        <el-divider></el-divider>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    rejectReasonDialog: Boolean,
    id: String,
  },
  data() {
    return {
      formLabelWidth: "120px",
      form: {
        num: "",
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.rejectReasonDialog;
      },
      set(val) {
        this.$emit("update:rejectReasonDialog", val);
      },
    },
  }
};
</script>

<style lang="scss" scoped>
.block-wrapper {
  height: 400px;
  overflow: auto;
}
.block {
  border-bottom: 1px solid #ddd;
  margin-bottom: 12px;
}
</style>
