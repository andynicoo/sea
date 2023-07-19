<template>
  <div class="inner-success">
    <i class="el-icon-success"></i>
    <slot>上传成功</slot>
  </div>
</template>
<style lang="less" scoped>
.inner-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  i {
    font-size: 60px;
    color: #52c41a;
  }
}
</style>
