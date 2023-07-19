<template>
  <div class="me-image-preview">
    <button @click="onClose" class="iconfont iconclose"></button>
    <button
      :disabled="!!!images[index - 1]"
      @click="index--"
      class="prev iconfont icondown-point"
    ></button>
    <img
      class="me-image-item"
      style="max-width: 1770px; max-height: 96%; width: unset; height: unset"
      :src="images[index]"
    />
    <button
      :disabled="!!!images[index + 1]"
      @click="index++"
      class="next iconfont icondown-point"
    ></button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [],
      index: 0
    }
  },
  methods: {
    onClose() {
      document.body.removeChild(this.$el)
    }
  }
}
</script>

<style lang="scss" scoped>
.me-image-preview {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;

  .me-image-item {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 100%;
    max-width: 600px;
    transform: translate(-50%, -50%);
  }

  & > .iconfont {
    position: fixed;
    top: 50%;
    color: #ffffff;
    font-size: 50px;
    border: none;
    outline: none;

    &[disabled='disabled'] {
      color: #999999;
    }

    &.iconclose {
      position: fixed;
      right: 10px;
      top: 10px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      background-color: #ffffff;
      color: #333333;
      border-radius: 50%;
      font-size: 20px;
    }
  }

  .prev,
  .next {
    background-color: rgba(0, 0, 0, 0);
    cursor: pointer;
  }
  .prev {
    left: 10%;
    transform: rotate(90deg) translateY(-50%);
  }
  .next {
    right: 10%;
    transform: rotate(-90deg) translateY(-50%);
  }
}
</style>
