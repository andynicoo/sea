<template>
  <div>
    <a-table
      rowKey="id"
      :columns="columns"
      :pagination="false"
      :data-source="templateList"
    > 
      <div slot="operation" slot-scope="text, record">
        <a-button
          type="primary"
          size="small"
          class="me-mr-1"
          @click="onEdit(record)"
        >
          {{$t('common.edit')}}
        </a-button>
        <a-button
          type="danger"
          size="small"
          @click="onDelete(record)"
        >
          {{$t('common.delete')}}
        </a-button>
      </div>
    </a-table>
    <!-- 编辑模板 -->
    <a-modal
      :visible="editVisible"
      :title="$t('goodsCollection.setPriceTem8')"
      :confirm-loading="editLoading"
      :maskClosable="false"
      @ok="editTemplateOk"
      :bodyStyle="{padding: 0}"
      @cancel="editTemplateCancel"
      destroyOnClose
      :width="800"
    >
      <SetPriceTemplateCreate ref="editTemplate" :formData="formData" :countryRate="countryRate" />
    </a-modal>
  </div>
  
</template>

<script>
import Goods from '@/api/goods'
import SetPriceTemplateCreate from './SetPriceTemplateCreate'
export default {
  components: {
    SetPriceTemplateCreate
  },
  props: {
    list: {
      type: Array,
      defalut: []
    },
    countryRate: {
      type: Number,
      defalut: 1
    },
    countryCode: {
      type: String,
      defalut: ''
    },
  },
  data() {
    return {
      formData: {},
      editLoading: false,
      editVisible: false,
      templateList: [],
      columns: [
        {
          title: this.$t('goodsCollection.templateName'),
          dataIndex: 'name',
          key: 'name'
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
    onDelete(items) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          await Goods.delPriductPriceTemplate(items.id)
          this.$message.success(this.$t('common.handlerSuccess'))
          this.getPriductPriceTemplateList()
        }
      })
    },
    onEdit(items) {
      this.formData = items
      this.editVisible = true
    },
    getPriductPriceTemplateList() {
      return new Promise( (resolve) => {
        Goods.getPriductPriceTemplateList(this.countryCode).then(({data}) => {
          this.templateList = data || []
          resolve(data)
        })
      })
    },
    editTemplateOk() {
      this.editLoading = true
      this.$refs.editTemplate.editSubmit().then(res => {
        this.editLoading = false
        this.editVisible = false
        this.$message.success(this.$t('common.handlerSuccess'))
        this.getPriductPriceTemplateList()
      }).catch((err) => {})
      .finally(() => {
        this.editLoading = false
      })
    },
    editTemplateCancel() {
      this.editVisible = false
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
