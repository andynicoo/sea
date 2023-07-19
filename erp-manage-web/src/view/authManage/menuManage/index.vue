<template>
  <div
    ref="container"
    class="wrapper role-auth"
  >
    <div
      ref="export"
      class="action"
    >
      <a-button
        type="primary"
        class="g-mr15"
        @click="handleEdit('add')"
      >新增</a-button>
      <a-button
        type="primary"
        :disabled="!selectedRowKeys.length"
        @click="handleDelete(selectedRowKeys)"
      >批量删除</a-button>
      <a-dropdown>
        <a-menu
          slot="overlay"
          @click="handleMenuClick"
        >
          <a-menu-item
            v-for="item in menuItem"
            :key="item.key"
          >
            {{ item.label }}
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px;">
          表格操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
    <a-table
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      :pagination="false"
      :columns="columns"
      :data-source="menuList"
      :scroll="{ y: tableHeight }"
      row-key="menuId"
      :expanded-row-keys.sync="expandedRowKeys"
      @expandedRowsChange="expand"
    >
      <template #action="text,record">
        <div>
          <span
            class="action-button g-mr10"
            @click="handleEdit('edit', record)"
          >编辑</span>
          <span
            class="action-button"
            :disabled="record.menuId === 10005"
            @click="handleDelete([record.menuId],record)"
          >删除</span>
          <a-dropdown v-if="record.menuType !== 'F'">
            <span class="action-button">
              更多
              <a-icon type="down" />
            </span>
            <a-menu
              slot="overlay"
              @click="(e) => handleMore(e, record)"
            >
              <a-menu-item key="1">添加下级菜单</a-menu-item>
              <a-menu-item key="2">添加按钮/权限</a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </template>
    </a-table>
    <AddMenuModal
      ref="menuModal"
      v-model="visible"
      :data="currentObj"
      :action-type="actionType"
      :menu-select="menuList"
      @ok="getMenuList"
    />
  </div>
</template>

<script>
import AddMenuModal from './components/AddMenuModal'
import { getMenuList, deleteMenu, editAlphaAccountMenu } from '@/api/authManage'
import { cloneDeep } from 'lodash'
import { mapGetters } from 'vuex'
import { debounce, setTableHeight } from '@/utils'
export default {
  name: 'AlphaAuth',
  components: {
    AddMenuModal
  },
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
      activeKey: 'admin',
      addName: '',
      replaceFields: {
        title: 'menuName',
        key: 'menuId'
      },
      checkedKeys: [],
      currentObj: {},
      menuList: [],
      menuArr: [],
      map: {},
      tableHeight: 'auto',
      visible: false,
      menuSelect: [],
      actionType: 'add',
      selectedRowKeys: [],
      expandedRowKeys: [],
      ids: [],
      menuItem: [
        {
          label: '展开所有',
          key: 1
        },
        {
          label: '合并所有',
          key: 2
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      superAdmin: 'superAdmin'
    }),
    columns() {
      return [
        {
          title: '菜单名称',
          dataIndex: 'menuName',
          width: 210,
          ellipsis: true,
          scopedSlots: { customRender: 'menuName' }
        },
        {
          title: '菜单类型',
          dataIndex: 'menuType',
          customRender: (text) => {
            const obj = {
              M: '一级菜单',
              F: '按钮/权限',
              C: '菜单'
            }
            return <span>{obj[text]}</span>
          }
        },
        {
          title: 'code',
          dataIndex: 'menuCode',
          customRender: (text) => {
            const directives = [{ name: 'copy', value: text }]
            return <span {...{ directives }}>{text}</span>
          }
        },
        {
          title: 'icon',
          dataIndex: 'icon'
        },
        {
          title: '路径',
          dataIndex: 'href'
        },
        // {
        //   title: '国际化',
        //   dataIndex: 'menuI18n',
        //   ellipsis: true,
        //   customRender: (text) => {
        //     const directives = [{ name: 'copy', value: text }]
        //     return (
        //       <span {...{ directives }} title={text}>
        //         {text}
        //       </span>
        //     )
        //   }
        // },
        {
          title: '状态',
          dataIndex: 'status',
          width: 100,
          customRender: (text, record) => {
            return (
              <a-switch
                checked-children='启用'
                un-checked-children='禁用'
                checked={!!text}
                onChange={(checked) => this.statusChange(checked, record)}
              />
            )
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          ellipsis: true
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '操作',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created() {
    this.getMenuList()
  },
  mounted() {
    this.setTableHeight()
    window.addEventListener('resize', this.setTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTableHeight)
  },
  methods: {
    setTableHeight(e) {
      setTableHeight(this, -64)
    },
    init() {
      this.checkedKeys = []
      const menuList = this.menuArr
      const toTree = (list = []) => {
        this.map = list.reduce((init, cur) => {
          init[cur.menuId] = cur
          return init
        }, {})
        return list.filter((item) => {
          const obj = this.map[item.parentId]
          if (item.parentId && obj) {
            obj.children ? obj.children.push(item) : (obj.children = [item])
            return false
          }
          return true
        })
      }
      this.menuList = toTree(cloneDeep(menuList))
    },
    async getMenuList() {
      try {
        const { data } = await getMenuList({ accSysCode: 'mg' })
        this.ids = data && data.map((item) => item.menuId)
        this.menuArr =
          data && data.sort((a, b) => (b.sort ?? 0) - (a.sort ?? 0))
        this.init()
      } catch (error) {
        console.error(error)
      }
    },
    async handleEdit(type, obj) {
      this.actionType = type
      this.visible = true
      this.currentObj = obj ?? {}
    },
    reset() {
      this.menuList = []
      this.activeKey = ''
    },
    handleCancel() {
      this.title = this.currentObj.title
      this.activeKey = this.currentObj.key
      this.getRoleAuth()
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    async statusChange(checked, record) {
      const {
        menuId,
        sort,
        isShow,
        menuName,
        href,
        menuCode,
        menuI18n,
        menuType,
        parentId,
        icon
      } = record
      const params = {
        menuId,
        sort,
        isShow: Number(isShow),
        menuName,
        href,
        menuCode,
        menuI18n,
        menuType,
        parentId,
        icon,
        status: Number(checked)
      }
      try {
        await editAlphaAccountMenu(params)
        this.getMenuList()
      } catch (error) {
        console.error(error)
      }
    },
    handleDelete(ids, record) {
      if (record?.menuId === 10005) return
      this.$confirm({
        title: '提示?',
        content: '确定删除吗?',
        onOk: async() => {
          try {
            await deleteMenu({ ids })
            this.$message.success('删除成功')
            this.getMenuList()
          } catch (error) {
            console.error(error)
          }
        }
      })
    },
    handleMore(e, item) {
      this.actionType = 'add'
      this.currentObj = {
        accSysCode: 'erp',
        menuType: e.key === '1' ? 'C' : 'F',
        parentId: item.menuId,
        isShow: true,
        status: true,
        sort: 0
      }
      this.visible = true
      setTimeout(() => {
        this.$refs.menuModal.setFormModel()
      })
    },
    expand(expandedRowKeys) {
      this.expandedRowKeys = expandedRowKeys
    },
    handleMenuClick(e) {
      if (e.key === 1) {
        this.expandedRowKeys = [...this.ids]
      } else {
        this.expandedRowKeys = []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.role-auth {
  .action {
    display: flex;
    padding-bottom: 20px;
  }
}
</style>
