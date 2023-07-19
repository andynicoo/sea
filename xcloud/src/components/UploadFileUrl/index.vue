<template>
  <UploadFile :fileList.sync="_fileList" v-bind="$attrs">
    <slot name="tip"></slot>
    <slot name="content"></slot>
    <slot name="uploadBtn"></slot>
    <slot></slot>
  </UploadFile>
</template>

<script>
import UploadFile from '@/components/UploadFile/index';
export default {
  props: {
    fileList: {
      type: String || Array,
      required: true,
      default: '',
    },
    isFilterFileList: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    _fileList: {
      get() {
        if (this.isFilterFileList) {
          return this.fileList
            .split(',')
            .filter((item) => item)
            .map((item) => ({
              url: item.replace('http://', 'https://'),
              name: item.replace('http://', 'https://'),
            }));
        }
      },
      set(val) {
        this.$emit('update:fileList', this.isFilterFileList ? val.map((item) => item.url).join(',') : val);
      },
    },
  },
  components: {
    UploadFile,
  },
};
</script>

<style lang="less" scoped></style>
