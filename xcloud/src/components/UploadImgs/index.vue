<template>
  <div class="upload-container">
    <el-upload
      :action="uploadUrl"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleUpload"
      :before-upload="beforehandleUpload"
      :file-list="fileList"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    // 上传成功钩子
    onSuccess: { type: Function },
    // 上传图片的路径
    imageUrl: { Array }
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      picList: [],
      fileList: [],
      uploadUrl: this.baseUrl + "/file/oss/upload"
    };
  },
  watch: {
    // 监听prop传参的变化，回显图片
    imageUrl: {
      immediate: true,
      handler(newval, oldval) {
        if (newval) {
          console.log(111, newval);
          this.filelist = newval;
        } else {
          console.log(222);
          this.filelist = [];
        }
      }
    }
  },
  created() {},
  methods: {
    handleUpload(res, file) {
      console.log(file);
      this.picList.push({ url: res.data.fileUrl, name: res.data.origFileName, uid: file.uid, type: res.data.suffix });
      this.emptyUpload();
      this.onSuccess(this.picList);
    },
    beforehandleUpload(file) {
      const IMAGE_TYPE = ["image/png", "image/jpg", "image/jpeg", "image/bmp", "image/gif"];
      const MAX_SIZE = file.size / 1024 / 1024 < 2;
      // 验证文件类型
      if (!IMAGE_TYPE.includes(file.type)) {
        this.$message({
          message: "请上传(.png,.jpg,.jpeg,.bmp,.gif)格式的图片",
          type: "error"
        });
        return false;
      }

      // 验证文件大小
      if (!MAX_SIZE) {
        this.$message({
          message: "上传图片大小不能超过2M",
          type: "error"
        });
        return false;
      }
      return true;
    },
    handleRemove(file, fileList) {
      for (const i in this.picList) {
        if (this.picList[i].key === file.uid) {
          this.picList.splice(i, 1);
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /**
     * 清空上传组件
     */
    emptyUpload() {
      const mainImg = this.$refs.upload;
      if (mainImg) {
        if (mainImg.length) {
          mainImg.forEach(item => {
            item.clearFiles();
          });
        } else {
          this.$refs.upload.clearFiles();
        }
      }
    }
  }
};
</script>

<style></style>
