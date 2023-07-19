<template>
  <a-drawer
    :title="title"
    width="640"
    placement="right"
    :visible="value"
    :after-visible-change="afterVisibleChange"
    @close="onClose"
  >
    <SearchForm
      ref="searchForm"
      :form-model="formModel"
      :form-item="formItem"
      layout="vertical"
      @submit="submit"
    >
      <template #menus>
        <a-tree
          ref="tree"
          :checked-keys="formModel.menus"
          checkable
          :expanded-keys="expandedKeys"
          :replace-fields="{ title: 'menuName', key: 'menuId' }"
          :auto-expand-parent="autoExpandParent"
          :selected-keys="selectedKeys"
          :tree-data="menuList"
          :selectable="false"
          :check-strictly="checkStrictly"
          @expand="onExpand"
          @check="check"
        >
          <template #title="record">
            <span v-if="record.menuType === 'F'">{{ record.menuName }}(按钮/权限)</span>
            <span v-else>{{ record.menuName }}</span>
          </template>
        </a-tree>
      </template>
    </SearchForm>

    <div class="drawer-bootom-butto">
      <a-dropdown>
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item v-for="item in menuItem" :key="item.key">
            {{ item.label }}
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px;">
          树操作 <a-icon type="up" />
        </a-button>
      </a-dropdown>
      <div>
        <a-button class="g-mr10" @click="onClose">取消</a-button>
        <a-button type="primary" @click="handleSava">保存</a-button>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import SearchForm from '@/components/searchForm'
import { getErpRoleAuth } from '@/api/authManage'
const initFormModel = {
  menus: [],
  roleId: '',
  name: ''
}
export default {
  name: 'RoleAuthDrawer',
  components: {
    SearchForm
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    menuList: {
      type: Array,
      default: () => []
    },
    menuIds: {
      type: Array,
      default: () => []
    },
    actionType: {
      type: String,
      default: 'add'
    },
    // 角色权限集合
    authApi: {
      type: Function,
      default: (params) => getErpRoleAuth(params)
    }
  },
  data() {
    return {
      expandedKeys: [],
      selectedKeys: [],
      halfChecked: [],
      checkedKeys: [],
      autoExpandParent: true,
      checkStrictly: true,
      formModel: {
        ...initFormModel
      }
    }
  },
  computed: {
    menuItem({ menuIds }) {
      return [
        {
          label: '全部勾选',
          key: 0,
          eventName: () => this.setChecked(menuIds)
        },
        {
          label: '取消全选',
          key: 1,
          eventName: () => this.setChecked([])
        },
        {
          label: '展开所有',
          key: 2,
          eventName: () => this.onExpand(menuIds)
        },
        {
          label: '合并所有',
          key: 3,
          eventName: () => this.onExpand([])
        },
        {
          label: '父子关联',
          key: 4,
          eventName: () => this.checkStrictlyChange(false)
        },
        {
          label: '取消关联',
          key: 5,
          eventName: () => this.checkStrictlyChange(true)
        }
      ]
    },
    formItem() {
      return [
        {
          label: '角色名称',
          itemType: 'input',
          required: true,
          key: 'name',
          span: 24
        },
        {
          label: '菜单权限',
          key: 'menus',
          required: true,
          slotName: 'menus',
          span: 24
        }
      ]
    },
    title({ actionType }) {
      if (actionType === 'add') {
        return '新增角色'
      } else {
        return '角色权限编辑'
      }
    }
  },
  watch: {
    value(val) {
      if (val && this.actionType === 'edit') {
        this.getRoleAuth()
      }
    },
    // a-tree组件没有change事件导致Form.Item组件无法劫持值变化
    // 所以menus值改变时手动触发表单域校验
    'formModel.menus'(val) {
      if (!this.value) return
      setTimeout(() => {
        this.$refs.tree.$emit('change', val)
      })
    }
  },
  methods: {
    async getRoleAuth() {
      try {
        const { data } = await this.authApi(this.data.roleId)
        this.setFormModal({ ...this.data, menus: data?.memberMenuId ?? [] })
      } catch (error) {
        console.error(error)
      }
    },
    setFormModal(data = {}) {
      const obj = {}
      for (const key in initFormModel) {
        if (Object.hasOwnProperty.call(initFormModel, key)) {
          const value = data[key]
          obj[key] ??= value
        }
      }
      this.formModel = obj
      this.checkStrictlyChange(this.checkStrictly)
    },
    afterVisibleChange(val) {
      console.log('visible', val)
      if (!val) {
        this.reset()
      }
    },
    onClose() {
      this.$emit('input', false)
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    check(checkedKeys, e) {
      if (!this.checkStrictly) {
        this.halfChecked = e.halfCheckedKeys ?? []
        this.checkedKeys = checkedKeys
        this.formModel.menus = checkedKeys
      } else {
        const { checked } = checkedKeys
        this.checkedKeys = checked
        this.formModel.menus = checked
      }
    },
    setChecked(checkedKeys) {
      this.formModel.menus = checkedKeys
      this.checkedKeys = checkedKeys
    },
    checkStrictlyChange(val) {
      this.checkStrictly = val
      setTimeout(() => {
        this.halfChecked = this.$refs.tree?.$children[0]?._data?._halfCheckedKeys ?? []
        this.checkedKeys = this.$refs.tree?.$children[0]?._data?._checkedKeys ?? []
      })
    },
    handleMenuClick(e) {
      this.menuItem[e.key]?.eventName()
    },
    handleSava() {
      this.$refs.searchForm.validate()
    },
    async submit(val) {
      const params = { ...val, roleId: this.data.roleId }
      params.menus = [...this.halfChecked, ...this.checkedKeys]
      this.$emit('submit', params)
    },
    reset() {
      this.formModel = { ...initFormModel }
      this.halfChecked = []
      this.checkStrictly = true
      this.$refs.searchForm.resetForm()
    }
  }
}
</script>

<style lang="less" scoped>
.drawer-bootom-butto {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
}
/deep/ .ant-drawer-body{
  max-height: calc(100% - 108px);
  overflow: auto;
}
</style>
