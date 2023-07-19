<template>
  <div>
    <el-form
      label-position="right"
      label-width="100px"
      :rules="formRule"
      :model="imgFrom"
      ref="addmerchantimg"
    >
      <el-form-item label="商品图片" prop="imgUrl">
        <UploadImage
          ref="uploadImageRef"
          :imageUrl="imgFrom.imgUrl[0].imgUrl"
          :imgType="1"
          :on-success="uploadSuccess"
          upload-tips="上传图片"
        >
        </UploadImage>
      </el-form-item>

      <el-form-item label="服务详情" prop="mutilText">
        <!-- <vue-ueditor-wrap
                    v-model="service"
                    :config="editorConfig"
                    editor-id="editor-demo-01"
                ></vue-ueditor-wrap> -->
        <UploadImage
          ref="uploadImageRef"
          :imageUrl="imgFrom.mutilText"
          :imgType="1"
          :on-success="uploadSuccess1"
          upload-tips="上传图片"
        >
        </UploadImage>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          size="small"
          @click="commitNextStep(imgInfo.to)"
        >
          <!-- {{ imgInfo.to == 3 ? "提交" : "下一步" }} -->
          {{
            showflag == "pcflag"
              ? "提交"
              : showflag == "h5flag"
              ? "提交"
              : imgInfo.to == 3
              ? "提交"
              : "下一步"
          }}
        </el-button>
        <el-button type="cancel" size="small" @click="preStep(imgInfo.from)">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import UploadImage from "@/components/UploadImage/index.vue";
export default {
  components: {
    UploadImage,
  },
  props: {
    imgFrom: {
      type: Object,
    },
    imgInfo: {
      type: Object,
    },
    target: {
      type: Array,
    },
  },
  watch: {
    "imgFrom.isNeed": function (newval) {
      this.formRule.imgUrl[0].required = newval;
      this.formRule.mutilText[0].required = newval;
    },
  },
  data() {
    return {
      formRule: {
        imgUrl: [{ required: false, message: "请上传图片", trigger: "blur" }],
        mutilText: [
          { required: false, message: "请上传图片", trigger: "blur" },
        ],
      },
      editorConfig: {
        // 访问 UEditor 静态资源的根路径，可参考 https://hc199421.gitee.io/vue-ueditor-wrap/#/faq
        UEDITOR_HOME_URL: "/UEditor/",
        // 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: "//ueditor.szcloudplus.com/cos",
      },
      showflag: "",
    };
  },
  created() {
    if (this.target.length == 1 && this.target.includes(1)) {
      this.showflag = "pcflag";
    } else if (this.target.length == 1 && this.target.includes(2)) {
      this.showflag = "h5flag";
    } else if (this.target.length > 1 && this.target.includes(1, 2)) {
      this.showflag = "all";
    }
  },
  methods: {
    uploadSuccess(v) {
      this.imgFrom.imgUrl[0] = {
        imgUrl: v.file.fileUrl,
        sort: 0,
      };
    },
    uploadSuccess1(v) {
      this.imgFrom.mutilText = v.file.fileUrl;
    },
    commitNextStep(step) {
      if (this.showflag == "pcflag" || this.showflag == "h5flag") {
        step = 3;
      } else {
        step = step;
      }

      if (step == 2) {
        //下一步
        this.$refs["addmerchantimg"].validate((valid) => {
          if (valid) {
            this.$emit("update:imgFrom", this.imgFrom);
            this.$emit("nextStep", step);
          }
        });
      } else {
        this.$emit("nextStep", step);
      }
    },
    //
    preStep(step) {
      if (this.showflag == "pcflag" || this.showflag == "h5flag") {
        step = 0;
      } else {
        step = step;
      }
      this.$emit("nextStep", step);
    },
  },
};
</script>

<style lang='scss' scoped>
</style>