<template>
  <div class="el-page-header">
    <div class="el-page-header__left" @click="$emit('back')">
      <i class="el-icon-arrow-left"></i>
      <div class="el-page-header__title">
        <slot name="title">{{ title }}</slot>
      </div>
    </div>
    <div class="el-page-header__content">
      <slot name="content">{{ content }}</slot>
    </div>
  </div>
</template>

<script>
import { t } from "element-ui/src/locale";
export default {
  name: "BackHerader",
  props: {
    title: {
      type: String,
      default() {
        return t("el.pageHeader.title");
      },
    },
    content: String,
  },
};
</script>

<style lang="scss" scoped>
.el-page-header {
  .el-page-header__left {
    display: flex;
    align-items: center;
    // width: 0px;
    .el-icon-arrow-left {
      font-size: 15px;
    }
    .el-page-header__title {
      padding-left: 3px;
    }
  }
  .el-page-header__left::after {
    width: 0px;
  }
}
</style>
