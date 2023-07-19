<template>
  <div class="me-pa-2">
    <div class="contents me-page-layout">
      <div class="leftcon">
        <h2>全部图片</h2>
        <ul>
          <li
            :class="{ cur: pageParams.pictureTypeId === null }"
            @click="onChooseCategory({ pictureTypeId: null })"
          >
            全部 ({{ pictureTotal }})
          </li>
          <li
            v-for="category in categorys || []"
            :key="category.pictureTypeId"
            :class="{ cur: getCur(category) }"
            @click="onChooseCategory(category)"
          >
            <template v-if="categoryEditIng === category.pictureTypeId">
              <a-input-search
                ref="categoryEditRef"
                size="small"
                @search="onUpdateCategory($event, category)"
                @blur="onCancelUpdateCategory"
                @keyup.esc="onCancelUpdateCategory"
                v-model="category.pictureTypeName"
                v-filter-text
                :max-length="24"
                enter-button="确定"
              />
            </template>
            <template v-else>
              <a-row class="me-category-item">
                <a-col :span="18">
                  {{ category.pictureTypeName }}
                  {{
                    pictureTypeImgNum[category.pictureTypeId] &&
                      `(${pictureTypeImgNum[category.pictureTypeId]})`
                  }}
                </a-col>
                <a-col :span="6">
                  <a-space class="category-type-actions">
                    <a-icon
                      type="edit"
                      @click.stop="onCategoryEdit(category)"
                    />
                    <a-icon
                      type="delete"
                      @click.stop="onCategoryDelete(category)"
                    />
                  </a-space>
                </a-col>
              </a-row>
            </template>
          </li>
        </ul>
        <p class="me-pt-1">
          <span class="me-cp me-status-link" @click="onAddCategory">
            添加分类
          </span>
        </p>
      </div>
      <div class="rightcon">
        <div class="titcon">
          <a-space>
            <a-checkbox
              @change="onCheckboxAll"
              :checked="checkedAll"
              :indeterminate="indeterminate"
            >
              全选
            </a-checkbox>
            <a-button
              type="primary"
              @click="onUploadImage"
              :loading="uploadImageLoading"
            >
              上传图片
            </a-button>
            <a-button type="primary" @click="onBatchDowload">
              批量下载
            </a-button>
            <a-button @click="onBatchDelete(selectedRowKeys)">
              批量删除
            </a-button>
          </a-space>
          <div class="tips">
            <p class="title">
              已使用{{ spaceSize }}M/{{ memberInfo.total }}{{ memberInfo.unit }}
            </p>
            <a-progress
              :percent="(spaceSize / memberInfo.total) * 100"
              :show-info="false"
              strokeColor="#FFD239"
            />
          </div>
        </div>

        <a-spin
          class="me-rightcon-content"
          :spinning="tableLoading"
          :style="{ minHeight: rightconHeight }"
          :class="{ 'me-align-items': !dataSource.length }"
        >
          <template v-if="dataSource.length">
            <div class="imgcon-list me-mb-4">
              <div
                class="imgcon"
                v-for="(item, index) in dataSource"
                :key="item.id"
              >
                <div
                  @click="onPreview(index)"
                  v-lazy:background-image="item.imgUrl"
                  class="me-product-images-warp"
                >
                  <a-checkbox
                    @click.stop
                    :checked="selectedRowKeys.includes(item.pictureId)"
                    @change="onCheckbox($event, item)"
                    class="me-img-check"
                  />
                  <span class="me-img-size">{{ item._size_.join(' * ') }}</span>
                </div>
                <div class="me-clear"></div>
                <div class="tit">{{ item._name_ }}</div>
                <div class="btn-gro">
                  <!-- 翻译 start -->
                  <a-dropdown>
                    <a-menu slot="overlay">
                      <a-menu-item
                        @click="onTranslateMediaImage(lang, item)"
                        v-for="lang in targetLangList"
                        :key="lang.lang"
                      >
                        {{ lang.name }}
                      </a-menu-item>
                    </a-menu>
                    <a-button
                      type="link"
                      size="small"
                      :loading="!!item._translate_loading_"
                    >
                      翻译
                    </a-button>
                  </a-dropdown>
                  <!-- 翻译 end -->

                  <a-button
                    type="link"
                    size="small"
                    @click="onImagePull(item)"
                    :loading="item._pull_loading_"
                  >
                    拉伸
                  </a-button>
                  <a-button type="link" size="small" @click="onImageEdit(item)">
                    美化
                  </a-button>
                </div>
                <div class="btn-gro">
                  <a-button type="link" size="small" @click="onDownload(item)">
                    下载
                  </a-button>
                  <a-popconfirm @confirm="onTypeConfirm(item)">
                    <span slot="icon" />
                    <template slot="title" v-if="categorys">
                      <a-checkbox-group v-model="item.pictureTypeIds">
                        <a-checkbox
                          v-for="category in categorys"
                          :key="category.pictureTypeId"
                          :value="category.pictureTypeId"
                        >
                          {{ category.pictureTypeName }}
                        </a-checkbox>
                      </a-checkbox-group>
                    </template>
                    <a-button type="link" size="small"> 分类 </a-button>
                  </a-popconfirm>
                  <a-button
                    type="link"
                    size="small"
                    @click="onBatchDelete([item.pictureId])"
                  >
                    删除
                  </a-button>
                </div>
              </div>
            </div>

            <div class="me-fr">
              <a-pagination
                v-model="paginationData.current"
                :total="paginationData.total"
                @change="onPageChange"
                @showSizeChange="onPageChange"
                showSizeChanger
              />
            </div>
          </template>
          <template v-else>
            <a-empty />
          </template>
        </a-spin>
      </div>
    </div>

    <a-modal
      v-model="updateVisible"
      :footer="null"
      @ok="handleOk"
      width="360px"
      destroyOnClose
    >
      <ImageSpaceUpdate />
    </a-modal>

    <a-modal
      :visible="addCategoryVisible"
      title="添加分类"
      @cancel="onAddCategoryCancel"
      @ok="onAddCategorySubmit"
      destroyOnClose
    >
      <a-space direction="vertical" style="width: 100%">
        <a-row v-for="(item, index) in addCategorys" :key="index">
          <a-col :span="20">
            <a-input
              :max-length="24"
              v-filter-text
              style="width: 100%"
              v-model="item.pictureTypeName"
            />
          </a-col>
          <a-col :span="4" v-if="addCategorys.length > 1">
            <a-button type="link" danger @click="onDeleteCategoryItem(index)">
              删除
            </a-button>
          </a-col>
        </a-row>
        <a-button type="link" @click="onAddCategoryItem">
          <a-icon type="plus" />
          添加分类
        </a-button>
      </a-space>
    </a-modal>
  </div>
</template>
<script>
import ImageSpaceUpdate from '@/components/ImageSpaceUpdate'
import Picture from '@/api/picture'
import Goods from '@/api/goods'
import tableMixins from '@/mixins/tableMixins'
import { last, cloneDeep, isEqual, sortBy, remove } from 'lodash'
import { loadImage } from '@/util/document'
import { getImageInfo, openZhihuiEditor } from '@/util'
import { imagesDownload } from '@/util/handle'
import { imgurlToBase64, base64ToFile } from '@/util/canvas'
import FileSaver from 'file-saver'
import Basic from '@/api/basic'
import { COUNTRY } from '@/util/erp.conf'
import { mapState } from 'vuex'
import { head, sum } from 'lodash'

/**获取图片名 */
const getImageName = (url) => last(url.split('/'))

/**获取图片尺寸 */
const getImageSize = (url) => {
  return new Promise((resolve) => {
    getImageInfo(url, (width, height) => {
      resolve([width, height])
    })
  })
}

const pattern = new RegExp(/[^a-zA-Z0-9_\u4e00-\u9fa5]+$/gi)

const initCategory = { pictureTypeName: '' }

export default {
  mixins: [tableMixins],
  props: {},
  components: {
    ImageSpaceUpdate
  },
  computed: {
    ...mapState({
      memberInfo: (state) => {
        const memberInfo = state.auth.memberInfo
        if (!memberInfo || !memberInfo.myPrivilege) return {}
        const s = memberInfo.myPrivilege.filter(({ name }) => {
          return name === '图片空间'
        })
        return head(s)
      },
      targetLangList: (state) => state.product.targetLangList
    }),
    getCur() {
      return (category) => {
        return category.pictureTypeId === this.pageParams.pictureTypeId
      }
    },
    checkedAll() {
      if (!this.dataSource.length) return false
      const keys = this.dataSource.map(({ pictureId }) => pictureId)
      return isEqual(keys.sort(), this.selectedRowKeys.sort())
    },
    indeterminate() {
      const keys = this.dataSource.map(({ pictureId }) => pictureId)
      return (
        !!this.selectedRowKeys.length &&
        this.selectedRowKeys.length !== keys.length
      )
    }
  },
  data() {
    return {
      COUNTRY: [
        ...COUNTRY,
        { key: 'ES', lang: 'ESP', currency: 'ESP', langName: '西班牙语' }
        // { key: 'ZH', lang: 'CHS', currency: 'ZH', langName: '简体中文' }
      ],
      updateVisible: false,
      typeParams: {
        current: 1,
        size: 1000
      },
      pageParams: {
        pictureTypeId: null
      },
      pictureTypeImgNum: {},
      spaceSize: 0,
      categoryEditIng: null,
      categorys: null,
      addCategorys: [initCategory],
      addCategoryVisible: false,

      uploadImageLoading: false,

      pictureTotal: null,
      rightconHeight: '300px'
    }
  },
  mounted() {
    this.rightconHeight = document.body.offsetHeight - 159 + 'px'
    this.getPictureTypeImgNum()
    this.getUserUsePictureSize()
    this.sumPictureInfo()
    this.pagePictureType()

    this.$store.dispatch('setTargetLangList', {
      currency: 'all'
    })
  },
  methods: {
    /**获取类目图片数量 */
    getPictureTypeImgNum() {
      this.pictureTypeImgNum = {}
      Picture.getPictureTypeImgNum({}).then((res) => {
        res.data.forEach(({ pictureTypeId, num }) => {
          this.$set(this.pictureTypeImgNum, pictureTypeId, num)
        })
      })
    },
    /**获取图片空间使用大小 */
    getUserUsePictureSize() {
      Picture.getUserUsePictureSize({}).then((res) => {
        this.spaceSize = (res.data / 1024 / 1024).toFixed(2)
      })
    },
    sumPictureInfo() {
      Picture.sumPictureInfo({}).then((res) => {
        this.pictureTotal = res.data
      })
    },
    /**加载分类分页 */
    pagePictureType() {
      return Picture.pagePictureType(this.typeParams).then((res) => {
        this.categorys = res.data.records
        this.categoryEditIng = null
        return res.data.records
      })
    },
    /**图片预览 */
    onPreview(index) {
      const images = this.dataSource.map(({ imgUrl }) => imgUrl)
      this.$ImagePreview(images, index)
    },
    /**图片翻译 */
    onTranslateMediaImage(lang, item) {
      const { pictureId, imgUrl } = item
      const id = pictureId
      const url = [imgUrl]
      const to = lang.lang
      this.$set(item, '_translate_loading_', true)
      Basic.handleTranslateImages({ url, to, id }).then(async (res) => {
        const [url] = res.data
        const file = await base64ToFile(await imgurlToBase64(url))
        const fd = new FormData()
        fd.append('file', file)
        fd.append('pictureIds', [pictureId])
        Picture.uploadImage(fd).then(() => {
          this.$message.success('翻译成功')
          this.loadData()
          this.$set(item, '_translate_loading_', false)
        })
      })
    },
    /**一健拉伸 */
    onImagePull(item) {
      const { pictureId, imgUrl } = item
      let params = { list: [imgUrl], id: pictureId, storeId: 0 }
      this.$set(item, '_pull_loading_', true)
      Goods.handleBatchPull(params).then(async (res) => {
        const [url] = res.data.list
        const file = await base64ToFile(await imgurlToBase64(url))
        const fd = new FormData()
        fd.append('file', file)
        fd.append('pictureIds', [pictureId])
        Picture.uploadImage(fd).then(() => {
          this.$message.success('拉伸成功')
          this.loadData()
          this.$set(item, '_pull_loading_', false)
        })
      })
    },
    /**美化 */
    async onImageEdit(item) {
      const { pictureId, imgUrl } = item
      const [width, height] = await getImageSize(imgUrl)
      openZhihuiEditor(imgUrl, { width, height }, async ({ url }) => {
        /**图片url转file后重新上传 */
        const file = await base64ToFile(await imgurlToBase64(url))
        const fd = new FormData()
        fd.append('file', file)
        fd.append('pictureIds', [pictureId])
        Picture.uploadImage(fd).then(async () => {
          this.$message.success('美化成功')
          this.loadData()
        })
      })
    },
    /**分类修改确定 */
    onTypeConfirm(item) {
      const { pictureId, pictureTypeIds } = item
      Picture.updatePictureInfoType({
        pictureIds: [pictureId],
        pictureTypeIds: pictureTypeIds
      }).then(() => {
        this.$message.success('修改成功')
        this.loadData()
        this.getPictureTypeImgNum()
      })
    },
    /**下载单个图片 */
    onDownload({ imgUrl }) {
      const name = getImageName(imgUrl)
      FileSaver.saveAs(imgUrl, name)
    },
    /**全选 */
    onCheckboxAll(event) {
      const checked = event.target.checked
      const keys = this.dataSource.map(({ pictureId }) => pictureId)

      if (checked) {
        this.selectedRowKeys = keys
        this.selectedRows = cloneDeep(this.dataSource)
      } else {
        this.selectedRowKeys = []
        this.selectedRows = []
      }
    },
    /**选中单个 */
    onCheckbox(event, picture) {
      const checked = event.target.checked
      const { pictureId } = picture
      let selectedRowKeys = [...this.selectedRowKeys]
      let selectedRows = [...this.selectedRows]
      if (checked) {
        selectedRowKeys = selectedRowKeys.concat(pictureId)
        selectedRows = selectedRows.concat(picture)
      } else {
        remove(selectedRowKeys, (value) => value === pictureId)
        remove(selectedRows, (value) => value.pictureId === pictureId)
      }

      this.selectedRowKeys = selectedRowKeys.sort()
      this.selectedRows = sortBy(selectedRows, ['pictureId'])
    },
    /**批量下载 */
    onBatchDowload() {
      const srcs = this.selectedRows.map(({ imgUrl }) => imgUrl)
      if (!srcs.length) return this.$message.error('请至少选择一张图片')
      imagesDownload(srcs, '图片空间批量下载').then(() => {
        this.$message.success('下载成功')
      })
    },
    /**批量删除 */
    onBatchDelete(keys) {
      if (!keys.length) return this.$message.error('请至少选择一张图片')
      this.$confirm({
        title: '警告',
        content: `确定要删除 ${keys.length} 张图片吗?`,
        okType: 'danger',
        onOk: () => {
          Picture.delePictureInfo(keys).then(() => {
            this.$message.success('删除成功')
            this.loadData(true)
            this.getPictureTypeImgNum()
            this.getUserUsePictureSize()
            this.sumPictureInfo()
            this.pagePictureType()
          })
        }
      })
    },
    /**分页改变 */
    onPageChange(current, pageSize) {
      this.changePage({ pageSize, current })
    },
    /**上传图片 */
    onUploadImage() {
      loadImage({ multiple: true }, (files) => {
        const spaceSize = Number(this.spaceSize)
        const total = this.memberInfo.total
        const allowance = total - spaceSize
        const sizeTotal = sum(files.map(({ size }) => size / 1024 / 1024))

        if (sizeTotal >= allowance) {
          return this.$confirm({
            title: '温馨提示',
            content: '图片上传数量达到最大限制,请联系运营处理!',
            okText: '知道了',
            onOk: () => {
              //   this.$router.push('/member/Index')
            }
          })
        }

        const { pictureTypeId } = this.pageParams
        const fd = new FormData()
        files.forEach((file) => {
          fd.append('file', file)
        })
        if (pictureTypeId) {
          fd.append('pictureTypeIds', pictureTypeId)
        }
        this.uploadImageLoading = true
        Picture.uploadImage(fd)
          .then((res) => {
            this.$message.success(`成功上传 ${res.data.length} 张图片`)
            this.loadData()
            this.getPictureTypeImgNum()
            this.getUserUsePictureSize()
            this.sumPictureInfo()
            this.pagePictureType()
          })
          .finally(() => {
            this.uploadImageLoading = false
          })
      })
    },
    /**加载图片分页 */
    async getTableData() {
      const { pictureTypeId } = this.pageParams
      const params = {
        pictureTypeIds: pictureTypeId && [pictureTypeId],
        ...this.paginationData
      }
      return Picture.pagePictureInfo(params).then(async (res) => {
        res.data.records = await Promise.all(
          res.data.records.map(async (item) => {
            const { imgUrl } = item
            const name = getImageName(imgUrl)
            const size = await getImageSize(imgUrl)
            item._size_ = size
            item._name_ = name
            if (item.pictureTypeIds) {
              item.pictureTypeIds = item.pictureTypeIds.split(',').map(Number)
            }
            return item
          })
        )
        return res
      })
    },
    handleOk() {},
    /**选择分类 */
    onChooseCategory(category) {
      this.pageParams.pictureTypeId = category.pictureTypeId
      this.$nextTick(this.reLoadData)
    },
    /**添加分类 */
    onAddCategory() {
      this.addCategoryVisible = true
    },
    /**添加分类项 */
    onAddCategoryItem() {
      this.$nextTick(() => {
        setTimeout(() => {
          const input = last(document.querySelectorAll('input.ant-input'))
          input.focus()
        }, 100)
      })
      this.addCategorys.push({ pictureTypeName: '' })
    },
    /**删除分类项 */
    onDeleteCategoryItem(index) {
      this.$delete(this.addCategorys, index)
    },
    /**分类添加提交 */
    onAddCategorySubmit() {
      const ress = this.addCategorys
        .filter((c) => c.pictureTypeName !== '')
        .map((item) => {
          item.pictureTypeName = item.pictureTypeName.replace(pattern, '')
          return item
        })
        .map(Picture.addPictureType)
      Promise.all(ress).then((res) => {
        this.$message.success(`成功添加 ${res.length} 条数据`)
        this.pagePictureType()
        this.addCategoryVisible = false
        this.addCategorys = [{ pictureTypeName: '' }]
      })
    },
    /**分类添加取消 */
    onAddCategoryCancel() {
      this.addCategoryVisible = false
      this.addCategorys = [{ pictureTypeName: '' }]
    },
    /**分类修改 */
    onCategoryEdit(category) {
      this.categoryEditIng = category.pictureTypeId
      this.$nextTick(() => {
        this.$refs.categoryEditRef[0].focus()
      })
    },
    /**分类删除 */
    onCategoryDelete({ pictureTypeId, pictureTypeName }) {
      this.$confirm({
        title: '警告',
        content: `确定要删除 ${pictureTypeName} 分类吗?`,
        okType: 'danger',
        onOk: () => {
          Picture.delePictureType({ pictureTypeId }).then(() => {
            this.$message.success('删除成功')
            this.pagePictureType()
          })
        }
      })
    },
    /**分类修改提交 */
    onUpdateCategory(pictureTypeName, picture, el) {
      pictureTypeName = pictureTypeName.replace(pattern, '')
      if (pictureTypeName) {
        const { pictureTypeId } = picture
        Picture.updatePictureType({
          pictureTypeId,
          pictureTypeName
        }).then(() => {
          this.$message.success('修改成功')
          this.categoryEditIng = null
        })
      } else {
        this.$message.error('请输入分类名称')
      }
    },
    /**分类取消修改 */
    onCancelUpdateCategory() {
      setTimeout(this.pagePictureType, 200)
    }
  }
}
</script>
<style lang="scss" scoped>
.contents {
  display: flex;
  padding: 0;
  .leftcon {
    width: 226px;
    background: #ffffff;
    border-radius: 2px 0px 0px 0px;
    height: 100%;
    padding: 15px;
    h2 {
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #262424;
      line-height: 22px;
      margin-bottom: 15px;
    }
    ul {
      li {
        border-radius: 2px;
        line-height: 28px;
        cursor: pointer;
        padding-left: 8px;
      }
      li.cur {
        background: #f5f5f5;
        color: #ff720d;
      }
    }
  }
  .me-align-items {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rightcon {
    background: #ffffff;
    border-left: 10px solid #f5f5f5;
    width: 100%;
    height: 100%;
    .titcon {
      height: 72px;
      padding: 15px;
      border-bottom: 10px solid #f5f5f5;
    }
    .me-rightcon-content {
      padding: 15px;
    }
    .tips {
      float: right;
      width: 220px;
    }
    .imgcon {
      width: 100%;
      height: 337px;
      background: #ffffff;
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
      border-radius: 0px 0px 4px 4px;
      float: left;
      .tit {
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #303133;
        line-height: 22px;
        padding: 10px 12px;
        margin-bottom: 15px;
      }
    }
    .me-product-images-warp {
      width: 100%;
      height: 245px;
      background-position: center;
      background-size: cover;
      cursor: pointer;
      background-color: #f0f0f1;
      float: left;
      position: relative;
      border: 1px solid rgba(0, 0, 0, 0);
      .imgtitle {
        position: absolute;
        text-align: center;
        width: 95px;
        height: 20px;
        bottom: -35px;
        line-height: 20px;
      }

      &:hover {
        .icon-box {
          opacity: 1;
        }
      }
    }
  }
}
.btn-gro {
  padding: 0px 6px;
}
.me-img-size {
  position: absolute;
  left: 12px;
  bottom: 12px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  line-height: 12px;
  font-size: 12px;
  padding: 4px;
}
.me-img-check {
  position: absolute;
  top: 12px;
  left: 12px;
  line-height: 12px;
  ::v-deep .ant-checkbox-input {
    width: 25px;
    height: 25px;
    margin: -5px 0 0 -5px;
  }
}

.category-type-actions {
  color: #4c86ff;
  display: none;
  .ant-space-item {
    &:last-child {
      color: #ff4d4f;
    }
  }
}
.me-category-item {
  &:hover {
    .category-type-actions {
      display: inline-flex;
    }
  }
}

.imgcon-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 245px);
  gap: 20px;
}
</style>
