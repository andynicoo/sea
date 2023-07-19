<template>
  <div class="preview-modal" @click.self="closeModal">
    <a-icon type="close-circle" class="close-icon" @click="closeModal" />
    <div class="preview-content" :style="contentStyle" @click.self="closeModal">
      <a-spin :spinning="loading">
        <img
          ref="img"
          :style="imgStyle"
          :src="url"
          alt="查看图片"
          @load.stop="imgLoaded"
        />
        <div v-show="maskShow" class="img-scale-mask active">
          {{ ~~(imgScale * 100) + '%' }}
        </div>
      </a-spin>
    </div>
    <div class="toolbar">
      <a-icon type="zoom-in" @click="zoomInImg" title="放大" />
      <a-icon type="zoom-out" @click="zoomOutImg" title="缩放" />
      <a-icon type="border" @click="resetImg" title="原始比例" />
      <!-- <a-icon type="redo" @click="rotateImg" title="旋转" /> -->
      <a-icon type="close-circle" title="关闭" @click="closeModal" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: true,
      timer: null,
      rotateDeg: 0,
      imgScale: 1, // 图片缩放比
      scaleCV: 0.07, // 缩放的系数
      initWidth: 0, // 图片初始宽高
      initHeight: 0, // 图片初始宽高
      contentStyle: {
        // 默认大小
        width: '60vw',
        height: '60vh'
      },
      imgStyle: {
        width: '',
        height: '',
        transform: 'rotate(0)'
      },
      maskShow: false
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeViewer')
    },
    // 图片加载完成后获取初始宽高
    imgLoaded(e) {
      if (e.currentTarget?.complete) {
        const { width, height } = getComputedStyle(e.currentTarget)
        this.$data.imgStyle.width = width
        this.$data.imgStyle.height = height
        this.$data.initWidth = parseFloat(width)
        this.$data.initHeight = parseFloat(height)
        console.log(this.$data.imgStyle, '图片加载完毕')
        this.$data.loading = false
      }
    },
    // 处理图片缩放比
    handZoom(type = 'init') {
      //   console.log(this.$data.imgScale)
      if (type == 'out' && this.$data.imgScale > 0.5) {
        this.$data.imgScale -= this.$data.scaleCV
      } else if (type == 'in' && this.$data.imgScale < 1.69) {
        this.$data.imgScale += this.$data.scaleCV
      } else if (type == 'init') {
        this.$data.imgScale = 1
      }
      this.$data.imgStyle.width =
        this.$data.initWidth * this.$data.imgScale + 'px'
      this.$data.imgStyle.height =
        this.$data.initHeight * this.$data.imgScale + 'px'

      this.$data.maskShow = true
      clearTimeout(this.$data.timer)
      this.$data.timer = setTimeout(() => (this.$data.maskShow = false), 1500)

      this.$data.contentStyle = {}
    },
    // 图片放大
    zoomInImg() {
      this.handZoom('in')
    },
    // 图片缩放
    zoomOutImg() {
      this.handZoom('out')
    },
    // 旋转图片
    rotateImg() {
      this.$data.rotateDeg -= 90
      this.$data.imgStyle.transform = `rotate(${this.$data.rotateDeg}deg)`
    },
    // 恢复原来的比例
    resetImg() {
      this.handZoom()
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  background-color: rgba(0, 0, 0, 0.4);
  user-select: none;
  align-items: center;
  justify-content: center;

  .close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2000;
    font-size: 32px;
    color: white;
  }
}
.preview-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.05);

  img {
    max-width: 100%;
    max-height: 100%;
    outline: none;
  }

  .img-scale-mask {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 8px 22px;
    color: white;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 12px;
    opacity: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.08s;
    user-select: none;

    &.active {
      opacity: 1;
    }
  }
}

.toolbar {
  position: absolute;
  bottom: 10%;
  left: 50%;
  display: flex;
  padding: 4px 30px;
  font-size: 26px;
  background-color: white;
  background-color: rgba(109, 109, 109, 0.6);
  border-radius: 30px;
  transform: translateX(-50%);
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.08);
  align-items: center;

  > .anticon {
    padding: 3px 8px;
    color: white;
    cursor: pointer;

    &:hover {
      transform: scale(1.06);
    }
  }
}
</style>
