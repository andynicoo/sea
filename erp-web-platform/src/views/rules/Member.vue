<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" :title="title"> </a-page-header>
    <div class="me-card">
      <a-form layout="inline" :form="form">
        <a-form-item :label="$t('form.keyword')">
          <a-input
            class="me-w300"
            v-decorator="['keyword']"
            :placeholder="$t('member.placeholder')"
          />
        </a-form-item>
        <a-form-item>
          <a-button @click="onSearch" type="primary">
            {{ $t('form.search') }}
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button @click="onReset">
            {{ $t('form.reset') }}
          </a-button>
        </a-form-item>
        <a-form-item class="me-fr">
          <a-button @click="onPush(null, 'append')" type="primary">
            {{ $t('member.append') }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <div class="me-card">
      <a-table
        :loading="tableLoading"
        :columns="columns"
        :data-source="dataSource"
        :row-selection="rowSelection"
        :pagination="getPagination"
        @change="changePage"
        rowKey="maId"
      >
        <template slot="status" slot-scope="text, record">
          <span>{{
            record.status == 1 ? $t('common.open') : $t('common.close')
          }}</span>
        </template>
        <span slot="operationSlot" slot-scope="text, record">
          <a-button type="link" class="me-pa-1" @click="onPush(record, 'edit')">
            {{ $t('common.edit') }}
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" @click="onDelete(record)" class="me-error">
            {{ $t('common.delete') }}
          </a-button>
        </span>
      </a-table>
    </div>

    <a-modal
      :title="modalTitle"
      :visible="pushVisible"
      :confirm-loading="confirmLoading"
      destroyOnClose
      @ok="onOk"
      @cancel="onCancel"
      width="900px"
    >
      <AddEditMember :member="current" ref="AddEditMember" />
    </a-modal>
  </div>
</template>

<script>
import Member from '@/api/member'
import AddEditMember from './components/AddEditMember'
import tableMixins from '@/mixins/tableMixins'
import { mapState } from 'vuex'
export default {
  mixins: [tableMixins],
  components: {
    AddEditMember
  },
  data() {
    return {
      form: this.$form.createForm(this),
      keyword: '',
      columns: [
        {
          title: this.$t('member.maAccount'),
          dataIndex: 'maAccount'
        },
        {
          title: this.$t('member.maName'),
          dataIndex: 'maName'
        },
        {
          title: this.$t('member.roleName'),
          dataIndex: 'roleName'
        },
        {
          title: this.$t('member.statusSlot'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('member.createTime'),
          dataIndex: 'createTime'
        },
        {
          title: this.$t('member.operation'),
          key: 'operationSlot',
          scopedSlots: { customRender: 'operationSlot' }
        }
      ],
      pushVisible: false,
      confirmLoading: false,
      modelType: null
    }
  },
  computed: {
    modalTitle() {
      const { modelType, current } = this.$data
      if (modelType === 'edit' && !!current) {
        return this.$t('member.edit', { name: current.maName })
      } else {
        return this.$t('member.append')
      }
    },
    ...mapState({
      title: (state) => state.vars?.menuName
    })
  },
  methods: {
    getTableData() {
      const { keyword } = this.$data
      const { size, current } = this.$data.paginationData
      return Member.getSubMemberList({
        size,
        current,
        accountOrMemberId: keyword
      })
    },
    /**
     * 搜索
     */
    onSearch() {
      const { form } = this.$data
      form.validateFields().then(({ keyword }) => {
        this.$data.keyword = keyword
        this.reLoadData()
      })
    },
    /**
     * 重置
     */
    onReset() {
      const { form } = this.$data
      form.resetFields()
      this.onSearch()
    },
    /**
     * 添加修改员工
     */
    onPush(member, modelType) {
      this.$data.pushVisible = true
      this.$data.current = member
      this.$data.modelType = modelType
    },
    /**
     * 删除二次确认
     */
    onDelete(members) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: () => {
          this.deleteSubmit(members.maId)
        }
      })
    },
    /**
     * 删除提交
     */
    deleteSubmit(maId) {
      Member.handleDeleteMember({ maId }).then(() => {
        this.$message.success(this.$t('common.handlerSuccess'))
        this.reLoadData()
      })
    },
    /**
     * 确认回调
     */
    onOk() {
      this.$data.confirmLoading = true
      this.$refs.AddEditMember.onSubmit()
        .then((data) => {
          if (data.code === 0) {
            this.$data.pushVisible = false
            this.$data.current = null
            this.$data.modelType = null
            this.loadData()
            this.$message.success(this.$t('common.handlerSuccess'))
          }
        })
        .finally(() => {
          this.$data.confirmLoading = false
        })
    },
    /**
     * 取消回调
     */
    onCancel() {
      this.$data.pushVisible = false
      this.$data.current = null
      this.$data.modelType = null
    }
  }
}
</script>

<style lang="scss" scoped>
.me-w300 {
  width: 300px;
}
</style>
