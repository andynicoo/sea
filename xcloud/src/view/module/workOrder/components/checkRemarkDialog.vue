<template>
  <el-dialog
    title="备注信息"
    :visible.sync="dialogvisible"
    width="494px"
    center
  >
    <div class="content">
      <div v-for="(item, index) in remarkList" :key="index" class="content-block">
        <div class="block-item">
          <div class="block-item-title">备注人：</div>
          <div>{{item.createUserName}}</div>
        </div>
        <div class="block-item">
          <div class="block-item-title">内容：</div>
          <div>{{item.content}}</div>
        </div>
        <div class="block-item">
          <div class="block-item-title">时间：</div>
          <div>{{item.remarkTime}}</div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogvisible = false" size="small">关闭</el-button>
      <!-- <el-button @click="dialogvisible = false" size="small">取消</el-button> -->
    </span>
  </el-dialog>
</template>

<script>

export default {
  props: {
    checkRemarkDialog: Boolean,
    remarkRecords: String,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.checkRemarkDialog;
      },
      set(val) {
        this.$emit("update:checkRemarkDialog", val);
      },
    },
    remarkList() {
      if(!this.remarkRecords) return []
      return JSON.parse(this.remarkRecords)
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  max-height: 500px;
  overflow-y: auto;
  padding: 0 35px;
  .content-block {
    padding: 20px;
    border: 1px solid #EEEEEE;
    margin-bottom: 20px;
    .block-item {
      display: flex;
      margin-bottom: 10px;
      .block-item-title {
        color: #999;
        width: 60px;
        flex: 0 0 60px;
        white-space: nowrap;
      }
    }
  }
}
</style>
