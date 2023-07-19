<template>
  <el-dialog title="提示" center :visible.sync="dialogvisible" width="600px">
    <p>{{ tipMessage }}</p>
    <div slot="footer">
      <el-button type="default">
        <el-link type="primary" :underline="false" target="_blank" href="https://file.itaxs.com/dev/20230529/0135e1cb85f64b159fd13fc3af7babc4.png">查看示例</el-link>
      </el-button>
      <el-button type="default">
        <el-link type="primary" :underline="false" target="_blank" href="https://file.itaxs.com/dev/20230704/0069850469d4436dbbed93b6cfd48659.jpg">下载教程</el-link>
      </el-button>
      <el-button type="primary" @click="dialogvisible = false">重新上传</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    showTipDialog: Boolean,
    tipMessage: String,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.showTipDialog;
      },
      set(val) {
        this.$emit('update:showTipDialog', val);
      },
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-link {
  font-size: 12px;
  margin: 0;
}
</style>
