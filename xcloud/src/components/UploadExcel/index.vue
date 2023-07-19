<template>
  <div class="app-container">
    <div class="upload-container">
      <!-- 导入 -->
      <div class="upload-box">
        <el-upload
          ref="upload"
          class="upload-excel"
          action
          :on-change="onChange"
          :show-file-list="false"
          :limit="2"
          :auto-upload="false"
        >
          <el-button size="small" type="primary">{{ buttonText }}</el-button>
        </el-upload>
      </div>
      <!-- 导入文件的结果 -->
      <div class="file-box" v-if="fileData">
        <div class="file-list">
          <div class="file-info">
            <div class="info-inner">
              <i class="el-icon-paperclip file-icon"></i>
              <span class="file-name">{{ fileData.name }}</span>
              <i
                class="el-icon-close file-remove"
                @click.stop="handleImageRemove"
              ></i>
            </div>
            <el-progress
              :percentage="fileData.percentage"
              color="#48CB88"
              :show-text="true"
              :stroke-width="3"
              :status="fileData.status"
              class="upload-excel-progress"
            ></el-progress>
          </div>
          <transition name="el-fade-in">
            <div class="file-result" v-show="fileData.status == 'success'">
              <i class="el-icon-success text-success"></i>
              导入成功
            </div>
          </transition>
        </div>
      </div>
    </div>

    <div class="footer-container">
      <div>· 请拖拽文件到此区域上传或点击上传</div>
      <div>· 支持扩展名：.doc .docx .pdf .jpg...</div>
    </div>
  </div>
</template>
<script>
import util from "@/utils/util";

export default {
  props: {
    // 显示的按钮名称
    buttonText: { type: String },
    // 上传成功
    onSuccess: { type: Function },
    // 上传失败
    onError: { type: Function },
    // 文件移除
    onRemove: { type: Function },
  },
  data() {
    return {
      // 上传的文件
      fileData: null,
      uploadUrl: this.baseUrl + "/file/oss/upload",
    };
  },
  methods: {
    /**
     * 上传文件前的校验
     */
    beforeUpload(file) {
      console.log("beforeUpload", file);
      let fileType = util.getFileSuffixName(file.name);
      const FILE_TYPE = ["xlsx", "xls"];
      const MAX_SIZE = file.size / 1024 / 1024 < 50;
      // 验证文件类型
      if (!FILE_TYPE.includes(fileType)) {
        this.$message({
          message: "请上传（.xlsx,.xls）格式的excel文件！",
          type: "error",
        });
        return false;
      }
      // 验证文件大小
      if (!MAX_SIZE) {
        this.$message({
          message: "上传Excel文件大小不能超过50M！",
          type: "error",
        });
        return false;
      }
      return true;
    },
    onChange(data) {
      console.log("onChange", data);
      // 校验通过，会组装file数据
      if (this.beforeUpload(data)) {
        this.fileData = {
          name: data.name,
          size: data.size,
          percentage: 0,
          uid: data.uid,
          file: data.raw,
          status: "",
        };
      }
    },
    /**
     * 手动上传
     */
    submit() {
      // 如果没有上传文件，会提示上传个
      if (util.isNull(this.fileData)) {
        this.$message({
          type: "warning",
          message: "请选择要导入的excel文件！",
        });
        return;
      }
      // 如果已经上传过，并且成功了，则会提示清空后再上传
      if (this.fileData && this.fileData.status == "success") {
        this.$message({
          type: "warning",
          message: "该文件已经上传成功，请清空文件后再次上传。",
        });
        return;
      }
      // 请求后台
      let formData = new FormData();
      formData.append("file", this.fileData.file);
      request({
        url: this.uploadUrl,
        method: "post",
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
        onUploadProgress: (event) => {
          let percentage = ((event.loaded / event.total) * 100) | 0;
          console.log(percentage, event);
          this.fileData.percentage = percentage;
        },
      })
        .then((res) => {
          if (res.code == 0) {
            this.fileData.percentage = 100;
            this.fileData.status = "success";
            this.onSuccess(this.fileData);
          } else {
            this.fileData.percentage = 0;
            this.fileData.status = "warning";
            this.onError(this.fileData, res.message);
          }
        })
        .catch((error) => {
          this.fileData.percentage = 0;
          this.fileData.status = "exception";
          this.onError(this.fileData);
        });
    },
    /**
     * 文件移除
     */
    handleImageRemove() {
      this.$refs.upload.clearFiles(); //清除上传文件
      this.onRemove(this.fileData);
      this.fileData = null; //清空选择的文件列表
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  padding: 0px !important;
  margin: 0px !important;
}
.upload-container {
  text-align: left;
  // 上传文件
  .upload-box {
    padding-bottom: 18px;
    .upload-excel {
      display: inline-block;
    }
  }
  //   上传文件列表
  .file-box {
    .file-list {
      display: flex;
      margin-bottom: 10px;
      align-items: center;
      .file-info {
        .info-inner {
          transition: background 0.2s;
          padding: 2px 1px 2px 2px;
          border-radius: 2px;
          &:hover {
            background: #f2f2f3;
          }
        }
        width: 165px;
        .file-icon {
          font-size: 12px;
          color: #00a3ff;
        }
        .file-name {
          font-size: 12px;
          color: #00a3ff;
        }
        .file-remove {
          float: right;
          cursor: pointer;
          transition: all 0.2s;
          &:hover {
            color: #333;
          }
        }
      }
      .file-result {
        margin-left: 10px;
        flex: 1;
        font-size: 12px;
        padding: 8px 12px;
        color: #00a3ff;
        background: #e6f7ff;
        border-radius: 2px;
        border: 1px solid #91d5ff;
      }
    }
  }
}
.footer-container {
  font-size: 14px;
  color: #333333;
  padding-top: 18px;
  border-top: solid 1px #dddddd;
  line-height: 26px;
  padding-bottom: 24px;
}
</style>
<style lang="scss">
.upload-excel-progress {
  // 重新定义进度条宽度
  .el-progress-bar {
    padding-right: 20px;
    margin-right: -25px;
  }
}
</style>
