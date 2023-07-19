<template>
  <div class="app-container">
    <div class="header-container">
      <el-link :underline="false" class="back-wrapper" @click="back">
        <i class="el-icon-arrow-left back"></i>返回列表
      </el-link>
      <div class="fixed-wrapper">
        <el-form :model="form" ref="formRef" :rules="ruleValidate" label-width="80px">
          <el-form-item label="弹窗标题" prop="title">
            <el-input
              v-model="form.title"
              clearable
              maxlength="30"
              show-word-limit
              placeholder="请输入弹窗标题"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item label="弹窗正文" prop="content">
            <Editor :value.sync="form.content"></Editor>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-group">
        <el-button @click="back">取消</el-button>
        <el-button type="primary" @click="preview">预览</el-button>
        <el-button type="primary" @click="submit">发布并停用其他弹窗</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Editor from "@/components/quillEditor/index";
export default {
  props: {
    formData: Object,
  },
  data() {
    return {
      id: this.$route.query.id || 0,
      form: {
        content: "",
        title: "",
      },
      ruleValidate: {
        title: [{ required: true, message: "请输入文字标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    };
  },
  components: {
    Editor,
  },
  watch: {
    formData: {
      handler(val) {
        if (val) {
          this.form = val;
        }
      },
      deep: true,
    },
  },
  methods: {
    submit() {
      this.$refs.formRef.validate((vaild) => {
        if (vaild) {
          this.$emit("publish", this.form);
        }
      });
    },
    preview() {
      this.$refs.formRef.validate((vaild) => {
        if (vaild) {
          this.$emit("preview", this.form);
        }
      });
    },
    back() {
      this.$emit("back");
    },
  },
};
</script>

<style lang="less" scoped>
.back-wrapper {
  margin-bottom: 30px;
  .back {
    margin-right: 6px;
  }
}
.fixed-wrapper {
  height: calc(100vh - 295px);
  overflow-y: auto;
}
.btn-group {
  text-align: center;
  padding: 30px;
  border-top: 1px solid #f0f1f3;
}
</style>
