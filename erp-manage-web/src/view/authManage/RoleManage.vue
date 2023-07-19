<template>
  <div ref="container" class="wrapper auth-manage">
    <div ref="filters" class="filters">
      <TableFilter
        :col-item="colItem"
        :form-model="formModel"
        @reset="reset"
        @submit="handleSearch"
      />
      <a-button
        type="primary"
        @click="handleEdit('add')"
      >新建角色</a-button>
    </div>
    <a-table
      :pagination="false"
      :columns="columns"
      :data-source="data"
      row-key="roleId"
      :scroll="{ y: tableHeight }"
      @change="onChange"
    >
      <template #site="text">
        <span>{{ SITE[text] }}</span>
      </template>
      <template #action="text,record">
        <span
          class="action-button g-mr10"
          @click="handleEdit('edit',record)"
        >编辑</span>
        <span
          class="action-button"
          :disabled="record.roleId === 4"
          @click="handleDelete(record)"
        >删除</span>
      </template>
    </a-table>
    <RoleAuthDrawer
      v-model="authVisible"
      :data="currentObj"
      :menu-list="menuList"
      :menu-ids="menuIds"
      :action-type="actionType"
      :auth-api="getRoleAuth"
      @submit="submit"
    />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import RoleAuthDrawer from './components/RoleAuthDrawer.vue'
import { erpRoleAuthDelete, roleList, getMenuList, getRoleAuth, roleAdd, roleEdit } from '@/api/authManage'
import { debounce, setTableHeight, listToTree } from '@/utils'
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
    RoleAuthDrawer
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
      authVisible: false,
      data: [],
      menuList: [],
      menuListCopy: [],
      menuIds: [],
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
    colItem() {
      return [
        {
          label: '角色名称',
          itemType: 'input',
          key: 'name'
        }
      ]
    },
    columns() {
      return [
        {
          title: 'ID',
          dataIndex: 'roleId'
        },
        {
          title: '角色名称',
          dataIndex: 'name'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
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
  created() {
    this.getList()
    this.getMenuList()
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
    getRoleAuth,
    roleAdd,
    roleEdit,
    async setTableHeight(e) {
      setTableHeight(this)
    },
    async getList() {
      const params = Object.assign(
        this.paginationParams,
        this.formModel,
        this.params,
        { accSysCode: 'mg' }
      )
      try {
        const { data } = await roleList(params)
        this.data = data || []
        // this.pagination.total = data?.total || 0
      } catch (error) {
        console.error(error)
      }
    },
    async getMenuList() {
      try {
        const { data } = await getMenuList({ accSysCode: 'mg' })
        const map = {}
        const arr = data && data.reduce((acc, cur) => {
          map[cur.menuId] = cur
          return acc.concat({
            menuName: cur.menuName,
            menuId: cur.menuId,
            parentId: cur.parentId,
            menuType: cur.menuType,
            disabled: !cur.status,
            status: cur.status,
            scopedSlots: { title: 'title' }
          })
        }, [])
        // const list = arr.filter(item => {
        //   const parentObj = map[item.menuId]
        //   // 过滤掉禁用的菜单以及它下面的所有的子级
        //   if ((!item.parentId || parentObj && parentObj.status && item.status)) {
        //     // this.menuIds.push(item.menuId)
        //     return true
        //   }
        // })
        this.menuListCopy = listToTree(arr, (v) => v.status)
      } catch (error) {
        console.error(error)
      }
    },
    async submit(val) {
      const params = {
        ...val,
        accSysCode: 'mg'
      }
      try {
        if (this.actionType === 'edit') {
          await roleEdit(params)
        } else {
          await roleAdd(params)
        }
        this.$message.success('保存成功')
        this.authVisible = false
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
      if (record?.roleId === 4) {
        this.menuList = [...this.menuListCopy]
      } else {
        this.menuList = this.menuListCopy.filter(item => item.menuId !== 10005)
      }
      this.menuIds = this.mapMenuIds(this.menuList)
      this.actionType = type
      this.currentObj = record || {}
      this.authVisible = true
    },
    mapMenuIds(list = [], path = []) {
      list.forEach(item => {
        if (item.status) path.push(item.menuId)
        if (item.children && item.children.length) {
          this.mapMenuIds(item.children, path)
        }
      })
      return path
    },
    handleDelete(record) {
      if (record.roleId === 4) return
      this.$confirm({
        title: '提示',
        content: '确认删除当前角色吗?',
        onOk: async() => {
          try {
            await erpRoleAuthDelete(record.roleId)
            this.$message.success('删除成功')
            this.getList()
          } catch (error) {
            console.error(error)
          }
        }
      })
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
