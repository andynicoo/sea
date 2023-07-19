<template>
  <div>
    <!-- 文件示例 -->
    <a :href="imglink" target="_blank" class="text-blue">{{ value }}</a>
    <i class="el-icon-error" @click="removeHandler" v-if="imglink != ''"></i>
  </div>
</template>

<script>
export default {
  props: {
    imglink: { type: String },
    value: { type: String }
  },
  data() {
    return {};
  },
  created() {
    console.log(this.value);
  },
  methods: {
    removeHandler() {
      this.imglink = "";
    }
  }
};
</script>

<style>
.el-icon-error {
  color: #2d8cf0 !important;
}
</style>
