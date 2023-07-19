<template>
  <div class="me-watermark-template">
    <a-row style="width: 100%" :gutter="[8, 8]">
      <a-col :span="3">
        <a-space direction="vertical" class="me-actions">
          <a-button type="primary" block @click="onPushImage">
            {{ $t('watermarkTmp.appendimage') }}
          </a-button>
          <a-button type="primary" block @click="onPushText">
            {{ $t('watermarkTmp.appendtext') }}
          </a-button>
        </a-space>
      </a-col>
      <a-col :span="13">
        <div :style="{ backgroundImage: `url(${bgImage})` }">
          <canvas width="600" height="600" :id="uuid" />
        </div>
      </a-col>
      <a-col :span="8">
        <template v-if="currentData">
          <template v-if="currentData.type === 'i-text'">
            <p class="me-action-handle me-text-center">
              {{ $t('watermarkTmp.texthandler') }}
            </p>
          </template>
          <template v-else-if="currentData.type === 'image'">
            <p class="me-action-handle me-text-center">
              {{ $t('watermarkTmp.imagehandler') }}
            </p>
          </template>
          <template v-else>
            <p class="me-action-handle me-text-center">
              {{ $t('watermarkTmp.sethandler') }}
            </p>
          </template>
          <a-form-model
            :model="currentData"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
          >
            <template v-if="currentData.type === 'i-text'">
              <a-form-model-item :label="$t('watermarkTmp.color')">
                <input
                  type="color"
                  class="color-picker me-mt-1"
                  v-model="currentData.fill"
                  @input="onParamsChange"
                />
              </a-form-model-item>
              <a-form-model-item :label="$t('watermarkTmp.size')">
                <a-input
                  @input="onParamsChange"
                  suffix="px"
                  v-model="currentData.fontSize"
                />
              </a-form-model-item>
              <a-form-model-item :label="$t('watermarkTmp.spacing')">
                <a-slider
                  :max="3000"
                  :min="0"
                  :step="1"
                  @change="onParamsChange"
                  v-model="currentData.charSpacing"
                />
              </a-form-model-item>
              <a-form-model-item :label="$t('watermarkTmp.lineheight')">
                <a-slider
                  :max="3"
                  :min="0"
                  :step="0.01"
                  @change="onParamsChange"
                  v-model="currentData.lineHeight"
                />
              </a-form-model-item>
            </template>
            <a-form-model-item :label="$t('watermarkTmp.opacity')">
              <a-slider
                :max="1"
                :min="0"
                :step="0.01"
                @change="onParamsChange"
                v-model="currentData.opacity"
              />
            </a-form-model-item>
            <a-form-model-item :label="$t('watermarkTmp.angle')">
              <a-slider
                :max="360"
                :min="0"
                :step="1"
                @change="onParamsChange"
                v-model="currentData.angle"
              />
            </a-form-model-item>

            <a-form-model-item>
              <a-button @click="deleteContextItem">
                <a-icon type="delete" />
                删除
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </template>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { fabric } from 'fabric'
import { loadImage } from '@/util/document'
import { createImage, ImgurlToBase64 } from '@/util/canvas'
import Basic from '@/api/basic'

const bgImage = `https://mr-wang-xmall.oss-cn-shenzhen.aliyuncs.com/watermark_base_map.ab70be45.jpg`

export default {
  props: {
    objects: String
  },
  data() {
    return {
      bgImage,
      uuid: uuidv4(),
      canvas: null,
      currentTarget: null,
      currentData: null,
      form: {}
    }
  },
  async mounted() {
    this.render()
  },
  methods: {
    /**重新渲染 */
    async render() {
      let { canvas } = this.$data
      const { objects } = this.$props
      if (!canvas) {
        canvas = new fabric.Canvas(this.$data.uuid)
        this.canvas = canvas
      }

      if (objects) {
        canvas.loadFromJSON(JSON.parse(objects))
      }
      canvas.on('mouse:down', () => {
        this.onChange()
      })
      canvas.on('mouse:up', () => {
        this.onChange()
      })
    },
    /**上传图片 */
    onPushImage() {
      loadImage({}, async ([image]) => {
        let formData = new FormData()
        formData.append('file', image)
        const { data } = await Basic.handleUploadImages(formData)
        this.pushImage(data[0])
      })
    },
    /**输入文字 */
    onPushText() {
      this.pushText('双击可编辑文字')
    },
    /**添加图片 */
    async pushImage(src, options = {}) {
      let { canvas } = this.$data
      const image = await createImage(src)
      var imgInstance = new fabric.Image(image, options)
      canvas.add(imgInstance)
    },
    /**添加文字 */
    pushText(text, options = {}) {
      let { canvas } = this.$data
      const textInstance = new fabric.IText(text, options)
      canvas.add(textInstance)
    },
    /**提交改变 */
    commitChange() {
      let { canvas } = this.$data
      const { objects } = canvas.toJSON()
      this.$emit('change', objects)
    },
    onParamsChange() {
      const { currentData, currentTarget, canvas } = this.$data
      if (!currentTarget) return
      if (currentData.fill) {
        currentTarget.set('fill', currentData.fill)
      }
      if (currentData.charSpacing) {
        currentTarget.set('charSpacing', currentData.charSpacing)
      }
      if (currentData.lineHeight) {
        currentTarget.set('lineHeight', currentData.lineHeight)
      }
      if (currentData.fontSize) {
        currentTarget.set('fontSize', currentData.fontSize)
      }
      if (currentData.opacity) {
        currentTarget.set('opacity', currentData.opacity)
      }
      if (currentData.angle) {
        currentTarget.rotate(currentData.angle)
      }
      canvas.renderAll()
    },
    /**改变事件 */
    onChange() {
      const { canvas } = this.$data
      const current = canvas.getActiveObject()
      if (current) {
        const angle = current.angle
        const opacity = current.opacity
        const type = current.type
        const fontSize = current.fontSize
        const text = current.text
        const fill = current.fill
        const charSpacing = current.charSpacing
        const lineHeight = current.lineHeight
        this.$data.currentTarget = current
        this.$data.currentData = {
          angle,
          opacity,
          type,
          fontSize,
          text,
          fill,
          charSpacing,
          lineHeight
        }
      } else {
        this.$data.currentTarget = null
        this.$data.currentData = null
      }
    },
    /**删除元素 */
    deleteContextItem() {
      const { canvas, currentTarget } = this.$data
      if (currentTarget._objects) {
        currentTarget._objects.forEach((element) => {
          canvas.remove(element)
        })
      } else {
        canvas.remove(currentTarget)
      }
      this.$data.currentTarget = null
      this.$data.currentData = null
    },
    toJSON() {
      const { canvas } = this.$data
      canvas.discardActiveObject()
      canvas.renderAll()
      return canvas.toJSON()
    },
    toDataURL() {
      const { canvas } = this.$data
      canvas.discardActiveObject()
      canvas.renderAll()
      return canvas.toDataURL('image/png')
    }
  }
}
</script>

<style lang="scss" scoped>
.me-watermark-template {
  display: flex;
}
.color-picker {
  border: 1px solid rgba(0, 0, 0, 0.25);
  padding: 0 2px;
  border-radius: 4px;
  height: 32px;
  width: 100%;
}

.me-action-handle {
  font-size: 19px;
  font-weight: 500;
  margin-bottom: 20px;
}

.me-actions {
  width: 100%;
}
</style>