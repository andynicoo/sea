<template>
  <a-modal
    :visible="value"
    :title="title"
    :after-close="afterClose"
    :closable="false"
    @ok="$refs.searchForm.validate()"
    @cancel="$emit('input', false)"
  >
    <search-form
      ref="searchForm"
      :form-item="formItem"
      :form-model="formModel"
      @submit="submit"
    />
  </a-modal>
</template>

<script>
import searchForm from '@/components/searchForm'
import { editShop } from '@/api/contentManage'
const initialModel = {
  status: '',
  remark: '',
  id: ''
}
export default {
  components: {
    searchForm
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Boolean,
      default: false
    },
    actionType: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formModel: {

      }
    }
  },
  computed: {
    formItem() {
      return [
        {
          label: '标记',
          key: 'status',
          itemType: 'select',
          span: 24,
          itemData: [
            { value: 1, label: '未联系' },
            { value: 2, label: '已联系' },
            { value: 3, label: '未办理' },
            { value: 4, label: '已办理' },
            { value: 5, label: '已取消' }
          ]
        },
        {
          label: '备注',
          span: 24,
          key: 'remark',
          itemType: 'textarea'
        }
      ]
    }
  },
  watch: {
    value(val) {
      if (val) this.setFormModel()
    }
  },
  methods: {
    setFormModel() {
      if (this.actionType !== 'edit') return
      const obj = {}
      Object.entries(initialModel).forEach(([key]) => {
        obj[key] = this.data[key]
      })
      this.formModel = obj
    },
    afterClose() {
      this.formModel = { ...initialModel }
    },
    async submit(val) {
      try {
        await editShop(val)
        this.$message.success('修改成功')
        this.$emit('input', false)
        this.$emit('ok')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style></style>
