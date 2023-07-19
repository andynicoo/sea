<template>
  <div>
    <BaseTable
      :columns="getColumns"
      :dataSource="dataSource"
      :pagination="getPagination"
      :loading="tableLoading"
      :rowSelection="rowSelection"
      :onCancel="onCancel"
      :onSave="onSave"
      :onPreview="onPreview"
      :onChange="onChange"
      :saveBtnText="$t('batchEditOption.save')"
      :saveMsg="$t('common.batchEditSuccess')"
      :btnStyle="btnStyle"
      @initData="initData"
    >
      <template v-slot:before="{ record }">
        <div style="width: 300px">
          <ImageSwiper :sources="record.images" />
        </div>
      </template>
      <template v-slot:after="{ record }">
        <div style="width: 300px">
          <template v-if="record._images_ && record._images_.length">
            <ImageSwiper :sources="record._images_" />
          </template>
        </div>
      </template>
      <template>
        <a-form
          :form="form"
          :label-col="{ span: 2 }"
          :wrapper-col="{ span: 22 }"
        >
          <a-form-item :label="$t('appendWatermark.chooseScoped')">
            <a-radio-group v-decorator="['scoped', { initialValue: 1 }]">
              <a-radio :value="1">
                {{ $t('appendWatermark.appendbefor') }}
              </a-radio>
              <a-radio :value="2">
                {{ $t('appendWatermark.appendall') }}
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :label="$t('appendWatermark.choose')"
            :validate-status="settingWatermarkValid && 'error'"
            :help="settingWatermarkValid"
          >
            <div
              class="me-transform-background me-ib me-mr-2"
              v-if="currentCover"
            >
              <a-popover placement="right">
                <template slot="content">
                  <div class="me-transform-background">
                    <img
                      style="width: 290px; height: 290px"
                      v-lazy="currentCover"
                    />
                  </div>
                </template>
                <img style="width: 90px; height: 90px" v-lazy="currentCover" />
              </a-popover>
            </div>
            <a-button @click="templateVisible = true" type="primary">
              {{ $t('appendWatermark.choose') }}
            </a-button>
          </a-form-item>
        </a-form>
      </template>
    </BaseTable>

    <a-modal
      :visible="templateVisible"
      :footer="null"
      width="1228px"
      destroyOnClose
      @cancel="templateVisible = false"
    >
      <template slot="title">
        <span>{{ $t('appendWatermark.choose') }}</span>
        <span class="me-ml-2 sub-title">
          {{ $t('appendWatermark.message1') }}
        </span>
      </template>
      <SelectWatermarkTemplate @select="onTemplateSelect" />
    </a-modal>
  </div>
</template>

<script>
/**添加水印 */
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import { ImgMerge, base64ToFile } from '@/util/canvas'
import ImageSwiper from './ImageSwiper'
import SelectWatermarkTemplate from './SelectWatermarkTemplate'
import { cloneDeep } from 'lodash'
import Basic from '@/api/basic'
import Goods from '@/api/goods'

export default {
  mixins: [batchEditMixins],
  components: { BaseTable, ImageSwiper, SelectWatermarkTemplate },
  data() {
    return {
      btnStyle: {
        top: 10,
        left: 90
      },
      form: this.$form.createForm(this),
      templateVisible: false,
      currentCover: null,
      settingWatermarkValid: null
    }
  },
  methods: {
    getTableDataAfter() {
      const { dataSource } = this.$data
      this.$data.dataSource = dataSource.map((element) => {
        if (!Array.isArray(element.images)) {
          // eslint-disable-next-line no-useless-escape
          if (/^\[\"http(s)?:\/\//.test(element.images)) {
            element.images = JSON.parse(element.images)
          }
          if (/^http(2)?:\/\//.test(element.images)) {
            element.images = element.images.split(',')
          }
        }
        return element
      })
    },
    /**取消 */
    onCancel() {
      this.$emit('cancel')
    },
    /**保存 */
    async onSave() {
      const { selectedRowKeys, dataSource } = this.$data
      this.setDefaultValue()
      let _data = cloneDeep(dataSource)
        .map((element) => {
          /**过滤选中项 */
          if (selectedRowKeys.includes(element.id)) {
            return element
          } else {
            this.$set(element, '_images_', cloneDeep(element.images))
          }
        })
        .filter(Boolean)
        .map(async (element) => {
          let _images_ = element._images_.map(async (image) => {
            /**base64图片上传 */
            if (/^data:image\/(jpeg|png|jpg);base64/.test(image)) {
              const file = base64ToFile(image)
              let formData = new FormData()
              formData.append('file', file)
              const { data } = await Basic.handleUploadImages(formData)
              return data[0]
            }
            return image
          })
          _images_ = await Promise.all(_images_)
          _images_ = JSON.stringify(_images_)
          element._images_ = _images_
          element.images = _images_
          return element
        })
      _data = await Promise.all(_data)
      await Goods.handleEditBatch(_data)
    },
    /**预览 */
    async onPreview() {
      const { dataSource, currentCover, form } = this.$data
      this.$data.settingWatermarkValid = null
      if (!currentCover) {
        this.$data.settingWatermarkValid = this.$t('appendWatermark.valid1')
        return
      }
      this.setDefaultValue()
      const scoped = form.getFieldValue('scoped')
      const ress = dataSource.map((element) => {
        if (Array.isArray(element.images)) {
          const images = element.images.map((image, index) => {
            if (scoped === 1) {
              if (index === 0) {
                return this.mergeImage([image, currentCover])
              } else {
                return image
              }
            } else {
              return this.mergeImage([image, currentCover])
            }
          })
          return new Promise((resolve) => {
            Promise.all(images).then((ress) => {
              this.$set(element, '_images_', ress)
              resolve()
            })
          })
        }
      })
      return await Promise.all(ress)
    },
    /**设置初始值 */
    setDefaultValue() {
      const { dataSource } = this.$data
      dataSource.forEach((element) => {
        if (!element._change_) {
          this.$set(element, '_change_', true)
          this.$set(element, '_images_', cloneDeep(element.images))
        }
      })
    },
    /**模板选择 */
    onTemplateSelect({ cover }) {
      this.$data.currentCover = cover
      this.$data.templateVisible = false
    },
    /**合并图片 */
    mergeImage(images) {
      return new Promise((resolve) => {
        const imgMerge = new ImgMerge({ width: 800, height: 800 })
        imgMerge.drawImg(images).then(async () => {
          const img = imgMerge.outputImg()
          resolve(img)
        })
      })
    },
    initData() {
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-title {
  font-size: 10px;
  color: #ff8859;
}
</style>
