<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" :title="title"> </a-page-header>
    <div class="me-card">
      <a-space>
        <a-button @click="openTemp(null)" type="primary">
          {{ $t('other.addNews') }}
        </a-button>
      </a-space>
    </div>

    <div class="me-card">
      <a-table
        :columns="columns"
        :pagination="getPagination"
        :data-source="dataSource"
        rowKey="violationLexiconId"
        :loading="tableLoading"
        @change="changePage"
      >
        <template slot="operation" slot-scope="text, record">
          <a-button type="link" class="me-pa-1" @click="openTemp(record)">
            {{ $t('common.edit') }}
          </a-button>
          <a-divider type="vertical" />
          <a-button
            type="link"
            class="me-pa-1 me-error"
            @click="onDelete(record)"
          >
            {{ $t('common.delete') }}
          </a-button>
        </template>
      </a-table>
    </div>

    <a-modal
      v-model="appendVisible"
      centered
      :title="titleWord + this.$t('other.thesaurus')"
      :okText="this.$t('common.submit')"
      :width="900"
      :maskClosable="false"
      destroyOnClose
      @ok="handleEditOk"
      @cancel="handleEditCancel"
      :confirm-loading="confirmLoading"
    >
      <AddEditIllegalWord
        :current="current"
        ref="illegalWord"
        :updataList="updataList"
        :handleCancel="handleCancel"
      />
    </a-modal>
  </div>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import Basic from '@/api/basic'
import AddEditIllegalWord from './components/AddEditIllegalWord'
import { mapState } from 'vuex'
export default {
  components: {
    AddEditIllegalWord
  },
  mixins: [tableMixins],
  computed: {
    ...mapState({
      title: (state) => state.vars?.menuName
    })
  },
  data() {
    return {
      columns: [
        {
          title: this.$t('other.IllegalWords'),
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' },
          width: 350
        },
        {
          title: this.$t('other.addTime'),
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: this.$t('other.updateTime'),
          dataIndex: 'updateTime',
          scopedSlots: { customRender: 'updateTime' }
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      appendVisible: false,
      current: null,
      confirmLoading: false,
      titleWord: ''
    }
  },
  methods: {
    getTableData() {
      return Basic.getIllegalWord(this.$data.paginationData)
    },
    openTemp(obj) {
      this.$data.appendVisible = true
      obj == null
        ? ((this.$data.current = null),
          (this.$data.titleWord = this.$t('other.addNews')))
        : ((this.$data.current = obj),
          (this.$data.titleWord = this.$t('common.edit')))
      // this.$data.current= obj
    },
    async handleEditOk() {
      await this.$refs.illegalWord.submit()
    },

    handleEditCancel() {
      this.$data.appendVisible = false
    },
    //取消新增编辑
    handleCancel(visible) {
      console.log('Clicked cancel button')
      this.$data[visible] = false
    },
    updataList() {
      this.loadData()
    },
    onDelete({ violationLexiconId }) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          await Basic.delIllegalWord({ violationLexiconId })
          this.$message.success(this.$t('common.handlerSuccess'))
          this.loadData('delete')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
