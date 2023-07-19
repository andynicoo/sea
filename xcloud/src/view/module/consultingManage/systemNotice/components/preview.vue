<template>
  <div>
    <div class="ope-header-wrapper">
      <div class="ope-header-item">
        <el-link :underline="false" class="back-wrapper" @click="back" v-show="!showBtn">
          <i class="el-icon-arrow-left back"></i>返回列表
        </el-link>
      </div>
      <div class="title ope-header-item">预览弹窗</div>
      <div class="btn-wrapper ope-header-item">
        <div v-show="showBtn">
          <el-button @click="continueEdit"> 继续编辑 </el-button>
          <el-button type="primary" @click="submit"> 发布并停用其他弹窗 </el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <div class="dialog-wrapper">
        <div class="dialog-title">{{ noticeInfo.title }}</div>
        <i class="el-icon-close close-icon"></i>
        <div class="dialog-content" v-html="content"></div>
        <div class="dialog-footer">
          <el-button type="primary">我已知悉</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    formData: Object,
    showBtn: Boolean,
  },
  data() {
    return {
      id: this.$route.query.id || 0,
      noticeInfo: {},
    };
  },
  watch: {
    formData: {
      handler(val) {
        if (val) {
          this.noticeInfo = val;
        }
      },
      deep: true,
    },
  },
  computed: {
    content() {
      return (this.noticeInfo.content || "").replaceAll("<img", '<img style="max-width: 100%"');
    },
  },
  methods: {
    continueEdit() {
      this.$emit("addOrEdit");
    },
    submit() {
      this.$emit("publish", this.noticeInfo);
    },
    back() {
      this.$emit("back");
    },
  },
};
</script>

<style lang="less" scoped>
.app-container {
  margin: 10px;
  padding: 30px 20px;
  height: calc(100vh - 205px);
  background-color: #fff;
}
.ope-header-item {
  flex: 1;
}
.back-wrapper {
  .back {
    margin-right: 6px;
  }
}
.btn-wrapper {
  text-align: right;
}
.title {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  text-align: center;
  justify-content: center;
}
.dialog-wrapper {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 460px;
  border-radius: 10px;
  border: 1px solid dddddd;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
  .dialog-title {
    font-size: 16px;
    color: #333;
    font-weight: 600;
    padding: 22px 30px 22px 35px;
    border-bottom: solid 1px #dddddd;
  }
  .close-icon {
    position: absolute;
    top: 25px;
    right: 16px;
    font-size: 16px;
  }
  .dialog-content {
    font-size: 14px;
    color: #666;
    word-break: break-all;
    margin: 25px 25px 30px;
    max-height: 200px;
    overflow-y: auto;
  }
  .dialog-footer {
    padding: 0px 30px 30px 30px;
    text-align: center;
  }
}
</style>
