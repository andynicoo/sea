<template>
  <div>
    <a-spin :spinning="dataLoading">
      <div v-for="(item, ind) in siteList" :key="item.id">
        <div class="goods">
          <h5>{{ item.name }}</h5>
          <div class="imgs">
            <draggable
              :list="item.images"
              group="imgs"
              draggable=".img"
              style="
                display: grid;
                grid-template-columns: repeat(auto-fill, 115px);
                grid-row-gap: 5px;
                grid-column-gap: 5px;
              "
            >
              <div class="img" v-for="(img, index) in item.images" :key="index">
                <a-popover :placement="'bottom'" trigger="click">
                  <template slot="content">
                    <img
                      v-lazy="img.src"
                      style="width: 450px; height: 450px; border-radius: 2px"
                    />
                  </template>
                  <img
                    :style="{ width: '115px', height: '115px' }"
                    v-lazy="img.src"
                  />
                </a-popover>

                <span>
                  {{ img.width }}*
                  {{ img.height }}
                </span>
                <div class="image-item-footer">
                  <a-button-group>
                    <a-button
                      :size="size"
                      icon="left"
                      :disabled="index == 0"
                      @click="leftimg(item, index)"
                      :title="$t('toBeEdit.leftImg')"
                    ></a-button>
                    <a-button
                      :size="size"
                      icon="right"
                      :disabled="index == item.images.length - 1"
                      @click="rightimg(item, index)"
                      :title="$t('toBeEdit.rightImg')"
                    ></a-button>
                    <a-button
                      :size="size"
                      icon="retweet"
                      @click="uploadImage(item, index)"
                      :title="$t('toBeEdit.uploadImg')"
                    ></a-button>
                    <a-button
                      :size="size"
                      icon="picture"
                      :title="'编辑图片'"
                      @click.stop="openEditImg(img, index, ind)"
                    ></a-button>
                    <a-button
                      :size="size"
                      icon="delete"
                      @click="deleteimg(item, index)"
                      :title="$t('toBeEdit.deleteImg')"
                    ></a-button>
                  </a-button-group>
                </div>
              </div>
              <template v-if="item.images.length < 9">
                <div class="product-upload" @click="uploadImgBtu(ind)">
                  <span class="iconfont icon-add-image"></span>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </a-spin>

    <div class="footer">
      {{ $t('toBeEdit.selected') }}
      <span class="me-link">{{ siteList.length }}</span>
      {{ $t('toBeEdit.geGoods') }}
      <a-popover v-model="deletePopVisible" trigger="click">
        <template slot="content">
          <div class="deletepop">
            <div>
              {{ $t('toBeEdit.deletePre')
              }}<a-input-number
                :step="1"
                :precision="0"
                :min="0"
                size="small"
                class="inputs"
                v-model="deletePop.qian"
              />{{ $t('toBeEdit.zhang') }}
            </div>
            <div>
              {{ $t('toBeEdit.deleteAfter')
              }}<a-input-number
                :step="1"
                :precision="0"
                :min="0"
                size="small"
                class="inputs"
                v-model="deletePop.hou"
              />{{ $t('toBeEdit.zhang') }}
            </div>
            <div>
              <a-checkbox v-model="deletePop.delCheck"> </a-checkbox
              >{{ $t('toBeEdit.deleteNot1') }}
            </div>
            <div class="me-text-center">
              <a-button
                type="primary"
                size="small"
                @click="applyDeletePop"
                :loading="applyLoading"
              >
                {{ $t('toBeEdit.deleteApply') }}
              </a-button>
            </div>
          </div>
        </template>
        <a-button type="primary">
          {{ $t('toBeEdit.batchDelete') }}<a-icon type="up" />
        </a-button>
      </a-popover>
      <a-dropdown placement="topCenter">
        <a-button type="primary" :loading="batchTranLoading">
          {{ $t('batchEditOption.translate') }}<a-icon type="up" />
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
      <a-button
        :disabled="dataLoading"
        @click="onSave"
        key="submit"
        type="primary"
      >
        {{ $t('toBeEdit.batchSave') }}
      </a-button>
      <a-button key="back" @click="closeQuickSet">
        {{ $t('common.cancel') }}
      </a-button>
      <slot name="button"></slot>
    </div>

    <!-- 上传替换图片 -->
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
          :title="$t('toBeEdit.fangshi1duo')"
          style="width: 300px"
          class="center me-text-center me-mb-4"
        >
          <a-button
            type="primary"
            @click="uploadImageMultiple"
            :loading="uploadloading"
          >
            {{ $t('toBeEdit.bendi') }}
          </a-button>
        </a-card>

        <a-card
          :title="$t('toBeEdit.fangshi2laiyuan')"
          style="width: 300px"
          class="center me-text-center"
        >
          <a-button type="primary" class="me-mt-2" @click="choseImage">
            {{ $t('toBeEdit.imgSoruce') }}
          </a-button>
        </a-card>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { loadImage, getImageAbbt } from '@/util/document'
import draggable from 'vuedraggable'
import Basic from '@/api/basic'
import Goods from '@/api/goods'
import { openZhihuiEditor } from '@/util'
import { cloneDeep, drop, dropRight, compact } from 'lodash'
import { mapState } from 'vuex'
export default {
  components: { draggable },
  props: {
    site: {
      type: String,
      defalut: ''
    },
    list: {
      type: Array,
      defalut: []
    }
  },
  data() {
    return {
      // dataList: this.$props.list,
      deletePop: {
        qian: null,
        hou: null,
        delCheck: false
      },
      siteList: [],
      siteName: '',
      batchTranLoading: false, // 快速设置/翻译-->翻译loading
      size: 'small',
      imgVisible: false,
      itemIndex: 0,
      imagesIndex: 0,
      uploadloading: false,
      deletePopVisible: false,
      applyLoading: false, // 删除图片应用按钮
      onChange: false,
      dataLoading: false,
      editorData: {
        index: null,
        parentIndex: null
      }
    }
  },
  async mounted() {
    this.$data.siteList = cloneDeep(this.$props.list)
    this.renderImageInfo()
    this.addMeituChange()
  },
  computed: {
    ...mapState({
      targetLangList: (state) => state.product.targetLangList
    }),
    erweima() {
      return require('@/assets/images/wechat-code-3.png')
    }
  },
  methods: {
    /**渲染图片信息 */
    async renderImageInfo() {
      this.$data.dataLoading = true
      let siteList = cloneDeep(this.$data.siteList)
      siteList = siteList.map(async (product) => {
        product.images = product.images.map(async (image) => {
          let src = image.src
          let width = image.width
          let height = image.height
          if (!src) {
            const [info] = await getImageAbbt([image])
            src = image
            width = info.width
            height = info.height
          }
          return {
            src,
            width,
            height
          }
        })
        product.images = await Promise.all(product.images)
        return product
      })
      Promise.all(siteList)
        .then((siteList) => {
          this.$data.siteList = siteList
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.$data.dataLoading = false
        })
    },
    // 快速设置 批量删除
    async applyDeletePop() {
      this.$data.onChange = true
      const { qian, hou, delCheck } = this.$data.deletePop
      this.$data.siteList.forEach((product) => {
        let images = cloneDeep(product.images)
        if (qian) images = drop(images, qian)
        if (hou) images = dropRight(images, hou)
        if (delCheck) {
          images = images.filter((item, index) => {
            if (item.width != item.height) return false
            return true
          })
        }
        this.$set(product, 'images', images)
      })
      this.$data.deletePopVisible = false
    },
    /**媒体图片翻译 */
    onTranslateMediaImage({ lang }) {
      this.$data.onChange = true
      return new Promise((resolve, reject) => {
        this.$data.batchTranLoading = true
        const reqQueue = this.$data.siteList.map(async (element) => {
          const storeId = element.storeId
          const id = element.id
          const urls = element.images.map((image) => image.src)
          var { data, code, message } = await Basic.handleTranslateImages({
            url: urls,
            storeId,
            id,
            to: lang
          })
          console.log(message, code, data)
          if (code == 0) {
            this.$message.success(message)
          }

          // code==1,当天翻译超过1000，不再翻译； code==-1,翻译量700~1000使用第二个缓慢翻译接口
          if (code == -1) {
            var record = await Basic.handleCacheImages({
              url: urls,
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
            element.images = element.images.map((image, index) => {
              image.src = data[index]
              return image
            })
          }
          return element
        })
        Promise.all(reqQueue)
          .then((data) => {})
          .finally(() => {
            this.$data.batchTranLoading = false
          })
      })
    },
    /**删除图片 */
    deleteimg(item, index) {
      this.$data.onChange = true
      this.$delete(item.images, index)
    },
    /**左移动 */
    leftimg(item, index) {
      this.swapArray(item.images, index, index - 1)
    },
    /**右移动 */
    rightimg(item, index) {
      this.swapArray(item.images, index, index + 1)
    },
    /**数字元素交换位置 */
    swapArray(arr, index1, index2) {
      this.$data.onChange = true
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    },
    /**单张上传替换 */
    uploadImage(item, index) {
      loadImage({}, async (files) => {
        this.$data.onChange = true
        files = Array.from(files).slice(0, 9)
        const formData = new FormData()
        formData.append('file', files[0])
        var { data } = await Basic.handleUploadImages(formData)
        const [info] = await getImageAbbt([data[0]])
        this.$set(item.images[index], 'src', data[0])
        this.$set(item.images[index], 'width', info.width)
        this.$set(item.images[index], 'height', info.height)
        this.renderImageInfo()
      })
    },
    /**尾部上传 */
    uploadImgBtu(ind) {
      this.$data.imgVisible = true
      this.$data.itemIndex = ind
    },
    /**选择来源图片 */
    choseImage() {
      const { itemIndex } = this.$data
      const current = this.$data.siteList[itemIndex]
      const urls = JSON.parse(current.detailImgUrl)
      if (urls === null) {
        this.$message.error(this.$t('toBeEdit.noDetailImg'))
        return
      }
      // 传入不可选图片
      const originImages = []
      current.images.map((ele) => {
        originImages.push(ele.src)
      })
      this.$ImageChoose(urls, 1, originImages).then(([src]) => {
        this.$data.onChange = true
        if (src !== undefined) {
          this.$set(current, 'images', [...current.images, src])
        }
        this.renderImageInfo()
        this.$data.imgVisible = false
      })
    },
    // 多张后续上传
    uploadImageMultiple() {
      loadImage({ multiple: true }, async (files) => {
        const { itemIndex } = this.$data
        const current = this.$data.siteList[itemIndex]
        files = Array.from(files).slice(0, 9 - current.images.length)
        const formData = new FormData()
        files.forEach((e) => {
          formData.append('file', e)
        })
        this.$data.uploadloading = true
        const { data } = await Basic.handleUploadImages(formData).finally(
          () => {
            this.$data.uploadloading = false
          }
        )
        this.$set(current, 'images', [...current.images, ...data])
        this.renderImageInfo()
        this.$data.imgVisible = false
        this.$data.onChange = true
      })
    },
    /**打开美图秀秀 */
    openEditImg(item, index, parentIndex) {
      let img = item
      if (!img.width) {
        // 获取图片宽高
        img = new Image()
        img.src = item.src
      }
      if (!item.src || !img.width) {
        this.$message.error('请上传图片, 再编辑!')
        return
      }
      // openZhihuiEditor方法里new ZhihuiEditor会返回index第一次值
      this.editorData = {
        index: index,
        parentIndex: parentIndex
      }
      openZhihuiEditor(item.src, img, (res) => {
        const current = this.$data.siteList[this.editorData.parentIndex]
        this.$set(
          current.images[this.editorData.index],
          'src',
          'https:' + res.url
        )
        this.$set(current.images[this.editorData.index], 'width', res.width)
        this.$set(current.images[this.editorData.index], 'height', res.height)
        this.renderImageInfo()
      })
    },
    /**监听美图秀秀事件*/
    addMeituChange() {
      const siteList = this.$data.siteList
      let hiddenProperty =
        'hidden' in document
          ? 'hidden'
          : 'webkitHidden' in document
          ? 'webkitHidden'
          : 'mozHidden' in document
          ? 'mozHidden'
          : null
      let visibilityChangeEvent = hiddenProperty.replace(
        /hidden/i,
        'visibilitychange'
      )
      document.addEventListener(visibilityChangeEvent, () => {
        if (!document[hiddenProperty]) {
          let meituImageInfo = localStorage.getItem('meituImageInfo')
          meituImageInfo = JSON.parse(meituImageInfo)
          console.log('meituImageInfo => ', meituImageInfo)
          let { index, pindex, id, type, img } = meituImageInfo
          if (img && type == 1) {
            console.log(1)
            if (siteList[pindex].id == id) {
              console.log(2)
              this.$set(siteList[pindex].images, index, img)
            }
          }
        }
      })
    },
    closeQuickSet() {
      this.$emit('func', false)
    },
    // 刷新首页数据
    closeQuickSetVis() {
      this.$emit('funclose', false)
    },
    onSave() {
      this.$data.dataLoading = true
      let siteList = cloneDeep(this.$data.siteList)
      siteList = siteList.map((product) => {
        product.images = product.images.map((image) => image.src)
        product.images = JSON.stringify(product.images)
        return product
      })
      Goods.handleEditBatch(siteList)
        .then(() => {
          this.$message.success(this.$t('common.handlerSuccess'))
        })
        .finally(() => {
          this.closeQuickSetVis()
          this.$emit('func', false)
          this.$data.dataLoading = true
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.goods {
  border-bottom: 1px solid #dcdcdc;
  padding: 10px 5px 30px 5px;
  .imgs {
    padding: 10px 0px;
    .img {
      float: left;
      position: relative;
      cursor: all-scroll;
      span {
        position: absolute;
        right: 3px;
        bottom: 25px;
        background: #fff;
        opacity: 0.7;
        color: #000;
        padding: 1px;
      }
    }
    img {
      border: 1px solid #dcdcdc;
    }
    .image-item-footer {
      text-align: center;
    }
  }
}
.me-uploadimg {
  margin: 0 auto;
  text-align: center;
}
.product-upload {
  text-align: center;
  display: inline-block;
  width: 117px;
  height: 117px;
  background-color: #f0f0f1;
  cursor: pointer;
  .icon-add-image {
    font-size: 50px;
    line-height: 118px;
    color: #aeaeae;
  }
}
.footer {
  float: right;
  margin: 20px 10px 0px 0px;
  button {
    margin: 0px 5px;
  }
}
.deletepop {
  width: 180px;
  div {
    margin-bottom: 5px;
  }
  .inputs {
    width: 80px;
    margin: 0 5px;
  }
}
</style>
