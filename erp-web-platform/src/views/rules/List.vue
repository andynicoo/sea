<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" :title="title"> </a-page-header>
    <div class="me-card">
      <a-button type="primary" @click="onPush(null, 'append')">
        {{ $t('role.append') }}
      </a-button>
    </div>

    <div class="me-card">
      <a-table
        :loading="tableLoading"
        :columns="columns"
        :data-source="dataSource"
        :row-selection="rowSelection"
        :pagination="getPagination"
        @change="changePage"
        rowKey="roleId"
      >
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
      <AddEditRole :role="current" ref="AddEditRole" />
    </a-modal>
  </div>
</template>

<script>
import Member from '@/api/member'
import tableMixins from '@/mixins/tableMixins'
import AddEditRole from './components/AddEditRole'
import { mapState } from 'vuex'
export default {
  mixins: [tableMixins],
  components: {
    AddEditRole
  },
  data() {
    return {
      columns: [
        {
          title: 'ID',
          dataIndex: 'roleId'
        },
        {
          title: this.$t('role.name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('role.operation'),
          key: 'operationSlot',
          scopedSlots: { customRender: 'operationSlot' },
          width: 200
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
        return this.$t('member.addRole')
      }
      // if (modelType === 'append') return this.$t('member.addRole')
      // if (modelType === 'edit' && current) return this.$t('common.edit')+`${current.name}`
    },
    ...mapState({
      title: (state) => state.vars?.menuName
    })
  },
  mounted() {},
  methods: {
    getTableData() {
      const { size, current } = this.$data.paginationData
      return Member.getMemberRulePage({ size, current })
    },
    /**
     * 添加编辑
     */
    onPush(role, type) {
      this.$data.modelType = type
      this.$data.current = role
      this.$data.pushVisible = true
    },
    /**
     * 删除二次确认
     */
    onDelete({ roleId }) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: () => {
          Member.handleDeleteRule(roleId).then(() => {
            this.$message.success(this.$t('common.handlerSuccess'))
            this.reLoadData()
          })
        }
      })
    },
    /**
     * 提交
     */
    onOk() {
      this.$data.confirmLoading = true
      this.$refs.AddEditRole.onSubmit()
        .then(() => {
          this.$message.success(this.$t('common.handlerSuccess'))
          this.$data.modelType = null
          this.$data.current = null
          this.$data.pushVisible = false
          this.loadData()
        })
        .finally(() => {
          this.$data.confirmLoading = false
        })
    },
    /**
     * 取消
     */
    onCancel() {
      this.$data.modelType = null
      this.$data.current = null
      this.$data.pushVisible = false
    }
  }
}
</script>

<style lang="scss" scope></style>
