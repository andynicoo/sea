<template>
  <div ref="container" class="wrapper role-auth">
    <div class="role-auth-left">
      <m-tabs
        ref="tabs"
        v-model="activeKey"
        :tabs-list="tabsList"
        :active-key.sync="activeKey"
        :checked-keys="checkedKeys"
        :role-name.sync="title"
        @change="tabChange"
        @ok="handleOK"
        @reset="init"
        @cancel="handleCancel"
      />
    </div>
    <div class="role-auth-right">
      <!-- <div class="title">
        用户组成员
        <div class="title-content-tags">
          <a-tag v-for="item in 15" :key="item" color="orange">杨天尊</a-tag>
        </div>
      </div> -->
      <div ref="filters" class="role-config-container">
        <div class="title">{{ title }}</div>
        <a-button type="primary" :disabled="activeKey === 4 || !checkedKeys.length" @click="handleSava">保存</a-button>
      </div>
      <a-table
        :pagination="false"
        :columns="columns"
        :data-source="menuList"
        :scroll="{ y: tableHeight }"
        row-key="menuId"
      >
        <template #menuName="text,record">
          <a-checkbox
            :checked="record.checked"
            :indeterminate="record.indeterminate"
            :disabled="activeKey === 4"
            @change="(e) => change(e, record)"
          >{{ text }}</a-checkbox>
        </template>
        <template #buttonAuth="text">
          <a-checkbox
            v-for="item in text"
            :key="item.menuId"
            :checked="item.checked"
            :disabled="activeKey === 4"
            @change="(e) => editChange(e,item)"
          >{{ item.menuName }}</a-checkbox>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import mTabs from './components/tabs'
import { roleList, getRoleAuth, getMenuList } from '@/api/authManage'
import { cloneDeep } from 'lodash'
import { mapGetters } from 'vuex'
import { debounce, setTableHeight } from '@/utils'
export default {
  name: 'RoleAuth',
  components: {
    mTabs
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
      currentObj: {
        title: ''
      },
      title: '',
      tabsList: [],
      menuList: [],
      menuArr: [],
      map: {},
      tableHeight: 'auto'
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
          scopedSlots: { customRender: 'menuName' }
        },
        {
          title: '菜单功能',
          dataIndex: 'buttonAuth',
          scopedSlots: { customRender: 'buttonAuth' }
        }
      ]
    }
  },
  created() {
    this.getRoleList(true)
    this.getMuneList()
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
      setTableHeight(this)
    },
    init() {
      this.checkedKeys = []
      // if (!this.activeKey) return
      const menuList = this.menuArr
      const toTree = (list = []) => {
        this.map = list.reduce((init, cur) => {
          init[cur.menuId] = cur
          return init
        }, {})
        return list.filter(item => {
          const obj = this.map[item.parentId]
          if (item.parentId && obj) {
            if (item.menuType === 'F') {
              obj.buttonAuth ? obj.buttonAuth.push(item) : obj.buttonAuth = [item]
            } else {
              obj.children ? obj.children.push(item) : obj.children = [item]
            }
            return false
          }
          // 暂时过滤掉权限菜单
          if (item.menuCode === 'role' && this.activeKey !== 4) {
            return false
          }
          return true
        })
      }
      this.menuList = toTree(cloneDeep(menuList))
    },
    initChecked() {
      Object.entries(this.map).forEach(([key, node]) => {
        this.$set(node, 'checked', false)
        this.$set(node, 'indeterminate', false)
      })
      this.checkedKeys.forEach(key => {
        const node = this.map[key]
        // 更新菜单选中
        if (node && !node.children && node.menuType !== 'F') {
          this.$set(node, 'checked', true)
          this.updateCheckedUp(node)
        }
        // 更新按钮选中
        if (node && node.menuType === 'F') {
          this.$set(node, 'checked', true)
        }
      })
    },
    async getMuneList() {
      try {
        const { data } = await getMenuList({ accSysCode: 'mg' })
        this.menuArr = data ?? []
        this.init()
        this.getRoleAuth()
      } catch (error) {
        console.error(error)
      }
    },
    // 角色列表
    async getRoleList(isFirst) {
      try {
        const { data } = await roleList({ accSysCode: 'mg' })
        const arr = data && data.map(item => (
          {
            roleId: item.roleId,
            title: item.name,
            key: item.roleId
          }
        ))
        this.tabsList = arr
        if (isFirst) {
          this.currentObj = arr && arr[0] || {}
          this.title = this.currentObj.title
          this.activeKey = arr && arr[0]?.roleId
        }
      } catch (error) {
        console.error(error)
      }
    },
    // 权限集合
    async getRoleAuth() {
      if (!this.activeKey) return
      try {
        const { data } = await getRoleAuth(this.activeKey)
        this.checkedKeys = data?.memberMenuId ?? []
        this.initChecked()
      } catch (error) {
        console.error(error)
      }
    },
    tabChange(item) {
      this.$refs.tabs.reset()
      this.currentObj = item
      this.title = item.title
      this.activeKey = item.key
      this.init()
      this.getRoleAuth()
    },
    editChange(e, item) {
      const node = this.map[item.menuId]
      this.$set(node, 'checked', e.target.checked)
      this.getCheckedNodes()
    },
    change(e, item) {
      const node = this.map[item.menuId]
      const checked = e.target.checked
      this.$set(node, 'checked', checked)
      this.$set(node, 'indeterminate', !checked)
      this.updateCheckedUp(node)
      this.updateCheckDown(node, { checked: e.target.checked, indeterminate: false })
      this.getCheckedNodes()
    },
    /**  有父节点情况
       * 1.如果当前节点选中,那么其父节点的所有子节点全选中,那么父节点也选中
       * 父节点indeterminate与checked取反
       * 2.如果当前没选中,父节点checked为false
       * 父节点indeterminate只要有一个子节点选中就为true
       * 最后递归调用自己
       */
    updateCheckedUp(node) {
      const parentNode = this.map[node.parentId]
      const childrenList = parentNode?.children
      // 递归出口
      if (!parentNode) return
      if (node.checked) {
        this.$set(parentNode, 'checked', childrenList && childrenList.every(item => item.checked))
        this.$set(parentNode, 'indeterminate', !parentNode.checked)
      } else {
        this.$set(parentNode, 'checked', false)
        this.$set(parentNode, 'indeterminate', childrenList && childrenList.some(item => item.checked))
      }
      this.updateCheckedUp(parentNode)
    },
    updateCheckDown(node, changes = {}) {
      for (const key of Object.keys(changes)) {
        this.$set(node, key, changes[key])
      }
      if (node.children) {
        (node.children).forEach(item => {
          this.updateCheckDown(item, changes)
        })
      }
    },
    getCheckedNodes() {
      const arr = Object.entries(this.map).reduce((init, [key, value]) => {
        init.push(value)
        return init
      }, [])
      this.checkedKeys = arr.filter(item => item.checked || item.indeterminate).map(item => item.menuId)
    },
    async handleSava() {
      if (!this.checkedKeys.length) {
        this.$message.warn('最少选择一个菜单')
        return
      }
      this.$refs.tabs.pressEnter(this.title)
      // const params = {
      //   menus: this.checkedKeys,
      //   roleId: this.activeKey,
      //   name: this.currentObj.title
      // }
      // try {
      //   await roleEdit(params)
      //   this.$message.success('更新菜单权限成功')
      //   this.getRoleAuth()
      // } catch (error) {
      //   console.error(error)
      // }
    },
    reset() {
      this.menuList = []
      this.activeKey = ''
    },
    handleOK(type) {
      this.getRoleList(type === 'add')
      this.getRoleAuth()
    },
    handleCancel() {
      this.title = this.currentObj.title
      this.activeKey = this.currentObj.key
      this.getRoleAuth()
    }
  }
}
</script>

<style lang="less" scoped>
.role-auth {
  display: flex;
  .role-auth-right{
    flex:1;
  }
  .role-auth-left {
    flex: none;
    width: 170px;
  }
  .role-auth-right {
    padding-left: 16px;
    .title {
      font-size: 17px;
      font-weight: 700;
    }
  }
  .role-config-container {
    // margin-top: 20px;
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    .title {
      font-size: 17px;
      font-weight: 700;
    }
  }
}
</style>
