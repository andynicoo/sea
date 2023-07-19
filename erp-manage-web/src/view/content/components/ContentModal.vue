<template>
  <a-modal
    :visible="value"
    :after-close="afterClose"
    :closable="false"
    @ok="ok"
    @cancel="$emit('input',false)"
  >
    <SearchForm
      ref="searchForm"
      :form-item="formItem"
      :form-model="formModel"
      @submit="submit"
    />
  </a-modal>

</template>

<script>
import SearchForm from '@/components/searchForm'
import { putContent, addContent } from '@/api/contentManage'
const initFormModel = {
  title: '',
  qaId: '',
  content: '',
  sort: ''
}
export default {
  components: {
    SearchForm
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    actionType: {
      type: String,
      default: 'edit'
    },
    currentObj: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formModel: {
        ...initFormModel
      }
    }
  },
  computed: {
    formItem() {
      return [
        {
          itemType: 'input',
          key: 'title',
          label: '标题',
          required: true,
          span: 24
        },
        {
          itemType: 'number',
          key: 'sort',
          label: '排序',
          itemProp: {
            style: { width: '200px' }
          },
          span: 24
        },
        {
          itemType: 'textarea',
          key: 'content',
          label: '内容',
          required: true,
          span: 24
        }
      ]
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) this.setFormModel()
      }
    }
  },
  methods: {
    async ok() {
      this.$refs.searchForm.validate()
    },
    setFormModel() {
      const val = this.currentObj
      const obj = {}
      if (this.actionType === 'edit') {
        Object.entries(this.formModel).forEach(([key, value]) => {
          obj[key] = val[key]
        })
        this.formModel = obj
      }
    },
    afterClose() {
      this.formModel = { ...initFormModel }
      this.$refs.searchForm.resetForm()
    },
    async submit(val) {
      console.log(val)
      try {
        if (this.actionType === 'add') {
          await addContent(val)
        } else {
          await putContent(val)
        }
        this.$emit('input', false)
        this.$emit('ok')
        this.$message.success(`${this.actionType === 'add' ? '新增' : '修改'}成功`)
      } catch (error) {
        console.error(error)
      }
    }

  }

}
</script>

<style>

</style>
