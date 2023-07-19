<template>
  <div class="me-pa-2">
    <div class="me-card">
      <h1 class="me-title">
        {{ $t('marketingWatermark.marketingwatermark') }}
      </h1>

      <div class="me-mt-4 me-mb-4">
        <a-button @click="onPush" type="primary" class="me-fr">
          <a-icon type="plus" />
          {{ $t('marketingWatermark.createmark') }}
        </a-button>
        <a-input-search
          style="width: 500px"
          :enter-button="$t('common.search')"
          @search="onSearch"
        />
      </div>

      <a-table
        rowKey="itemId"
        :loading="tableLoading"
        :columns="columns"
        :data-source="dataSource"
        :pagination="getPagination"
        @change="changePage"
      >
        <template slot="templateName" slot-scope="text, record">
          <div class="me-transform-background me-ib">
            <img style="width: 60px; height: 60px" v-lazy="record.cover" />
          </div>
          {{ text }}
          <a-button @click="onChangeSettings(record)" type="link">
            修改配置
          </a-button>
        </template>

        <template slot="actions" slot-scope="text, record">
          <a-button type="link" @click="edit(record)">编辑水印</a-button>
          <a-button type="link" @click="remove(record)" class="me-error"
            >删除</a-button
          >
        </template>
      </a-table>
    </div>

    <a-modal
      :title="$t('marketingWatermark.createmark')"
      width="1200px"
      :visible="pushVisible"
      destroyOnClose
      :maskClosable="false"
      @ok="onPushOk"
      @cancel="pushVisible = false"
    >
      <WatermarkTemplate :objects="templateObjects" ref="markTemplate" />
    </a-modal>

    <a-modal
      :title="$t('marketingWatermark.editmark')"
      width="1200px"
      :visible="editVisible"
      destroyOnClose
      :confirmLoading="editConfirmLoading"
      :maskClosable="false"
      @ok="onEditOk"
      @cancel="editVisible = false"
    >
      <template v-if="editObjects">
        <WatermarkTemplate
          :objects="editObjects.templateProperty"
          ref="editMarkTemplate"
        />
      </template>
    </a-modal>

    <a-modal
      :title="$t('marketingWatermark.configmark')"
      width="600px"
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
import WatermarkTemplate from '@/components/WatermarkTemplate'
import AddEditWatermarkTemplateConfig from './components/AddEditWatermarkTemplateConfig'
import Goods from '@/api/goods'
import Basic from '@/api/basic'
import { base64ToFile } from '@/util/canvas'
import tableMixins from '@/mixins/tableMixins'
export default {
  mixins: [tableMixins],
  components: { WatermarkTemplate, AddEditWatermarkTemplateConfig },
  data() {
    return {
      pushVisible: false,
      editVisible: false,
      settingVisible: false,
      settingConfirmLoading: false,
      editConfirmLoading: false,
      templateObjects: null,
      editObjects: null,
      templateDataUrl: null,
      currentId: null,
      columns: [
        {
          title: '水印名称',
          dataIndex: 'templateName',
          key: 'templateName',
          scopedSlots: { customRender: 'templateName' }
        },
        {
          title: '操作',
          dataIndex: 'actions',
          key: 'actions',
          scopedSlots: { customRender: 'actions' }
        }
      ]
    }
  },
  methods: {
    getTableData() {
      const { size, current } = this.$data.paginationData
      return Goods.getWatermarkTemplate({ size, current })
    },
    onSearch() {},
    async onPushOk() {
      const jsons = this.$refs.markTemplate.toJSON()
      const dataURL = this.$refs.markTemplate.toDataURL()
      this.$data.templateObjects = jsons
      this.$data.templateDataUrl = dataURL
      this.$data.settingVisible = true
    },
    onSettingOk() {
      this.$data.settingConfirmLoading = true
      this.$refs.addEditConfig.submit().then(() => {
        this.$data.settingConfirmLoading = false
        this.$data.pushVisible = false
        this.$data.settingVisible = false
        this.$data.currentId = null
        this.$data.templateObjects = null
        this.$data.templateDataUrl = null
        this.reLoadData()
      })
    },
    onPush() {
      this.$data.pushVisible = true
    },
    /**修改配置 */
    onChangeSettings({ templateId }) {
      this.$data.currentId = templateId
      this.$data.settingVisible = true
    },
    /**编辑确定 */
    async onEditOk() {
      this.$data.editConfirmLoading = true
      const { templateId } = this.$data.editObjects
      const jsonStr = this.$refs.editMarkTemplate.toJSON()
      const dataStr = this.$refs.editMarkTemplate.toDataURL()
      let data = { templateId, templateProperty: JSON.stringify(jsonStr) }
      const file = base64ToFile(dataStr)
      let formData = new FormData()
      formData.append('file', file)
      const imgRes = await Basic.handleUploadImages(formData)
      data.cover = imgRes.data[0]
      Goods.setWatermarkTemplateById(data).then(() => {
        this.$message.success(this.$t('common.handlerSuccess'))
        this.reLoadData()
        this.$data.editConfirmLoading = false
        this.$data.editObjects = null
        this.$data.editVisible = false
      })
    },
    /**编辑 */
    edit(record) {
      this.$data.editObjects = record
      this.$data.editVisible = true
      this.$data.editConfirmLoading = false
    },
    /**删除 */
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
.me-title {
  font-size: 24px;
  font-weight: 500;
}
</style>