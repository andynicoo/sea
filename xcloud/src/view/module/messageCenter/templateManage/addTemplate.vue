<template>
  <div class="app-container">
    <div class="header-container">
      <div class="back" @click="navigate()">
        <Icon type="ios-arrow-back" />
        返回列表
      </div>
      <el-form :model="form" ref="formRef" :rules="ruleValidate" label-width="130px">
        <el-form-item label="信件类型" prop="letterType">
          <el-input
            v-model="form.letterType"
            clearable
            placeholder="请输入信件类型"
            style="width: 300px"
            size="small"
            maxlength="20"
            :disabled="Boolean(form.id)"
          />
        </el-form-item>
        <el-form-item label="信件内容" prop="letterContent">
          <el-input
            v-model="form.letterContent"
            type="textarea"
            placeholder="请输入信件内容"
            maxlength="1000"
            :rows="8"
            clearable
            style="width: 600px"
            size="small"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div class="btn-group">
        <el-button size="small" type="primary" @click="submit()"  v-if="hasAuthority('G2_12')">保存</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { addLetterTemplateApi } from "@/api/newApi/messageCenter/letterManage";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      form: {
        letterContent: "",
        letterType: ""
      },
      ruleValidate: {
        letterType: [{ required: true, message: "请选择信件类型", trigger: "blur" }],
        letterContent: [{ required: true, message: "请输入信件内容", trigger: "blur" }]
      }
    };
  },
  created() {
    if (this.$route.params.row) {
      this.form = this.$route.params.row;
    }
  },
  methods: {
    submit() {
      this.$refs.formRef.validate(vaild => {
        if (vaild) {
          this._addTemplateLetter();
        }
      });
    },
    _addTemplateLetter() {
      addLetterTemplateApi(this.form).then(res => {
        this.back();
      });
    },
    ...mapMutations(["closeTag"]),
    back() {
      this.$message.success("操作成功");
      this.closeTag(this.$route);
      this.navigate();
    },
    // 取消
    cancel() {
      this.$confirm(`是否确认取消！`, "提示", {
        customClass: "custom-confirm",
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
        center: true
      }).then(() => {
        this.navigate();
      });
    },
    navigate() {
      this.closeTag(this.$route);
      this.$router.push({
        path: "/messageCenter/templateManage/index"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.header-container {
  height: calc(100vh - 150px);
}
.item-title {
  padding: 0 12px;
}
.back {
  margin-left: 20px;
  margin-bottom: 20px;
  cursor: pointer;
}
.item-tip {
  padding: 0 12px;
  color: #999;
}
.btn-group {
  // text-align: center;
  margin-left: 80px;
  padding: 50px;
}
</style>
