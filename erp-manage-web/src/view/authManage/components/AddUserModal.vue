<template>
  <a-modal
    :visible="value"
    :after-close="afterClose"
    :title="title"
    :mask-closable="false"
    @ok="ok"
    @cancel="$emit('input', false)"
  >
    <SearchForm
      ref="searchForm"
      :form-model="formModel"
      :form-item="formItem"
      form-class="user-form"
      @submit="submit"
    >
      <template #maAccount="{record}">
        <a-input v-model="formModel.maAccount" v-bind="record.itemProp" placeholder="请输入账号(手机号)">
          <a-tooltip slot="suffix" title="只有注册马六甲ERP的账号才可以添加为管理人员,密码为ERP的登录密码,如果管理人员修改密码请在ERP操作.">
            <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
          </a-tooltip>
        </a-input>
      </template>
    </SearchForm>
  </a-modal>
</template>

<script>
import SearchForm from '@/components/searchForm'
import { userAdd, userEdit } from '@/api/authManage'
export default {
  name: 'AdduserModal',
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
    actionType: {
      type: String,
      default: 'edit'
    },
    activeKey: {
      type: [String, Number],
      default: ''
    },
    roleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formModel: {
      }
    }
  },
  computed: {
    title({ actionType }) {
      return actionType === 'edit' ? '编辑成员' : '添加成员'
    },
    formItem({ actionType, roleList }) {
      return [
        {
          itemType: 'input',
          key: 'maName',
          label: '真实姓名',
          required: true,
          span: 24
        },
        {
          itemType: 'input',
          key: 'maAccount',
          label: '账号',
          required: true,
          itemProp: {
            disabled: actionType === 'edit'
          },
          slotName: 'maAccount',
          span: 24,
          rules: [
            {
              required: true,
              message: '请输入账号(手机号)'
            },
            {
              pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
              message: '请输入正确的手机号'
            }
          ]
        },
        {
          itemType: 'select',
          key: 'roleIdList',
          label: '角色',
          required: true,
          itemData: roleList,
          itemProp: {
            mode: 'multiple'
          },
          span: 24
        }
      ]
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.setFormModel()
      }
    }
  },
  methods: {
    setFormModel() {
      const { maName, maId, maAccount, roleIdList } = this.data || {}
      this.formModel = {
        maName,
        // roleId,
        maId,
        maAccount,
        roleIdList: roleIdList && roleIdList.split(',').map(item => Number(item)) || undefined
      }
    },
    ok() {
      this.$refs.searchForm.validate()
    },
    async submit(val) {
      const params = {
        ...val
      }
      try {
        if (this.actionType === 'add') {
          await userAdd(params)
        } else {
          await userEdit(params)
        }
        this.$emit('input', false)
        this.$emit('ok')
        this.afterClose()
        this.$message.success(`${this.actionType === 'add' ? '添加' : '编辑'}成功`)
      } catch (error) {
        console.error(error)
      }
    },
    afterClose() {
      this.formModel = {}
      this.$refs.searchForm.resetForm()
    }
  }
}
</script>

<style lang="less" scoped>
.user-form {
 /deep/.ant-form-item-label {
    min-width: 80px;
  }
}
</style>
