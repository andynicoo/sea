<template>
  <a-modal
    :visible="value"
    :width="800"
    title="仓库信息"
    @cancel="$emit('input', false)"
  >
    <a-button type="primary" size="small" style="margin-bottom: 15px">同步仓库信息</a-button>
    <a-table
      :pagination="false"
      :columns="columns"
      :data-source="data"
      :row-key="(record) => record.maId"
      :scroll="{ y: 400 }"
    />
  </a-modal>
</template>

<script>
import { getInvitationList } from '@/api/usermanage'
const initPagination = {
  current: 1,
  size: 10
}
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    currentObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      data: [],
      columns: [
        {
          title: '仓库名称',
          dataIndex: 'maAccount'
        },
        {
          title: '使用人数',
          dataIndex: 'registerTime'
        },
        {
          title: '状态',
          dataIndex: 'bindingTime'
        }
      ],
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total) => `共${total}人`
      },
      paginationParams: {
        ...initPagination
      },
      selectedRowKeys: []
    }
  },
  methods: {
    async getList() {
      const params = Object.assign({}, this.paginationParams, {
        memberId: this.currentObj.memberId
      })
      console.log(params)
      try {
        const { data } = await getInvitationList(params)
        this.data = data?.records || []
        this.pagination.total = data?.total || 0
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.flag-text {
  color: @primary-color;
}
.detail-title {
  display: flex;
  justify-content: space-between;
}
</style>
