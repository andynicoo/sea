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
      <template v-slot:lashen="{ record }">
        <template>
          <div>
            <a-button
              :loading="record._lashening"
              class="me-pa-1"
              type="link"
              @click="onHandleImagesStretch(record)"
            >
              <span v-if="record._lashened">已拉伸</span>
              <span v-else>一键拉伸</span>
            </a-button>
          </div>
        </template>
      </template>
      <template v-slot:before="{ record }">
        <template>
          <div style="width: 300px;">
            <ImageSwiper
              :sources="record.images"
              :size="{ width: '70px', height: '70px' }"
            />
          </div>
        </template>
      </template>
      <template v-slot:after="{ record }">
        <!-- {{ record._images_ }} -->
        <div v-if="record._images_ != undefined" style="width: 300px;">
          <ImageSwiper :sources="record._images_" v-if="reFresh" />
        </div>
      </template>

      <template>
        <a-form-model :form="form">
          <a-button type="primary" @click="quickSetTran">
            图片高级处理
          </a-button>
          <a-row>
            <a-col :span="24">
              <a-radio-group v-model="value">
                <a-radio class="radioStyle" :value="1">
                  <span class="tit">{{ $t('toBeEdit.deleteqian') }}</span
                  ><a-input-number
                    :step="1"
                    :min="1"
                    class="input"
                    :precision="0"
                    v-model="form.qian"
                    type="Number"
                  />
                  {{ $t('toBeEdit.jizhang') }}
                  <span class="tit">{{ $t('toBeEdit.deletehou') }}</span
                  ><a-input-number
                    :step="1"
                    :min="1"
                    class="input"
                    :precision="0"
                    v-model="form.hou"
                    type="Number"
                  />
                  {{ $t('toBeEdit.jizhang') }}
                </a-radio>
                <a-radio class="radioStyle" :value="2">
                  <span class="tit">{{ $t('toBeEdit.jiang') }}：</span
                  ><a-input-number
                    :step="1"
                    :min="1"
                    :precision="0"
                    class="input"
                    v-model="form.jiang"
                    type="Number"
                  />
                  {{ $t('toBeEdit.shewei') }}
                </a-radio>
                <a-radio class="radioStyle" :value="3">
                  <span class="tit">{{ $t('toBeEdit.addzhutu') }}</span>
                  <div
                    class="product-upload y"
                    v-if="httpurl != ''"
                    @click="imgVisible = true"
                  >
                    <img
                      :src="httpurl"
                      v-if="httpurl != ''"
                      style="width: 45px; height: 45px"
                    />
                  </div>
                  <div
                    v-else
                    class="product-upload n"
                    @click="imgVisible = true"
                  >
                    <span class="iconfont icon-add-image"></span>
                  </div>
                  <span class="tit"> {{ $t('toBeEdit.daole') }} </span>
                  <!-- {{form.diji}} -->
                  <a-select
                    v-model="form.diji"
                    class="select"
                    placeholder="please select your zone"
                  >
                    <a-select-option
                      v-for="item in addImgOption"
                      :value="item.value"
                      :key="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-radio>
              </a-radio-group>
            </a-col>
          </a-row>
        </a-form-model>
      </template>
    </BaseTable>
    <a-modal
      v-model="imgVisible"
      :title="$t('toBeEdit.shangchuan')"
      :width="600"
      :maskClosable="false"
      destroyOnClose
      :footer="null"
    >
      <div class="me-uploadimg">
        <a-card
          :title="$t('toBeEdit.fangshi1')"
          style="width: 300px"
          class="center me-text-center me-mb-4"
        >
          <a-button type="primary" @click="uploadImage">
            {{ $t('toBeEdit.bendi') }}
          </a-button>
        </a-card>

        <a-card
          :title="$t('toBeEdit.fangshi2')"
          style="width: 300px"
          class="center me-text-center"
        >
          <a-textarea
            v-model="intnetImg"
            :placeholder="$t('toBeEdit.inputUrl')"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
          <a-button type="primary" class="me-mt-2" @click="checkIntnetImg">
            {{ $t('common.ok') }}
          </a-button>
        </a-card>
      </div>
    </a-modal>

    <!-- 快速设置/翻译 -->
    <a-modal
      :visible="quickSetVisible"
      :title="$t('searchForm.quickSetTran')"
      :confirm-loading="quickSetLoading"
      @cancel="quickSetVisible = false"
      :maskClosable="false"
      destroyOnClose
      :width="1200"
      :footer="null"
      :bodyStyle="{ padding: '10px 16px 20px' }"
    >
      <QuickSet
        ref="quickSet"
        :list="quickSetGoods"
        @func="quickSetVisible = false"
        @funclose="loadTable"
      >
      </QuickSet>
    </a-modal>
  </div>
</template>

<script>
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import { loadImage } from '@/util/document'
import Basic from '@/api/basic'
import Goods from '@/api/goods'
import { cloneDeep } from 'lodash'
import ImageSwiper from './ImageSwiper'
import QuickSet from './../QuickSet'

export default {
  mixins: [batchEditMixins],
  components: { BaseTable, ImageSwiper, QuickSet },
  data() {
    return {
      btnStyle: {
        top: 30,
        left: 79
      },
      value: 1,
      form: {
        qian: '', // 删除前几张
        hou: '', // 删除后几张
        jiang: '', // 将第几张图设为第一张
        diji: 1 //上传图片到第几张
      },
      addImgOption: [
        {
          value: 1,
          label: this.$t('toBeEdit.imgOption', { title: 1 })
        },
        {
          value: 2,
          label: this.$t('toBeEdit.imgOption', { title: 2 })
        },
        {
          value: 3,
          label: this.$t('toBeEdit.imgOption', { title: 3 })
        },
        {
          value: 4,
          label: this.$t('toBeEdit.imgOption', { title: 4 })
        },
        {
          value: 5,
          label: this.$t('toBeEdit.imgOption', { title: 5 })
        },
        {
          value: 6,
          label: this.$t('toBeEdit.imgOption', { title: 6 })
        },
        {
          value: 7,
          label: this.$t('toBeEdit.imgOption', { title: 7 })
        },
        {
          value: 8,
          label: this.$t('toBeEdit.imgOption', { title: 8 })
        },
        {
          value: 9,
          label: this.$t('toBeEdit.imgOption', { title: 9 })
        }
      ],
      defaultImg: require('@/assets/images/loading-img.png'),
      imgVisible: false,
      httpurl: '', // 上传图片返回路径
      intnetImg: '', // 网络图片
      reviewLoading: false,
      reFresh: true,
      quickSetVisible: false,
      quickSetLoading: false,
      quickSetGoods: [],
      country: [
        { key: 'SG', name: this.$t('common.SG') },
        { key: 'PH', name: this.$t('common.PH') },
        { key: 'MY', name: this.$t('common.MY') },
        { key: 'ID', name: this.$t('common.ID') },
        { key: 'TH', name: this.$t('common.TH') },
        { key: 'VN', name: this.$t('common.VN') },
        { key: 'BR', name: this.$t('common.BR') },
        { key: 'TW', name: this.$t('common.TW') }
      ]
    }
  },
  mounted() {
    // // 商品主图添加一键拉伸
    this.$data.basicColumns.splice(2, 0, {
      title: '一键拉伸',
      dataIndex: 'lashen',
      width: '100px',
      scopedSlots: { customRender: 'lashen' }
    })
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
        this.$set(
          element,
          'siteName',
          (this.country.find(({ key }) => key == element.countryCode) || {})
            .name
        )
        return element
      })
    },
    checkNum(val) {
      const reg = new RegExp('.', 'g')
      this.$data.form[val].toString().replace(reg, '')
    },
    /**取消 */
    onCancel() {
      this.$emit('cancel')
    },
    async onHandleImagesStretch(record) {
      if (!record.images.length) {
        this.$message.warning('无拉伸图片！')
        return
      }
      this.$set(record, '_lashening', true)

      // 在线商品，图片拉伸，有在线图片和本地上传图片一起进行拉伸的时候，提示只能拉伸本地图片
      let { storeId, id, images } = record
      let params = { storeId, id, list: images }
      await Goods.handleBatchPull(params)
        .then(({ data, message }) => {
          record.images = data.list
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
          this.$set(record, '_lashening', false)
        })
      let recordNew = cloneDeep(record)
      recordNew.images = JSON.stringify(recordNew.images)
      // 一键翻译后直接保存
      let res = await Goods.handleEditBatch([recordNew])
      this.$set(record, '_lashened', true)
    },
    /**设置默认值 */
    setDefaultValu() {
      const { dataSource } = this.$data
      dataSource.forEach((element) => {
        if (!element._change_) {
          this.$set(element, '_images_', element.images)
          this.$set(element, '_change_', true)
        }
      })
    },
    /**保存 */
    async onSave() {
      this.setDefaultValu()
      const { dataSource, selectedRowKeys } = this.$data
      let data = cloneDeep(
        dataSource.filter(({ id }) => selectedRowKeys.includes(id))
      )
      // eslint-disable-next-line no-constant-condition
      if (true) {
        data = data.map((ele) => {
          ele.images = JSON.stringify(ele._images_)
          ele.siteName = null
          return ele
        })
        let res = await Goods.handleEditBatch(data)
      }

      console.log(data)
    },
    /**预览 */
    onPreview() {
      this.setDefaultValu()
      if (this.$data.value == 3 && this.$data.httpurl == '') {
        this.$message.error(this.$t('toBeEdit.inputUrl'))
        return false
      }
      const { form, dataSource } = this.$data
      const { qian, hou, jiang, diji } = form
      this.$data.dataSource = dataSource.map((ele) => {
        this.reFresh = false
        this.$set(ele, '_images_', ele.images)
        var length = ele._images_.length
        // 删除前几涨，删除后几张
        this.$nextTick(() => {
          if (this.$data.value == 1) {
            if (
              Number(qian) + Number(hou) > length ||
              Number(qian) + Number(hou) == length
            ) {
              ele._images_ = []
            } else if (qian && hou) {
              ele._images_.splice(0, Number(qian))
              length = ele._images_.length
              ele._images_.splice(length - Number(hou), length)
            } else if (qian) {
              ele._images_.splice(0, Number(qian))
            } else if (hou) {
              ele._images_.splice(length - Number(hou), length)
            }
          }
          // 将第几张图设为第一张
          if (jiang && this.$data.value == 2) {
            let coverImage = cloneDeep(ele.images)
            if (jiang <= length) {
              ele._imagestemp_ = ele._images_[Number(jiang) - 1]
              ele._images_.splice(Number(jiang) - 1, 1)
              ele._images_ = [ele._imagestemp_].concat(ele._images_)
            }
            ele.images = coverImage
          }
          if (this.$data.value == 3) {
            // ele._images_ = JSON.parse(ele.images)
            ele._images_.splice(this.$data.form.diji - 1, 0, this.$data.httpurl)
          }
          this.reFresh = true
        })
        return ele
      })
    },
    handleimgOk() {
      this.$data.imgVisible = false
    },
    uploadImage() {
      loadImage({ multiple: false }, async (files) => {
        files = Array.from(files).slice(0, 1)
        const formData = new FormData()
        files.forEach((e) => {
          formData.append('file', e)
        })
        var { data } = await Basic.handleUploadImages(formData)
        this.$data.httpurl = data[0]
        this.$data.imgVisible = false
      })
    },
    checkIntnetImg() {
      if (
        !/\.(gif|jpg|jpeg|png|GIF|JPEG|JPG|PNG)$/.test(this.$data.intnetImg)
      ) {
        this.$message.error(this.$t('toBeEdit.inputzhengUrl'))
        return false
      } else {
        this.$data.httpurl = this.$data.intnetImg
        this.$data.intnetImg == ''
        this.$data.imgVisible = false
      }
    },
    //判断图片是否存在
    async isImgUrl(imgurl) {
      return new Promise(function(resolve, reject) {
        var ImgObj = new Image() //判断图片是否存在
        ImgObj.src = imgurl
        ImgObj.onload = function(res) {
          resolve(res)
        }
        ImgObj.onerror = function(err) {
          reject(err)
        }
      }).catch((e) => {}) // 加上这句不会报错（Uncaught (in promise)）
    },
    initData() {
      this.$nextTick(() => {
        this.getTableData()
      })
    },
    // 快速设置 翻译
    quickSetTran() {
      const { dataSource, selectedRowKeys } = this.$data
      console.log(selectedRowKeys, dataSource)
      if (selectedRowKeys.length === 0) {
        this.$message.error(this.$t('common.handlerLimit'))
        return
      }
      let data = cloneDeep(
        dataSource.filter(({ id }) => selectedRowKeys.includes(id))
      )
      console.log(data)
      // data.forEach((element) => {
      //   element.images = JSON.parse(element.images)
      // })
      this.$data.quickSetGoods = data
      this.$data.siteName = data[0].siteName
      data.map((ele) => {
        if (ele.siteName == this.$data.siteName)
          this.$data.curSiteNameGoods += 1
      })
      this.$data.quickSetVisible = true
    },
    loadTable() {
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
.me-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-width: 250px;
  max-width: 350px;
  line-height: 32px;
  margin-bottom: 3px;
}
.replace-input {
  width: 390px;
  margin-right: 10px;
}
.variationsku {
  width: 100px;
  display: inline-block;
}
.radioStyle {
  display: block;
  height: 40px;
  line-height: 40px;
  .tit {
    display: inline-block;
    margin-right: 10px;
  }
  .input {
    width: 100px;
    margin-right: 10px;
  }
}

.select {
  width: 250px;
}
.product-upload {
  text-align: center;
  display: inline-block;
  width: 48px;
  height: 48px;
  background-color: #f0f0f1;
  cursor: pointer;
  .icon-add-image {
    font-size: 18px;
    line-height: 48px;
    color: #aeaeae;
  }
}
.me-uploadimg {
  margin: 0 auto;
  text-align: center;
}
.me-master {
  .swiper-button-prev,
  .swiper-button-next {
    transform: scale(0.6);
    margin-top: -30px;
  }
}
</style>
