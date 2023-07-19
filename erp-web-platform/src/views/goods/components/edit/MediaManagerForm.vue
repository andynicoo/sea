<template>
  <a-form-model
    ref="meditManagerForm"
    :model="product"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item
      :validateStatus="product._images_valid_ ? 'error' : ''"
      :help="product._images_valid_"
      required
      :label="$t('edit.productImage')"
      :wrapper-col="{ span: 21 }"
    >
      <a-space class="button-group">
        <template v-if="editType != 0">
          <a-dropdown>
            <a-button :loading="mediaImageTransitionLoading">
              {{ $t('edit.imageTransition') }}
            </a-button>
            <a-menu slot="overlay">
              <a-menu-item
                @click="onTranslateMediaImage(lang)"
                v-for="lang in targetLangList"
                :key="lang.lang"
              >
                {{ lang.name }}
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
        <a-button
          :loading="addWatermarkLoading"
          @click="addWatermarkVisible = true"
          :disabled="imgCheckedVal.length > 0"
        >
          {{ $t('edit.addWatermark') }}
        </a-button>

        <a-button @click="onGetByProductDetailImage">
          {{ $t('edit.getByGather') }}
        </a-button>

        <a-dropdown>
          <a-button :loading="localImageReplaceLoading">{{
            $t('edit.uploadLocalPictures')
          }}</a-button>
          <a-menu slot="overlay">
            <a-menu-item @click="onLocalImageReplace(1)">{{
              $t('edit.replaceSelectedImg')
            }}</a-menu-item>
            <a-menu-item @click="onLocalImageReplace(2)">{{
              $t('edit.fillPicture')
            }}</a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-button
          :loading="handleImagesStretchLoading"
          @click="onHandleImagesStretch"
        >
          {{ $t('edit.oneKeyStretch') }}
        </a-button>

        <a-button
          @click="onHandleImagesDownload"
          :loading="handleImagesDownloadLoading"
        >
          一键下载
        </a-button>

        <a-button @click="deleteProductImages">
          {{ $t('edit.clearAllImage') }}
        </a-button>
        <a-button @click="batchDeleteProductImages">
          {{ $t('edit.deleteBatches') }}
        </a-button>

        <a-button @click="onAddImageSpace" :loading="addImageSpaceLoading">
          添加到图片空间
        </a-button>
      </a-space>
      <p class="me-img-tips me-pt-1">
        {{ $t('edit.imageHelpMessage') }}
      </p>
      <div class="img-box">
        <div v-if="product.images && product.images.length" class="all-checked">
          <a-checkbox
            :indeterminate="calcIndeterminate"
            :checked="clacCheckAll"
            @change="onCheckAllChange"
            >全选</a-checkbox
          >
        </div>
        <!-- 图片编辑 -->
        <Draggable
          v-model="product.images"
          :options="{ animation: 500, sort: { default: true } }"
        >
          <!-- {{imgCheckedList}} -->
          <div
            class="me-product-images-warp me-mt-2 me-mr-2"
            :class="{ 'image-error': imageErrorCatch[index] }"
            v-for="(item, index) in product.images"
            @click="$ImagePreview(product.images, item)"
            :key="item"
            v-lazy:background-image="item"
          >
            <a-checkbox
              class="me-img-check"
              :checked="imgCheckedVal.includes(item)"
              :value="imgCheckedList[index].url"
              @click="(e) => e.stopPropagation()"
              @change="(e) => imgChange(e, index)"
            />
            <span
              class="me-img-size"
              v-if="
                imgSizeList.length &&
                  imgSizeList[index] &&
                  imgSizeList[index].width
              "
            >
              {{ imgSizeList[index].width }}*{{ imgSizeList[index].height }}
            </span>
            <div class="icon-box">
              <!-- <a @click.stop="openCollection(index)" class="collection-image">
              {{ $t('copy.caijitupian') }}
            </a> -->
              <a
                @click.stop="openEditImg(item, index)"
                class="iconfont iconedit me-img-icon"
              >
                <span>编辑图片</span>
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
            <div class="imgtitle" v-if="index == 0">
              <span style="color: red">*</span> {{ $t('edit.masterMap') }}
            </div>
            <div class="imgtitle images-item" v-else>
              {{ $t('edit.picture') }}{{ index }}
            </div>
          </div>
        </Draggable>
      </div>

      <template v-if="product.images && product.images.length < 9">
        <a-space>
          <div
            v-for="(item, index) in 9 - product.images.length"
            :key="item"
            style="width: 95px; margin-right: 2px"
          >
            <a-button
              @click="pushImage"
              :disabled="imageUploadLoading"
              class="me-product-upload me-mt-2 me-pa-0 btn-dashed"
            >
              <a-spin :spinning="imageUploadLoading">
                <a-icon slot="indicator" type="loading" />
                <template v-if="!imageUploadLoading">
                  <span class="iconfont icon-add-image"></span>
                </template>
              </a-spin>
            </a-button>
            <div class="btntitle">
              <span v-if="product.images.length == 0 && index == 0">
                <span style="color: red">*</span> {{ $t('edit.masterMap') }}
              </span>
              <span
                v-if="
                  (product.images.length == 0 && index != 0) ||
                    product.images.length != 0
                "
                class="images-item"
                >{{ $t('edit.picture')
                }}{{ index + product.images.length }}</span
              >
              <!-- <span v-if="product.images.length != 0 ">图{{ index + prodsuct.images.length }}</span> -->
            </div>
          </div>
        </a-space>
      </template>
    </a-form-model-item>

    <a-modal
      :visible="addWatermarkVisible"
      :title="$t('edit.addWatermark')"
      :footer="false"
      @cancel="addWatermarkVisible = false"
      :maskClosable="false"
      destroyOnClose
      width="70%"
    >
      <template slot="title">
        <span>{{ $t('appendWatermark.choose') }}</span>
        <span class="me-ml-2 sub-title">
          {{ $t('appendWatermark.message1') }}
        </span>
      </template>
      <SelectWatermarkTemplate @select="onTemplateSelect" />
    </a-modal>
  </a-form-model>
</template>

<script>
import { mapState } from 'vuex'
import Draggable from 'vuedraggable'
import { cloneDeep, uniq, difference } from 'lodash'
import Basic from '@/api/basic'
import Goods from '@/api/goods'
import Picture from '@/api/picture'
import { loadImage, getImageAbbt } from '@/util/document'
import { openZhihuiEditor } from '@/util'
import { ImgMerge, base64ToFile } from '@/util/canvas'
import SelectWatermarkTemplate from '@/views/goods/components/batchEditTabs/SelectWatermarkTemplate'
import { imagesDownload } from '@/util/handle'
import { getBase64, dataURLtoFile } from '@/util'
import { last, head } from 'lodash'

export default {
  data() {
    return {
      rules: {},
      mediaImageTransitionLoading: false,
      imageUploadLoading: false,
      handleImagesStretchLoading: false,
      handleImagesDownloadLoading: false,
      localImageReplaceLoading: false,
      addWatermarkLoading: false,
      addWatermarkVisible: false,
      imageErrorCatch: {},
      storeType: null, //店铺类型
      imgCheckedVal: [],
      imgSizeList: [],
      computedSize: true,
      indeterminate: false,
      checkAll: false,
      originImages: [],
      zhihuiEditorIndex: null,

      addImageSpaceLoading: false
    }
  },
  components: {
    Draggable,
    SelectWatermarkTemplate
  },
  model: {
    prop: 'product',
    event: 'input'
  },
  computed: {
    ...mapState({
      targetLangList: (state) => state.product.targetLangList
    }),
    editType() {
      return this.$route.query.edit
    },
    imgCheckedList: {
      get() {
        let imgChec = []
        this.$props.product.images.forEach((item) => {
          if (this.$data.imgCheckedVal.includes(item)) {
            imgChec.push({ url: item, checked: true })
          } else {
            imgChec.push({ url: item, checked: false })
          }
        })

        if (this.$data.computedSize) this.imgSize(imgChec)
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.$data.computedSize = true
        return imgChec
      }
    },
    erweima() {
      return require('@/assets/images/wechat-code-3.png')
    },
    calcIndeterminate() {
      return (
        this.imgCheckedList.some((item) => item.checked) &&
        this.imgCheckedVal.length < this.product.images.length
      )
    },
    clacCheckAll() {
      return this.imgCheckedList.every((item) => item.checked)
    }
  },
  props: {
    product: Object,
    labelCol: {
      type: Object,
      default: () => ({ span: 3 })
    },
    wrapperCol: {
      type: Object,
      default: () => ({ span: 12 })
    }
  },
  mounted() {
    const { storeId, merchantId } = this.$route.query
    this.storeType = storeId ? 'normal' : this.storeType
    this.storeType = merchantId ? 'cnsc' : this.storeType
    // this.$data.originImages = cloneDeep(this.$props.product.images)
  },
  methods: {
    //获取图片尺寸
    async imgSize(imglist) {
      let imgObj = []
      imglist.forEach((item) => {
        imgObj.push(item.url)
      })
      this.$data.imgSizeList = await getImageAbbt(imgObj)
    },
    //选中图片
    imgChange(val, index) {
      this.$data.computedSize = false
      if (val.target.checked) {
        this.$data.imgCheckedVal.push(val.target.value)
      } else {
        this.$data.imgCheckedVal = this.$data.imgCheckedVal.filter(
          (item) => item != val.target.value
        )
      }
    },
    setCheckAll() {
      setTimeout(() => {
        this.checkAll =
          !!this.imgCheckedVal.length &&
          this.imgCheckedVal.length === this.product?.images?.length
        this.indeterminate =
          !!this.imgCheckedVal.length &&
          this.imgCheckedVal.length < this.product?.images?.length
      })
    },
    //回填图片
    backfill(product, data) {
      if (this.$data.imgCheckedVal.length) {
        this.$data.imgCheckedVal
          .map((src) => product.images.indexOf(src))
          .forEach((index, _index) => {
            product.images[index] = data[_index]
          })
      }
      this.checkAll = false
      this.indeterminate = false
      this.$data.imgCheckedVal = []
      return product
    },
    /**媒体图片翻译 */
    async onTranslateMediaImage({ lang }) {
      if (!this.$data.imgCheckedVal.length) {
        this.$message.warning('请勾选要翻译的图片')
        return
      }
      const product = cloneDeep(this.$props.product)
      // 原逻辑lang===EN时,storeId不需要，现在需要
      const storeId = parseInt(this.$route.query.storeId)
      let { images, id } = product
      if (!images.every((item) => item)) {
        this.$message.error(this.$t('edit.transitionError'))
        return
      }
      if (this.$data.imgCheckedVal.length) {
        images = this.$data.imgCheckedVal
      }
      this.$data.mediaImageTransitionLoading = true

      var { data, code, message } = await Basic.handleTranslateImages({
        url: images,
        // storeId,
        id,
        to: lang
      })

      // 翻译成功给提示，否则有其他提示
      if (code == 0) {
        this.$message.success(message)
      }

      // code==1,当天翻译超过1000，不再翻译； code==-1,翻译量700~1000使用第二个缓慢翻译接口
      if (code == -1) {
        var record = await Basic.handleCacheImages({
          url: images,
          storeId,
          id,
          to: lang
        })
        this.$message.info(record.message)
      }

      if (code == 1) {
        this.$info({
          title:
            '你本日翻译次数已达上限，请明日再试，如有疑问请微信扫码添加客服运营人员',
          content: () => (
            <div>
              <img src={this.erweima} style="padding-left:55px" />
            </div>
          ),
          onOk() {},
          okText: '关闭'
        })
      }

      if (record) {
        data = record.data
      }

      if (data) {
        this.$emit('input', this.backfill(product, data))
      }
      this.$data.mediaImageTransitionLoading = false

      console.log(data, code, message)
    },
    /**从采集图片中获取 */
    onGetByProductDetailImage() {
      const product = cloneDeep(this.$props.product)
      let length = 9 - product.images.length
      if (this.$data.imgCheckedVal.length) {
        length = 9
      }

      if (!product.detailImgUrl || !product.detailImgUrl.length) {
        this.$message.error(this.$t('edit.notDetailImgUrlErrorMsg'))
        return
      }
      if (product.images.length == product.detailImgUrl.length) {
        this.$message.error('暂无可用图片')
        return
      }

      this.$ImageChoose(
        difference(product.detailImgUrl, product.images),
        length
      ).then((sources) => {
        if (sources !== undefined) {
          // const _images = [...product.images, ...sources]
          // product.images = _images
          if (this.$data.imgCheckedVal.length) {
            this.$emit('input', this.backfill(product, sources))
          } else {
            const _images = [...product.images, ...sources]
            product.images = _images
            this.$emit('input', product)
          }
        }
        this.$emit('input', product)
      })
    },
    /**从本地图片替换 */
    onLocalImageReplace(val) {
      if (val == 1 && !this.$data.imgCheckedVal.length) {
        this.$message.warning('请勾选要替换的图片')
        return
      }
      const product = cloneDeep(this.$props.product)
      let len = 9
      if (val == 2 && product.images.length >= 9) {
        this.$message.warning('已经有9张图，请删除后再填充')
        return false
      }
      if (val == 2) {
        len = 9 - product.images.length
      }
      loadImage({ multiple: true }, (files) => {
        files = Array.from(files).slice(0, len)
        const formData = new FormData()
        files.forEach((e) => formData.append('file', e))
        this.$data.localImageReplaceLoading = true
        Basic.handleUploadImages(formData)
          .then(({ data }) => {
            if (val == 1) {
              this.$emit('input', this.backfill(product, data))
            } else {
              product.images.push(...data)
              this.$emit('input', product)
            }
          })
          .finally(() => {
            this.$data.imgCheckedVal = []
            this.$data.localImageReplaceLoading = false
          })
      })
      // }else{
      //   this.$message.warning('已经有9张图，请删除后再填充')
      // }
    },
    /**一键拉伸 */
    onHandleImagesStretch() {
      if (!this.$data.imgCheckedVal.length) {
        this.$message.warning('请勾选要拉伸的图片')
        return
      }
      const product = cloneDeep(this.$props.product)
      this.$data.handleImagesStretchLoading = true
      let { storeId, id, images } = product
      if (this.$data.imgCheckedVal.length) {
        images = this.$data.imgCheckedVal
      }
      // 在线商品，图片拉伸，有在线图片和本地上传图片一起进行拉伸的时候，提示只能拉伸本地图片
      let params = { storeId, id, list: images }
      Goods.handleBatchPull(params)
        .then(({ data, message }) => {
          // product.images = data.list
          this.$emit('input', this.backfill(product, data.list))
          console.log(data)
          if (message) {
            // if (this.editType == 1) {
            this.$message.info(message)
            // }
          } else {
            this.$message.success(this.$t('edit.handlerComplete'))
          }
        })
        .finally(() => {
          this.$data.handleImagesStretchLoading = false
        })
    },
    /**一键下载 */
    onHandleImagesDownload() {
      this.$data.handleImagesDownloadLoading = true
      const imgs = this.$data.imgCheckedVal
      imagesDownload(imgs, this.product.name)
        .then(() => {
          this.$message.success('下载成功')
        })
        .catch((error) => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$data.handleImagesDownloadLoading = false
        })
    },

    /**清空所有图片 */
    deleteProductImages() {
      const product = cloneDeep(this.$props.product)
      product.images = []
      this.$data.imgCheckedVal = []
      this.$emit('input', product)
    },
    //批量删除
    batchDeleteProductImages() {
      if (!this.$data.imgCheckedVal.length) {
        this.$message.warning('请勾选要删除的图片')
        return
      }
      const product = cloneDeep(this.$props.product)
      product.images = difference(product.images, this.$data.imgCheckedVal)
      this.$data.imgCheckedVal = []
      this.$emit('input', product)
    },
    /**打开采集图片 */
    openCollection(index) {
      const product = cloneDeep(this.$props.product)
      this.$ImageChoose(product.detailImgUrl, 1).then(([src]) => {
        if (src !== undefined) {
          product.images[index] = src
        }
        this.$emit('input', product)
      })
    },

    /**打开智绘泰山  */
    async openEditImg(item, index) {
      let img = this.imgSizeList[index]
      if (!img) {
        // 获取图片宽高
        img = new Image()
        img.src = item
      }
      if (!item || !img.width) {
        this.$message.error('请上传图片, 再编辑!')
        return
      }
      // openZhihuiEditor方法里new ZhihuiEditor会返回index第一次值
      this.zhihuiEditorIndex = index
      openZhihuiEditor(item, img, (res) => {
        /** 编辑图片完成 */
        const product = cloneDeep(this.$props.product)
        product.images[this.zhihuiEditorIndex] = 'https:' + res.url
        this.imgSizeList[this.zhihuiEditorIndex].width = res.width
        this.imgSizeList[this.zhihuiEditorIndex].height = res.height
        this.$emit('input', product)
      })
    },
    /**选择本地图片替换 */
    releaseImagesItem(index) {
      const product = cloneDeep(this.$props.product)
      loadImage({}, async (files) => {
        const formData = new FormData()
        formData.append('file', files[0])
        const { data } = await Basic.handleUploadImages(formData)
        product.images[index] = data[0]
        this.$data.imgCheckedVal = []
        this.$emit('input', product)
      })
    },
    /**删除图片 */
    removeImagesItem(index) {
      const product = cloneDeep(this.$props.product)
      let url = product.images.splice(index, 1)
      this.$emit('input', product)
      this.$data.imgCheckedVal = this.$data.imgCheckedVal.filter(
        (item) => item != url[0]
      )
    },
    /**添加图片 */
    pushImage() {
      const product = cloneDeep(this.$props.product)
      loadImage({ multiple: true, maxSize: 2 }, async (files) => {
        const length = 9 - product.images.length
        files = Array.from(files).slice(0, length)
        const formData = new FormData()
        files.forEach((e) => formData.append('file', e))
        const { data } = await Basic.handleUploadImages(formData)
        product.images.push(...data)
        this.$emit('input', product)
      })
    },
    /**校验图片张数 */
    validLen() {
      return new Promise((resolve) => {
        const product = cloneDeep(this.$props.product)
        if (product.images && product.images.length) {
          resolve(true)
        } else {
          resolve(false)
        }
        this.$emit('input', product)
      })
    },
    /**校验重复 */
    validRepeat() {
      const product = this.$props.product
      return new Promise((resolve) => {
        const { imageErrorCatch } = this.$data
        product.images.reduce((prev, current, index) => {
          const inc = prev.includes(current)
          if (inc) {
            this.$set(imageErrorCatch, index, true)
          } else {
            this.$set(imageErrorCatch, index, false)
          }
          return [...prev, current]
        }, [])

        if (uniq(product.images).length === product.images.length) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    },
    /**添加水印 */
    onTemplateSelect(template) {
      const { cover, templateScope } = template
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
      const mimages = product.images.map((image, index) => {
        if (templateScope == 1) {
          if (index === 0) {
            return mergeImage([image, cover])
          } else {
            return mergeImage([image])
          }
        } else {
          return mergeImage([image, cover])
        }
      })
      Promise.all(mimages).then((rimg) => {
        const files = rimg.map((image) => base64ToFile(image))
        let formData = new FormData()
        files.forEach((file) => {
          formData.append('file', file)
        })
        Basic.handleUploadImages(formData)
          .then(({ data }) => {
            product.images = data
            this.$emit('input', product)
          })
          .finally(() => {
            this.$data.addWatermarkLoading = false
          })
      })
    },
    // 校验图片大小
    validateImgSize() {
      const { imageErrorCatch } = this
      let flag = true
      this.imgSizeList.forEach((item, index) => {
        if (item.width > 1024 || item.height > 1024) {
          flag = false
          this.$set(imageErrorCatch, index, true)
        }
      })
      return flag
    },
    /**校验 */
    async validate() {
      const product = cloneDeep(this.$props.product)
      product._images_valid_ = null
      let vlen
      let vrep
      // let vSize
      try {
        vlen = await this.validLen()
        vrep = await this.validRepeat()
        // vSize = await this.validateImgSize()
      } catch (error) {
        return Promise.reject(this.$t('edit.mediaInfoValidError'))
      }
      //  && vSize
      if (vlen && vrep) {
        this.$emit('input', product)
        return Promise.resolve(true)
      } else {
        if (!vlen) {
          product._images_valid_ = this.$t('edit.transitionError')
          return Promise.reject(this.$t('edit.transitionError'))
        }
        if (!vrep) {
          product._images_valid_ = this.$t('edit.imageValidError')
          return Promise.reject(this.$t('edit.imageValidError'))
        }
        // if (!vSize) {
        //   const error = this.$t('edit.imageSize', {
        //     width: 1024,
        //     height: 1024
        //   })
        //   product._images_valid_ = error
        //   return Promise.reject(error)
        // }
        this.$emit('input', product)
        return Promise.reject(this.$t('edit.mediaInfoValidError'))
      }
    },
    onCheckAllChange(e) {
      const checked = e.target.checked
      this.indeterminate = false
      this.checkAll = checked
      if (checked) {
        this.imgCheckedVal = [...this.product.images]
      } else {
        this.imgCheckedVal = []
      }
    },
    /**添加到图片空间 */
    onAddImageSpace() {
      if (!this.imgCheckedVal.length) {
        return this.$message.error('请至少选择一张图片')
      }
      const files = this.imgCheckedVal
        .map(async (url) => {
          const name = head(last(url.split('/')).split('.'))
          const base64 = await getBase64(url)
          return { name, base64 }
        })
        .map(async (res) => {
          const { base64, name } = await res
          return await dataURLtoFile(base64, name)
        })
      this.addImageSpaceLoading = true
      Promise.all(files).then((files) => {
        const fd = new FormData()
        files.forEach((file) => {
          fd.append('file', file)
        })
        Picture.uploadImage(fd)
          .then((res) => {
            this.$message.success(`成功添加 ${res.data.length} 张图片`)
            this.imgCheckedVal = []
          })
          .finally(() => {
            this.addImageSpaceLoading = false
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btntitle {
  text-align: center;
  width: 95px;
  height: 30px;
  line-height: 30px;
  margin-top: 9px;
}
.images-item {
  color: #909099;
}
.btn-dashed {
  border: 1px dashed #dcdcdc;
}
.me-product-images-warp {
  width: 95px;
  height: 95px;
  background-position: center;
  background-size: cover;
  cursor: pointer;
  background-color: #f0f0f1;
  float: left;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0);
  margin-bottom: 35px;
  cursor: move;
  .imgtitle {
    position: absolute;
    text-align: center;
    width: 95px;
    height: 20px;
    bottom: -35px;
    line-height: 20px;
  }

  &.image-error {
    border: 1px solid #f5222d;
  }

  .icon-box {
    opacity: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 24px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 10px;
    cursor: pointer;
    .iconfont {
      color: #ffffff;
    }

    .collection-image {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -80px);
      width: 60px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      color: #ffffff;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 3px;
    }
  }

  &:hover {
    .icon-box {
      opacity: 1;
    }
  }
}

.me-product-upload {
  text-align: center;
  display: inline-block;
  width: 95px;
  height: 95px;
  background-color: #fff;
  cursor: pointer;
  border-radius: 0;

  .icon-add-image {
    font-size: 14px;
    line-height: 100px;
    color: #aeaeae;
  }
}

.me-img-icon {
  position: relative;
  > span {
    position: absolute;
    left: 0px;
    top: -50px;
    width: 70px;
    line-height: 14px;
    padding: 5px 0;
    text-align: center;
    color: #ffffff;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 3px;
    display: none;
    font-size: 14px;
  }
  &:hover > span {
    display: block;
  }
}
.iconrelease {
  > span {
    left: -26px;
  }
}
.iconremove {
  > span {
    left: -52px;
  }
}
.me-img-check {
  position: absolute;
  top: 4px;
  right: 4px;
  line-height: 12px;
  ::v-deep .ant-checkbox-input {
    width: 25px;
    height: 25px;
    margin: -5px 0 0 -5px;
  }
}
.me-img-size {
  position: absolute;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  line-height: 12px;
  font-size: 12px;
  padding: 3px;
}
.me-img-tips {
  font-size: 12px;
  line-height: 12px;
  color: #bfbfbf;
}
.img-box {
  position: relative;
  .all-checked {
    position: absolute;
    left: -60px;
  }
}
.button-group {
  flex-wrap: wrap;
}
</style>
