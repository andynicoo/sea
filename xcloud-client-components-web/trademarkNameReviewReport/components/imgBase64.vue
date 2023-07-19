<template>
  <img :src="base64Url" class="img" width="100%" />
</template>
<script>
import { toBase64URL } from '../../utils/util.js';
export default {
  props: {
    src: {
      type: String,
    },
  },
  data() {
    return {
      base64Url: this.src,
    };
  },
  async created() {
    let url = await toBase64URL(this.src);
    this.base64Url = url;
  },
};
</script>

<style lang="less" scoped>
.container {
}
</style>
