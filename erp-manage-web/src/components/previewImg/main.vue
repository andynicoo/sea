<template>
  <div v-show="value" class="canvas-container">
    <a-icon type="close" class="close-span" @click="close" />
    <div
      class="img-box"
      :class="{'mask-close':maskClosable}"
      :style="calcStyle"
      @click.self="close"
    >
      <canvas id="img-canvas" ref="canvas" />
    </div>
    <div class="image-resolution">
      <span>{{ imgWidth }}X{{ imgHeight }}</span>
    </div>
    <div class="image-tools-bar">
      <i class="iconfont iconzuozhuan" @click="handleRotate('left')" />
      <i class="iconfont iconyouzhuan" @click="handleRotate('right')" />
      <a-icon class="downsvg-box" type="arrow-down" @click="downimg" />
    </div>
  </div>
</template>

<script>
import { download } from '@/utils'
export default {
  data() {
    return {
      value: false,
      url: '',
      deg: 0,
      maskClosable: true, // 点击蒙层关闭
      imgWidth: 0,
      imgHeight: 0
    }
  },
  computed: {
    calcStyle({ deg }) {
      return {
        transform: `rotate(${deg}deg)`
      }
    }
  },
  mounted() {
    this.init()
    window.addEventListener('keydown', this.keydown)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keydown)
  },
  methods: {
    keydown(e) {
      if (e.keyCode === 27) {
        this.close()
      }
    },
    init() {
      const canvas = this.$refs.canvas
      const img = new Image()
      img.src = this.url
      const ctx = canvas.getContext('2d')
      img.onload = (e) => {
        let width = e.path[0].width
        let height = e.path[0].height
        this.imgWidth = width
        this.imgHeight = height
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0)
      }
    },
    handleRotate(direction) {
      if (direction === 'left') {
        this.deg -= 90
      } else {
        this.deg += 90
      }
    },
    close() {
      this.value = false
      setTimeout(() => {
        this.$destroy(true)
        this.$el.parentNode.removeChild(this.$el)
      })
    },
    downimg() {
      download(this.url)
    },
    handleFullScreen() {
      if (this.getFullScreenStatus()) {
        this.exitScreen()
      } else {
        this.fullScreen()
      }
    },
    getFullScreenStatus() {
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      ) {
        return true
      }
    },
    fullScreen() {
      const el = document.documentElement
      const rfs =
        el.requestFullScreen ||
        el.webkitRequestFullScreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullscreen
      if (typeof rfs !== 'undefined' && rfs) {
        rfs.call(el)
      }
      this.isFullScreen = true
    },
    exitScreen() {
      this.isFullScreen = false
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.canvas-container {
  position: fixed;
  overflow: hidden;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.75);
  .img-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    display: inline-block;
    transition: all 0.3s ease-in-out;
    pointer-events: none;
    &.mask-close{
      pointer-events: unset;
    }
    #img-canvas {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      display: inline-block;
    }
  }
  .close-span {
    position: fixed;
    top: 10px;
    right: 30px;
    color: #dfdfdf;
    cursor: pointer;
    font-size: 20px;
    z-index: 999;
  }
  .image-resolution {
    position: fixed;
    font-size: 13px;
    color: #fff;
    top: 5px;
    left: 10px;
    background: hsla(0, 0%, 39.2%, 0.33);
    border-radius: 2px;
    padding: 0 2px;
  }
  .image-tools-bar {
    height: 38px;
    position: fixed;
    text-align: center;
    bottom: 10px;
    background: hsla(0, 0%, 100%, 0.7);
    border-radius: 10px;
    width: 13%;
    padding: 0 10px;
    left: 50%;
    transform: translate(-50%);
    display: flex;
    align-items: center;
    i {
      font-size: 24px;
      flex: 1;
      cursor: pointer;
      &:hover {
        background-color: rgba(66, 66, 66, 0.18);
      }
    }
  .downsvg-box{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  }
}
</style>
