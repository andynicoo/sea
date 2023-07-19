<template>
  <a-form-model
    ref="mediaManager"
    :model="product"
    :rules="rules"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 10 }"
  >
    <a-form-model-item
      label="商品图片"
      prop="image"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      required
    >
      <a-space class="product-images-actions me-mb-2">
        <a-button
          :disabled="!imagesCheked.length"
          @click="addWatermarkVisible = true"
        >
          添加水印
        </a-button>
        <a-button @click="addGetCollection">从采集图片中获取</a-button>
        <a-button @click="addUploadImage">上传本地图片</a-button>
        <a-button @click="addClear">清空所有图片</a-button>
        <a-button @click="addBatchRemove">批量删除</a-button>
        <!-- <a-button
          @click="onHandleImagesStretch"
          :disabled="!imagesCheked.length"
          :loading="handleImagesStretchLoading"
        >
          一键拉伸
        </a-button> -->
      </a-space>
      <div style="color: #999999">
        图片格式：JPG,JPEG,PNG ;
        最多上传8张图，每张图片大小不超过2M，图片建议尺寸：800x800
      </div>
      <div class="product-images">
        <a-checkbox
          :checked="cheked"
          :indeterminate="indeterminate"
          @change="onChekedAll"
          class="me-mr-4"
        >
          全选
        </a-checkbox>
        <template v-if="product.image && product.image.length">
          <Draggable
            class="draggable-images"
            v-model="product.image"
            :options="{ animation: 500, sort: { default: true } }"
          >
            <div
              class="draggable-image"
              v-for="(item, index) in product.image"
              :key="index"
              @click="$ImagePreview(product.image, item)"
              :style="`background-image: url(${item})`"
            >
              <span
                class="image-info"
                v-if="productImagesInfo && productImagesInfo[index]"
              >
                {{ productImagesInfo[index].width }} *
                {{ productImagesInfo[index].height }}
              </span>
              <div class="image-actions">
                <a
                  @click.stop="openMeituxiuxiu(item, index)"
                  class="iconfont iconedit me-img-icon"
                >
                  <span>美图秀秀</span>
                </a>
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
              <span @click.stop>
                <a-checkbox
                  :checked="imagesCheked.includes(item)"
                  @change="onImageItemChange(item)"
                  class="me-ml-2"
                ></a-checkbox>
              </span>
            </div>
          </Draggable>
        </template>
        <template v-if="product.image && product.image.length < 8">
          <a-button class="plus-images" @click="onPush">
            <a-icon type="plus" />
          </a-button>
        </template>
      </div>
    </a-form-model-item>

    <a-modal
      :visible="addWatermarkVisible"
      title="添加水印"
      :footer="false"
      @cancel="addWatermarkVisible = false"
      :maskClosable="false"
      destroyOnClose
      width="70%"
    >
      <template slot="title">
        <span>选择水印</span>
        <span class="me-ml-2 sub-title"> 水印添加后不可退出 </span>
      </template>
      <SelectWatermarkTemplate @select="onTemplateSelect" />
    </a-modal>
  </a-form-model>
</template>

<script>
import Draggable from 'vuedraggable'
import { loadImage, getImageAbbt } from '@/util/document'
import Lazada from '@/api/lazada'
import Goods from '@/api/goods'
import { cloneDeep, difference, xor } from 'lodash'
import SelectWatermarkTemplate from '@/views/goods/components/batchEditTabs/SelectWatermarkTemplate'
import { ImgMerge, base64ToFile } from '@/util/canvas'

export default {
  components: {
    Draggable,
    SelectWatermarkTemplate
  },
  props: {
    product: Object,
    storeId: [Number, String]
  },
  model: {
    prop: 'product',
    event: 'input'
  },
  data() {
    return {
      productImagesInfo: null,
      imagesCheked: [],
      addWatermarkVisible: false,
      handleImagesStretchLoading: false
    }
  },
  computed: {
    rules() {
      return {
        image: [
          {
            validator: (rule, value, callback) => {
              if (!value.length) return callback('请上传图片')
              callback()
            }
          }
        ]
      }
    },
    cheked() {
      const imagesCheked = this.$data.imagesCheked
      const product = this.$props.product
      if (!product.image.length) return false
      return imagesCheked.length === product.image.length
    },
    indeterminate() {
      const imagesCheked = this.$data.imagesCheked
      const product = this.$props.product
      if (!product.image.length) return false
      if (imagesCheked.length > 0) {
        return imagesCheked.length < product.image.length
      }
      return false
    }
  },
  mounted() {
    this.loadImageInfo(this.$props.product.image)
  },
  methods: {
    async validateImages() {
      const product = cloneDeep(this.$props.product)
      const sizes = await getImageAbbt(this.$props.product.image)
      const handlerSize = sizes.map(async ({ width, height }, index) => {
        if (width !== 800 || height !== 800) {
          const params = {
            storeId: product.storeId,
            id: product.id,
            list: [product.image[index]]
          }
          const res = await Goods.handleBatchPull(params)
          const [src] = res.data.list
          product.image[index] = src
          this.$emit('input', product)
        }
      })
      return Promise.all(handlerSize)
    },
    /**校验 */
    async validate() {
      // await this.validateImages()
      this.loadImageInfo(this.$props.product.image)
      return await this.$refs.mediaManager.validate()
    },
    /**加载图片尺寸信息 */
    loadImageInfo(images) {
      getImageAbbt(images).then((res) => {
        this.$data.productImagesInfo = res
      })
    },
    /**添加图片 */
    onPush() {
      const product = cloneDeep(this.$props.product)
      loadImage({ multiple: false }, async (files) => {
        const formData = new FormData()
        files.forEach((file) => {
          formData.append('file', file)
          formData.append('storeId', product.storeId)
        })
        const { data } = await Lazada.lazadaImagePush(formData)
        if (!data.length) this.$message.error('上传失败')
        product.image = [...product.image, ...data]
        this.$emit('input', product)
        this.clearImageCheced()
        this.loadImageInfo(product.image)
      })
    },
    /**单个图片选中 */
    onImageItemChange(image) {
      const imagesCheked = this.$data.imagesCheked
      const index = imagesCheked.indexOf(image)
      if (index >= 0) {
        this.$delete(imagesCheked, index)
      } else {
        imagesCheked.push(image)
      }
    },
    /**选中全部图片 */
    onChekedAll() {
      if (this.cheked) this.$data.imagesCheked = []
      else this.$data.imagesCheked = cloneDeep(this.$props.product.image)
    },
    /**删除图片 */
    removeImagesItem(index) {
      const product = this.$props.product
      product.image.splice(index, 1)
      this.$emit('input', product)
      this.clearImageCheced()
    },
    /**打开美图秀秀 */
    openMeituxiuxiu(image, index) {
      const params = JSON.stringify({ index: index, type: 1 })
      localStorage.setItem('meituImageInfo', params)
      this.$data.imgCheckedVal = []
      this.openPage('/meituxiuxiu?img=' + image, '_blank')
    },
    /**替换图片 */
    releaseImagesItem(index) {
      const product = cloneDeep(this.$props.product)
      loadImage({ multiple: false }, async ([file]) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('storeId', product.storeId)
        const { data } = await Lazada.lazadaImagePush(formData)
        if (!data.length) this.$message.error('上传失败')
        product.image[index] = data[0]
        this.$emit('input', product)
        this.clearImageCheced()
      })
    },
    /**添加水印 */
    onTemplateSelect(template) {
      const { cover } = template
      const product = cloneDeep(this.$props.product)

      const mergeImage = (images) => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
          const [preImg] = images
          const [size] = await getImageAbbt([preImg])
          const { width, height } = size
          const imgMerge = new ImgMerge({ width, height })
          imgMerge.drawImg(images).then(async () => {
            const img = imgMerge.outputImg()
            resolve(img)
          })
        })
      }

      this.$data.addWatermarkVisible = false
      this.$data.addWatermarkLoading = true
      const mimages = product.image.map((image) => {
        if (this.$data.imagesCheked.includes(image)) {
          return mergeImage([image, cover])
        }
        return mergeImage([image])
      })
      Promise.all(mimages).then((rimg) => {
        const files = rimg.map((image) => base64ToFile(image))
        let formData = new FormData()
        files.forEach((file) => {
          formData.append('file', file)
          formData.append('storeId', product.storeId)
        })
        Lazada.lazadaImagePush(formData)
          .then(({ data }) => {
            product.image = data
            this.$emit('input', product)
          })
          .finally(() => {
            this.$data.addWatermarkLoading = false
            this.clearImageCheced()
          })
      })
    },
    /**从采集图片获取 */
    addGetCollection() {
      const product = this.$props.product
      const detailImgUrl = this.$props.product.detailImgUrl
      if (!detailImgUrl.length) return this.$message.error('没有采集图片')
      const image = this.$props.product.image
      const imgs = difference(detailImgUrl, image)
      const length = 8 - image.length
      this.$ImageChoose(imgs, length).then((sources) => {
        product.image = [...product.image, ...sources]
        this.$emit('input', product)
        this.loadImageInfo(product.image)
        this.clearImageCheced()
      })
    },
    /**上传本地图片 */
    addUploadImage() {
      const product = this.$props.product
      const image = this.$props.product.image
      const length = 8 - image.length

      loadImage({ multiple: true, maxSize: length }, async (files) => {
        const formData = new FormData()
        files.forEach((file) => {
          formData.append('file', file)
        })
        formData.append('storeId', product.storeId)
        const { data } = await Lazada.lazadaImagePush(formData)
        if (!data.length) this.$message.error('上传失败')
        product.image = [...product.image, ...data]
        this.$emit('input', product)
        this.clearImageCheced()
        this.productImagesInfo()
      })
    },
    /**清空图片 */
    addClear() {
      const product = this.$props.product
      product.image = []
      this.clearImageCheced()
      this.$emit('input', product)
    },
    /**批量删除 */
    addBatchRemove() {
      const product = this.$props.product
      const images = product.image
      const imagesCheked = this.$data.imagesCheked
      product.image = xor(images, imagesCheked)
      this.$emit('input', product)
      this.clearImageCheced()
    },
    /**一键拉伸 */
    onHandleImagesStretch() {
      const imagesCheked = this.$data.imagesCheked
      if (!imagesCheked.length) {
        return this.$message.error('请选择要拉伸的图片')
      }

      this.$data.handleImagesStretchLoading = true
      const product = cloneDeep(this.$props.product)
      const { storeId, id } = product
      const params = { storeId, id, list: imagesCheked }

      Goods.handleBatchPull(params)
        .then((res) => {
          product.image = product.image.map((src) => {
            const index = imagesCheked.indexOf(src)
            if (index >= 0) {
              return res.data.list[index]
            }
            return src
          })

          this.$emit('input', product)
          this.loadImageInfo(product.image)
        })
        .finally(() => {
          this.clearImageCheced()
          this.$data.handleImagesStretchLoading = false
        })
    },
    clearImageCheced() {
      this.$data.imagesCheked = []
    }
  }
}
</script>

<style lang="scss" scoped>
.product-images {
  display: flex;
  .draggable-images {
    display: flex;
    flex-wrap: wrap;

    .draggable-image {
      width: 85px;
      height: 85px;
      background-position: center;
      background-size: cover;
      border-radius: 2px;
      margin-right: 10px;
      cursor: pointer;
      position: relative;

      .image-info {
        width: 100%;
        font-size: 10px;
        background-color: rgba(0, 0, 0, 0.5);
        color: #ffffff;
        height: 20px;
        line-height: 20px;
        position: absolute;
        bottom: 0;
        padding: 0 5px;
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
  .plus-images {
    border: 1px dashed #dcdcdc;
    width: 85px;
    height: 85px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #999999;
    border-radius: 2px;
  }
}

.product-images-actions {
}
</style>
