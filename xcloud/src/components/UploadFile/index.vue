<template>
  <div
    :class="{
      fileClass: fileClass,
      'my-Tooltip': showTooltip,
    }"
  >
    <el-upload
      style="margin-right: 10px"
      :class="{ 'hidden-upload': isHiddenUpload, 'hidden-drag': hiddenDrag }"
      :drag="drag"
      :action="uploadUrl"
      :limit="limit"
      :before-upload="beforeUpload"
      :on-error="onError"
      :on-change="onChange"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :on-exceed="onExceed"
      :show-file-list="showFileList"
      :file-list="newFileList"
      :list-type="listType"
      :multiple="multiple"
      :accept="_accept"
      :maxSize="maxSize"
      :disabled="disabled"
    >
      <template v-if="!isHiddenUpload">
        <template v-if="fileClass">
          <i class="icon icon-file-upload-small"></i>
          <div class="el-upload__text">{{ uploadText }}</div>
          <div class="el-upload__tip text-info" slot="tip" v-if="showTip">*支持JPG、JPEG、PNG、PDF、Zip格式上传</div>
          <div class="el-upload__tip text-info" slot="tip" v-if="initTip">{{ initTip }}</div>
        </template>
        <template v-else-if="listType === PICTURE_CARD">
          <i class="el-icon-plus"></i>
        </template>
        <template v-else-if="drag && !hiddenDrag">
          <div class="drag-wrapper">
            <i class="icon icon-file-upload" v-if="listType !== PICTURE_CARD"></i>
            <div class="el-upload__text" style="line-height: 1.5; margin-top: 10px; font-size: 12px">
              <div>点击或将文件拖拽到这里上传</div>
              <div class="el-upload__tip" slot="tip" v-if="showTip">
                支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                <slot name="tip"></slot>
              </div>
              <slot name="content"></slot>
            </div>
          </div>
        </template>
        <slot name="uploadBtn"></slot>
        <slot></slot>
      </template>
    </el-upload>
    <Tooltip placement="right" v-if="showTooltip" content="上传数量：1；上传格式：pdf；文件大小：10M" theme="light">
      <i class="el-icon-question icon-hover" style="color: #ff9900; padding: 0 12px; line-height: 50px"></i>
    </Tooltip>
  </div>
</template>

<script>
export default {
  props: {
    limit: {
      type: Number,
      default: 1,
    },
    fileList: {
      type: Array,
      default() {
        return [];
      },
    },
    onlyIMG: {
      // 只允许图片类型
      type: Boolean,
      default: false,
    },
    // 只允许压缩包类型
    onlyZip: {
      type: Boolean,
      default: false,
    },
    showTip: {
      type: Boolean,
      default: false,
    },
    showFileList: {
      type: Boolean,
      default: true,
    },
    showTooltip: {
      type: Boolean,
      default: false,
    },
    drag: {
      type: Boolean,
      default: true,
    },
    hiddenDrag: {
      type: Boolean,
      default: false,
    },
    fileClass: {
      type: Boolean,
      default: false,
    },
    uploadText: {
      type: String,
      default: '点击或将文件拖拽到这里上传',
    },
    fileFlag: {
      type: Boolean,
      default: false,
    },
    fileType2: {
      // 文件和压缩包类型
      type: Boolean,
      default: false,
    },
    // 展示方式
    listType: {
      type: String,
      default: 'text',
    },
    // 可否多选
    multiple: {
      type: Boolean,
      default: true,
    },
    // 接收文件类型
    accept: {
      type: String,
      default: '',
    },
    // 是否公司信息图片
    companyFile: {
      type: Boolean,
      default: false,
    },
    // 最大文件限制
    maxSize: {
      type: Number,
      default: 30,
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 自定义提示文字
    initTip: {
      type: String,
      default: '',
    },
    // 文件上传满后是否隐藏上传框
    hiddenUpload: {
      type: Boolean,
      default: true,
    },
    // 上传时是否拼接文件名
    uploadWithName: {
      type: Boolean,
      default: false,
    },
    // 是否有flag标志（销售额文件）
    flag: {
      type: Boolean,
      default: null,
    },
  },
  computed: {
    newFileList: {
      get() {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fileLength = this.fileList.length;
        let list = [...this.fileList];
        list.forEach((item) => {
          if (item.url) {
            item.url = item.url.replace('http://', 'https://');
          }
        });
        return list;
      },
      set(val) {
        val.forEach((item) => {
          item.url = item.response ? item.response.data.fileUrl : item.url;
        });
        this.fileLength = val.length;
        this.$emit('update:fileList', val);
      },
    },
    _accept() {
      let list = [];
      if (this.listType === this.PICTURE_CARD) {
        list = ['.png', '.jpg', '.jpge', '.gif'];
      }
      return [...new Set(this.accept.split(',').concat(list))].join(',');
    },
    isHiddenUpload() {
      return (this.companyFile || this.hiddenUpload) && this.fileLength === this.limit;
    },
    uploadUrl() {
      if (this.flag) {
        return this.baseUrl + '/file/oss/upload4Cau';
      }
      return this.baseUrl + (this.uploadWithName ? '/file/oss/upload2' : '/file/oss/upload');
    },
  },
  data() {
    return {
      fileLength: 0,
      PICTURE_CARD: 'picture-card',
    };
  },
  methods: {
    beforeUpload(file) {
      let fileType = this.$util.getFileSuffixName(file.name.toLowerCase());
      if (file.name.includes('+') || file.name.includes(',') || file.name.includes('%')) {
        this.$message.error('您的文件名包含不能识别的 “+”、“,”、“%” 等特殊字符,请修改文件名后重新上传');
        return false;
      }
      if (this.maxSize > 0) {
        const MAX_SIZE = file.size / 1024 / 1024 < this.maxSize;
        // 验证文件大小
        if (!MAX_SIZE) {
          this.$message.error(`上传文件大小不能超过${this.maxSize}M`);
          return false;
        }
      }
      if (this.companyFile || this._accept) {
        const FILE_TYPE = this._accept.split(',').map((item) => item.trim().substr(1).toLowerCase());
        // 验证文件类型
        if (FILE_TYPE.length && !FILE_TYPE.includes(fileType)) {
          this.$message.warning(`请上传${FILE_TYPE.join(',')}格式的文件！`);
          return false;
        }
      }
      if (this.fileClass && this.showTip) {
        const FILE_TYPE = ['jpg', 'jpeg', 'png', 'pdf', 'zip'];
        // 验证文件类型
        if (!FILE_TYPE.includes(fileType)) {
          this.$message.warning('请上传JPG、JPEG、PNG、PDF和压缩包格式的文件！');
          return false;
        }
      }
      if (this.fileFlag) {
        const FILE_TYPE = ['xls', 'xlsx', 'csv', 'txt'];
        // 验证文件类型
        if (!FILE_TYPE.includes(fileType)) {
          this.$message.warning('请上传xls、xlsx、csv、txt格式的文件！');
          return false;
        }
      }
      if (this.companyFile) {
        const FILE_TYPE = this.accept.split(',').map((item) => item.substr(1));
        // 验证文件类型
        if (FILE_TYPE.length && !FILE_TYPE.includes(fileType)) {
          this.$message.warning(`请上传${FILE_TYPE.join(',')}格式的文件！`);
          return false;
        }
      }
      if (this.onlyIMG) {
        // 只支持图片类型
        const FILE_TYPE = ['jpg', 'jpeg', 'png', 'pdf'];
        // 验证文件类型
        if (!FILE_TYPE.includes(fileType)) {
          this.$message.warning('请上传jpg、jpeg、png、pdf格式的文件！');
          return false;
        }
      }
      if (this.onlyZip) {
        // 只支持图片类型
        const FILE_TYPE = ['zip'];
        // 验证文件类型
        if (!FILE_TYPE.includes(fileType)) {
          this.$message.warning('请上传zip格式的文件！');
          return false;
        }
      }
      if (this.fileType2) {
        const FILE_TYPE = ['jpg', 'jpeg', 'png', 'pdf', 'zip', 'rar'];
        // 验证文件类型
        if (!FILE_TYPE.includes(fileType)) {
          this.$message.warning('请上传jpg、jpeg、png、pdf、zip、rar类型的文件！');
          return false;
        }
      }
      return true;
    },
    onExceed() {
      this.$message.warning(`最多上传${this.limit}个文件`);
    },
    // eslint-disable-next-line handle-callback-err
    onError(err) {
      this.$message.error('上传失败，请重试');
    },
    onChange(file, fileList) {
      if (file.status !== 'success') {
        return;
      }
      this.newFileList = [...fileList];
    },
    onRemove(file, fileList) {
      this.newFileList = [...fileList];
    },
    onPreview(file) {
      window.open(file.url);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-upload-list__item.is-success:focus:not(:hover) .el-icon-close-tip {
  display: none;
}
.hidden-upload ::v-deep .el-upload--picture-card {
  display: none;
}
.fileClass {
  ::v-deep .el-upload-dragger {
    width: auto !important;
    height: 50px !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ::v-deep .el-upload__tip {
    margin: 0 !important;
    line-height: 24px !important;
  }
}
::v-deep .el-upload {
  max-width: 290px;
  max-height: 120px;
  // padding: 20px;
  box-sizing: border-box;
  &.el-upload--picture-card {
    width: 80px !important;
    height: 80px !important;
    max-width: inherit;
    max-height: inherit;
    position: relative;
    .el-icon-plus {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .el-upload-dragger {
    width: 100%;
    height: 100%;
    padding: 0 20px;
  }
  .drag-wrapper {
    padding: 20px;
  }
}
::v-deep .el-upload-list.el-upload-list--text {
  max-width: 300px;
}
::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 80px;
  height: 80px;
  margin: 0 !important;
  line-height: 0 !important;
}
.hidden-drag {
  ::v-deep .el-upload-dragger {
    border: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
  }
}
.hidden-upload {
  line-height: 0;
  ::v-deep .el-upload {
    display: none;
  }
}
.my-Tooltip {
  display: flex;
}
/deep/ .ivu-tooltip-inner {
  max-width: 300px;
}
</style>
