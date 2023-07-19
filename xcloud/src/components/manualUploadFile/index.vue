<template>
  <el-upload
    ref="uploadRef"
    action="action"
    :auto-upload="false"
    :limit="limit"
    :drag="drag"
    :file-list="newFileList"
    :list-type="listType"
    :multiple="multiple"
    :accept="accept"
    :maxSize="maxSize"
    :disabled="disabled"
    :show-file-list="showFileList"
    :on-change="onChange"
    :on-remove="onRemove"
    :on-exceed="onExceed"
    :on-preview="onPreview"
  >
    <div class="drag-wrapper" v-if="showDrag">
      <i class="icon icon-file-upload"></i>
      <div class="el-upload__text" style="line-height: 1.5; margin-top: 10px; font-size: 12px">
        <div>{{ uploadText }}</div>
      </div>
    </div>
    <slot name="uploadBtn"></slot>
  </el-upload>
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
    drag: {
      type: Boolean,
      default: true,
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
    showFileList: {
      type: Boolean,
      default: true,
    },
    // 最大文件限制
    maxSize: {
      type: Number,
      default: 100,
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    showDrag: {
      type: Boolean,
      default: true,
    },
    uploadText: {
      type: String,
      default: '点击或将文件拖拽到这里上传',
    },
  },
  model: {
    prop: 'fileList',
    event: 'getNewFileList',
  },
  data() {
    return {
      newFileList: this.fileList,
    };
  },
  watch: {
    fileList: {
      handler(val) {
        this.newFileList = val;
      },
      deep: true,
    },
    newFileList(val) {
      this.$emit('getNewFileList', val);
    },
  },
  methods: {
    onChange(file, fileList) {
      let fileType = this.$util.getFileSuffixName(file.name);
      const FILE_TYPE = this.accept
        .split(',')
        .map((item) => item.trim().substr(1).toLowerCase())
        .filter((item) => item);
      const MAX_SIZE = file.size / 1024 / 1024 < this.maxSize;
      // 验证文件类型
      if (FILE_TYPE.length && !FILE_TYPE.includes(fileType)) {
        this.newFileList = fileList.slice(0, -1);
        this.$message.warning(`请上传${FILE_TYPE.join(',')}格式的文件！`);
        return;
      }
      // 验证文件大小
      if (!MAX_SIZE) {
        this.newFileList = fileList.slice(0, -1);
        this.$message.warning(`文件不大于${this.maxSize}M`);
        return;
      }
      this.newFileList = fileList;
    },
    onRemove(file, fileList) {
      this.newFileList = fileList;
    },
    onExceed() {
      this.$message.warning(`最多上传${this.limit}个文件`);
    },
    onPreview(file) {
      window.open(file.url);
    },
  },
};
</script>
