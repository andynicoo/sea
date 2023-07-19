<template>
  <a-modal
    :visible="value"
    :width="width"
    :z-index="9999"
    :closable="true"
    :footer="null"
    :after-close="afterClose"
    :dialog-style="modalStyle"
    @cancel="value = false"
  >
    <div class="img-box">
      <img
        :src="url"
        alt=""
        :class="{ 'full-img': isFullScreen }"
        :style="calcStyle"
        @load="onload"
      >
      <div class="toolbar">
        <i class="iconfont iconzuozhuan" @click="handleRotate('left')" />
        <i class="iconfont iconyouzhuan" @click="handleRotate('right')" />
        <a-icon
          v-show="!isFullScreen"
          type="fullscreen"
          :style="{ fontSize: '16px' }"
          @click="handleFullScreen"
        />
        <a-icon
          v-show="isFullScreen"
          type="fullscreen-exit"
          :style="{ fontSize: '16px' }"
          @click="exitFullScreen"
        />
      </div>
    </div>
  </a-modal>
</template>
<script>
const initModalStyle = {
  height: '600px'
}
export default {
  name: 'PreviewImg',
  data() {
    return {
      url: '',
      value: false,
      width: 800,
      isFullScreen: false,
      modalStyle: {
        ...initModalStyle
      },
      deg: 0,
      naturalWidth: 0
    }
  },
  computed: {
    calcStyle({ deg }) {
      return {
        transform: `rotate(${deg}deg)`
      }
    }
  },
  methods: {
    afterClose() {
      this.url = ''
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },
    handleFullScreen() {
      this.isFullScreen = true
      this.width = '100vw'
      this.modalStyle = {
        top: 0,
        height: '100vh',
        padding: 0
      }
    },
    exitFullScreen() {
      this.isFullScreen = false
      this.width = 800
      this.modalStyle = { ...initModalStyle }
    },
    handleRotate(direction) {
      if (direction === 'left') {
        this.deg = this.deg - 90 < -360 ? -90 : this.deg - 90
      } else {
        this.deg = this.deg + 90 > 360 ? 90 : this.deg + 90
      }
    },
    onload(e) {
      const naturalWidth = e?.path[0]?.naturalWidth || 0
      this.naturalWidth = naturalWidth
      console.log(this.naturalWidth)
    }
  }
}
</script>

<style lang="less" scoped>
.img-box {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  overflow: auto;
  .toolbar {
    display: none;
    position: absolute;
    bottom: 10px;
    padding: 2px 10px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 3px;
    i {
      cursor: pointer;
      color: #fff;
    }
    i:not(:last-child) {
      margin-right: 5px;
    }
  }
  &:hover {
    .toolbar {
      display: block;
    }
  }
  img {
    max-width: 100%;
    object-fit: contain;
    &::selection {
      background: unset;
    }
    &.full-img {
      width: auto;
      height: auto;
      max-width: unset;
    }
  }
}
/deep/ .ant-modal-content {
  height: 100%;
  width: 100%;
}
/deep/.ant-modal-body {
  height: 100%;
  width: 100%;
  padding: 0;
  overflow: auto;
}
</style>
