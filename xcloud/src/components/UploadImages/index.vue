<template>
  <div class="upload-container">
    <el-upload :action="uploadUrl" list-type="picture-card" :accept="accept" :limit="num" :on-preview="handlePictureCardPreview" :file-list="filelist" :before-upload="beforehandleUpload" :on-success="handleUpload" :on-remove="handleRemove" :on-exceed="onExceed" :disabled="disabled">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    // 上传图片的路径
    imageUrl: { type: String | Array },
    // 上传tips文案提示
    uploadTips: { type: String },
    // 上传成功钩子
    onSuccess: { type: Function },
    // 上传失败钩子
    onError: { type: Function },
    // 上传文件移除钩子
    onRemove: { type: Function },
    // 上传图片数量
    num: { type: Number },
    disabled: { type: Boolean },
    accept: {
      type: String,
      default: '.png, .jpg, .jpeg, .bmp, .gif',
    },
  },
  data() {
    return {
      // 上传的文件
      file: {},
      dialogVisible: false,
      dialogImageUrl: false,
      uploadUrl: this.baseUrl + '/file/oss/upload',
      filelist: [],
      imgArr: [],
    };
  },
  watch: {
    // 监听prop传参的变化，回显图片
    imageUrl: {
      immediate: true,
      handler(newval, oldval) {
        if (newval) {
          if (Array.isArray(newval)) {
            this.filelist = newval.map((item) => ({ url: item }));
          } else {
            this.filelist = newval.split(',').map((item) => ({ url: item }));
          }
          // if (this.num > 1) {
          //   this.filelist = newval.map(item => ({ url: item.fileUrl }));
          // } else {
          //   this.filelist = newval.split(",").map(item => ({ url: item }));
          // }
        } else {
          this.filelist = [];
        }
      },
    },
  },
  methods: {
    handleRemove(file, filelist) {
      const img = filelist.map((item) => item.url).join(',');
      this.onRemove(img);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /**
     * 上传图片验证图片类型和大小
     */
    beforehandleUpload(file) {
      const IMAGE_TYPE = this.accept.split(',').map((item) => 'image/' + item.trim().substr(1).toLowerCase());
      const MAX_SIZE = file.size / 1024 / 1024 < 2;
      // 验证文件类型
      if (!IMAGE_TYPE.includes(file.type)) {
        this.$message({
          message: '请上传( ' + this.accept + ')格式的图片',
          type: 'error',
        });
        return false;
      }

      // 验证文件大小
      if (!MAX_SIZE) {
        this.$message({
          message: '上传图片大小不能超过2M',
          type: 'error',
        });
        return false;
      }
      return true;
    },
    onExceed() {
      this.$message.error(`最多上传${this.num}个文件`);
    },
    // 上传图片到后台
    handleUpload(res, file, filelist) {
      if (file.response) {
        const img = filelist.map((item) => (item.response ? item.response.data.fileUrl : item.url)).join(',');
        const fileName = filelist.map((item) => (item.response ? item.response.data.origFileName : item.url)).join(',');
        this.onSuccess(img, fileName, file.response);
      } else {
        if (filelist.length) {
          setTimeout(() => {
            filelist = filelist.splice(filelist.length - 1, 1);
          });
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.upload-tips {
  line-height: 20px;
  width: 50px;
  text-align: center;
}
.avatar-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.imgInvoice {
  width: 50px;
  height: 50px;
  margin: 10px 10px 0 0;
}
::v-deep .el-upload-list__item {
  width: 80px;
  height: 80px;
}
::v-deep .el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 80px;
}
</style>
