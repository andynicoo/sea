<template>
  <div class="upload-container">
    <!-- 上传商品图片 主要是样式不一样-->
    <el-upload
      v-if="imgType == 1"
      ref="handleUploadRef"
      :action="uploadUrl"
      class="avatar-uploader"
      :accept="accept"
      :show-file-list="false"
      :on-success="handleUpload"
      :before-upload="beforehandleUpload"
    >
      <div v-if="file.url">
        <img :src="file.url" class="avatar" />
      </div>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

    <!-- 上传头像 -->
    <el-upload
      v-else
      ref="handleUploadRef"
      :action="uploadUrl"
      :on-success="handleUpload"
      accept=".png, .jpg, .jpeg, .bmp, .gif"
      :show-file-list="false"
      :before-upload="beforehandleUpload"
      class="upload-image"
    >
      <!--  :http-request="handleUpload" -->
      <!-- 已经上传了图片 -->
      <el-avatar v-if="file.url" :src="file.url"></el-avatar>
      <!-- 没有上传图片默认显示 -->
      <div class="no-upload" v-else>
        <el-avatar icon="el-icon-user-solid"></el-avatar>
      </div>

      <!-- 删除图片 -->
      <i v-if="file.url" class="el-icon-error remove-image" @click.stop="handleImageRemove"></i>

      <!-- 上传图片的提示 -->
      <div class="upload-tips font-12 text-primary">{{ uploadTips }}</div>
    </el-upload>
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
    imgType: { type: Number | undefined | null }, // 上传头像或商品展示效果不一样，1是商品图片
    imgMaxSize: {
      type: Number,
      default: 2
    },
    accept: {
      type: String,
      default: '.png, .jpg, .jpeg, .bmp, .gif, .svg'
    },
    ruleType: {
      type: Array
    }
  },
  data () {
    return {
      // 上传的文件
      file: {},
      uploadUrl: this.baseUrl + '/file/oss/upload'
    }
  },
  watch: {
    // 监听prop传参的变化，回显图片
    imageUrl: {
      immediate: true,
      handler (newval, oldval) {
        this.file = {
          url: newval
        }
      }
    }
  },
  methods: {
    /**
     * 上传图片验证图片类型和大小
     */
    beforehandleUpload (file) {
      if( this.ruleType && this.ruleType.length ) {
        if (!this.ruleType.includes(file.type)) {
          this.$message({
            message: `请上传${this.accept}格式的图片`,
            type: 'error'
          })
          return false
        }
      } else {
        const IMAGE_TYPE = ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp', 'image/gif', 'image/svg+xml']
        // 验证文件类型
        if (!IMAGE_TYPE.includes(file.type)) {
          this.$message({
            message: '请上传(.png,.jpg,.jpeg,.bmp,.gif,.svg)格式的图片',
            type: 'error'
          })
          return false
        }
      }
      // 验证文件大小
      const MAX_SIZE = file.size / 1024 / 1024 < this.imgMaxSize
      if (!MAX_SIZE) {
        this.$message({
          message: `上传图片大小不能超过${this.imgMaxSize}M`,
          type: 'error'
        })
        return false
      }
      return true
    },
    // 上传图片到后台
    handleUpload (res, file) {
      let formData = new FormData()
      formData.append('file', res.data)
      formData.append('suffix', 'img')

      // 定义file
      this.file = {
        url: res.data.fileUrl,
        file: res.data,
        // uid: data.file.uid,
        name: res.data.fileName,
        size: res.data.size,
        type: res.data.suffix
      }
      this.onSuccess(this.file)

      // 请求到后台
      // uploadFile(formData).then((res) => {
      //   // 服务器返回的数据格式
      //   // var data = {
      //   //   fileName: "dev/123/20210522/dbd171e8a21745448f4a37e4ec1d60fc.jpeg",
      //   //   fileUrl:
      //   //     "http://file.itaxs.com/dev/123/20210522/dbd171e8a21745448f4a37e4ec1d60fc.jpeg",
      //   //   origFileName: "test.jpeg",
      //   //   size: "33",
      //   //   suffix: "jpeg",
      //   // };

      //   if (res.code == 0) {
      //     this.file.url = res.data.fileUrl;
      //     this.onSuccess(this.file);
      //   } else {
      //     this.$message({
      //       message: "上传图片失败",
      //       type: "error",
      //     });
      //     this.onError(this.file);
      //   }
      // });
    },
    // 删除
    handleImageRemove () {
      this.onRemove(this.file)
      this.file = {}
    },
    /**
     * 清空上传的图片
     */
    clearFiles () {
      this.onRemove(this.file)
      this.file = {}
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-tips {
  line-height: 20px;
  width: 50px;
  text-align: center;
}
.avatar-uploader {
  width: 168px;
  height: 168px;
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
  width: 168px;
  height: 168px;
  line-height: 168px;
  text-align: center;
}
.avatar {
  width: 168px;
  height: 168px;
  display: block;
}
</style>
