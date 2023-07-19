<template>
  <a-modal
    :visible="value"
    :after-close="afterClose"
    :title="title"
    :mask-closable="false"
    :width="650"
    @ok="ok"
    @cancel="$emit('input', false)"
  >
    <SearchForm
      ref="searchForm"
      :form-model="formModel"
      :form-item="formItem"
      class="auth-form"
      @submit="submit"
    >
      <template #menuType>
        <a-radio-group v-model="formModel.menuType" :options="options" @change="change" />
      </template>
      <template #parentId>
        <a-tree-select
          v-model="formModel.parentId"
          show-search
          placeholder="请选择上级菜单"
          :tree-data="menuSelect"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :replace-fields="{title:'menuName',key:'menuId',value:'menuId'}"
          :filter-tree-node="filterOption"
        />
      </template>
    </SearchForm>
  </a-modal>
</template>

<script>
import SearchForm from '@/components/searchForm'
import { addAlphaAccountMenu, editAlphaAccountMenu } from '@/api/authManage'
import { menuFormItem } from './common'
const initFormModel = {
  menuId: null,
  accSysCode: 'erp',
  sort: 0,
  status: true,
  isShow: true,
  icon: undefined,
  menuName: undefined,
  href: undefined,
  menuCode: undefined,
  menuI18n: undefined,
  menuType: 'C',
  parentId: undefined,
  remark: undefined
}
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
    menuSelect: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formModel: {
        ...initFormModel
      },
      formItemArr: [...menuFormItem.C],
      options: [
        {
          label: '一级菜单',
          value: 'M'
        },
        {
          label: '菜单',
          value: 'C'
        },
        {
          label: '按钮/权限',
          value: 'F'
        }
      ]
    }
  },
  computed: {
    title({ actionType }) {
      return actionType === 'edit' ? '编辑菜单' : '添加菜单'
    },
    formItem({ formItemArr }) {
      return [
        {
          itemType: 'radio',
          label: '菜单类型',
          key: 'menuType',
          span: 24,
          slotName: 'menuType'
        },
        ...formItemArr
      ]
    }
  },
  watch: {
    value(val) {
      if (val) {
        if (this.actionType === 'edit') this.setFormModel()
      }
    }
  },
  methods: {
    setFormModel() {
      const obj = {}
      for (const key in initFormModel) {
        if (Object.hasOwnProperty.call(initFormModel, key)) {
          const value = this.data[key]
          obj[key] ??= value
          if (key === 'isShow') {
            obj[key] = !!value
          }
        }
      }
      this.formModel = obj
      this.formItemArr = menuFormItem[obj.menuType]
    },
    filterOption(input, option) {
      return (
        option.componentOptions.propsData.title
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    ok() {
      this.$refs.searchForm.validate()
    },
    async submit(val) {
      const params = {
        ...val,
        isShow: Number(val.isShow),
        status: Number(val.status)
      }
      try {
        if (this.actionType === 'add') {
          await addAlphaAccountMenu(params)
        } else {
          await editAlphaAccountMenu(params)
        }
        this.$emit('input', false)
        this.$emit('ok')
        this.afterClose()
        this.$message.success(
          `${this.actionType === 'add' ? '添加' : '编辑'}成功`
        )
      } catch (error) {
        console.error(error)
      }
    },
    change(e) {
      const value = e.target.value
      // 菜单类型切换的时候
      if (value === 'M') {
        this.formModel.parentId = 0
      } else {
        this.formModel.parentId = this.data.parentId
      }
      // 如果是由一级菜单切成别的parentid初始化
      if (this.data.menuType === 'M' && value !== 'M') {
        this.formModel.parentId = undefined
      }
      this.formItemArr = menuFormItem[value]
    },
    afterClose() {
      this.formModel = { ...initFormModel }
      this.$refs.searchForm.resetForm()
    }
  }
}
</script>

<style lang="less" scoped>
.auth-form {
  /deep/.ant-form-item-label {
    min-width: 122px;
  }
}
.type-radio{
  display: flex;
  justify-content: center;
}
</style>
