<template>
  <div class="tabs">
    <div class="title">{{ title }}</div>
    <div class="tabs-container">
      <div
        v-for="item in tabsList"
        :key="item.key"
        class="tabs-item"
        :class="{ 'tabs-item-active': item.key === value }"
        @click="handleClick(item)"
      >
        <slot :name="item.slotName" :record="item">
          <div v-if="!item.render" class="tabs-item-text">
            <div v-if="!item.edit" class="text-wrapper">
              <div class="ellipsis title-text" :title="item.title">{{ item.title }}</div>
              <a-popover v-if="item.roleId !== 4" placement="bottom">
                <template #content>
                  <div class="g-cup" @click="handleRename(item)">重命名</div>
                  <div class="g-cup" @click="handleDelete(item)">删除</div>
                </template>
                <a-icon v-if="item.key === value" type="more" />
              </a-popover>
            </div>
            <div v-else class="rename-input">
              <a-input
                v-model="name"
                v-focus
                placeholder="输入名称按回车确认"
                @pressEnter="()=>pressEnter('name','edit')"
                @input="(e)=>$emit('update:roleName',e.target.value)"
              />
              <div>
                <a-button type="link" @click="pressEnter(name,'edit')">确定</a-button>
                <a-button type="link" @click="hanldeCancel(item,'edit')">取消</a-button>
              </div>
            </div>
          </div>
          <RenderExpand
            v-if="item.render"
            :render="item.render"
            :record="item"
          />
        </slot>
      </div>
      <div class="tabs-item">
        <span v-if="!action" @click="handleAdd">
          <a-icon type="plus" />
          <span class="action-button add-user">添加用户组</span>
        </span>
        <div v-if="action==='add'" class="rename-input">
          <a-input
            v-model="name"
            v-focus
            :max-length="7"
            placeholder="输入名称按回车确认"
            @pressEnter="(e)=>pressEnter(name,'add')"
            @input="(e)=>$emit('update:roleName',e.target.value)"
          />
          <div>
            <a-button type="link" @click="pressEnter(name,'add')">确定</a-button>
            <a-button type="link" @click="hanldeCancel(undefined,'add')">取消</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RenderExpand from '@/components/render'
import { roleAdd, roleEdit, deleteRole } from '@/api/authManage'
import { mapGetters } from 'vuex'
export default {
  name: 'Tabs',
  components: {
    RenderExpand
  },
  props: {
    value: {
      type: [String, Number],
      default: undefined
    },
    title: {
      type: String,
      default: '用户组'
    },
    tabsList: {
      type: Array,
      default: () => []
    },
    edit: {
      type: Boolean,
      defautl: false
    },
    checkedKeys: {
      type: Array,
      default: () => ([])
    },
    activeKey: {
      type: [String, Number],
      default: ''
    },
    roleName: {
      type: String,
      default: ''
    }

  },
  data() {
    return {
      action: null,
      name: ''
    }
  },
  computed: {
    ...mapGetters({
      superAdmin: 'superAdmin'
    })
  },
  methods: {
    handleClick(item) {
      if (item.key !== this.value) {
        this.$emit('input', item.key)
        this.$emit('change', item)
      }
    },
    handleRename(item) {
      this.action = 'edit'
      this.$set(item, 'edit', true)
      this.name = item.title
    },
    handleAdd() {
      this.action = 'add'
      this.$emit('reset')
      this.$emit('update:activeKey', this.name)
      this.$emit('update:roleName', this.name)
    },
    handleDelete(item) {
      this.$confirm({
        title: '提示',
        content: '确认删除当前角色吗?',
        onOk: async() => {
          try {
            await deleteRole(this.value)
            this.$message.success('删除角色成功')
            this.$emit('update:activeKey', '')
            this.$emit('ok')
          } catch (error) {
            console.error(error)
          }
        }
      })
    },
    hanldeCancel(item, key) {
      if (key === 'edit')item.edit = false
      this.$emit('cancel')
      this.reset()
    },
    async pressEnter(val, key) {
      if (!val) {
        this.$message.warn('名称不能为空')
        return
      }
      if (!this.checkedKeys.length) {
        this.$message.warn('最少选择一个菜单')
        return
      }
      const params = {
        name: this.name || val,
        menus: this.checkedKeys,
        roleId: this.value || undefined,
        accSysCode: 'mg'
      }
      try {
        if (this.action === 'add') {
          await roleAdd(params)
        } else {
          await roleEdit(params)
        }
        this.$message.success(`${this.action === 'add' ? '添加' : '编辑'}成功`)
        this.$emit('ok', this.action)
        this.reset()
      } catch (error) {
        console.error(error)
      }
    },
    reset() {
      this.action = null
      this.name = ''
      // this.$emit('reset')
    }
  }
}
</script>

<style lang="less" scoped>
.tabs {
  padding-right: 3px;
  .tabs-container {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      height: 100%;
      background-color: #e5e5e5;
      right: 0;
      width: 1px;
      top: 0;
    }
  }
  .title {
    font-size: 17px;
    font-weight: 700;
  }
  .tabs-item {
    line-height: 40px;
    padding-right: 8px;
    cursor: pointer;
    &-active {
      position: relative;
      .title-text {
        color: @primary-color;
      }
      &::after {
        content: "";
        height: 60%;
        position: absolute;
        width: 2px;
        top: 15%;
        right: 3px;
        background-color: @primary-color;
      }
    }
  }
  .tabs-item-text {
    .text-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    // .icon-more{
    //   display: none;
    // }
    // &:hover{
    //   .icon-show{
    //     display: inline-block;
    //   }
    // }
  }
  /deep/.action{
    cursor: pointer;
  }
  .add-user {
    color: #1275d5;
    margin-left: 5px;
  }
}
</style>
