<template>
  <div
    ref="container"
    class="all-user wrapper"
  >
    <div
      ref="filters"
      class="filters"
    >
      <TableFilter
        :col-item="colItem"
        :form-model="formModel"
        @submit="handleSearch"
        @reset="reset"
      >
        <template #button>
          <div class="btn-box">
            <a-button
              type="primary"
              @click="handleSearch"
            >查询</a-button>
            <a-button
              type="primary"
              @click="classification()"
            >归类</a-button>
            <a-button @click="reset">重置</a-button>
          </div>
        </template>
      </TableFilter>
    </div>
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="data"
      :row-key="(record, index) => index"
      :scroll="{ y: tableHeight }"
      @change="onChange"
    />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import {
  getForwarderListAll,
  getClassificationList,
  accountsClassification
} from '@/api/accountManage'
import { debounce, setTableHeight } from '@/utils/index'
const initPagination = {
  current: 1,
  size: 10
}
const initFormModel = {
  maAccount: '',
  inviter: ''
}
export default {
  name: 'AccountsClassification',
  components: {
    TableFilter
  },
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
      formModel: {
        ...initFormModel
      },
      data: [],
      forwarderList: [],
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
        showTotal: (total) => `共${total}人`
      },
      selectAll: false,
      tableHeight: 400
    }
  },
  computed: {
    colItem() {
      return [
        {
          label: '账号',
          itemType: 'input',
          placeholder: '请输入账号',
          key: 'maAccount'
        },
        {
          label: '货代商',
          itemType: 'select',
          key: 'inviter',
          itemData: this.forwarderList.map((v) => {
            return {
              label: v.forwarderName,
              value: v.id
            }
          })
        }
      ]
    },
    columns() {
      return [
        {
          title: '用户账号（手机号）',
          dataIndex: 'maAccount'
        },
        {
          title: '原邀请帐号',
          dataIndex: 'oriMaAccount'
        },
        {
          title: '原邀请码',
          dataIndex: 'oriInvitationCode'
        },
        {
          title: '原邀请ID',
          dataIndex: 'oriInviter'
        },
        {
          title: '货代商帐号',
          dataIndex: 'forwarderAccount'
        },
        {
          title: '货代商邀请码',
          dataIndex: 'invitationCode'
        },
        {
          title: '货代商ID',
          dataIndex: 'forwarderInfoId'
        }
      ]
    }
  },
  created() {
    this.getList()
    this.getForwarderListAll()
  },
  mounted() {
    this.setTableHeight()
    window.addEventListener('resize', this.setTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTableHeight)
  },
  methods: {
    async setTableHeight() {
      setTableHeight(this)
    },
    async getForwarderListAll() {
      try {
        const { data } = await getForwarderListAll({})
        this.forwarderList = data || []
      } catch (error) {
        console.error(error)
      }
    },
    async getList() {
      const params = Object.assign(
        {},
        this.paginationParams, // 分页参数
        this.params, // 排序参数或者别的
        this.formModel // 过滤参数
      )
      try {
        const { data } = await getClassificationList(params)
        this.data = data?.records || []
        this.pagination.total = data?.total || 0
      } catch (error) {
        console.error(error)
      }
    },
    async classification() {
      if (!this.formModel.maAccount) {
        this.$message.error('账号必填')
        return false
      }
      if (!this.formModel.inviter) {
        this.$message.error('货代商必填')
        return false
      }
      try {
        const params = {
          maAccount: this.formModel.maAccount,
          inviter: this.formModel.inviter
        }
        await accountsClassification(params)
        this.$message.success('操作成功')
        this.reset()
        this.getList()
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
    reset() {
      this.formModel = { ...initFormModel }
    },
    handleSearch() {
      this.resetParams()
      this.getList()
    },
    resetParams() {
      this.paginationParams = { ...initPagination }
      this.pagination.current = 1
      this.pagination.pageSize = 10
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  padding: 16px;
  padding-top: 20px;
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  .filters {
    padding-bottom: 10px;
  }
  .btn-box {
    & > button:not(:last-child) {
      margin-right: 5px;
    }
  }
}
</style>
