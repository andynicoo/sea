<template>
  <div>
    <el-link type="primary" :href="value + '?response-content-type=application/octet-stream'" v-if="value && currentNodeCode === currentCodeEnum.NODE6">{{ keyLabel }}</el-link>
    <el-link type="primary" :href="sourceFile + '?response-content-type=application/octet-stream'" v-if="sourceFileUrl">模板文件</el-link>
    <el-link type="primary" :href="fileModel" target="_blank" v-if="fileModelUrl">查看示例</el-link>
  </div>
</template>

<script>
import { currentCodeEnum } from '@/view/module/workOrder/map.js';
export default {
  props: {
    value: [String, Array],
    keyLabel: String,
    fileModelUrl: String,
    sourceFileUrl: String,
    currentNodeCode: [String, undefined],
  },
  data() {
    return {
      currentCodeEnum,
    };
  },
  computed: {
    fileModel() {
      return this.fileModelUrl.replace('http://', 'https://');
    },
    sourceFile() {
      return this.sourceFileUrl.replace('http://', 'https://');
    },
  },
  created() {},
};
</script>

<style lang="less" scoped></style>
