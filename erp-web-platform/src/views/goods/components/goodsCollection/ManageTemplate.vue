<template>
  <div>
    <a-table
      rowKey="templateId"
      :columns="columns"
      :pagination="false"
      :data-source="templateList"
    > 
      <div slot="customTitle">
        {{$t('goodsCollection.templateName')}}
        <span class="create-template" @click="createTemplate"><a-icon type="plus" /> {{$t('goodsCollection.newTemplate')}}</span>
      </div>
      <a slot="templateName" slot-scope="text, record">
        <a-input v-model="record.templateName"  />
      </a>
      
      <div slot="_title" slot-scope="text, record">
        <template v-if="record">
          <a
            target="__blank"
            :href="record.itemUrl"
            class="me-link overflow-text"
          >
            {{ text }}
          </a>
        </template>
      </div>

      <div slot="operation" slot-scope="text, record">
        <a-button
          :disabled="record.defaultTemplate === 1 || record.defaultTemplate === true"
          type="danger"
          size="small"
          @click="onDelete(record)"
        >
          {{$t('common.delete')}}
        </a-button>
      </div>
    </a-table>
    <!-- 创建模板 -->
    <a-modal
      :visible="createVisible"
      :title="$t('goodsCollection.newTemplate')"
      :confirm-loading="createLoading"
      @ok="createTemplateOk"
      @cancel="createTemplateCancel"
      destroyOnClose
      :width="600"
    >
      <CreateTemplate ref="createTemplate" />
    </a-modal>
  </div>
  
</template>

<script>
import CrawlApi from '@/api/crawl'
import CreateTemplate from './CreateTemplate'
export default {
  components: {
    CreateTemplate
  },
  props: {
    list: {
      type: Array,
      defalut: []
    },
    templateType: {
      type: Number,
      defalut: 1
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      createLoading: false,
      createVisible: false,
      templateList: [],
      columns: [
        {
          dataIndex: 'templateName',
          key: 'templateName',
          slots: { title: 'customTitle' },
          scopedSlots: { customRender: 'templateName' },
        },
        {
          title: this.$t('goodsCollection.creator'),
          dataIndex: 'createBy',
          key: 'createBy'
        },
        {
          title: this.$t('goodsCollection.columnOperationSlot'),
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  mounted() {
    this.templateList = [...this.list]
  },
  methods: {
    submit() {
      return new Promise(async (resolve, reject) => {
        let arr = this.templateList.map(item => item.templateName)
        if (new Set(arr).size !== arr.length) {
          this.$message.warning(this.$t('goodsCollection.warningContent3'))
          reject()
          return
        }
        // 模板名称不能为空
        if (this.templateList.some(item => !item.templateName)) {
          this.$message.warning(this.$t('goodsCollection.warningContent4'))
          reject()
          return
        }
        const updatedTemplate = this.templateType === 1 ? CrawlApi.updateCrawlTemplateName(this.templateList) : CrawlApi.editClaimTemplateName({batchData: [...this.templateList]})
        await updatedTemplate
        resolve()
      })
    },
    // 创建模板
    createTemplate() {
      this.createVisible = true
    },
    createTemplateOk() {
      this.createLoading = true
      const submit = this.templateType === 1 ? this.$refs.createTemplate.collectSubmit() : this.$refs.createTemplate.claimSubmit() 
      submit.then(() => {
        this.createLoading = false
        this.createVisible = false
        this.$message.success(this.$t('common.handlerSuccess'))
        this.getListCrawlTemplate()
      }).catch(() => {
        this.createLoading = false
      })
    },
    createTemplateCancel() {
      this.createVisible = false
      this.createLoading = false
    },
    getListCrawlTemplate() {
      const getTemplateList = this.templateType === 1 ? CrawlApi.listCrawlTemplate() : CrawlApi.getClaimTemplateList()
      getTemplateList.then(({data = []}) => {
        this.templateList = data
      })
    },
    onDelete(items) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          const delTemplate = this.templateType === 1 ? CrawlApi.deleCrawlTemplate({templateId: items.templateId}) : CrawlApi.deleClaimTemplate(items.templateId)
          await delTemplate
          this.$message.success(this.$t('common.handlerSuccess'))
          this.getListCrawlTemplate()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.create-template{
  color: #f7622f;
  margin-left: 10px;
  cursor: pointer;
}
</style>
