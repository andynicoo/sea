<template>
  <div class="upload-container">
    <el-upload
      ref="pictureUpload"
      :action="uploadUrl"
      list-type="picture-card"
      :limit="5"
      :on-success="handleUpload"
      :before-upload="beforehandleUpload"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }" style="width: 80px; height: 80px">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
      <div class="el-upload__tip" slot="tip">
        支持扩展名：.doc .docx .pdf .jpg
      </div>
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
  },
  data() {
    return {
      // 上传的文件
      file: {},
      dialogVisible: false,
      disabled: false,
      dialogImageUrl: false,
      uploadUrl: this.baseUrl + "/file/oss/upload",
    };
  },
  watch: {
    // 监听prop传参的变化，回显图片
    imageUrl: {
      immediate: true,
      handler(newval, oldval) {
        this.file = {
          url: newval,
        };
      },
    },
  },
  methods: {
    handleRemove(file) {
      let uploadFiles = this.$refs.pictureUpload.uploadFiles;
      for (var i = 0; i < uploadFiles.length; i++) {
        if (uploadFiles[i]["url"] == file.url) {
          uploadFiles.splice(i, 1);
        }
      }
      this.onRemove(this.file, uploadFiles);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /**
     * 上传图片验证图片类型和大小
     */
    beforehandleUpload(file) {
      const IMAGE_TYPE = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/bmp",
        "image/gif",
      ];
      const MAX_SIZE = file.size / 1024 / 1024 < 2;
      // 验证文件类型
      if (!IMAGE_TYPE.includes(file.type)) {
        this.$message({
          message: "请上传(.png,.jpg,.jpeg,.bmp,.gif,)格式的图片",
          type: "error",
        });
        return false;
      }

      // 验证文件大小
      if (!MAX_SIZE) {
        this.$message({
          message: "上传图片大小不能超过2M",
          type: "error",
        });
        return false;
      }
      return true;
    },
    // 上传图片到后台
    handleUpload(res, file) {
      let formData = new FormData();
      formData.append("file", res.data);
      formData.append("suffix", "img");
      // 定义file
      this.file = {
        url: res.data.fileUrl,
        file: res.data,
        name: res.data.fileName,
        size: res.data.size,
        type: res.data.suffix,
      };
      this.onSuccess(this.file);
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
