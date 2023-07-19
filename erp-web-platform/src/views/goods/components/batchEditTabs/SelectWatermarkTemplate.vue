<template>
  <div>
    <a-spin :spinning="tableLoading">
      <div class="select-watermark-template">
        <template v-if="getPagination.current === 1">
          <div @click="onPush" class="template-item template-create">
            <a-icon
              style="font-size: 45px; color: #ff8859"
              class="me-mb-2"
              type="plus-circle"
            />
            {{ $t('appendWatermark.create') }}
          </div>
        </template>
        <div
          class="template-item template-content"
          v-for="tmp in dataSource"
          :key="tmp.templateId"
        >
          <div class="me-transform-background">
            <img style="width: 100%" v-lazy="tmp.cover" />
          </div>
          <div class="operation">
            <span @click="onEdit(tmp)">{{ $t('appendWatermark.edit') }}</span>
            <span @click="onApplay(tmp)">
              {{ $t('appendWatermark.applay') }}
            </span>
            <span @click="remove(tmp)">{{ $t('appendWatermark.remove') }}</span>
          </div>
          <div class="tempname nowrap ellipsis" :title="tmp.templateName">{{tmp.templateName}}</div>
        </div>
      </div>
      <p class="me-pt-2 me-text-right">
        <a-pagination
          size="small"
          :current="getPagination.current"
          :total="getPagination.total"
          :pageSize="getPagination.pageSize"
          :pageSizeOptions="getPagination.pageSizeOptions"
          show-size-changer
          show-quick-jumper
          :show-total="(total) => $t('common.pageTotalText', { total })"
          @change="onPageChange"
          @showSizeChange="onPageChange"
        />
      </p>
    </a-spin>

    <a-modal
      :title="$t('appendWatermark.created')"
      width="80%"
      :visible="pushVisible"
      destroyOnClose
      :maskClosable="false"
      @ok="onPushOk"
      @cancel="pushVisible = false"
    >
      <FabricCanvas :objects="templateObjects" ref="markTemplate" />
    </a-modal>

    <a-modal
      :title="$t('appendWatermark.created')"
      width="80%"
      :visible="editVisible"
      destroyOnClose
      :confirmLoading="editConfirmLoading"
      :maskClosable="false"
      @ok="onEditOk"
      @cancel="editVisible = false"
    >
      <template v-if="editObjects">
        <FabricCanvas
          :objects="editObjects.templateProperty"
          ref="editMarkTemplate"
        />
      </template>
    </a-modal>

    <a-modal
      :title="$t('appendWatermark.settinged')"
      width="50%"
      :visible="settingVisible"
      destroyOnClose
      :maskClosable="false"
      :confirmLoading="settingConfirmLoading"
      @ok="onSettingOk"
      @cancel="settingVisible = false"
    >
      <AddEditWatermarkTemplateConfig
        ref="addEditConfig"
        :currentId="currentId"
        :tmpObject="templateObjects"
        :tmpDataUrl="templateDataUrl"
      />
    </a-modal>
  </div>
</template>

<script>
import Goods from '@/api/goods'
import Basic from '@/api/basic'
import tableMixins from '@/mixins/tableMixins'
import FabricCanvas from '@/components/FabricCanvas'
import { base64ToFile } from '@/util/canvas'
import AddEditWatermarkTemplateConfig from '@/views/other/components/AddEditWatermarkTemplateConfig'
export default {
  mixins: [tableMixins],
  components: { FabricCanvas, AddEditWatermarkTemplateConfig },
  data() {
    return {
      templateObjects: null,
      editObjects: null,
      templateDataUrl: null,
      currentId: null,

      pushVisible: false,
      editVisible: false,
      editConfirmLoading: false,
      settingVisible: false,
      settingConfirmLoading: false,
      createConfirmLoading: false
    }
  },
  props: {
    templateType: {
      type: [Number, String],
      default: 0
    }
  },
  mounted() {},
  methods: {
    getTableData() {
      const { templateType } = this.$props
      const { size, current } = this.$data.paginationData
      return Goods.getWatermarkTemplate({ size, current, templateType })
    },
    onPageChange(page, pageSize) {
      this.changePage({ pageSize, current: page })
    },
    /**使用 */
    onApplay(tmp) {
      this.$emit('select', tmp)
    },
    /**创建 */
    onPush() {
      this.$data.pushVisible = true
    },
    /**创建完成 */
    onPushOk() {
      const jsons = this.$refs.markTemplate.getJSON()
      const dataURL = this.$refs.markTemplate.getDataURL()
      this.$data.templateObjects = jsons
      this.$data.templateDataUrl = dataURL
      this.$data.settingVisible = true
    },
    /**编辑 */
    onEdit(record) {
      this.$data.editObjects = record
      this.$data.editVisible = true
      this.$data.editConfirmLoading = false
    },
    /**编辑完成 */
    async onEditOk() {
      this.$data.editConfirmLoading = true
      const { templateId } = this.$data.editObjects
      const jsonStr = this.$refs.editMarkTemplate.getJSON()
      const dataStr = this.$refs.editMarkTemplate.getDataURL()
      let data = { templateId, templateProperty: JSON.stringify(jsonStr) }
      const file = base64ToFile(dataStr)
      let formData = new FormData()
      formData.append('file', file)
      const imgRes = await Basic.handleUploadImages(formData)
      Basic.handleUploadImages(formData)
        .then((imgRes) => {
          data.cover = imgRes.data[0]
          Goods.setWatermarkTemplateById(data).then(() => {
            this.$message.success(this.$t('common.handlerSuccess'))
            this.reLoadData()
            this.$data.editObjects = null
            this.$data.editVisible = false
          })
        })
        .finally(() => {
          this.$data.editConfirmLoading = false
        })
    },
    /**配置创建完成 */
    onSettingOk() {
      this.$data.settingConfirmLoading = true
      this.$refs.addEditConfig
        .submit()
        .then(() => {
          this.$data.pushVisible = false
          this.$data.settingVisible = false
          this.$data.currentId = null
          this.$data.templateObjects = null
          this.$data.templateDataUrl = null
          this.reLoadData()
        })
        .finally(() => {
          this.$data.settingConfirmLoading = false
        })
    },
    remove({ templateId }) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          await Goods.delWatermarkTemplateById([templateId])
          this.loadData('delete')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.select-watermark-template {
  display: grid;
  grid-template-columns: repeat(auto-fill, 160px);
  grid-row-gap: 10px;
  grid-column-gap: 10px;

  .template-create {
    display: flex;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .template-content {
    display: grid;
    grid-template-rows: 1fr 30px;

    .operation {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      border-bottom: 1px solid #eeeeee;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #eeeeee;
        background-color: #fcfcfc;
        font-size: 12px;

        &:hover {
          transition: all 0.1s;
          color: rgb(255, 136, 89);
        }

        &:last-child {
          border: none;
        }
      }
    }
    .tempname{
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 12px;
      padding: 0px 2px;
    }
  }

  .template-item {
    height: 220px;
    border: 1px solid #eeeeee;
    transition: all 0.2s;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 10px rgb(0 0 0 / 30%);
    }
  }
}
</style>
