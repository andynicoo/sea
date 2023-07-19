<template>
  <UploadFile :fileList.sync="_fileList" :maxSize="maxSize" :listType="listType" :drag="false" :limit="6" companyFile :accept="accept">
    <div slot="uploadBtn">
      <el-button size="small" type="primary" v-if="listType === 'text'">点击上传</el-button>
    </div>
  </UploadFile>
</template>

<script>
import UploadFile from "@/components/UploadFile/index";
export default {
  props: {
    fileList: String,
    listType: {
      type: String,
      default: "picture-card",
    },
    maxSize: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return {
      accept:
        ".bmp,.jpg,.png,.tif,.gif,.pcx,.tga,.exif,.fpx,.svg,.psd,.cdr,.pcd,.dxf,.ufo,.eps,.ai,.raw,.WMF,.webp,.avif,.apng,.pdf",
    };
  },
  computed: {
    _fileList: {
      get() {
        return this.fileList
          .split(",")
          .filter((item) => item)
          .map((item) => ({
            url: item,
            name: "公司英文章程",
          }));
      },
      set(val) {
        this.$emit("update:fileList", val.map((item) => item.url).join(","));
      },
    },
  },
  components: {
    UploadFile,
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-upload--picture-card {
  border: 1px solid #dcdfe6;
  width: 168px;
  height: 168px;
  line-height: inherit;
  background: #fff;
}
/deep/ .el-upload-list__item {
  width: 168px;
  height: 168px;
}
/deep/ .el-upload {
  max-height: 168px;
}
</style>
