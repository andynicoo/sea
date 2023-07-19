<template>
  <div class="usertags">
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="data"
      :row-key="(record) => record.memberLabelId"
      @change="onChange"
    >
      <template
        slot="action"
        slot-scope="text, record"
      >
        <a-space>
          <span
            class="edit g-cup"
            @click="editTagsObj(record)"
          >修改配置</span>
          <span
            class="me-status-error g-cup"
            @click="deleteTags(record)"
          >删除</span>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script>
import { addUserTagsPage, deleteUserTags } from '@/api/usermanage'
const initPagination = {
  current: 1,
  size: 10
}
export default {
  data() {
    return {
      data: [],
      selectedRowKeys: [],
      paginationParams: {
        ...initPagination
      },
      params: {},
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total) => `共${total}个`
      }
    }
  },
  computed: {
    columns() {
      return [
        {
          title: '标签名称',
          dataIndex: 'memberLabelName',
          scopedSlots: { customRender: 'memberLabelName' }
        },

        {
          title: '操作',
          key: 'action',
          width: 160,
          scopedSlots: {
            customRender: 'action'
          }
        }
      ]
    }
  },
  async created() {
    this.getList()
  },
  methods: {
    async getList(flag = '') {
      flag === 'delete' ? (this.paginationParams.current = 1) : ''
      const params = Object.assign(
        {},
        this.paginationParams // 分页参数
      )
      try {
        const { data } = await addUserTagsPage(params)
        this.data = data?.records || []
        this.pagination.total = data?.total || 0
      } catch (error) {
        console.error(error)
      }
    },
    onChange(pagination, filters, sorter) {
      this.pagination = { ...pagination }
      const { current, pageSize: size } = pagination
      const { field, order } = sorter
      this.paginationParams = { current, size }
      const orderObj = {
        ascend: 'asc',
        descend: 'desc'
      }
      this.params = {
        field,
        order: orderObj[order]
      }
      this.getList()
    },
    deleteTags({ memberLabelId }) {
      this.$confirm({
        title: '警告',
        content: '删除后数据将不可恢复，确认删除吗?',
        onOk: async () => {
          await deleteUserTags(memberLabelId)
          this.$message.success('删除成功')
          this.getList('delete')
          this.$emit('asyncList')
        }
      })
    },
    // 编辑单个标签回填数据
    editTagsObj(obj) {
      let params = {
        obj: obj
      }
      this.$emit('getTagsObj', params)
    }
  }
}
</script>

<style lang="less"></style>
