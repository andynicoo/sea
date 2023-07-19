<style lang="scss" scoped>
.images {
  .image {
    width: 80px;
    height: 80px;
    background-position: center;
    background-size: cover;
    vertical-align: top;
    cursor: move;
    position: relative;

    &.image-plus {
      cursor: pointer;
      text-align: center;
      line-height: 80px;
      background-color: #eee;
    }

    .image-actions {
      display: none;
      align-items: center;
      justify-content: space-around;
      height: 30px;
      line-height: 30px;
      background-color: rgba(0, 0, 0, 0.5);
      bottom: 0;
      width: 100%;
      position: absolute;
      bottom: 0;

      .iconfont {
        color: #ffffff;
        cursor: pointer;

        & > span {
          display: none;
          position: absolute;
          width: 70px;
          left: 50%;
          top: 80%;
          text-align: center;
          transform: translate(-50%, -200%);
          font-size: 14px;
          background-color: rgba(0, 0, 0, 0.5);
        }

        &:hover {
          & > span {
            display: block;
          }
        }
      }
    }

    &:hover {
      .image-actions {
        display: flex;
      }
    }
  }
}
</style>

<template>
  <div class="images">
    <Draggable
      class="me-ib"
      v-model="cimages"
      :options="{ animation: 500, sort: { default: true } }"
    >
      <div
        @click="$ImagePreview(images, image)"
        class="image me-ib me-mr-2"
        :style="`background-image: url(${image})`"
        v-for="(image, index) in images"
        :key="index"
      >
        <div class="image-actions">
          <span
            @click.stop="releaseImagesItem(index)"
            class="iconfont iconrelease me-img-icon"
          >
            <span>替换图片</span>
          </span>
          <span
            @click.stop="removeImagesItem(index)"
            class="iconfont iconremove me-img-icon"
          >
            <span>删除图片</span>
          </span>
        </div>
      </div>
    </Draggable>
    <template v-if="images.length < 8">
      <div @click="uploadImage" class="image me-ib image-plus">
        <a-icon type="plus" />
      </div>
    </template>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { loadImage, getImageAbbt } from '@/util/document'
import Lazada from '@/api/lazada'

export default {
  components: { Draggable },
  props: {
    images: Array,
    storeId: [Number, String]
  },
  data() {
    return {
      productImagesInfo: []
    }
  },
  computed: {
    cimages: {
      get() {
        return this.$props.images
      },
      set(value) {
        this.$emit('change', value)
      }
    }
  },
  mounted() {
    this.loadImageInfo(this.$props.images)
  },
  methods: {
    /**加载图片尺寸信息 */
    loadImageInfo(images) {
      getImageAbbt(images).then((res) => {
        this.$data.productImagesInfo = res
      })
    },
    /**上传图片 */
    uploadImage() {
      loadImage({ multiple: true }, async (files) => {
        const length = 8 - this.$props.images.length
        files = Array.from(files).slice(0, length)
        const formData = new FormData()
        files.forEach((e) => {
          formData.append('file', e)
          formData.append('storeId', this.$props.storeId)
        })
        const { data } = await Lazada.lazadaImagePush(formData)
        if (!data.length) this.$message.error('上传失败')
        const value = [...this.$props.images, ...data]
        this.$emit('change', value)
      })
    },
    /**移除图片 */
    removeImagesItem(index) {
      const images = this.$props.images
      images.splice(index, 1)
      this.$emit('change', images)
    },
    /**替换图片 */
    releaseImagesItem(index) {
      loadImage({ multiple: false }, async ([file]) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('storeId', this.$props.storeId)
        const { data } = await Lazada.lazadaImagePush(formData)
        if (!data.length) this.$message.error('上传失败')
        const images = [...this.$props.images]
        images[index] = data[0]
        this.$emit('change', images)
      })
    }
  }
}
</script>
