<template>
  <a-modal
    :visible="value"
    title="编辑源码"
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
import { failEdit } from '@/api/contentManage'
const initFormModel = {
  errorReasons: '',
  errorReasonsCn: '',
  shopeeErrorMessageId: null
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
    data: {
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
          key: 'errorReasons',
          label: '失败源码',
          span: 24,
          itemProp: {
            disabled: true
          }
        },
        {
          itemType: 'input',
          key: 'errorReasonsCn',
          label: '翻译',
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
      const val = this.data
      const obj = {}
      Object.entries(this.formModel).forEach(([key, value]) => {
        obj[key] = val[key]
      })
      this.formModel = obj
    },
    afterClose() {
      this.formModel = { ...initFormModel }
    },
    async submit(val) {
      try {
        await failEdit(val)
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

<style>

</style>
