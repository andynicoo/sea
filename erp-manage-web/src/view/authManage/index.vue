<template>
  <div ref="container" class="wrapper auth-manage">
    <!-- <div class="left">
      <m-tabs
        v-model="activeKey"
        :tabs-list="tabsList"
        @change="tabChange"
        @ok="getRoleList"
        @delete="roleDelete"
      />
    </div> -->
    <!-- <div class="right">
      <div class="title">成员</div> -->
    <div ref="filters" class="filters">
      <TableFilter
        :col-item="colItem"
        :form-model="formModel"
        @reset="reset"
        @submit="handleSearch"
      >
        <!-- <template #button>
          <div class="button-group">
            <a-button
              type="primary"
              class="g-mr10"
              @click="handleSearch"
            >查询</a-button>
          </div>
        </template> -->
      </TableFilter>
      <a-button
        type="primary"
        @click="handleEdit('add')"
      >添加人员</a-button>
    </div>
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="data"
      row-key="maId"
      :scroll="{ y: tableHeight }"
      @change="onChange"
    >
      <template #site="text">
        <span>{{ SITE[text] }}</span>
      </template>
      <template #status="text">
        <span>{{ STATUS[text] }}</span>
      </template>
      <template #roleName="text">
        <div class="tag-group">
          <a-tag v-for="item in text&&text.split(',')" :key="item" color="#87d068">
            {{ item }}
          </a-tag>
        </div>
      </template>
      <template #action="text,record">
        <span
          class="action-button g-mr10"
          :disabled="record.roleNameList && record.roleNameList.includes('superAdmin')"
          @click="handleEdit('edit', record)"
        >编辑</span>
        <span
          class="action-button"
          :disabled="record.roleNameList && record.roleNameList.includes('superAdmin')"
          @click="handleDelete(record,record.roleNameList && record.roleNameList.includes('superAdmin'))"
        >删除</span>
      </template>
    </a-table>
    <!-- </div> -->
    <AddUserModel
      v-model="visible"
      :data="currentObj"
      :action-type="actionType"
      :action-key.sync="activeKey"
      :role-list="roleList"
      @ok="getList"
    />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import AddUserModel from './components/AddUserModal'
// import mTabs from './components/tabs'
import { roleList, roleUserList, roleAdd, userDelete } from '@/api/authManage'
import { debounce, setTableHeight } from '@/utils'
import { mapGetters } from 'vuex'
const initPagination = {
  current: 1,
  size: 10
}
const initFormModel = {}
export default {
  name: 'RoleManage',
  components: {
    TableFilter,
    // mTabs,
    AddUserModel
  },
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total) => `共${total}条`
      },
      tableHeight: 400,
      params: {},
      paginationParams: {
        ...initPagination
      },
      visible: false,
      data: [],
      actionType: '',
      formModel: {},
      currentObj: {},
      activeKey: '',
      addName: '',
      tabsList: [],
      roleList: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      superAdmin: 'superAdmin'
    }),
    colItem({ roleList }) {
      return [
        {
          label: '关键词',
          itemType: 'input',
          key: 'accountOrMemberId'
        },
        {
          label: '角色',
          itemType: 'select',
          key: 'roleId',
          itemData: roleList
        }
      ]
    },
    columns() {
      return [
        {
          title: 'ID',
          dataIndex: 'maId'
        },
        {
          title: '真实姓名',
          dataIndex: 'maName'
        },
        {
          title: '角色名称',
          dataIndex: 'roleNameList',
          scopedSlots: { customRender: 'roleName' }
        },
        {
          title: '账号',
          dataIndex: 'maAccount'
        },
        // {
        //   title: '账号状态',
        //   dataIndex: 'status'
        // },
        {
          title: '更新时间',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  watch: {
    // activeKey(val) {
    //   this.getList()
    // }
  },
  created() {
    this.getList()
    this.getRoleList()
  },
  mounted() {
    this.setTableHeight()
    window.addEventListener('resize', this.setTableHeight)
  },
  beforeDestroy() {
    this.$store.commit('clearVars', 'roleList')
    window.removeEventListener('resize', this.setTableHeight)
  },
  methods: {
    async setTableHeight(e) {
      setTableHeight(this)
    },
    async getList(isFirst) {
      if (!isFirst) this.loading = true
      const params = Object.assign(
        // { roleId: this.activeKey },
        this.paginationParams,
        this.formModel,
        this.params
      )
      try {
        const { data } = await roleUserList(params)
        console.log(data)
        this.data = data?.records || []
        this.pagination.total = data?.total || 0
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    },
    async getRoleList() {
      try {
        const { data } = await roleList({ accSysCode: 'mg' })
        console.log(data)
        this.roleList = data && data.map(item => ({ label: item.name, value: item.roleId })).filter(item => item.label !== 'superAdmin')
        // const arr = data && data.map(item => (
        //   {
        //     roleId: item.roleId,
        //     title: item.name,
        //     key: item.roleId
        //   }
        // ))
        // this.tabsList = arr
        // this.$store.commit('setVars', { roleList: arr })
        // this.roleList = [...arr]
        // if (isFirst) {
        //   this.activeKey = data && data[0]?.roleId
        // }
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
    handleSearch() {
      this.resetParams()
      this.getList()
    },
    resetParams() {
      this.paginationParams = { ...initPagination }
      this.pagination.current = 1
      this.pagination.pageSize = 10
    },
    reset() {
      this.formModel = { ...initFormModel }
    },
    handleEdit(type, record) {
      if (type === 'edit' && record.roleNameList && record.roleNameList.includes('superAdmin')) {
        return
      }
      this.actionType = type
      this.currentObj = record
      this.visible = true
    },
    handleDelete(record, disabled) {
      if (disabled) return
      this.$confirm({
        title: '提示',
        content: '确认删除当前员工吗?',
        onOk: async() => {
          try {
            await userDelete({ memberId: record.memberId, maId: record.maId })
            this.$message.success('删除成功')
            this.getList()
          } catch (error) {
            console.error(error)
          }
        }
      })
    },
    // 切换用户(角色)组
    tabChange(item) {
      this.activeKey = item.key
    },
    handleClick(item) {
      console.log(item)
      item.add = true
    },
    async pressEnter() {
      console.log(this.addName)
      const params = {
        name: this.addName,
        accSysCode: 'mg'
      }
      try {
        await roleAdd(params)
        this.$message.success('添加成功')
        this.getRoleList()
      } catch (error) {
        console.error(error)
      }
    },
    focus(item) {
      console.log(item)
      item.add = false
      this.addName = ''
    },
    roleDelete() {
      const [first] = this.roleList || []
      this.activeKey = first?.key
    }
  }
}
</script>

<style lang="less" scoped>
.auth-manage {
  // display: flex;
  .left {
    flex: none;
    width: 170px;
    margin-right: 10px;
  }
  .right {
    .title {
      font-size: 17px;
      font-weight: 700;
    }
  }
  .add-user {
    color: #1275d5;
  }
  .filters {
    padding-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .tag-group{
    /deep/ .ant-tag{
      margin: 3px;
    }
  }
}
</style>
