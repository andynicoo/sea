<template>
  <el-dialog title="查看NOA文件" :visible.sync="visible" :destroy-on-close="true" width="30%">
    <el-form>
      <el-form-item label="上传文件："
        ><a :href="info.fileUrl" target="_blank" class="text-primary">{{ info.fileRemark }}</a></el-form-item
      >
      <el-form-item label="宣誓截止日期：">{{ info.lastDealDate && info.lastDealDate.slice(0, 10) }}</el-form-item>
      <!-- <el-form-item label="服务商品："> </el-form-item> -->
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  props: ['info'],
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
  },
};
</script>
