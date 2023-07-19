<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" :title="title"> </a-page-header>
    <div class="me-card">
      <div class="me-mt-4 me-mb-4">
        <a-button @click="onPush" type="primary" class="me-fr">
          <a-icon type="plus" />
          {{ $t('marketingWatermark.createmark') }}
        </a-button>
        <a-input-search
          :placeholder="$t('marketingWatermark.ph')"
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
            {{ $t('marketingWatermark.editConf') }}
          </a-button>
        </template>

        <template slot="actions" slot-scope="text, record">
          <a-button type="link" class="me-pa-1" @click="edit(record)">
            {{ $t('marketingWatermark.edit') }}
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" @click="remove(record)" class="me-error">
            {{ $t('marketingWatermark.remove') }}
          </a-button>
        </template>
      </a-table>
    </div>

    <a-modal
      :title="$t('marketingWatermark.createmark')"
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
      :title="$t('marketingWatermark.editmark')"
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
import FabricCanvas from '@/components/FabricCanvas'
import AddEditWatermarkTemplateConfig from '@/views/other/components/AddEditWatermarkTemplateConfig'
import Goods from '@/api/goods'
import Basic from '@/api/basic'
import { base64ToFile } from '@/util/canvas'
import tableMixins from '@/mixins/tableMixins'
import { mapState } from 'vuex'
export default {
  mixins: [tableMixins],
  components: { FabricCanvas, AddEditWatermarkTemplateConfig },
  data() {
    return {
      searchValue: null,
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
          title: this.$t('marketingWatermark.name'),
          dataIndex: 'templateName',
          key: 'templateName',
          scopedSlots: { customRender: 'templateName' }
        },
        {
          title: this.$t('marketingWatermark.actions'),
          dataIndex: 'actions',
          key: 'actions',
          scopedSlots: { customRender: 'actions' }
        }
      ]
    }
  },
  computed: {
    ...mapState({
      title: (state) => state.vars?.menuName
    })
  },
  methods: {
    getTableData() {
      const { size, current } = this.$data.paginationData
      const { searchValue } = this.$data
      return Goods.getWatermarkTemplate({
        size,
        current,
        templateName: searchValue,
        templateType: 0
      })
    },
    onSearch(value) {
      this.$data.searchValue = value
      this.reLoadData()
    },
    async onPushOk() {
      const jsons = this.$refs.markTemplate.getJSON()
      const dataURL = this.$refs.markTemplate.getDataURL()
      this.$data.templateObjects = jsons
      this.$data.templateDataUrl = dataURL
      this.$data.settingVisible = true
    },
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
          this.$message.success(this.$t('common.handlerSuccess'))
        })
        .catch(() => {})
        .finally(() => {
          this.$data.settingConfirmLoading = false
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
      const jsonStr = this.$refs.editMarkTemplate.getJSON()
      const dataStr = this.$refs.editMarkTemplate.getDataURL()
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
