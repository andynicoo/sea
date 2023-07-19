<template>
  <div class="av">
    <img class="avaImg" :src="avatar" alt="头像" v-if="avatar !== ''" :style="{ width: `${width}px` }" />
    <img class="avaImg" src="@/assets/images/user/head.png" v-else alt="头像" :style="{ width: `${width}px` }" />
  </div>
</template>

<script>
export default {
  props: {
    avatar: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 32,
    },
  },
};
</script>

<style lang="less" scoped>
.av {
  display: inline-block;
  .avaImg {
    border-radius: 100%;
  }
}
</style>
