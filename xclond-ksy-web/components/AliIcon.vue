<template>
  <span class="aliicon">
    <icon-font :type="`icon-${type}`" :style="{ fontSize: `${size}px` }" />
  </span>
</template>

<script>
import { Icon } from "ant-design-vue";
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "@/plugins/iconfont",
});
export default {
  props: {
    type: {
      type: String,
      default: "",
    },
    size: {
      size: Number,
      default: 20,
    },
  },
  components: {
    IconFont,
  },
};
</script>

<style lang="less" scoped>
.aliicon {
  display: inline-block;
  cursor: pointer;
}
</style>
