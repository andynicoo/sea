<template>
  <el-dialog :title="systemNoticeInfo.title" :visible.sync="dialogVisible" width="460px" center>
    <div class="system-notice-content" v-html="$Base64.decode(systemNoticeInfo.content || '')"></div>
    <span slot="footer">
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">我已知悉</el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
import { getSysAnnouncementIng } from "@/api/newApi/consultingCenter/systemNotice";
export default {
  props: {
    systemNoticeDialog: Boolean,
  },
  computed: {
    dialogVisible: {
      get() {
        return this.systemNoticeDialog;
      },
      set(val) {
        this.$emit("update:systemNoticeDialog", val);
      },
    },
  },
  created() {
    this.getSystemNoticeInfo();
  },
  data() {
    return {
      isEnter: true,
      systemNoticeInfo: {},
    };
  },
  methods: {
    // 获取公告信息
    getSystemNoticeInfo() {
      let isEnter = this.isEnter;
      if (this.isEnter) {
        this.isEnter = false;
      }
      getSysAnnouncementIng().then((res) => {
        if (res.code === 0) {
          this.systemNoticeInfo = res.data;
          // 没有公告
          if (!(res.data && res.data.title)) {
            // 点击公告按钮
            if (!isEnter) {
              this.$message.warning("暂无系统公告");
            }
          } else {
            // 有公告
            // 初次加载页面且公告已读不弹窗
            if (!(isEnter && res.data.isRead)) {
              this.dialogVisible = true;
            }
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.system-notice-content {
  max-height: 200px;
  overflow-y: auto;
}
.dialog-footer {
  text-align: center !important;
}
::v-deep .el-dialog .el-dialog__header {
  height: auto;
  .el-dialog__title {
    line-height: 20px;
  }
}
</style>
