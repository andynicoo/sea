<template>
  <div class="progress-main">
    <div class="progress-content">
      <div :style="{ width: `${progressNum}%` }" class="progress-num"></div>
    </div>
    <span class="progress-num-text">{{progressNum}}%</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      progressNum: 0
    }
  },
  methods: {
    progress(v) {
      if(v > 100) return
      this.$data.progressNum = v
    },
  }
}
</script>

<style lang="scss" scoped>
.progress-main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  .progress-content {
    width: 260px;
    height: 16px;
    background-color: #ffffff;
    border-radius: 16px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;

    .progress-num {
      display: inline-block;
      height: 100%;
      min-width: 16px;
      background-color: #ff720d;
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.5s;
    }
  }

  .progress-num-text {
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    color: #f76f0d;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, 15px);
  }
}
</style>